from django.urls import include, path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'field', views.FieldViewSet)
router.register(r'survey', views.SurveyViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    # path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]

# urlpatterns = [
#     path('', views.index, name='index'),
#     path('fields/', views.fields_list, name='fields'),
#     path('field/<int:field_id>', views.fields_detail, name='field-detail')
#     # path('books/', views.BookListView.as_view(), name='books'),
#     # path('book/<int:pk>', views.BookDetailView.as_view(), name='book-detail'),
#     # path('authors/', views.AuthorListView.as_view(), name='authors'),
#     # path('author/<int:pk>',
#     #      views.AuthorDetailView.as_view(), name='author-detail'),
# ]