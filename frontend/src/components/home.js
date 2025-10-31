import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // ✅ added for routing
import headerBanner from './images/header.png';

const Home = () => {
  const [recommendedOrgs, setRecommendedOrgs] = useState([]);
  const [welcomeMsg, setWelcomeMsg] = useState('');

  useEffect(() => {
    const userName = localStorage.getItem('userName');
    if (userName) {
      setWelcomeMsg(`Welcome ${userName}!`);
      // setTimeout(() => {
      //   setWelcomeMsg('');
      // }, 3000); // 3 seconds flash
    }
  }, []);

  useEffect(() => {
    const interests = JSON.parse(localStorage.getItem('interests') || '[]');
    const query = interests.join(', ');

    fetch('http://localhost:8000/backend/bm25', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: localStorage.getItem('userName') || '',
        query: query,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const topThree = data.ranked_docs.slice(0, 3);
        setRecommendedOrgs(topThree);
      })
      .catch((err) => {
        console.error('Failed to fetch orgs:', err);
      });
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <main>
        <img
          src={headerBanner}
          alt="Header Banner"
          style={{ width: '100%', height: '380px', marginBottom: '20px' }}
        />

        {welcomeMsg && (
          <div style={{
            backgroundColor: '#dff0d8',
            color: '#3c763d',
            padding: '12px 20px',
            borderRadius: '6px',
            marginBottom: '25px',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            fontSize: '1.1rem',
            fontWeight: '500',
          }}>
            {welcomeMsg}
          </div>
        )}

        <h2>Recommended Organizations for you!</h2>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'center',
          marginTop: '20px'
        }}>
          {recommendedOrgs.map((org, index) => (
            <Link
              key={index}
              to={`/org/${org.logo.split('_')[0]}`}  // extract org ID from logo
              state={{ org }}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '16px',
                  width: '250px',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <img
                  src={`/org_images/${org.logo}`}
                  alt={`${org.name} logo`}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'contain',
                    marginBottom: '10px',
                  }}
                />
                <h3>{org.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
