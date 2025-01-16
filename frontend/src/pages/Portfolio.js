import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listPortfolios } from '../actions/portfolio_actions';

const Portfolio = () => {
  const dispatch = useDispatch();

  const portfolioList = useSelector((state) => state.portfolioList);
  const { loading, error, portfolios } = portfolioList;

  useEffect(() => {
    dispatch(listPortfolios());
  }, [dispatch]);

  return (
    <Container className="my-5">
      <Row>
        {/* Show loading spinner while data is being fetched */}
        {loading && (
          <Col md={12} className="text-center">
            <Spinner animation="border" variant="primary" />
          </Col>
        )}

        {/* Show error message if there's an error fetching the data */}
        {error && (
          <Col md={12} className="text-center">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          </Col>
        )}

        {/* Render portfolio items if data is available */}
        {!loading && !error && portfolios && portfolios.length > 0 && (
          portfolios.map((item) => (
            <Col key={item._id} md={12} className="mb-4">
              <Card className="moon-themed-card d-flex flex-row align-items-center">
                {item.image && (
                  <Card.Img 
                    variant="top" 
                    src={item.image} 
                    alt={item.title} 
                    style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '15px' }}
                  />
                )}
                <Card.Body>
                  <Row>
                    <Col md={9}>
                      <Card.Title>{item.title}</Card.Title>
                      <Card.Text>{item.description}</Card.Text>
                    </Col>
                    <Col md={3} className="d-flex align-items-center">
                      <Button variant="link" href={item.link} target="_blank">Read More</Button>
                    </Col>
                  </Row>
                  {item.role && <p><strong>Role:</strong> {item.role}</p>}
                  <p><strong>Technologies:</strong> {item.technologies.join(", ")}</p>
                  {item.skills && <p><strong>Skills:</strong> {item.skills.join(", ")}</p>}
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default Portfolio;
