from django.db import migrations, models


def map_existing_positions(apps, schema_editor):
    Profile = apps.get_model('users', 'Profile')

    mapping = {
        'director': 'DIRECTOR',
        'directeur': 'DIRECTOR',
        'directrice': 'DIRECTOR',
        'assistant': 'ASSISTANT',
        'assistante': 'ASSISTANT',
        'it': 'IT_SUPPORT',
        'it support': 'IT_SUPPORT',
        'it specialist': 'IT_SUPPORT',
        'technicien': 'IT_SUPPORT',
        'technician': 'IT_SUPPORT',
        'developer': 'IT_SUPPORT',
        'comptable': 'ACCOUNTANT',
        'accountant': 'ACCOUNTANT',
        'finance': 'ACCOUNTANT',
        'hr': 'HR_COORDINATOR',
        'hr coordinator': 'HR_COORDINATOR',
        'human resources': 'HR_COORDINATOR',
        'counselor': 'COUNSELOR',
        'conseiller': 'COUNSELOR',
        'conseillère': 'COUNSELOR',
        'librarian': 'LIBRARIAN',
        'bibliothécaire': 'LIBRARIAN',
        'library': 'LIBRARIAN',
        'nurse': 'NURSE',
        'infirmier': 'NURSE',
        'infirmière': 'NURSE',
        'security': 'SECURITY',
        'guard': 'SECURITY',
        'sécurité': 'SECURITY',
        'maintenance': 'MAINTENANCE',
        'maintenance staff': 'MAINTENANCE',
        'support': 'SUPPORT',
        'support staff': 'SUPPORT',
        'staff': 'SUPPORT',
        'autre': 'OTHER',
        'other': 'OTHER',
    }

    for profile in Profile.objects.exclude(position__isnull=True).exclude(position__exact=''):
        key = profile.position.strip().lower()
        profile.position = mapping.get(key, 'OTHER')
        profile.save(update_fields=['position'])


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0009_profile_teachable_grades'),
    ]

    operations = [
        migrations.RunPython(map_existing_positions, migrations.RunPython.noop),
        migrations.AlterField(
            model_name='profile',
            name='position',
            field=models.CharField(blank=True, choices=[('DIRECTOR', 'Director'), ('ASSISTANT', 'Assistant'), ('IT_SUPPORT', 'IT Support Specialist'), ('ACCOUNTANT', 'Accountant'), ('HR_COORDINATOR', 'HR Coordinator'), ('COUNSELOR', 'Counselor'), ('LIBRARIAN', 'Librarian'), ('NURSE', 'School Nurse'), ('SECURITY', 'Security Officer'), ('MAINTENANCE', 'Maintenance Staff'), ('SUPPORT', 'Support Staff'), ('OTHER', 'Other')], max_length=50, null=True, verbose_name='Position'),
        ),
    ]

