import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { getBlogDetails, updateBlog } from '../../actions/blog_actions';
import { useParams } from 'react-router-dom';

const AdminBlogEdit = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    tags: '',
    image: '',
    isPublished: false,
  });

  const dispatch = useDispatch();
  const { id } = useParams();

  const blogDetails = useSelector((state) => state.blogDetails);
  const { loading: detailsLoading, error: detailsError, blog } = blogDetails;

  const blogUpdate = useSelector((state) => state.blogUpdate);
  const { 
    loading: updateLoading, 
    error: updateError, 
    success: updateSuccess 
  } = blogUpdate;

  useEffect(() => {
    dispatch(getBlogDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || '',
        content: blog.content || '',
        author: blog.author || '',
        tags: blog.tags || '',
        image: blog.image || '',
        isPublished: blog.isPublished || false
      });
    }
  }, [blog]);

  useEffect(() => {
    if (updateSuccess) {
      window.location.href = '/admin/bloglist';
    }
  }, [updateSuccess]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(updateBlog(id, formData));
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
        <h1>Edit Blog</h1>
        <Button 
          variant="secondary"
          onClick={() => window.location.href = '/admin/bloglist'}
        >
          Back to Blogs
        </Button>
      </div>

      {detailsError && (
        <Alert variant="danger" className="mb-4">
          {detailsError}
        </Alert>
      )}

      {updateError && (
        <Alert variant="danger" className="mb-4">
          {updateError}
        </Alert>
      )}

      <Form onSubmit={submitHandler}>
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
        </Form.Group>

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
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Author</Form.Label>
          <Form.Control
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Enter author name"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tags</Form.Label>
          <Form.Control
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Enter Tag name"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Enter Image link"
            required
          />
        </Form.Group>

          <Form.Group className="mb-4">
            <Form.Check
              type="checkbox"
              name="isPublished"
              label="Publish immediately"
              checked={formData.isPublished}
              onChange={handleChange}
            />
          </Form.Group>

        <div className="d-flex gap-2">
          <Button 
            variant="success" 
            type="submit"
            disabled={updateLoading}
          >
            {updateLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Updating...
              </>
            ) : (
              'Update Blog'
            )}
          </Button>
          <Button 
            variant="outline-secondary"
            onClick={() => window.location.href = '/admin/bloglist'}
            disabled={updateLoading}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default AdminBlogEdit;