import React, { useState, useEffect } from "react";
import AdminHeader from '../Component/AdminHeader.jsx';
import "./ManageAccount.css";

function ManageAccount() {
  const [accounts, setAccounts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // New account form state
  const [newAccount, setNewAccount] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [apiErrors, setApiErrors] = useState({});

  // Get the JWT token from localStorage
  const getToken = () => {
    return localStorage.getItem('token'); // Make sure this key matches what you set in login
  };
  
  // Fetch current user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
        setLoading(true);
        try {
          const token = getToken();
          if (!token) {
            setError("Not authenticated");
            localStorage.removeItem('token'); // Clear invalid token
            // Redirect to login page
            window.location.href = '/login';
            return;
          }
          
          const response = await fetch('http://localhost:3000/current-user', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            setError("Session expired. Please login again.");
            // Redirect to login page
            window.location.href = '/login';
            return;
          }
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to load user data');
          }
          
          const data = await response.json();
          if (data.user) {
            setAccounts([{
              id: data.user._id,
              username: data.user.username,
              email: data.user.email || 'No email provided'
            }]);
          } else {
            throw new Error('User data format is incorrect');
          }
        } catch (err) {
          console.error('Fetch user error:', err);
          setError("Failed to load user data: " + (err.message || 'Unknown error'));
        } finally {
          setLoading(false);
        }
      };
  
    fetchUserData();
  }, []);

  // Handle opening the edit modal
  const handleEditClick = (account) => {
    setSelectedAccount(account);
    setNewPassword("");
    setShowEditModal(true);
  };

  // Handle opening the delete modal
  const handleDeleteClick = (account) => {
    setSelectedAccount(account);
    setShowDeleteModal(true);
  };

  // Handle opening the create account modal
  const handleCreateClick = () => {
    setNewAccount({
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
    setFormErrors({});
    setApiErrors({});
    setShowCreateModal(true);
  };

  // Close all modals
  const closeModals = () => {
    setShowDeleteModal(false);
    setShowEditModal(false);
    setShowCreateModal(false);
    setSelectedAccount(null);
    setApiErrors({});
  };

  // Handle password save - connect to reset-password API
  const handlePasswordSave = async () => {
    if (!newPassword.trim()) return;
    
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        setError("Not authenticated");
        return;
      }
      
      const response = await fetch('http://localhost:3000/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          password: newPassword
          // Don't include token in body, it's already in the Authorization header
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update password');
      }
      
      // Success
      alert('Password updated successfully');
      closeModals();
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle account deletion - connect to delete-account API
  const handleAccountDelete = async () => {
    setLoading(true);
    try {
      const token = getToken();
      
      const response = await fetch('http://localhost:3000/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete account');
      }
      
      // Success - handle logout
      localStorage.removeItem('token');
      alert('Account deleted successfully');
      // Redirect to login page
      window.location.href = '/login'; 
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle new account form changes
  const handleNewAccountChange = (e) => {
    const { name, value } = e.target;
    setNewAccount({
      ...newAccount,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
    
    // Clear API error for this field when user types
    if (apiErrors[name]) {
      setApiErrors({
        ...apiErrors,
        [name]: null
      });
    }
  };

  // Validate the new account form
  const validateForm = () => {
    const errors = {};
    
    if (!newAccount.username.trim()) {
      errors.username = "Username is required";
    }
    
    if (!newAccount.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(newAccount.email)) {
      errors.email = "Email is invalid";
    }
    
    if (!newAccount.password) {
      errors.password = "Password is required";
    }
    // else if (newAccount.password.length < 6) {
    //   errors.password = "Password must be at least 6 characters";
    // }
    
    if (newAccount.password !== newAccount.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Updated handleCreateAccount function with better error handling
  const handleCreateAccount = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setApiErrors({});
    
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: newAccount.username,
          email: newAccount.email,
          password: newAccount.password
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Handle specific API errors and map them to form fields
        if (data.error) {
          if (data.error.includes("Username already exists")) {
            setApiErrors({ username: "Username already exists" });
          } else if (data.error.includes("Email already exists")) {
            setApiErrors({ email: "Email already exists" });
          } else {
            // General error
            setError(data.error || 'Failed to create account');
          }
          return;
        }
        
        throw new Error(data.error || 'Failed to create account');
      }
      
      // Success
      alert('Account created successfully');
      closeModals();
      
      // Refresh the accounts list or redirect to login based on your app flow
      window.location.reload();
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-accounts">
      <AdminHeader />
      <div className="content-container">
        <div className="page-header">
          <h1>Account Management</h1>
          <p>Create, update, and manage your account.</p>
        </div>
      </div>
      
      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
      
      <div className="admin-content-accounts">
        <div className="dashboard-panel-accounts">
          <div className="panel-header-accounts">
            <div className="header-content-accounts">
              <h2 className="panel-title-accounts">Manage Your Account</h2>
              <button 
                className="btn-accounts btn-create-accounts" 
                onClick={handleCreateClick}
                disabled={loading}
              >
                Create Account
              </button>
            </div>
          </div>

          <div className="data-table-container-accounts">
            {loading ? (
              <div className="loading">Loading...</div>
            ) : (
              <table className="data-table-accounts">
                <thead className="table-head-accounts">
                  <tr className="table-row-accounts">
                    <th className="table-header-accounts">Username</th>
                    <th className="table-header-accounts">Email</th>
                    <th className="table-header-accounts">Actions</th>
                  </tr>
                </thead>
                <tbody className="table-body-accounts">
                  {accounts.map((account) => (
                    <tr key={account.id} className="table-row-accounts">
                      <td className="table-cell-accounts">{account.username}</td>
                      <td className="table-cell-accounts">{account.email}</td>
                      <td className="table-cell-accounts">
                        <div className="action-buttons-accounts">
                          <button 
                            className="btn-accounts btn-edit-accounts" 
                            onClick={() => handleEditClick(account)}
                            disabled={loading}
                          >
                            Edit Password
                          </button>
                          <button 
                            className="btn-accounts btn-delete-accounts" 
                            onClick={() => handleDeleteClick(account)}
                            disabled={loading}
                          >
                            Delete Account
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      
      {/* Edit Password Modal */}
      {showEditModal && (
        <div className="modal-overlay-accounts">
          <div className="modal-container-accounts">
            <div className="modal-header-accounts">
              <h3 className="modal-title-accounts">Edit Password</h3>
              <button className="close-btn-accounts" onClick={closeModals}>×</button>
            </div>
            <div className="modal-body-accounts">
              <p className="modal-text-accounts">Changing password for user: <strong>{selectedAccount.username}</strong></p>
              <div className="form-group-accounts">
                <label className="form-label-accounts" htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="form-input-accounts"
                />
              </div>
            </div>
            <div className="modal-footer-accounts">
              <button className="btn-accounts btn-cancel-accounts" onClick={closeModals} disabled={loading}>Cancel</button>
              <button 
                className="btn-accounts btn-primary-accounts" 
                onClick={handlePasswordSave}
                disabled={!newPassword.trim() || loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="modal-overlay-accounts">
          <div className="modal-container-accounts">
            <div className="modal-header-accounts warning-accounts">
              <h3 className="modal-title-accounts">Delete Account</h3>
              <button className="close-btn-accounts" onClick={closeModals}>×</button>
            </div>
            <div className="modal-body-accounts">
              <div className="warning-icon-accounts">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
              </div>
              <p className="modal-text-accounts warning-text-accounts">Are you sure you want to delete your account?</p>
              <p className="modal-subtext-accounts">This action cannot be undone. All your data will be permanently removed.</p>
            </div>
            <div className="modal-footer-accounts">
              <button className="btn-accounts btn-cancel-accounts" onClick={closeModals} disabled={loading}>Cancel</button>
              <button 
                className="btn-accounts btn-danger-accounts" 
                onClick={handleAccountDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Create Account Modal */}
      {showCreateModal && (
        <div className="modal-overlay-accounts">
          <div className="modal-container-accounts">
            <div className="modal-header-accounts">
              <h3 className="modal-title-accounts">Create Account</h3>
              <button className="close-btn-accounts" onClick={closeModals}>×</button>
            </div>
            <div className="modal-body-accounts">
              <div className="form-group-accounts">
                <label className="form-label-accounts" htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={newAccount.username}
                  onChange={handleNewAccountChange}
                  placeholder="Enter username"
                  className={`form-input-accounts ${formErrors.username || apiErrors.username ? 'input-error-accounts' : ''}`}
                />
                {formErrors.username && <div className="error-message-accounts">{formErrors.username}</div>}
                {apiErrors.username && <div className="error-message-accounts">{apiErrors.username}</div>}
              </div>
              
              <div className="form-group-accounts">
                <label className="form-label-accounts" htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newAccount.email}
                  onChange={handleNewAccountChange}
                  placeholder="Enter email address"
                  className={`form-input-accounts ${formErrors.email || apiErrors.email ? 'input-error-accounts' : ''}`}
                />
                {formErrors.email && <div className="error-message-accounts">{formErrors.email}</div>}
                {apiErrors.email && <div className="error-message-accounts">{apiErrors.email}</div>}
              </div>
              
              <div className="form-group-accounts">
                <label className="form-label-accounts" htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={newAccount.password}
                  onChange={handleNewAccountChange}
                  placeholder="Enter password"
                  className={`form-input-accounts ${formErrors.password || apiErrors.password ? 'input-error-accounts' : ''}`}
                />
                {formErrors.password && <div className="error-message-accounts">{formErrors.password}</div>}
                {apiErrors.password && <div className="error-message-accounts">{apiErrors.password}</div>}
              </div>
              
              <div className="form-group-accounts">
                <label className="form-label-accounts" htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={newAccount.confirmPassword}
                  onChange={handleNewAccountChange}
                  placeholder="Confirm your password"
                  className={`form-input-accounts ${formErrors.confirmPassword ? 'input-error-accounts' : ''}`}
                />
                {formErrors.confirmPassword && <div className="error-message-accounts">{formErrors.confirmPassword}</div>}
              </div>
            </div>
            <div className="modal-footer-accounts">
              <button className="btn-accounts btn-cancel-accounts" onClick={closeModals} disabled={loading}>Cancel</button>
              <button 
                className="btn-accounts btn-primary-accounts" 
                onClick={handleCreateAccount}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageAccount;