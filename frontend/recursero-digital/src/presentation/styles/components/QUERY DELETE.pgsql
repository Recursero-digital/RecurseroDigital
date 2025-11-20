DELETE FROM users WHERE id IN (
SELECT users.id from users left join students on users.id = students.user_id WHERE students.user_id IS NULL AND users.role = 'STUDENT');