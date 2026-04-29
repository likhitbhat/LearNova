import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="bg-surface">
            {/* ── Hero Section ────────────────────────────── */}
            <section className="relative overflow-hidden" id="hero-section">
                {/* Background Orbs */}
                <div className="absolute top-20 -left-40 w-[500px] h-[500px] rounded-full bg-primary-200/30 blur-3xl animate-pulse-soft" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-secondary-200/20 blur-3xl animate-pulse-soft" style={{ animationDelay: '1.5s' }} />

                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-36 relative">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left: Content */}
                        <div className="animate-slide-up">
                            <div className="chip-primary mb-6">
                                <span className="material-icons-round text-xs mr-1">bolt</span>
                                The Ethereal Academy
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-on-surface tracking-tight leading-[1.1] mb-6">
                                Upgrade Your
                                <span className="block bg-gradient-to-r from-primary-600 via-primary-500 to-tertiary-500 bg-clip-text text-transparent">
                                    Skills Today.
                                </span>
                            </h1>

                            <p className="text-lg text-on-surface-variant leading-relaxed max-w-lg mb-8">
                                Experience a premium, quiet study hall designed for modern learners. Master complex materials through curated, editorial-style learning paths.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link to="/courses" className="btn-primary text-base !px-8 !py-4" id="hero-explore-btn">
                                    <span className="material-icons-round text-lg mr-2">explore</span>
                                    Explore Courses
                                </Link>
                                {!user && (
                                    <Link to="/register" className="btn-secondary text-base !px-8 !py-4" id="hero-signup-btn">
                                        Get Started Free
                                    </Link>
                                )}
                            </div>

                            {/* Trust Signal */}
                            <div className="flex items-center gap-6 mt-10">
                                <div className="flex -space-x-2">
                                    {['🧑‍💻', '👩‍🎨', '👨‍🔬', '👩‍💼'].map((emoji, i) => (
                                        <div key={i} className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-sm ring-2 ring-surface">
                                            {emoji}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-on-surface">50,000+ learners</p>
                                    <p className="text-xs text-on-surface-variant">already mastering the future</p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Featured Cards */}
                        <div className="relative hidden lg:block" style={{ animationDelay: '0.2s' }}>
                            <div className="animate-slide-up space-y-4">
                                {/* Featured Course Card */}
                                <div className="card-elevated !p-5 !rounded-3xl animate-float">
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                                            <span className="material-icons-round text-white text-2xl">design_services</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-on-surface mb-1">Advanced UI Design</h3>
                                            <p className="text-sm text-on-surface-variant mb-2">Learn editorial layouts & color theory</p>
                                            <div className="progress-track w-32">
                                                <div className="progress-bar" style={{ width: '72%' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Card */}
                                <div className="card-elevated !p-5 !rounded-3xl ml-12" style={{ animationDelay: '1s' }}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                                            <span className="material-icons-round text-emerald-600 text-xl">trending_up</span>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-on-surface">128h</p>
                                            <p className="text-xs text-on-surface-variant">Hours Learned</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Achievement Card */}
                                <div className="card-elevated !p-4 !rounded-3xl mr-8 animate-float" style={{ animationDelay: '3s' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center">
                                            <span className="material-icons-round text-secondary-600">workspace_premium</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-on-surface">Master Learner</p>
                                            <p className="text-xs text-on-surface-variant">Top 5% this month</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Featured Courses Section ────────────────── */}
            <section className="section-tonal py-20" id="featured-courses">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <span className="chip-secondary mb-3 inline-block">Curated</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-on-surface">
                                Featured YouTube Courses
                            </h2>
                            <p className="mt-3 text-on-surface-variant text-lg">
                                Curated playlists to kickstart your learning journey.
                            </p>
                        </div>
                        <Link to="/courses" className="hidden md:flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                            View All
                            <span className="material-icons-round text-lg">arrow_forward</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
                        {[
                            {
                                href: 'https://www.youtube.com/playlist?list=PLu0W_9lII9agq5Trn9WSUo_P0x5pE47gD',
                                img: 'https://i.ytimg.com/vi/bMknfKXIFA8/hqdefault.jpg',
                                title: 'React Tutorial for Beginners',
                                desc: 'Master React JS with this comprehensive beginner playlist. Learn components, hooks, routing and more.',
                                tag: 'Frontend'
                            },
                            {
                                href: 'https://www.youtube.com/playlist?list=PLu0W_9lII9ahR1blWXxgSlL4y9iQBnLpR',
                                img: 'https://i.ytimg.com/vi/F9uVDUGzuOM/hqdefault.jpg',
                                title: 'Complete Web Development Bootcamp',
                                desc: 'A complete guide to full-stack web development covering HTML, CSS, JavaScript, Node.js and MongoDB.',
                                tag: 'Full Stack'
                            },
                            {
                                href: 'https://www.youtube.com/playlist?list=PLu0W_9lII9aikXkRE0WxDt1vozo3hnmtR',
                                img: 'https://i.ytimg.com/vi/ERCGZA6YEYA/hqdefault.jpg',
                                title: 'Python Tutorial for Beginners',
                                desc: 'Start your programming journey with Python. Step-by-step tutorials from basics to intermediate.',
                                tag: 'Python'
                            }
                        ].map((course, i) => (
                            <a
                                key={i}
                                href={course.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="card-elevated group overflow-hidden !p-0"
                                id={`featured-course-${i}`}
                            >
                                <div className="relative overflow-hidden rounded-t-2xl">
                                    <img
                                        src={course.img}
                                        alt={course.title}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                    <div className="absolute top-3 left-3">
                                        <span className="chip backdrop-blur-sm !bg-red-500/90 !text-white text-[10px]">
                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                            </svg>
                                            Playlist
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <span className="chip-secondary text-[10px] mb-3">{course.tag}</span>
                                    <h3 className="text-base font-semibold text-on-surface mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                                        {course.title}
                                    </h3>
                                    <p className="text-sm text-on-surface-variant line-clamp-2 leading-relaxed">{course.desc}</p>
                                </div>
                            </a>
                        ))}
                    </div>

                    <div className="mt-8 text-center md:hidden">
                        <Link to="/courses" className="btn-secondary text-sm">
                            View All Courses
                            <span className="material-icons-round text-lg ml-1">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Why Choose Section ─────────────────────── */}
            <section className="py-20 bg-surface" id="why-choose">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="chip-primary mb-4 inline-block">Why Learnova</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-on-surface">
                            We prioritize cognitive ease over clutter
                        </h2>
                        <p className="mt-4 text-on-surface-variant text-lg max-w-2xl mx-auto">
                            Our platform is built for deep focus and mastery, reducing mental load while increasing retention.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
                        {[
                            {
                                icon: 'psychology',
                                title: 'Cognitive-First Design',
                                desc: 'Our interface adapts to your learning style, reducing mental load and increasing retention of complex topics.',
                                color: 'bg-primary-50 text-primary-600'
                            },
                            {
                                icon: 'groups',
                                title: 'Elite Mentorship',
                                desc: 'Connect directly with industry veterans who provide personalized feedback and guidance on your journey.',
                                color: 'bg-secondary-container text-secondary-600'
                            },
                            {
                                icon: 'all_inclusive',
                                title: 'Infinite Access',
                                desc: 'Enroll once and receive lifetime updates to course material. Your learning never becomes obsolete.',
                                color: 'bg-emerald-50 text-emerald-600'
                            }
                        ].map((feature, i) => (
                            <div key={i} className="card-elevated text-center group !p-8" id={`feature-${i}`}>
                                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                    <span className="material-icons-round text-2xl">{feature.icon}</span>
                                </div>
                                <h3 className="text-lg font-semibold text-on-surface mb-3">{feature.title}</h3>
                                <p className="text-sm text-on-surface-variant leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA Section ────────────────────────────── */}
            <section className="py-20" id="cta-section">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-12 md:p-16 text-center">
                        {/* Decorative orbs */}
                        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 blur-2xl" />

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Join 50,000+ students already mastering the future
                            </h2>
                            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                                The premium digital environment for high-end educational experiences.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link to="/register" className="px-8 py-4 rounded-2xl bg-white text-primary-600 font-semibold hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-lg" id="cta-register">
                                    Start Learning — Free
                                </Link>
                                <Link to="/courses" className="px-8 py-4 rounded-2xl bg-white/15 text-white font-semibold hover:bg-white/25 transition-all duration-300 backdrop-blur-sm" id="cta-courses">
                                    Browse Courses
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
