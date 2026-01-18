from django.shortcuts import render, redirect

from .forms import ConcertForm, BookingForm
from .models import Concert, Booking

from django.db.models import Q     # for search / filter

from rest_framework.response import Response
from .serializers import ConcertSerializer, BookingSerializer

from rest_framework import status

from django.views.decorators.csrf import csrf_exempt

from rest_framework.decorators import api_view, permission_classes, authentication_classes 
from rest_framework.permissions import AllowAny
from .forms import RegisterForm

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated

from rest_framework.authtoken.models import Token


from rest_framework.authentication import SessionAuthentication

from django.shortcuts import get_object_or_404
from django.db import transaction

# Create your views here.

# --------------------------------------------------------------------------------------------------------------  admin check

# This check ensures only staff/admins can access these views

# def is_admin(user):
#     return user.is_authenticated and user.is_staff

# --------------------------------------------------------------------------------------------------------------   admin view

def concertlist(request):

    query = request.GET.get('q')

    concert_list = Concert.objects.all()

    if query:
        concert_list = concert_list.filter(
            Q(concert_name__icontains=query) |
            Q(artists__icontains=query) |
            Q(category__icontains=query) |
            Q(venue__icontains=query)
        )

    
    return render (request, 'concert_list.html', {
        'concert_list' : concert_list
        })

# --------------------------------------------------------------------------------------------------------------   api view

@api_view(['GET'])
@permission_classes([AllowAny])
def concert_list_api(request):
    query = request.GET.get('q')
    concerts = Concert.objects.all()

    if query:
        concerts = concerts.filter(
            Q(concert_name__icontains=query) |
            Q(artists__icontains=query) |
            Q(category__icontains=query) |
            Q(venue__icontains=query)
        )

    serializer = ConcertSerializer(
        concerts,
        many=True,
        context={'request': request}
    )
    return Response(serializer.data)

# --------------------------------------------------------------------------------------------------------------   Create

def addconcerts(request):
    if request.method == 'POST':
        form = ConcertForm(request.POST, request.FILES)

        if form.is_valid():
            form.save()
            return redirect('concertlist')
        
    else:
        form = ConcertForm()

    return render(request, 'add_concert.html', {
        'form': form
        })


# --------------------------------------------------------------------------------------------------------------   edit

def edit_concert(request,pk):
    concert= Concert.objects.get(pk=pk)

    if request.method == 'POST':
        form = ConcertForm(request.POST, request.FILES, instance=concert)

        if form.is_valid():
            form.save()
            return redirect('concertlist')
    else:
        form = ConcertForm(instance=concert)
        
    return render(request, 'edit_concert.html', {
        'form' : form,
        'concert' : concert
        })

# -------------------------------------------------------------------------------------------------------------- delete

def delete_concert(request, pk):
    concert = Concert.objects.get(pk=pk)

    if request.method == 'POST':
        concert.delete()
        return redirect('concertlist')
    
    return render(request, 'delete_concert.html', {
        'concert' : concert
    })

# -------------------------------------------------------------------------------------------------------------- Register

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    
    form = RegisterForm(data=request.data)

    if form.is_valid():
        form.save()
        return Response(
            {"message": "User registered successfully"},
            status=status.HTTP_201_CREATED
        )

    return Response(
        form.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

# -------------------------------------------------------------------------------------------------------------- Login

# @csrf_exempt -----------------------------------------------   DRF Token generation,  Token response 
@api_view(['POST'])
# @authentication_classes([])
@permission_classes([AllowAny])
def user_login(request):

    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response(
            {"error": "email and password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.get(email=email)
    
    except User.DoesNotExist:
        return Response(
            {"error": "Invalid email or password"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    user = authenticate(username=user.username, password=password)

    if user is None:
        return Response(
            {"error": "Invalid email or password"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # login(request, user)

    token, _ = Token.objects.get_or_create(user=user)

    return Response(
        {
            "message": "Login successful",
            "username": user.username,
            "email": user.email,
            "is_admin" : user.is_staff or user.is_superuser,    #----------------------------- Admin / user
            # "token" : token.key
        },
        status=status.HTTP_200_OK
    )

# -------------------------------------------------------------------------------------------------------------- Logout

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_logout(request):
    # logout(request)
    request.user.auth_token.delete()
    return Response(
        {"message": "Logout successful"},
        status=status.HTTP_200_OK
    )

# ------------------------------------------------------------------------------------------------------ Booking

# @csrf_exempt
@api_view(['POST'])
# @authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def create_booking(request):
    
    form = BookingForm(request.POST)

    if not form.is_valid():
        concert = form.cleaned_data['show']
        tickets = form.cleaned_data['tickets']

        if concert.total_tickets < tickets:
            return Response(
                {"error": "Not enough tickets available"},
                status=status.HTTP_400_BAD_REQUEST
            )

        total_price = concert.price * tickets

        booking = form.save(commit=False)
        booking.user = request.user
        booking.total_price = total_price
        booking.is_confirmed = False
        booking.save()
        
        serializer = BookingSerializer(booking,
            context={
                'request': request
            })
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)