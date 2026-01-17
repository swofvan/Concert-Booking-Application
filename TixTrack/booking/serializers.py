from rest_framework import serializers
from .models import Concert, Booking

# from .models import UserProfile
from django.contrib.auth.hashers import make_password


class ConcertSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Concert
        fields ="__all__"

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None
    

# ---------------------------------------------------------------------------------------  Booking

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'
        
    #     read_only_fields = ['user', 'total_price', 'is_confirmed', 'created_at']

    # def validate_tickets(self, value):
    #     if value > 3:
    #         raise serializers.ValidationError("Maximum 3 tickets allowed per booking")
    #     if value < 1:
    #         raise serializers.ValidationError("At least 1 ticket required")
    #     return value

    # def create(self, validated_data):
    #     show = validated_data['show']
    #     tickets = validated_data['tickets']
        
    #     if show.available_tickets < tickets:
    #         raise serializers.ValidationError("Not enough tickets available")

    #     total_price = show.price * tickets

    #     booking = Booking.objects.create(
    #         user=self.context['request'].user,
    #         show=show,
    #         tickets=tickets,
    #         total_price=total_price
    #     )
    #     return booking