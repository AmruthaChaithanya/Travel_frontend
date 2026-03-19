// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { authService } from '../../services/authService';
// import './Auth.css';

// const Register = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     first_name: '',
//     last_name: '',
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     if (formData.password.length < 8) {
//       setError('Password must be at least 8 characters long');
//       return;
//     }

//     setLoading(true);

//     try {
//       const { confirmPassword, ...registerData } = formData;
//       await authService.register(registerData);
//       navigate('/login');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Registration failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <h2>Create Account</h2>
        
//         {error && <div className="error-message">{error}</div>}
        
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="first_name">First Name</label>
//             <input
//               type="text"
//               id="first_name"
//               name="first_name"
//               value={formData.first_name}
//               onChange={handleChange}
//               required
//               placeholder="Enter your first name"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="last_name">Last Name</label>
//             <input
//               type="text"
//               id="last_name"
//               name="last_name"
//               value={formData.last_name}
//               onChange={handleChange}
//               required
//               placeholder="Enter your last name"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="username">Username</label>
//             <input
//               type="text"
//               id="username"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               required
//               placeholder="Choose a username"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="email">Email</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               placeholder="Enter your email"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               placeholder="Create a password"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="confirmPassword">Confirm Password</label>
//             <input
//               type="password"
//               id="confirmPassword"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               required
//               placeholder="Confirm your password"
//             />
//           </div>

//           <button type="submit" className="btn-submit" disabled={loading}>
//             {loading ? 'Creating account...' : 'Sign Up'}
//           </button>
//         </form>

//         <p className="auth-link">
//           Already have an account? <Link to="/login">Login</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      // ✅ CORRECT FORMAT FOR BACKEND
      const registerData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password_confirm: formData.confirmPassword, // 🔥 IMPORTANT FIX
        phone: "" // optional
      };

      await authService.register(registerData);

      navigate('/login');

    } catch (err) {
      console.log(err.response?.data); // 🔍 DEBUG

      setError(
        err.response?.data?.password_confirm ||
        err.response?.data?.non_field_errors ||
        err.response?.data?.email ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>

        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  );
};

export default Register;