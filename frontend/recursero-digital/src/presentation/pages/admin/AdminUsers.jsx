import React, { useEffect, useState } from "react";
import AddUserForm from "./AddUserForm";
import EditStudentForm from "./EditStudentForm";
import DeleteStudentForm from "./DeleteStudentForm";
import EditTeacherForm from "./EditTeacherForm";
import DeleteTeacherForm from "./DeleteTeacherForm";
import BulkUploadForm from "./BulkUploadForm";
import "../../styles/pages/adminUsers.css";
import AdminTeachers from "../admin/AdminTeachers";
import { createStudent, getAllStudents, createTeacher, getAllTeachers, getAllCourses, getCourseStudents, updateStudent, deleteStudent, updateTeacher, deleteTeacher, bulkUploadStudents } from "../../services/adminService";

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState("students");
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showBulkUploadForm, setShowBulkUploadForm] = useState(false);
  const [showEditStudentForm, setShowEditStudentForm] = useState(false);
  const [showDeleteStudentForm, setShowDeleteStudentForm] = useState(false);
  const [showEditTeacherForm, setShowEditTeacherForm] = useState(false);
  const [showDeleteTeacherForm, setShowDeleteTeacherForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
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
        
        // Cargar cursos siempre para los formularios
        const coursesData = await getAllCourses();
        setCourses(coursesData);
        
        if (activeTab === "students") {
          const data = await getAllStudents();
          setStudents(
            data.map((s) => ({
              id: s.id,
              name: s.name || `${s.firstName} ${s.lastName}`,
              firstName: s.firstName,
              lastName: s.lastName,
              username: s.username,
              courseId: s.courseId || null,
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
                firstName: teacher.firstName || teacher.name,
                lastName: teacher.lastName || teacher.surname,
                surname: teacher.surname,
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

  const handleBulkUpload = () => {
    setShowBulkUploadForm(true);
  };

  const handleBulkUploadSubmit = async (studentsData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await bulkUploadStudents(studentsData);
      
      // Recargar la lista de estudiantes
      const data = await getAllStudents();
      setStudents(
        data.map((s) => ({
          id: s.id,
          name: s.name || s.firstName + " " + s.lastName,
          firstName: s.firstName,
          lastName: s.lastName,
          username: s.username,
          courseId: s.courseId || null,
          status: "Activo",
        }))
      );
      
      setShowBulkUploadForm(false);
      
      // Mostrar mensaje de éxito con detalles
      let message = result.message;
      if (result.errorDetails && result.errorDetails.length > 0) {
        message += "\n\nDetalles de errores:\n" + result.errorDetails.join("\n");
      }
      alert(message);
      
    } catch (err) {
      console.error("Error en carga masiva:", err);
      setError(err.message || "Error en la carga masiva de estudiantes");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowAddUserForm(false);
    setShowBulkUploadForm(false);
    setShowEditStudentForm(false);
    setShowDeleteStudentForm(false);
    setShowEditTeacherForm(false);
    setShowDeleteTeacherForm(false);
    setSelectedStudent(null);
    setSelectedTeacher(null);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setShowEditStudentForm(true);
  };

  const handleDeleteStudent = (student) => {
    setSelectedStudent(student);
    setShowDeleteStudentForm(true);
  };

  const handleEditTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setShowEditTeacherForm(true);
  };

  const handleDeleteTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setShowDeleteTeacherForm(true);
  };

  const handleUpdateStudent = async (studentData) => {
    try {
      setLoading(true);
      setError(null);
      await updateStudent(studentData);
      
      // Recargar estudiantes
      const data = await getAllStudents();
      setStudents(
        data.map((s) => ({
          id: s.id,
          name: s.name || `${s.firstName} ${s.lastName}`,
          firstName: s.firstName,
          lastName: s.lastName,
          username: s.username,
          courseId: s.courseId || null,
          status: "Activo",
        }))
      );
      
      handleCloseForm();
    } catch (err) {
      console.error("Error al actualizar estudiante:", err);
      setError(err.message || "Error al actualizar estudiante");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDeleteStudent = async (student) => {
    try {
      setLoading(true);
      setError(null);
      await deleteStudent(student.id);
      
      // Recargar estudiantes
      const data = await getAllStudents();
      setStudents(
        data.map((s) => ({
          id: s.id,
          name: s.name || `${s.firstName} ${s.lastName}`,
          firstName: s.firstName,
          lastName: s.lastName,
          username: s.username,
          courseId: s.courseId || null,
          status: "Activo",
        }))
      );
      
      handleCloseForm();
    } catch (err) {
      console.error("Error al eliminar estudiante:", err);
      setError(err.message || "Error al eliminar estudiante");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTeacher = async (teacherData) => {
    try {
      setLoading(true);
      setError(null);
      await updateTeacher(teacherData);
      
      // Recargar docentes
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
      handleCloseForm();
    } catch (err) {
      console.error("Error al actualizar docente:", err);
      setError(err.message || "Error al actualizar docente");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDeleteTeacher = async (teacher) => {
    try {
      setLoading(true);
      setError(null);
      await deleteTeacher(teacher.id);
      
      // Recargar docentes
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
      handleCloseForm();
    } catch (err) {
      console.error("Error al eliminar docente:", err);
      setError(err.message || "Error al eliminar docente");
    } finally {
      setLoading(false);
    }
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
            firstName: s.firstName,
            lastName: s.lastName,
            username: s.username,
            courseId: s.courseId || null,
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
              firstName: teacher.firstName || teacher.name,
              lastName: teacher.lastName || teacher.surname,
              surname: teacher.surname,
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
        <div className="header-actions">
          <button className="add-user-btn" onClick={handleAddUser} disabled={loading}>
            {loading ? "Guardando..." : "+ Agregar Usuario"}
          </button>
          {activeTab === "students" && (
            <button className="bulk-upload-btn" onClick={handleBulkUpload} disabled={loading}>
              📄 Carga Masiva
            </button>
          )}
        </div>
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
                    <button 
                      className="edit-botn" 
                      onClick={() => handleEditStudent(student)}
                      disabled={loading}
                    >
                      Editar
                    </button>
                    <button 
                      className="delete-botn" 
                      onClick={() => handleDeleteStudent(student)}
                      disabled={loading}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "teachers" && (
        <AdminTeachers 
          teachers={teachers} 
          onEdit={handleEditTeacher}
          onDelete={handleDeleteTeacher}
        />
      )}

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

      {showEditStudentForm && selectedStudent && (
        <EditStudentForm
          onClose={handleCloseForm}
          onSubmit={handleUpdateStudent}
          student={selectedStudent}
          courses={courses}
        />
      )}

      {showDeleteStudentForm && selectedStudent && (
        <DeleteStudentForm
          onClose={handleCloseForm}
          onConfirm={handleConfirmDeleteStudent}
          student={selectedStudent}
        />
      )}

      {showEditTeacherForm && selectedTeacher && (
        <EditTeacherForm
          onClose={handleCloseForm}
          onSubmit={handleUpdateTeacher}
          teacher={selectedTeacher}
          courses={courses}
        />
      )}

      {showDeleteTeacherForm && selectedTeacher && (
        <DeleteTeacherForm
          onClose={handleCloseForm}
          onConfirm={handleConfirmDeleteTeacher}
          teacher={selectedTeacher}
        />
      )}

      {showBulkUploadForm && (
        <BulkUploadForm
          onClose={handleCloseForm}
          onSubmit={handleBulkUploadSubmit}
        />
      )}
    </div>
  );
}
