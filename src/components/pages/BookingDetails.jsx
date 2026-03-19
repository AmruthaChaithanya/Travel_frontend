import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import './BookingDetails.css';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await bookingService.getBooking(id);
      setBooking(data);
    } catch (err) {
      setError('Failed to fetch booking details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingService.cancelBooking(id);
      alert('Booking cancelled successfully!');
      fetchBooking();
    } catch (err) {
      alert('Failed to cancel booking. Please try again.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading booking details...</div>;
  }

  if (error || !booking) {
    return (
      <div className="error-container">
        <p>{error || 'Booking not found'}</p>
        <button onClick={() => navigate('/my-bookings')} className="back-btn">
          Back to My Bookings
        </button>
      </div>
    );
  }

  return (
    <div className="booking-details-container">
      <div className="details-header">
        <h1>Booking Details</h1>
        <button onClick={() => navigate('/my-bookings')} className="back-btn-small">
          ← Back to My Bookings
        </button>
      </div>

      <div className="details-card">
        <div className="card-banner">
          <div className="pnr-section">
            <span className="pnr-label">PNR Number</span>
            <span className="pnr-value">{booking.ticket?.pnr}</span>
          </div>
          <span className={`status-badge ${booking.status?.toLowerCase()}`}>
            {booking.status}
          </span>
        </div>

        <div className="card-content">
          <div className="info-section">
            <h3>Ticket Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Ticket Type:</span>
                <span className="value">
                  {booking.ticket?.ticket_type === 'FLIGHT' && '✈️ Flight'}
                  {booking.ticket?.ticket_type === 'TRAIN' && '🚂 Train'}
                  {booking.ticket?.ticket_type === 'BUS' && '🚌 Bus'}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Source:</span>
                <span className="value">{booking.ticket?.source}</span>
              </div>
              <div className="info-item">
                <span className="label">Destination:</span>
                <span className="value">{booking.ticket?.destination}</span>
              </div>
              <div className="info-item">
                <span className="label">Journey Date:</span>
                <span className="value">
                  {new Date(booking.ticket?.journey_date).toLocaleDateString()}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Journey Time:</span>
                <span className="value">{booking.ticket?.journey_time}</span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h3>Passenger Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Name:</span>
                <span className="value">{booking.ticket?.passenger_name}</span>
              </div>
              <div className="info-item">
                <span className="label">Age:</span>
                <span className="value">{booking.ticket?.passenger_age} years</span>
              </div>
              <div className="info-item">
                <span className="label">Gender:</span>
                <span className="value">{booking.ticket?.passenger_gender}</span>
              </div>
              <div className="info-item">
                <span className="label">Contact:</span>
                <span className="value">{booking.ticket?.contact_number}</span>
              </div>
              <div className="info-item">
                <span className="label">Email:</span>
                <span className="value">{booking.ticket?.contact_email}</span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h3>Fare Details</h3>
            <div className="fare-breakdown">
              <div className="fare-item">
                <span>Base Fare:</span>
                <span>₹{booking.ticket?.base_fare}</span>
              </div>
              <div className="fare-item">
                <span>Taxes:</span>
                <span>₹{booking.ticket?.taxes}</span>
              </div>
              <div className="fare-item total">
                <span>Total Amount:</span>
                <span>₹{booking.ticket?.total_amount}</span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h3>Booking Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Booked At:</span>
                <span className="value">
                  {new Date(booking.booked_at).toLocaleString()}
                </span>
              </div>
              {booking.payment_id && (
                <div className="info-item">
                  <span className="label">Payment ID:</span>
                  <span className="value">{booking.payment_id}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {booking.status !== 'CANCELLED' && (
          <div className="card-actions">
            <button onClick={handleCancelBooking} className="cancel-booking-btn">
              Cancel Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetails;
