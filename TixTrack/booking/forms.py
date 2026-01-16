from django import forms
from .models import Concert, Booking


from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User


class ConcertForm(forms.ModelForm):
    class Meta:
        model = Concert
        fields = '__all__'

        widgets = {
            'concert_name': forms.TextInput(attrs={'placeholder': 'Concert Name', 'class': 'form-control'}),
            'artists': forms.TextInput(attrs={'placeholder': 'Artists Name', 'class': 'form-control'}),
            'category': forms.TextInput(attrs={'placeholder': 'Concert Category', 'class': 'form-control'}),
            'venue': forms.TextInput(attrs={'placeholder': 'Venue', 'class': 'form-control'}),
            'date_time': forms.DateTimeInput(attrs={
                'type': 'datetime-local', 'class': 'form-control'
            }),
            'total_tickets': forms.NumberInput(attrs={'placeholder': 'Total Tickets', 'class': 'form-control'}),
            'price': forms.NumberInput(attrs={'placeholder': 'Price of Ticket', 'class': 'form-control'}),
            'image': forms.FileInput(attrs={'class': 'form-control-file'}),
        }

#----------------------------------------------------------------------------------------------------------------  register

from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class RegisterForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = User
        fields = ("username", "email", "password1", "password2")

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data["email"]
        if commit:
            user.save()
        return user

#----------------------------------------------------------------------------------------------------------------  Booking


class BookingForm(forms.ModelForm):
    class Meta:
        model = Booking
        fields = ['show', 'tickets']

        widgets = {
            'show': forms.Select(attrs={
                'class': 'form-control'
            }),
            'tickets': forms.NumberInput(attrs={
                'placeholder': 'Number of Tickets',
                'class': 'form-control',
                'min': 1,
            }),
        }


#----------------------------------------------------------------------------------------------------------------  register