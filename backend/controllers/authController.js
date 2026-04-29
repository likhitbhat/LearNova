const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'enrolledCourses.courseId',
            populate: {
                path: 'instructor',
                select: 'name'
            }
        });

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                enrolledCourses: user.enrolledCourses,
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Enroll in a course (internal, youtube playlist, or external app link)
// @route   POST /api/auth/enroll
// @access  Private
const enrollCourse = async (req, res, next) => {
    try {
        const { courseId, title, image, youtubeUrl, externalUrl } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Check if already enrolled
        let isEnrolled = false;
        if (courseId) {
            isEnrolled = user.enrolledCourses.some(c => c.courseId && c.courseId.toString() === courseId);
        } else if (youtubeUrl) {
            isEnrolled = user.enrolledCourses.some(c => c.youtubeUrl === youtubeUrl);
        } else if (externalUrl) {
            isEnrolled = user.enrolledCourses.some(c => c.externalUrl === externalUrl);
        }

        if (isEnrolled) {
            res.status(400);
            throw new Error('Already enrolled in this course');
        }

        // Add to enrolled courses
        if (courseId) {
            user.enrolledCourses.push({ courseId });
        } else {
            user.enrolledCourses.push({ title, image, youtubeUrl, externalUrl });
        }

        await user.save();
        res.status(200).json({ message: 'Enrollment successful' });

    } catch (error) {
        next(error);
    }
};

// @desc    Mark a course as complete (set progress to 100%)
// @route   PUT /api/auth/enroll/:id/complete
// @access  Private
const markCourseComplete = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        const enrollmentId = req.params.id;

        // Find the specific enrolled course in the array
        const enrolledCourse = user.enrolledCourses.id(enrollmentId);

        if (!enrolledCourse) {
            res.status(404);
            throw new Error('Enrollment not found');
        }

        enrolledCourse.progress = 100;
        await user.save();

        res.status(200).json({ message: 'Course marked as complete', progress: 100 });

    } catch (error) {
        next(error);
    }
};

// @desc    Update course progress percentage
// @route   PUT /api/auth/enroll/:id/progress
// @access  Private
const updateCourseProgress = async (req, res, next) => {
    try {
        const { progress } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        const enrollmentId = req.params.id;
        const enrolledCourse = user.enrolledCourses.id(enrollmentId);

        if (!enrolledCourse) {
            res.status(404);
            throw new Error('Enrollment not found');
        }

        // Only update if it's actually higher to prevent going backwards
        if (progress > enrolledCourse.progress && progress <= 100) {
            enrolledCourse.progress = progress;
            await user.save();
        }

        res.status(200).json({ message: 'Progress updated', progress: enrolledCourse.progress });
    } catch (error) {
        next(error);
    }
};

// @desc    Remove a course from enrolled list
// @route   DELETE /api/auth/enroll/:id
// @access  Private
const unenrollCourse = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        const enrollmentId = req.params.id;

        // Try to pull by subdocument ID
        const initialLength = user.enrolledCourses.length;
        user.enrolledCourses.pull({ _id: enrollmentId });

        if (user.enrolledCourses.length === initialLength) {
            res.status(404);
            throw new Error('Enrollment not found');
        }

        await user.save();
        res.status(200).json({ message: 'Course removed successfully' });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    enrollCourse,
    markCourseComplete,
    updateCourseProgress,
    unenrollCourse,
};
