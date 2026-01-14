from django.db import models
from django.core.validators import validate_email

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

    def __str__(self):
        return self.concert_name


# class UserProfile(models.Model):
#     name = models.CharField(max_length=100)
#     email = models.EmailField(max_length=100, validators=[validate_email], unique=True)
#     password = models.CharField(max_length=500)   # Django password hashes are long
 
#     def __str__(self):
#         return self.email

