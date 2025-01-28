import React, { useEffect } from 'react';
import { 
  Container, Row, Col, Card, Button, 
  Spinner, Alert, Badge, Stack 
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowUpRight, Code2, Paintbrush2, Terminal } from 'lucide-react';
import { listPortfolios } from '../actions/portfolio_actions';

const PortfolioItem = ({ item }) => (
  <Col key={item._id} xs={12} className="mb-4">
    <Card className="h-100 shadow-hover">
      <Card.Body className="d-flex flex-column flex-md-row">
        {item.image && (
          <div className="mb-3 mb-md-0 me-md-4" style={{ width: '300px' }}>
            <Card.Img 
              variant="top"
              src={item.image}
              alt={item.title}
              className="rounded-3 object-fit-cover h-100"
            />
          </div>
        )}
        
        <div className="flex-grow-1">
          <Stack gap={2}>
            <div className="d-flex justify-content-between align-items-start">
              <Card.Title className="h4 mb-2">{item.title}</Card.Title>
              <Button 
                variant="outline-primary"
                href={item.link}
                target="_blank"
                className="d-flex align-items-center"
              >
                View Project <ArrowUpRight size={18} className="ms-1" />
              </Button>
            </div>

            {item.role && (
              <div className="d-flex align-items-center text-muted">
                <Terminal size={16} className="me-2" />
                <span>{item.role}</span>
              </div>
            )}

            <Card.Text className="text-muted">{item.description}</Card.Text>

            <div>
              <h6 className="d-flex align-items-center mb-2">
                <Code2 size={18} className="me-2" />
                Technologies
              </h6>
              <Stack direction="horizontal" gap={2} className="flex-wrap">
                {item.technologies.map(tech => (
                  <Badge key={tech} bg="light" text="dark" className="rounded-pill">
                    {tech}
                  </Badge>
                ))}
              </Stack>
            </div>

            {item.skills && (
              <div>
                <h6 className="d-flex align-items-center mb-2">
                  <Paintbrush2 size={18} className="me-2" />
                  Skills Demonstrated
                </h6>
                <Stack direction="horizontal" gap={2} className="flex-wrap">
                  {item.skills.map(skill => (
                    <Badge key={skill} bg="info" className="rounded-pill">
                      {skill}
                    </Badge>
                  ))}
                </Stack>
              </div>
            )}
          </Stack>
        </div>
      </Card.Body>
    </Card>
  </Col>
);

const Portfolio = () => {
  const dispatch = useDispatch();
  const { loading, error, portfolios } = useSelector(state => state.portfolioList);

  useEffect(() => {
    dispatch(listPortfolios());
  }, [dispatch]);

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="display-6">Portfolio Showcase</h1>
          <p className="text-muted">Exploring digital craftsmanship through projects</p>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="grow" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3 text-muted">Curating portfolio items...</p>
        </div>
      ) : error ? (
        <Alert variant="danger" className="rounded-3">
          <Alert.Heading>Connection Error</Alert.Heading>
          <p>Unable to fetch portfolio items: {error}</p>
        </Alert>
      ) : portfolios?.length > 0 ? (
        <Row>
          {portfolios.map(item => (
            <PortfolioItem key={item._id} item={item} />
          ))}
        </Row>
      ) : (
        <Alert variant="info" className="rounded-3">
          No portfolio items found. Check back later!
        </Alert>
      )}
    </Container>
  );
};

export default Portfolio;