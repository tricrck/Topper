import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { getBlogDetails } from '../actions/blog_actions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import CommentSection from './CommentSection';
import BlogContent from './BlogContent';

const BlogDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [readTime, setReadTime] = useState(0);

    const blogDetails = useSelector((state) => state.blogDetails);
    const { loading, error, blog } = blogDetails;

    useEffect(() => {
        dispatch(getBlogDetails(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (blog?.content) {
            const words = blog.content.split(' ').length;
            setReadTime(Math.ceil(words / 200));
        }
    }, [blog]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return <Loader />;
    if (error) return <Message variant="danger">{error}</Message>;
    if (!blog) return <Message variant="info">Blog not found</Message>;

    return (
        <Container className="py-5">
            <Button 
                variant="outline-secondary" 
                onClick={() => navigate(-1)}
                className="mb-4"
            >
                <i className="bi bi-arrow-left me-2"></i>
                Back to Blogs
            </Button>

            <Card className="border-0 shadow-lg">
                {blog.image && (
                    <Card.Img 
                        variant="top" 
                        src={blog.image}
                        style={{ 
                            height: '50%',
                            width: 'auto', 
                            objectFit: 'cover',
                            borderTopLeftRadius: '0.5rem',
                            borderTopRightRadius: '0.5rem'
                        }}
                    />
                )}
                
                <Card.Body className="p-4 p-md-5">
                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                    <div className="mb-4">
                        {blog.tags.map((tag, index) => (
                            <Badge 
                                key={index}
                                bg="primary"
                                className="me-2 mb-2 px-3 py-2"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Title */}
                <Card.Title as="h1" className="mb-4">
                    {blog.title || 'Untitled Blog'}
                </Card.Title>

                {/* Metadata */}
                <Row className="mb-4 text-muted">
                    <Col md={6}>
                        <div className="d-flex align-items-center mb-3 mb-md-0">
                            <i className="bi bi-person-circle fs-4 me-2"></i>
                            <div>
                                <div>By {blog.author || 'Anonymous'}</div>
                                {blog.createdAt && (
                                    <small>
                                        Published on {formatDate(blog.createdAt)}
                                    </small>
                                )}
                            </div>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="d-flex align-items-center justify-content-md-end">
                            <i className="bi bi-clock me-2"></i>
                            <small>{readTime} min read</small>

                            {blog.updatedAt && (
                                <>
                                    <div className="mx-3">|</div>
                                    <i className="bi bi-calendar-check me-2"></i>
                                    <small>
                                        Last updated {formatDate(blog.updatedAt)}
                                    </small>
                                </>
                            )}
                        </div>
                    </Col>
                </Row>

                {/* Content */}
                <BlogContent content={blog.content} />

                <hr className="my-4" />

                <div className="d-flex justify-content-between align-items-left">
                    <div className="d-flex gap-2">
                        <Button variant="outline-primary">
                            <i className="bi bi-share me-2"></i>
                            Share
                        </Button>
                        <Button variant="primary">
                            <i className="bi bi-bookmark me-2"></i>
                            Save
                        </Button>
                    </div>
                </div>
            </Card.Body>
            </Card>

            <Card className="mt-4 shadow">
                <Card.Body>
                    <h3 className="mb-4">Comments ({blog.comments?.length || 0})</h3>
                    <CommentSection blogId={id} />
                </Card.Body>
            </Card>

            <style jsx="true">{`
                .blog-content {
                    font-size: 1.1rem;
                    line-height: 1.8;
                    color: #2c3e50;
                }
                
                .blog-content p {
                    margin-bottom: 1.5rem;
                }
            `}</style>
        </Container>
    );
};

export default BlogDetails;