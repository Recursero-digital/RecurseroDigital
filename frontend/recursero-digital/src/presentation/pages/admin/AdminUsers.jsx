import React, { useState } from "react";
import AddUserForm from "./AddUserForm";
import "../../styles/pages/adminUsers.css";
import AdminTeachers from "../admin/AdminTeachers";

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState("students");
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  const mockStudents = [
    { id: 1, name: "Juan Pérez", username: "JuanPerez", status: "Activo" },
    { id: 2, name: "María García", username: "MariaG", status: "Activo" },
    { id: 3, name: "Carlos López", username: "CarlosL", status: "Inactivo" },
  ];

  const handleAddUser = () => {
    setShowAddUserForm(true);
  };

  const handleCloseForm = () => {
    setShowAddUserForm(false);
  };

  const handleUserSubmit = (userData) => {
    console.log("Nuevo usuario:", userData);
    // Aquí implementarías la lógica para agregar el usuario
    setShowAddUserForm(false);
  };

  return (
    <div className="admin-users">
      <div className="users-header">
        <h1>Gestión de Usuarios</h1>
        <button className="add-user-btn" onClick={handleAddUser}>
          + Agregar Usuario
        </button>
      </div>

      <div className="users-tabs">
        <button
          className={`tab-btn ${activeTab === "students" ? "active" : ""}`}
          onClick={() => setActiveTab("students")}
        >
          Estudiantes
        </button>
        <button
          className={`tab-btn ${activeTab === "teachers" ? "active" : ""}`}
          onClick={() => setActiveTab("teachers")}
        >
          Docentes
        </button>
      </div>

    
        {activeTab === "students" && (
          <div className="users-table">
            <h2>Estudiantes</h2>
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Username</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {mockStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.username}</td>
                    <td>
                      <span
                        className={`status ${student.status.toLowerCase()}`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td>
                      <button className="edit-botn">Editar</button>
                      <button className="delete-botn">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "teachers" && <AdminTeachers />}
     

      {showAddUserForm && (
        <AddUserForm
          onClose={handleCloseForm}
          onSubmit={handleUserSubmit}
          userType={
            activeTab === "students"
              ? "estudiante"
              : activeTab === "teachers"
              ? "docente"
              : "administrador"
          }
        />
      )}
    </div>
  );
}
