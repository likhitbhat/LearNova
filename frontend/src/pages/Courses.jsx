import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import CourseCard from '../components/CourseCard';

const Courses = () => {
    const [premiumCourses, setPremiumCourses] = useState([]);
    const [discoveredCourses, setDiscoveredCourses] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [discoverLoading, setDiscoverLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);

    // Filtering states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchSubmitted, setSearchSubmitted] = useState(false);

    // Fetch premium courses from internal API
    useEffect(() => {
        const fetchPremium = async () => {
            try {
                const { data } = await api.get('/courses');
                // Always include partner platforms in the catalog
                const dbCourses = Array.isArray(data) ? data : [];
                setPremiumCourses([...dbCourses, ...getFallbackPremium()]);
            } catch (err) {
                console.warn('Could not fetch premium courses:', err.message);
                setPremiumCourses(getFallbackPremium());
            } finally {
                setLoading(false);
            }
        };
        fetchPremium();
    }, []);

    // Fetch discovered YouTube courses from API
    useEffect(() => {
        const fetchDiscovered = async () => {
            try {
                const { data } = await api.get('/discover/trending');
                setDiscoveredCourses(data);
            } catch (err) {
                console.warn('Could not fetch discovered courses:', err.message);
            } finally {
                setDiscoverLoading(false);
            }
        };
        fetchDiscovered();
    }, []);

    // Search YouTube courses
    const handleSearch = useCallback(async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            setSearchSubmitted(false);
            return;
        }
        setSearchLoading(true);
        setSearchSubmitted(true);
        try {
            const { data } = await api.get(`/discover/search?q=${encodeURIComponent(query)}&limit=12`);
            setSearchResults(data);
        } catch (err) {
            console.warn('Search failed:', err.message);
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    }, []);

    // Debounced search on Enter or button click
    const onSearchSubmit = (e) => {
        e.preventDefault();
        handleSearch(searchQuery);
    };

    // Category filter logic
    const filterByCategory = (courses) => {
        if (selectedCategory === 'All') return courses;
        return courses.filter(c => c.category === selectedCategory);
    };

    // Text filter for local filtering
    const filterByText = (courses) => {
        if (!searchQuery.trim() || searchSubmitted) return courses;
        const q = searchQuery.toLowerCase();
        return courses.filter(c =>
            c.title.toLowerCase().includes(q) ||
            c.description?.toLowerCase().includes(q)
        );
    };

    const filteredPremium = filterByCategory(filterByText(premiumCourses));
    const filteredDiscovered = filterByCategory(filterByText(discoveredCourses));

    // All categories from all sources
    const allCategories = ['All', ...new Set([
        ...premiumCourses.map(c => c.category),
        ...discoveredCourses.map(c => c.category),
    ].filter(Boolean))];

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('All');
        setSearchResults([]);
        setSearchSubmitted(false);
    };

    return (
        <div className="min-h-screen py-8" id="courses-page">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Page Header ─────────────────────────── */}
                <div className="text-center mb-10 animate-slide-up">
                    <span className="chip-primary mb-4 inline-block">
                        <span className="material-icons-round text-xs mr-1">explore</span>
                        Course Catalog
                    </span>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-on-surface mb-4 tracking-tight">
                        Master the Art of
                        <span className="block bg-gradient-to-r from-primary-600 to-tertiary-500 bg-clip-text text-transparent">
                            Continuous Discovery.
                        </span>
                    </h1>
                    <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
                        Courses auto-fetched from YouTube, Coursera, Udemy and more — always fresh, always free.
                    </p>
                </div>

                {/* ── Search & Filter Bar ─────────────────── */}
                <form onSubmit={onSearchSubmit} className="card-elevated !rounded-2xl !p-4 mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }} id="search-filter-bar">
                    <div className="flex flex-col md:flex-row gap-3 items-center">
                        {/* Search Input */}
                        <div className="relative flex-1 w-full">
                            <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
                            <input
                                type="text"
                                placeholder="Search the web for any topic (e.g., 'Next.js', 'AI', 'Figma')..."
                                className="input-field !pl-10 !bg-surface-container-low"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    if (!e.target.value.trim()) {
                                        setSearchResults([]);
                                        setSearchSubmitted(false);
                                    }
                                }}
                                id="search-input"
                            />
                        </div>

                        {/* Search Button */}
                        <button
                            type="submit"
                            disabled={searchLoading || !searchQuery.trim()}
                            className="btn-primary text-sm !px-6 !py-3 whitespace-nowrap disabled:opacity-50"
                            id="search-btn"
                        >
                            {searchLoading ? (
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : (
                                <>
                                    <span className="material-icons-round text-sm mr-1">search</span>
                                    Search the Web
                                </>
                            )}
                        </button>

                        {/* Category Selector */}
                        <div className="relative w-full md:w-52">
                            <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg pointer-events-none">filter_list</span>
                            <select
                                className="input-field !pl-10 !bg-surface-container-low appearance-none cursor-pointer"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                id="category-select"
                            >
                                {allCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <span className="material-icons-round absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg pointer-events-none">expand_more</span>
                        </div>
                    </div>

                    {/* Active filters */}
                    {(searchSubmitted || selectedCategory !== 'All') && (
                        <div className="mt-3 flex items-center justify-between">
                            <p className="text-xs text-on-surface-variant">
                                {searchSubmitted && (
                                    <span>Showing results for "<span className="font-semibold text-on-surface">{searchQuery}</span>"</span>
                                )}
                                {selectedCategory !== 'All' && (
                                    <span>{searchSubmitted ? ' · ' : ''}Category: <span className="font-semibold text-on-surface">{selectedCategory}</span></span>
                                )}
                            </p>
                            <button
                                onClick={clearFilters}
                                className="text-xs text-primary-600 font-medium hover:text-primary-700 transition-colors flex items-center gap-1"
                                id="clear-filters"
                            >
                                <span className="material-icons-round text-sm">close</span>
                                Clear
                            </button>
                        </div>
                    )}
                </form>

                {/* ── YouTube Search Results ──────────────── */}
                {searchSubmitted && (
                    <section className="mb-16 animate-slide-up">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-on-surface">Global Search Results</h2>
                            <span className="chip-free text-[10px]">{searchResults.length} found</span>
                        </div>

                        {searchLoading ? (
                            <div className="flex flex-col items-center py-12 gap-3">
                                <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center animate-pulse">
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                    </svg>
                                </div>
                                <p className="text-sm text-on-surface-variant">Searching the web...</p>
                            </div>
                        ) : searchResults.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
                                {searchResults.map((course) => (
                                    <CourseCard key={course._id} course={course} />
                                ))}
                            </div>
                        ) : (
                            <EmptySection message={`No courses found for "${searchQuery}". Try different keywords.`} />
                        )}
                    </section>
                )}

                {/* ── Loading State ───────────────────────── */}
                {(loading || discoverLoading) && !searchSubmitted ? (
                    <div className="flex flex-col justify-center items-center h-64 gap-4" id="loading-spinner">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center animate-pulse">
                            <span className="material-icons-round text-white text-xl">school</span>
                        </div>
                        <p className="text-sm text-on-surface-variant">Loading courses from all platforms...</p>
                    </div>
                ) : !searchSubmitted && (
                    <>
                        {/* ── Premium Courses Section ────────── */}
                        {filteredPremium.length > 0 && (
                            <section className="mb-16 animate-slide-up" style={{ animationDelay: '0.15s' }}>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                                        <span className="material-icons-round text-white text-sm">star</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-on-surface">Partner & Premium Courses</h2>
                                    <span className="chip-primary text-[10px]">{filteredPremium.length}</span>
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
                                    {filteredPremium.map((course) => (
                                        <CourseCard key={course._id} course={course} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ── Auto-Discovered YouTube Courses ── */}
                        <section className="mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-on-surface">Free YouTube Courses</h2>
                                <span className="chip-free text-[10px]">{filteredDiscovered.length} Free</span>
                            </div>
                            <p className="text-sm text-on-surface-variant mb-6 ml-11">
                                Auto-curated playlists from top educators. Updated regularly.
                            </p>

                            {filteredDiscovered.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
                                    {filteredDiscovered.map((course) => (
                                        <CourseCard key={course._id} course={course} />
                                    ))}
                                </div>
                            ) : (
                                <EmptySection message="No YouTube courses match your current filter." />
                            )}
                        </section>

                        {/* ── Explore More CTA ───────────────── */}
                        <section className="mb-16 animate-slide-up" style={{ animationDelay: '0.25s' }}>
                            <div className="card-tonal !rounded-3xl !p-8 md:!p-12 text-center">
                                <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-5">
                                    <span className="material-icons-round text-2xl text-primary-600">travel_explore</span>
                                </div>
                                <h3 className="text-xl font-bold text-on-surface mb-2">Can't find what you need?</h3>
                                <p className="text-sm text-on-surface-variant mb-6 max-w-md mx-auto">
                                    Use the search bar above to find any topic on the internet. Type "Next.js", "Figma design", "Rust programming" — we'll fetch courses instantly!
                                </p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {['Next.js', 'Figma', 'Rust', 'Go lang', 'AWS', 'Blockchain', 'Swift iOS'].map((topic) => (
                                        <button
                                            key={topic}
                                            onClick={() => {
                                                setSearchQuery(topic);
                                                handleSearch(topic);
                                            }}
                                            className="px-4 py-2 rounded-xl text-xs font-medium bg-white text-on-surface-variant hover:bg-primary-50 hover:text-primary-600 transition-all duration-200 shadow-sm"
                                            id={`topic-${topic.replace(/\s/g, '-').toLowerCase()}`}
                                        >
                                            {topic}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
};

const EmptySection = ({ message }) => (
    <div className="card-tonal !rounded-2xl !p-8 text-center">
        <span className="material-icons-round text-3xl text-on-surface-variant/40 mb-3 block">search_off</span>
        <p className="text-sm text-on-surface-variant">{message}</p>
    </div>
);

function getFallbackPremium() {
    return [
        {
            _id: 'partner-1', title: 'The Complete 2024 Web Development Bootcamp',
            description: 'Become a Full-Stack Web Developer with just ONE course. HTML, CSS, Javascript, Node, React, PostgreSQL, Web3 and DApps.',
            category: 'Web Development', price: '94.99',
            instructor: { name: 'Dr. Angela Yu (Udemy)' },
            image: 'https://img-c.udemycdn.com/course/480x270/1565838_e54e_18.jpg',
            externalUrl: 'https://www.udemy.com/course/the-complete-web-development-bootcamp/'
        },
        {
            _id: 'partner-2', title: 'Arjuna JEE 2024',
            description: 'India\'s best batch for class 11th IIT JEE prep. Comprehensive curriculum by top educators covering Physics, Chemistry, and Math.',
            category: 'Test Prep', price: '45.00',
            instructor: { name: 'Alakh Pandey (Physics Wallah)' },
            image: 'https://images.unsplash.com/photo-1632559648982-f59ec92de108?w=800&q=80',
            externalUrl: 'https://www.pw.live/study/batches'
        },
        {
            _id: 'partner-3', title: 'Machine Learning Specialization',
            description: 'Break into AI with DeepLearning.AI. Learn foundational machine learning concepts, built by Andrew Ng.',
            category: 'Machine Learning', price: 'Free to audit',
            instructor: { name: 'Stanford University (Coursera)' },
            image: 'https://images.unsplash.com/photo-1555949963-aa79dcee57d5?w=800&q=80',
            externalUrl: 'https://www.coursera.org/specializations/machine-learning-introduction'
        },
        {
            _id: 'partner-4', title: '100 Days of Code: The Complete Python Pro Bootcamp',
            description: 'Master Python by building 100 projects in 100 days. Learn data science, automation, build websites, games and apps!',
            category: 'Python', price: '89.99',
            instructor: { name: 'Dr. Angela Yu (Udemy)' },
            image: 'https://img-c.udemycdn.com/course/480x270/2776760_f176_10.jpg',
            externalUrl: 'https://www.udemy.com/course/100-days-of-code/'
        },
    ];
}

export default Courses;
