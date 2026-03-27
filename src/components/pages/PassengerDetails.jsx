import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';
import { bookingService } from '../../services/bookingService';
import { paymentService } from '../../services/paymentService';
import './PassengerDetails.css';

const PassengerDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get booking data from navigation state
  const { schedule_type, schedule_id, number_of_seats, total_amount, journey_details } = location.state || {};
  
  const [passengers, setPassengers] = useState([]);
  const [contactDetails, setContactDetails] = useState({
    phone: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    // Check authentication
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      alert('Please login to continue');
      navigate('/login');
      return;
    }
    setUser(currentUser);
    
    // Initialize with default passenger based on number of seats
    initializePassengers(number_of_seats || 1);
    
    // Pre-fill contact details from user profile
    setContactDetails({
      phone: currentUser.phone || '+91 ',
      email: currentUser.email || ''
    });
  }, [navigate, number_of_seats]);

  const initializePassengers = (count) => {
    const initialPassengers = [];
    for (let i = 0; i < count; i++) {
      initialPassengers.push({
        name: user?.get_full_name || user?.username || '',
        age: '',
        gender: 'OTHER',
        seat_preference: 'WINDOW'
      });
    }
    setPassengers(initialPassengers);
  };

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleAddPassenger = () => {
    if (passengers.length >= 6) {
      alert('Maximum 6 passengers allowed per booking');
      return;
    }
    setPassengers([
      ...passengers,
      {
        name: user?.get_full_name || user?.username || '',
        age: '',
        gender: 'OTHER',
        seat_preference: 'WINDOW'
      }
    ]);
  };

  const handleRemovePassenger = (index) => {
    if (passengers.length <= 1) {
      alert('At least one passenger is required');
      return;
    }
    const updated = passengers.filter((_, i) => i !== index);
    setPassengers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all passengers
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.name || !p.age || !p.gender) {
        alert(`Please fill all details for passenger ${i + 1}`);
        return;
      }
      if (parseInt(p.age) < 0 || parseInt(p.age) > 150) {
        alert(`Invalid age for passenger ${i + 1}`);
        return;
      }
    }
    
    // Validate contact details
    if (!contactDetails.phone || !contactDetails.email) {
      alert('Please provide contact details');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Step 1: Create booking
      const bookingData = {
        schedule_type: schedule_type,
        schedule_id: schedule_id,
        number_of_seats: passengers.length,
      };
      
      const bookingResponse = await bookingService.createBooking(bookingData);
      const bookingId = bookingResponse.booking_id;
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      const orderResponse = await paymentService.createOrder({
        amount: calculateTotalFare().toFixed(2),
        booking_id: bookingId,
        currency: 'INR',
      });

      const options = {
        key: orderResponse.key,
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: 'MyTravel',
        description: `Booking #${bookingId}`,
        order_id: orderResponse.order_id,
        handler: async (paymentResult) => {
          try {
            const verifyResponse = await paymentService.verifyPayment({
              ...paymentResult,
              passengers,
              contact_details: contactDetails,
            });
            navigate(`/bookings/${verifyResponse.booking_id || bookingId}`);
          } catch (verifyErr) {
            const verifyMessage = verifyErr.response?.data?.error || 'Payment verification failed.';
            setError(verifyMessage);
          }
        },
        prefill: {
          name: user?.full_name || user?.username || '',
          email: contactDetails.email,
          contact: contactDetails.phone,
        },
        theme: {
          color: '#1a73e8',
        },
        modal: {
          ondismiss: () => setError('Payment was cancelled. Booking remains pending.'),
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to create booking. Please try again.';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalFare = () => {
    const baseAmount = total_amount || 0;
    const taxes = baseAmount * 0.18; // 18% GST example
    return baseAmount + taxes;
  };

  return (
    <div className="passenger-details-container">
      <div className="header-section">
        <h1>Passenger Details</h1>
        <p>Please enter passenger information to proceed with booking</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="booking-form">
        {/* Journey Summary */}
        <div className="journey-summary">
          <h3>Journey Details</h3>
          {journey_details && (
            <div className="summary-content">
              <div className="route">
                <strong>{journey_details.source}</strong> → <strong>{journey_details.destination}</strong>
              </div>
              <div className="date">
                Date: {new Date(journey_details.date).toLocaleDateString()}
              </div>
              <div className="seats">
                Passengers: {passengers.length}
              </div>
              <div className="total-fare">
                Total Fare: ₹{calculateTotalFare().toFixed(2)}
              </div>
            </div>
          )}
        </div>

        {/* Passenger Information */}
        <div className="passengers-section">
          <h3>Passenger Information</h3>
          
          {passengers.map((passenger, index) => (
            <div key={index} className="passenger-card">
              <div className="passenger-header">
                <h4>Passenger {index + 1}</h4>
                {passengers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePassenger(index)}
                    className="remove-passenger-btn"
                  >
                    ✕ Remove
                  </button>
                )}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={passenger.name}
                    onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Age *</label>
                  <input
                    type="number"
                    value={passenger.age}
                    onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                    placeholder="Age"
                    min="0"
                    max="150"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Gender *</label>
                  <select
                    value={passenger.gender}
                    onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                    required
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Seat Preference</label>
                  <select
                    value={passenger.seat_preference}
                    onChange={(e) => handlePassengerChange(index, 'seat_preference', e.target.value)}
                  >
                    <option value="WINDOW">Window</option>
                    <option value="AISLE">Aisle</option>
                    <option value="MIDDLE">Middle</option>
                    {schedule_type === 'TRAIN' && (
                      <>
                        <option value="LOWER">Lower Berth</option>
                        <option value="MIDDLE_BERTH">Middle Berth</option>
                        <option value="UPPER">Upper Berth</option>
                        <option value="SIDE_LOWER">Side Lower</option>
                        <option value="SIDE_UPPER">Side Upper</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={handleAddPassenger}
            className="add-passenger-btn"
            disabled={passengers.length >= 6}
          >
            + Add Another Passenger
          </button>
        </div>

        {/* Contact Details */}
        <div className="contact-section">
          <h3>Contact Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                value={contactDetails.phone}
                onChange={(e) => setContactDetails({...contactDetails, phone: e.target.value})}
                placeholder="+91 XXXXXXXXXX"
                pattern="[+]{1}[0-9]{11,13}"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                value={contactDetails.email}
                onChange={(e) => setContactDetails({...contactDetails, email: e.target.value})}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="back-btn"
          >
            ← Back
          </button>
          
          <button
            type="submit"
            className="proceed-btn"
            disabled={loading}
          >
            {loading ? 'Processing...' : `Pay & Confirm Booking - ₹${calculateTotalFare().toFixed(2)}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PassengerDetails;
