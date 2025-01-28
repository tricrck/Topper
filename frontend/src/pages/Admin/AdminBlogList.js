import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Table, Container, Button, Row, Col, Badge, Card,
  Form, InputGroup, Alert
} from 'react-bootstrap';
import { 
  PlusCircle,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Edit2,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { listBlogs, deleteBlog } from '../../actions/blog_actions';
import Loader from '../../components/Loader';

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

  const deleteHandler = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
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

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown size={16} />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />;
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

  if (loading) return <Loader />;

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Body>
          <Row className="mb-4 align-items-center">
            <Col>
              <h1 className="h3 mb-0">Manage Blogs</h1>
            </Col>
            <Col xs="auto">
              <Button 
                variant="success"
                href="/admin/blogs/create"
                className="d-flex align-items-center gap-2"
              >
                <PlusCircle size={18} />
                Create New Blog
              </Button>
            </Col>
          </Row>

          {(error || deleteError) && (
            <Alert variant="danger" className="d-flex align-items-center gap-2 mb-4">
              <AlertCircle size={18} />
              {error || deleteError}
            </Alert>
          )}

          <Row className="mb-4 g-3">
            <Col md={5}>
              <InputGroup>
                <InputGroup.Text className="bg-white">
                  <Search size={18} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by title or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text className="bg-white">
                  <Filter size={18} />
                </InputGroup.Text>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </Form.Select>
              </InputGroup>
            </Col>
            <Col md={3} className="text-end d-flex align-items-center justify-content-end">
              <span className="text-muted">
                {filteredAndSortedBlogs.length} blog{filteredAndSortedBlogs.length !== 1 ? 's' : ''} found
              </span>
            </Col>
          </Row>

          {blogs.length === 0 ? (
            <Card className="text-center p-5 bg-light">
              <Card.Body>
                <h4>No blogs found</h4>
                <p className="text-muted mb-4">Get started by creating your first blog post!</p>
                <Button 
                  variant="success"
                  href="/admin/blogs/create"
                  className="d-inline-flex align-items-center gap-2"
                >
                  <PlusCircle size={18} />
                  Create New Blog
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead className="bg-light">
                  <tr>
                    <th onClick={() => handleSort('title')} style={{ cursor: 'pointer' }} className="py-3">
                      <div className="d-flex align-items-center gap-2">
                        Title
                        {getSortIcon('title')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('author')} style={{ cursor: 'pointer' }} className="py-3">
                      <div className="d-flex align-items-center gap-2">
                        Author
                        {getSortIcon('author')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('createdAt')} style={{ cursor: 'pointer' }} className="py-3">
                      <div className="d-flex align-items-center gap-2">
                        Date
                        {getSortIcon('createdAt')}
                      </div>
                    </th>
                    <th className="py-3">Status</th>
                    <th className="text-center py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedBlogs.map((blog) => (
                    <tr key={blog._id}>
                      <td className="py-3">
                        <div className="d-flex align-items-center">
                          {blog.image && (
                            <img 
                              src={blog.image} 
                              alt={blog.title}
                              className="me-3 rounded"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                          )}
                          <div>
                            {blog.title.length > 50
                              ? `${blog.title.substring(0, 50)}...`
                              : blog.title}
                          </div>
                        </div>
                      </td>
                      <td className="py-3">{blog.author}</td>
                      <td className="py-3">
                        {new Date(blog.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="py-3">
                        <Badge 
                          bg={blog.isPublished ? "success" : "warning"}
                          className="px-3 py-2"
                        >
                          {blog.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </td>
                      <td className="text-center py-3">
                        <div className="d-flex gap-2 justify-content-center">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            href={`/admin/blogs/edit/${blog._id}`}
                            disabled={deleteInProgress || deleteLoading}
                            className="d-flex align-items-center gap-2"
                          >
                            <Edit2 size={14} />
                            Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => deleteHandler(blog._id, blog.title)}
                            disabled={deleteInProgress || deleteLoading}
                            className="d-flex align-items-center gap-2"
                          >
                            {(deleteInProgress || deleteLoading) ? (
                              <>
                                <Loader small />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 size={14} />
                                Delete
                              </>
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminBlogList;