# MyTravel Frontend - React + Vite

A modern, responsive frontend application for MyTravel - a comprehensive travel booking platform for flights, trains, and buses.

## Technologies Used

- **React 19** - UI Library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Custom styling with modern features

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.jsx          # Route protection component
│   │   ├── layout/
│   │   │   ├── Navbar.jsx                  # Navigation bar
│   │   │   └── Navbar.css
│   │   └── pages/
│   │       ├── Home.jsx                    # Landing page with search
│   │       ├── Home.css
│   │       ├── Login.jsx                   # User login
│   │       ├── Register.jsx                # User registration
│   │       ├── Flights.jsx                 # Flight search & booking
│   │       ├── Trains.jsx                  # Train search & booking
│   │       ├── Buses.jsx                   # Bus search & booking
│   │       ├── MyBookings.jsx              # User's bookings list
│   │       ├── BookingDetails.jsx          # Individual booking details
│   │       ├── Profile.jsx                 # User profile management
│   │       └── [Component CSS files]
│   ├── services/
│   │   ├── api.js                          # Axios instance & interceptors
│   │   ├── authService.js                  # Authentication API calls
│   │   ├── ticketService.js                # Ticket/transport API calls
│   │   └── bookingService.js               # Booking API calls
│   ├── App.jsx                             # Main app component with routing
│   ├── App.css                             # Global app styles
│   ├── index.css                           # Base CSS
│   └── main.jsx                            # App entry point
├── package.json
├── vite.config.js
└── index.html
```

## Features

### Authentication
-  User Registration with validation
-  User Login/Logout
-  Protected routes for authenticated users
-  Session management

### Travel Booking
-  **Flights**: Search, browse, and book flights
-  **Buses**: Search, browse, and book buses  
-  **Trains**: Search, browse, and book trains

### User Dashboard
-  Profile management
-  View all bookings
-  Detailed booking information
-  Cancel bookings (with refund calculation)

### Key Features
-  Advanced search with filters
-  Secure booking flow
-  Fully responsive design
-  Real-time availability
-  Modern, intuitive UI

## 🔗 API Endpoints

The frontend connects to the following backend endpoints:

### Authentication
- `POST /api/accounts/register/` - Register new user
- `POST /api/accounts/login/` - User login
- `POST /api/accounts/logout/` - User logout
- `GET /api/accounts/profile/` - Get user profile
- `PATCH /api/accounts/profile/` - Update profile
- `GET /api/accounts/user/` - Get current user details

### Tickets & Transport
- `GET /api/tickets/flights/` - List flights
- `GET /api/tickets/trains/` - List trains
- `GET /api/tickets/buses/` - List buses
- `GET /api/trains/search/` - Search trains by stations

### Bookings
- `GET /api/bookings/` - Get user's bookings
- `GET /api/bookings/:id/` - Get booking details
- `POST /api/bookings/create/` - Create new booking
- `POST /api/bookings/:id/cancel/` - Cancel booking

## Security Features

- CSRF protection enabled
- Secure token-based authentication
- Protected routes for authenticated actions
- Input validation on forms
- Error handling and user feedback
