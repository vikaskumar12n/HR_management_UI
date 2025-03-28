import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const Candidates = () => {
  const nav = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showHireModal, setShowHireModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [candidateData, setCandidateData] = useState({
    name: "",
    email: "",
    phone: "",
    resume: null,
  });
  const [hireData, setHireData] = useState({
    role: "",
    department: "",
  });
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetchCandidates();
  }, []);

  // Fetch Candidates
  const fetchCandidates = async () => {
    try {
      const res = await axios.get("https://hr-management-ln65.onrender.com/api/candidates/");
     
      setCandidates(res.data || []);
    } catch (error) {
      console.error("Error fetching candidates:", error.response?.data || error.message);
    }
  };

  // Resume Download Function
  const handleDownloadResume = async (resumeFile) => {
    if (!resumeFile) {
      alert("No resume available for download.");
      return;
    }

    try {
      const response = await axios.get(`https://hr-management-ln65.onrender.com/uploads/${resumeFile}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = resumeFile;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading resume:", error.message);
    }
  };

  // Save Candidate (Add or Update)
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", candidateData.name);
      formData.append("email", candidateData.email);
      formData.append("phone", candidateData.phone);
      
      if (candidateData.resume instanceof File) {
        formData.append("resume", candidateData.resume);
      }

     
     
      if (editingCandidate) {
       const res= await axios.put(
          `http://localhost:5000/api/candidates/${editingCandidate._id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data",Authorization: `Bearer ${token}` } }
        );
        alert(res.data.message)
      } else {
        const res= await axios.post(
          "https://hr-management-ln65.onrender.com/api/candidates/",
          formData,
          { headers: {Authorization: `Bearer ${token}`, } },
        );
        alert(res.data.message)
      }
      fetchCandidates();
      setShowModal(false);
      setEditingCandidate(null);
      setCandidateData({ name: "", email: "", phone: "", resume: null });
    } catch (error) {
      if (error?.response?.status === 401) {
       
        alert(error.response.data.message)
        nav("/login");
      }
     
    }
  };

  // Delete Candidate
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/candidates/${id}`,
          { headers: {Authorization: `Bearer ${token}` } }
        );
       alert(response.data.message)
        fetchCandidates();
      } catch (error) {
        if (error?.response?.status === 401) {
         
          alert(error.response.data.message)
          nav("/login");
        }
       
      }
    }
  };

  // Hire Candidate (Move to Employees)
  const handleHire = async () => {
    if (!hireData.role || !hireData.department) {
      alert("Role and department are required!");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/candidates/move/${editingCandidate._id}`,
        hireData
        ,  { headers: {Authorization: `Bearer ${token}` } }
         
      );
      alert(response.data.message)

      fetchCandidates();
      setShowHireModal(false);
      setEditingCandidate(null);
      setHireData({ role: "", department: "" });
    } catch (error) {
      if (error?.response?.status === 401) {
       
        alert(error.response.data.message)
        nav("/login");
      }
     
    }
  };

  const filteredCandidates = candidates.filter((cand) =>
    cand?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2>Candidate Management</h2>

        <button
          className="btn btn-primary my-3"
          onClick={() => {
            setEditingCandidate(null);
            setCandidateData({ name: "", email: "", phone: "", resume: null });
            setShowModal(true);
          }}
        >
          Add Candidate
        </button>

        <SearchBar 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          placeholder="Search Candidates..." 
        />
        
        <Table
          headers={["Name", "Email", "Phone", "Resume", "Actions"]}
          data={filteredCandidates.map((cand) => ({
            Name: cand?.name || "N/A",
            Email: cand?.email || "N/A",
            Phone: cand?.phone || "N/A",
            Resume: cand?.resume ? (
              <button
                className="btn btn-link"
                onClick={() => handleDownloadResume(cand.resume)}
              >
                Download
              </button>
            ) : "No File",
            Actions: (
              <div>
                <button
                  className="btn btn-warning btn-sm mx-1"
                  onClick={() => {
                    setEditingCandidate(cand);
                    setCandidateData({ 
                      name: cand.name || "", 
                      email: cand.email || "", 
                      phone: cand.phone || "", 
                      resume: null 
                    });
                    setShowModal(true);
                  }}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-success btn-sm mx-1" 
                  onClick={() => {
                    setEditingCandidate(cand);
                    setShowHireModal(true);
                  }}
                >
                  Hire
                </button>
                <button 
                  className="btn btn-danger btn-sm mx-1" 
                  onClick={() => handleDelete(cand._id)}
                >
                  Delete
                </button>
              </div>
            ),
          }))} 
        />
      </div>

      {/* Modal for Adding/Editing Candidate */}
      {showModal && (
        <Modal 
          title={editingCandidate ? "Edit Candidate" : "Add Candidate"} 
          onClose={() => setShowModal(false)}
        >
          <input
            type="text"
            className="form-control my-2"
            placeholder="Name"
            value={candidateData.name}
            onChange={(e) => setCandidateData({ ...candidateData, name: e.target.value })}
            required
          />
          <input
            type="email"
            className="form-control my-2"
            placeholder="Email"
            value={candidateData.email}
            onChange={(e) => setCandidateData({ ...candidateData, email: e.target.value })}
            required
          />
          <input
            type="text"
            className="form-control my-2"
            placeholder="Phone"
            value={candidateData.phone}
            onChange={(e) => setCandidateData({ ...candidateData, phone: e.target.value })}
          />
          <input
            type="file"
            className="form-control my-2"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setCandidateData({ 
              ...candidateData, 
              resume: e.target.files[0] 
            })}
          />
          <button className="btn btn-success" onClick={handleSave}>
            Save
          </button>
        </Modal>
      )}

      {/* Modal for Hiring Candidate */}
      {showHireModal && (
        <Modal 
          title="Hire Candidate" 
          onClose={() => setShowHireModal(false)}
        >
          <input
            type="text"
            className="form-control my-2"
            placeholder="Role"
            value={hireData.role}
            onChange={(e) => setHireData({ ...hireData, role: e.target.value })}
            required
          />
          <input
            type="text"
            className="form-control my-2"
            placeholder="Department"
            value={hireData.department}
            onChange={(e) => setHireData({ ...hireData, department: e.target.value })}
            required
          />
          <button className="btn btn-success" onClick={handleHire}>
            Confirm Hire
          </button>
        </Modal>
      )}
    </div>
  );
};

export default Candidates;