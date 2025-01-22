import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { googleLogin, emailLogin } from "../actions/user_actions";
import { 
  Container, 
  Row, 
  Col, 
  Form, 
  Button, 
  Card, 
  Alert, 
  InputGroup 
} from 'react-bootstrap';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';

const Login = ({
  containerClassName = "min-vh-100", // Default full height
  cardClassName = "shadow-lg",       // Default shadow
  titleSize = "h2",                  // Default size
  titleFont = "fw-bold",            // Default font weight
  cardWidth = { xs: 12, sm: 10, md: 8, lg: 6, xl: 4 }, // Default responsive widths
  cardPadding = "p-5",              // Default padding
  isModal = false
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      try {
        await dispatch(emailLogin(formData.email, formData.password));
      } catch (err) {
        console.error("Login error:", err);
      } finally {
        setIsLoading(false);
      }
    } else {
      setValidationErrors(errors);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await dispatch(googleLogin());
    } catch (err) {
      console.error("Google login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to handle redirect after successful login
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <Container fluid className={`bg-light d-flex align-items-center justify-content-center py-5 ${containerClassName}`}>
      <Row className="justify-content-center w-100">
        <Col {...cardWidth}>
          <Card className={`border-0 ${cardClassName}`}>
            <Card.Body className={cardPadding}>
              <div className="text-center mb-4">
                <div className={`${titleSize} ${titleFont} mb-1`}>Welcome Back</div>
                <p className="text-muted">Please sign in to continue</p>
              </div>

              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label>Email address</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light">
                      <Mail size={18} />
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      isInvalid={!!validationErrors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.email}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light">
                      <Lock size={18} />
                    </InputGroup.Text>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      isInvalid={!!validationErrors.password}
                    />
                    <Button 
                      variant="light"
                      onClick={() => setShowPassword(!showPassword)}
                      className="border"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Row className="mb-4">
                  <Col>
                    <Form.Check
                      type="checkbox"
                      name="rememberMe"
                      label="Remember me"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                    />
                  </Col>
                  <Col className="text-end">
                    <a href="/forgot-password" className="text-decoration-none">
                      Forgot Password?
                    </a>
                  </Col>
                </Row>

                <div className="d-grid gap-3">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>

                  <Button
                    variant="outline-danger"
                    size="lg"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="d-flex align-items-center justify-content-center gap-2"
                  >
                    <FaGoogle size={20} />
                    Sign in with Google
                  </Button>
                </div>
              </Form>

              <div className="text-center mt-4">
                <p className="mb-0">
                  Don't have an account?{' '}
                  <a href="/signup" className="text-decoration-none">
                    Create one
                  </a>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;