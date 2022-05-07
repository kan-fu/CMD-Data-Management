from .models import Field, Survey
from rest_framework import serializers


class FieldsSerializer(serializers.HyperlinkedModelSerializer):
    surveys = serializers.HyperlinkedRelatedField(
        many=True, view_name="survey-detail", read_only=True
    )

    class Meta:
        model = Field
        fields = ["url", "name", "surveys",'lat','lon','id']


class SurveysSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Survey
        fields = [
            "url",
            "id",
            "name",
            "date",
            "field",
            "image",
            "image1",
            "image2",
            "image3",
            "image4",
            "image5",
            "file_txt",
            "file_dat",
            "measure_type",
            "probe",
            "mode",
        ]

