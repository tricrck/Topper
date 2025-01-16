import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { listBlogs } from '../actions/blog_actions';

const Blogs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const blogList = useSelector((state) => state.blogList);
  const { loading, error, blogs} = blogList || {};
  console.log(blogs)

  useEffect(() => {
    dispatch(listBlogs());
  }, [dispatch]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4">Latest Blog Posts</h1>
      
      {loading ? (
        <p>Loading ...</p>
      ) : error ? (
        <p>{error}</p>
      ) : Array.isArray(blogs) && blogs.length > 0 ? (
        <Row>
          {blogs.map((blog) => (
            <Col key={blog._id} sm={12} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Img 
                  variant="top" 
                  src={blog.image}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="mb-3">{blog.title}</Card.Title>
                  <div className="mb-3 text-muted">
                    <small>
                      <i className="bi bi-person-circle me-2"></i>
                      {blog.author}
                    </small>
                    <br />
                    <small>
                      <i className="bi bi-calendar3 me-2"></i>
                      {formatDate(blog.createdAt)}
                    </small>
                  </div>
                  <Button
                    variant="outline-primary"
                    className="mt-auto"
                    onClick={() => navigate(`/blogs/${blog._id}`)}
                  >
                    Read More
                    <i className="bi bi-arrow-right ms-2"></i>
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p>No blogs found</p>
      )}
    </Container>
  );
};

export default Blogs;