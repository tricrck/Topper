import React from 'react';
import { Container, Card } from 'react-bootstrap';

const BlogContent = ({ content }) => {
  if (!content) {
    return (
      <Card className="text-center p-5 my-3 bg-light">
        <Card.Body>
          <p className="text-muted mb-0">No content available</p>
        </Card.Body>
      </Card>
    );
  }

  // Split content into sections based on double newlines (paragraphs)
  const sections = content.split('\n\n');

  return (
    <Container className="blog-content py-4">
      {sections.map((section, index) => {
        // Handle headers (# and ##)
        if (section.startsWith('# ')) {
          return (
            <h1 key={index} className="display-4 mb-4">
              {section.replace('# ', '')}
            </h1>
          );
        }
        if (section.startsWith('## ')) {
          return (
            <h2 key={index} className="h2 mb-3">
              {section.replace('## ', '')}
            </h2>
          );
        }

        // Handle lists
        if (section.includes('\n- ')) {
          const listItems = section.split('\n- ');
          return (
            <ul key={index} className="list-unstyled mb-4">
              {listItems.map((item, itemIndex) =>
                itemIndex === 0 ? null : (
                  <li key={itemIndex} className="mb-2">
                    <i className="bi bi-dot me-2"></i>
                    {item}
                  </li>
                )
              )}
            </ul>
          );
        }

        // Handle blockquotes
        if (section.startsWith('> ')) {
          return (
            <Card key={index} className="border-start border-4 border-primary bg-light mb-4">
              <Card.Body>
                <blockquote className="mb-0">
                  {section.replace('> ', '')}
                </blockquote>
              </Card.Body>
            </Card>
          );
        }

        // Handle YouTube video links
        if (section.includes('youtube.com') || section.includes('youtu.be')) {
          const videoId = section.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
          if (videoId) {
            return (
              <div key={index} className="mb-4">
                <iframe
                  width="100%"
                  height="400"
                  src={`https://www.youtube.com/embed/${videoId[1]}`}
                  title="YouTube video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            );
          }
        }

        // Handle image URLs
        if (section.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i)) {
          return (
            <div key={index} className="text-center mb-4">
              <img
                src={section.trim()}
                alt="Blog content"
                className="img-fluid"
              />
            </div>
          );
        }

        // Handle video URLs (other than YouTube)
        if (section.match(/\.(mp4|webm|ogg)$/i)) {
          return (
            <div key={index} className="text-center mb-4">
              <video controls className="img-fluid">
                <source src={section.trim()} />
                Your browser does not support the video tag.
              </video>
            </div>
          );
        }

        // Handle code blocks (enclosed in triple backticks)
        if (section.startsWith('```') && section.endsWith('```')) {
          const codeContent = section.replace(/```/g, '');
          return (
            <pre key={index} className="bg-light p-3 mb-4">
              <code>{codeContent}</code>
            </pre>
          );
        }

        // Regular paragraphs
        return (
          <p key={index} className="lead mb-4">
            {section.split('\n').map((line, lineIndex) => (
              <React.Fragment key={lineIndex}>
                {line}
                {lineIndex < section.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </Container>
  );
};

export default BlogContent;
