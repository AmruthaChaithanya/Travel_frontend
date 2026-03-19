import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import './MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await bookingService.getBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to fetch bookings. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingService.cancelBooking(bookingId);
      alert('Booking cancelled successfully!');
      fetchBookings();
    } catch (err) {
      alert('Failed to cancel booking. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="my-bookings-container">
      <h1>My Bookings</h1>

      {loading && <div className="loading">Loading your bookings...</div>}
      
      {error && <div className="error">{error}</div>}

      {!loading && !error && bookings.length === 0 && (
        <div className="no-bookings">
          <p>You haven't made any bookings yet.</p>
          <Link to="/" className="browse-btn">Browse Flights, Trains & Buses</Link>
        </div>
      )}

      <div className="bookings-list">
        {bookings.map((booking) => (
          <div key={booking.id} className="booking-card">
            <div className="booking-header">
              <div className="pnr-info">
                <span className="pnr-label">PNR:</span>
                <span className="pnr-number">{booking.ticket?.pnr}</span>
              </div>
              <span className={`status ${booking.status?.toLowerCase()}`}>
                {booking.status}
              </span>
            </div>

            <div className="booking-body">
              <div className="ticket-type">
                {booking.ticket?.ticket_type === 'FLIGHT' && '✈️ Flight'}
                {booking.ticket?.ticket_type === 'TRAIN' && '🚂 Train'}
                {booking.ticket?.ticket_type === 'BUS' && '🚌 Bus'}
              </div>

              <div className="route-info">
                <strong>{booking.ticket?.source}</strong> →{' '}
                <strong>{booking.ticket?.destination}</strong>
              </div>

              <div className="journey-date">
                Journey Date: {new Date(booking.ticket?.journey_date).toLocaleDateString()}
              </div>

              <div className="passenger-info">
                {booking.ticket?.passenger_name} ({booking.ticket?.passenger_age} yrs)
              </div>
            </div>

            <div className="booking-footer">
              <div className="booking-price">
                Total Paid: ₹{booking.ticket?.total_amount}
              </div>
              
              <div className="booking-actions">
                <Link 
                  to={`/bookings/${booking.id}`}
                  className="view-btn"
                >
                  View Details
                </Link>
                
                {booking.status !== 'CANCELLED' && (
                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    className="cancel-btn-small"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
