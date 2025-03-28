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
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <div className="card-body">
          <div className="text-center mb-4">
            <h2 className="fw-bold">Login</h2>
            <p className="text-muted">Please enter your credentials</p>
          </div>

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
              <label htmlFor="email" className="form-label">Email address</label>
              <input 
                type="email" 
                className="form-control" 
                id="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">Password</label>
              <input 
                type="password" 
                className="form-control" 
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
                className="btn btn-primary btn-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Logging in...
                  </>
                ) : "Login"}
              </button>
            </div>

            <div className="text-center">
              <a href="/forgot-password" className="text-decoration-none">Forgot password?</a>
            </div>
          </form>
          <p className="text-center mt-3">
              Don&apos;t have an account? <a href="/">Register</a>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;