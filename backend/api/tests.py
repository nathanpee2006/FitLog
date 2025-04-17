from rest_framework import status
from rest_framework.test import APITestCase


class AuthTests(APITestCase):
    '''
    Test user registration
    '''
    def test_register_user(self):
        response = self.client.post('/api/register/', {
            'username': 'test100',
            'email': 'test100@email.com',
            'password': 'test100'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_register_user_missing_fields(self):
        response = self.client.post('/api/register/', {
            'username': '',
            'email': '',
            'password': ''
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    '''
    Test user login
    '''
    def test_login_user(self):
        reponse = self.client.post('/api/token/', {
            'username': 'test100',
            'password': 'test100'
        })
        self.assertEqual(reponse.status_code, status.HTTP_200_OK)