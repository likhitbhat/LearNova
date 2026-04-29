const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, enrollCourse, markCourseComplete, unenrollCourse } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile').get(protect, getUserProfile);
router.post('/enroll', protect, enrollCourse);
router.delete('/enroll/:id', protect, unenrollCourse);
router.put('/enroll/:id/complete', protect, markCourseComplete);
router.put('/enroll/:id/progress', protect, require('../controllers/authController').updateCourseProgress);

module.exports = router;
