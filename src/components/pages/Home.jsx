import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('flights');
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: '',
  });

  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (activeTab === 'flights') {
      navigate(`/flights?from=${searchData.from}&to=${searchData.to}&date=${searchData.date}`);
    } else if (activeTab === 'buses') {
      navigate(`/trains?from=${searchData.from}&to=${searchData.to}&date=${searchData.date}`);
    } else if (activeTab === 'trains') {
      navigate(`/trains?from=${searchData.from}&to=${searchData.to}&date=${searchData.date}`);
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Plan Your Journey with MyTravel</h1>
          <p>Search and book flights, buses, and trains at the best prices</p>
          
          {/* Search Box */}
          <div className="search-box">
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'flights' ? 'active' : ''}`}
                onClick={() => setActiveTab('flights')}
              >
                ✈️ Flights
              </button>
              <button 
                className={`tab ${activeTab === 'buses' ? 'active' : ''}`}
                onClick={() => setActiveTab('buses')}
              >
                🚌 Buses
              </button>
              <button 
                className={`tab ${activeTab === 'trains' ? 'active' : ''}`}
                onClick={() => setActiveTab('trains')}
              >
                🚂 Trains
              </button>
            </div>

            <form onSubmit={handleSubmit} className="search-form">
              <div className="form-row">
                <div className="input-group">
                  <label>From</label>
                  <input
                    type="text"
                    name="from"
                    value={searchData.from}
                    onChange={handleChange}
                    placeholder="City or Station"
                    required
                  />
                </div>

                <div className="input-group">
                  <label>To</label>
                  <input
                    type="text"
                    name="to"
                    value={searchData.to}
                    onChange={handleChange}
                    placeholder="City or Station"
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={searchData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="search-btn">
                Search {activeTab === 'flights' ? 'Flights' : activeTab === 'buses' ? 'Buses' : 'Trains'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose MyTravel?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Booking</h3>
            <p>Your bookings are protected with secure payment gateways</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Best Prices</h3>
            <p>We guarantee the best prices for all your travel needs</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Instant Confirmation</h3>
            <p>Get instant booking confirmation and e-tickets</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎧</div>
            <h3>24/7 Support</h3>
            <p>Round-the-clock customer support for all your queries</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
