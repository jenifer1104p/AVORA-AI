import os, tempfile, unittest
from app import create_app
from extensions import db

class AvoraApiTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.NamedTemporaryFile(suffix='.db', delete=False); self.tmp.close()
        self.app = create_app({'TESTING':True, 'SQLALCHEMY_DATABASE_URI':'sqlite:///'+self.tmp.name, 'SECRET_KEY':'test-secret'})
        self.client = self.app.test_client()
        self.token = None
        self.client.post('/api/auth/signup', json={'name':'Test User','email':'test@example.com','password':'password123'})
        response = self.client.post('/api/auth/login', json={'email':'test@example.com','password':'password123'})
        self.token = response.get_json()['token']
        self.headers = {'Authorization':'Bearer '+self.token}
    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
        try: os.unlink(self.tmp.name)
        except OSError: pass
    def test_health(self):
        self.assertEqual(self.client.get('/api/health').status_code, 200)
    def test_signup_validation(self):
        self.assertEqual(self.client.post('/api/auth/signup', json={'name':'X','email':'bad','password':'123'}).status_code,400)
    def test_duplicate_signup(self):
        self.assertEqual(self.client.post('/api/auth/signup', json={'name':'Test','email':'test@example.com','password':'password123'}).status_code,409)
    def test_login_rejects_wrong_password(self):
        self.assertEqual(self.client.post('/api/auth/login', json={'email':'test@example.com','password':'wrong'}).status_code,401)
    def test_protected_endpoint_requires_token(self):
        self.assertEqual(self.client.post('/api/ml/predict-role', json={'profile_text':'Java Python React'}).status_code,401)
    def test_role_prediction(self):
        response=self.client.post('/api/ml/predict-role', json={'profile_text':'Java Spring Boot REST API PostgreSQL'},headers=self.headers)
        self.assertEqual(response.status_code,200)
        self.assertIn('prediction',response.get_json())
    def test_jobs_are_labeled_sample(self):
        response=self.client.get('/api/jobs')
        self.assertEqual(response.status_code,200)
        self.assertIn('sample',response.get_json()['source'])
    def test_career_simulator_validation(self):
        response=self.client.post('/api/ml/career-simulator',json={'profile_text':'short','target_role':'Developer'},headers=self.headers)
        self.assertEqual(response.status_code,400)

if __name__ == '__main__': unittest.main()
