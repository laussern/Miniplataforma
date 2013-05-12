from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'clases.views.home', name='home'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^cargar-contenido-clase/(?P<id>\d+)$', 'clases.views.cargar_clase', name='cargar_clase'),
)
