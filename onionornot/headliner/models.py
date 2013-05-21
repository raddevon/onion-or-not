from django.db import models

class Headline(models.Model):
    text = models.CharField(verbose_name="headline text", unique=True)
    source = models.URLField(verbose_name="URL", unique=True)