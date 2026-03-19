# MyTravel Frontend - React + Vite

A modern, responsive frontend application for MyTravel - a comprehensive travel booking platform for flights, trains, and buses.

## 🚀 Technologies Used

- **React 19** - UI Library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Custom styling with modern features

## 📁 Project Structure

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

## 🎯 Features

### Authentication
- ✅ User Registration with validation
- ✅ User Login/Logout
- ✅ Protected routes for authenticated users
- ✅ Session management

### Travel Booking
- ✈️ **Flights**: Search, browse, and book flights
- 🚌 **Buses**: Search, browse, and book buses  
- 🚂 **Trains**: Search, browse, and book trains

### User Dashboard
- 👤 Profile management
- 📋 View all bookings
- 📄 Detailed booking information
- ❌ Cancel bookings (with refund calculation)

### Key Features
- 🔍 Advanced search with filters
- 💳 Secure booking flow
- 📱 Fully responsive design
- ⚡ Real-time availability
- 🎨 Modern, intuitive UI

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Install Dependencies
```bash
cd frontend
npm install
```

### Configure Backend Connection

The frontend is configured to connect to the Django backend at `http://localhost:8000/api`.

Make sure your Django backend is running on port 8000.

### Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

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

## 🎨 Design System

### Color Palette
- **Primary**: #3b82f6 (Blue)
- **Secondary**: #667eea (Purple)
- **Success**: #10b981 (Green)
- **Danger**: #ef4444 (Red)
- **Background**: #f9fafb (Light Gray)

### Typography
- Font Family: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- Base Size: 16px
- Headings: Bold, various sizes

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔐 Security Features

- CSRF protection enabled
- Secure token-based authentication
- Protected routes for authenticated actions
- Input validation on forms
- Error handling and user feedback

##  Troubleshooting

### Backend Connection Issues
If you see network errors, ensure:
1. Django backend is running (`python manage.py runserver`)
2. CORS is properly configured in Django settings
3. API_BASE_URL in `src/services/api.js` matches your backend URL

### Build Errors
Try:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 Environment Variables

Create a `.env` file in the frontend root if needed:
```
VITE_API_URL=http://localhost:8000/api
```

## 🤝 Contributing

This is a project presentation. Follow the existing code style and component structure.

## 📄 License

This project is for educational/demo purposes.

## 🙏 Acknowledgments

Built with:
- React (https://react.dev/)
- Vite (https://vitejs.dev/)
- React Router (https://reactrouter.com/)
- Axios (https://axios-http.com/)

---

**Happy Coding! 🚀**
