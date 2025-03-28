import { useState, useEffect } from "react";
import Table from "../components/Table";
import Modal from "../components/Modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const LeaveManagement = () => {
  const nav = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingLeave, setEditingLeave] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
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

  // Handle API errors
  const handleApiError = (error) => {
    if (error?.response?.status === 401) {
      Swal.fire({
        icon: "error",
        title: "Unauthorized",
        text: error.response.data.message || "Please login again",
      });
      nav("/login");
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  // Fetch Leaves
  const fetchLeaves = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("https://hr-management-ln65.onrender.com/api/leaves/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaves(res.data || []);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Employees
  const fetchEmployees = async () => {
    try {
      const res = await axios.get("https://hr-management-ln65.onrender.com/api/employees/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(res.data || []);
    } catch (error) {
      handleApiError(error);
    }
  };

  // Save Leave (Add or Update)
  const handleSave = async () => {
    // Validation before sending request
    if (!leaveData.employeeId || !leaveData.reason || !leaveData.startDate || !leaveData.endDate) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "All fields are required!",
      });
      return;
    }

    setApiLoading(true);
    try {
      const result = await Swal.fire({
        title: editingLeave ? "Update Leave" : "Apply for Leave",
        text: `Are you sure you want to ${editingLeave ? 'update' : 'submit'} this leave request?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, proceed!",
      });

      if (result.isConfirmed) {
        let res;
        if (editingLeave) {
          res = await axios.put(
            `https://hr-management-ln65.onrender.com/api/leaves/${editingLeave._id}`,
            leaveData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          res = await axios.post(
            "https://hr-management-ln65.onrender.com/api/leaves/",
            leaveData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }

        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: res.data.message,
        });

        await fetchLeaves();
        setShowModal(false);
        setEditingLeave(null);
        setLeaveData({ employeeId: "", startDate: "", endDate: "", reason: "", status: "Pending" });
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setApiLoading(false);
    }
  };

  // Delete Leave
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      setApiLoading(true);
      try {
        const res = await axios.delete(`https://hr-management-ln65.onrender.com/api/leaves/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        await Swal.fire(
          "Deleted!",
          res.data.message,
          "success"
        );
        
        await fetchLeaves();
      } catch (error) {
        handleApiError(error);
      } finally {
        setApiLoading(false);
      }
    }
  };

  return (
    <div>
      <div className="container mt-4">
        <h2>Leave Management</h2>

        <button
          className="btn btn-primary my-3"
          onClick={() => {
            setEditingLeave(null);
            setLeaveData({ employeeId: "", startDate: "", endDate: "", reason: "", status: "Pending" });
            setShowModal(true);
          }}
          disabled={isLoading || apiLoading}
        >
          {apiLoading ? (
            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
          ) : null}
          Apply for Leave
        </button>

        {isLoading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading leave requests...</p>
          </div>
        ) : (
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
                    disabled={apiLoading}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-danger btn-sm mx-1" 
                    onClick={() => handleDelete(leave._id)}
                    disabled={apiLoading}
                  >
                    {apiLoading ? (
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                    ) : "Delete"}
                  </button>
                </div>
              ),
            }))}
          />
        )}
      </div>

      {/* Modal for Adding/Editing Leave */}
      {showModal && (
        <Modal 
          title={editingLeave ? "Edit Leave Request" : "Apply for Leave"} 
          onClose={() => !apiLoading && setShowModal(false)}
        >
          <div className="mb-3">
            <label className="form-label">Employee</label>
            <select
              className="form-select"
              value={leaveData.employeeId}
              onChange={(e) => setLeaveData({ ...leaveData, employeeId: e.target.value })}
              disabled={!!editingLeave || apiLoading}
              required
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
              disabled={apiLoading}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-control"
              value={leaveData.endDate}
              onChange={(e) => setLeaveData({ ...leaveData, endDate: e.target.value })}
              disabled={apiLoading}
              required
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
              disabled={apiLoading}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={leaveData.status}
              onChange={(e) => setLeaveData({ ...leaveData, status: e.target.value })}
              disabled={apiLoading}
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
              disabled={apiLoading}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleSave}
              disabled={apiLoading}
            >
              {apiLoading ? (
                <span className="spinner-border spinner-border-sm me-1" role="status"></span>
              ) : null}
              {editingLeave ? 'Update' : 'Submit'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default LeaveManagement;