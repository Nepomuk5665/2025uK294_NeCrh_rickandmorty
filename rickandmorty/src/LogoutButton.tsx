import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from './api/auth-utils';

export default function LogoutButton() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <button 
      onClick={handleLogout}
      style={{ 
        position: 'absolute', 
        top: '10px', 
        right: '10px', 
        padding: '5px 10px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      Logout
    </button>
  );
}