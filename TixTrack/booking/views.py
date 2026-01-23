from django.shortcuts import render, redirect

from .forms import ConcertForm
from .models import Concert, Booking

from django.db.models import Q     # for search / filter

from rest_framework.response import Response
from .serializers import ConcertSerializer, BookingSerializer

from rest_framework import status

from django.views.decorators.csrf import csrf_exempt

from rest_framework.decorators import api_view, permission_classes, authentication_classes 
from rest_framework.permissions import AllowAny,IsAuthenticated
from .forms import RegisterForm, BookingForm

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

from rest_framework.authtoken.models import Token

from rest_framework.authentication import SessionAuthentication, TokenAuthentication

from django.shortcuts import get_object_or_404

from django.contrib.auth.decorators import login_required, user_passes_test

from django.contrib.admin.views.decorators import staff_member_required

from django.http import HttpResponseForbidden
from .authentication import CsrfExemptSessionAuthentication



# Create your views here.

# --------------------------------------------------------------------------------------------------------------  admin check

# This check ensures only staff/admins can access these views


# def superuser_required(view_func):
#     return user_passes_test(lambda user: user.is_superuser, login_url='/login/')(view_func)

def superuser_required(view_func):
    def wrapper(request, *args, **kwargs):
       
        if not request.user.is_authenticated:
            return HttpResponseForbidden("Please login first")
       
        if request.user.is_superuser:
            return view_func(request, *args, **kwargs)
       
        return HttpResponseForbidden("You must be superuser to access this page")
    
    return wrapper


# --------------------------------------------------------------------------------------------------------------   admin view

@authentication_classes([CsrfExemptSessionAuthentication])
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


# --------------------------------------------------------------------------------------------------------------   consert detail api view

@api_view(['GET'])
@permission_classes([AllowAny])
def concert_detail(request, id):
    concert = get_object_or_404(Concert, id=id)
    serializer = ConcertSerializer(concert, context={
        'request': request
        })
    return Response(serializer.data)

# --------------------------------------------------------------------------------------------------------------   Create

@authentication_classes([CsrfExemptSessionAuthentication])
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

@authentication_classes([CsrfExemptSessionAuthentication])
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

@authentication_classes([CsrfExemptSessionAuthentication])
def delete_concert(request, pk):
    concert = Concert.objects.get(pk=pk)

    if request.method == 'POST':
        concert.delete()
        return redirect('concertlist')
    
    return render(request, 'delete_concert.html', {
        'concert' : concert
    })

# -------------------------------------------------------------------------------------------------------------- Register

# @csrf_exempt   ---------------------------------------------------------  already in settings CSRF_TRUSTED_ORIGINS

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

# @api_view(['POST'])
# @permission_classes([AllowAny])
# def user_login(request):

#     email = request.data.get('email')
#     password = request.data.get('password')

#     if not email or not password:
#         return Response(
#             {"error": "email and password are required"},
#             status=status.HTTP_400_BAD_REQUEST
#         )
    
#     try:
#         user = User.objects.get(email=email)
    
#     except User.DoesNotExist:
#         return Response(
#             {"error": "Invalid email or password"},
#             status=status.HTTP_401_UNAUTHORIZED
#         )
   
#     user = authenticate(username=user.username, password=password)
#     # login(request, user) 

#     if user is None:
#         return Response(
#             {"error": "Invalid email or password"},
#             status=status.HTTP_401_UNAUTHORIZED
#         )

#     token, _ = Token.objects.get_or_create(user=user)
   
#     return Response(
#         {
#             "message": "Login successful",
#             "username": user.username,
#             "email": user.email,
#             "is_admin" : user.is_staff or user.is_superuser,    #----------------------------- Admin / user
#             "token" : token.key
#         },
#         status=status.HTTP_200_OK
#     )

@api_view(['POST'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([AllowAny])
def user_login(request):

    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({"error": "email and password required"}, status=400)

    try:
        user_obj = User.objects.get(email=email)

    except User.DoesNotExist:
        return Response({"error": "Invalid credentials"}, status=401)

    login(request, user_obj)  # ------------------------------------------------------- creates Django session

    return Response({
        "message": "Login successful",
        "email": user_obj.email,
        "username": user_obj.username,
        "is_superuser": user_obj.is_superuser,
    }, status=200)


# -------------------------------------------------------------------------------------------------------------- Logout

@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def user_logout(request):
    logout(request)                # -------------------------------- ends the session
    return Response(
        {"message": "Logout successful"},
        status=status.HTTP_200_OK
    )

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# @login_required
# def user_logout(request):
#     logout(request)  # ends the session
#     return redirect('/login/')
    # return Response({"message": "Logout successful"}, status=200)

# ------------------------------------------------------------------------------------------------------ Booking

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_booking(request):

    print("USER:", request.user)
    print("AUTH:", request.auth)
    
    form = BookingForm(request.POST)
    if form.is_valid():
        concert_id = request.data.get('show_id')
        tickets = int(request.data.get('tickets', 0))
        concert = get_object_or_404(Concert, id=concert_id)

        if tickets < 1 or tickets > 3:
            return Response(
                {"error": "You can book minimum 1 and maximum 3 tickets"},
                status=status.HTTP_400_BAD_REQUEST
            )  
        if concert.total_tickets < tickets:
            return Response(
                {"error": "Not enough tickets available"},
                status=status.HTTP_400_BAD_REQUEST
            )

        total_price = concert.price * tickets

        booking = Booking.objects.create(
            user=request.user,
            show=concert,
            tickets=tickets,
            total_price=total_price
        )
        booking.total_price = total_price
        booking.is_confirmed = False
        booking.save()
        Concert.objects.filter(id=concert.id).update(
            total_tickets=concert.total_tickets - tickets
        )
        


        serializer = BookingSerializer(booking,
            context={
                'request': request
            })
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(status=status.HTTP_400_BAD_REQUEST)



# -------------------------------------------------------------------------------------------------------------- Booking List

# # @staff_member_required
# @login_required
# @api_view(['GET'])
# # @permission_classes([IsAuthenticated])
# def booking_list(request):
#     print("USER:", request.user)
#     if  (request.user.is_superuser):
       

#         bookings = (
#             Booking.objects
#             .select_related('user', 'show')
#             .order_by('-id')
#         )
#         return render(request, 'bookings_list.html', {
#             'bookings': bookings
#         })
#     else:
#         return Response(
#             {"error": "You do not have permission to view this page."},
#             status=status.HTTP_403_FORBIDDEN
#         )


@superuser_required
def booking_list(request):
    print("REQUEST USER:", request.user)
    print("USER:", request.user.is_superuser)
    
    bookings = Booking.objects.select_related('user', 'show').all()

    return render(request, 'bookings_list.html', {
        'bookings': bookings
    })
