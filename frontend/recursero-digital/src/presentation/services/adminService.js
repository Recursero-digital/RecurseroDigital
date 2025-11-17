const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}`;

const authHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const createStudent = async ({ nombre, apellido, username, password, dni }) => {
  const response = await fetch(`${API_BASE_URL}/student`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      name: nombre,
      lastName: apellido,
      username,
      password,
      dni
    })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Error al crear estudiante');
  }
  return data;
};

export const createCourse = async ({ name }) => {
  const response = await fetch(`${API_BASE_URL}/courses`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ name })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Error al crear curso');
  }
  return data;
};

export const getAllStudents = async () => {
  const response = await fetch(`${API_BASE_URL}/student`, {
    headers: authHeaders()
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Error al obtener estudiantes');
  }
  return data.students || [];
};

export const getAllTeachers = async () => {
  const response = await fetch(`${API_BASE_URL}/teacher`, {
    headers: authHeaders()
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Error al obtener docentes');
  }
  return data.teachers || [];
};

export const getAllCourses = async () => {
  const response = await fetch(`${API_BASE_URL}/courses`, {
    headers: authHeaders()
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Error al obtener cursos');
  }
  return data.courses || [];
};

export const createTeacher = async ({ nombre, apellido, email, username, password }) => {
  const response = await fetch(`${API_BASE_URL}/teacher`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      name: nombre,
      surname: apellido,
      email,
      username,
      password
    })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Error al crear docente');
  }
  return data;
};

export const assignCourseToStudent = async ({ studentId, courseId }) => {
  const response = await fetch(`${API_BASE_URL}/student/${studentId}/courses`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ courseId })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Error al asignar curso');
  }
  return data;
};

export const assignTeacherToCourses = async ({ teacherId, courseIds }) => {
  const response = await fetch(`${API_BASE_URL}/teacher/${teacherId}/courses`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ courseIds })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Error al asignar docente a cursos');
  }
  return data;
};

export const getCourseStudents = async (courseId) => {
  const response = await fetch(`${API_BASE_URL}/courses/${courseId}/students`, {
    headers: authHeaders()
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Error al obtener estudiantes del curso');
  }
  return data.students || [];
};

export const updateCourse = async ({ courseId, name }) => {
  const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ name })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Error al actualizar curso');
  }
  return data.course;
};

export const deleteCourse = async (courseId) => {
  const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Error al eliminar curso');
  }
  return data;
};


