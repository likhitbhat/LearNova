import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import Scene3D from '../three/Scene3D';
import useTilt from '../hooks/useTilt';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <SignInPrompt />;
    }

    const enrolledCount = user.enrolledCourses?.length || 0;
    const completedCount = user.enrolledCourses?.filter(c => c.progress === 100).length || 0;
    const avgProgress = enrolledCount > 0
        ? Math.round(user.enrolledCourses.reduce((sum, c) => sum + (c.progress || 0), 0) / enrolledCount)
        : 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="dashboard-page">
            {/* ── Welcome Header ──────────────────────────── */}
            <div className="mb-8 animate-slide-up">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-8 md:p-10">
                    <Scene3D variant="icosahedron" color="#ffffff" className="opacity-15" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                                <span className="text-2xl font-bold text-white">
                                    {user.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                                    Welcome back, {user.name?.split(' ')[0]}!
                                </h1>
                                <p className="text-white/70 text-sm">
                                    {completedCount > 0
                                        ? `You've completed ${completedCount} course${completedCount > 1 ? 's' : ''}. Keep it up!`
                                        : 'Your learning journey starts here.'}
                                </p>
                            </div>
                        </div>

                        <Link to="/courses" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/15 text-white text-sm font-medium hover:bg-white/25 transition-all duration-300 backdrop-blur-sm self-start md:self-auto">
                            <span className="material-icons-round text-lg">explore</span>
                            Explore More
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Stats Row ──────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 stagger-children" id="dashboard-stats">
                {[
                    { icon: 'school', label: 'Courses Enrolled', value: enrolledCount, color: 'bg-primary-50 text-primary-600' },
                    { icon: 'check_circle', label: 'Completed', value: completedCount, color: 'bg-emerald-50 text-emerald-600' },
                    { icon: 'trending_up', label: 'Avg Progress', value: `${avgProgress}%`, color: 'bg-secondary-container text-secondary-600' },
                    { icon: 'emoji_events', label: 'Streak', value: `${Math.min(enrolledCount * 3, 30)}d`, color: 'bg-amber-50 text-amber-600' },
                ].map((stat, i) => (
                    <StatCard key={i} stat={stat} i={i} />
                ))}
            </div>

            {/* ── Enrolled Courses ────────────────────────── */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-on-surface">Your Courses</h2>
                        <p className="text-sm text-on-surface-variant mt-1">Continue where you left off</p>
                    </div>
                    {enrolledCount > 0 && (
                        <span className="chip-primary">
                            {enrolledCount} course{enrolledCount !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>

                {!user.enrolledCourses || user.enrolledCourses.length === 0 ? (
                    <NoCoursesPrompt />
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
                        {user.enrolledCourses.map((enrolled) => {
                            // If it's a database course (populated), it has a .courseId object with ._id
                            if (enrolled.courseId && enrolled.courseId._id) {
                                return (
                                    <CourseCard
                                        key={enrolled._id}
                                        course={enrolled.courseId}
                                        enrollmentId={enrolled._id}
                                        progress={enrolled.progress}
                                    />
                                );
                            }

                            // Otherwise it's an external YouTube playlist
                            const youtubeCourse = {
                                _id: enrolled._id,
                                title: enrolled.title,
                                image: enrolled.image,
                                youtubeUrl: enrolled.youtubeUrl,
                                category: 'YouTube Playlist',
                                price: 0
                            };
                            return (
                                <CourseCard
                                    key={enrolled._id}
                                    course={youtubeCourse}
                                    enrollmentId={enrolled._id}
                                    progress={enrolled.progress}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ stat, i }) => {
    const tilt = useTilt();
    return (
        <div
            ref={tilt.ref}
            onMouseMove={tilt.onMouseMove}
            onMouseLeave={tilt.onMouseLeave}
            style={tilt.style}
            className="card-elevated tilt-card !p-5 text-center"
            id={`stat-${i}`}
        >
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-3`}>
                <span className="material-icons-round text-lg">{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-on-surface">{stat.value}</p>
            <p className="text-xs text-on-surface-variant mt-1">{stat.label}</p>
        </div>
    );
};

const SignInPrompt = () => {
    const tilt = useTilt();
    return (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-80px)] px-4" id="dashboard-login-prompt">
            <div
                ref={tilt.ref}
                onMouseMove={tilt.onMouseMove}
                onMouseLeave={tilt.onMouseLeave}
                style={tilt.style}
                className="card-elevated tilt-card !p-12 !rounded-3xl text-center max-w-md animate-slide-up"
            >
                <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-6">
                    <span className="material-icons-round text-3xl text-primary-600">login</span>
                </div>
                <h2 className="text-2xl font-bold text-on-surface mb-3">Sign in Required</h2>
                <p className="text-on-surface-variant mb-6">Please log in to view your personal dashboard.</p>
                <Link to="/login" className="btn-primary">
                    <span className="material-icons-round text-lg mr-2">arrow_forward</span>
                    Sign In
                </Link>
            </div>
        </div>
    );
};

const NoCoursesPrompt = () => {
    const tilt = useTilt();
    return (
        <div
            ref={tilt.ref}
            onMouseMove={tilt.onMouseMove}
            onMouseLeave={tilt.onMouseLeave}
            style={tilt.style}
            className="card-elevated tilt-card !rounded-3xl !p-12 text-center"
            id="no-courses-prompt"
        >
            <div className="w-20 h-20 rounded-3xl bg-surface-container-high flex items-center justify-center mx-auto mb-6">
                <span className="material-icons-round text-4xl text-on-surface-variant">library_books</span>
            </div>
            <h3 className="text-lg font-semibold text-on-surface mb-2">No courses yet</h3>
            <p className="text-sm text-on-surface-variant mb-6 max-w-sm mx-auto">
                Get started by enrolling in a course. Browse our curated collection and find your path.
            </p>
            <Link to="/courses" className="btn-primary" id="browse-courses-btn">
                <span className="material-icons-round text-lg mr-2">add</span>
                Browse Courses
            </Link>
        </div>
    );
};

export default Dashboard;
