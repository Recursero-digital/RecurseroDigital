export class CourseInvalidRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CourseInvalidRequestError';
  }
}


