import React, { useState } from 'react';
import DashboardStats from '../../components/teacher/DashboardStats';
import '../../styles/pages/teacherStatistics.css';

const TeacherStatistics = () => {
  const [selectedCourse] = useState('1');

  return (
    <div className="teacher-statistics">
      <div className="statistics-header">
        <h1>📊 Estadísticas del Curso</h1>
        <p>Visualiza métricas y análisis detallados del rendimiento del curso</p>
      </div>

      <div className="statistics-content">
        <DashboardStats courseId={selectedCourse} />
      </div>
    </div>
  );
};

export default TeacherStatistics;

