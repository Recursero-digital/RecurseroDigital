import { GetTeacherCoursesUseCase, GetTeacherCoursesRequest } from "../../../src/core/usecases/GetTeacherCoursesUseCase";
import { TokenService } from "../../../src/core/infrastructure/TokenService";
import { TeacherRepository } from "../../../src/core/infrastructure/TeacherRepository";
import { CourseRepository } from "../../../src/core/infrastructure/CourseRepository";
import { Teacher } from "../../../src/core/models/Teacher";
import { User, UserRole } from "../../../src/core/models/User";
import { Course } from "../../../src/core/models/Course";

class MockTokenService implements TokenService {
  private user: { id: string; username: string; role: string } | null = null;

  setUser(user: { id: string; username: string; role: string } | null): void {
    this.user = user;
  }

  generate(): string {
    return "token";
  }

  verify(): object | null {
    return this.user;
  }

  getUserFromToken(): { id: string; username: string; role: string } | null {
    return this.user;
  }
}

class MockTeacherRepository implements TeacherRepository {
  private teacher: Teacher | null = null;

  setTeacher(teacher: Teacher | null): void {
    this.teacher = teacher;
  }

  async findByUserName(userName: string): Promise<Teacher | null> {
    if (this.teacher && this.teacher.getUsername() === userName) {
      return this.teacher;
    }
    return null;
  }

  async addTeacher(): Promise<void> {
    return;
  }

  async getAllTeachers(): Promise<Teacher[]> {
    return [];
  }

  async findById(): Promise<Teacher | null> {
    return null;
  }

  async updateTeacher(): Promise<void> {
    return;
  }

  async deleteTeacher(): Promise<void> {
    return;
  }
}

class MockCourseRepository implements CourseRepository {
  private courses: Course[] = [];

  setCourses(courses: Course[]): void {
    this.courses = courses;
  }

  async findByCourseName(): Promise<Course | null> {
    return null;
  }

  async addCourse(): Promise<void> {
    return;
  }

  async getAllCourses(): Promise<Course[]> {
    return [];
  }

  async findById(): Promise<Course | null> {
    return null;
  }

  async getEnabledGamesByCourseId(): Promise<any[]> {
    return [];
  }

  async addGameToCourse(): Promise<void> {
    return;
  }

  async createCourse(name: string, teacherId?: string): Promise<Course> {
    return new Course("course-id", name, teacherId || "", []);
  }

  async assignTeacherToCourse(): Promise<void> {
    return;
  }

  async getCoursesByTeacherId(teacherId: string): Promise<Course[]> {
    return this.courses.filter(course => course.teacher_id === teacherId);
  }
}

describe("GetTeacherCoursesUseCase", () => {
  let useCase: GetTeacherCoursesUseCase;
  let tokenService: MockTokenService;
  let teacherRepository: MockTeacherRepository;
  let courseRepository: MockCourseRepository;
  let teacher: Teacher;
  let teacherUser: User;

  beforeEach(() => {
    tokenService = new MockTokenService();
    teacherRepository = new MockTeacherRepository();
    courseRepository = new MockCourseRepository();
    useCase = new GetTeacherCoursesUseCase(tokenService, teacherRepository, courseRepository);
    teacherUser = new User("user-1", "teacher@example.com", "hash", UserRole.TEACHER);
    teacher = new Teacher("teacher-1", "Ana", "Gomez", "teacher@example.com", teacherUser);
  });

  describe("execute", () => {
    it("should return teacher courses", async () => {
      const courses = [
        new Course("course-1", "Curso 1", "teacher-1", []),
        new Course("course-2", "Curso 2", "teacher-1", []),
        new Course("course-3", "Curso 3", "teacher-2", [])
      ];
      courseRepository.setCourses(courses);
      teacherRepository.setTeacher(teacher);
      tokenService.setUser({ id: teacher.id, username: teacher.getUsername(), role: UserRole.TEACHER });

      const request: GetTeacherCoursesRequest = { token: "token" };
      const result = await useCase.execute(request);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("course-1");
      expect(result[1].id).toBe("course-2");
    });

    it("should throw error when token is missing", async () => {
      await expect(useCase.execute({ token: "" })).rejects.toThrow("Token no proporcionado");
    });

    it("should throw error when token is invalid", async () => {
      tokenService.setUser(null);
      await expect(useCase.execute({ token: "token" })).rejects.toThrow("Token inválido");
    });

    it("should throw error when user is not teacher", async () => {
      tokenService.setUser({ id: "student-1", username: "student@example.com", role: UserRole.STUDENT });
      await expect(useCase.execute({ token: "token" })).rejects.toThrow("Usuario no autorizado para esta operación");
    });

    it("should throw error when teacher does not exist", async () => {
      tokenService.setUser({ id: "teacher-1", username: "teacher@example.com", role: UserRole.TEACHER });
      teacherRepository.setTeacher(null);
      await expect(useCase.execute({ token: "token" })).rejects.toThrow("Profesor no encontrado");
    });
  });
});

