from django.core import exceptions
from django.db import models
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
import django.contrib.auth.password_validation as validators

from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .models import Account


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Account
        fields = ("id", "username", "account_type")


class RegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[
            UniqueValidator(
                message="This email address is already registered.",
                queryset=Account.objects.all(),
            )
        ],
    )
    username = serializers.CharField(
        validators=[
            UniqueValidator(
                message="This username is already registered.",
                queryset=Account.objects.all(),
            )
        ]
    )
    password = serializers.CharField(min_length=8)

    class Meta:
        model = Account
        fields = ("email", "username", "password")
        # null, blank, invalid, invalid_choice, unique
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        return Account.objects.create_user(**validated_data)

    def validate(self, data):
        user = Account(**data)
        password = data.get("password")
        errors = dict()
        try:
            validators.validate_password(password=password, user=user)
        except exceptions.ValidationError as e:
            errors["password"] = list(e.messages)

        if errors:
            raise serializers.ValidationError(errors)

        return super(RegistrationSerializer, self).validate(data)
