import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Container, Button, Row, Col, Pagination } from 'react-bootstrap';
import { listTestimonials, deleteTestimonial } from '../../actions/testimonial_actions';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { Search, Edit, Trash, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';

const AdminTestimonyList = () => {
  const dispatch = useDispatch();
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const testimonialsPerPage = 10;

  const testimonialsList = useSelector((state) => state.testimonialsList);
  const { loading, error, testimonials = [] } = testimonialsList;

  const testimonialDelete = useSelector((state) => state.testimonialDelete);
  const {
    loading: deleteLoading,
    error: deleteError,
    success: deleteSuccess
  } = testimonialDelete;

  useEffect(() => {
    dispatch(listTestimonials());
  }, [dispatch]);

  useEffect(() => {
    if (deleteSuccess) {
      dispatch(listTestimonials());
    }
  }, [deleteSuccess, dispatch]);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimony?')) {
      setDeleteInProgress(true);
      try {
        await dispatch(deleteTestimonial(id));
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

  const filteredAndSortedTestimonials = testimonials
    .filter(testimony =>
      testimony.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimony.testimonial.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortConfig.direction === 'asc') {
        return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
      }
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    });

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown />;
    return sortConfig.direction === 'asc' ? <ArrowUp /> : <ArrowDown />;
  };

  const indexOfLastTestimonial = currentPage * testimonialsPerPage;
  const indexOfFirstTestimonial = indexOfLastTestimonial - testimonialsPerPage;
  const currentTestimonials = filteredAndSortedTestimonials.slice(indexOfFirstTestimonial, indexOfLastTestimonial);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <Loader />;

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="text-2xl font-bold">Manage Testimonials</h1>
        </Col>
        <Col className="text-end">
          <Button
            variant="success"
            href="/admin/testimonial/create"
            className="shadow-sm"
          >
            Add New Testimony
          </Button>
        </Col>
      </Row>

      {error && <Message variant="danger">{error}</Message>}
      {deleteError && <Message variant="danger">{deleteError}</Message>}

      <Row className="mb-4">
        <Col md={6}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Search testimonials..."
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="input-group-text">
              <Search />
            </span>
          </div>
        </Col>
        <Col md={6} className="text-end">
          <span className="text-muted">
            {filteredAndSortedTestimonials.length} testimonials found
          </span>
        </Col>
      </Row>

      {testimonials.length === 0 ? (
        <Message variant="info">No testimonials found. Add a Testimony!</Message>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover className="shadow-sm">
            <thead className="bg-light">
              <tr>
                <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                  Name {getSortIcon('name')}
                </th>
                <th onClick={() => handleSort('testimonial')} style={{ cursor: 'pointer' }}>
                  Testimonial {getSortIcon('testimonial')}
                </th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTestimonials.map((testimony) => (
                <tr key={testimony._id}>
                  <td className="align-middle">{testimony.name}</td>
                  <td className="align-middle">
                    {testimony.testimonial.length > 100
                      ? `${testimony.testimonial.substring(0, 100)}...`
                      : testimony.testimonial}
                  </td>
                  <td className="text-center" style={{ width: '200px' }}>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      href={`/admin/testimonial/edit/${testimony._id}`}
                      disabled={deleteInProgress || deleteLoading}
                    >
                      <Edit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => deleteHandler(testimony._id)}
                      disabled={deleteInProgress || deleteLoading}
                    >
                      {(deleteInProgress || deleteLoading) ? (
                        <>
                          <Loader small />
                          <span className="ms-2">Deleting...</span>
                        </>
                      ) : (
                        <Trash />
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination>
            {[...Array(Math.ceil(filteredAndSortedTestimonials.length / testimonialsPerPage)).keys()].map(number => (
              <Pagination.Item
                key={number + 1}
                active={number + 1 === currentPage}
                onClick={() => paginate(number + 1)}
              >
                {number + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      )}
    </Container>
  );
};

export default AdminTestimonyList;
