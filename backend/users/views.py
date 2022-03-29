# "Queries" for Django database
from users.forms import *
from users.models import CustomUser, ParkingSpace
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from drf_spectacular.utils import extend_schema

# Create your views here.
# @login_required(login_url='http://127.0.0.1:8000/')
class RemoveUserView(GenericAPIView):
    serializer_class = RemoveUserSerializer

    def delete(self,request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid()
        if not serializer.errors:
            serializer.delete()
            return Response({'message': 'User deleted'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'message': 'User not deleted'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AddParkingSpaceView(GenericAPIView):
    serializer_class = ParkingCreationSerializer

    def post(self,request):
        serializer = ParkingCreationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(request)
        if serializer.errors is None:
            return Response({'message': 'Parking space added'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'Parking space not added'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)