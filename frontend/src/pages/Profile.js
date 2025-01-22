import React from "react";
import { useSelector } from "react-redux";
import { Shield, Mail, Calendar, User, LogOut, } from 'lucide-react';
import { Link } from 'react-router-dom'
import { checkIsAdmin } from '../utils/auth';

const Profile = ({ onLogout }) => {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = checkIsAdmin(user?.email);

  if (!user) {
    return (
      <div className="text-center p-4">
        <p className="text-muted">Please log in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="text-center mb-4">
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt="Profile"
            className="rounded-circle mb-3 shadow-sm"
            style={{ 
              width: '100px', 
              height: '100px', 
              objectFit: 'cover',
              border: '3px solid #fff'
            }}
            
          />
        ) : (
          <div 
            className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: '100px', height: '100px' }}
          >
            <User size={40} className="text-muted" />
          </div>
        )}
        <h3 className="mb-1">{user.displayName || 'User'}</h3>
        {isAdmin && (
          <span className="badge bg-primary d-inline-flex align-items-center gap-1">
            <Shield size={12} />
            Admin
          </span>
        )}
      </div>

      <div className="user-details mb-4">
        <div className="d-flex align-items-center mb-2">
          <Mail size={16} className="text-muted me-2" />
          <span>{user.email}</span>
        </div>
        {user.createdAt && (
          <div className="d-flex align-items-center mb-2">
            <Calendar size={16} className="text-muted me-2" />
            <span>Joined {new Date(Number(user.createdAt)).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      <div className="d-grid gap-2">
        {isAdmin && (
          <Link 
            to="/admin" 
            className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2"
          >
            <Shield size={18} />
            Go to Admin Dashboard
          </Link>
        )}
        <button
          onClick={onLogout}
          className="btn btn-danger d-flex align-items-center justify-content-center gap-2"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;