from django.conf import settings
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


# ---------------------------------------------------------------- QR

import qrcode
import io
import base64

# ---------------------------------------------------------------- Pdf

from django.http import HttpResponse
from django.template.loader import get_template
from xhtml2pdf import pisa
from io import BytesIO

# -----------------------------------------------------------------  email

from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import os

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
    
    # user = authenticate(username=user_obj.username, password=password)
    user = authenticate(request, username=user_obj.username, password=password)

    if user is None:
        return Response({"error": "Invalid credentials"}, status=401)


    # login(request, user_obj)  #  creates Django session
    login(request, user)


    return Response({
        "message": "Login successful",
        "email": user_obj.email,
        "username": user_obj.username,
        "is_superuser": user_obj.is_superuser,
    }, status=200)


# -------------------------------------------------------------------------------------------------------------- Logout
# @csrf_exempt
# @api_view(['POST'])
# @authentication_classes([SessionAuthentication])
# @permission_classes([IsAuthenticated])
# def user_logout(request):
#     logout(request)                # -------------------------------- ends the session
#     return Response(
#         {"message": "Logout successful"},
#         status=status.HTTP_200_OK
#     )

@csrf_exempt
@api_view(['POST'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def user_logout(request):
    logout(request)
    return Response(
        {"message": "Logout successful"},
        status=status.HTTP_200_OK
    )

# ------------------------------------------------------------------------------------------------------ Booking

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

    send_booking_email(request.user, booking)    # send confirmation email

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


# --------------------------------------------------------------------------------------------------------------  QR code generator

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def booking_qr(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id, user=request.user)
    
    except Booking.DoesNotExist:
        return Response({"error": "Booking not found"}, status=404)

    # Prepares the string content for the QR code.
    qr_data = f"Booking ID: {booking.id}\nUser: {booking.user.email}\nTickets: {booking.tickets}"

    # Generate QR code
    qr = qrcode.QRCode(
        version=1,    # Determines QR code size, 1 is small, automatically scales if fit=True.
        box_size=10,  # How many pixels each “box” of the QR code is.
        border=4      # Thickness of the border around the QR code.
    )
    qr.add_data(qr_data)  # Adds the string we want to encode
    qr.make(fit=True)     # Generates the QR code layout automatically to fit the data.

    img = qr.make_image(fill='black', back_color='white')   # Converts the QR code into an image object

    # Convert image to base64 so it can be displayed in React
    buffered = io.BytesIO()  #Creates an in-memory file (BytesIO)
    img.save(buffered, format="PNG")   # Saves the QR image into this memory buffer as PNG
    img_str = base64.b64encode(buffered.getvalue()).decode()   # Converts the binary image data to a base64 string.  .decode() converts bytes to a string so it can be sent in JSON. 

    return Response({
        "qr_code": f"data:image/png;base64,{img_str}",
        "concert_id": booking.show.id
        })


# ----------------------------------------------------------------------------------------------  PDF ticket generator

def download_ticket_pdf(request, booking_id):
    # Get the booking object
    booking = get_object_or_404(Booking, id=booking_id, user=request.user)
    
    # ---------------- Generate QR code (reuse logic from booking_qr) ----------------

    qr_data = f"Booking ID: {booking.id}\nUser: {booking.user.email}\nTickets: {booking.tickets}"
    
    qr = qrcode.QRCode(version=1, box_size=10, border=4)
    qr.add_data(qr_data)
    qr.make(fit=True)
    # img = qr.make_image(fill='black', back_color='white')
    img = qr.make_image(fill_color="black", back_color="white")
    
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    qr_code_base64 = base64.b64encode(buffered.getvalue()).decode()

    # ---------------- Load logo and convert to base64 ----------------

    logo_path = settings.BASE_DIR / 'booking' / 'static' / 'TixTrack_Logo.svg'
    with open(logo_path, 'rb') as logo_file:
        logo_base64 = base64.b64encode(logo_file.read()).decode()
        
    # ---------------- Render PDF template ----------------
    
    template = get_template('ticket_pdf.html')
    html = template.render({
        'booking': booking,
        'concert': booking.show,
        'qr_code': f'data:image/png;base64,{qr_code_base64}',  # pass QR code to template
        'logo': f'data:image/svg+xml;base64,{logo_base64}'    # pass logo
    })

    # ---------------- Generate PDF ----------------
    buffer = BytesIO()
    # pisa_status = pisa.CreatePDF(html, dest=buffer)
    pisa_status = pisa.CreatePDF(html, dest=buffer, encoding='utf-8')

    if pisa_status.err:
        return HttpResponse('PDF creation error!')
    else:
        response = HttpResponse(buffer.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="ticket_{booking.id}.pdf"'
        return response

# --------------------------------------------------------------------------------------------------------------  email


def send_booking_email(user, booking):
    """
    Helper function to send booking confirmation email with QR code.
    """
    # Generate QR code
    qr_data = f"Booking ID: {booking.id}\nUser: {user.email}\nTickets: {booking.tickets}"
    qr = qrcode.QRCode(version=1, box_size=10, border=4)
    qr.add_data(qr_data)
    qr.make(fit=True)
    img = qr.make_image(fill='black', back_color='white')
    
    # Convert QR code to base64
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    qr_code_base64 = base64.b64encode(buffered.getvalue()).decode()
    
    # Email details
    subject = f"Booking Confirmation - {booking.show.concert_name}"
    from_email = settings.DEFAULT_FROM_EMAIL  # Change this to your email
    recipient_list = [user.email]

    logo_path = os.path.join(
    settings.BASE_DIR,
    'static',
    'TixTrack_Logo.svg'
    )  # Update this path
    
    logo_base64 = ""

    if os.path.exists(logo_path):
        with open(logo_path, 'rb') as logo_file:
            logo_base64 = base64.b64encode(logo_file.read()).decode()
    else:
        print("Logo NOT found:", logo_path)

    html_message = render_to_string('booking_mail.html', {
        'booking': booking,
        'user': user,
        'concert': booking.show,
        'qr_code': qr_code_base64,
        'logo': f'data:image/svg+xml;base64,{logo_base64}',    # pass logo
    })
    
    # Create plain text version
    plain_message = strip_tags(html_message)
    
    # Send email
    send_mail(
        subject, 
        plain_message, 
        from_email, 
        recipient_list, 
        html_message=html_message
    )

    print(f"Email sent successfully to {user.email}")