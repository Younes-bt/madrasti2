# Generated migration for Notion-style blocks support

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lessons', '0006_lessonresource_markdown_content_and_more'),
    ]

    operations = [
        # Add blocks_content JSONField for Notion-style block storage
        migrations.AddField(
            model_name='lessonresource',
            name='blocks_content',
            field=models.JSONField(
                blank=True,
                null=True,
                help_text="JSON structure containing Notion-style content blocks"
            ),
        ),

        # Add content_version for optimistic locking and conflict detection
        migrations.AddField(
            model_name='lessonresource',
            name='content_version',
            field=models.PositiveIntegerField(
                default=1,
                help_text="Version number for conflict detection during concurrent editing"
            ),
        ),

        # Add 'blocks' choice to resource_type field
        migrations.AlterField(
            model_name='lessonresource',
            name='resource_type',
            field=models.CharField(
                max_length=20,
                choices=[
                    ('pdf', 'مستند PDF - Document PDF'),
                    ('video', 'فيديو - Vidéo'),
                    ('audio', 'صوت - Audio'),
                    ('image', 'صورة - Image'),
                    ('document', 'مستند - Document Word/Excel'),
                    ('link', 'رابط خارجي - Lien externe'),
                    ('exercise', 'تمرين - Exercice'),
                    ('presentation', 'عرض تقديمي - Présentation'),
                    ('markdown', 'ماركداون - Markdown'),
                    ('blocks', 'كتل تفاعلية - Blocs interactifs'),  # New type for Notion-style blocks
                ]
            ),
        ),
    ]
