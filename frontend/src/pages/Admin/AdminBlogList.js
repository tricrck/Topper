import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Container, Button, Row, Col, Badge } from 'react-bootstrap';
import { listBlogs, deleteBlog } from '../../actions/blog_actions';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const AdminBlogList = () => {
  const dispatch = useDispatch();
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [statusFilter, setStatusFilter] = useState('all');

  const blogList = useSelector((state) => state.blogList);
  const { loading, error, blogs = [] } = blogList;

  const blogDelete = useSelector((state) => state.blogDelete);
  const { 
    loading: deleteLoading, 
    error: deleteError, 
    success: deleteSuccess 
  } = blogDelete;

  useEffect(() => {
    dispatch(listBlogs());
  }, [dispatch]);

  useEffect(() => {
    if (deleteSuccess) {
      dispatch(listBlogs());
    }
  }, [deleteSuccess, dispatch]);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      setDeleteInProgress(true);
      try {
        await dispatch(deleteBlog(id));
      } finally {
        setDeleteInProgress(false);
      }
    }
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredAndSortedBlogs = blogs
    .filter(blog => {
      const matchesSearch = (
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesStatus = statusFilter === 'all' ? true : 
        (statusFilter === 'published' ? blog.isPublished : !blog.isPublished);
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const getValue = (item) => {
        if (sortConfig.key === 'createdAt') {
          return new Date(item[sortConfig.key]).getTime();
        }
        return item[sortConfig.key];
      };
      
      const aValue = getValue(a);
      const bValue = getValue(b);
      
      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  if (loading) return <Loader />;

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="text-2xl font-bold">Manage Blogs</h1>
        </Col>
        <Col className="text-end">
          <Button 
            variant="success"
            href="/admin/blogs/create"
            className="shadow-sm"
          >
            Create New Blog
          </Button>
        </Col>
      </Row>

      {error && <Message variant="danger">{error}</Message>}
      {deleteError && <Message variant="danger">{deleteError}</Message>}

      <Row className="mb-4">
        <Col md={4}>
          <input
            type="text"
            placeholder="Search blogs..."
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <select 
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </Col>
        <Col md={4} className="text-end">
          <span className="text-muted">
            {filteredAndSortedBlogs.length} blogs found
          </span>
        </Col>
      </Row>

      {blogs.length === 0 ? (
        <Message variant="info">No blogs found. Create your first blog post!</Message>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover className="shadow-sm">
            <thead className="bg-light">
              <tr>
                <th onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
                  Title {getSortIcon('title')}
                </th>
                <th onClick={() => handleSort('author')} style={{ cursor: 'pointer' }}>
                  Author {getSortIcon('author')}
                </th>
                <th onClick={() => handleSort('createdAt')} style={{ cursor: 'pointer' }}>
                  Date {getSortIcon('createdAt')}
                </th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedBlogs.map((blog) => (
                <tr key={blog._id}>
                  <td className="align-middle">
                    {blog.title.length > 50
                      ? `${blog.title.substring(0, 50)}...`
                      : blog.title}
                  </td>
                  <td className="align-middle">{blog.author}</td>
                  <td className="align-middle">
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="align-middle">
                    <Badge bg={blog.isPublished ? "success" : "warning"}>
                      {blog.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </td>
                  <td className="text-center" style={{ width: '200px' }}>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      href={`/admin/blogs/edit/${blog._id}`}
                      disabled={deleteInProgress || deleteLoading}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => deleteHandler(blog._id)}
                      disabled={deleteInProgress || deleteLoading}
                    >
                      {(deleteInProgress || deleteLoading) ? (
                        <>
                          <Loader small />
                          <span className="ms-2">Deleting...</span>
                        </>
                      ) : (
                        'Delete'
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default AdminBlogList;