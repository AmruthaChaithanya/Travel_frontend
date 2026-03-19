import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import { bookingService } from '../../services/bookingService';
import './Search.css';

const Buses = () => {
  const [searchParams] = useSearchParams();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedBus, setSelectedBus] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const [passengerData, setPassengerData] = useState({
    passenger_name: '',
    passenger_age: '',
    passenger_gender: 'Male',
    contact_number: '',
    contact_email: '',
  });

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
      setBuses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to fetch buses. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (bus) => {
    setSelectedBus(bus);
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
        ticket_type: 'BUS',
        ticket_id: selectedBus.id,
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
                  <span className="city">{bus.source}</span>
                </div>
                <div className="duration">
                  <span className="line"></span>
                  <span className="time-text">{bus.duration}</span>
                </div>
                <div className="point">
                  <span className="time">{bus.arrival_time}</span>
                  <span className="city">{bus.destination}</span>
                </div>
              </div>

              <div className="details">
                <span className="type">{bus.bus_type}</span>
                <span className="available">Available</span>
              </div>
            </div>

            <div className="card-footer">
              <div className="price">
                <span className="amount">₹{bus.base_fare}</span>
                <span className="tax">+ taxes</span>
              </div>
              <button 
                className="book-btn"
                onClick={() => handleBookNow(bus)}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedBus && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Book Your Bus Ticket</h2>
            
            <div className="bus-summary">
              <h4>Bus Details</h4>
              <p>{selectedBus.bus_operator} - {selectedBus.bus_number}</p>
              <p>{selectedBus.source} → {selectedBus.destination}</p>
              <p>Departure: {selectedBus.departure_time} | Arrival: {selectedBus.arrival_time}</p>
              <p className="total-price">Total: ₹{selectedBus.base_fare}</p>
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

export default Buses;
