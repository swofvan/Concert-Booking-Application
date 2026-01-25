from django.shortcuts import render, redirect

from .forms import ConcertForm, RegisterForm
from .models import Concert, Booking

from django.db.models import Q     # for search / filter

from rest_framework.response import Response
from .serializers import ConcertSerializer, BookingSerializer

from rest_framework import status

from django.views.decorators.csrf import csrf_exempt

from rest_framework.decorators import api_view, permission_classes, authentication_classes 
from rest_framework.permissions import AllowAny, IsAuthenticated

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User


from rest_framework.authentication import SessionAuthentication
from django.shortcuts import get_object_or_404

from django.contrib.auth.decorators import login_required, user_passes_test

from django.contrib.admin.views.decorators import staff_member_required

from django.http import HttpResponseForbidden
from .authentication import CsrfExemptSessionAuthentication



# Create your views here.


# --------------------------------------------------------------------------------------------------------------  user info api

# @api_view(['GET'])
# @authentication_classes([SessionAuthentication])
# @permission_classes([IsAuthenticated])
# def current_user(request):
#     user = request.user
#     return Response({
#         "id": user.id,
#         "username": user.username,
#         "email": user.email,
#         "is_superuser": user.is_superuser
#     })

@api_view(['GET'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def check_login(request):
    return Response({"logged_in": True})

# --------------------------------------------------------------------------------------------------------------  admin check

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

    login(request, user_obj)  #  creates Django session

    return Response({
        "message": "Login successful",
        "email": user_obj.email,
        "username": user_obj.username,
        "is_superuser": user_obj.is_superuser,
    }, status=200)


# -------------------------------------------------------------------------------------------------------------- Logout
@csrf_exempt
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def user_logout(request):
    logout(request)                # -------------------------------- ends the session
    return Response(
        {"message": "Logout successful"},
        status=status.HTTP_200_OK
    )

# ------------------------------------------------------------------------------------------------------ Booking

# @api_view(['POST'])
# @authentication_classes([CsrfExemptSessionAuthentication])
# @permission_classes([IsAuthenticated])
# def create_booking(request):

#     print("LOGGED USER:", request.user)

#     concert_id = request.data.get('show')
#     tickets = request.data.get('tickets')

#     if not concert_id or not tickets:
#         return Response(
#             {"error": "show and tickets are required"},
#             status=status.HTTP_400_BAD_REQUEST
#         )

#     concert = get_object_or_404(Concert, id=concert_id)

#     # attach user manually (never trust frontend)
#     form = BookingForm({
#         'user': request.user.id,
#         'show': concert.id,
#         'tickets': tickets
#     })

#     if not form.is_valid():
#         return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

#     tickets = form.cleaned_data['tickets']

#     if concert.total_tickets < tickets:
#         return Response(
#             {"error": "Not enough tickets available"},
#             status=status.HTTP_400_BAD_REQUEST
#         )

#     total_price = concert.price * tickets

#     booking = Booking.objects.create(
#         user=request.user,
#         show=concert,
#         tickets=tickets,
#         total_price=total_price,
#         is_confirmed=False
#     )

#     concert.total_tickets -= tickets
#     concert.save()

#     serializer = BookingSerializer(
#         booking, 
#         context={
#             'request': request
#             })
#     return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def create_booking(request):

    serializer = BookingSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    concert = serializer.validated_data['show']
    tickets = serializer.validated_data['tickets']

    if concert.total_tickets < tickets:
        return Response(
            {"error": "Not enough tickets available"},
            status=status.HTTP_400_BAD_REQUEST
        )

    total_price = concert.price * tickets

    booking = serializer.save(
        user = request.user,              # backend controlled
        total_price = total_price,         # backend controlled
        is_confirmed = False
    )

    concert.total_tickets -= tickets
    concert.save()

    return Response(
        BookingSerializer(booking).data,
        status=status.HTTP_201_CREATED
    )


# -------------------------------------------------------------------------------------------------------------- Booking List

@superuser_required
def booking_list(request):
    print("REQUEST USER:", request.user)
    print("USER:", request.user.is_superuser)

    search = request.GET.get('search', '')
    
    bookings = Booking.objects.select_related('user', 'show').all()

    if search:
        bookings = bookings.filter(user__username__icontains=search)

        if not bookings.exists():
            bookings = Booking.objects.filter(
                show__concert_name__icontains=search
            )

    return render(request, 'bookings_list.html', {
        'bookings': bookings,
        'search': search
    })


# -------------------------------------------------------------------------------------------------------------- users List


@superuser_required
def users_list(request):

    users = User.objects.all().order_by('-id')
    search = request.GET.get('username', '').strip().lower()

    if search:
        
        users = users.filter(username__icontains=search) | users.filter(email__icontains=search)

        if search == 'admin':
            users = users.filter(is_superuser=True)
        elif search == 'user':
            users = users.filter(is_superuser=False)
        elif search == 'active':
            users = users.filter(is_active=True)
        elif search in ['disabled', 'inactive', 'blocked']:
            users = users.filter(is_active=False)   

    
    return render(request, 'users_list.html', {
        'users': users,
        'username': request.GET.get('username', '')
    })

# -------------------------------------------------------------------------------------------------------------- disable user

@superuser_required
def disable_user(request, user_id):

    if request.user.id == user_id:
        return HttpResponseForbidden("You cannot disable yourself")
    
    user = get_object_or_404(User, id=user_id)

    if user.is_superuser:
        return HttpResponseForbidden("Admin user cannot be disabled")

    user.is_active = False
    user.save()

    return redirect('users_list')

# -------------------------------------------------------------------------------------------------------------- enable user

@superuser_required
def enable_user(request, user_id):

    user = get_object_or_404(User, id=user_id)
    user.is_active = True
    user.save()

    return redirect('users_list')

# -------------------------------------------------------------------------------------------------------------- delete users

@superuser_required
def delete_user(request, user_id):
    
    if request.user.id == user_id:
        return HttpResponseForbidden("You cannot delete yourself")

    user = get_object_or_404(User, id=user_id)

    if user.is_superuser:
        return HttpResponseForbidden("Admin user cannot be deleted")

    user.delete()

    return redirect('users_list')
