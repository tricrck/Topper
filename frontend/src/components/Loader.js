import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Loader = ({ size = "50", stroke = "4", speed = "2", color = "blue" }) => {
  useEffect(() => {
    // Dynamically import the loader script
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://cdn.jsdelivr.net/npm/ldrs/dist/auto/ripples.js';
    document.head.appendChild(script);

    // Cleanup the script on unmount
    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <Container fluid>
      <Row className="min-vh-100 d-flex justify-content-center align-items-center">
        <Col xs="auto">
          <l-ripples
            size={size}
            stroke={stroke}
            speed={speed}
            color={color}
          ></l-ripples>
        </Col>
      </Row>
    </Container>
  );
};

export default Loader;
