import React, { useState, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { 
    listComments, 
    likeComment,
    unlikeComment
} from '../actions/blog_actions';
import { 
    ChevronUp, 
    ChevronDown, 
    MessageSquare, 
    MoreHorizontal,
    MinusSquare,
    PlusSquare
} from "lucide-react";

const Comment = React.memo(({ 
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
    const [isCollapsed, setIsCollapsed] = useState(false);
    const maxLevel = 15; // Reddit allows deep nesting

    const authorDetails = useMemo(() => 
        userDetails[comment.author] || null, 
        [userDetails, comment.author]
    );

    const formatDate = useCallback((dateString) => {
        const diff = new Date() - new Date(dateString);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (hours < 24) return `${hours} hours ago`;
        if (days < 30) return `${days} days ago`;
        if (months < 12) return `${months} months ago`;
        return `${years} years ago`;
    }, []);

    const handleUpvote = useCallback(() => {
        if (!user) return;
        const likes = comment.likes || [];
        if (!likes.includes(user.uid)) {
            dispatch(likeComment(blogId, comment._id, user.uid));
        }
    }, [user, blogId, comment, dispatch]);

    const handleDownvote = useCallback(() => {
        if (!user) return;
        const likes = comment.likes || [];
        if (likes.includes(user.uid)) {
            dispatch(unlikeComment(blogId, comment._id, user.uid));
        }
    }, [user, blogId, comment, dispatch]);

    const handleReplySubmit = useCallback((e) => {
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
        dispatch(listComments(blogId));
    }, [replyText, user, comment, onReply, dispatch, blogId]);

    const [showOptions, setShowOptions] = useState(false);

    return (
        <div className={`position-relative ${level > 0 ? 'ms-4 ps-2' : ''}`}>
            {level > 0 && (
                <div 
                    className="position-absolute h-100" 
                    style={{ 
                        left: 0, 
                        width: '2px', 
                        backgroundColor: '#dee2e6',
                        cursor: 'pointer'
                    }}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                />
            )}
            <div className="d-flex">
                {/* Voting arrows */}
                <div className="d-flex flex-column align-items-center me-2" style={{ minWidth: '30px' }}>
                    <Button 
                        variant="link" 
                        className="p-0 text-muted"
                        onClick={handleUpvote}
                    >
                        <ChevronUp 
                            size={20} 
                            className={comment.likes?.includes(user?.uid) ? 'text-danger' : ''}
                        />
                    </Button>
                    <span className="small fw-bold">
                        {(comment.likes?.length || 0)}
                    </span>
                    <Button 
                        variant="link" 
                        className="p-0 text-muted"
                        onClick={handleDownvote}
                    >
                        <ChevronDown size={20} />
                    </Button>
                </div>

                <div className="flex-grow-1">
                    {/* Comment header */}
                    <div className="d-flex align-items-center mb-1">
                        <Button
                            variant="link"
                            className="p-0 me-2"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                        >
                            {isCollapsed ? (
                                <PlusSquare size={16} className="text-muted" />
                            ) : (
                                <MinusSquare size={16} className="text-muted" />
                            )}
                        </Button>
                        <span className="fw-bold me-2">
                            {userDetailsLoading ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                authorDetails?.displayName || 'u/anonymous'
                            )}
                        </span>
                        <span className="text-muted small">
                            {formatDate(comment.createdAt)}
                            {comment.updatedAt !== comment.createdAt && ' (edited)'}
                        </span>
                        
                        {user && user.uid === comment.author && (
                            <div className="position-relative ms-2">
                                <Button
                                    variant="link"
                                    className="p-0 text-muted"
                                    onClick={() => setShowOptions(!showOptions)}
                                >
                                    <MoreHorizontal size={16} />
                                </Button>
                                {showOptions && (
                                    <Card className="position-absolute shadow-sm" style={{ right: 0, zIndex: 1000, top: '20px' }}>
                                        <Button 
                                            variant="link" 
                                            className="text-dark text-decoration-none py-1 px-3"
                                            onClick={() => {
                                                handleEdit(comment);
                                                setShowOptions(false);
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button 
                                            variant="link" 
                                            className="text-danger text-decoration-none py-1 px-3"
                                            onClick={() => {
                                                handleDelete(comment._id);
                                                setShowOptions(false);
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </Card>
                                )}
                            </div>
                        )}
                    </div>

                    {!isCollapsed && (
                        <>
                            {/* Comment content */}
                            {editingId === comment._id ? (
                                <div className="mt-2">
                                    {updateError && <Alert variant="danger">{updateError}</Alert>}
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        disabled={updateLoading}
                                        className="mb-2"
                                    />
                                    <div className="d-flex gap-2">
                                        <Button 
                                            variant="primary"
                                            size="sm" 
                                            onClick={() => handleUpdate(comment._id)}
                                            disabled={updateLoading}
                                        >
                                            {updateLoading ? <Spinner animation="border" size="sm" /> : 'Save edits'}
                                        </Button>
                                        <Button 
                                            variant="secondary" 
                                            size="sm"
                                            onClick={() => handleEdit(null)}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-1">
                                    <div style={{ fontSize: '0.9rem' }}>
                                        {comment.content.split('\n').map((paragraph, index) => (
                                            <p key={index} className="mb-2">{paragraph}</p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Comment actions */}
                            <div className="d-flex gap-3 mt-1 mb-2">
                                {user && level < maxLevel && (
                                    <Button
                                        variant="link"
                                        className="p-0 text-muted d-flex align-items-center"
                                        style={{ fontSize: '0.8rem' }}
                                        onClick={() => setShowReplyForm(!showReplyForm)}
                                    >
                                        <MessageSquare size={14} className="me-1" />
                                        Reply
                                    </Button>
                                )}
                            </div>

                            {/* Reply form */}
                            {showReplyForm && (
                                <Form onSubmit={handleReplySubmit} className="mt-2">
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="What are your thoughts?"
                                        required
                                        className="mb-2"
                                    />
                                    <div className="d-flex gap-2">
                                        <Button type="submit" variant="primary" size="sm">
                                            Reply
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant="secondary" 
                                            size="sm"
                                            onClick={() => setShowReplyForm(false)}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </Form>
                            )}

                            {/* Nested comments */}
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
});

export default Comment;