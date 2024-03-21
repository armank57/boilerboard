from django.http import JsonResponse
from .models import User
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

def get_users(request):
    users = User.objects.all().values('public_id', 'username', 'first_name', 'last_name', 'email', 'is_superuser', 'is_instructor')
    user_list = list(users)
    return JsonResponse(user_list, safe=False)

@csrf_exempt
@require_http_methods(["POST"])
def change_role(request):
    data = json.loads(request.body)
    user_id = data.get('id')
    new_role = data.get('role')
    try:
        user = User.objects.get(public_id=user_id)
        if new_role == 'Admin':
            user.is_superuser = True
            user.is_instructor = False
        elif new_role == 'Instructor':
            user.is_instructor = True
            user.is_superuser = False
        else:
            user.is_superuser = False
            user.is_instructor = False
        user.save()
        return JsonResponse({"status": "success"}, status=200)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)