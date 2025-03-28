import { useState } from "react";
import Employees from "./Employees";
import Candidates from "./Candidates";
import Attendance from "./Attendance";
import Leaves from "./Leaves";
import Navbar from "../components/Navbar"

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState("employees");

  const renderComponent = () => {
    switch (activeComponent) {
      case "employees":
        return <Employees />;
      case "candidates":
        return <Candidates />;
      case "attendance":
        return <Attendance />;
      case "leaves":
        return <Leaves />;
      default:
        return <Employees />;
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
    <Navbar/>
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <div className="bg-dark text-white p-3" style={{ width: "250px" }}>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <button
                className={`nav-link btn btn-link text-white text-start w-100 ${activeComponent === "employees" ? "active bg-primary" : ""}`}
                onClick={() => setActiveComponent("employees")}
              >
                <i className="bi bi-people-fill me-2"></i>Employees
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className={`nav-link btn btn-link text-white text-start w-100 ${activeComponent === "candidates" ? "active bg-primary" : ""}`}
                onClick={() => setActiveComponent("candidates")}
              >
                <i className="bi bi-person-badge-fill me-2"></i>Candidates
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className={`nav-link btn btn-link text-white text-start w-100 ${activeComponent === "attendance" ? "active bg-primary" : ""}`}
                onClick={() => setActiveComponent("attendance")}
              >
                <i className="bi bi-calendar-check-fill me-2"></i>Attendance
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className={`nav-link btn btn-link text-white text-start w-100 ${activeComponent === "leaves" ? "active bg-primary" : ""}`}
                onClick={() => setActiveComponent("leaves")}
              >
                <i className="bi bi-door-open-fill me-2"></i>Leave Management
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-grow-1 p-4">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;