import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Container, Form, Button, Alert, Spinner, Card,
  Row, Col, Badge
} from 'react-bootstrap';
import { 
  Image as ImageIcon, 
  Tag as TagIcon,
  X as XIcon,
  ArrowLeft as ArrowLeftIcon,
  Save as SaveIcon,
  Eye as EyeIcon
} from 'lucide-react';
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
  const [showPreview, setShowPreview] = useState(false);

  const blogCreate = useSelector((state) => state.blogCreate);
  const { loading, error, success } = blogCreate;

  useEffect(() => {
    if (success) {
      window.location.href = '/admin/bloglist';
    }
  }, [success]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
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

  const BlogPreview = () => (
    <Card className="mb-4">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Preview</h5>
      </Card.Header>
      <Card.Body>
        {previewImage && (
          <img
            src={previewImage}
            alt="Blog preview"
            className="w-100 mb-3"
            style={{ maxHeight: '300px', objectFit: 'cover' }}
          />
        )}
        <h2>{formData.title || 'Untitled Blog'}</h2>
        <div className="text-muted mb-2">By {formData.author}</div>
        <div className="mb-3">
          {formData.tags.map((tag, index) => (
            <Badge bg="secondary" className="me-1" key={index}>
              {tag}
            </Badge>
          ))}
        </div>
        <p style={{ whiteSpace: 'pre-wrap' }}>{formData.content}</p>
      </Card.Body>
    </Card>
  );

  return (
    <Container className="my-4">
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 mb-0">Create New Blog</h1>
            <div className="d-flex gap-2">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                <EyeIcon size={16} className="me-1" />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => window.location.href = '/admin/bloglist'}
              >
                <ArrowLeftIcon size={16} className="me-1" />
                Back to Blogs
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          <Row>
            <Col md={showPreview ? 6 : 12}>
              <Form noValidate validated={validated} onSubmit={submitHandler}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter an engaging title"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a title.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Content</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="content"
                    rows={8}
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Write your blog content here..."
                    required
                    className="font-monospace"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide content.
                  </Form.Control.Feedback>
                </Form.Group>

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

                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center">
                    <TagIcon size={16} className="me-2" />
                    Tags
                  </Form.Label>
                  <div className="d-flex gap-2 mb-2">
                    <Form.Control
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add a tag"
                      onKeyPress={(e) => e.key === 'Enter' && handleTagAdd(e)}
                    />
                    <Button variant="outline-primary" onClick={handleTagAdd}>
                      Add
                    </Button>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge 
                        bg="primary" 
                        className="d-flex align-items-center py-2 px-3"
                        key={index}
                      >
                        {tag}
                        <XIcon
                          size={14}
                          className="ms-2 cursor-pointer"
                          onClick={() => removeTag(tag)}
                          style={{ cursor: 'pointer' }}
                        />
                      </Badge>
                    ))}
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center">
                    <ImageIcon size={16} className="me-2" />
                    Featured Image
                  </Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="Enter image URL"
                    value={formData.image}
                    onChange={handleImageURLChange}
                    className="mb-2"
                  />
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="mt-2 rounded"
                      style={{ maxWidth: '200px' }}
                    />
                  )}
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Check
                    type="switch"
                    id="publish-switch"
                    name="isPublished"
                    label="Publish immediately"
                    checked={formData.isPublished}
                    onChange={handleChange}
                  />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={loading}
                    className="d-flex align-items-center"
                  >
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
                      <>
                        <SaveIcon size={16} className="me-2" />
                        Create Blog
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => window.location.href = '/admin/blogs'}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Col>
            {showPreview && (
              <Col md={6}>
                <BlogPreview />
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminBlogAdd;