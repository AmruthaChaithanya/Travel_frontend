import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import { authService } from '../../services/authService';
import './Search.css';

const Flights = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [numberOfSeats, setNumberOfSeats] = useState(1);

  const isBookable = (item) => {
    if (!item?.journey_date || !item?.departure_time) return false;
    const departure = new Date(`${item.journey_date}T${item.departure_time}`);
    if (Number.isNaN(departure.getTime())) return false;
    return departure.getTime() > Date.now() + 6 * 60 * 60 * 1000;
  };

  useEffect(() => {
    fetchFlights();
  }, [searchParams]);

  const fetchFlights = async () => {
    setLoading(true);
    setError('');
    
    try {
      const params = {
        source: searchParams.get('from') || '',
        destination: searchParams.get('to') || '',
        journey_date: searchParams.get('date') || '',
      };
      
      const data = await ticketService.getFlights(params);
      const normalized = Array.isArray(data) ? data : [];
      setFlights(normalized.filter(isBookable));
    } catch (err) {
      setError('Failed to fetch flights. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (flight) => {
    // Check if user is logged in
    const user = authService.getCurrentUser();
    if (!user) {
      alert('Please login to book tickets');
      navigate('/login');
      return;
    }
    
    setSelectedFlight(flight);
    setNumberOfSeats(1);
    setShowBookingModal(true);
  };

  const handleBookNowClick = () => {
    // Check if user is logged in
    const user = authService.getCurrentUser();
    if (!user) {
      alert('Please login to book tickets');
      navigate('/login');
      return;
    }
    
    // Navigate to passenger details page with flight information
    navigate('/passenger-details', {
      state: {
        schedule_type: 'FLIGHT',
        schedule_id: selectedFlight.id,
        number_of_seats: numberOfSeats,
        total_amount: selectedFlight.base_fare * numberOfSeats,
        journey_details: {
          source: selectedFlight.departure_airport,
          destination: selectedFlight.arrival_airport,
          date: selectedFlight.journey_date,
          time: selectedFlight.departure_time,
          airline: selectedFlight.airline_name,
          flight_number: selectedFlight.flight_number
        }
      }
    });
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <h1>Available Flights</h1>
        {searchParams.get('from') && searchParams.get('to') && (
          <p>
            From: {searchParams.get('from')} → To: {searchParams.get('to')}
            {searchParams.get('date') && ` | ${searchParams.get('date')}`}
          </p>
        )}
      </div>

      {loading && <div className="loading">Loading flights...</div>}
      
      {error && <div className="error">{error}</div>}

      {!loading && !error && flights.length === 0 && (
        <div className="no-results">
          No flights found. Try adjusting your search criteria.
        </div>
      )}

      <div className="results-list">
        {flights.map((flight) => (
          <div key={flight.id} className="result-card">
            <div className="card-header">
              <h3>{flight.airline_name}</h3>
              <span className="flight-number">{flight.flight_number}</span>
            </div>
            
            <div className="card-body">
              <div className="route">
                <div className="airport">
                  <span className="time">{flight.departure_time}</span>
                  <span className="city">{flight.departure_airport}</span>
                </div>
                <div className="duration">
                  <span className="line"></span>
                  <span className="time-text">{flight.duration}</span>
                </div>
                <div className="airport">
                  <span className="time">{flight.arrival_time}</span>
                  <span className="city">{flight.arrival_airport}</span>
                </div>
              </div>

              <div className="details">
                <span className="class">{flight.seat_class}</span>
                <span className="available">{flight.available_seats} seats available</span>
              </div>
            </div>

            <div className="card-footer">
              <div className="price">
                <span className="amount">₹{(parseFloat(flight.base_fare) + parseFloat(flight.taxes || 0)).toFixed(2)}</span>
                <span className="tax">(incl. taxes)</span>
              </div>
              <button 
                className="book-btn"
                onClick={() => handleBookNow(flight)}
                disabled={flight.available_seats === 0}
              >
                {flight.available_seats === 0 ? 'Sold Out' : 'Book Now'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal - Simplified */}
      {showBookingModal && selectedFlight && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Ready to Book?</h2>
            
            <div className="flight-summary">
              <h4>Flight Details</h4>
              <p><strong>Airline:</strong> {selectedFlight.airline_name}</p>
              <p><strong>Flight Number:</strong> {selectedFlight.flight_number}</p>
              <p><strong>Route:</strong> {selectedFlight.departure_airport} → {selectedFlight.arrival_airport}</p>
              <p><strong>Date:</strong> {selectedFlight.journey_date}</p>
              <p><strong>Departure:</strong> {selectedFlight.departure_time}</p>
            </div>

            <div className="form-group">
              <label>Number of Seats</label>
              <input
                type="number"
                min="1"
                max={selectedFlight.available_seats}
                value={numberOfSeats}
                onChange={(e) => setNumberOfSeats(parseInt(e.target.value))}
                required
              />
            </div>

            <div className="price-calculation">
              <p>Total Amount: <strong>₹{((parseFloat(selectedFlight.base_fare) + parseFloat(selectedFlight.taxes || 0)) * numberOfSeats).toFixed(2)}</strong></p>
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

export default Flights;
