import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "employee", // Default role
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (userData.password !== userData.confirmPassword) {
      setError("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("https://hr-management-ln65.onrender.com/api/auth/register/", {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
      });

      if (response?.status === 201) {
        alert("Registration Successful! Please Login.");
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card border-0 shadow-lg overflow-hidden">
              {/* Card Header with Gradient Background */}
              <div 
                className="card-header p-4"
                style={{
                  background: "linear-gradient(to right, #6a11cb 0%, #2575fc 100%)"
                }}
              >
                <h2 className="text-white text-center mb-0 fw-bold">Create Account</h2>
                <p className="text-white-50 text-center mb-0">Join our platform today</p>
              </div>
              
              {/* Card Body */}
              <div className="card-body p-4 p-md-5">
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setError("")}
                    ></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label htmlFor="name" className="form-label fw-semibold">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="form-control py-2"
                        value={userData.name}
                        onChange={handleChange}
                        required
                        autoFocus
                      />
                    </div>

                    <div className="col-md-12 mb-3">
                      <label htmlFor="email" className="form-label fw-semibold">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="form-control py-2"
                        value={userData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="password" className="form-label fw-semibold">Password</label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        className="form-control py-2"
                        value={userData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="confirmPassword" className="form-label fw-semibold">Confirm Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        className="form-control py-2"
                        value={userData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-12 mb-4">
                      <label htmlFor="role" className="form-label fw-semibold">Role</label>
                      <select
                        name="role"
                        id="role"
                        className="form-select py-2"
                        value={userData.role}
                        onChange={handleChange}
                      >
                        <option value="employee">Employee</option>
                        <option value="hr">HR Manager</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                  </div>

                  <div className="d-grid mb-3">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg py-2 fw-bold"
                      disabled={isLoading}
                      style={{
                        background: "linear-gradient(to right, #6a11cb 0%, #2575fc 100%)",
                        border: "none"
                      }}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Registering...
                        </>
                      ) : "Register Now"}
                    </button>
                  </div>
                </form>

                <div className="text-center pt-3">
                  <p className="text-muted mb-0">Already have an account? 
                    <a href="/" className="text-primary fw-semibold text-decoration-none ms-1">
                      Login here
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;