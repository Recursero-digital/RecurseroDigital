import React, { useState } from "react";
import "../../styles/pages/addUserForm.css";
import "../../styles/pages/addUserForm.css";

export default function AddUserForm({
  onClose,
  onSubmit,
  userType = "student",
}) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    username: "",
    password: "",
    dni: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  // Determinar si es estudiante
  const isStudent = userType === "estudiante" || userType === "student";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es requerido";
    }

    if (!formData.username.trim()) {
      newErrors.username = "El username es requerido";
    }

    // Solo validar password y DNI para estudiantes

    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    if (isStudent) {
      if (!formData.dni.trim()) {
        newErrors.dni = "El DNI es requerido";
      } else if (!/^\d{8}$/.test(formData.dni)) {
        newErrors.dni = "El DNI debe tener 8 dígitos";
      }
    } else {
      // Validar email para docentes
      if (!formData.email.trim()) {
        newErrors.email = "El email es requerido";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "El email no tiene un formato válido";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Preparar datos según el tipo de usuario
      const userData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        username: formData.username,
        password: formData.password,
        userType,
      };

      // Solo agregar DNI para estudiantes
      if (isStudent) {
        userData.dni = formData.dni;
      } else {
        // Para docentes, agregar email
        userData.email = formData.email;
      }

      onSubmit(userData);

      // Limpiar formulario
      setFormData({
        nombre: "",
        apellido: "",
        username: "",
        password: "",
        dni: "",
        email: "",
      });
      onClose();
    }
  };

  return (
    <div className="add-user-overlay">
      <div className="add-user-modal">
        <div className="modal-header">
          <h2>Agregar {isStudent ? "Estudiante" : "Docente"}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={errors.nombre ? "error" : ""}
              placeholder="Ingrese el nombre"
            />
            {errors.nombre && (
              <span className="error-message">{errors.nombre}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="apellido">Apellido *</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              className={errors.apellido ? "error" : ""}
              placeholder="Ingrese el apellido"
            />
            {errors.apellido && (
              <span className="error-message">{errors.apellido}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? "error" : ""}
              placeholder="Ingrese el username"
            />
            {errors.username && (
              <span className="error-message">{errors.username}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
              placeholder="Ingrese la contraseña"
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {/* Solo mostrar DNI para estudiantes, email para docentes */}
          {isStudent ? (
            <div className="form-group">
              <label htmlFor="dni">DNI *</label>
              <input
                type="text"
                id="dni"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                className={errors.dni ? "error" : ""}
                placeholder="Ingrese el DNI (8 dígitos)"
                maxLength="8"
              />
              {errors.dni && (
                <span className="error-message">{errors.dni}</span>
              )}
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "error" : ""}
                placeholder="Ingrese el email"
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>
          )}

          <div className="form-buttons">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="submit-btn">
              Agregar {isStudent ? "Estudiante" : "Docente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
