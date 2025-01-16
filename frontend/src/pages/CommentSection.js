// CommentSection.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Form, Alert } from 'react-bootstrap';
import { 
    createComment, 
    listComments, 
    updateComment, 
    deleteComment 
} from '../actions/blog_actions';

const CommentSection = ({ blogId }) => {
    const dispatch = useDispatch();
    const [commentText, setCommentText] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [error, setError] = useState('');

    // Get current user from Redux store
    // const userLogin = useSelector(state => state.userLogin);
    // const { userInfo } = userLogin;

    const userInfo = {
        _id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://via.placeholder.com/40',
        isAdmin: true
    };

    // Get comments from Redux store
    const commentList = useSelector(state => state.commentList);
    const { loading, error: commentError, comments } = commentList;

    // Get comment create status
    const commentCreate = useSelector(state => state.commentCreate);
    const { 
        loading: createLoading, 
        error: createError, 
        success: createSuccess 
    } = commentCreate;

    // Get comment update status
    const commentUpdate = useSelector(state => state.commentUpdate);
    const { 
        loading: updateLoading, 
        error: updateError, 
        success: updateSuccess 
    } = commentUpdate;

    // Get comment delete status
    const commentDelete = useSelector(state => state.commentDelete);
    const { 
        loading: deleteLoading, 
        error: deleteError, 
        success: deleteSuccess 
    } = commentDelete;

    useEffect(() => {
        dispatch(listComments(blogId));
    }, [dispatch, blogId, createSuccess, updateSuccess, deleteSuccess]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!commentText.trim()) {
            setError('Comment cannot be empty');
            return;
        }
        dispatch(createComment(blogId, {
            content: commentText,
            author: userInfo._id
        }));
        setCommentText('');
        setError('');
    };

    const handleEdit = (comment) => {
        setEditingId(comment._id);
        setEditText(comment.content);
    };

    const handleUpdate = (commentId) => {
        if (!editText.trim()) {
            setError('Comment cannot be empty');
            return;
        }
        dispatch(updateComment(blogId, commentId, { content: editText }));
        setEditingId(null);
        setEditText('');
        setError('');
    };

    const handleDelete = (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            dispatch(deleteComment(blogId, commentId));
        }
    };

    return (
        <div className="comment-section">
            {/* Comment Form */}
            {userInfo ? (
                <Card className="mb-4">
                    <Card.Body>
                        <h5 className="mb-3">Leave a Comment</h5>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {createError && <Alert variant="danger">{createError}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Write your comment here..."
                                    disabled={createLoading}
                                />
                            </Form.Group>
                            <Button 
                                type="submit" 
                                variant="primary"
                                disabled={createLoading}
                            >
                                {createLoading ? 'Posting...' : 'Post Comment'}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            ) : (
                <Alert variant="info">
                    Please <a href="/login">login</a> to leave a comment.
                </Alert>
            )}

            {/* Comments List */}
            {loading ? (
                <div className="text-center">Loading comments...</div>
            ) : commentError ? (
                <Alert variant="danger">{commentError}</Alert>
            ) : (
                comments?.map((comment) => (
                    <Card key={comment._id} className="mb-3">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-start">
                                <div className="d-flex align-items-center">
                                    <img 
                                        src={comment.author.avatar || '/default-avatar.png'}
                                        alt={comment.author.name}
                                        className="rounded-circle me-2"
                                        style={{ width: '40px', height: '40px' }}
                                    />
                                    <div>
                                        <h6 className="mb-0">{comment.author.name}</h6>
                                        <small className="text-muted">
                                            {formatDate(comment.createdAt)}
                                            {comment.updatedAt !== comment.createdAt && 
                                                ' (edited)'}
                                        </small>
                                    </div>
                                </div>
                                {userInfo && userInfo._id === comment.author._id && (
                                    <div className="btn-group">
                                        <Button 
                                            variant="link" 
                                            size="sm"
                                            onClick={() => handleEdit(comment)}
                                            disabled={updateLoading}
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </Button>
                                        <Button 
                                            variant="link" 
                                            size="sm" 
                                            className="text-danger"
                                            onClick={() => handleDelete(comment._id)}
                                            disabled={deleteLoading}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {editingId === comment._id ? (
                                <div className="mt-3">
                                    {updateError && 
                                        <Alert variant="danger">{updateError}</Alert>}
                                    <Form.Group className="mb-2">
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            disabled={updateLoading}
                                        />
                                    </Form.Group>
                                    <div className="d-flex gap-2">
                                        <Button 
                                            size="sm" 
                                            onClick={() => handleUpdate(comment._id)}
                                            disabled={updateLoading}
                                        >
                                            {updateLoading ? 'Updating...' : 'Update'}
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant="secondary"
                                            onClick={() => setEditingId(null)}
                                            disabled={updateLoading}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-3">
                                    {comment.content.split('\n').map((paragraph, index) => (
                                        <p key={index} className="mb-2">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            )}

                            <div className="mt-3 d-flex gap-3">
                                <Button 
                                    variant="link" 
                                    className="p-0 text-muted"
                                    onClick={() => {}}
                                >
                                    <i className="bi bi-hand-thumbs-up me-1"></i>
                                    Like
                                </Button>
                                <Button 
                                    variant="link" 
                                    className="p-0 text-muted"
                                    onClick={() => setShowReplyForm(!showReplyForm)}
                                >
                                    <i className="bi bi-reply me-1"></i>
                                    Reply
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                ))
            )}

            <style jsx="true">{`
                .comment-section {
                    margin-top: 2rem;
                }
                .btn-link {
                    text-decoration: none;
                }
                .comment-body {
                    white-space: pre-line;
                }
            `}</style>
        </div>
    );
};

export default CommentSection;