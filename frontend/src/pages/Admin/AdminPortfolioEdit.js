import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { getPortfolioDetails, updatePortfolio } from '../../actions/portfolio_actions';

const AdminPortfolioEdit = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    skills: '',
    link: '',
    image: '',
  });

  const dispatch = useDispatch();
  const { id } = useParams();

  const portfolioDetails = useSelector((state) => state.portfolioDetails);
  const { loading: detailsLoading, error: detailsError, portfolio } = portfolioDetails;

  const portfolioUpdate = useSelector((state) => state.portfolioUpdate);
  const { loading: updateLoading, error: updateError, success: updateSuccess } = portfolioUpdate;

  useEffect(() => {
    dispatch(getPortfolioDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (portfolio) {
      setFormData({
        title: portfolio.title || '',
        description: portfolio.description || '',
        technologies: portfolio.technologies ? portfolio.technologies.join(',') : '',
        skills: portfolio.skills ? portfolio.skills.join(',') : '',
        link: portfolio.link || '',
        image: portfolio.image || '',
      });
    }
  }, [portfolio]);

  useEffect(() => {
    if (updateSuccess) {
      window.location.href = '/admin/portfoliolist';
    }
  }, [updateSuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const updatedData = {
      ...formData,
      technologies: formData.technologies.split(','),
      skills: formData.skills.split(','),
    };
    dispatch(updatePortfolio(id, updatedData));
  };

  if (detailsLoading) {
    return (
      <Container className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Edit Portfolio</h1>
        <Button variant="secondary" onClick={() => window.location.href = '/admin/portfolio'}>
          Back to Portfolio
        </Button>
      </div>

      {detailsError && <Alert variant="danger" className="mb-4">{detailsError}</Alert>}
      {updateError && <Alert variant="danger" className="mb-4">{updateError}</Alert>}

      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter title"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Technologies</Form.Label>
          <Form.Control
            type="text"
            name="technologies"
            value={formData.technologies}
            onChange={handleChange}
            placeholder="Comma-separated technologies"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Skills</Form.Label>
          <Form.Control
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="Comma-separated skills"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Link</Form.Label>
          <Form.Control
            type="text"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="Optional project link"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Optional image URL"
          />
        </Form.Group>

        <div className="d-flex gap-2">
          <Button variant="success" type="submit" disabled={updateLoading}>
            {updateLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Updating...
              </>
            ) : (
              'Update Portfolio'
            )}
          </Button>
          <Button variant="outline-secondary" onClick={() => window.location.href = '/admin/portfolio'} disabled={updateLoading}>
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default AdminPortfolioEdit;