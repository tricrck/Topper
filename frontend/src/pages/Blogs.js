import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Row, Col, Card, Button, 
  Spinner, Alert, Stack 
} from 'react-bootstrap';
import { Calendar, User2, ArrowRight, BookOpen } from 'lucide-react';
import { listBlogs } from '../actions/blog_actions';

const BlogCard = ({ blog, navigate }) => {
  const formatDate = (dateString) => 
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

  return (
    <Col xs={12} md={6} lg={4} className="mb-4">
      <Card className="h-100 shadow-hover">
        <div className="ratio ratio-16x9">
          <Card.Img
            variant="top"
            src={blog.image}
            alt={blog.title}
            className="object-fit-cover"
          />
        </div>
        
        <Card.Body className="d-flex flex-column">
          <Stack gap={3}>
            <div>
              <Card.Title className="h5 mb-3">{blog.title}</Card.Title>
              
              <Stack gap={2} className="text-muted small">
                <div className="d-flex align-items-center">
                  <User2 size={16} className="me-2" />
                  <span>{blog.author}</span>
                </div>
                <div className="d-flex align-items-center">
                  <Calendar size={16} className="me-2" />
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
              </Stack>
            </div>

            <Button 
              variant="outline-primary" 
              className="d-flex align-items-center justify-content-between mt-auto"
              onClick={() => navigate(`/blogs/${blog._id}`)}
            >
              <span>Continue Reading</span>
              <ArrowRight size={18} />
            </Button>
          </Stack>
        </Card.Body>
      </Card>
    </Col>
  );
};

const Blogs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, blogs } = useSelector(state => state.blogList);
  // Sort blogs from latest to oldest
  const sortedBlogs = blogs ? [...blogs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];

  useEffect(() => {
    dispatch(listBlogs());
  }, [dispatch]);

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center gap-3 mb-3">
            <BookOpen size={32} className="text-primary" />
            <h1 className="display-6 mb-0">Insights & Articles</h1>
          </div>
          <p className="text-muted">Exploring ideas through thoughtful writing</p>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="grow" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3 text-muted">Curating knowledge base...</p>
        </div>
      ) : error ? (
        <Alert variant="danger" className="rounded-3">
          <Alert.Heading>Connection Error</Alert.Heading>
          <p>Unable to fetch articles: {error}</p>
        </Alert>
      ) : sortedBlogs?.length > 0 ? (
        <Row>
          {sortedBlogs.map(blog => (
            <BlogCard key={blog._id} blog={blog} navigate={navigate} />
          ))}
        </Row>
      ) : (
        <Alert variant="info" className="rounded-3">
          No articles available. Check back later!
        </Alert>
      )}
    </Container>
  );
};

export default Blogs;