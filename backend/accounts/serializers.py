from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile


class SignupSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    display_name = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=True)

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
            email=validated_data.get("email", ""),
        )
        Profile.objects.create(
            user=user,
            display_name=validated_data.get("display_name") or validated_data["username"],
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    display_name = serializers.CharField(source="profile.display_name", read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "display_name"]
