# Generated by Django 4.0.4 on 2022-05-07 22:54

import catalog.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Field',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=80)),
                ('lat', models.FloatField(null=True)),
                ('lon', models.FloatField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Survey',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('measure_type', models.CharField(max_length=40, null=True)),
                ('probe', models.CharField(max_length=40, null=True)),
                ('mode', models.CharField(max_length=40, null=True)),
                ('name', models.CharField(max_length=80, null=True, unique=True)),
                ('image', models.ImageField(null=True, upload_to=catalog.models.img_directory_path)),
                ('image1', models.ImageField(null=True, upload_to=catalog.models.img_directory_path)),
                ('image2', models.ImageField(null=True, upload_to=catalog.models.img_directory_path)),
                ('image3', models.ImageField(null=True, upload_to=catalog.models.img_directory_path)),
                ('image4', models.ImageField(null=True, upload_to=catalog.models.img_directory_path)),
                ('image5', models.ImageField(null=True, upload_to=catalog.models.img_directory_path)),
                ('column_n', models.IntegerField(null=True)),
                ('file_dat', models.FileField(upload_to=catalog.models.file_directory_path)),
                ('file_txt', models.FileField(upload_to=catalog.models.file_directory_path)),
                ('field', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='surveys', to='catalog.field')),
            ],
        ),
    ]
