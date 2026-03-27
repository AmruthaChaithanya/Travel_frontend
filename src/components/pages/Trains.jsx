import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import { authService } from '../../services/authService';
import './Search.css';

const Trains = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [numberOfSeats, setNumberOfSeats] = useState(1);

  const isBookable = (item) => {
    if (!item?.journey_date || !item?.departure_time) return false;
    const departure = new Date(`${item.journey_date}T${item.departure_time}`);
    if (Number.isNaN(departure.getTime())) return false;
    return departure.getTime() > Date.now() + 6 * 60 * 60 * 1000;
  };

  useEffect(() => {
    fetchTrains();
  }, [searchParams]);

  const fetchTrains = async () => {
    setLoading(true);
    setError('');
    
    try {
      const params = {
        source: searchParams.get('from') || '',
        destination: searchParams.get('to') || '',
        journey_date: searchParams.get('date') || '',
      };
      
      const data = await ticketService.getTrains(params);
      const normalized = Array.isArray(data) ? data : [];
      setTrains(normalized.filter(isBookable));
    } catch (err) {
      setError('Failed to fetch trains. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (train) => {
    // Check if user is logged in
    const user = authService.getCurrentUser();
    if (!user) {
      alert('Please login to book tickets');
      navigate('/login');
      return;
    }
    
    setSelectedTrain(train);
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
    
    // Navigate to passenger details page with train information
    navigate('/passenger-details', {
      state: {
        schedule_type: 'TRAIN',
        schedule_id: selectedTrain.id,
        number_of_seats: numberOfSeats,
        total_amount: selectedTrain.base_fare * numberOfSeats,
        journey_details: {
          source: selectedTrain.source_station,
          destination: selectedTrain.destination_station,
          date: selectedTrain.journey_date,
          time: selectedTrain.departure_time,
          train_name: selectedTrain.train_name,
          train_number: selectedTrain.train_number
        }
      }
    });
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <h1>Available Trains</h1>
        {searchParams.get('from') && searchParams.get('to') && (
          <p>
            From: {searchParams.get('from')} → To: {searchParams.get('to')}
            {searchParams.get('date') && ` | ${searchParams.get('date')}`}
          </p>
        )}
      </div>

      {loading && <div className="loading">Loading trains...</div>}
      
      {error && <div className="error">{error}</div>}

      {!loading && !error && trains.length === 0 && (
        <div className="no-results">
          No trains found. Try adjusting your search criteria.
        </div>
      )}

      <div className="results-list">
        {trains.map((train) => (
          <div key={train.id} className="result-card">
            <div className="card-header">
              <h3>{train.train_name}</h3>
              <span className="train-number">{train.train_number}</span>
            </div>
            
            <div className="card-body">
              <div className="route">
                <div className="station">
                  <span className="time">{train.departure_time}</span>
                  <span className="city">{train.source_station}</span>
                </div>
                <div className="duration">
                  <span className="line"></span>
                  <span className="time-text">{train.duration}</span>
                </div>
                <div className="station">
                  <span className="time">{train.arrival_time}</span>
                  <span className="city">{train.destination_station}</span>
                </div>
              </div>

              <div className="details">
                <span className="class">{train.coach_class}</span>
                <span className="available">{train.available_seats} seats available</span>
              </div>
            </div>

            <div className="card-footer">
              <div className="price">
                <span className="amount">₹{(parseFloat(train.base_fare) + parseFloat(train.taxes || 0)).toFixed(2)}</span>
                <span className="tax">(incl. taxes)</span>
              </div>
              <button 
                className="book-btn"
                onClick={() => handleBookNow(train)}
                disabled={train.available_seats === 0}
              >
                {train.available_seats === 0 ? 'Sold Out' : 'Book Now'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal - Simplified */}
      {showBookingModal && selectedTrain && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Ready to Book?</h2>
            
            <div className="train-summary">
              <h4>Train Details</h4>
              <p><strong>Train:</strong> {selectedTrain.train_name} - {selectedTrain.train_number}</p>
              <p><strong>Route:</strong> {selectedTrain.source_station} → {selectedTrain.destination_station}</p>
              <p><strong>Date:</strong> {selectedTrain.journey_date}</p>
              <p><strong>Departure:</strong> {selectedTrain.departure_time}</p>
            </div>

            <div className="form-group">
              <label>Number of Seats</label>
              <input
                type="number"
                min="1"
                max={selectedTrain.available_seats}
                value={numberOfSeats}
                onChange={(e) => setNumberOfSeats(parseInt(e.target.value))}
                required
              />
            </div>

            <div className="price-calculation">
              <p>Total Amount: <strong>₹{((parseFloat(selectedTrain.base_fare) + parseFloat(selectedTrain.taxes || 0)) * numberOfSeats).toFixed(2)}</strong></p>
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

export default Trains;
