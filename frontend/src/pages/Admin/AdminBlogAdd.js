import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Form, Button, Alert, Spinner, Card } from 'react-bootstrap';
import { createBlog } from '../../actions/blog_actions';

const AdminBlogAdd = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: 'Patrick Cheruiyot',
    tags: [],
    image: '',
    isPublished: false,
  });

  const [tagInput, setTagInput] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [validated, setValidated] = useState(false);

  const blogCreate = useSelector((state) => state.blogCreate);
  const { loading, error, success } = blogCreate;

  useEffect(() => {
    if (success) {
      window.location.href = '/admin/bloglist';
    }
  }, [success]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  
  const handleImageURLChange = (e) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, image: url }));
    setPreviewImage(url);
  };

  const handleTagAdd = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    dispatch(createBlog(formData));
  };

  return (
    <Container className="mt-4">
      <Card className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Create New Blog</h1>
          <Button
            variant="secondary"
            onClick={() => (window.location.href = '/admin/bloglist')}
          >
            Back to Blogs
          </Button>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <Form noValidate validated={validated} onSubmit={submitHandler}>
          {/* Title */}
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter blog title"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a title.
            </Form.Control.Feedback>
          </Form.Group>

          {/* Content */}
          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              name="content"
              rows={6}
              value={formData.content}
              onChange={handleChange}
              placeholder="Enter blog content"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide content.
            </Form.Control.Feedback>
          </Form.Group>

          {/* Author */}
          <Form.Group className="mb-3">
            <Form.Label>Author</Form.Label>
            <Form.Control
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Enter author name"
            />
          </Form.Group>

          {/* Tags */}
          <Form.Group className="mb-3">
            <Form.Label>Tags</Form.Label>
            <div className="d-flex gap-2 mb-2">
              <Form.Control
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
              />
              <Button variant="outline-primary" onClick={handleTagAdd}>
                Add Tag
              </Button>
            </div>
            <div className="d-flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="badge bg-primary d-flex align-items-center gap-2"
                >
                  {tag}
                  <Button
                    variant="link"
                    className="p-0 text-white"
                    onClick={() => removeTag(tag)}
                  >
                    ×
                  </Button>
                </span>
              ))}
            </div>
          </Form.Group>

          {/* Image */}
          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <div className="d-flex flex-column">
              <Form.Control
                type="url"
                placeholder="Enter image URL"
                onChange={handleImageURLChange}
                className="mb-2"
              />
            </div>
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-2"
                style={{ maxWidth: '200px' }}
              />
            )}
          </Form.Group>

          {/* Publish */}
          <Form.Group className="mb-4">
            <Form.Check
              type="checkbox"
              name="isPublished"
              label="Publish immediately"
              checked={formData.isPublished}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Buttons */}
          <div className="d-flex gap-2">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Creating...
                </>
              ) : (
                'Create Blog'
              )}
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => (window.location.href = '/admin/blogs')}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default AdminBlogAdd;
