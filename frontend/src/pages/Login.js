import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Button, 
  Alert, 
  Spinner,
  InputGroup,
  FormCheck,
  Card, 
} from 'react-bootstrap';
import { FaGoogle } from 'react-icons/fa';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  LogIn, 
  AlertCircle 
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { emailLogin, googleLogin } from '../actions/user_actions';

const Login = ({ isModal, onSuccess, switchToSignup, cardPadding }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const { error: authError, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) onSuccess();
  }, [user, onSuccess]);

  const validateForm = () => {
    const newErrors = {};
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      setErrors({});
      try {
        await dispatch(emailLogin({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe
        }));
      } catch (err) {
        setErrors(prev => ({ ...prev, form: err.message || "Login failed" }));
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setErrors({});
    try {
      await dispatch(googleLogin());
    } catch (err) {
      setErrors(prev => ({ ...prev, form: err.message || "Google login failed" }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rememberMe' ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  return (
    <div className={cardPadding}>
      <Card className="shadow-sm">
        <Card.Body>
          {!isModal && <h3 className="mb-4 text-center"><LogIn size={24} className="me-2" />Login</h3>}

          {(errors.form || authError) && (
            <Alert variant="danger" className="d-flex align-items-center">
              <AlertCircle size={18} className="me-2" />
              {errors.form || authError}
            </Alert>
          )}

          <Button 
            variant="outline-danger" 
            onClick={handleGoogleLogin}
            className="w-100 mb-3 d-flex align-items-center justify-content-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Spinner animation="border" size="sm" className="me-2" />
            ) : (
              <FaGoogle className="me-2" />
            )}
            Continue with Google
          </Button>

          <div className="position-relative text-center mb-4">
            <hr className="border-secondary" />
            <span className="px-2 bg-white position-absolute top-50 start-50 translate-middle text-muted">
              or Anonymously
            </span>
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email address</Form.Label>
              <InputGroup hasValidation>
                <InputGroup.Text>
                  <Mail size={18} />
                </InputGroup.Text>
                <Form.Control
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                  placeholder="Enter email"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <InputGroup hasValidation>
                <InputGroup.Text>
                  <Lock size={18} />
                </InputGroup.Text>
                <Form.Control
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                  placeholder="Enter password"
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="rememberMe">
              <FormCheck>
                <FormCheck.Input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <FormCheck.Label>Remember me</FormCheck.Label>
              </FormCheck>
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 mb-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Spinner animation="border" size="sm" />
              ) : (
                'Login'
              )}
            </Button>

            <div className="text-center">
              <Button 
                variant="link" 
                onClick={switchToSignup}
                className="text-decoration-none"
              >
                Don't have an account? Sign Up
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;