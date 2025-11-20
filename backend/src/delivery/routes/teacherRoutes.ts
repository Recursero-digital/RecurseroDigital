import express, { Router } from 'express';
import { teacherController } from '../controllers/TeacherController';
import { protectAdminRoute, protectTeacherRoute, protectTeacherOrAdminRoute } from '../middleware/authMiddleWare';

const router: Router = express.Router();

router.post('/', protectAdminRoute(), teacherController.addTeacher);
router.get('/', protectAdminRoute(), teacherController.getAllTeachers);
router.post('/:teacherId/courses', protectAdminRoute(), teacherController.assignTeacherToCourses);
router.get('/me/courses', protectTeacherOrAdminRoute(), teacherController.getTeacherCourses);
router.get('/me/courses/:courseId', protectTeacherRoute(), teacherController.getMyCourseDetails);

// PATCH /api/teacher/:teacherId
router.patch('/:teacherId', protectAdminRoute(), teacherController.updateTeacher);

// DELETE /api/teacher/:teacherId (baja lógica)
router.delete('/:teacherId', protectAdminRoute(), teacherController.deleteTeacher);

// PATCH /api/teacher/:teacherId/enable (reactivar)
router.patch('/:teacherId/enable', protectAdminRoute(), teacherController.enableTeacher);

export default router;