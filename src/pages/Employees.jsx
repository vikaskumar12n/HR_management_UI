import { useState, useEffect } from "react";
import Table from "../components/Table";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const Employees = () => {
  const nav = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    role: "",
  });

  // Define available departments and roles
  const departments = [
    "HR",
    "Finance",
    "IT",
    "Marketing",
    "Operations",
    "Sales",
    "Customer Support",
  ];

  const roles = [
    "Manager",
    "Developer",
    "Designer",
    "Accountant",
    "HR Specialist",
    "Sales Representative",
    "Marketing Specialist",
  ];

  useEffect(() => {
    fetchEmployees();
  }, []);
  
  const token = useSelector((state) => state.auth.token);

<<<<<<< HEAD
  //  Fetch Employees
=======
  // Fetch Employees
>>>>>>> 5e7d817 (Improved)
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://hr-management-ln65.onrender.com/api/employees/",
<<<<<<< HEAD
        { headers: {Authorization: `Bearer ${token}` } }

=======
        { headers: { Authorization: `Bearer ${token}` } }
>>>>>>> 5e7d817 (Improved)
      );
      setEmployees(res.data || []);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  //  Save Employee (Add or Update)
=======
  // Handle API errors
  const handleApiError = (error) => {
    if (error?.response?.status === 401) {
      Swal.fire({
        icon: 'error',
        title: 'Unauthorized',
        text: error.response.data.message || 'Please login again',
      });
      nav("/login");
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Something went wrong',
      });
    }
  };

  // Save Employee (Add or Update)
>>>>>>> 5e7d817 (Improved)
  const handleSave = async () => {
    setApiLoading(true);
    try {
      let result;
      if (editingEmployee) {
        result = await Swal.fire({
          title: 'Are you sure?',
          text: 'You are about to update this employee',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, update it!'
        });
        
        if (result.isConfirmed) {
          const res = await axios.put(
            `https://hr-management-ln65.onrender.com/api/employees/${editingEmployee._id}`,
            employeeData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          await Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: res.data.message,
          });
        }
      } else {
        result = await Swal.fire({
          title: 'Add Employee',
          text: 'Are you sure you want to add this employee?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, add it!'
        });
        
        if (result.isConfirmed) {
          await axios.post(
            "https://hr-management-ln65.onrender.com/api/employees/register",
            employeeData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          await Swal.fire({
            icon: 'success',
            title: 'Added!',
            text: 'Employee added successfully',
          });
        }
      }
      
      if (result.isConfirmed) {
        fetchEmployees();
        setShowModal(false);
        setEditingEmployee(null);
        setEmployeeData({ name: "", email: "", phone: "", department: "", role: "" });
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setApiLoading(false);
    }
  };

  // Delete Employee
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
    
    if (result.isConfirmed) {
      setApiLoading(true);
      try {
        const res = await axios.delete(
          `https://hr-management-ln65.onrender.com/api/employees/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        await Swal.fire(
          'Deleted!',
          res.data.message,
          'success'
        );
        fetchEmployees();
      } catch (error) {
        handleApiError(error);
      } finally {
        setApiLoading(false);
      }
    }
  };

  const filteredEmployees = employees?.filter((emp) =>
    emp?.name?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div>
      <div className="container mt-4">
        <h2>Employee Management</h2>
        <button
          className="btn btn-primary my-3"
          onClick={() => {
            setEditingEmployee(null);
            setEmployeeData({ name: "", email: "", phone: "", department: "", role: "" });
            setShowModal(true);
          }}
          disabled={apiLoading}
        >
          {apiLoading ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : (
            'Add Employee'
          )}
        </button>
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Employees..."
          disabled={loading}
        />
        
        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading employees...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table
              headers={["Name", "Email", "Phone", "Department", "Role", "Actions"]}
              data={filteredEmployees.map((emp) => ({
                Name: emp?.name || "N/A",
                Email: emp?.email || "N/A",
                Phone: emp?.phone || "N/A",
                Department: emp?.department || "N/A",
                Role: emp?.role || "N/A",
                Actions: (
                  <div>
                    <button
                      className="btn btn-warning btn-sm mx-1"
                      onClick={() => {
                        setEditingEmployee(emp);
                        setEmployeeData(emp);
                        setShowModal(true);
                      }}
                      disabled={apiLoading}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger btn-sm mx-1" 
                      onClick={() => handleDelete(emp._id)}
                      disabled={apiLoading}
                    >
                      {apiLoading ? (
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                      ) : (
                        'Delete'
                      )}
                    </button>
                  </div>
                ),
              }))}
            />
          </div>
        )}
      </div>

      {/* Modal for Adding/Editing Employee */}
      {showModal && (
        <Modal 
          title={editingEmployee ? "Edit Employee" : "Add Employee"} 
          onClose={() => !apiLoading && setShowModal(false)}
        >
          <input
            type="text"
            className="form-control my-2"
            placeholder="Name"
            value={employeeData.name}
            onChange={(e) => setEmployeeData({ ...employeeData, name: e.target.value })}
            required
            disabled={apiLoading}
          />
          <input
            type="email"
            className="form-control my-2"
            placeholder="Email"
            value={employeeData.email}
            onChange={(e) => setEmployeeData({ ...employeeData, email: e.target.value })}
            required
            disabled={apiLoading}
          />
          <input
            type="text"
            className="form-control my-2"
            placeholder="Phone"
            value={employeeData.phone}
            onChange={(e) => setEmployeeData({ ...employeeData, phone: e.target.value })}
            required
            disabled={apiLoading}
          />
          
          <select
            className="form-select my-2"
            value={employeeData.department}
            onChange={(e) => setEmployeeData({ ...employeeData, department: e.target.value })}
            required
            disabled={apiLoading}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          
          <select
            className="form-select my-2"
            value={employeeData.role}
            onChange={(e) => setEmployeeData({ ...employeeData, role: e.target.value })}
            required
            disabled={apiLoading}
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          
          <button 
            className="btn btn-success" 
            onClick={handleSave}
            disabled={apiLoading}
          >
            {apiLoading ? (
              <span className="spinner-border spinner-border-sm" role="status"></span>
            ) : (
              'Save'
            )}
          </button>
        </Modal>
      )}
    </div>
  );
};

export default Employees;