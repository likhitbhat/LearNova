import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';

const CourseCard = ({ course, enrollmentId, progress }) => {
    const { user, enroll, markComplete, unenroll } = useContext(AuthContext);
    const navigate = useNavigate();
    const [enrolling, setEnrolling] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');
    const [completing, setCompleting] = useState(false);

    const handleEnroll = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setEnrolling(true);
        setError('');

        try {
            // Differentiate between database course, youtube playlist, and external web course
            if (course.youtubeUrl) {
                await enroll({
                    title: course.title,
                    image: course.image,
                    youtubeUrl: course.youtubeUrl
                });
            } else if (course.externalUrl) {
                await enroll({
                    title: course.title,
                    image: course.image,
                    externalUrl: course.externalUrl
                });
            } else {
                await enroll({ courseId: course._id });
            }
            navigate('/dashboard');
        } catch (err) {
            setError(typeof err === 'string' ? err : (err.message || 'An error occurred'));
        } finally {
            setEnrolling(false);
        }
    };

    const handleUnenrollClick = () => {
        setShowConfirm(true);
    };

    const confirmUnenroll = async () => {
        if (!enrollmentId) return;

        setShowConfirm(false);
        setRemoving(true);
        setError('');
        try {
            await unenroll(enrollmentId);
        } catch (err) {
            setError(typeof err === 'string' ? err : (err.message || 'An error occurred'));
        } finally {
            setRemoving(false);
        }
    };

    const handleMarkComplete = async () => {
        if (!enrollmentId) return;
        setCompleting(true);
        setError('');
        try {
            await markComplete(enrollmentId);
        } catch (err) {
            setError(typeof err === 'string' ? err : (err.message || 'An error occurred'));
        } finally {
            setCompleting(false);
        }
    };

    const isEnrolledView = enrollmentId !== undefined;
    const isFree = course.price === 0 || !course.price || course.price === 'Free to audit';
    const isCompleted = progress === 100;

    return (
        <>
            <div className="card-elevated group relative overflow-hidden" id={`course-card-${course._id}`}>
                {/* Image Section */}
                <div className="relative -mx-6 -mt-6 mb-5 overflow-hidden rounded-t-2xl">
                    <img
                        className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'}
                        alt={course.title}
                        loading="lazy"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                        {isFree && (
                            <span className="chip-free backdrop-blur-sm !bg-white/90">
                                Free
                            </span>
                        )}
                        {course.youtubeUrl && (
                            <span className="chip backdrop-blur-sm !bg-red-500/90 !text-white">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                </svg>
                                YouTube
                            </span>
                        )}
                        {course.externalUrl && (
                            <span className="chip backdrop-blur-sm !bg-blue-500/90 !text-white">
                                <span className="material-icons-round text-xs mr-1">open_in_new</span>
                                External
                            </span>
                        )}
                    </div>

                    {/* Completed Badge */}
                    {isEnrolledView && isCompleted && (
                        <div className="absolute top-3 right-3">
                            <span className="chip-success backdrop-blur-sm !bg-emerald-500/90 !text-white">
                                <span className="material-icons-round text-xs mr-1">check_circle</span>
                                Completed
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow">
                    {/* Category Chip */}
                    <span className="chip-secondary mb-3 self-start">
                        {course.category}
                    </span>

                    {/* Title */}
                    {isEnrolledView ? (
                        <Link
                            to={`/view-course/${enrollmentId}`}
                            className="text-lg font-semibold text-on-surface hover:text-primary-600 transition-colors duration-200 line-clamp-2 mb-2"
                        >
                            {course.title}
                        </Link>
                    ) : (course.youtubeUrl || course.externalUrl) ? (
                        <button
                            onClick={handleEnroll}
                            disabled={enrolling}
                            className="text-left text-lg font-semibold text-on-surface hover:text-primary-600 transition-colors duration-200 line-clamp-2 mb-2 bg-transparent border-0 p-0 cursor-pointer font-manrope"
                        >
                            {course.title}
                        </button>
                    ) : (
                        <h3 className="text-lg font-semibold text-on-surface line-clamp-2 mb-2">
                            {course.title}
                        </h3>
                    )}

                    {/* Description */}
                    <p className="text-sm text-on-surface-variant line-clamp-2 mb-4 leading-relaxed">
                        {course.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between mb-4">
                        <span className={`text-xl font-bold ${isFree ? 'text-emerald-600' : 'text-on-surface'}`}>
                            {isFree ? 'Free' : `$${course.price}`}
                        </span>
                        <span className="text-xs text-on-surface-variant font-medium">
                            By {course.instructor?.name || 'Learnova'}
                        </span>
                    </div>

                    {/* Error display */}
                    {error && (
                        <div className="mb-3 px-3 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-medium">
                            {error}
                        </div>
                    )}

                    {/* Enrolled View: Progress + Actions */}
                    {isEnrolledView ? (
                        <div className="space-y-3">
                            {/* Progress */}
                            <div className="progress-track">
                                <div
                                    className={isCompleted ? 'progress-bar-success' : 'progress-bar'}
                                    style={{ width: `${progress || 0}%` }}
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-on-surface-variant font-medium">
                                    {progress || 0}% Complete
                                </span>
                                {isCompleted && (
                                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                                        <span className="material-icons-round text-xs">verified</span>
                                        Finished
                                    </span>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <Link
                                to={`/view-course/${enrollmentId}`}
                                className="btn-primary w-full text-center text-sm !py-2.5"
                                id={`watch-course-${course._id}`}
                            >
                                <span className="material-icons-round text-sm mr-1.5">
                                    {isCompleted ? 'replay' : 'play_arrow'}
                                </span>
                                {isCompleted ? 'Watch Again' : 'Continue Learning'}
                            </Link>
                            <button
                                onClick={handleUnenrollClick}
                                disabled={removing}
                                className="w-full text-center px-4 py-2.5 rounded-xl text-sm font-medium text-on-surface-variant hover:text-error hover:bg-red-50 transition-all duration-300 disabled:opacity-50"
                                id={`remove-course-${course._id}`}
                            >
                                {removing ? 'Removing...' : 'Remove from Dashboard'}
                            </button>
                        </div>
                    ) : (
                        /* Enroll Button */
                        <button
                            onClick={handleEnroll}
                            disabled={enrolling}
                            className="btn-primary w-full text-sm !py-2.5 disabled:opacity-50"
                            id={`enroll-btn-${course._id}`}
                        >
                            {enrolling ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Enrolling...
                                </>
                            ) : (
                                <>
                                    <span className="material-icons-round text-sm mr-1.5">add</span>
                                    Enroll Now
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Confirmation Modal - Glassmorphic */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-ambient-lg max-w-sm w-full p-8 text-center" id="unenroll-modal">
                        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
                            <span className="material-icons-round text-3xl text-error">warning</span>
                        </div>
                        <h3 className="text-xl font-bold text-on-surface mb-2">Remove Course?</h3>
                        <p className="text-on-surface-variant mb-6 text-sm leading-relaxed">
                            Are you sure you want to remove "{course.title}" from your dashboard? Your progress will be lost.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="btn-secondary flex-1 text-sm"
                                id="cancel-unenroll"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmUnenroll}
                                className="flex-1 px-4 py-3 rounded-2xl bg-error text-white font-semibold text-sm hover:bg-red-700 transition-all duration-300"
                                id="confirm-unenroll"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CourseCard;
