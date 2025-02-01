import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate  } from 'react-router-dom';
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import './App.css';
import Blogs from './pages/Blogs';
import BlogDetails from './pages/BlogDetails';
import AdminBlogList from './pages/Admin/AdminBlogList';
import AdminBlogEdit from  './pages/Admin/AdminBlogEdit'
import AdminBlogAdd from  './pages/Admin/AdminBlogAdd'
import AdminPortfolioList from './pages/Admin/AdminPortfolioList'
import AdminPortfolioEdit from './pages/Admin/AdminPortfolioEdit'
import AdminPortfolioCreate from './pages/Admin/AdminPortfolioCreate'
import AdminTestimonyList from './pages/Admin/AdminTestimonyList';
import AdminTestimonyCreate from './pages/Admin/AdminTestimonyCreate';
import AdminTestimonyEdit from './pages/Admin/AdminTestimonyEdit';
import AdminHeader from './components/AdminHeader';
import Dashboard from './components/Dashboard';
import { useSelector } from 'react-redux';
import { checkIsAdmin } from './utils/auth'


// Custom Header Selector
const AppHeader = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return isAdminRoute ? <AdminHeader /> : <Header />;
};

const AdminRoute = ({ element }) => {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = checkIsAdmin(user?.email);

  // If the user is not an admin, redirect to the home page
  return isAdmin ? element : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <AppHeader/>
       <main className="py-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolios" element={<Portfolio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<BlogDetails />} />

          {/* Protected Admin Routes */}
          <Route path="/admin/bloglist" element={<AdminRoute element={<AdminBlogList />} />} />
          <Route path="/admin/blogs/edit/:id?" element={<AdminRoute element={<AdminBlogEdit />} />} />
          <Route path="/admin/blogs/create" element={<AdminRoute element={<AdminBlogAdd />} />} />

          <Route path="/admin/portfoliolist" element={<AdminRoute element={<AdminPortfolioList />} />} />
          <Route path="/admin/portfolio/edit/:id" element={<AdminRoute element={<AdminPortfolioEdit />} />} />
          <Route path="/admin/portfolio/create" element={<AdminRoute element={<AdminPortfolioCreate />} />} />

          <Route path="/admin/testimonialist" element={<AdminRoute element={<AdminTestimonyList />} />} />
          <Route path="/admin/testimonial/create" element={<AdminRoute element={<AdminTestimonyCreate />} />} />
          <Route path="/admin/testimonial/edit/:id" element={<AdminRoute element={<AdminTestimonyEdit />} />} />
          <Route path="/admin" element={<AdminRoute element={<Dashboard />} />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
