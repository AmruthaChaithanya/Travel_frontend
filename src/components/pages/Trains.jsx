import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import { bookingService } from '../../services/bookingService';
import './Search.css';

const Trains = () => {
  const [searchParams] = useSearchParams();
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const [passengerData, setPassengerData] = useState({
    passenger_name: '',
    passenger_age: '',
    passenger_gender: 'Male',
    contact_number: '',
    contact_email: '',
  });

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
      setTrains(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to fetch trains. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (train) => {
    setSelectedTrain(train);
    setShowBookingModal(true);
  };

  const handlePassengerChange = (e) => {
    setPassengerData({
      ...passengerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const bookingData = {
        ticket_type: 'TRAIN',
        ticket_id: selectedTrain.id,
        ...passengerData,
      };
      
      await bookingService.createBooking(bookingData);
      alert('Booking successful!');
      setShowBookingModal(false);
      setPassengerData({
        passenger_name: '',
        passenger_age: '',
        passenger_gender: 'Male',
        contact_number: '',
        contact_email: '',
      });
    } catch (err) {
      alert('Booking failed. Please try again.');
      console.error(err);
    }
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
                  <span className="city">{train.source}</span>
                </div>
                <div className="duration">
                  <span className="line"></span>
                  <span className="time-text">{train.duration}</span>
                </div>
                <div className="station">
                  <span className="time">{train.arrival_time}</span>
                  <span className="city">{train.destination}</span>
                </div>
              </div>

              <div className="details">
                <span className="class">{train.coach}</span>
                <span className="available">Available</span>
              </div>
            </div>

            <div className="card-footer">
              <div className="price">
                <span className="amount">₹{train.base_fare}</span>
                <span className="tax">+ taxes</span>
              </div>
              <button 
                className="book-btn"
                onClick={() => handleBookNow(train)}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedTrain && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Book Your Train Ticket</h2>
            
            <div className="train-summary">
              <h4>Train Details</h4>
              <p>{selectedTrain.train_name} - {selectedTrain.train_number}</p>
              <p>{selectedTrain.source} → {selectedTrain.destination}</p>
              <p>Departure: {selectedTrain.departure_time} | Arrival: {selectedTrain.arrival_time}</p>
              <p className="total-price">Total: ₹{selectedTrain.base_fare}</p>
            </div>

            <form onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label>Passenger Name</label>
                <input
                  type="text"
                  name="passenger_name"
                  value={passengerData.passenger_name}
                  onChange={handlePassengerChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    name="passenger_age"
                    value={passengerData.passenger_age}
                    onChange={handlePassengerChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <select
                    name="passenger_gender"
                    value={passengerData.passenger_gender}
                    onChange={handlePassengerChange}
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="tel"
                  name="contact_number"
                  value={passengerData.contact_number}
                  onChange={handlePassengerChange}
                  required
                  pattern="[0-9]{10}"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="contact_email"
                  value={passengerData.contact_email}
                  onChange={handlePassengerChange}
                  required
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowBookingModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="confirm-btn">
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trains;
