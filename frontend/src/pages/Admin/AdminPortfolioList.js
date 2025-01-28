import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Container, Button, Row, Col, Pagination } from 'react-bootstrap';
import { listPortfolios, deletePortfolio } from '../../actions/portfolio_actions';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { Search, Edit, Trash, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';

const AdminPortfolioList = () => {
  const dispatch = useDispatch();
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const portfoliosPerPage = 10;

  const portfolioList = useSelector((state) => state.portfolioList);
  const { loading, error, portfolios = [] } = portfolioList;

  const portfolioDelete = useSelector((state) => state.portfolioDelete);
  const {
    loading: deleteLoading,
    error: deleteError,
    success: deleteSuccess
  } = portfolioDelete;

  useEffect(() => {
    dispatch(listPortfolios());
  }, [dispatch]);

  useEffect(() => {
    if (deleteSuccess) {
      dispatch(listPortfolios());
    }
  }, [deleteSuccess, dispatch]);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this portfolio?')) {
      setDeleteInProgress(true);
      try {
        await dispatch(deletePortfolio(id));
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

  const filteredAndSortedPortfolios = portfolios
    .filter(portfolio =>
      portfolio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      portfolio.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      portfolio.technologies.join(' ').toLowerCase().includes(searchTerm.toLowerCase())
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

  const indexOfLastPortfolio = currentPage * portfoliosPerPage;
  const indexOfFirstPortfolio = indexOfLastPortfolio - portfoliosPerPage;
  const currentPortfolios = filteredAndSortedPortfolios.slice(indexOfFirstPortfolio, indexOfLastPortfolio);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <Loader />;

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="text-2xl font-bold">Manage Portfolios</h1>
        </Col>
        <Col className="text-end">
          <Button
            variant="success"
            href="/admin/portfolio/create"
            className="shadow-sm"
          >
            Create New Portfolio
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
              placeholder="Search portfolios..."
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
            {filteredAndSortedPortfolios.length} portfolios found
          </span>
        </Col>
      </Row>

      {portfolios.length === 0 ? (
        <Message variant="info">No portfolios found. Create your first portfolio!</Message>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover className="shadow-sm">
            <thead className="bg-light">
              <tr>
                <th onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
                  TITLE {getSortIcon('title')}
                </th>
                <th onClick={() => handleSort('role')} style={{ cursor: 'pointer' }}>
                  ROLE {getSortIcon('role')}
                </th>
                <th>TECHNOLOGIES</th>
                <th className="text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {currentPortfolios.map((portfolio) => (
                <tr key={portfolio._id}>
                  <td className="align-middle">
                    {portfolio.title.length > 50
                      ? `${portfolio.title.substring(0, 50)}...`
                      : portfolio.title}
                  </td>
                  <td className="align-middle">{portfolio.role}</td>
                  <td className="align-middle">
                    <div className="d-flex flex-wrap gap-1">
                      {portfolio.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="badge bg-secondary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="text-center" style={{ width: '200px' }}>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      href={`/admin/portfolio/edit/${portfolio._id}`}
                      disabled={deleteInProgress || deleteLoading}
                    >
                      <Edit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => deleteHandler(portfolio._id)}
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
            {[...Array(Math.ceil(filteredAndSortedPortfolios.length / portfoliosPerPage)).keys()].map(number => (
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

export default AdminPortfolioList;
