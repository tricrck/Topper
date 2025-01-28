import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { getTestimonialDetails, updateTestimonial } from '../../actions/testimonial_actions';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const AdminTestimonyEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    name: '',
    testimonial: '',
    designation: '',
    link: ''
  });
  
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFormDirty, setIsFormDirty] = useState(false);

  const testimonialDetails = useSelector((state) => state.testimonialDetails);
  const { loading: loadingDetails, error: errorDetails, testimonial } = testimonialDetails;

  const testimonialUpdate = useSelector((state) => state.testimonialUpdate);
  const { 
    loading: loadingUpdate, 
    error: errorUpdate, 
    success: successUpdate 
  } = testimonialUpdate;

  useEffect(() => {
    if (successUpdate) {
      navigate('/admin/testimonialist');
    } else {
      if (!testimonial._id || testimonial._id !== id) {
        dispatch(getTestimonialDetails(id));
      } else {
        setFormData({
          name: testimonial.name || '',
          testimonial: testimonial.testimonial || '',
          designation: testimonial.designation || '',
          link: testimonial.link || ''
        });
      }
    }
  }, [dispatch, id, testimonial, successUpdate, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.testimonial.trim()) {
      newErrors.testimonial = 'Testimonial content is required';
    } else if (formData.testimonial.length < 10) {
      newErrors.testimonial = 'Testimonial must be at least 10 characters long';
    }
    
    if (formData.link && !isValidUrl(formData.link)) {
      newErrors.link = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setIsFormDirty(true);
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setValidated(true);
    
    if (validateForm()) {
      dispatch(updateTestimonial({
        _id: id,
        ...formData
      }));
    }
  };

  const handleCancel = () => {
    if (isFormDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate('/admin/testimonials');
      }
    } else {
      navigate('/admin/testimonials');
    }
  };

  if (loadingDetails) {
    return (
      <Container className="d-flex justify-content-center py-5">
        <Loader />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="mb-4 d-flex justify-content-between align-items-center">
                <h1 className="mb-0">Edit Testimonial</h1>
                <Button
                  variant="outline-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>

              {errorDetails && <Message variant="danger">{errorDetails}</Message>}
              {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                    placeholder="Enter testimonial author's name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Testimonial <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="testimonial"
                    value={formData.testimonial}
                    onChange={handleChange}
                    isInvalid={!!errors.testimonial}
                    placeholder="Enter testimonial content"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.testimonial}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Minimum 10 characters
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Designation</Form.Label>
                  <Form.Control
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="Enter author's designation (optional)"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Link</Form.Label>
                  <Form.Control
                    type="url"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    isInvalid={!!errors.link}
                    placeholder="Enter relevant link (optional)"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.link}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Optional: Link to author's profile or original testimonial
                  </Form.Text>
                </Form.Group>

                <div className="d-flex justify-content-end gap-2">
                  <Button
                    variant="outline-secondary"
                    onClick={handleCancel}
                    disabled={loadingUpdate}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loadingUpdate || !isFormDirty}
                  >
                    {loadingUpdate ? (
                      <>
                        <Loader small />
                        <span className="ms-2">Updating...</span>
                      </>
                    ) : (
                      'Update Testimonial'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminTestimonyEdit;