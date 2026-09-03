import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
const API_URL = "http://localhost:5000/api/mutemp";
function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    empId: "",
    empname: "",
    empaddress: "",
    empemail: "",
    emppassword: "",
    salary: "",
  });
  const [editing, setEditing] = useState(false);
  // =================================
  // GET DATA
  // =================================
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_URL);
      setEmployees(response.data);
    } catch (error) {
      console.error(error);
      alert("ไม่สามารถดึงข้อมูลได้");
    }
  };

  // =================================
  // LOAD DATA
  // =================================
  useEffect(() => {
    fetchEmployees();
  }, []);
  // =================================
  // HANDLE INPUT
  // =================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };
  // =================================
  // CLEAR FORM
  // =================================
  const clearForm = () => {
    setForm({
      empId: "",

      empname: "",
      empaddress: "",
      empemail: "",
      emppassword: "",
      salary: "",
    });
    setEditing(false);
  };

  // =================================
  // CREATE
  // =================================
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, form);
      alert("เพิ่มขอ้ มูลเรียบร้อย");

      clearForm();
      fetchEmployees();
    } catch (error) {
      console.error(error);
      alert("ไม่สามารถเพิ่มขอ้ มูลได้");
    }
  };
  // =================================
  // EDIT
  // =================================

  const handleEdit = (employee) => {
    setForm({
      empId: employee.empId,
      empname: employee.empname,
      empaddress: employee.empaddress,
      empemail: employee.empemail,
      emppassword: employee.emppassword,
      salary: employee.salary,
    });
    setEditing(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  // =================================
  // UPDATE
  // =================================
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${form.empId}`, {
        empname: form.empname,
        empaddress: form.empaddress,
        empemail: form.empemail,
        emppassword: form.emppassword,
        salary: form.salary,
      });

      alert("แก้ไขข้อมูลเรียบร้อย");

      clearForm();
      fetchEmployees();
    } catch (error) {
      console.error(error);
      alert("ไม่สามารถแก้ไขข้อมูลได้");
    }
  };

  // =================================
  // DELETE
  // =================================
  const handleDelete = async (empId) => {
    const confirmDelete = window.confirm(
      "ตอ้งการลบขอ้ มูลพนกังานคนน้ีหรือไม่?",
    );

    if (!confirmDelete) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/${empId}`);
      alert("ลบข้อมูลเรียบร้อย");

      fetchEmployees();
    } catch (error) {
      console.error(error);
      alert("ไม่สามารถลบข้อมูลได้");
    }
  };

  return (
    <div className="container">
      <h1>MUTEMP Employee Management</h1>
      {/* ================================= */}
      {/* FORM */}
      {/* ================================= */}

      <div className="form-card">
        <h2>{editing ? "Edit Employee" : "Add Employee"}</h2>
        <form onSubmit={editing ? handleUpdate : handleCreate}>
          <div className="form-group">
            <label>Employee ID</label>
            <input
              type="text"
              name="empId"
              value={form.empId}
              onChange={handleChange}
              disabled={editing}
              required
            />
          </div>

          <div className="form-group">
            <label>Employee Name</label>
            <input
              type="text"
              name="empname"
              value={form.empname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Address</label>

            <input
              type="text"
              name="empaddress"
              value={form.empaddress}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="empemail"
              value={form.empemail}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="emppassword"
              value={form.emppassword}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Salary</label>

            <input
              type="number"
              name="salary"
              value={form.salary}
              onChange={handleChange}
            />
          </div>

          <div className="button-group">
            <button type="submit" className="btn-save">
              {editing ? "Update" : "Add Employee"}
            </button>
            {editing && (
              <button type="button" className="btn-cancel" onClick={clearForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ================================= */}
      {/* TABLE */}
      {/* ================================= */}
      <div className="table-card">
        <h2>Employee List</h2>
        <table>
          <thead>
            <tr>
              <th>Employee ID</th>

              <th>Name</th>

              <th>Address</th>

              <th>Email</th>

              <th>Salary</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((employee) => (
              <tr key={employee.empId}>
                <td>{employee.empId}</td>
                <td>{employee.empname}</td>
                <td>{employee.empaddress}</td>
                <td>{employee.empemail}</td>

                <td>{employee.salary}</td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(employee)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(employee.empId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default App;
