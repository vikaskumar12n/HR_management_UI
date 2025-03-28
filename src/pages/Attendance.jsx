import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import Modal from "../components/Modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


const Attendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [markAttendanceModal, setMarkAttendanceModal] = useState(false); // New modal for marking attendance
  const [editingAttendance, setEditingAttendance] = useState(null);
  const nav = useNavigate();

  const [newAttendance, setNewAttendance] = useState({
    employeeId: "",
    date: "",
    status: "Present",
    checkIn: "",
    checkOut: "",
  });

  useEffect(() => {
    fetchAttendance();
    fetchEmployees();
  }, []);
  const token = useSelector((state) => state.auth.token);
  
  // ** Fetch all attendance records **
  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`https://hr-management-ln65.onrender.com/api/attendance/`);
      setAttendanceRecords(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching attendance:", error.message);
      setAttendanceRecords([]);
    }
  };

  // ** Fetch employees for dropdown **
  const fetchEmployees = async () => {
    try {
      const res = await axios.get("https://hr-management-ln65.onrender.com/api/employees/");
      setEmployees(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching employees:", error.message);
    }
  };

  // ** Mark Attendance (Create) **
  const handleMarkAttendance = async () => {
    try {
      const res = await axios.post("https://hr-management-ln65.onrender.com/api/attendance/", newAttendance,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });   
        alert(res.data.message)
      fetchAttendance();
      setMarkAttendanceModal(false); // Close modal after saving
      setNewAttendance({ employeeId: "", date: "", status: "Present", checkIn: "", checkOut: "" });
    } catch (error) {
      console.error("Error marking attendance:", error.message);
    }
  };

  // ** Delete Attendance **
  const handleDeleteAttendance = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this attendance record?")) return;
    try {
      const  res= await axios.delete(`https://hr-management-ln65.onrender.com/api/attendance/${_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });   
      alert(res.data.message)
        fetchAttendance();
    } catch (error) {
      if (error?.response?.status === 401) {
       
        alert(error.response.data.message)
        nav("/login");
      }
     
    }
  };

  // ** Open Edit Modal **
  const openEditModal = (record) => {
    setEditingAttendance(record);
    setEditModal(true);
  };

  // ** Handle Attendance Update **
  const handleUpdateAttendance = async () => {
    try {
      const res = await axios.put(
        `https://hr-management-ln65.onrender.com/api/attendance/${editingAttendance._id}`,
        editingAttendance, // Data should be the second argument
        {
          headers: {
            Authorization: `Bearer ${token}`, //  Headers should be the third argument
          },
        }
      );
     
      
  
      alert(res.data.message);
      fetchAttendance();
      setEditModal(false);
      setEditingAttendance(null);
    } catch (error) {
      if (error?.response?.status === 401) {
        alert(error.response.data.message);
        nav("/login");
      } else {
        console.error("Error updating attendance:", error);
      }
    }
  };
  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2>Attendance Management</h2>

        {/* Button to Open Mark Attendance Modal */}
        <button className="btn btn-primary mb-3" onClick={() => setMarkAttendanceModal(true)}>
          Mark Attendance
        </button>

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
                      <button className="btn btn-warning btn-sm mx-1" onClick={() => openEditModal(record)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm mx-1" onClick={() => handleDeleteAttendance(record._id)}>
                        Delete
                      </button>
                    </div>
                  ),
                }))
              : []
          }
        />
      </div>

      {/* Mark Attendance Modal */}
      {markAttendanceModal && (
        <Modal title="Mark Attendance" onClose={() => setMarkAttendanceModal(false)}>
          <select
            className="form-control my-2"
            value={newAttendance.employeeId}
            onChange={(e) => setNewAttendance({ ...newAttendance, employeeId: e.target.value })}
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
            onChange={(e) => setNewAttendance({ ...newAttendance, date: e.target.value })}
          />

          <select
            className="form-control my-2"
            value={newAttendance.status}
            onChange={(e) => setNewAttendance({ ...newAttendance, status: e.target.value })}
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
            onChange={(e) => setNewAttendance({ ...newAttendance, checkIn: e.target.value })}
          />

          <input
            type="time"
            className="form-control my-2"
            placeholder="Check-Out"
            value={newAttendance.checkOut}
            onChange={(e) => setNewAttendance({ ...newAttendance, checkOut: e.target.value })}
          />

          <button className="btn btn-success" onClick={handleMarkAttendance}>
            Save Attendance
          </button>
        </Modal>
      )}

      {/* Edit Attendance Modal */}
      {editModal && (
        <Modal title="Edit Attendance" onClose={() => setEditModal(false)}>
          <input
            type="date"
            className="form-control my-2"
            value={editingAttendance?.date || ""}
            onChange={(e) => setEditingAttendance({ ...editingAttendance, date: e.target.value })}
          />

          <select
            className="form-control my-2"
            value={editingAttendance?.status || "Present"}
            onChange={(e) => setEditingAttendance({ ...editingAttendance, status: e.target.value })}
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
            onChange={(e) => setEditingAttendance({ ...editingAttendance, checkIn: e.target.value })}
          />

          <input
            type="time"
            className="form-control my-2"
            placeholder="Check-Out"
            value={editingAttendance?.checkOut || ""}
            onChange={(e) => setEditingAttendance({ ...editingAttendance, checkOut: e.target.value })}
          />

          <button className="btn btn-success" onClick={handleUpdateAttendance}>
            Update Attendance
          </button>
        </Modal>
      )}
    </div>
  );
};

export default Attendance;
