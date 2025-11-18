import React, { useEffect, useState } from "react";
import AddUserForm from "./AddUserForm";
import "../../styles/pages/adminUsers.css";
import AdminTeachers from "../admin/AdminTeachers";
import { createStudent, getAllStudents, createTeacher, getAllTeachers, getAllCourses, getCourseStudents } from "../../services/adminService";

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState("students");
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar que el usuario esté logueado
    const token = localStorage.getItem('token');
    if (!token) {
      setError("No estás autenticado. Por favor, inicia sesión como administrador.");
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        if (activeTab === "students") {
          const data = await getAllStudents();
          setStudents(
            data.map((s) => ({
              id: s.id,
              name: s.name || `${s.firstName} ${s.lastName}`,
              username: s.username,
              status: "Activo",
            }))
          );
        } else if (activeTab === "teachers") {
          const [teachersData, coursesData] = await Promise.all([
            getAllTeachers(),
            getAllCourses()
          ]);
          
          // Para cada docente, obtener sus cursos y estudiantes
          const teachersWithDetails = await Promise.all(
            teachersData.map(async (teacher) => {
              // Filtrar cursos asignados a este docente
              const teacherCourses = coursesData.filter(course => course.teacherId === teacher.id);
              
              // Obtener estudiantes de todos los cursos del docente
              const allStudents = new Set(); // Usar Set para evitar duplicados
              
              for (const course of teacherCourses) {
                try {
                  const courseStudents = await getCourseStudents(course.id);
                  if (Array.isArray(courseStudents)) {
                    courseStudents.forEach(student => allStudents.add(student.id));
                  }
                } catch (err) {
                  console.warn(`No se pudieron obtener estudiantes del curso ${course.id}:`, err);
                }
              }
              
              return {
                id: teacher.id,
                name: teacher.fullName || `${teacher.name} ${teacher.surname}`,
                username: teacher.username,
                email: teacher.email,
                status: "Activo",
                courses: teacherCourses,
                students: Array.from(allStudents).map(id => ({ id })) // Array de IDs únicos
              };
            })
          );
          
          setTeachers(teachersWithDetails);
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError(err.message || "No se pudieron cargar los datos. Verifica que estés logueado como administrador.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [activeTab]);

  const handleAddUser = () => {
    setShowAddUserForm(true);
  };

  const handleCloseForm = () => {
    setShowAddUserForm(false);
  };

  const handleUserSubmit = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      if (activeTab === "students") {
        await createStudent(userData);
        // Recargar la lista desde el backend
        const data = await getAllStudents();
        setStudents(
          data.map((s) => ({
            id: s.id,
            name: s.name || `${s.firstName} ${s.lastName}`,
            username: s.username,
            status: "Activo",
          }))
        );
      } else if (activeTab === "teachers") {
        await createTeacher({
          nombre: userData.nombre,
          apellido: userData.apellido,
          email: userData.email,
          username: userData.username,
          password: userData.password,
        });
        // Recargar la lista desde el backend con cursos y estudiantes
        const [teachersData, coursesData] = await Promise.all([
          getAllTeachers(),
          getAllCourses()
        ]);
        
        const teachersWithDetails = await Promise.all(
          teachersData.map(async (teacher) => {
            const teacherCourses = coursesData.filter(course => course.teacherId === teacher.id);
            const allStudents = new Set();
            
            for (const course of teacherCourses) {
              try {
                const courseStudents = await getCourseStudents(course.id);
                if (Array.isArray(courseStudents)) {
                  courseStudents.forEach(student => allStudents.add(student.id));
                }
              } catch (err) {
                console.warn(`No se pudieron obtener estudiantes del curso ${course.id}:`, err);
              }
            }
            
            return {
              id: teacher.id,
              name: teacher.fullName || `${teacher.name} ${teacher.surname}`,
              username: teacher.username,
              email: teacher.email,
              status: "Activo",
              courses: teacherCourses,
              students: Array.from(allStudents).map(id => ({ id }))
            };
          })
        );
        
        setTeachers(teachersWithDetails);
      }

      setShowAddUserForm(false);
    } catch (err) {
      console.error("Error al crear usuario:", err);
      setError(err.message || "Error al crear usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-users">
      <div className="users-header">
        <h1>Gestión de Usuarios</h1>
        <button className="add-user-btn" onClick={handleAddUser} disabled={loading}>
          {loading ? "Guardando..." : "+ Agregar Usuario"}
        </button>
      </div>

      {error && <div className="error-message-admin">{error}</div>}

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
              {students.map((student) => (
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
                    <button className="edit-botn" disabled>
                      Editar
                    </button>
                    <button className="delete-botn" disabled>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "teachers" && <AdminTeachers teachers={teachers} />}

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
