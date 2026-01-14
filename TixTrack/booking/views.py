from django.shortcuts import render, redirect
from .forms import ConcertForm
from .models import Concert

from django.db.models import Q     # for search / filter

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import ConcertSerializer

# from .serializers import RegisterSerializer
from rest_framework import status

from django.contrib.auth import authenticate

from django.views.decorators.csrf import csrf_exempt
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from rest_framework.authtoken.models import Token

from .forms import RegisterForm
from django.http import JsonResponse


# Create your views here.

# --------------------------------------------------------------------------------------------------------------   view

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

# @csrf_exempt
# @api_view(['POST'])
# def register(request):
#     serializer = RegisterSerializer(data=request.data)
    
#     if serializer.is_valid():
#         serializer.save()
#         return Response(
#             {"message": "User registered successfully"},
#             status=status.HTTP_201_CREATED
#         )
    
#     print("SERIALIZER ERRORS:", serializer.errors)

#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)

        if form.is_valid():
            form.save()
            return JsonResponse(
                {"message": "User registered successfully"},
                status=201
            )

        return JsonResponse(form.errors, status=400)

    return JsonResponse({"error": "Invalid request"}, status=405)

# -------------------------------------------------------------------------------------------------------------- Login

# def login(request):
    
#     email = request.data.get("email")
#     password = request.data.get("password")
    
#     if email is None or password is None:
#         return Response(
#             {'error': 'Please provide both email and password'},
#             status=HTTP_400_BAD_REQUEST
#             )
    
#     user = authenticate(email=email, password=password)
    
#     if not user:
#         return Response({'error': 'Invalid Credentials'},
#                         status=HTTP_404_NOT_FOUND)
    
#     token, _ = Token.objects.get_or_create(user=user)

#     return Response({'token': token.key},status=HTTP_200_OK)