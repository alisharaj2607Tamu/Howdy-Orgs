import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginRegister = () => {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('loggedIn') === 'true') {
      navigate('/home');
    }
  }, [navigate]);

  useEffect(() => {
    fetch('http://localhost:8000/backend/users-list')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => {
        console.error("Failed to fetch users list", err);
        setMessage('Failed to load user data.');
      });
  }, []);

  const handleLogin = () => {
    if (users.length === 0) {
      setMessage('Still loading user data. Please try again shortly.');
      return;
    }

    const user = users.find(user =>
      user?.Email?.trim().toLowerCase() === email.trim().toLowerCase() &&
      user?.PWD === pwd
    );

    if (user) {
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('userName', user.Name);
      localStorage.setItem('userEmail', user.Email);
      localStorage.setItem('interests', JSON.stringify([
        user.Interest1,
        user.Interest2,
        user.Interest3
      ]));

      setTimeout(() => {
        navigate('/home');
      }, 100);
    } else {
      setMessage('Invalid credentials');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fdf6ee',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '450px',
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e0dcdc'
      }}>
        <h1 style={{
          fontSize: '2.25rem',
          fontWeight: '700',
          color: '#500000',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          Log In
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.95rem',
              color: '#444'
            }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: '80%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid #ccc',
                backgroundColor: '#f8f9fb',
                fontSize: '1rem'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.95rem',
              color: '#444'
            }}>Password</label>
            <input
              type="password"
              value={pwd}
              onChange={e => setPwd(e.target.value)}
              style={{
                width: '80%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid #ccc',
                backgroundColor: '#f8f9fb',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              onClick={handleLogin}
              style={{
                backgroundColor: '#500000',
                color: '#fff',
                fontWeight: '600',
                padding: '0.75rem',
                fontSize: '1rem',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Login
            </button>

            <button
              onClick={handleRegisterRedirect}
              style={{
                backgroundColor: '#787878',
                color: '#fff',
                fontWeight: '600',
                padding: '0.75rem',
                fontSize: '1rem',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Register
            </button>
          </div>

          {message && (
            <p style={{
              marginTop: '1rem',
              color: 'red',
              textAlign: 'center',
              fontSize: '0.95rem'
            }}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
