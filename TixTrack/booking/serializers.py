from rest_framework import serializers
from .models import Concert

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
    

# class RegisterSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(min_length=8, write_only=True)       #It means the user can send a password to the server, but the server will never send that password back in a JSON response. It stays hidden.

#     class Meta:
#         model = UserProfile
#         fields = '__all__'

#         def create(self, validated_data):                                          # Creates user
#             validated_data.pop('confirm_password')
#             validated_data['password'] = make_password(validated_data['password'])   # HASH PASSWORD HERE
#             return UserProfile.objects.create(**validated_data)