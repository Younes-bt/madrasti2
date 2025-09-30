# Exercise Generation Instructions for Madrasti Platform

## Overview
This document provides step-by-step instructions for creating comprehensive exercises for any lesson in the Madrasti platform using Django management commands.

## Prerequisites
- Access to lesson metadata (ID, title, subject, grade level)
- Understanding of the lesson content and learning objectives
- Knowledge of appropriate question types for the subject matter
- Multilingual content creation capability (English/Arabic)

## Step-by-Step Process

### 1. Analyze the Lesson
Before creating exercises, gather the following information:
- **Lesson ID**: Database identifier for the lesson
- **Subject**: Mathematics, Physics, Chemistry, Biology, etc.
- **Grade Level**: Educational level (e.g., 1AC, 2AC, TC, etc.)
- **Content Topics**: Main concepts covered in the lesson
- **Learning Objectives**: What students should achieve after the lesson

### 2. Plan Exercise Structure
Design exercises with progressive difficulty:
- **Beginner Level**: Basic concept understanding (1-2 exercises)
- **Intermediate Level**: Application of concepts (2-3 exercises)
- **Advanced Level**: Complex problem solving (1-2 exercises)
- **Target**: 5-6 exercises total, 4-8 questions each

### 3. Question Type Guidelines

#### Multiple Choice Questions (QCM)
- **Use for**: Concept identification, formula recognition, classification
- **Structure**: 4 choices with 1 correct answer
- **Difficulty**: Vary complexity of distractors

#### True/False Questions
- **Use for**: Fact verification, property statements
- **Structure**: Clear statement requiring true/false response
- **Tips**: Avoid ambiguous statements

#### Open Answer Questions
- **Use for**: Calculations, explanations, problem solving
- **Structure**: Clear question with specific expected answer format
- **Examples**: "Calculate the work done...", "Explain why..."

### 4. Multilingual Content Requirements

#### English Content
- Use clear, concise language appropriate for grade level
- Follow standard academic terminology
- Ensure grammatical correctness

#### Arabic Content
- Provide accurate translations of all English content
- Use proper Arabic academic terminology
- Maintain cultural and educational context
- Ensure proper Arabic script formatting

### 5. Reward System Configuration
Set appropriate point values based on difficulty:
- **Easy questions**: 5-10 points
- **Medium questions**: 10-15 points
- **Hard questions**: 15-25 points
- **Bonus for completion**: 20-50 points
- **Time bonus**: 10-30 points (if applicable)

### 6. Management Command Structure

Create a new command file: `create_[subject]_lessons_[grade]_[topic].py`

```python
from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, Choice, Reward

class Command(BaseCommand):
    help = 'Create exercises for [Lesson Name] - Lesson ID: [ID]'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=[LESSON_ID])

            # Create exercises with this structure:
            exercises_data = [
                {
                    'title': 'Exercise Title',
                    'title_arabic': 'عنوان التمرين',
                    'difficulty': 'easy|medium|hard',
                    'questions': [
                        {
                            'question_text': 'English question',
                            'question_text_arabic': 'السؤال بالعربية',
                            'question_type': 'qcm|true_false|open_answer',
                            'choices': [...] if QCM,
                            'correct_answer': 'Answer for open/true_false'
                        }
                    ]
                }
            ]

            # Implementation code here...

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
```

### 7. Subject-Specific Guidelines

#### Mathematics
- Focus on numerical problems, theorem applications, geometric concepts
- Include step-by-step calculation questions
- Use mathematical notation consistently
- Test understanding of formulas and their applications

#### Physics
- Combine theoretical concepts with practical applications
- Include unit conversion and formula manipulation
- Consider adding image support for diagrams
- Test understanding of physical laws and principles

#### Chemistry
- Include molecular structure questions
- Test reaction mechanisms and equations
- Focus on periodic table knowledge
- Include calculation problems (molarity, stoichiometry)

#### Biology
- Use classification and identification questions
- Include process explanation questions
- Test anatomical knowledge
- Focus on life cycle and biological processes

### 8. Quality Assurance Checklist

Before running the command:
- [ ] All questions have both English and Arabic versions
- [ ] Question types are appropriate for the content
- [ ] Difficulty progression is logical
- [ ] Reward points are balanced
- [ ] No spelling or grammatical errors
- [ ] Technical terms are accurately translated
- [ ] Questions test different aspects of the lesson

### 9. Execution Commands

Run the management command:
```bash
cd backend
python manage.py create_[command_name]
```

Verify creation:
```bash
python manage.py shell
>>> from homework.models import Exercise, Question
>>> Exercise.objects.filter(lesson_id=[LESSON_ID]).count()
>>> Question.objects.filter(exercise__lesson_id=[LESSON_ID]).count()
```

### 10. Post-Generation Tasks

After successful generation:
1. **Test in Admin Interface**: Verify exercises display correctly
2. **Language Switching Test**: Confirm Arabic/English content switches properly
3. **Student View Test**: Check exercises work in student interface
4. **Difficulty Balance**: Ensure appropriate challenge levels
5. **Content Accuracy**: Verify all questions are educationally sound

## Example Templates

### Mathematics Exercise Template
```python
{
    'title': 'Basic Number Operations',
    'title_arabic': 'العمليات الأساسية على الأعداد',
    'difficulty': 'easy',
    'questions': [
        {
            'question_text': 'What is the result of 15 + 27?',
            'question_text_arabic': 'ما هو ناتج 15 + 27؟',
            'question_type': 'qcm',
            'choices': [
                {'choice_text': '42', 'choice_text_arabic': '42', 'is_correct': True},
                {'choice_text': '32', 'choice_text_arabic': '32', 'is_correct': False},
                {'choice_text': '52', 'choice_text_arabic': '52', 'is_correct': False},
                {'choice_text': '35', 'choice_text_arabic': '35', 'is_correct': False}
            ]
        }
    ]
}
```

### Physics Exercise Template
```python
{
    'title': 'Force and Motion Basics',
    'title_arabic': 'أساسيات القوة والحركة',
    'difficulty': 'medium',
    'questions': [
        {
            'question_text': 'Calculate the work done when a force of 10N moves an object 5m in the direction of the force.',
            'question_text_arabic': 'احسب الشغل المنجز عندما تحرك قوة مقدارها 10N جسماً مسافة 5m في اتجاه القوة.',
            'question_type': 'open_answer',
            'correct_answer': '50 J'
        }
    ]
}
```

## Notes for Future Development

1. **AI Integration**: Consider implementing AI-powered content generation for bulk lesson processing
2. **Image Support**: Add image upload capabilities for physics/chemistry diagrams
3. **Interactive Elements**: Plan for interactive question types (drag-and-drop, matching)
4. **Analytics**: Track question difficulty and student performance for optimization
5. **Localization**: Prepare for French language support addition

## Troubleshooting

### Common Issues
- **Unicode Errors**: Ensure proper Arabic text encoding in console output
- **Lesson Not Found**: Verify lesson ID exists in database
- **Duplicate Exercises**: Check if exercises already exist for the lesson
- **Missing Translations**: Ensure all Arabic text fields are populated

### Error Handling
Always include try-catch blocks and meaningful error messages in management commands to facilitate debugging and maintenance.

---

**Last Updated**: [Current Date]
**Version**: 1.0
**Maintainer**: Development Team