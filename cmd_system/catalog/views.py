from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
from .models import Field, Survey
from rest_framework import viewsets
from rest_framework import permissions
from .serializers import FieldsSerializer, SurveysSerializer


class FieldViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Field.objects.all()
    serializer_class = FieldsSerializer
    # permission_classes = [permissions.IsAuthenticated]


class SurveyViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Survey.objects.all()
    serializer_class = SurveysSerializer
    # permission_classes = [permissions.IsAuthenticated]

# def index(request):
#     if request.method == "POST":
#         print(request.POST)
#         return JsonResponse({})
#     else:
#         return JsonResponse({})

# from django.core.serializers import serialize

# @csrf_exempt
# def fields_list(request):
#     if request.method == "GET":
#         return JsonResponse(list(Fields.objects.values()), safe=False)
#     else:
#         body_unicode = request.body.decode("utf-8")
#         body = json.loads(body_unicode)
#         field = Fields(name=body["name"])
#         field.save()
#         return JsonResponse({"id": field.id, "name": field.name})


# def fields_detail(request, field_id):
#     field = get_object_or_404(Fields, pk=field_id)
#     if request.method == "GET":
#         return JsonResponse({})
#     print(field)
#     return JsonResponse({})
#     pass
