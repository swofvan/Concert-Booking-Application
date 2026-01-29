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


class RegisterForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = User
        fields = ("username", "email", "password1", "password2")

    def clean_email(self):
        email = self.cleaned_data.get('email')

        if User.objects.filter(email__iexact=email).exists():
            raise forms.ValidationError("Email already registered")

        return email

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data["email"]
        if commit:
            user.save()
        return user


#----------------------------------------------------------------------------------------------------------------  Booking


# class BookingForm(forms.ModelForm):
#     class Meta:
#         model = Booking
#         fields = ['user','show', 'tickets']

#     def clean_tickets(self):                                  # ticket validation moved to FORM
#         tickets = self.cleaned_data.get('tickets')
#         if tickets > 3:
#             raise forms.ValidationError("Maximum 3 tickets allowed")
#         if tickets < 1:
#             raise forms.ValidationError("At least 1 ticket required")
#         return tickets


#----------------------------------------------------------------------------------------------------------------  register