import React from 'react';
import AD from './images/AD.jpg';
import AR from './images/AR.jpg';
import GP from './images/GP.jpg';
import SS from './images/SS.jpg';

const team = [
  { name: "Alisha Raj", image: AR },
  { name: "Gouri Pawar", image: GP },
  { name: "Sukanya Sahoo", image: SS },
  { name: "Asmita Shivling Desai", image: AD },
];

const About = () => {
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#2c3e50' }}>About Howdy Orgs</h1>
      <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.1rem', color: '#34495e', textAlign: 'center' }}>
        Howdy Orgs is a smart platform designed to help students at Texas A&M discover and connect with student organizations that match their interests.
        We use advanced semantic matching with SBERT and ColBERT models to provide personalized ranking and recommendations.
      </p>
      <p style={{ maxWidth: '800px', margin: '20px auto 2rem', fontSize: '1rem', color: '#566573', textAlign: 'center' }}>
        Our goal is to simplify student engagement by surfacing the most relevant organizations based on individual profiles.
        We aim to make it easier for students to navigate the wide variety of opportunities on campus and find their perfect fit.
      </p>

      <h2 style={{ textAlign: 'center', margin: '40px 0 20px', color: '#2c3e50' }}>Meet the Team</h2>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '30px' }}>
        {team.map((member) => (
          <div key={member.name} style={{ textAlign: 'center' }}>
            <img
              src={member.image}
              alt={member.name}
              style={{ width: '160px', height: '160px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', border: '4px solid maroon' }}
            />
            <p style={{ marginTop: '10px', fontWeight: '600', fontSize: '1rem', color: '#2c3e50' }}>{member.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
