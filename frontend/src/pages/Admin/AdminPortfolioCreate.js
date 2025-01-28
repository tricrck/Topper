import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Card, Row, Col, Alert } from "react-bootstrap";
import { 
  Briefcase, 
  FileText, 
  Code, 
  Award, 
  Link as LinkIcon, 
  Image as ImageIcon,
  AlertCircle,
  Loader,
  Save,
  X
} from "lucide-react";
import { createPortfolio } from "../../actions/portfolio_actions";

const InputWithIcon = ({ icon: Icon, label, error, ...props }) => (
  <Form.Group className="mb-4">
    <Form.Label className="d-flex align-items-center gap-2">
      <Icon size={18} className="text-primary" />
      <span>{label}</span>
    </Form.Label>
    <Form.Control 
      {...props}
      className={`${error ? 'border-danger' : ''}`}
    />
    {error && (
      <div className="d-flex align-items-center gap-1 mt-1 text-danger">
        <AlertCircle size={14} />
        <small>{error}</small>
      </div>
    )}
  </Form.Group>
);

const TagInput = ({ value, onChange, onRemove, suggestions = [] }) => (
  <div className="d-flex flex-wrap gap-2 mb-2">
    {value.map((tag, index) => (
      <div
        key={index}
        className="bg-light rounded-pill px-3 py-1 d-flex align-items-center gap-2"
      >
        <span>{tag}</span>
        <X
          size={14}
          className="cursor-pointer text-muted"
          onClick={() => onRemove(index)}
        />
      </div>
    ))}
  </div>
);

const AdminPortfolioCreate = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: [],
    skills: [],
    link: "",
    image: ""
  });
  const [errors, setErrors] = useState({});
  const [tempInput, setTempInput] = useState({ technologies: "", skills: "" });

  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.portfolioCreate);

  useEffect(() => {
    if (success) {
      setFormData({
        title: "",
        description: "",
        technologies: [],
        skills: [],
        link: "",
        image: ""
      });
      setTempInput({ technologies: "", skills: "" });
    }
  }, [success]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (formData.technologies.length === 0) newErrors.technologies = "At least one technology is required";
    if (formData.skills.length === 0) newErrors.skills = "At least one skill is required";
    if (formData.skills.length > 5) newErrors.skills = "Maximum 5 skills allowed";
    if (formData.link && !formData.link.startsWith("http")) newErrors.link = "Must be a valid URL";
    if (formData.image && !formData.image.startsWith("http")) newErrors.image = "Must be a valid image URL";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTagInput = (field, value) => {
    const tags = value.split(",").map(tag => tag.trim()).filter(Boolean);
    if (tags.length > 0) {
      setFormData(prev => ({
        ...prev,
        [field]: [...new Set([...prev[field], ...tags])]
      }));
      setTempInput(prev => ({ ...prev, [field]: "" }));
    }
  };

  const removeTag = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(createPortfolio(formData));
    }
  };

  return (
    <div className="container py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-white">
          <h2 className="h4 mb-0 d-flex align-items-center gap-2">
            <Briefcase className="text-primary" />
            Create Portfolio
          </h2>
        </Card.Header>
        
        <Card.Body>
          {error && (
            <Alert variant="danger" className="d-flex align-items-center gap-2">
              <AlertCircle size={18} />
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success" className="d-flex align-items-center gap-2">
              <Save size={18} />
              Portfolio created successfully!
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={8}>
                <InputWithIcon
                  icon={Briefcase}
                  label="Project Title"
                  placeholder="Enter project title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  error={errors.title}
                />

                <InputWithIcon
                  icon={FileText}
                  label="Description"
                  as="textarea"
                  rows={4}
                  placeholder="Describe your project in detail"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  error={errors.description}
                />

                <Form.Group className="mb-4">
                  <Form.Label className="d-flex align-items-center gap-2">
                    <Code size={18} className="text-primary" />
                    Technologies
                  </Form.Label>
                  <TagInput
                    value={formData.technologies}
                    onRemove={(index) => removeTag("technologies", index)}
                  />
                  <Form.Control
                    placeholder="Add technologies (comma-separated)"
                    value={tempInput.technologies}
                    onChange={(e) => setTempInput(prev => ({ ...prev, technologies: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleTagInput("technologies", tempInput.technologies);
                      }
                    }}
                    onBlur={() => handleTagInput("technologies", tempInput.technologies)}
                  />
                  {errors.technologies && (
                    <div className="text-danger mt-1">
                      <small>{errors.technologies}</small>
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="d-flex align-items-center gap-2">
                    <Award size={18} className="text-primary" />
                    Skills (max 5)
                  </Form.Label>
                  <TagInput
                    value={formData.skills}
                    onRemove={(index) => removeTag("skills", index)}
                  />
                  <Form.Control
                    placeholder="Add skills (comma-separated)"
                    value={tempInput.skills}
                    onChange={(e) => setTempInput(prev => ({ ...prev, skills: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleTagInput("skills", tempInput.skills);
                      }
                    }}
                    onBlur={() => handleTagInput("skills", tempInput.skills)}
                  />
                  {errors.skills && (
                    <div className="text-danger mt-1">
                      <small>{errors.skills}</small>
                    </div>
                  )}
                </Form.Group>

                <InputWithIcon
                  icon={LinkIcon}
                  label="Project Link (Optional)"
                  placeholder="https://..."
                  value={formData.link}
                  onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                  error={errors.link}
                />

                <InputWithIcon
                  icon={ImageIcon}
                  label="Image URL (Optional)"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  error={errors.image}
                />

                <div className="d-flex gap-3">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="px-4 d-flex align-items-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Create Portfolio
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline-secondary"
                    href="/admin/portfolios"
                    className="px-4"
                  >
                    Cancel
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminPortfolioCreate;