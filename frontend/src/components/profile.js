import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const interests = [
  "Academic", "Acting", "Advisory", "Advocacy", "Agriculture", "Architecture", "Arts", "Athletic",
  "Business", "Career", "Community", "Consulting", "Cultural", "Development", "Education",
  "Engineering", "Entertainment", "Environmental", "Film", "Food", "Fraternity", "Gaming",
  "Governance", "Health", "Honors", "Interest", "International", "Law", "Leadership", "Marine",
  "Maritime", "Military", "MultiCultural", "Music", "Pantry", "Performance", "Politics",
  "Professional", "Recreation", "Religious", "Research", "Residence", "Science", "Service",
  "Social", "Sorority", "Special", "Spiritual", "Sports", "Support", "Technical", "Traditions",
  "Unity", "Veterinary", "Visualisation"
];

const clubOptions = [
  "The 12th Can", "12th Law Man", "180 Degrees Consulting TAMU", "1st Battalion Staff",
  "1st Brigade", "1st Group Staff", "1st Regiment", "1st Wing", "2nd Group Staff",
  "3rd Battalion Staff", "4th Group Staff", "5th Battalion Staff", "6th Battalion Staff",
  "7th Battalion Staff", "A Battery", "A&M Esports", "A&M Photography Club",
  "A&M Students Promoting Innovation and Research Advancement", "A&M United Methodist Church's College Ministry",
  "A-Company Band", "A-Line Magazine", "Academy of General Dentistry FellowTrack",
  "Adventist Christian Fellowship", "Aerospace Engineering Graduate Student Association",
  "Aesthetic and Cosmetic Dentistry Club", "African Students Association",
  "Agape Family Medicine Clinic", "Aggie Accounting Association", "Aggie ACHIEVEMates",
  "Aggie Actuaries", "Aggie Adaptive Sports", "Aggie Advertising Club",
  "Aggie Aerospace Women in Engineering", "Aggie Ambassadors", "Aggie Angels",
  "Aggie Anglers", "The Aggie Arthouse", "Aggie Artificial Intelligence Society",
  "Aggie Aspiring Educators", "Aggie Athletic Trainers' Association", "Aggie Babes",
  "Aggie Ballet Company", "Aggie Bandsmen", "Aggie Barbeque Club", "Aggie Belles",
  "Aggie Black Male Connection", "Aggie Blacksmithing Club", "Aggie Blades",
  "Aggie Blossoms", "Aggie Business Brothers", "Aggie Business Kings", "Aggie Camping",
  "Aggie Classics", "Aggie Club of Engineers", "Aggie Coding Club",
  "Aggie Competitive Programming Club", "Aggie Cricket Club", "Aggie Data Science Club",
  "Aggie Doc Musicians: Rhythms and Remedies", "Aggie Eagle Post", "Aggie Eco-Representatives",
  "Aggie Emeralds", "Aggie Financial Womens Association", "Aggie Fish Club",
  "Aggie Forensic Investigative Science Organization", "Aggie French Club", "Aggie Gems",
  "Aggie Gentlemen of Integrity", "Aggie Girl Scouts", "Aggie Golden Arrows",
  "Aggie Guide-Dogs and Service-Dogs", "Aggie Habitat for Humanity", "Aggie Icers",
  "Aggie Internship Club", "Aggie Investment Club", "Aggie Keys",
  "Aggie Knitting, Crafting, and More", "Aggie Kolbitar Society", "Aggie Lemon Racing",
  "The Aggie Magic Circle", "Aggie Makers Guild", "Aggie MedReach", "Aggie Men's Alliance",
  "Aggie Men's Club", "Aggie Mental Health Ambassadors", "Aggie Military Family Alliance",
  "Aggie Military, Veterans, and First Responder Healthcare Alliance",
  "Aggie Minority Women in Law", "Aggie Miracle", "Aggie Musical Theater Club",
  "Aggie Muster Committee", "Aggie Nations", "Aggie Newborn and Obstetrics Nurses Association",
  "Aggie Optometry Association", "Aggie Orientation Leaders", "Aggie Originals",
  "Aggie Outdoors", "Aggie Parent & Family Ambassadors", "Aggie Pediatric Nursing Association",
  "Aggie Pregnant and Parenting Student Organization", "Aggie Pullers", "Aggie Quiz Bowl",
  "Aggie Recovery Community", "Aggie Recruitment Committee", "Aggie Replant",
  "Aggie REPS for the Department of Agricultural Economics", "Aggie Robotics",
  "Aggie Roller Hockey", "Aggie Rotaract", "Aggie Royals", "Aggie Salvation Army",
  "Aggie School Volunteers", "Aggie Securities Fund", "Aggie Shields",
  "Aggie Sisters for Christ", "Aggie Sisters in Healthcare", "Aggie Society for Anime and Manga Art",
  "Aggie Southern Darlings", "Aggie Speleological Society", "Aggie Students in Human Resource Development",
  "Aggie Students Supporting Israel", "Aggie Supply Chain Professionals", "Aggie Swamp Club",
  "Aggie Sweethearts", "Aggie Transition Camps (ATC)", "Aggie Vanguard Men's Organization",
  "Aggie West Coast Swing Dance Club", "Aggie Women in Business",
  "Aggie Women in Computer Science at Texas A&M University", "Aggie Women in Construction",
  "Aggie Women in Entomology", "Aggie Wranglers", "Aggie Yacht Club", "AggieCatholic",
  "The Aggieland", "Aggieland Growing through Selfless Service", "Aggieland Mariachi",
  "Aggieland Orchestra/Dukes of Aggieland", "Aggies Against Cancer", "Aggies All Booked",
  "Aggies Create", "Aggies Fighting Human Trafficking", "Aggies for Christ On Campus",
  "Aggies for Limbs", "Aggies for Truth", "Aggies in Foreign Affairs",
  "Aggies in Science, Technology and Engineering Policy", "Aggies Progressing in Excellence",
  "Aggies Promoting Literacy", "Aggies Pursuing Healthcare", "Aggies Reaching Out",
  "Aggies Selflessly Serving In Shaping Tomorrow - ASSIST", "Aggies Serving the Aging Population",
  "Aggies to Medicine", "Aggies with Disabilities", "AggieSat Laboratory", "aggieTEACH",
  "Agricultural Economics Society", "Agricultural Systems Management", "Ags REACH",
  "Akh Mastani", "Album of the Week", "Alexander Hamilton Society"
];

