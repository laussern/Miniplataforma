from django.db import models

# Create your models here.

class Clases(models.Model):
	nombre = models.CharField(max_length=255)
	descripcion = models.TextField()
	url = models.CharField(max_length=255)
	thumb = models.CharField(max_length=255)

	def __unicode__(self):
		return self.nombre