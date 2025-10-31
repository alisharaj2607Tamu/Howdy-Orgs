import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    Email: '',
    PWD: '',
    Name: '',
    Interest1: '',
    Interest2: '',
    Interest3: '',
    Clubs: []
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!response.ok) throw new Error('Failed to register or update user');

      localStorage.setItem('userEmail', form.Email);
      localStorage.setItem('userName', form.Name);
      localStorage.setItem('interests', JSON.stringify([form.Interest1, form.Interest2, form.Interest3]));
      localStorage.setItem('clubs', form.Clubs.join(', '));
      navigate('/home');
    } catch (error) {
      console.error('Registration error:', error);
    }
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
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '620px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e0dcdc'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#500000',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>Register</h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Basic Info */}
          {['Email', 'Name'].map(field => (
            <div key={field} style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: '#333' }}>{field}</label>
              <input
                type="text"
                name={field}
                value={form[field]}
                onChange={handleChange}
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  backgroundColor: '#f7f9fc',
                  fontSize: '1rem'
                }}
              />
            </div>
          ))}

          {/* Password */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: '#333' }}>Password</label>
            <input
              type="password"
              name="PWD"
              value={form.PWD}
              onChange={handleChange}
              style={{
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #ccc',
                backgroundColor: '#f7f9fc',
                fontSize: '1rem'
              }}
            />
          </div>

          {/* Interests */}
          <div>
            <label style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: '#444' }}>Select your top 3 Interests</label>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {['Interest1', 'Interest2', 'Interest3'].map((interestKey) => (
                <select
                  key={interestKey}
                  name={interestKey}
                  value={form[interestKey]}
                  onChange={handleChange}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    backgroundColor: '#f7f9fc',
                    fontSize: '1rem'
                  }}
                >
                  <option value="">Select Interest</option>
                  {interests
                    .filter(i => i === form[interestKey] || !Object.values(form).includes(i))
                    .map(i => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                </select>
              ))}
            </div>
          </div>

          {/* Clubs */}
          <div>
            <label style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', display: 'block', color: '#444' }}>Select Clubs</label>
            <Select
              isMulti
              name="Clubs"
              options={clubOptions.map(c => ({ value: c, label: c }))}
              value={form.Clubs.map(c => ({ value: c, label: c }))}
              onChange={selected =>
                setForm({ ...form, Clubs: selected.map(s => s.value) })
              }
              styles={{
                control: base => ({
                  ...base,
                  borderRadius: '8px',
                  borderColor: '#ccc',
                  backgroundColor: '#f7f9fc',
                  fontSize: '0.95rem'
                }),
                menu: base => ({ ...base, zIndex: 10 }),
                multiValue: base => ({ ...base, backgroundColor: '#d9e2ec' })
              }}
            />
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button type="submit" style={{
              backgroundColor: '#500000',
              color: '#fff',
              fontWeight: '600',
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              marginTop: '1rem'
            }}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;