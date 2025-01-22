import React, { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { listTestimonials } from '../actions/testimonial_actions';
import { listBlogs } from '../actions/blog_actions';
import { listPortfolios } from '../actions/portfolio_actions';

const Dashboard = () => {
  const dispatch = useDispatch();
  const blogList = useSelector((state) => state.blogList);
  const portfolioList = useSelector((state) => state.portfolioList);
  const testimonialsList = useSelector((state) => state.testimonialsList);

  const { blogs = [] } = blogList;
  const { portfolios = [] } = portfolioList;
  const { testimonials = [] } = testimonialsList;

  useEffect(() => {
      dispatch(listTestimonials());
      dispatch(listBlogs());
      dispatch(listPortfolios());
    }, [dispatch]);

  // Prepare data for blog comments bar chart
  const blogCommentsData = blogs.map(blog => ({
    title: blog.title.length > 20 ? blog.title.substring(0, 20) + '...' : blog.title,
    comments: blog.comments?.length || 0
  }));

  // Prepare data for blog status pie chart
  const publishedBlogs = blogs.filter(blog => blog.isPublished).length;
  const draftBlogs = blogs.length - publishedBlogs;
  const blogStatusData = [
    { name: 'Published', value: publishedBlogs },
    { name: 'Draft', value: draftBlogs }
  ];

  const COLORS = ['#0088FE', '#FF8042'];

  return (
    <Container fluid className="py-4">
      {/* Stats Overview */}
      <Row className="mb-4">
        <Col lg={4} md={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column align-items-center">
              <h1 className="display-4 fw-bold text-primary">{blogs.length}</h1>
              <p className="text-muted mb-0">Total Blogs</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} md={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column align-items-center">
              <h1 className="display-4 fw-bold text-success">{portfolios.length}</h1>
              <p className="text-muted mb-0">Total Portfolios</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} md={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column align-items-center">
              <h1 className="display-4 fw-bold text-info">{testimonials.length}</h1>
              <p className="text-muted mb-0">Total Testimonials</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row>
        {/* Blog Comments Chart */}
        <Col lg={8} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Blog Comments Overview</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={blogCommentsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="title" angle={-45} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="comments" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* Blog Status Pie Chart */}
        <Col lg={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Blog Status Distribution</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={blogStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {blogStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Recent Activity</h5>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.slice(0, 5).map((blog, index) => (
                      <tr key={index}>
                        <td>Blog</td>
                        <td>{blog.title}</td>
                        <td>
                          <span className={`badge bg-${blog.isPublished ? 'success' : 'warning'}`}>
                            {blog.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;