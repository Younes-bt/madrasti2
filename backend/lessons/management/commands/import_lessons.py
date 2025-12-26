# lessons/management/commands/import_lessons.py

import json
import os
from pathlib import Path
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone
from lessons.models import Lesson, LessonResource
from schools.models import Grade, Track, Subject
from homework.models import Exercise, Question


class Command(BaseCommand):
    help = 'Import lessons from converted JSON files (Lycée and Collège)'

    def add_arguments(self, parser):
        parser.add_argument(
            'root_path',
            type=str,
            help='Root path to converted_content folder (e.g., /path/to/Alloschool_content_final/converted_content/)'
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
            help='Skip lessons that already exist (check by title + subject + grade)',
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
        if limit:
            self.stdout.write(self.style.WARNING(f'⚠️  TEST MODE: Limiting to {limit} lessons'))
        if skip_existing:
            self.stdout.write(self.style.WARNING(f'⚠️  SKIP MODE: Skipping existing lessons'))
        
        # Statistics
        stats = {
            'lessons_created': 0,
            'lessons_skipped': 0,
            'resources_created': 0,
            'exercises_created': 0,
            'questions_created': 0,
            'errors': []
        }

        # Walk through directory structure: Level → Grade → Track → Subject → Lesson
        for grade_path in sorted(root_path.iterdir()):
            if not grade_path.is_dir():
                continue
                
            grade_code = grade_path.name
            self.stdout.write(f'\n📚 Processing Grade: {grade_code}')

            for track_path in sorted(grade_path.iterdir()):
                if not track_path.is_dir():
                    continue
                    
                track_code = track_path.name
                self.stdout.write(f'  📖 Processing Track: {track_code}')

                for subject_path in sorted(track_path.iterdir()):
                    if not subject_path.is_dir():
                        continue
                        
                    subject_code = subject_path.name
                    self.stdout.write(f'    📝 Processing Subject: {subject_code}')

                    # Process all lessons in this subject
                    for lesson_path in sorted(subject_path.iterdir()):
                        if not lesson_path.is_dir():
                            continue
                        
                        # Check limit
                        if limit and stats['lessons_created'] >= limit:
                            self.stdout.write(self.style.WARNING(f'\n⚠️  Reached limit of {limit} lessons. Stopping import.'))
                            self._print_summary(stats)
                            return
                            
                        try:
                            self._import_lesson(
                                lesson_path=lesson_path,
                                grade_code=grade_code,
                                track_code=track_code,
                                subject_code=subject_code,
                                created_by_id=created_by_id,
                                skip_existing=skip_existing,
                                stats=stats
                            )
                        except Exception as e:
                            error_msg = f'Error in lesson {lesson_path.name}: {str(e)}'
                            self.stdout.write(self.style.ERROR(f'      ❌ {error_msg}'))
                            stats['errors'].append(error_msg)

        # Print summary
        self._print_summary(stats)

    def _import_lesson(self, lesson_path, grade_code, track_code, subject_code, created_by_id, skip_existing, stats):
        """Import a single lesson with all its resources and exercises"""
        
        try:
            # Define Paths
            lesson_content_path = lesson_path / 'lesson_content.json'
            lesson_exercises_path = lesson_path / 'lesson_exercises.json'
            metadata_path = lesson_path / 'metadata.json'
            image_coords_path = lesson_path / 'image_coordinates.json'
            images_generated_path = lesson_path / 'images_generated'
            
            # FIX 1: Look for mapping in images_generated first (contains SVG mappings), then root
            image_id_mapping_gen_path = images_generated_path / 'image_id_mapping.json'
            image_id_mapping_root_path = lesson_path / 'image_id_mapping.json'

            if not lesson_content_path.exists():
                raise FileNotFoundError(f'lesson_content.json not found in {lesson_path}')

            # Load JSON files
            with open(lesson_content_path, 'r', encoding='utf-8') as f:
                lesson_content = json.load(f)

            metadata = {}
            if metadata_path.exists():
                with open(metadata_path, 'r', encoding='utf-8') as f:
                    metadata = json.load(f)

            image_coords = []
            if image_coords_path.exists():
                with open(image_coords_path, 'r', encoding='utf-8') as f:
                    image_coords = json.load(f)

            # FIX 1 (Implementation): Load the most specific mapping file
            image_id_mapping = {}
            if image_id_mapping_gen_path.exists():
                with open(image_id_mapping_gen_path, 'r', encoding='utf-8') as f:
                    image_id_mapping = json.load(f)
            elif image_id_mapping_root_path.exists():
                with open(image_id_mapping_root_path, 'r', encoding='utf-8') as f:
                    image_id_mapping = json.load(f)

            lesson_exercises = None
            if lesson_exercises_path.exists():
                with open(lesson_exercises_path, 'r', encoding='utf-8') as f:
                    lesson_exercises = json.load(f)

            # Look up database objects
            try:
                grade = Grade.objects.get(code=grade_code)
            except Grade.DoesNotExist:
                raise ValueError(f'Grade not found: {grade_code}')

            # Handle combined track folders
            track_codes = track_code.split('_')
            tracks = []
            
            for tc in track_codes:
                try:
                    track = Track.objects.get(code=tc)
                    tracks.append(track)
                except Track.DoesNotExist:
                    self.stdout.write(self.style.WARNING(f'        ⚠️  Track not found: {tc} (skipping)'))
            
            if not tracks:
                raise ValueError(f'No valid tracks found in: {track_code}')

            try:
                subject = Subject.objects.get(code=subject_code)
            except Subject.DoesNotExist:
                raise ValueError(f'Subject not found: {subject_code}')

            # Extract lesson info
            lesson_metadata = lesson_content.get('metadata', {})
            title = lesson_metadata.get('title', lesson_path.name)
            
            # Check existing
            if skip_existing:
                existing_lesson = Lesson.objects.filter(
                    subject=subject,
                    grade=grade,
                    title=title
                ).first()
                
                if existing_lesson:
                    stats['lessons_skipped'] += 1
                    self.stdout.write(self.style.WARNING(f'      ⏭️  Skipped existing lesson: {title[:50]}... (ID: {existing_lesson.id})'))
                    return

            title_arabic = title
            title_french = lesson_metadata.get('title_french', '')
            title_english = lesson_metadata.get('title_english', '')
            
            description = ', '.join(lesson_metadata.get('keywords', [])) if isinstance(lesson_metadata.get('keywords'), list) else ''
            objectives = '\n'.join(lesson_metadata.get('learning_objectives', [])) if isinstance(lesson_metadata.get('learning_objectives'), list) else ''
            prerequisites = ', '.join(lesson_metadata.get('prerequisites', [])) if isinstance(lesson_metadata.get('prerequisites'), list) else ''
            
            difficulty_map = {
                'easy': 'easy',
                'intermediate': 'medium',
                'medium': 'medium',
                'hard': 'hard',
                'difficult': 'hard'
            }
            difficulty = difficulty_map.get(
                lesson_metadata.get('difficulty', 'medium').lower() if isinstance(lesson_metadata.get('difficulty'), str) else 'medium',
                'medium'
            )

            existing_count = Lesson.objects.filter(
                subject=subject,
                grade=grade,
                cycle=''
            ).count()
            lesson_order = existing_count + 1

            # Create Lesson
            lesson = Lesson.objects.create(
                subject=subject,
                grade=grade,
                title=title,
                title_arabic=title_arabic,
                title_french=title_french,
                description=description,
                cycle='',
                order=lesson_order,
                objectives=objectives,
                prerequisites=prerequisites,
                difficulty_level=difficulty,
                is_active=True,
                created_by_id=created_by_id
            )
            
            for track in tracks:
                lesson.tracks.add(track)
            
            for track_code_meta in lesson_metadata.get('tracks', []):
                if isinstance(track_code_meta, str):
                    try:
                        extra_track = Track.objects.get(code=track_code_meta)
                        lesson.tracks.add(extra_track)
                    except Track.DoesNotExist:
                        pass

            stats['lessons_created'] += 1
            self.stdout.write(self.style.SUCCESS(f'      ✅ Created lesson: {title[:50]}... (ID: {lesson.id})'))

            # Create LessonResource
            try:
                blocks_content = self._build_blocks_content(
                    lesson_content=lesson_content,
                    image_coords=image_coords,
                    image_id_mapping=image_id_mapping,
                    images_generated_path=images_generated_path
                )

                resource = LessonResource.objects.create(
                    lesson=lesson,
                    title=f"محتوى الدرس - {title}",
                    description="محتوى الدرس الكامل بالأقسام والأمثلة",
                    resource_type='blocks',
                    blocks_content=blocks_content,
                    content_version=1,
                    is_visible_to_students=True,
                    is_downloadable=False,
                    order=1,
                    uploaded_by_id=created_by_id
                )
                
                stats['resources_created'] += 1
                self.stdout.write(f'        ✅ Created resource with {len(blocks_content.get("blocks", []))} blocks (ID: {resource.id})')
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'        ❌ Failed to create resource: {str(e)}'))

            # Create exercises
            if lesson_exercises:
                try:
                    exercise_stats = self._create_exercises(
                        lesson=lesson,
                        lesson_exercises=lesson_exercises,
                        created_by_id=created_by_id
                    )
                    stats['exercises_created'] += exercise_stats['exercises']
                    stats['questions_created'] += exercise_stats['questions']
                    self.stdout.write(f'        ✅ Created {exercise_stats["exercises"]} exercises with {exercise_stats["questions"]} questions')
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'        ❌ Failed to create exercises: {str(e)}'))
                    
        except Exception as e:
            raise

    def _build_blocks_content(self, lesson_content, image_coords, image_id_mapping, images_generated_path):
        """Build blocks_content JSON from lesson sections with semantic types"""
        
        blocks = []
        block_counter = 1
        
        image_map = {img['id']: img for img in image_coords} if isinstance(image_coords, list) else {}

        sections = lesson_content.get('sections', [])
        if not isinstance(sections, list):
            sections = []
        
        for section in sections:
            if not isinstance(section, dict):
                continue
                
            section_id = section.get('id', f'sec_{block_counter}')
            section_type = section.get('type', 'paragraph')
            section_title = section.get('title', '')
            section_content = section.get('content', {})
            
            if not isinstance(section_content, dict):
                section_content = {}
                
            section_text = section_content.get('text', '')
            if not isinstance(section_text, str):
                section_text = str(section_text) if section_text else ''
            
            visual_aid = section_content.get('visual_aid', '')
            if not isinstance(visual_aid, str):
                visual_aid = str(visual_aid) if visual_aid else ''
            
            # Detect semantic type based on section type or title
            semantic_type = self._detect_semantic_type(section_type, section_title, section_text)
            
            # Add section title
            if section_title:
                blocks.append({
                    'id': f'block_{block_counter}',
                    'type': 'heading',
                    'level': 2,
                    'content': {
                        'text': section_title,
                        'section_type': section_type
                    }
                })
                block_counter += 1

            # Combine text and visual_aid for placeholder processing
            combined_text = section_text
            if visual_aid and '{{IMAGE:' in visual_aid:
                if visual_aid not in section_text:
                    combined_text = section_text + '\n' + visual_aid

            text_parts = combined_text.split('{{IMAGE:')
            
            # Add first text part with semantic type
            if text_parts[0].strip():
                blocks.extend(self._parse_text_to_blocks(text_parts[0], block_counter, semantic_type))
                block_counter += len([b for b in blocks if b['id'].startswith(f'block_{block_counter}')])

            # Process images
            for i in range(1, len(text_parts)):
                part = text_parts[i]
                if '}}' in part:
                    img_id, remaining_text = part.split('}}', 1)
                    img_id = img_id.strip()
                    
                    # Logic to check if image exists in either mapping
                    # image_id_mapping is prioritized as it contains the generated filenames
                    if img_id in image_id_mapping or img_id in image_map:
                        img_info = image_map.get(img_id, {
                            'alt_text': '',
                            'description': '',
                            'importance': 'normal'
                        })
                        
                        image_block = self._create_image_block(
                            img_id=img_id,
                            img_info=img_info,
                            image_id_mapping=image_id_mapping,
                            images_generated_path=images_generated_path,
                            block_id=f'block_{block_counter}'
                        )
                        if image_block:
                            blocks.append(image_block)
                            block_counter += 1
                    else:
                        self.stdout.write(self.style.WARNING(f'          ⚠️  Image ID {img_id} found in text but missing from mappings.'))
                    
                    # Add remaining text with semantic type
                    if remaining_text.strip():
                        blocks.extend(self._parse_text_to_blocks(remaining_text, block_counter, semantic_type))
                        block_counter += len([b for b in blocks if b['id'].startswith(f'block_{block_counter}')])

        # Add summary section
        summary = lesson_content.get('summary', {})
        if summary and isinstance(summary, dict):
            blocks.append({
                'id': f'block_{block_counter}',
                'type': 'heading',
                'level': 2,
                'content': {
                    'text': 'ملخص الدرس - Résumé'
                }
            })
            block_counter += 1

            key_points = summary.get('key_points', [])
            if key_points and isinstance(key_points, list):
                blocks.append({
                    'id': f'block_{block_counter}',
                    'type': 'list',
                    'content': {
                        'style': 'unordered',
                        'items': key_points
                    }
                })
                block_counter += 1

            formulas = summary.get('formulas', [])
            if formulas and isinstance(formulas, list):
                for formula in formulas:
                    if isinstance(formula, str):
                        blocks.append({
                            'id': f'block_{block_counter}',
                            'type': 'math',
                            'content': {
                                'latex': formula,
                                'display_mode': 'block'
                            }
                        })
                        block_counter += 1

        return {'blocks': blocks}
    
    def _detect_semantic_type(self, section_type, title, text):
        """Detect semantic type based on section type, title, and content"""
        
        # Normalize for comparison
        title_lower = title.lower() if title else ''
        text_lower = text.lower() if text else ''
        section_type_lower = section_type.lower() if section_type else ''
        
        # Introduction indicators
        introduction_keywords = ['مقدمة', 'introduction', 'تمهيد', 'présentation']
        if any(keyword in title_lower for keyword in introduction_keywords):
            return 'introduction'
        if section_type_lower == 'introduction':
            return 'introduction'
            
        # Definition indicators
        definition_keywords = ['تعريف', 'definition', 'définition', 'مفهوم', 'concept']
        if any(keyword in title_lower for keyword in definition_keywords):
            return 'definition'
        if section_type_lower in ['definition', 'concept']:
            return 'definition'
        # Check if text starts with definition patterns
        if text and any(text_lower.startswith(pattern) for pattern in ['تعريف:', 'definition:', 'définition:']):
            return 'definition'
            
        # Example indicators
        example_keywords = ['مثال', 'example', 'exemple', 'تطبيق', 'application']
        if any(keyword in title_lower for keyword in example_keywords):
            return 'example'
        if section_type_lower in ['example', 'application', 'exercise']:
            return 'example'
        if text and any(text_lower.startswith(pattern) for pattern in ['مثال:', 'example:', 'exemple:']):
            return 'example'
            
        # Theorem/Formula indicators
        theorem_keywords = ['نظرية', 'theorem', 'théorème', 'خاصية', 'property', 'قانون', 'law', 'صيغة', 'formula']
        if any(keyword in title_lower for keyword in theorem_keywords):
            return 'theorem'
        if section_type_lower in ['theorem', 'property', 'formula', 'law']:
            return 'theorem'
            
        # Default: no semantic type (renders as normal paragraph)
        return None

    def _parse_text_to_blocks(self, text, start_counter, semantic_type=None):
        """Parse text into paragraph and math blocks with semantic types"""
        blocks = []
        counter = start_counter
        
        paragraphs = [p.strip() for p in text.split('\n') if p.strip()]
        
        for para in paragraphs:
            if para.startswith('$$') and para.endswith('$$'):
                latex = para[2:-2].strip()
                blocks.append({
                    'id': f'block_{counter}',
                    'type': 'math',
                    'content': {
                        'latex': latex,
                        'display_mode': 'block'
                    }
                })
                counter += 1
            else:
                # Build paragraph block
                block = {
                    'id': f'block_{counter}',
                    'type': 'paragraph',
                    'content': {
                        'text': para
                    }
                }
                
                # Add semantic type if detected
                if semantic_type:
                    if 'properties' not in block:
                        block['properties'] = {}
                    block['properties']['semanticType'] = semantic_type
                
                blocks.append(block)
                counter += 1
        
        return blocks

    def _create_image_block(self, img_id, img_info, image_id_mapping, images_generated_path, block_id):
        """Create an image block from SVG/HTML files, distinguishing between Diagrams and Tables"""
        
        if not images_generated_path or not images_generated_path.exists():
            return None
        
        # 1. Determine the actual filename from the mapping
        actual_filename = f'{img_id}.svg'  # Default fallback
        
        if isinstance(image_id_mapping, dict) and img_id in image_id_mapping:
            img_mapping = image_id_mapping[img_id]
            if isinstance(img_mapping, dict):
                actual_filename = img_mapping.get('filename', f'{img_id}.svg')
            elif isinstance(img_mapping, str):
                actual_filename = img_mapping
        
        # FIX 2: FAILSAFE
        # If the mapping points to a raster image (JPG/PNG), it means we loaded the wrong mapping
        # or the mapping is pointing to source. Force usage of SVG/HTML for the block content.
        if actual_filename.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.bmp')):
            # Assume the SVG exists with the ID name
            actual_filename = f'{img_id}.svg'

        file_path = images_generated_path / actual_filename
        
        # 2. Safety check: does the file exist?
        if not file_path.exists():
            # Fallback: Check if we have the HTML version instead of SVG (or vice versa)
            if actual_filename.endswith('.svg'):
                alt_path = images_generated_path / actual_filename.replace('.svg', '.html')
                if alt_path.exists():
                    file_path = alt_path
                    actual_filename = actual_filename.replace('.svg', '.html')
            elif actual_filename.endswith('.html'):
                alt_path = images_generated_path / actual_filename.replace('.html', '.svg')
                if alt_path.exists():
                    file_path = alt_path
                    actual_filename = actual_filename.replace('.html', '.svg')
            
            # If still missing
            if not file_path.exists():
                self.stdout.write(self.style.WARNING(f'          ⚠️  File not found for {img_id}: {actual_filename}'))
                return None

        # 3. Determine content type based on file extension
        is_svg = actual_filename.lower().endswith('.svg')
        is_html = actual_filename.lower().endswith('.html')
        
        if not isinstance(img_info, dict):
            img_info = {}
        
        try:
            # 4. Read the file content
            with open(file_path, 'r', encoding='utf-8') as f:
                file_content = f.read()

            # 5. Return the correct block type
            if is_svg:
                return {
                    'id': block_id,
                    'type': 'image',
                    'content': {
                        'format': 'svg',
                        'data': file_content,
                        'alt_text': img_info.get('alt_text', ''),
                        'description': img_info.get('description', ''),
                        'importance': img_info.get('importance', 'normal')
                    }
                }
            elif is_html:
                return {
                    'id': block_id,
                    'type': 'table',
                    'content': {
                        'html': file_content,
                        'alt_text': img_info.get('alt_text', ''),
                        'description': img_info.get('description', ''),
                        'importance': img_info.get('importance', 'normal')
                    }
                }
            else:
                self.stdout.write(self.style.WARNING(f'          ⚠️  Unknown file format for {img_id}: {actual_filename}'))
                return None

        except Exception as e:
            self.stdout.write(self.style.WARNING(f'          ⚠️  Failed to read file {file_path}: {str(e)}'))
            return None

    def _create_exercises(self, lesson, lesson_exercises, created_by_id):
        """Create exercises and questions from lesson_exercises.json"""
        
        stats = {'exercises': 0, 'questions': 0}
        
        exercises_data = lesson_exercises.get('exercises', [])
        
        for ex_data in exercises_data:
            exercise = Exercise.objects.create(
                lesson=lesson,
                title=ex_data.get('title', ''),
                instructions=ex_data.get('instructions', ''),
                difficulty_level=ex_data.get('difficulty', 'medium'),
                order=ex_data.get('order', 0),
                created_by_id=created_by_id
            )
            stats['exercises'] += 1
            
            questions_data = ex_data.get('questions', [])
            
            for q_idx, q_data in enumerate(questions_data, 1):
                question_type_raw = q_data.get('type', 'short_answer')
                question_text = q_data.get('question_text', '')
                explanation = q_data.get('explanation', '')
                
                type_mapping = {
                    'multiple_choice_single': 'qcm_single',
                    'multiple_choice_multiple': 'qcm_multiple',
                    'multiple_choice': 'qcm_single',
                    'true_false': 'true_false',
                    'fill_in_blanks': 'fill_blank',
                    'fill_in_blank': 'fill_blank',
                    'short_answer': 'open_short',
                    'long_answer': 'open_long',
                    'ordering': 'ordering',
                    'matching': 'matching'
                }
                
                question_type = type_mapping.get(question_type_raw, 'open_short')
                
                try:
                    question = Question.objects.create(
                        exercise=exercise,
                        question_type=question_type,
                        question_text=question_text,
                        explanation=explanation,
                        points=1.0,
                        order=q_idx,
                        is_required=True
                    )
                    stats['questions'] += 1
                    
                    if question_type in ['qcm_single', 'qcm_multiple']:
                        from homework.models import QuestionChoice
                        choices = q_data.get('choices', [])
                        correct_answer = q_data.get('answer', '')
                        
                        for choice_idx, choice_text in enumerate(choices):
                            is_correct = (choice_text == correct_answer)
                            QuestionChoice.objects.create(
                                question=question,
                                choice_text=choice_text,
                                is_correct=is_correct,
                                order=choice_idx + 1
                            )
                    
                    elif question_type == 'true_false':
                        from homework.models import QuestionChoice
                        correct_answer = q_data.get('answer', False)
                        
                        QuestionChoice.objects.create(
                            question=question,
                            choice_text='True',
                            is_correct=(correct_answer == True),
                            order=1
                        )
                        QuestionChoice.objects.create(
                            question=question,
                            choice_text='False',
                            is_correct=(correct_answer == False),
                            order=2
                        )
                    
                    elif question_type == 'fill_blank':
                        from homework.models import FillBlank, FillBlankOption
                        correct_answer = q_data.get('answer', '')
                        
                        blank = FillBlank.objects.create(
                            question=question,
                            order=1
                        )
                        
                        FillBlankOption.objects.create(
                            blank=blank,
                            option_text=correct_answer,
                            is_correct=True,
                            order=1
                        )
                    
                    elif question_type == 'ordering':
                        from homework.models import OrderingItem
                        correct_order = q_data.get('answer', [])
                        
                        for position, item_text in enumerate(correct_order, 1):
                            OrderingItem.objects.create(
                                question=question,
                                text=item_text,
                                correct_position=position
                            )
                    
                    elif question_type == 'matching':
                        from homework.models import MatchingPair
                        correct_matches = q_data.get('answer', {})
                        
                        for idx, (left, right) in enumerate(correct_matches.items(), 1):
                            MatchingPair.objects.create(
                                question=question,
                                left_text=left,
                                right_text=right,
                                order=idx
                            )
                    
                except Exception as e:
                    self.stdout.write(self.style.WARNING(f'          ⚠️  Failed to create question: {str(e)}'))
                    continue
        
        return stats

    def _print_summary(self, stats):
        """Print import summary statistics"""
        self.stdout.write('\n' + '='*80)
        self.stdout.write(self.style.SUCCESS('Import Summary:'))
        self.stdout.write(f"  ✅ Lessons created: {stats['lessons_created']}")
        if stats.get('lessons_skipped', 0) > 0:
            self.stdout.write(f"  ⏭️  Lessons skipped: {stats['lessons_skipped']}")
        self.stdout.write(f"  ✅ Resources created: {stats['resources_created']}")
        self.stdout.write(f"  ✅ Exercises created: {stats['exercises_created']}")
        self.stdout.write(f"  ✅ Questions created: {stats['questions_created']}")
        
        if stats['errors']:
            self.stdout.write(self.style.WARNING(f"\n  ⚠️  Errors encountered: {len(stats['errors'])}"))
            for error in stats['errors'][:10]:
                self.stdout.write(f"    - {error}")
            if len(stats['errors']) > 10:
                self.stdout.write(f"    ... and {len(stats['errors']) - 10} more errors")
        
        self.stdout.write('='*80 + '\n')