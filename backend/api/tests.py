from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase


class AuthTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="test100", email="test100@email.com", password="test100"
        )

    def login_user(self):
        response = self.client.post(
            "/api/token/", {"username": "test100", "password": "test100"}
        )

        return response.cookies

    """
    Test user registration
    """

    def test_register_user(self):
        response = self.client.post(
            "/api/register/",
            {
                "username": "test101",
                "email": "test101@email.com",
                "password": "test101",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_register_user_missing_fields(self):
        response = self.client.post(
            "/api/register/", {"username": "", "email": "", "password": ""}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_existing_username(self):
        response = self.client.post(
            "/api/register/",
            {
                "username": "test100",
                "email": "test100@email.com",
                "password": "test100",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    """
    Test user login
    """

    def test_login_user(self):
        response = self.client.post(
            "/api/token/", {"username": "test100", "password": "test100"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", response.cookies)
        self.assertIn("refresh_token", response.cookies)

    def test_login_user_invalid_credentials(self):
        response = self.client.post(
            "/api/token/", {"username": "test100", "password": "test200"}
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    """
    Test user logout
    """

    def test_logout_user(self):
        self.login_user()

        response = self.client.post("/api/logout/")
        self.assertEqual(response.cookies["access_token"].value, "")
        self.assertEqual(response.cookies["refresh_token"].value, "")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    """
    Test private route
    """

    def test_private_route_valid(self):
        # With access token
        cookies = self.login_user()

        response = self.client.get("/api/workouts/")
        self.assertIn("access_token", cookies)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_private_route_invalid(self):
        # Without access token
        response = self.client.get("/api/workouts/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    """
    Test refresh token
    """

    def test_token_refresh_valid(self):
        cookies = self.login_user()
        self.client.cookies = cookies

        response = self.client.post("/api/token/refresh/")
        self.assertIn("access_token", response.cookies)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_token_refresh_invalid(self):
        response = self.client.post("/api/token/refresh/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
