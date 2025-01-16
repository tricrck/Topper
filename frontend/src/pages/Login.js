// Login.js
import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { signInWithPopup, GoogleAuthProvider } from '@firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // User signed in successfully
      console.log('Logged in user:', result.user);
      navigate('/dashboard'); // Navigate to dashboard after successful login
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100" style={{ maxWidth: '400px' }}>
        <Col>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Login</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              
              <div className="text-center">
                <Button 
                  variant="outline-dark" 
                  className="w-100 mb-3"
                  onClick={handleGoogleSignIn}
                >
                  <FcGoogle className="me-2" size={20} />
                  Continue with Google
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
