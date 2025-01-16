import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { createPortfolio } from "../../actions/portfolio_actions";

const AdminPortfolioCreate = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [technologies, setTechnologies] = useState("");
    const [skills, setSkills] = useState("");
    const [link, setLink] = useState("");
    const [image, setImage] = useState("");

    const dispatch = useDispatch();
    const { loading, error, success } = useSelector((state) => state.portfolioCreate);

    const handleSubmit = (e) => {
        e.preventDefault();
        const portfolioData = {
            title,
            description,
            technologies: technologies.split(","),
            skills: skills.split(","),
            link,
            image,
        };
        dispatch(createPortfolio(portfolioData));
    };

    return (
        <div className="container mt-4">
            <h2>Create Portfolio</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">Portfolio created successfully!</Alert>}
            {loading && <Spinner animation="border" />}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="title" className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="description" className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="technologies" className="mb-3">
                    <Form.Label>Technologies</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Comma-separated technologies"
                        value={technologies}
                        onChange={(e) => setTechnologies(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="skills" className="mb-3">
                    <Form.Label>Skills</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Comma-separated skills (max 5)"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="link" className="mb-3">
                    <Form.Label>Link</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Optional project link"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="image" className="mb-3">
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Optional image URL"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                    />
                </Form.Group>
                <Button type="submit" variant="primary">
                    Create
                </Button>
            </Form>
        </div>
    );
};

export default AdminPortfolioCreate;
