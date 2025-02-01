import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Form, 
  Button, 
  Alert, 
  Spinner,
  InputGroup,
  Card,
} from 'react-bootstrap';
import { FaGoogle } from 'react-icons/fa';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  UserPlus,
  AlertCircle 
} from 'lucide-react';
import { googleSignup, emailSignup } from '../actions/user_actions';

const Signup = ({ isModal, onSuccess, switchToLogin, cardPadding }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const dispatch = useDispatch();
  const { error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) onSuccess();
  }, [user, onSuccess]);

  const validateForm = () => {
    const newErrors = {};
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords must match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length === 0) {
      setIsEmailSubmitting(true);
      setErrors({});
      try {
        await dispatch(emailSignup(
          formData.email,
          formData.password
        ));
      } catch (err) {
        setErrors(prev => ({ ...prev, form: err.message || "Login failed" }));
      } finally {
        setIsEmailSubmitting(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleSubmitting(true);
    setErrors({});
    try {
      await dispatch(googleSignup());
    } catch (err) {
      setErrors(prev => ({ ...prev, form: err.message || "An error occurred during Google signup" }));
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  return (
    <div className={cardPadding}>
      <Card className="shadow-sm">
        <Card.Body>
          {!isModal && <h3 className="mb-4 text-center"><UserPlus size={24} className="me-2" />Sign Up</h3>}
          
          {(errors.form || error) && (
            <Alert variant="danger" className="d-flex align-items-center">
              <AlertCircle size={18} className="me-2" />
              {errors.form || error}
            </Alert>
          )}

          <Button 
            variant="outline-danger" 
            onClick={handleGoogleSignup}
            className="w-100 mb-3 d-flex align-items-center justify-content-center"
            disabled={isGoogleSubmitting}
          >
            {isGoogleSubmitting ? (
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

            <Form.Group className="mb-4" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <InputGroup hasValidation>
                <InputGroup.Text>
                  <Lock size={18} />
                </InputGroup.Text>
                <Form.Control
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  isInvalid={!!errors.confirmPassword}
                  placeholder="Confirm password"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 mb-3"
              disabled={isEmailSubmitting}
            >
              {isEmailSubmitting ? (
                <Spinner animation="border" size="sm" />
              ) : (
                'Create Account'
              )}
            </Button>

            <div className="text-center">
              <Button 
                variant="link" 
                onClick={switchToLogin}
                className="text-decoration-none"
              >
                Already have an account? Log In
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Signup;