import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const res = await axios.post("https://hr-management-ln65.onrender.com/api/auth/login", { 
        email, 
        password 
      });

      if (res.status === 401 || res?.data?.code === 401) {
        setError("Invalid credentials");
        return;
      }

      dispatch(loginSuccess({ 
        user: res.data.user, 
        token: res.data.token 
      }));
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
      console.error("Login error:", error);
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
          <div className="col-md-6 col-lg-5">
            <div className="card border-0 shadow-lg overflow-hidden">
              {/* Card Header with Gradient Background */}
              <div 
                className="card-header p-4"
                style={{
                  background: "linear-gradient(to right, #6a11cb 0%, #2575fc 100%)"
                }}
              >
                <h2 className="text-white text-center mb-0 fw-bold">Welcome Back</h2>
                <p className="text-white-50 text-center mb-0">Please login to continue</p>
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

                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">Email address</label>
                    <input 
                      type="email" 
                      className="form-control py-2" 
                      id="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold">Password</label>
                    <input 
                      type="password" 
                      className="form-control py-2" 
                      id="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
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
                          Logging in...
                        </>
                      ) : "Login"}
                    </button>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="rememberMe" />
                      <label className="form-check-label small" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                    <a href="/forgot-password" className="text-decoration-none small text-primary">
                      Forgot password?
                    </a>
                  </div>
                </form>

                <div className="text-center pt-3">
                  <p className="text-muted mb-0">Don&apos;t have an account? 
                    <a href="/register" className="text-primary fw-semibold text-decoration-none ms-1">
                      Register
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

export default Login;