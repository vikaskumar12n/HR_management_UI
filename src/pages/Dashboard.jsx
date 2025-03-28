import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2>HRMS Dashboard</h2>
        <div className="row">
          <div className="col-md-4">
            <div className="card text-white bg-primary mb-3">
              <div className="card-body">
                <h5 className="card-title">Employees</h5>
                <p className="card-text">Manage employees in your company.</p>
                <Link to="/employees" className="btn btn-light">View Employees</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-white bg-success mb-3">
              <div className="card-body">
                <h5 className="card-title">Candidates</h5>
                <p className="card-text">Manage job applicants.</p>
                <Link to="/candidates" className="btn btn-light">View Candidates</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-white bg-warning mb-3">
              <div className="card-body">
                <h5 className="card-title">Attendance</h5>
                <p className="card-text">Track employee attendance.</p>
                <Link to="/attendance" className="btn btn-light">View Attendance</Link>
              </div>
            </div>
          </div>

         

          {/* Leave Management Button */}
          <div className="col-md-4">
            <div className="card text-white bg-danger mb-3">
              <div className="card-body">
                <h5 className="card-title">Leave Management</h5>
                <p className="card-text">Manage employee leave requests.</p>
                <Link to="/leaves" className="btn btn-light">Manage Leaves</Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
