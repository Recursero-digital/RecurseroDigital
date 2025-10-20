import React, { useState, useEffect } from 'react';
import { getCourseStudents } from '../../../infrastructure/adapters/api/teacherApi';
import '../../styles/components/StudentList.css';

const StudentList = ({ courseId, onSelectStudent }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all'); 

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await getCourseStudents(courseId);
        
        if (response.students) {
          setStudents(response.students);
        } else {
          setStudents([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading students:', error);
        setError('Error al cargar la lista de estudiantes');
        setLoading(false);
      }
    };

    if (courseId) {
      fetchStudents();
    }
  }, [courseId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  const getDaysSinceLastActivity = (dateString) => {
    const lastActivity = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - lastActivity);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (daysInactive) => {
    if (daysInactive <= 1) return 'active';
    if (daysInactive <= 3) return 'warning';
    return 'inactive';
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'average';
    return 'needs-improvement';
  };

  const filteredStudents = students.filter(student => {
    const fullName = `${student.name} ${student.lastname}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         student.userName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    const daysInactive = getDaysSinceLastActivity(student.lastActivity);
    
    switch (filterBy) {
      case 'active':
        return daysInactive <= 2;
      case 'inactive':
        return daysInactive > 2;
      default:
        return true;
    }
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return b.averageScore - a.averageScore;
      case 'activity':
        return new Date(b.lastActivity) - new Date(a.lastActivity);
      case 'games':
        return b.totalGamesPlayed - a.totalGamesPlayed;
      default:
        const fullNameA = `${a.name} ${a.lastname}`;
        const fullNameB = `${b.name} ${b.lastname}`;
        return fullNameA.localeCompare(fullNameB);
    }
  });

  if (loading) {
    return (
      <div className="student-list loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando estudiantes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-list error">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="lista-alumno">
      <div className="list-header">
        <h2>👥 Lista de Estudiantes</h2>
        <p>Gestiona y revisa el progreso de tus estudiantes</p>
      </div>

      <div className="list-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar estudiante por nombre o username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-controls">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Ordenar por Nombre</option>
            <option value="score">Ordenar por Promedio</option>
            <option value="activity">Ordenar por Última Actividad</option>
            <option value="games">Ordenar por Juegos Jugados</option>
          </select>

          <select 
            value={filterBy} 
            onChange={(e) => setFilterBy(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos los estudiantes</option>
            <option value="active">Activos (últimos 2 días)</option>
            <option value="inactive">Inactivos (+2 días)</option>
          </select>
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-item">
          <span className="stat-value">{students.length}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {students.filter(s => getDaysSinceLastActivity(s.lastActivity) <= 2).length}
          </span>
          <span className="stat-label">Activos</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {Math.round(students.reduce((acc, s) => acc + s.averageScore, 0) / students.length)}%
          </span>
          <span className="stat-label">Promedio</span>
        </div>
      </div>

      <div className="students-grid">
        {sortedStudents.length === 0 ? (
          <div className="no-students">
            <p>No se encontraron estudiantes con los filtros aplicados</p>
          </div>
        ) : (
          sortedStudents.map((student) => {
            const daysInactive = getDaysSinceLastActivity(student.lastActivity);
            const statusColor = getStatusColor(daysInactive);
            const scoreColor = getScoreColor(student.averageScore);

            return (
              <div 
                key={student.id} 
                className="student-card"
                onClick={() => onSelectStudent && onSelectStudent(student)}
              >
                <div className="student-header">
                  <div className="student-avatar">
                    {`${student.name[0]}${student.lastname[0]}`}
                  </div>
                  <div className="student-info">
                    <h3 className="student-name">{student.name} {student.lastname}</h3>
                    <p className="student-username">@{student.userName}</p>
                    <p className="enrollment-date">
                      Inscrito: {formatDate(student.enrollmentDate)}
                    </p>
                  </div>
                  <div className={`status-indicator ${statusColor}`}>
                    {daysInactive === 0 ? 'Hoy' : 
                     daysInactive === 1 ? 'Ayer' : 
                     `${daysInactive}d`}
                  </div>
                </div>

                <div className="student-stats">
                  <div className="stat-group">
                    <div className="stat">
                      <span className="stat-label">Juegos</span>
                      <span className="stat-value">{student.totalGamesPlayed}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Promedio</span>
                      <span className={`stat-value score-${scoreColor}`}>
                        {student.averageScore}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="games-progress">
                  {Object.entries(student.progressByGame).map(([game, progress]) => {
                    const gameNames = {
                      ordenamiento: 'Ordenamiento',
                      escritura: 'Escritura',
                      descomposicion: 'Descomposición', 
                      escala: 'Escala'
                    };

                    return (
                      <div key={game} className="game-progress">
                        <div className="game-progress-header">
                          <span className="game-name">{gameNames[game]}</span>
                          <span className="game-score">{progress.averageScore}%</span>
                        </div>
                        <div className="game-progress-bar">
                          <div 
                            className={`progress-fill ${game}`}
                            style={{ width: `${Math.min(progress.averageScore, 100)}%` }}
                          ></div>
                        </div>
                        <div className="game-details">
                          <span>{progress.completed} completados</span>
                          <span>{Math.round(progress.totalTime / 60)}min total</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="student-actions">
                  <button className="action-btn view-profile">
                    👤 Ver Perfil
                  </button>
                  <button className="action-btn send-message">
                    💬 Mensaje
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StudentList;