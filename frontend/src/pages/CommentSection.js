import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Form, Alert } from 'react-bootstrap';
import { 
    createComment, 
    listComments, 
    updateComment, 
    deleteComment,
    likeComment,
    unlikeComment
} from '../actions/blog_actions';
import { fetchUserDetails } from '../actions/user_actions';
import { Edit, Trash, ThumbsUp, MessageCircle } from "lucide-react";

// Separate Comment component to handle individual comments and their replies
const Comment = ({ 
    comment, 
    blogId, 
    user, 
    level = 0,
    onReply,
    userDetails,
    userDetailsLoading,
    handleDelete,
    handleEdit,
    handleUpdate,
    editingId,
    updateLoading,
    updateError,
    editText,
    setEditText
}) => {
    const dispatch = useDispatch();
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyText, setReplyText] = useState('');
    const maxLevel = 3; // Maximum nesting level

    const authorDetails = userDetails[comment.author] || null;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleLikeToggle = () => {
        if (!user) return; // Add guard clause for user
        
        const likes = comment.likes || []; // Add default empty array if likes is undefined
        if (likes.includes(user.uid)) {
            dispatch(unlikeComment(blogId, comment._id, user.uid));
        } else {
            dispatch(likeComment(blogId, comment._id, user.uid));
        }
    };

    const handleReplySubmit = (e) => {
        e.preventDefault();
        if (replyText.trim()) {
            onReply({
                content: replyText,
                author: user.uid,
                parentComment: comment._id
            });
            setReplyText('');
            setShowReplyForm(false);
        }
    };

    return (
        <Card className={`mb-3 ${level > 0 ? 'ms-4' : ''}`}>
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                    <div className="d-flex align-items-center">
                        <img 
                            src={authorDetails?.photoURL || '/default-avatar.png'}
                            alt={authorDetails?.displayName || 'User'}
                            className="rounded-circle me-2"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        />
                        <div>
                            <h6 className="mb-0">
                                {userDetailsLoading 
                                    ? 'Loading...' 
                                    : authorDetails?.displayName || 
                                      authorDetails?.email || 
                                      'Anonymous User'
                                }
                            </h6>
                            <small className="text-muted">
                                {formatDate(comment.createdAt)}
                                {comment.updatedAt !== comment.createdAt && ' (edited)'}
                            </small>
                        </div>
                    </div>

                    {user && user.uid === comment.author && (
                        <div className="btn-group">
                            <Button 
                                variant="link" 
                                size="sm"
                                onClick={() => handleEdit(comment)}
                            >
                                <Edit size={20} />
                            </Button>
                            <Button 
                                variant="link" 
                                size="sm" 
                                className="text-danger"
                                onClick={() => handleDelete(comment._id)}
                            >
                                <Trash size={20} />
                            </Button>
                        </div>
                    )}
                </div>

                {editingId === comment._id ? (
                    <div className="mt-3">
                        {updateError && <Alert variant="danger">{updateError}</Alert>}
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
                                onClick={() => handleEdit(null)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="mt-3">
                        {comment.content.split('\n').map((paragraph, index) => (
                            <p key={index} className="mb-2">{paragraph}</p>
                        ))}
                    </div>
                )}

                <div className="d-flex gap-3 align-items-center mt-3">
                    {user && (
                        <Button
                            variant="link"
                            className={`d-flex align-items-center gap-1 p-0 ${
                                (comment.likes || []).includes(user.uid) ? 'text-primary' : 'text-muted'
                            }`}
                            onClick={handleLikeToggle}
                        >
                            <ThumbsUp 
                                size={18}
                                className={(comment.likes || []).includes(user.uid) ? 'fill-current' : ''}
                            />
                            <span className="text-sm font-medium">
                                {(comment.likes || []).length > 0 
                                    ? `${comment.likes.length} Likes` 
                                    : 'Like'}
                            </span>
                        </Button>
                    )}

                    {user && level < maxLevel && (
                        <Button
                            variant="link"
                            className="d-flex align-items-center gap-1 text-muted p-0"
                            onClick={() => setShowReplyForm(!showReplyForm)}
                        >
                            <MessageCircle size={18} />
                            <span className="text-sm font-medium">Reply</span>
                        </Button>
                    )}
                </div>

                {showReplyForm && (
                    <Form onSubmit={handleReplySubmit} className="mt-3">
                        <Form.Group>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write your reply..."
                                required
                            />
                        </Form.Group>
                        <div className="d-flex gap-2 mt-2">
                            <Button type="submit" size="sm">
                                Submit Reply
                            </Button>
                            <Button 
                                type="button" 
                                size="sm" 
                                variant="secondary"
                                onClick={() => setShowReplyForm(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </Form>
                )}

                {/* Render nested replies */}
                {comment.replies && comment.replies.map(reply => (
                    <Comment
                        key={reply._id}
                        comment={reply}
                        blogId={blogId}
                        user={user}
                        level={level + 1}
                        onReply={onReply}
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
                ))}
            </Card.Body>
        </Card>
    );
};

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

    useEffect(() => {
        dispatch(listComments(blogId));
    }, [dispatch, blogId]);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!commentText.trim()) {
            setError('Comment cannot be empty');
            return;
        }
        dispatch(createComment(blogId, {
            content: commentText,
            author: user.uid
        }));
        setCommentText('');
        setError('');
    };

    const handleEdit = (comment) => {
        setEditingId(comment?._id);
        setEditText(comment?.content || '');
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

    const handleReply = (replyData) => {
        dispatch(createComment(blogId, replyData));
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

    const rootComments = organizeComments(comments);

    return (
        <div className="comment-section">
            {user ? (
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

            {loading ? (
                <div className="text-center">Loading comments...</div>
            ) : commentError ? (
                <Alert variant="danger">{commentError}</Alert>
            ) : (
                rootComments.map(comment => (
                    <Comment
                        key={comment._id}
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
                ))
            )}
        </div>
    );
};

export default CommentSection;