const Profile = () => {
  const [userData, setUserData] = useState({
    Email: '',
    Name: '',
    Interest1: '',
    Interest2: '',
    Interest3: '',
    Clubs: []
  });

  useEffect(() => {
    const email = localStorage.getItem('userEmail') || '';
    if (!email) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/user-profile?email=${encodeURIComponent(email)}`);
        const user = await res.json();

        setUserData({
          Email: user.Email,
          Name: user.Name || '',
          Interest1: user.Interest1 || '',
          Interest2: user.Interest2 || '',
          Interest3: user.Interest3 || '',
          Clubs: user.Clubs ? user.Clubs.map(c => c.trim()).filter(Boolean) : []
        });

        localStorage.setItem('userName', user.Name);
        localStorage.setItem('interests', JSON.stringify([user.Interest1, user.Interest2, user.Interest3]));
        localStorage.setItem('clubs', user.Clubs.join(', '));
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    const updatedInterests = [
      userData.Interest1.trim(),
      userData.Interest2.trim(),
      userData.Interest3.trim()
    ];

    localStorage.setItem('userName', userData.Name.trim());
    localStorage.setItem('interests', JSON.stringify(updatedInterests));
    localStorage.setItem('clubs', userData.Clubs.join(', '));

    const payload = {
      Email: userData.Email,
      Name: userData.Name.trim(),
      Interest1: updatedInterests[0],
      Interest2: updatedInterests[1],
      Interest3: updatedInterests[2],
      Clubs: userData.Clubs
    };

    try {
      const res = await fetch('http://localhost:8000/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (res.ok) {
        alert('Profile updated successfully!');
      } else {
        throw new Error(result.detail || 'Update failed');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile on server.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>My Profile</h2>

      <div style={{ marginBottom: '15px' }}>
        <label><strong>Email:</strong></label><br />
        <input
          type="text"
          value={userData.Email}
          disabled
          style={{ width: '100%', padding: '0.75rem', backgroundColor: '#eee', borderRadius: '6px', border: '1px solid #ccc' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label><strong>Name:</strong></label><br />
        <input
          type="text"
          value={userData.Name}
          onChange={(e) => handleChange('Name', e.target.value)}
          style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
        />
      </div>

      {['Interest1', 'Interest2', 'Interest3'].map((interestKey, idx) => (
        <div key={interestKey} style={{ marginBottom: '15px' }}>
          <label><strong>{`Interest ${idx + 1}`}</strong></label><br />
          <select
            name={interestKey}
            value={userData[interestKey]}
            onChange={(e) => handleChange(interestKey, e.target.value)}
            style={{ padding: '0.75rem', width: '100%', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#eef2fa' }}
          >
            <option value="">Select Interest</option>
            {interests
              .filter(i => i !== userData.Interest1 && i !== userData.Interest2 && i !== userData.Interest3 || i === userData[interestKey])
              .map(i => (
                <option key={i} value={i}>{i}</option>
              ))}
          </select>
        </div>
      ))}

      <div style={{ marginBottom: '15px' }}>
        <label><strong>Clubs:</strong></label>
        <Select
          isMulti
          name="Clubs"
          options={clubOptions.map(c => ({ value: c, label: c }))}
          value={userData.Clubs.map(c => ({ value: c, label: c }))}
          onChange={selected =>
            handleChange("Clubs", selected.map(s => s.value))
          }
          styles={{
            control: (base) => ({
              ...base,
              padding: '4px',
              borderRadius: '6px',
              borderColor: '#ccc',
              backgroundColor: '#eef2fa'
            }),
            menu: base => ({ ...base, zIndex: 100 }),
            multiValue: base => ({ ...base, backgroundColor: '#ddd' })
          }}
        />
      </div>

      <button
        onClick={handleSave}
        style={{
          padding: '10px 20px',
          backgroundColor: '#500000',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Save Profile
      </button>
    </div>
  );
};

export default Profile;
