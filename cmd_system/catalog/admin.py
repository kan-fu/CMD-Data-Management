from django.contrib import admin

# Register your models here.
from .models import Survey, Field

admin.site.register(Survey)
admin.site.register(Field)