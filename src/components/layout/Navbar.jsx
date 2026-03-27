import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { authService } from '../../services/authService';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          MyTravel
        </Link>
        
        <button 
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="navbar-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/flights" className="navbar-link" onClick={() => setIsMenuOpen(false)}>Flights</Link>
          <Link to="/buses" className="navbar-link" onClick={() => setIsMenuOpen(false)}>Buses</Link>
          <Link to="/trains" className="navbar-link" onClick={() => setIsMenuOpen(false)}>Trains</Link>
          
          {user ? (
            <>
              <Link to="/my-bookings" className="navbar-link" onClick={() => setIsMenuOpen(false)}>My Bookings</Link>
              <Link to="/profile" className="navbar-link" onClick={() => setIsMenuOpen(false)}>Profile</Link>
              <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn-signup" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
