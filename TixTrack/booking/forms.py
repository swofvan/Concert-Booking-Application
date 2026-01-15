from django import forms
from .models import Concert

# from .models import UserProfile
from django.core.exceptions import ValidationError

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


# class RegisterForm(forms.ModelForm):
#     confirmpassword = forms.CharField(min_length=8)

#     class Meta:
#         model = UserProfile
#         fields = '__all__'

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

        
