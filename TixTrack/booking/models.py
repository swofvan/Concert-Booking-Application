from django.db import models

# Create your models here.

class Concert(models.Model):
    concert_name = models.CharField(max_length=100)
    artists = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    venue = models.CharField(max_length=100)
    date_time = models.DateTimeField()
    total_tickets = models.IntegerField()
    price = models.IntegerField()
    image = models.FileField(upload_to='concerts/')