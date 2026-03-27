// @refresh reset
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/authService';
import { ticketService } from '../../services/ticketService';
import './Search.css';

const Buses = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedBus, setSelectedBus] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [numberOfSeats, setNumberOfSeats] = useState(1);

  const isBookable = (item) => {
    if (!item?.journey_date || !item?.departure_time) return false;
    const departure = new Date(`${item.journey_date}T${item.departure_time}`);
    if (Number.isNaN(departure.getTime())) return false;
    return departure.getTime() > Date.now() + 6 * 60 * 60 * 1000;
  };

  useEffect(() => {
    fetchBuses();
  }, [searchParams]);

  const fetchBuses = async () => {
    setLoading(true);
    setError('');
    
    try {
      const params = {
        source: searchParams.get('from') || '',
        destination: searchParams.get('to') || '',
        journey_date: searchParams.get('date') || '',
      };
      
      const data = await ticketService.getBuses(params);
      const normalized = Array.isArray(data) ? data : [];
      setBuses(normalized.filter(isBookable));
    } catch (err) {
      setError('Failed to fetch buses. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (bus) => {
    // Check if user is logged in
    const user = authService.getCurrentUser();
    if (!user) {
      alert('Please login to book tickets');
      navigate('/login');
      return;
    }
    
    setSelectedBus(bus);
    setNumberOfSeats(1);
    setShowBookingModal(true);
  };

  const handleBookNowClick = () => {
    // Navigate to passenger details page with bus information
    navigate('/passenger-details', {
      state: {
        schedule_type: 'BUS',
        schedule_id: selectedBus.id,
        number_of_seats: numberOfSeats,
        total_amount: selectedBus.base_fare * numberOfSeats,
        journey_details: {
          source: selectedBus.boarding_point,
          destination: selectedBus.dropping_point,
          date: selectedBus.journey_date,
          time: selectedBus.departure_time,
          bus_operator: selectedBus.bus_operator,
          bus_number: selectedBus.bus_number
        }
      }
    });
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <h1>Available Buses</h1>
        {searchParams.get('from') && searchParams.get('to') && (
          <p>
            From: {searchParams.get('from')} → To: {searchParams.get('to')}
            {searchParams.get('date') && ` | ${searchParams.get('date')}`}
          </p>
        )}
      </div>

      {loading && <div className="loading">Loading buses...</div>}
      
      {error && <div className="error">{error}</div>}

      {!loading && !error && buses.length === 0 && (
        <div className="no-results">
          No buses found. Try adjusting your search criteria.
        </div>
      )}

      <div className="results-list">
        {buses.map((bus) => (
          <div key={bus.id} className="result-card">
            <div className="card-header">
              <h3>{bus.bus_operator}</h3>
              <span className="bus-number">{bus.bus_number}</span>
            </div>
            
            <div className="card-body">
              <div className="route">
                <div className="point">
                  <span className="time">{bus.departure_time}</span>
                  <span className="city">{bus.boarding_point}</span>
                </div>
                <div className="duration">
                  <span className="line"></span>
                  <span className="time-text">{bus.duration}</span>
                </div>
                <div className="point">
                  <span className="time">{bus.arrival_time}</span>
                  <span className="city">{bus.dropping_point}</span>
                </div>
              </div>

              <div className="details">
                <span className="type">{bus.bus_type}</span>
                <span className="available">{bus.available_seats} seats available</span>
              </div>
            </div>

            <div className="card-footer">
              <div className="price">
                <span className="amount">₹{(parseFloat(bus.base_fare) + parseFloat(bus.taxes || 0)).toFixed(2)}</span>
                <span className="tax">(incl. taxes)</span>
              </div>
              <button 
                className="book-btn"
                onClick={() => handleBookNow(bus)}
                disabled={bus.available_seats === 0}
              >
                {bus.available_seats === 0 ? 'Sold Out' : 'Book Now'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal - Simplified */}
      {showBookingModal && selectedBus && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Ready to Book?</h2>
            
            <div className="bus-summary">
              <h4>Bus Details</h4>
              <p><strong>Operator:</strong> {selectedBus.bus_operator}</p>
              <p><strong>Route:</strong> {selectedBus.boarding_point} → {selectedBus.dropping_point}</p>
              <p><strong>Date:</strong> {selectedBus.journey_date}</p>
              <p><strong>Departure:</strong> {selectedBus.departure_time}</p>
            </div>

            <div className="form-group">
              <label>Number of Seats</label>
              <input
                type="number"
                min="1"
                max={selectedBus.available_seats}
                value={numberOfSeats}
                onChange={(e) => setNumberOfSeats(parseInt(e.target.value))}
                required
              />
            </div>

            <div className="price-calculation">
              <p>Total Amount: <strong>₹{((parseFloat(selectedBus.base_fare) + parseFloat(selectedBus.taxes || 0)) * numberOfSeats).toFixed(2)}</strong></p>
            </div>

            <div className="modal-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => setShowBookingModal(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="confirm-btn"
                onClick={handleBookNowClick}
              >
                Continue to Passenger Details →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Buses;
