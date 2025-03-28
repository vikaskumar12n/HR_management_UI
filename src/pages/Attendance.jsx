import { useState, useEffect } from "react";
import Table from "../components/Table";
import Modal from "../components/Modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const Attendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [markAttendanceModal, setMarkAttendanceModal] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);
  const nav = useNavigate();

  const [newAttendance, setNewAttendance] = useState({
    employeeId: "",
    date: "",
    status: "Present",
    checkIn: "",
    checkOut: "",
  });

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetchAttendance();
    fetchEmployees();
  }, []);

  // Fetch all attendance records
  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://hr-management-ln65.onrender.com/api/attendance/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAttendanceRecords(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      handleApiError(err);
      setAttendanceRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch employees for dropdown
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        "https://hr-management-ln65.onrender.com/api/employees/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEmployees(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      handleApiError(err);
    }
  };

  // Handle API errors
  const handleApiError = (err) => {
    if (err?.response?.status === 401) {
      Swal.fire({
        icon: "error",
        title: "Unauthorized",
        text: err.response.data.message || "Please login again",
      });
      nav("/");
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  // Mark Attendance (Create)
  const handleMarkAttendance = async () => {
    if (!newAttendance.employeeId || !newAttendance.date) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please select an employee and date",
      });
      return;
    }

    setApiLoading(true);
    try {
      const result = await Swal.fire({
        title: "Confirm Attendance",
        text: "Are you sure you want to mark this attendance?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, mark it!",
      });

      if (result.isConfirmed) {
        const res = await axios.post(
          "https://hr-management-ln65.onrender.com/api/attendance/",
          newAttendance,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: res.data.message,
        });

        fetchAttendance();
        setMarkAttendanceModal(false);
        setNewAttendance({
          employeeId: "",
          date: "",
          status: "Present",
          checkIn: "",
          checkOut: "",
        });
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setApiLoading(false);
    }
  };

  // Delete Attendance
  const handleDeleteAttendance = async (_id) => {
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
        const res = await axios.delete(
          `https://hr-management-ln65.onrender.com/api/attendance/${_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await Swal.fire("Deleted!", res.data.message, "success");
        fetchAttendance();
      } catch (err) {
        handleApiError(err);
      } finally {
        setApiLoading(false);
      }
    }
  };

  // Open Edit Modal
  const openEditModal = (record) => {
    setEditingAttendance(record);
    setEditModal(true);
  };

  // Handle Attendance Update
  const handleUpdateAttendance = async () => {
    setApiLoading(true);
    try {
      const result = await Swal.fire({
        title: "Update Attendance",
        text: "Are you sure you want to update this record?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!",
      });

      if (result.isConfirmed) {
        const res = await axios.put(
          `https://hr-management-ln65.onrender.com/api/attendance/${editingAttendance._id}`,
          editingAttendance,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await Swal.fire({
          icon: "success",
          title: "Updated!",
          text: res.data.message,
        });

        fetchAttendance();
        setEditModal(false);
        setEditingAttendance(null);
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <div>
      <div className="container mt-4">
        <h2>Attendance Management</h2>

        {/* Button to Open Mark Attendance Modal */}
        <button
          className="btn btn-primary mb-3"
          onClick={() => setMarkAttendanceModal(true)}
          disabled={loading || apiLoading}
        >
          {apiLoading ? (
            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
          ) : null}
          Mark Attendance
        </button>

        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading attendance records...</p>
          </div>
        ) : (
          <Table
            headers={["Employee", "Date", "Status", "Check-In", "Check-Out", "Actions"]}
            data={
              Array.isArray(attendanceRecords)
                ? attendanceRecords.map((record) => ({
                    Employee: record.employee?.name || "N/A",
                    Date: new Date(record.date).toLocaleDateString(),
                    Status: record.status,
                    "Check-In": record.checkIn || "N/A",
                    "Check-Out": record.checkOut || "N/A",
                    Actions: (
                      <div>
                        <button
                          className="btn btn-warning btn-sm mx-1"
                          onClick={() => openEditModal(record)}
                          disabled={apiLoading}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm mx-1"
                          onClick={() => handleDeleteAttendance(record._id)}
                          disabled={apiLoading}
                        >
                          {apiLoading ? (
                            <span className="spinner-border spinner-border-sm" role="status"></span>
                          ) : (
                            "Delete"
                          )}
                        </button>
                      </div>
                    ),
                  }))
                : []
            }
          />
        )}
      </div>

      {/* Mark Attendance Modal */}
      {markAttendanceModal && (
        <Modal
          title="Mark Attendance"
          onClose={() => !apiLoading && setMarkAttendanceModal(false)}
        >
          <select
            className="form-control my-2"
            value={newAttendance.employeeId}
            onChange={(e) =>
              setNewAttendance({ ...newAttendance, employeeId: e.target.value })
            }
            disabled={apiLoading}
            required
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="form-control my-2"
            value={newAttendance.date}
            onChange={(e) =>
              setNewAttendance({ ...newAttendance, date: e.target.value })
            }
            disabled={apiLoading}
            required
          />

          <select
            className="form-control my-2"
            value={newAttendance.status}
            onChange={(e) =>
              setNewAttendance({ ...newAttendance, status: e.target.value })
            }
            disabled={apiLoading}
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Leave">Leave</option>
          </select>

          <input
            type="time"
            className="form-control my-2"
            placeholder="Check-In"
            value={newAttendance.checkIn}
            onChange={(e) =>
              setNewAttendance({ ...newAttendance, checkIn: e.target.value })
            }
            disabled={apiLoading}
          />

          <input
            type="time"
            className="form-control my-2"
            placeholder="Check-Out"
            value={newAttendance.checkOut}
            onChange={(e) =>
              setNewAttendance({ ...newAttendance, checkOut: e.target.value })
            }
            disabled={apiLoading}
          />

          <button
            className="btn btn-success"
            onClick={handleMarkAttendance}
            disabled={apiLoading}
          >
            {apiLoading ? (
              <span className="spinner-border spinner-border-sm me-1" role="status"></span>
            ) : null}
            Save Attendance
          </button>
        </Modal>
      )}

      {/* Edit Attendance Modal */}
      {editModal && (
        <Modal
          title="Edit Attendance"
          onClose={() => !apiLoading && setEditModal(false)}
        >
          <input
            type="date"
            className="form-control my-2"
            value={editingAttendance?.date || ""}
            onChange={(e) =>
              setEditingAttendance({
                ...editingAttendance,
                date: e.target.value,
              })
            }
            disabled={apiLoading}
          />

          <select
            className="form-control my-2"
            value={editingAttendance?.status || "Present"}
            onChange={(e) =>
              setEditingAttendance({
                ...editingAttendance,
                status: e.target.value,
              })
            }
            disabled={apiLoading}
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Leave">Leave</option>
          </select>

          <input
            type="time"
            className="form-control my-2"
            placeholder="Check-In"
            value={editingAttendance?.checkIn || ""}
            onChange={(e) =>
              setEditingAttendance({
                ...editingAttendance,
                checkIn: e.target.value,
              })
            }
            disabled={apiLoading}
          />

          <input
            type="time"
            className="form-control my-2"
            placeholder="Check-Out"
            value={editingAttendance?.checkOut || ""}
            onChange={(e) =>
              setEditingAttendance({
                ...editingAttendance,
                checkOut: e.target.value,
              })
            }
            disabled={apiLoading}
          />

          <button
            className="btn btn-success"
            onClick={handleUpdateAttendance}
            disabled={apiLoading}
          >
            {apiLoading ? (
              <span className="spinner-border spinner-border-sm me-1" role="status"></span>
            ) : null}
            Update Attendance
          </button>
        </Modal>
      )}
    </div>
  );
};

export default Attendance;