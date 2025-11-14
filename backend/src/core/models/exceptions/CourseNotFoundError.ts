export class CourseNotFoundError extends Error {
  constructor() {
    super('Curso no encontrado');
    this.name = 'CourseNotFoundError';
  }
}


