from rest_framework_simplejwt.authentication import JWTAuthentication


class CookiesJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Get access token in cookies
        access_token = request.COOKIES.get("access_token")
        if not access_token:
            return None

        validated_token = self.get_validated_token(access_token)

        # Validate access token
        try:
            user = self.get_user(validated_token)
        except:
            return None

        return (user, validated_token)
