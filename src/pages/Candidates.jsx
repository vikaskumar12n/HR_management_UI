import { useState, useEffect } from "react";
import Table from "../components/Table";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const Candidates = () => {
  const nav = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showHireModal, setShowHireModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);
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
    setLoading(true);
    try {
      const res = await axios.get(
        "https://hr-management-ln65.onrender.com/api/candidates/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCandidates(res.data || []);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
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

  // Resume Download Function
  const handleDownloadResume = async (resumeFile) => {
    if (!resumeFile) {
      Swal.fire({
        icon: "warning",
        title: "No Resume",
        text: "No resume available for download",
      });
      return;
    }

    try {
      const response = await axios.get(
        `https://hr-management-ln65.onrender.com/uploads/${resumeFile}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = resumeFile;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Download Failed",
        text: "Failed to download resume",
      });
    }
  };

  // Save Candidate (Add or Update)
  const handleSave = async () => {
    setApiLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", candidateData.name);
      formData.append("email", candidateData.email);
      formData.append("phone", candidateData.phone);

      if (candidateData.resume instanceof File) {
        formData.append("resume", candidateData.resume);
      }

      const result = await Swal.fire({
        title: editingCandidate ? "Update Candidate" : "Add Candidate",
        text: `Are you sure you want to ${
          editingCandidate ? "update" : "add"
        } this candidate?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, proceed!",
      });

      if (result.isConfirmed) {
        let response;
        if (editingCandidate) {
          response = await axios.put(
            `https://hr-management-ln65.onrender.com/api/candidates/${editingCandidate._id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } else {
          response = await axios.post(
            "https://hr-management-ln65.onrender.com/api/candidates/",
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }

        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: response.data.message,
        });

        fetchCandidates();
        setShowModal(false);
        setEditingCandidate(null);
        setCandidateData({ name: "", email: "", phone: "", resume: null });
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setApiLoading(false);
    }
  };

  // Delete Candidate
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
        const response = await axios.delete(
          `https://hr-management-ln65.onrender.com/api/candidates/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await Swal.fire("Deleted!", response.data.message, "success");

        fetchCandidates();
      } catch (err) {
        handleApiError(err);
      } finally {
        setApiLoading(false);
      }
    }
  };

  // Hire Candidate (Move to Employees)
  const handleHire = async () => {
    if (!hireData.role || !hireData.department) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Role and department are required!",
      });
      return;
    }

    setApiLoading(true);
    try {
      const result = await Swal.fire({
        title: "Confirm Hire",
        text: `Are you sure you want to hire ${editingCandidate?.name} as ${hireData.role} in ${hireData.department}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, hire them!",
      });

      if (result.isConfirmed) {
        const response = await axios.post(
          `https://hr-management-ln65.onrender.com/api/candidates/move/${editingCandidate._id}`,
          hireData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await Swal.fire({
          icon: "success",
          title: "Hired!",
          text: response.data.message,
        });

        fetchCandidates();
        setShowHireModal(false);
        setEditingCandidate(null);
        setHireData({ role: "", department: "" });
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setApiLoading(false);
    }
  };

  const filteredCandidates = candidates.filter((cand) =>
    cand?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="container mt-4">
        <h2>Candidate Management</h2>

        <button
          className="btn btn-primary my-3"
          onClick={() => {
            setEditingCandidate(null);
            setCandidateData({ name: "", email: "", phone: "", resume: null });
            setShowModal(true);
          }}
          disabled={loading || apiLoading}
        >
          {apiLoading ? (
            <span
              className="spinner-border spinner-border-sm me-1"
              role="status"
              aria-hidden="true"
            ></span>
          ) : null}
          Add Candidate
        </button>

        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Candidates..."
          disabled={loading}
        />

        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading candidates...</p>
          </div>
        ) : (
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
                  disabled={apiLoading}
                >
                  Download
                </button>
              ) : (
                "No File"
              ),
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
                        resume: null,
                      });
                      setShowModal(true);
                    }}
                    disabled={apiLoading}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-success btn-sm mx-1"
                    onClick={() => {
                      setEditingCandidate(cand);
                      setShowHireModal(true);
                    }}
                    disabled={apiLoading}
                  >
                    Hire
                  </button>
                  <button
                    className="btn btn-danger btn-sm mx-1"
                    onClick={() => handleDelete(cand._id)}
                    disabled={apiLoading}
                  >
                    Delete
                  </button>
                </div>
              ),
            }))}
          />
        )}
      </div>

      {/* Modal for Adding/Editing Candidate */}
      {showModal && (
        <Modal
          title={editingCandidate ? "Edit Candidate" : "Add Candidate"}
          onClose={() => !apiLoading && setShowModal(false)}
        >
          <input
            type="text"
            className="form-control my-2"
            placeholder="Name"
            value={candidateData.name}
            onChange={(e) =>
              setCandidateData({ ...candidateData, name: e.target.value })
            }
            required
            disabled={apiLoading}
          />
          <input
            type="email"
            className="form-control my-2"
            placeholder="Email"
            value={candidateData.email}
            onChange={(e) =>
              setCandidateData({ ...candidateData, email: e.target.value })
            }
            required
            disabled={apiLoading}
          />
          <input
            type="text"
            className="form-control my-2"
            placeholder="Phone"
            value={candidateData.phone}
            onChange={(e) =>
              setCandidateData({ ...candidateData, phone: e.target.value })
            }
            disabled={apiLoading}
          />
          <input
            type="file"
            className="form-control my-2"
            accept=".pdf,.doc,.docx"
            onChange={(e) =>
              setCandidateData({
                ...candidateData,
                resume: e.target.files[0],
              })
            }
            disabled={apiLoading}
          />
          <button
            className="btn btn-success"
            onClick={handleSave}
            disabled={apiLoading}
          >
            {apiLoading ? (
              <span
                className="spinner-border spinner-border-sm me-1"
                role="status"
                aria-hidden="true"
              ></span>
            ) : null}
            Save
          </button>
        </Modal>
      )}

      {/* Modal for Hiring Candidate */}
      {showHireModal && (
        <Modal
          title="Hire Candidate"
          onClose={() => !apiLoading && setShowHireModal(false)}
        >
          <input
            type="text"
            className="form-control my-2"
            placeholder="Role"
            value={hireData.role}
            onChange={(e) =>
              setHireData({ ...hireData, role: e.target.value })
            }
            required
            disabled={apiLoading}
          />
          <input
            type="text"
            className="form-control my-2"
            placeholder="Department"
            value={hireData.department}
            onChange={(e) =>
              setHireData({ ...hireData, department: e.target.value })
            }
            required
            disabled={apiLoading}
          />
          <button
            className="btn btn-success"
            onClick={handleHire}
            disabled={apiLoading}
          >
            {apiLoading ? (
              <span
                className="spinner-border spinner-border-sm me-1"
                role="status"
                aria-hidden="true"
              ></span>
            ) : null}
            Confirm Hire
          </button>
        </Modal>
      )}
    </div>
  );
};

export default Candidates;