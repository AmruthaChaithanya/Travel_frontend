import { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: 'Male',
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const [userData, profileData] = await Promise.all([
        authService.getUserDetails(),
        authService.getProfile(),
      ]);
      
      setUser(userData);
      setProfile(profileData);
      
      if (profileData) {
        setFormData({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          email: userData.email || '',
          phone: profileData.phone || '',
          date_of_birth: profileData.date_of_birth || '',
          gender: profileData.gender || 'Male',
        });
      } else {
        setFormData({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          email: userData.email || '',
          phone: '',
          date_of_birth: '',
          gender: 'Male',
        });
      }
    } catch (err) {
      setError('Failed to fetch user data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await authService.updateProfile(formData);
      setSuccessMessage('Profile updated successfully!');
      setEditMode(false);
      fetchUserData();
    } catch (err) {
      setError('Failed to update profile.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return <div className="loading-container">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <h1>My Profile</h1>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar">
            {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
          </div>
          <div className="user-info">
            <h2>{user?.first_name} {user?.last_name}</h2>
            <p>{user?.email}</p>
            <p className="username">@{user?.username}</p>
          </div>
        </div>

        <div className="profile-body">
          {!editMode ? (
            <>
              <button onClick={() => setEditMode(true)} className="edit-btn">
                Edit Profile
              </button>

              <div className="info-section">
                <h3>Personal Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">First Name:</span>
                    <span className="value">{user?.first_name}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Last Name:</span>
                    <span className="value">{user?.last_name}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Email:</span>
                    <span className="value">{user?.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Username:</span>
                    <span className="value">{user?.username}</span>
                  </div>
                  {profile?.phone && (
                    <div className="info-item">
                      <span className="label">Phone:</span>
                      <span className="value">{profile.phone}</span>
                    </div>
                  )}
                  {profile?.date_of_birth && (
                    <div className="info-item">
                      <span className="label">Date of Birth:</span>
                      <span className="value">
                        {new Date(profile.date_of_birth).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {profile?.gender && (
                    <div className="info-item">
                      <span className="label">Gender:</span>
                      <span className="value">{profile.gender}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <button 
                type="button" 
                onClick={() => {
                  setEditMode(false);
                  fetchUserData();
                }} 
                className="cancel-edit-btn"
              >
                Cancel
              </button>

              <div className="form-section">
                <h3>Personal Information</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      pattern="[0-9]{10}"
                    />
                  </div>

                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
