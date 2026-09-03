import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "bootstrap";
import "./App.css";
import Navbar from "./Navbar";
// =====================================================
// API URL
// =====================================================
const API_URL = "http://localhost:5000/api/mutemp";
function App() {
  // =====================================================
  // Employees
  // =====================================================
  const [employees, setEmployees] = useState([]);
  // =====================================================
  // Search
  // =====================================================
  const [search, setSearch] = useState("");
  // =====================================================
  // Pagination
  // =====================================================
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  // =====================================================
  // Form

  // =====================================================
  const [form, setForm] = useState({
    empname: "",
    empaddress: "",
    empemail: "",
    emppassword: "",
    salary: "",
  });
  // =====================================================
  // Edit Mode
  // =====================================================
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  // =====================================================
  // Load Employees
  // =====================================================
  useEffect(() => {
    fetchEmployees();
  }, []);
  // =====================================================
  // GET Employees
  // =====================================================
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_URL);
      setEmployees(response.data);
      console.log("GET EMPLOYEES:", response.data);
    } catch (error) {
      console.error("GET ERROR:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "ไม่สามารถโหลดข้อมูล Employee ได้",
      });
    }
  };
  // =====================================================
  // Handle Input
  // =====================================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // =====================================================
  // Clear Form
  // =====================================================
  const clearForm = () => {
    setForm({
      empname: "",
      empaddress: "",
      empemail: "",
      emppassword: "",
      salary: "",
    });
    setEditMode(false);
    setEditId(null);
  };

  // =====================================================
  // Close Bootstrap Modal
  // =====================================================
  const closeModal = () => {
    const modalElement = document.getElementById("employeeModal");
    if (modalElement) {
      const modal = Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  };
  // =====================================================
  // CREATE Employee
  // =====================================================
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending CREATE:", form);
      const response = await axios.post(API_URL, form);
      console.log("CREATE RESPONSE:", response.data);
      // ---------------------------------------------
      // Refresh Data
      // ---------------------------------------------
      await fetchEmployees();
      // ---------------------------------------------

      // Clear Form
      // ---------------------------------------------
      clearForm();
      // ---------------------------------------------
      // Close Modal
      // ---------------------------------------------
      closeModal();
      // ---------------------------------------------
      // Success Message
      // ---------------------------------------------
      await Swal.fire({
        icon: "success",
        title: "Saved!",
        text: `เพมิ่ Employee ส าเร็จ\nEmployee ID: ${
          response.data.empId || ""
        }`,
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("CREATE ERROR:", error);
      console.error("CREATE RESPONSE:", error.response);
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text:
          error.response?.data?.message ||
          error.message ||
          "ไม่สามารถเพิ่มขอ้มูลได้",
      });
    }
  };

  // =====================================================
  // OPEN ADD MODAL
  // =====================================================
  const handleAdd = () => {
    clearForm();
  };
  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================
  const handleEdit = (employee) => {
    setEditMode(true);
    setEditId(employee.empId);
    setForm({
      empname: employee.empname || "",
      empaddress: employee.empaddress || "",
      empemail: employee.empemail || "",
      // ไม่แสดง Password Hash
      emppassword: "",
      salary: employee.salary ?? "",
    });
    // ---------------------------------------------
    // Open Bootstrap Modal
    // ---------------------------------------------
    const modalElement = document.getElementById("employeeModal");
    if (modalElement) {
      const modal = Modal.getOrCreateInstance(modalElement);
      modal.show();
    }
  };

  // =====================================================
  // UPDATE Employee
  // =====================================================
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending UPDATE:", form);
      const response = await axios.put(`${API_URL}/${editId}`, form);
      console.log("UPDATE RESPONSE:", response.data);
      // ---------------------------------------------
      // Refresh Data
      // ---------------------------------------------
      await fetchEmployees();
      // ---------------------------------------------
      // Clear Form
      // ---------------------------------------------
      clearForm();
      // ---------------------------------------------
      // Close Modal
      // ---------------------------------------------
      closeModal();
      // ---------------------------------------------
      // Success
      // ---------------------------------------------
      await Swal.fire({
        icon: "success",
        title: "Updated!",

        text: "แก้ไขข้อมูล Employee เรียบร้อย",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("UPDATE ERROR:", error);
      console.error("UPDATE RESPONSE:", error.response);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error.response?.data?.message ||
          error.message ||
          "ไม่สามารถแก้ไขข้อมูลได้",
      });
    }
  };
  // =====================================================
  // DELETE Employee
  // =====================================================
  const handleDelete = async (empId) => {
    const result = await Swal.fire({
      title: "Delete Employee?",
      text: `ต้องการลบ Employee ${empId} ใช่หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/${empId}`);
      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "ลบข้อมูลเรียบร้อย",
        timer: 1500,
        showConfirmButton: false,
      });
      // ---------------------------------------------
      // Refresh Data
      // ---------------------------------------------
      await fetchEmployees();
      // ---------------------------------------------
      // ตรวจสอบว่าหน้าที่ก าลังแสดงยังมีข้อมูลหรือไม่
      // ---------------------------------------------
      const remainingItems = filteredEmployees.length - 1;
      const newTotalPages = Math.ceil(remainingItems / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      } else if (newTotalPages === 0) {
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("DELETE ERROR:", error);
      Swal.fire({
        icon: "error",

        title: "Delete Failed",
        text:
          error.response?.data?.message ||
          error.message ||
          "ไม่สามารถลบข้อมูลได้",
      });
    }
  };
  // =====================================================
  // SEARCH
  // =====================================================
  const filteredEmployees = employees.filter((employee) => {
    const keyword = search.toLowerCase();
    return (
      String(employee.empId || "")
        .toLowerCase()
        .includes(keyword) ||
      String(employee.empname || "")
        .toLowerCase()
        .includes(keyword) ||
      String(employee.empaddress || "")
        .toLowerCase()
        .includes(keyword) ||
      String(employee.empemail || "")
        .toLowerCase()
        .includes(keyword)
    );
  });
  // =====================================================
  // PAGINATION
  // =====================================================
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  // =====================================================
  // Search Change
  // =====================================================
  const handleSearch = (e) => {
    setSearch(e.target.value);
    // Search ใหม่กลับหน้า 1
    setCurrentPage(1);
  };
  // =====================================================
  // Change Page
  // =====================================================
  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  // =====================================================
  // Render
  // =====================================================
  return (
    <>
      <Navbar />
      <div className="container py-4">
        {/* =================================================
HEADER
================================================= */}

        <div
          className="d-flex justify-content-between align-items-center mb-
4"
        >
          <h1 className="fw-bold">Employee Management</h1>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#employeeModal"
            onClick={handleAdd}
          >
            + Add Employee
          </button>
        </div>
        {/* =================================================
SEARCH
================================================= */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <label className="form-label fw-bold">Search Employee</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search ID, name, address or email..."
                  value={search}
                  onChange={handleSearch}
                />
              </div>

              <div className="col-md-6 d-flex align-items-end">
                <div className="text-muted">
                  Found: <strong>{filteredEmployees.length}</strong>
                  employee(s)
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* =================================================
TABLE
================================================= */}
        <div className="card shadow-sm">
          <div className="card-body">
            <div
              className="d-flex justify-content-between align-items-center

mb-3"
            >
              <h4 className="mb-0">Employee List</h4>
              <span className="badge text-bg-secondary">
                Page {totalPages === 0 ? 0 : currentPage}
                {" / "}
                {totalPages}
              </span>
            </div>

            <div className="table-responsive">
              <table
                className="table table-hover table-bordered align-
middle"
              >
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Email</th>
                    <th>Salary</th>

                    <th className="text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentEmployees.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-4 text-
muted"
                      >
                        No employee data
                      </td>
                    </tr>
                  ) : (
                    currentEmployees.map((employee, index) => (
                      <tr key={employee.empId}>
                        <td>{startIndex + index + 1}</td>
                        <td>
                          <strong>{employee.empId}</strong>
                        </td>
                        <td>{employee.empname}</td>
                        <td>{employee.empaddress}</td>
                        <td>{employee.empemail}</td>
                        <td>{employee.salary}</td>
                        <td className="text-center">
                          <button
                            type="button"
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => handleEdit(employee)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(employee.empId)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* =================================================
PAGINATION
================================================= */}
            {totalPages > 0 && (
              <nav>
                <ul className="pagination justify-content-center mb-0">
                  {/* Previous */}
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                  >
                    <button
                      type="button"
                      className="page-link"
                      onClick={() => changePage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>
                  {/* Page Number */}
                  {Array.from({ length: totalPages }, (_, index) => (
                    <li
                      key={index}
                      className={`page-item ${
                        currentPage === index + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        type="button"
                        className="page-link"
                        onClick={() => changePage(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  {/* Next */}
                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      type="button"
                      className="page-link"
                      onClick={() => changePage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
        {/* =================================================
ADD / EDIT MODAL
================================================= */}
        <div
          className="modal fade"
          id="employeeModal"
          tabIndex="-1"
          aria-labelledby="employeeModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              {/* Modal Header */}
              <div className="modal-header">
                <h5 className="modal-title" id="employeeModalLabel">
                  {editMode ? "Edit Employee" : "Add Employee"}
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  onClick={clearForm}
                ></button>
              </div>
              {/* Modal Form */}
              <form onSubmit={editMode ? handleUpdate : handleCreate}>
                <div className="modal-body">
                  {/* =================================
Employee ID
================================= */}
                  {editMode && (
                    <div className="mb-3">
                      <label className="form-label fw-bold">Employee ID</label>

                      <input
                        type="text"
                        className="form-control"
                        value={editId}
                        disabled
                      />
                    </div>
                  )}
                  {/* =================================
Employee Name
================================= */}
                  <div className="mb-3">
                    <label className="form-label">Employee Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="empname"
                      value={form.empname}
                      onChange={handleChange}
                      placeholder="Enter employee name"
                      required
                    />
                  </div>
                  {/* =================================
Address
================================= */}
                  <div className="mb-3">
                    <label className="form-label">Address</label>

                    <textarea
                      className="form-control"
                      name="empaddress"
                      value={form.empaddress}
                      onChange={handleChange}
                      placeholder="Enter address"
                      rows="2"
                    ></textarea>
                  </div>

                  {/* =================================
Email
================================= */}
                  <div className="mb-3">
                    <label className="form-label">Email</label>

                    <input
                      type="email"
                      className="form-control"
                      name="empemail"
                      value={form.empemail}
                      onChange={handleChange}
                      placeholder="Enter email"
                      required
                    />
                  </div>
                  {/* =================================
PASSWORD
================================= */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      {editMode
                        ? "New Password (leave blank to keep current password)"
                        : "Password"}
                    </label>

                    <input
                      type="password"
                      className="form-control"
                      name="emppassword"
                      value={form.emppassword}
                      onChange={handleChange}
                      placeholder={
                        editMode
                          ? "Leave blank to keep current password"
                          : "Enter password"
                      }
                      required={!editMode}
                    />

                    {/* Help Text */}
                    {editMode && (
                      <div className="form-text">
                        Leave blank to keep current password.
                      </div>
                    )}
                  </div>
                  {/* =================================
Salary
================================= */}
                  <div className="mb-3">
                    <label className="form-label">Salary</label>
                    <input
                      type="number"
                      className="form-control"
                      name="salary"
                      value={form.salary}
                      onChange={handleChange}
                      placeholder="Enter salary"
                      min="0"
                    />
                  </div>
                </div>

                {/* =================================================
MODAL FOOTER
================================================= */}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={clearForm}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="btn btn-primary">
                    {editMode ? "Update Employee" : "Save Employee"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default App;
