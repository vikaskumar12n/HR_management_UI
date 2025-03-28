import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const Employees = () => {
  const nav=useNavigate()
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [employeeData, setEmployeeData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    role: "",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);
  const token = useSelector((state) => state.auth.token);

  // ✅ Fetch Employees
  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employees/",
        { headers: {Authorization: `Bearer ${token}` } }

      );
      setEmployees(res.data || []);
   
    } catch (error) {
      if (error?.response?.status === 401) {
       
        alert(error.response.data.message)
        nav("/login");
      }
     
    }
  };

  // ✅ Save Employee (Add or Update)
  const handleSave = async () => {
    try {
      if (editingEmployee) {
      const res=  await axios.put(`https://hr-management-ln65.onrender.com/api/employees/${editingEmployee._id}`, 
        employeeData,
        { headers: {Authorization: `Bearer ${token}` } });
     alert(res.data.message)
      } else {
       const res= await axios.post("https://hr-management-ln65.onrender.com/api/employees/register", employeeData,
        { headers: {Authorization: `Bearer ${token}` } });
     alert(res.data.message)
      }
      fetchEmployees();
      setShowModal(false);
      setEditingEmployee(null);
      setEmployeeData({ name: "", email: "", phone: "", department: "", role: "" }); // Reset form
    } catch (error) {
      if (error?.response?.status === 401) {
       
        alert(error.response.data.message)
        nav("/login");
      }
     
    }
  };

  // ✅ Delete Employee
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
       const res= await axios.delete(`http://localhost:5000/api/employees/${id}`,
        { headers: {Authorization: `Bearer ${token}` } }
       );
        fetchEmployees();
       alert(res.data.message)

      } catch (error) {
        if (error?.response?.status === 401) {
         
          alert(error.response.data.message)
          nav("/login");
        }
       
      }
    }
  };

  const filteredEmployees = employees?.filter((emp) =>
    emp?.name?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2>Employee Management</h2>
        <button
          className="btn btn-primary my-3"
          onClick={() => {
            setEditingEmployee(null);
            setEmployeeData({ name: "", email: "", phone: "", department: "", role: "" });
            setShowModal(true);
          }}
        >
          Add Employee
        </button>
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Employees..." />
        
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
                >
                  Edit
                </button>
                <button className="btn btn-danger btn-sm mx-1" onClick={() => handleDelete(emp._id)}>Delete</button>
              </div>
            ),
          }))}
        />
      </div>

      {/* Modal for Adding/Editing Employee */}
      {showModal && (
        <Modal title={editingEmployee ? "Edit Employee" : "Add Employee"} onClose={() => setShowModal(false)}>
          <input
            type="text"
            className="form-control my-2"
            placeholder="Name"
            value={employeeData.name}
            onChange={(e) => setEmployeeData({ ...employeeData, name: e.target.value })}
          />
          <input
            type="email"
            className="form-control my-2"
            placeholder="Email"
            value={employeeData.email}
            onChange={(e) => setEmployeeData({ ...employeeData, email: e.target.value })}
          />
          <input
            type="text"
            className="form-control my-2"
            placeholder="Phone"
            value={employeeData.phone}
            onChange={(e) => setEmployeeData({ ...employeeData, phone: e.target.value })}
          />
          <input
            type="text"
            className="form-control my-2"
            placeholder="Department"
            value={employeeData.department}
            onChange={(e) => setEmployeeData({ ...employeeData, department: e.target.value })}
          />
          <input
            type="text"
            className="form-control my-2"
            placeholder="Role"
            value={employeeData.role}
            onChange={(e) => setEmployeeData({ ...employeeData, role: e.target.value })}
          />
          <button className="btn btn-success" onClick={handleSave}>Save</button>
        </Modal>
      )}
    </div>
  );
};

export default Employees;
