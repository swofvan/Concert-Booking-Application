from django.db import models
from django.contrib.auth.models import User

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


# ---------------------------------------------------------------------------------------------   Booking

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    show = models.ForeignKey(Concert, on_delete=models.CASCADE)
    tickets = models.PositiveIntegerField()
    total_price = models.DecimalField(max_digits=8, decimal_places=2)
    is_confirmed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
