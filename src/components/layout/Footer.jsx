import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>MyTravel</h3>
          <p>Your one-stop solution for booking flights, buses, and trains at the best prices.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/flights">Flights</a></li>
            <li><a href="/buses">Buses</a></li>
            <li><a href="/trains">Trains</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Account</h4>
          <ul>
            <li><a href="/login">Login</a></li>
            <li><a href="/register">Register</a></li>
            <li><a href="/my-bookings">My Bookings</a></li>
            <li><a href="/profile">Profile</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: support@mytravel.com</p>
          <p>Phone: +91 1234567890</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} MyTravel. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
