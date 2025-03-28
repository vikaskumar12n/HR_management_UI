import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import Modal from "../components/Modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const LeaveManagement = () => {
  const nav = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingLeave, setEditingLeave] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [leaveData, setLeaveData] = useState({
    employeeId: "",
    startDate: "",
    endDate: "",
    reason: "",
    status: "Pending",
  });

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetchLeaves();
    fetchEmployees();
  }, []);

  // Fetch Leaves
  const fetchLeaves = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/leaves/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaves(res.data || []);
    } catch (error) {
      if (error?.response?.status === 401) {
        alert(error.response.data.message);
        nav("/login");
      } else {
        console.error("Error fetching leaves:", error);
        alert("Failed to fetch leaves");
      }
    }
  };

  // Fetch Employees
  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employees/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(res.data || []);
    } catch (error) {
      if (error?.response?.status === 401) {
        alert(error.response.data.message);
        nav("/login");
      } else {
        console.error("Error fetching employees:", error);
        alert("Failed to fetch employees");
      }
    }
  };

  // Save Leave (Add or Update)
  const handleSave = async () => {
    // Validation before sending request
    if (!leaveData.employeeId || !leaveData.reason || !leaveData.startDate || !leaveData.endDate) {
      alert("All fields are required!");
      return;
    }

    setIsLoading(true);
    try {
      if (editingLeave) {
        const res = await axios.put(
          `http://localhost:5000/api/leaves/${editingLeave._id}`,
          leaveData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(res.data.message);
      } else {
        const res = await axios.post(
          "http://localhost:5000/api/leaves/",
          leaveData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(res.data.message);
      }

      await fetchLeaves();
      setShowModal(false);
      setEditingLeave(null);
      setLeaveData({ employeeId: "", startDate: "", endDate: "", reason: "", status: "Pending" });
    } catch (error) {
      if (error?.response?.status === 401) {
        alert(error.response.data.message);
        nav("/login");
      } else {
        console.error("Error saving leave:", error);
        alert("Failed to save leave");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Leave
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this leave request?")) {
      try {
        const res = await axios.delete(`https://hr-management-ln65.onrender.com/api/leaves/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert(res.data.message);
        fetchLeaves();
      } catch (error) {
        if (error?.response?.status === 401) {
          alert(error.response.data.message);
          nav("/login");
        } else {
          console.error("Error deleting leave:", error);
          alert("Failed to delete leave");
        }
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2>Leave Management</h2>

        <button
          className="btn btn-primary my-3"
          onClick={() => {
            setEditingLeave(null);
            setLeaveData({ employeeId: "", startDate: "", endDate: "", reason: "", status: "Pending" });
            setShowModal(true);
          }}
        >
          Apply for Leave
        </button>

        <Table
          headers={["Employee", "Start Date", "End Date", "Reason", "Status", "Actions"]}
          data={leaves.map((leave) => ({
            Employee: leave.employee?.name || "N/A",
            "Start Date": new Date(leave.startDate).toLocaleDateString(),
            "End Date": new Date(leave.endDate).toLocaleDateString(),
            Reason: leave.reason,
            Status: (
              <span className={`badge ${
                leave.status === "Approved" ? "bg-success" :
                leave.status === "Rejected" ? "bg-danger" : "bg-warning"
              }`}>
                {leave.status}
              </span>
            ),
            Actions: (
              <div>
                <button
                  className="btn btn-warning btn-sm mx-1"
                  onClick={() => {
                    setEditingLeave(leave);
                    setLeaveData({
                      employeeId: leave.employee._id,
                      startDate: leave.startDate.split('T')[0],
                      endDate: leave.endDate.split('T')[0],
                      reason: leave.reason,
                      status: leave.status,
                    });
                    setShowModal(true);
                  }}
                >
                  Edit
                </button>
                <button className="btn btn-danger btn-sm mx-1" onClick={() => handleDelete(leave._id)}>
                  Delete
                </button>
              </div>
            ),
          }))}
        />
      </div>

      {/* Modal for Adding/Editing Leave */}
      {showModal && (
        <Modal 
          title={editingLeave ? "Edit Leave Request" : "Apply for Leave"} 
          onClose={() => {
            setShowModal(false);
            setEditingLeave(null);
          }}
        >
          <div className="mb-3">
            <label className="form-label">Employee</label>
            <select
              className="form-select"
              value={leaveData.employeeId}
              onChange={(e) => setLeaveData({ ...leaveData, employeeId: e.target.value })}
              disabled={!!editingLeave}
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              value={leaveData.startDate}
              onChange={(e) => setLeaveData({ ...leaveData, startDate: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-control"
              value={leaveData.endDate}
              onChange={(e) => setLeaveData({ ...leaveData, endDate: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Reason</label>
            <textarea
              className="form-control"
              placeholder="Reason for leave"
              value={leaveData.reason}
              onChange={(e) => setLeaveData({ ...leaveData, reason: e.target.value })}
              rows="3"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={leaveData.status}
              onChange={(e) => setLeaveData({ ...leaveData, status: e.target.value })}
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="d-flex justify-content-end">
            <button 
              className="btn btn-secondary me-2" 
              onClick={() => {
                setShowModal(false);
                setEditingLeave(null);
              }}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default LeaveManagement;