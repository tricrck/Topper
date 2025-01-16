import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import Signup from './pages/Signup';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Header/>
       <main className="py-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolios" element={<Portfolio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<BlogDetails />} />

          {/* Admin Routes */}
          <Route path="/admin/bloglist" element={<AdminBlogList />} />
          <Route path="/admin/blogs/edit/:id?" element={<AdminBlogEdit />} />
          <Route path="/admin/blogs/create" element={<AdminBlogAdd />} />

          <Route path="/admin/portfoliolist" element={<AdminPortfolioList />} />
          <Route path="/admin/portfolio/edit/:id" element={<AdminPortfolioEdit />} />
          <Route path="/admin/portfolio/create" element={<AdminPortfolioCreate />} />

          <Route path="/admin/testimonialist" element={<AdminTestimonyList />} />
          <Route path="/admin/testimonial/create" element={<AdminTestimonyCreate />} />
          <Route path="/admin/testimonial/edit/:id" element={<AdminTestimonyEdit />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
