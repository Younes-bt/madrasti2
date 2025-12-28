# lessons/management/commands/import_lessons.py

import json
import re
import os
from pathlib import Path
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone
from lessons.models import Lesson, LessonResource
from schools.models import Grade, Track, Subject
from homework.models import (
    Exercise, Question, QuestionChoice, 
    FillBlank, FillBlankOption, 
    OrderingItem, MatchingPair, 
    ExerciseReward
)

class Command(BaseCommand):
    help = 'Import lessons from converted JSON files (Lycée and Collège)'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.error_log = []  # Track all errors with details

    def add_arguments(self, parser):
        parser.add_argument(
            'root_path',
            type=str,
            help='Root path to converted_content folder'
        )
        parser.add_argument(
            '--created-by',
            type=int,
            help='User ID of the creator (optional)',
            default=None
        )
        parser.add_argument(
            '--limit',
            type=int,
            help='Limit number of lessons to import (for testing)',
            default=None
        )
        parser.add_argument(
            '--skip-existing',
            action='store_true',
            help='Skip lessons that already exist',
            default=False
        )

    def handle(self, *args, **options):
        root_path = Path(options['root_path'])
        created_by_id = options.get('created_by')
        limit = options.get('limit')
        skip_existing = options.get('skip_existing', False)
        
        if not root_path.exists():
            self.stdout.write(self.style.ERROR(f'Path does not exist: {root_path}'))
            return

        self.stdout.write(self.style.SUCCESS(f'Starting import from: {root_path}'))
        
        stats = {
            'lessons_created': 0,
            'lessons_skipped': 0,
            'resources_created': 0,
            'exercises_created': 0,
            'questions_created': 0,
            'errors': []
        }

        # Walk through directory structure
        for grade_path in sorted(root_path.iterdir()):
            if not grade_path.is_dir(): continue
            
            grade_code = grade_path.name
            self.stdout.write(f'\n📚 Processing Grade: {grade_code}')

            for track_path in sorted(grade_path.iterdir()):
                if not track_path.is_dir(): continue
                track_code = track_path.name

                for subject_path in sorted(track_path.iterdir()):
                    if not subject_path.is_dir(): continue
                    subject_code = subject_path.name

                    for lesson_path in sorted(subject_path.iterdir()):
                        if not lesson_path.is_dir(): continue
                        
                        if limit and stats['lessons_created'] >= limit:
                            self.stdout.write(self.style.WARNING(f'\n⚠️  Limit reached.'))
                            self._print_summary(stats)
                            return
                            
                        try:
                            # Use atomic transaction per lesson to prevent partial imports
                            with transaction.atomic():
                                self._import_lesson(
                                    lesson_path, grade_code, track_code, 
                                    subject_code, created_by_id, skip_existing, stats
                                )
                        except Exception as e:
                            error_msg = f'Error in lesson {lesson_path.name}: {str(e)}'
                            self.stdout.write(self.style.ERROR(f'      ❌ {error_msg}'))
                            stats['errors'].append(error_msg)
                            
                            # Log detailed error info
                            self.error_log.append({
                                'lesson_path': str(lesson_path),
                                'grade': grade_code,
                                'track': track_code,
                                'subject': subject_code,
                                'error': str(e),
                                'error_type': type(e).__name__
                            })

        self._print_summary(stats)

    def _import_lesson(self, lesson_path, grade_code, track_code, subject_code, created_by_id, skip_existing, stats):
        
        # 1. Load Files (Content & Exercises)
        content_path = lesson_path / 'lesson_content.json'
        
        # Prefer the _2 version (Fixed by AI)
        exercises_path_v2 = lesson_path / 'lesson_exercises_2.json'
        exercises_path_v1 = lesson_path / 'lesson_exercises.json'
        exercises_path = exercises_path_v2 if exercises_path_v2.exists() else exercises_path_v1
        
        metadata_path = lesson_path / 'metadata.json'
        image_coords_path = lesson_path / 'image_coordinates.json'
        images_generated_path = lesson_path / 'images_generated'
        image_id_mapping_path = lesson_path / 'image_id_mapping.json'

        if not content_path.exists():
            raise FileNotFoundError(f'lesson_content.json not found in {lesson_path}')

        with open(content_path, 'r', encoding='utf-8') as f:
            lesson_content = json.load(f)

        lesson_exercises = None
        if exercises_path.exists():
            with open(exercises_path, 'r', encoding='utf-8') as f:
                lesson_exercises = json.load(f)

        image_coords = []
        if image_coords_path.exists():
            with open(image_coords_path, 'r', encoding='utf-8') as f:
                image_coords = json.load(f)

        image_id_mapping = {}
        if image_id_mapping_path.exists():
            with open(image_id_mapping_path, 'r', encoding='utf-8') as f:
                image_id_mapping = json.load(f)

        # 2. Get/Create Lesson
        try:
            grade = Grade.objects.get(code=grade_code)
            subject = Subject.objects.get(code=subject_code)
        except (Grade.DoesNotExist, Subject.DoesNotExist) as e:
            raise ValueError(f"Database lookup failed: {e}")

        meta = lesson_content.get('metadata', {})
        title = meta.get('title', lesson_path.name)

        if skip_existing:
            if Lesson.objects.filter(subject=subject, grade=grade, title=title).exists():
                stats['lessons_skipped'] += 1
                self.stdout.write(self.style.WARNING(f'      ⏭️  Skipped: {title[:30]}...'))
                return

        # Handle Tracks
        track_codes = track_code.split('_')
        tracks = Track.objects.filter(code__in=track_codes)

        lesson = Lesson.objects.create(
            subject=subject,
            grade=grade,
            title=title,
            title_arabic=title, # Assuming PDF language match
            description=', '.join(meta.get('keywords', [])),
            cycle='first', # Default, logic needed if available
            order=Lesson.objects.filter(subject=subject, grade=grade).count() + 1,
            created_by_id=created_by_id
        )
        lesson.tracks.set(tracks)
        stats['lessons_created'] += 1

        # 3. Create Resource (Correct Content Import Logic)
        try:
            blocks_content = self._build_blocks_content(
                lesson_content=lesson_content,
                image_coords=image_coords,
                image_id_mapping=image_id_mapping,
                images_generated_path=images_generated_path
            )

            LessonResource.objects.create(
                lesson=lesson,
                title=f"محتوى الدرس - {title}",
                resource_type='blocks',
                blocks_content=blocks_content,
                content_version=1,
                is_visible_to_students=True,
                uploaded_by_id=created_by_id
            )
            stats['resources_created'] += 1
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'        ⚠️ Resource Error: {str(e)}'))

        # 4. Create Exercises (The Improved Part)
        if lesson_exercises and 'exercises' in lesson_exercises:
            self._create_exercises(lesson, lesson_exercises['exercises'], created_by_id, stats, image_id_mapping, images_generated_path)

    # ==========================================
    # CONTENT BUILDING METHODS (From Original)
    # ==========================================

    def _build_blocks_content(self, lesson_content, image_coords, image_id_mapping, images_generated_path):
        """Build blocks_content JSON from lesson sections with semantic types"""
        blocks = []
        block_counter = 1
        image_map = {img['id']: img for img in image_coords} if isinstance(image_coords, list) else {}

        sections = lesson_content.get('sections', [])
        if not isinstance(sections, list): sections = []
        
        for section in sections:
            if not isinstance(section, dict): continue
                
            section_type = section.get('type', 'paragraph')
            section_title = section.get('title', '')
            section_content = section.get('content', {})
            section_text = section_content.get('text', '') or ''
            visual_aid = section_content.get('visual_aid', '') or ''
            
            semantic_type = self._detect_semantic_type(section_type, section_title, section_text)
            
            if section_title:
                blocks.append({
                    'id': f'block_{block_counter}',
                    'type': 'heading',
                    'level': 2,
                    'content': {'text': section_title, 'section_type': section_type}
                })
                block_counter += 1

            combined_text = section_text
            if visual_aid and '{{IMAGE:' in visual_aid and visual_aid not in section_text:
                combined_text = section_text + '\n' + visual_aid

            text_parts = combined_text.split('{{IMAGE:')
            
            if text_parts[0].strip():
                blocks.extend(self._parse_text_to_blocks(text_parts[0], block_counter, semantic_type))
                block_counter += len([b for b in blocks if b['id'].startswith(f'block_{block_counter}')])

            for i in range(1, len(text_parts)):
                part = text_parts[i]
                if '}}' in part:
                    img_id, remaining_text = part.split('}}', 1)
                    img_id = img_id.strip()
                    
                    if img_id in image_id_mapping or img_id in image_map:
                        img_info = image_map.get(img_id, {})
                        image_block = self._create_image_block(
                            img_id, img_info, image_id_mapping, images_generated_path, f'block_{block_counter}'
                        )
                        if image_block:
                            blocks.append(image_block)
                            block_counter += 1
                    
                    if remaining_text.strip():
                        blocks.extend(self._parse_text_to_blocks(remaining_text, block_counter, semantic_type))
                        block_counter += len([b for b in blocks if b['id'].startswith(f'block_{block_counter}')])

        # *** ADD SUMMARY SECTION (This was missing!) ***
        summary = lesson_content.get('summary')
        if summary and isinstance(summary, dict):
            # Add summary heading
            blocks.append({
                'id': f'block_{block_counter}',
                'type': 'heading',
                'level': 2,
                'content': {'text': 'ملخص الدرس', 'section_type': 'summary'}
            })
            block_counter += 1
            
            # Add key points
            key_points = summary.get('key_points', [])
            if key_points and isinstance(key_points, list):
                key_points_text = '\n'.join([f'• {point}' for point in key_points])
                blocks.append({
                    'id': f'block_{block_counter}',
                    'type': 'paragraph',
                    'content': {'text': f"**النقاط الرئيسية:**\n{key_points_text}"}
                })
                block_counter += 1
            
            # Add formulas
            formulas = summary.get('formulas', [])
            if formulas and isinstance(formulas, list):
                formulas_text = '\n'.join([f'• {formula}' for formula in formulas])
                blocks.append({
                    'id': f'block_{block_counter}',
                    'type': 'paragraph',
                    'content': {'text': f"**المعادلات الأساسية:**\n{formulas_text}"}
                })
                block_counter += 1
        
        return {'blocks': blocks}

    def _detect_semantic_type(self, section_type, title, text):
        title_lower = (title or '').lower()
        text_lower = (text or '').lower()
        sec_type = (section_type or '').lower()
        
        if any(k in title_lower for k in ['مقدمة', 'introduction', 'تمهيد']): return 'introduction'
        if any(k in title_lower for k in ['تعريف', 'definition', 'مفهوم']): return 'definition'
        if any(k in title_lower for k in ['مثال', 'example', 'تطبيق']): return 'example'
        if any(k in title_lower for k in ['نظرية', 'theorem', 'خاصية', 'قانون']): return 'theorem'
        
        return None

    def _parse_text_to_blocks(self, text, start_counter, semantic_type=None):
        blocks = []
        counter = start_counter
        paragraphs = [p.strip() for p in text.split('\n') if p.strip()]
        
        for para in paragraphs:
            if para.startswith('$$') and para.endswith('$$'):
                blocks.append({
                    'id': f'block_{counter}',
                    'type': 'math',
                    'content': {'latex': para[2:-2].strip(), 'display_mode': 'block'}
                })
            else:
                block = {
                    'id': f'block_{counter}',
                    'type': 'paragraph',
                    'content': {'text': para}
                }
                if semantic_type:
                    block['properties'] = {'semanticType': semantic_type}
                blocks.append(block)
            counter += 1
        return blocks

    def _create_image_block(self, img_id, img_info, image_id_mapping, images_generated_path, block_id):
        if not images_generated_path or not images_generated_path.exists(): return None
        
        filename = f'{img_id}.svg'
        if isinstance(image_id_mapping, dict) and img_id in image_id_mapping:
            mapping = image_id_mapping[img_id]
            filename = mapping.get('filename', filename) if isinstance(mapping, dict) else mapping

        # Failsafe for raster images
        if filename.lower().endswith(('.jpg', '.png', '.jpeg')): filename = f'{img_id}.svg'

        file_path = images_generated_path / filename
        
        # Fallback SVG <-> HTML
        if not file_path.exists():
            if filename.endswith('.svg'): file_path = images_generated_path / filename.replace('.svg', '.html')
            elif filename.endswith('.html'): file_path = images_generated_path / filename.replace('.html', '.svg')
        
        if not file_path.exists(): return None

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            is_svg = file_path.suffix == '.svg'
            return {
                'id': block_id,
                'type': 'image' if is_svg else 'table',
                'content': {
                    'format': 'svg' if is_svg else 'html',
                    'data': content if is_svg else None,
                    'html': content if not is_svg else None,
                    'alt_text': img_info.get('alt_text', ''),
                    'description': img_info.get('description', '')
                }
            }
        except Exception:
            return None

    # ==========================================
    # EXERCISE CREATION METHODS (New Logic)
    # ==========================================

    def _create_exercises(self, lesson, exercises_data, created_by_id, stats, image_id_mapping, images_generated_path):
        
        for ex_data in exercises_data:
            # Resolve placeholders in instructions
            instructions = ex_data.get('instructions', '')
            if image_id_mapping and images_generated_path:
                instructions = self._resolve_placeholders_in_text(instructions, image_id_mapping, images_generated_path)
            
            exercise = Exercise.objects.create(
                lesson=lesson,
                title=ex_data.get('title', 'Exercise'),
                instructions=instructions,
                difficulty_level=ex_data.get('difficulty', 'medium'),
                order=ex_data.get('order', 1),
                total_points=5.0, # Default, will recalculate
                created_by_id=created_by_id
            )
            
            # Create Rewards Config
            ExerciseReward.objects.create(exercise=exercise)
            stats['exercises_created'] += 1

            questions_data = ex_data.get('questions', [])
            total_points = 0

            for q_idx, q_data in enumerate(questions_data, 1):
                try:
                    # Resolve placeholders in question data
                    if image_id_mapping and images_generated_path:
                        q_data = self._resolve_question_placeholders(q_data, image_id_mapping, images_generated_path)
                    self._create_single_question(exercise, q_data, q_idx)
                    stats['questions_created'] += 1
                    total_points += float(q_data.get('points', 1))
                except Exception as e:
                    q_id = q_data.get('question_id', f'q{q_idx}')
                    q_type = q_data.get('type', 'unknown')
                    self.stdout.write(self.style.WARNING(f'        ⚠️ Question Error ({q_id} - {q_type}): {str(e)}'))
                    
                    # Log detailed question error
                    try:
                        path_str = str(lesson_path) if lesson_path else 'unknown'
                    except:
                        path_str = 'unknown'
                    
                    self.error_log.append({
                        'lesson_path': path_str,
                        'exercise_id': ex_data.get('exercise_id', 'unknown'),
                        'question_id': q_id,
                        'question_type': q_type,
                        'error': str(e),
                        'error_type': type(e).__name__,
                        'question_data': str(q_data)[:500]  # First 500 chars of data
                    })

            # Update total points
            exercise.total_points = total_points
            exercise.save()

    def _create_single_question(self, exercise, q_data, order):
        q_type_map = {
            'multiple_choice_single': 'qcm_single',
            'multiple_choice_multiple': 'qcm_multiple',
            'qcm_single': 'qcm_single',
            'qcm_multiple': 'qcm_multiple',
            'true_false': 'true_false',
            'fill_in_blanks': 'fill_blank',
            'fill_blank': 'fill_blank',
            'ordering': 'ordering',
            'matching': 'matching',
            'short_answer': 'open_short',
            'long_answer': 'open_long'
        }

        raw_type = q_data.get('type', 'open_short')
        db_type = q_type_map.get(raw_type, 'open_short')

        question = Question.objects.create(
            exercise=exercise,
            question_type=db_type,
            question_text=q_data.get('question_text', ''),
            explanation=q_data.get('explanation', ''),
            points=q_data.get('points', 1.0),
            order=order
        )

        # 1. Multiple Choice & True/False
        if db_type in ['qcm_single', 'qcm_multiple', 'true_false']:
            choices = q_data.get('choices', [])
            
            # Handle old format: true_false with just is_correct field (no choices array)
            if db_type == 'true_false' and not choices:
                is_correct = q_data.get('is_correct', False)
                # Create True/False choices
                QuestionChoice.objects.create(
                    question=question,
                    choice_text='صحيح',
                    is_correct=is_correct,
                    order=1
                )
                QuestionChoice.objects.create(
                    question=question,
                    choice_text='خطأ',
                    is_correct=not is_correct,
                    order=2
                )
            else:
                # Standard format with choices array
                for idx, ch in enumerate(choices, 1):
                    if isinstance(ch, dict):
                        text = ch.get('text', '')
                        is_correct = ch.get('is_correct', False)
                    else:
                        text = str(ch)
                        is_correct = False 

                    QuestionChoice.objects.create(
                        question=question,
                        choice_text=text[:500],
                        is_correct=is_correct,
                        order=idx
                    )

        # 2. Fill in Blanks
        elif db_type == 'fill_blank':
            blanks = q_data.get('blanks', [])
            
            # Ensure blanks is a list
            if not isinstance(blanks, list):
                blanks = []
            
            if not blanks and 'choices' in q_data:
                 blanks = [{'order': i, 'options': [{'text': c, 'is_correct': True}]} for i, c in enumerate(q_data['choices'], 1)]

            for b_idx, blank_data in enumerate(blanks, 1):
                if not isinstance(blank_data, dict): 
                    continue

                blank = FillBlank.objects.create(
                    question=question,
                    order=blank_data.get('order', b_idx)
                )
                
                # Check for old format: blanks[].answer instead of blanks[].options[]
                if 'answer' in blank_data and 'options' not in blank_data:
                    # Old format with direct answer
                    answer_text = blank_data.get('answer', '')
                    FillBlankOption.objects.create(
                        blank=blank,
                        option_text=answer_text[:800],
                        is_correct=True,
                        order=1
                    )
                else:
                    # Standard format with options array
                    options = blank_data.get('options', [])
                    for o_idx, opt in enumerate(options, 1):
                        if isinstance(opt, dict):
                            txt = opt.get('text', '')
                            is_cor = opt.get('is_correct', False)
                        else:
                            txt = str(opt)
                            is_cor = False
                            
                        FillBlankOption.objects.create(
                            blank=blank,
                            option_text=txt[:800],
                            is_correct=is_cor,
                            order=o_idx
                        )

        # 3. Matching
        elif db_type == 'matching':
            matches = q_data.get('matches', [])
            if not matches and 'choices' in q_data:
                matches = q_data['choices']

            for m_idx, match in enumerate(matches, 1):
                left_text = ""
                right_text = ""

                if isinstance(match, dict):
                    # Standard format with 'left' and 'right'
                    if 'left' in match:
                        left_text = match.get('left', '')
                        right_text = match.get('right', '')
                    # Alternative format with 'term' and 'definition'
                    elif 'term' in match:
                        left_text = match.get('term', '')
                        right_text = match.get('definition', '')
                    else:
                        # Fallback to any available keys
                        left_text = str(match)
                        right_text = "..."
                elif isinstance(match, str) and ':' in match:
                    parts = match.split(':', 1)
                    left_text = parts[0].strip()
                    right_text = parts[1].strip()
                else:
                    left_text = str(match)
                    right_text = "..."

                MatchingPair.objects.create(
                    question=question,
                    left_text=left_text[:800],
                    right_text=right_text[:800],
                    order=m_idx
                )

        # 4. Ordering
        elif db_type == 'ordering':
            items = q_data.get('ordering_items', [])
            
            # Format 1: "items" + "correct_order" (new collège format)
            if not items and 'items' in q_data and 'correct_order' in q_data:
                items_list = q_data.get('items', [])
                correct_order = q_data.get('correct_order', [])
                
                # Create a mapping of item_id to position
                id_to_position = {item_id: idx + 1 for idx, item_id in enumerate(correct_order)}
                
                for item in items_list:
                    if isinstance(item, dict):
                        item_id = item.get('id', '')
                        text = item.get('text', '')
                        position = id_to_position.get(item_id, 1)
                        
                        OrderingItem.objects.create(
                            question=question,
                            text=text[:800],
                            correct_position=position
                        )
            
            # Format 2: "order" array with position strings (old collège format)
            elif not items and 'order' in q_data:
                order_sequence = q_data.get('order', [])
                
                for idx, position_str in enumerate(order_sequence, 1):
                    try:
                        correct_pos = int(position_str)
                        OrderingItem.objects.create(
                            question=question,
                            text=f"الخطوة {position_str}",
                            correct_position=correct_pos
                        )
                    except (ValueError, TypeError):
                        pass
            
            # Format 3: fallback to choices
            elif not items and 'choices' in q_data:
                items = q_data['choices']

            # Format 4: Standard "ordering_items" array (lycée format)
            if items:
                for idx, item in enumerate(items, 1):
                    if isinstance(item, dict):
                        text = item.get('text', '')
                        pos = item.get('position', idx)
                    else:
                        text = str(item)
                        pos = idx

                    OrderingItem.objects.create(
                        question=question,
                        text=text[:800],
                        correct_position=pos
                    )


    # ==========================================
    # PLACEHOLDER RESOLUTION HELPERS
    # ==========================================
    
    def _resolve_placeholders_in_text(self, text, image_id_mapping, images_generated_path):
        """Replace {{IMAGE:img_X}} placeholders with actual SVG/HTML content"""
        if not isinstance(text, str):
            return text
            
        def replacer(match):
            img_id = match.group(1)
            img_info = image_id_mapping.get(img_id) if isinstance(image_id_mapping, dict) else None
            if not img_info:
                return match.group(0)
            
            filename = img_info.get('filename', f'{img_id}.svg') if isinstance(img_info, dict) else f'{img_id}.svg'
            if filename.lower().endswith(('.jpg', '.png', '.jpeg')):
                filename = f'{img_id}.svg'
            
            if not images_generated_path or not images_generated_path.exists():
                return match.group(0)
            
            file_path = images_generated_path / filename
            if not file_path.exists():
                if filename.endswith('.svg'):
                    file_path = images_generated_path / filename.replace('.svg', '.html')
                elif filename.endswith('.html'):
                    file_path = images_generated_path / filename.replace('.html', '.svg')
            
            if not file_path.exists():
                return match.group(0)
            
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    return f.read()
            except Exception:
                return match.group(0)
        
        return re.sub(r'{{IMAGE:(img_\d+)}}', replacer, text)

    def _resolve_question_placeholders(self, q_data, image_id_mapping, images_generated_path):
        """Resolve placeholders recursively in question data"""
        if not isinstance(q_data, dict):
            return q_data
        
        resolved = {}
        for key, value in q_data.items():
            try:
                if isinstance(value, str):
                    resolved[key] = self._resolve_placeholders_in_text(value, image_id_mapping, images_generated_path)
                elif isinstance(value, list):
                    resolved[key] = self._resolve_list_placeholders(value, image_id_mapping, images_generated_path)
                elif isinstance(value, dict):
                    resolved[key] = self._resolve_question_placeholders(value, image_id_mapping, images_generated_path)
                else:
                    resolved[key] = value
            except Exception as e:
                # If resolution fails, keep original value
                resolved[key] = value
        return resolved

    def _resolve_list_placeholders(self, items, image_id_mapping, images_generated_path):
        """Resolve placeholders in list items"""
        if not isinstance(items, list):
            return items
        
        resolved = []
        for item in items:
            if isinstance(item, str):
                resolved.append(self._resolve_placeholders_in_text(item, image_id_mapping, images_generated_path))
            elif isinstance(item, dict):
                resolved.append(self._resolve_question_placeholders(item, image_id_mapping, images_generated_path))
            else:
                resolved.append(item)
        return resolved

    def _print_summary(self, stats):
        self.stdout.write('\n' + '='*50)
        self.stdout.write(f"✅ Lessons:   {stats['lessons_created']}")
        self.stdout.write(f"✅ Resources: {stats['resources_created']}")
        self.stdout.write(f"✅ Exercises: {stats['exercises_created']}")
        self.stdout.write(f"✅ Questions: {stats['questions_created']}")
        if stats['errors']:
            self.stdout.write(self.style.ERROR(f"❌ Errors:    {len(stats['errors'])}"))
        self.stdout.write('='*50 + '\n')