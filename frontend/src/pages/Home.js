import React, { useEffect } from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listTestimonials } from '../actions/testimonial_actions';

const Home = () => {
  const skills = [
    'Python', 'JavaScript', 'Full-Stack Development', 'Docker',
    'Software Development', 'CSS', 'PostgreSQL', 'MySQL',
    'Java', 'C++', 'Linux', 'Kubernetes',
  ];
  const dispatch = useDispatch();

  const testimonialsList = useSelector((state) => state.testimonialsList);
  const { loading, error, testimonials } = testimonialsList;

  useEffect(() => {
    dispatch(listTestimonials());
  }, [dispatch]);

  return (
    <Container className="py-5">
      {/* About Me Section */}
      <section className="about-section mb-5">
        <h2>About Me</h2>
        <p>
          I'm an experienced Developer with a passion for building high-quality original software solutions.
          I specialize in multiple programming languages and front-end technologies, delivering innovative and efficient software development.
        </p>
      </section>

      {/* Technical Skills Section */}
      <section className="skills-section mb-5">
        <h2>Technical Skills</h2>
        <Row className="skills-grid">
          {skills.map((skill, index) => (
            <Col key={index} xs={6} sm={4} md={3} className="mb-3">
              <Badge bg="dark" className="skill-tag">{skill}</Badge>
            </Col>
          ))}
        </Row>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section mb-5" id="testimonials-container">
        <h2>Testimonial Skills</h2>

        {/* Display loading indicator if data is being fetched */}
        {loading && <p>Loading testimonials...</p>}

        {/* Display error message if there's an error */}
        {error && <p className="text-danger">{error}</p>}

        {/* Display testimonials if available */}
        {testimonials && testimonials.length > 0 ? (
          <div className="testimonial-list">
            {testimonials.map((testimonial) => (
              <div key={testimonial._id} className="testimonial-item mb-4">
                <blockquote className="testimonial-text">
                  <p>"{testimonial.testimonial}"</p>
                </blockquote>
                <div className="testimonial-author">
                  <p className="author-name">{testimonial.name}</p>
                  <p className="author-designation">{testimonial.designation}</p>
                  <a href={testimonial.link} target="_blank" rel="noopener noreferrer">
                    View Testimonial
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No testimonials available yet. Check back soon!</p>
        )}
      </section>

      {/* Contact Links Section */}
      <section className="contact-links">
        <a href="https://github.com/tricrck" target="_blank" rel="noopener noreferrer" className="me-3">
          <i className="fab fa-github" style={{ fontSize: '1.5rem' }}></i>
        </a>
        <a href="/" target="_blank" rel="noopener noreferrer" className="me-3">
          <i className="fab fa-stack-overflow" style={{ fontSize: '1.5rem' }}></i>
        </a>
        <a href="/" target="_blank" rel="noopener noreferrer">
          <i className="fas fa-envelope" style={{ fontSize: '1.5rem' }}></i>
        </a>
      </section>
    </Container>
  );
};

export default Home;
