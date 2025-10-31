import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/header';
import Home from './components/home';
import About from './components/about';
import AllOrgs from './components/allorgs';
import Profile from './components/profile';
import LoginRegister from './components/login';
import Register from './components/register';
import OrgDetails from './components/orgDetails';
import { useState, useEffect } from 'react';

const AppWrapper = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const location = useLocation();

  useEffect(() => {
    const storedLogin = localStorage.getItem('loggedIn') === 'true';
    const storedEmail = localStorage.getItem('userEmail') || '';
    setLoggedIn(storedLogin);
    setUserEmail(storedEmail);
  }, []);

  return (
    <div className="App">
      {location.pathname !== '/' && location.pathname !== '/register' && <Header />}
      <Routes>
        <Route
          path="/"
          element={loggedIn ? <Home /> : <LoginRegister setLoggedIn={setLoggedIn} setUserEmail={setUserEmail} />}
        />
        <Route
          path="/register"
          element={<Register setLoggedIn={setLoggedIn} setUserEmail={setUserEmail} />}
        />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/allorgs" element={<AllOrgs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/org/:orgId" element={<OrgDetails />} />
        <Route path="/sbert-org/:primary_key" element={<OrgDetails />} />

      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
