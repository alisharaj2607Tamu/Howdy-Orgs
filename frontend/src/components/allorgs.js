import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSBERTOrgs } from './api/getSBERTOrgs';

const AllOrgs = () => {
  const [orgs, setOrgs] = useState([]);
  const [filteredOrgs, setFilteredOrgs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayLimit, setDisplayLimit] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const userEmail = localStorage.getItem('userEmail') || '';
  const userName = localStorage.getItem('userName') || 'you';
  const interests = JSON.parse(localStorage.getItem('interests') || '[]');
  const interestStr = interests.filter(Boolean).join(', ');

  useEffect(() => {
    const fetchRankedOrgs = async () => {
      setLoading(true);
      try {
        const rankedOrgs = await getSBERTOrgs(userEmail);
        if (!Array.isArray(rankedOrgs)) {
          console.error("Unexpected response from backend:", rankedOrgs);
          setOrgs([]);
          setFilteredOrgs([]);
        } else {
          setOrgs(rankedOrgs);
          setFilteredOrgs(rankedOrgs);
        }
      } catch (error) {
        console.error("Error fetching SBERT orgs:", error);
        setOrgs([]);
        setFilteredOrgs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRankedOrgs();
  }, [userEmail]);

  const handleLimitChange = (e) => {
    const value = e.target.value === "all" ? "all" : parseInt(e.target.value);
    setDisplayLimit(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = orgs.filter(org =>
      org.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOrgs(filtered);
    setCurrentPage(1);
  };

  const totalPages =
    displayLimit === "all" ? 1 : Math.ceil(filteredOrgs.length / displayLimit);

  const paginatedOrgs =
    displayLimit === "all"
      ? filteredOrgs
      : filteredOrgs.slice((currentPage - 1) * displayLimit, currentPage * displayLimit);

  return (
    <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#fff7f0', minHeight: '100vh' }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', color: '#500000', fontWeight: '700', marginBottom: '0.5rem' }}>
          Recommended Organizations for {userName}
        </h2>
        {interestStr && (
          <p style={{ fontSize: '1rem', color: '#555', fontStyle: 'italic' }}>
            Based on your interests: <span style={{ fontWeight: '500', color: '#333' }}>{interestStr}</span>
          </p>
        )}
      </div>

      <div style={{
        marginBottom: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div>
          <label htmlFor="limitSelect" style={{ marginRight: '10px', fontWeight: '500' }}>Show Top:</label>
          <select
            id="limitSelect"
            onChange={handleLimitChange}
            value={displayLimit}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              fontWeight: '500'
            }}
          >
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="all">All</option>
          </select>
        </div>

        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search organizations..."
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              minWidth: '240px'
            }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ marginTop: '2rem' }}>
          <div style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #500000',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            margin: '0 auto',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ color: '#555', marginTop: '0.75rem' }}>Loading recommendations...</p>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'stretch',
          gap: '20px',
          marginTop: '20px'
        }}>
          {paginatedOrgs.map((org, index) => (
            <Link
              key={index}
              to={`/sbert-org/${org.primary_key.split('_')[0]}`}
              state={{ org }}
              style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}
            >
              <div
                style={{
                  flexGrow: 1,
                  border: '1px solid #dcbfb5',
                  borderRadius: '12px',
                  padding: '16px',
                  width: '250px',
                  backgroundColor: '#fff3ea',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  animation: 'fadeIn 0.4s ease forwards',
                  opacity: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                <h3 style={{
                  fontSize: '1.1rem',
                  color: '#500000',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>{org.title}</h3>
                <p style={{ color: '#444', fontSize: '0.95rem' }}>
                  Match: <strong>{org.match_percentage}%</strong>
                </p>
                {org.keywords?.length > 0 && (
                  <p style={{
                    fontSize: '0.85rem',
                    color: '#774c3b',
                    marginTop: '0.75rem'
                  }}>
                    <strong>Tags:</strong> {org.keywords.slice(0, 3).join(', ')}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && displayLimit !== "all" && totalPages > 1 && (
        <div style={{ marginTop: '30px' }}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            style={{
              padding: '0.5rem 1rem',
              marginRight: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            ← Prev
          </button>
          <span style={{ fontWeight: '500' }}>Page {currentPage} of {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            style={{
              padding: '0.5rem 1rem',
              marginLeft: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default AllOrgs;
