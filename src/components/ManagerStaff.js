import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    username: "",
    email: "",
    role: "admin",
  });

  // Gọi API lấy danh sách nhân viên khi component được load
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin")
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("Lỗi khi lấy danh sách nhân viên:", err));
  }, []);

  // Hàm xử lý thay đổi input
  const handleChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  // Hàm thêm nhân viên mới
  const handleAddAdmin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/admin", newEmployee);
      setEmployees([...employees, res.data]); // Cập nhật danh sách ngay khi thêm thành công
      alert("Thêm nhân viên thành công!");
      setNewEmployee({ username: "", email: "", role: "admin" }); // Reset form
    } catch (err) {
      console.error("Lỗi khi thêm nhân viên:", err);
      alert("Thêm nhân viên thất bại! Vui lòng thử lại.");
    }
  };

  return (
    <div>
      <h2>Quản lý Nhân Viên</h2>

      {/* Form thêm nhân viên */}
      <form onSubmit={handleAddAdmin}>
        <input
          type="text"
          name="username"
          value={newEmployee.username}
          onChange={handleChange}
          placeholder="Tên nhân viên"
          required
        />
        <input
          type="email"
          name="email"
          value={newEmployee.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <button type="submit">Thêm Nhân Viên</button>
      </form>

      {/* Danh sách nhân viên */}
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên nhân viên</th>
            <th>Email</th>
            <th>Vai trò</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td>{emp._id}</td>
              <td>{emp.username}</td>
              <td>{emp.email}</td>
              <td>{emp.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageEmployees;
