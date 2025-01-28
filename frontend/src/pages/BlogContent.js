import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Import dracula theme
import { Container } from 'react-bootstrap';
import rehypeRaw from 'rehype-raw'; // Allows raw HTML in Markdown
import remarkGfm from 'remark-gfm'; // Supports GitHub Flavored Markdown (tables, strikethrough, etc.)

const BlogContent = ({ content }) => {
    if (!content) {
        return (
            <Container className="text-center p-5 my-3 bg-light">
                <p className="text-muted mb-0">No content available</p>
            </Container>
        );
    }

    return (
        <Container className="blog-content py-4">
            <ReactMarkdown
                rehypePlugins={[rehypeRaw]} // Allows raw HTML (e.g., YouTube iframes)
                remarkPlugins={[remarkGfm]} // Supports GitHub Flavored Markdown
                components={{
                    // Custom rendering for images (supports GIFs)
                    img: ({ src, alt }) => (
                        <div className="text-center mb-4">
                            <img
                                src={src}
                                alt={alt}
                                className="img-fluid"
                                style={{ maxWidth: '100%', height: 'auto' }}
                            />
                        </div>
                    ),
                    // Custom rendering for code blocks
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <SyntaxHighlighter
                                style={dracula} // Use the dracula theme
                                language={match[1]}
                                PreTag="div"
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                    // Custom rendering for YouTube embeds
                    a: ({ href, children }) => {
                        if (href.includes('youtube.com') || href.includes('youtu.be')) {
                            const videoId = href.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
                            if (videoId) {
                                return (
                                    <div className="mb-4">
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
                        return <a href={href}>{children}</a>;
                    },
                    // Custom rendering for videos (mp4, webm, etc.)
                    video: ({ src }) => (
                        <div className="text-center mb-4">
                            <video controls className="img-fluid">
                                <source src={src} />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </Container>
    );
};

export default BlogContent;