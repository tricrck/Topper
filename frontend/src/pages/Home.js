import React, { useEffect } from 'react';
import { 
  Container, Row, Col, Badge, 
  Spinner, Alert, Card, Stack 
} from 'react-bootstrap';
import { 
  Code2, Terminal, Quote, Mail, 
  Github, Linkedin, Star, User2 
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { listPortfolios } from '../actions/portfolio_actions';
import { listTestimonials } from '../actions/testimonial_actions';

const SkillBadge = ({ skill }) => (
  <Badge 
    bg="light" 
    text="dark" 
    className="rounded-pill me-2 mb-2 shadow-sm hover-scale"
  >
    {skill}
  </Badge>
);

const TestimonialCard = ({ testimonial }) => (
  <Card className="h-100 shadow-hover border-0">
    <Card.Body>
      <Stack gap={3}>
        <div className="d-flex align-items-center gap-2 text-muted">
          <Quote size={20} />
          <span className="small">{testimonial.designation}</span>
        </div>
        <blockquote className="mb-0">
          <p className="lead">"{testimonial.testimonial}"</p>
        </blockquote>
        <div className="d-flex align-items-center gap-3 mt-auto">
          <div className="bg-primary rounded-circle p-2">
            <User2 size={24} className="text-white" />
          </div>
          <div>
            <h6 className="mb-0">{testimonial.name}</h6>
            <a 
              href={testimonial.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-decoration-none small"
            >
              View verification →
            </a>
          </div>
        </div>
      </Stack>
    </Card.Body>
  </Card>
);

const Home = () => {
  const dispatch = useDispatch();
  const { loading, error, testimonials } = useSelector(state => state.testimonialsList);
  const { portfolios } = useSelector(state => state.portfolioList);

  const skills = [
    ...new Set(
      (portfolios || [])
        .flatMap(portfolio => portfolio.skills || [])
        .map(skill => skill.trim())
    )
  ];

  useEffect(() => {
    dispatch(listTestimonials());
    dispatch(listPortfolios());
  }, [dispatch]);

  return (
    <Container className="py-5">
      {/* Hero Section */}
      <Row className="mb-5 align-items-center">
        <Col lg={8}>
          <div className="d-flex align-items-center gap-3 mb-4">
            <Terminal size={40} className="text-primary" />
            <h1 className="display-5 mb-0">Full-Stack Developer</h1>
          </div>
          <p className="lead text-muted">
            Crafting robust digital solutions with modern web technologies. 
            Specializing in full-stack development with a focus on user-centric design 
            and scalable architecture.
          </p>
        </Col>
      </Row>

      {/* Skills Section */}
      <section className="mb-5">
        <div className="d-flex align-items-center gap-3 mb-4">
          <Code2 size={32} className="text-primary" />
          <h2 className="h3 mb-0">Technical Expertise</h2>
        </div>
        <div className="d-flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <SkillBadge key={index} skill={skill} />
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="mb-5">
        <div className="d-flex align-items-center gap-3 mb-4">
          <Star size={32} className="text-primary" />
          <h2 className="h3 mb-0">Client Testimonials</h2>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <Alert variant="danger" className="rounded-3">
            Error loading testimonials: {error}
          </Alert>
        ) : testimonials?.length > 0 ? (
          <Row xs={1} md={2} lg={3} className="g-4">
            {testimonials.map(testimonial => (
              <Col key={testimonial._id}>
                <TestimonialCard testimonial={testimonial} />
              </Col>
            ))}
          </Row>
        ) : (
          <Alert variant="info" className="rounded-3">
            No testimonials available yet
          </Alert>
        )}
      </section>

      {/* Contact Section */}
      <section className="mt-5 pt-4">
        <Card className="border-0            ">
          <Card.Body className="p-4">
            <div className="d-flex flex-wrap justify-content-center gap-4">
              <a
                href="https://github.com/tricrck"
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex align-items-center gap-2 text-dark text-decoration-none"
              >
                <Github size={24} />
                <span>GitHub</span>
              </a>
              <a
                href="mailto:tricrck@email.com"
                className="d-flex align-items-center gap-2 text-dark text-decoration-none"
              >
                <Mail size={24} />
                <span>Email</span>
              </a>
              <a
                href="https://www.linkedin.com/in/patrick-cheruiyot-359999188/"
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex align-items-center gap-2 text-dark text-decoration-none"
              >
                <Linkedin size={24} />
                <span>LinkedIn</span>
              </a>
            </div>
          </Card.Body>
        </Card>
      </section>
    </Container>
  );
};

export default Home;