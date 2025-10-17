from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('schools', '0007_vehicle_vehiclemaintenancerecord'),
    ]

    operations = [
        migrations.CreateModel(
            name='GasoilRecord',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('refuel_date', models.DateField()),
                ('liters', models.DecimalField(decimal_places=2, help_text='Number of liters filled', max_digits=8)),
                ('amount', models.DecimalField(decimal_places=2, help_text='Total amount paid for the refill', max_digits=10)),
                ('fuel_station', models.CharField(blank=True, help_text='Where the vehicle was refueled', max_length=255)),
                ('receipt_number', models.CharField(blank=True, help_text='Optional receipt or reference number', max_length=120)),
                ('notes', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('vehicle', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='gasoil_records', to='schools.vehicle')),
            ],
            options={
                'ordering': ['-refuel_date', '-created_at'],
            },
        ),
    ]

