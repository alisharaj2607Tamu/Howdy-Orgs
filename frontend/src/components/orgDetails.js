import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

const OrgDetails = () => {
  const location = useLocation();
  const { primary_key, orgId } = useParams();

  // Seed with whatever minimal data you passed (SBERT or BM25)
  const seed = location.state?.org || {};

  // This will hold the full record once fetched
  const [details, setDetails] = useState(seed);

  useEffect(() => {
    // Determine which endpoint to call
    let endpoint = '';
    if (primary_key) {
      endpoint = `http://localhost:8000/sbert-org/${primary_key}`;
    } else if (orgId) {
      endpoint = `http://localhost:8000/org/${orgId}`;
    }
    if (!endpoint) return;

    console.log('➡️ Fetching full org record from', endpoint);
    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error('Org not found');
        return res.json();
      })
      .then((full) => {
        console.log('✅ Got full org:', full);
        setDetails(full);
      })
      .catch((err) => {
        console.error('❌ Failed to fetch org details:', err);
      });
  }, [primary_key, orgId]);

  // Render using `details`, which now has .name/.description/.logo
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h2>{details.name || details.title || 'Unnamed Organization'}</h2>
      <p>{details.description || 'No description available.'}</p>

      {details.logo && (
        <img
          src={`/org_images/${details.logo}`}
          alt={details.name || details.title}
          style={{
            width: '100%',
            maxHeight: '300px',
            objectFit: 'contain',
            marginTop: '20px',
          }}
        />
      )}

      {details.url && (
        <p>
          <a href={details.url} target="_blank" rel="noopener noreferrer">
            Visit Website
          </a>
        </p>
      )}
    </div>
  );
};

export default OrgDetails;
