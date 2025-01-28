import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Badge, Dropdown, Modal, Spinner } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../actions/user_actions';
import { listComments, listBlogs } from '../actions/blog_actions';
import { Bell, UserCircle, Settings, FileText, Folder, MessageSquare, LogOut } from 'lucide-react';
import Profile from '../pages/Profile';

const AdminHeader = () => {
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [allComments, setAllComments] = useState([]);

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { blogs, loading: blogsLoading } = useSelector((state) => state.blogList);
  const { comments, loading: commentsLoading } = useSelector((state) => state.commentList);

  // Fetch blogs
  useEffect(() => {
    dispatch(listBlogs());
  }, [dispatch]);

  // Fetch comments for each blog
  useEffect(() => {
    if (blogs?.length > 0) {
      blogs.forEach((blog) => {
        dispatch(listComments(blog._id));
      });
    }
  }, [dispatch, blogs]);

  // Accumulate comments from all blogs
  useEffect(() => {
    if (comments?.length > 0) {
      setAllComments(prevComments => {
        // Create a Map of existing comments using _id as key
        const existingCommentsMap = new Map(prevComments.map(comment => [comment._id, comment]));
        
        // Add new comments if they don't exist
        comments.forEach(comment => {
          if (!existingCommentsMap.has(comment._id)) {
            existingCommentsMap.set(comment._id, comment);
          }
        });
        
        // Convert Map back to array
        const updatedComments = Array.from(existingCommentsMap.values());
        return updatedComments;
      });
    }
  }, [comments]);

  // Process accumulated comments and prepare notifications
  useEffect(() => {
    if (allComments.length > 0 && user?.lastLoginAt) {
      
      const lastLoginTimestamp = new Date(Number(user.lastLoginAt)).getTime();
      
      // Get all comments after last login
      const newComments = allComments
        .filter((comment) => {
          const commentDate = new Date(comment.createdAt).getTime();
          const isNew = commentDate > lastLoginTimestamp;
          
          return isNew;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Take the 5 most recent comments
      const recentComments = newComments.slice(0, 5);
      

      const commentNotifications = recentComments.map((comment) => {
        const timeDiff = Math.floor((new Date() - new Date(comment.createdAt)) / (1000 * 60));
        const notification = {
          id: comment._id,
          text: `Blog: "${comment.content.substring(0, 30)}..."`,
          time: `${timeDiff}m ago`,
          blogId: comment.blog,
        };
        return notification;
      });
      setNotifications(commentNotifications);
    } else {
      console.log('No comments or user last login time available:', {
        commentsExist: Boolean(allComments.length),
        lastLoginExists: Boolean(user?.lastLoginAt)
      });
    }
  }, [allComments, user?.lastLoginAt]);

  const handleLogout = () => {
    dispatch(logout());
    setShowModal(false);
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" className="py-2 shadow-sm">
        <Container fluid>
          <Navbar.Brand href="/admin/" className="d-flex align-items-center">
            <Settings size={20} className="me-2" />
            <span className="fw-bold">Admin Panel</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="admin-navbar" />
          <Navbar.Collapse id="admin-navbar">
            <Nav className="me-auto">
              <Nav.Link href="/admin/bloglist" className="d-flex align-items-center">
                <FileText size={16} className="me-1" />
                Blogs
              </Nav.Link>
              <Nav.Link href="/admin/portfoliolist" className="d-flex align-items-center">
                <Folder size={16} className="me-1" />
                Portfolios
              </Nav.Link>
              <Nav.Link href="/admin/testimonialist" className="d-flex align-items-center">
                <MessageSquare size={16} className="me-1" />
                Testimonials
              </Nav.Link>
            </Nav>

            <Nav>
              <Dropdown align="end" className="me-3">
                <Dropdown.Toggle variant="link" className="nav-link text-light position-relative">
                  <Bell size={20} />
                  {notifications.length > 0 && (
                    <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle rounded-pill">
                      {notifications.length}
                    </Badge>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown-menu-dark">
                  <Dropdown.Header>Notifications</Dropdown.Header>
                  {commentsLoading || blogsLoading ? (
                    <Dropdown.Item className="text-center">
                      <Spinner animation="border" size="sm" />
                    </Dropdown.Item>
                  ) : notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <Dropdown.Item key={notification.id} href={`/blogs/${notification.blogId}`}>
                        <div className="d-flex flex-column">
                          <span>{notification.text}</span>
                          <small className="text-muted">{notification.time}</small>
                        </div>
                      </Dropdown.Item>
                    ))
                  ) : (
                    <Dropdown.Item className="text-muted">No new notifications</Dropdown.Item>
                  )}
                  <Dropdown.Divider />
                  <Dropdown.Item className="text-center">View All</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown align="end">
                <Dropdown.Toggle variant="link" className="nav-link text-light d-flex align-items-center">
                  <UserCircle size={20} className="me-2" />
                  <span>Admin</span>
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown-menu-dark">
                  <Dropdown.Item onClick={() => setShowModal(true)}>
                    <UserCircle size={16} className="me-2" />
                    My Profile
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    <LogOut size={16} className="me-2" />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Profile onLogout={handleLogout} />
        </Modal.Body>
      </Modal>
    </header>
  );
};

export default AdminHeader;