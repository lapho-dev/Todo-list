import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate , useLocation } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Main from './components/Main';
import Profile from './components/Profile';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    if (currentUserId === null && location.pathname !== '/signup') {
      navigate('/login');
    }
  }, [currentUserId, navigate, location.pathname]);

  const handleLogin = (userId) => {
    console.log('Login user id:' + userId);
    setCurrentUserId(userId);
    navigate('/' + userId);
  };

  const handleLogout = () => {
    setCurrentUserId(null);
    navigate('/login');
  };


  return (
    <div className="content">

      <Routes>
        <Route path="/" element={<Main/>} />
        <Route path={"/:userId"} element={<Profile onLogout={handleLogout}/>}/>
        <Route path="/login" element={<Login onLoginSuccess={handleLogin} />} />
        <Route path="/signup" element={<SignUp onSignUpSuccess={handleLogin} />} />
      </Routes>
    </div>
  );
};

export default App;
 