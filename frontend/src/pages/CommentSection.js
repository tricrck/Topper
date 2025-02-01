import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { 
    createComment, 
    listComments, 
    updateComment, 
    deleteComment,
} from '../actions/blog_actions';
import { fetchUserDetails } from '../actions/user_actions';
import Comment from './Comment';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const CommentSection = ({ blogId }) => {
    const dispatch = useDispatch();
    const [commentText, setCommentText] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');
    const [error, setError] = useState('');

    const { user } = useSelector((state) => state.auth);
    const { comments, loading, error: commentError } = useSelector(state => state.commentList);
    const { userDetails, userDetailsLoading } = useSelector((state) => state.users);
    const { loading: createLoading, error: createError } = useSelector(state => state.commentCreate);
    const { loading: updateLoading, error: updateError } = useSelector(state => state.commentUpdate);

    // Fetch comments on mount or when blogId changes
    useEffect(() => {
        dispatch(listComments(blogId));
    }, [dispatch, blogId]);

    // Fetch user details for comment authors
    useEffect(() => {
        if (comments?.length > 0) {
            const authorIds = new Set();
            const extractAuthors = (comment) => {
                authorIds.add(comment.author);
                comment.replies?.forEach(extractAuthors);
            };
            comments.forEach(extractAuthors);
            authorIds.forEach(authorId => {
                if (!userDetails[authorId]) {
                    dispatch(fetchUserDetails(authorId));
                }
            });
        }
    }, [dispatch, comments, userDetails]);

    // Handle comment submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!commentText.trim()) {
            setError('Comment cannot be empty');
            return;
        }
        dispatch(createComment(blogId, {
            content: commentText,
            author: user.uid
        })).then(() => {
            setCommentText('');
            setError('');
            dispatch(listComments(blogId));
        });
    };

    // Handle comment edit
    const handleEdit = (comment) => {
        setEditingId(comment?._id);
        setEditText(comment?.content || '');
    };

    // Handle comment update
    const handleUpdate = (commentId) => {
        if (!editText.trim()) {
            setError('Comment cannot be empty');
            return;
        }
        dispatch(updateComment(blogId, commentId, { content: editText })).then(() => {
            setEditingId(null);
            setEditText('');
            setError('');
            dispatch(listComments(blogId));
        });
    };

    // Handle comment deletion
    const handleDelete = (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            dispatch(deleteComment(blogId, commentId)).then(() => {
                dispatch(listComments(blogId));
            });
        }
    };

    // Handle reply to a comment
    const handleReply = (replyData) => {
        dispatch(createComment(blogId, replyData)).then(() => {
            dispatch(listComments(blogId));
        });
    };

    // Organize comments into a tree structure
    const organizeComments = (comments) => {
        const commentMap = new Map();
        const rootComments = [];

        comments?.forEach(comment => {
            commentMap.set(comment._id, { ...comment, replies: [] });
        });

        comments?.forEach(comment => {
            if (comment.parentComment) {
                const parent = commentMap.get(comment.parentComment);
                if (parent) {
                    parent.replies.push(commentMap.get(comment._id));
                }
            } else {
                rootComments.push(commentMap.get(comment._id));
            }
        });

        return rootComments;
    };

    const sortedComments = comments?.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const rootComments = organizeComments(sortedComments);

    return (
        <div className="comment-section">
            {user ? (
                <Card className="mb-4 shadow-sm">
                    <Card.Body>
                        <h5 className="mb-3">💬 Leave a Comment</h5>
                        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
                        {createError && <Alert variant="danger" dismissible onClose={() => setError('')}>{createError}</Alert>}
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
                                className="d-flex align-items-center"
                            >
                                {createLoading ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        Posting...
                                    </>
                                ) : 'Post Comment'}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            ) : (
                <Alert variant="info" className="shadow-sm">
                    🔒 Login from the header to leave a comment.
                </Alert>
            )}

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading comments...</span>
                    </Spinner>
                </div>
            ) : commentError ? (
                <Alert variant="danger" dismissible onClose={() => setError('')}>{commentError}</Alert>
            ) : (
                <TransitionGroup>
                    {rootComments.map(comment => (
                        <CSSTransition key={comment._id} timeout={300} classNames="fade">
                            <Comment
                                comment={comment}
                                blogId={blogId}
                                user={user}
                                onReply={handleReply}
                                userDetails={userDetails}
                                userDetailsLoading={userDetailsLoading}
                                handleDelete={handleDelete}
                                handleEdit={handleEdit}
                                handleUpdate={handleUpdate}
                                editingId={editingId}
                                updateLoading={updateLoading}
                                updateError={updateError}
                                editText={editText}
                                setEditText={setEditText}
                            />
                        </CSSTransition>
                    ))}
                </TransitionGroup>
            )}
        </div>
    );
};

export default CommentSection;