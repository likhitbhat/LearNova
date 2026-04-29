import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import YouTube from 'react-youtube';

const CourseViewer = () => {
    const { id } = useParams(); // this is enrollmentId
    const { user, markComplete, updateProgress } = useContext(AuthContext);
    const navigate = useNavigate();

    const [enrollment, setEnrollment] = useState(null);
    const [videoId, setVideoId] = useState(null);
    const [externalLink, setExternalLink] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const foundEnrollment = user.enrolledCourses?.find(e => e._id === id);
        if (!foundEnrollment) {
            setError('Enrollment not found.');
            return;
        }

        setEnrollment(foundEnrollment);

        // Check if external platform link
        if (foundEnrollment.externalUrl) {
            setExternalLink(foundEnrollment.externalUrl);
            return; // skip youtube handling
        }

        // Determine YouTube URL
        let url = '';
        if (foundEnrollment.youtubeUrl) {
            url = foundEnrollment.youtubeUrl;
        } else if (foundEnrollment.courseId?.youtubeUrl) {
            url = foundEnrollment.courseId.youtubeUrl; // if internal courses have it
        }

        if (url) {
            // Extract video ID from URL
            const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
            const match = url.match(regExp);
            if (match && match[7].length === 11) {
                setVideoId(match[7]);
            } else {
                // Check if it's a playlist
                const listMatch = url.match(/[?&]list=([^#&?]*)/);
                if (listMatch) {
                    setVideoId(`playlist_${listMatch[1]}`);
                } else {
                    setError('Invalid YouTube URL format.');
                }
            }
        } else {
            setError('No video or external URL available. Contact support.');
        }

    }, [id, user, navigate]);

    const handleStateChange = (event) => {
        const player = event.target;
        // YT.PlayerState.ENDED is 0
        if (event.data === 0) {
            if (videoId && videoId.startsWith('playlist_')) {
                const playlist = player.getPlaylist();
                const currentIndex = player.getPlaylistIndex();

                if (playlist && playlist.length > 0) {
                    // Calculate percentage based on 1-indexed video count vs total length
                    const completedVideos = currentIndex + 1;
                    const percent = Math.floor((completedVideos / playlist.length) * 100);

                    // Only update if it's more than current progress
                    if (percent > enrollment.progress) {
                        updateProgress(enrollment._id, percent);
                    }
                }
            } else {
                // Single video reached the end
                updateProgress(enrollment._id, 100);
            }
        }
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4" id="viewer-error">
                <div className="card-elevated !p-10 !rounded-3xl text-center max-w-md animate-slide-up">
                    <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
                        <span className="material-icons-round text-3xl text-error">error</span>
                    </div>
                    <h2 className="text-xl font-bold text-on-surface mb-2">Something went wrong</h2>
                    <p className="text-on-surface-variant text-sm mb-6">{error}</p>
                    <button onClick={() => navigate('/dashboard')} className="btn-primary">
                        <span className="material-icons-round text-lg mr-2">arrow_back</span>
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (!enrollment) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4" id="viewer-loading">
                <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center animate-pulse">
                    <span className="material-icons-round text-white text-xl">play_arrow</span>
                </div>
                <p className="text-sm text-on-surface-variant">Loading course...</p>
            </div>
        );
    }

    const title = enrollment.title || enrollment.courseId?.title || 'Course Video';

    const opts = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 1,
        },
    };

    let renderVideoId = videoId;
    if (videoId && videoId.startsWith('playlist_')) {
        const listId = videoId.replace('playlist_', '');
        renderVideoId = '';
        opts.playerVars.listType = 'playlist';
        opts.playerVars.list = listId;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="course-viewer-page">
            {/* ── Header ─────────────────────────────────── */}
            <div className="flex items-center gap-3 mb-6 animate-slide-up">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all duration-300"
                    id="back-to-dashboard"
                >
                    <span className="material-icons-round">arrow_back</span>
                </button>
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-on-surface line-clamp-1">{title}</h1>
                    <p className="text-xs text-on-surface-variant">
                        {externalLink ? 'External Course' : 'Video Player'}
                    </p>
                </div>
            </div>

            {/* ── Video Player ────────────────────────────── */}
            <div className="rounded-3xl overflow-hidden shadow-ambient-lg mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }} id="video-container">
                {externalLink ? (
                    <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center text-white p-8 text-center relative overflow-hidden">
                        {/* Decorative orbs */}
                        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-primary-500/10 blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-36 h-36 rounded-full bg-secondary-500/10 blur-3xl" />

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-6">
                                <span className="material-icons-round text-4xl text-blue-400">open_in_new</span>
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Hosted on an External Platform</h2>
                            <p className="text-white/60 mb-8 max-w-lg text-sm leading-relaxed">
                                This course content is hosted on another website. Click the button below to open the course in a new tab.
                            </p>
                            <a
                                href={externalLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-3.5 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
                                id="external-link-btn"
                            >
                                <span className="material-icons-round text-lg">launch</span>
                                Go to Course Page
                            </a>
                        </div>
                    </div>
                ) : videoId ? (
                    <div className="aspect-video bg-black relative">
                        <YouTube
                            videoId={renderVideoId}
                            opts={opts}
                            onStateChange={handleStateChange}
                            className="absolute inset-0 w-full h-full"
                            iframeClassName="w-full h-full"
                        />
                    </div>
                ) : (
                    <div className="aspect-video bg-gray-900 flex items-center justify-center">
                        <div className="text-center">
                            <span className="material-icons-round text-4xl text-white/30 mb-3 block">videocam_off</span>
                            <p className="text-white/50 text-sm">Video could not be loaded.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Progress Section ────────────────────────── */}
            <div className="card-elevated !rounded-2xl animate-slide-up" style={{ animationDelay: '0.2s' }} id="progress-section">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            enrollment.progress === 100
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-primary-50 text-primary-600'
                        }`}>
                            <span className="material-icons-round">
                                {enrollment.progress === 100 ? 'check_circle' : 'play_circle'}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-on-surface">Course Progress</h3>
                            <p className="text-xs text-on-surface-variant">
                                {externalLink
                                    ? "Since this is hosted externally, please mark it complete when you finish."
                                    : "Your progress is automatically saved as you watch."}
                            </p>
                        </div>
                    </div>

                    {externalLink && enrollment.progress < 100 ? (
                        <button
                            onClick={() => markComplete(enrollment._id)}
                            className="btn-primary text-sm !py-2.5 flex-shrink-0"
                            id="mark-complete-btn"
                        >
                            <span className="material-icons-round text-sm mr-1.5">done_all</span>
                            Mark as Completed
                        </button>
                    ) : (
                        <div className="flex items-center gap-4 flex-shrink-0">
                            <div className="w-48">
                                <div className="progress-track">
                                    <div
                                        className={enrollment.progress === 100 ? 'progress-bar-success' : 'progress-bar'}
                                        style={{ width: `${enrollment.progress || 0}%` }}
                                    />
                                </div>
                            </div>
                            <span className={`text-sm font-bold whitespace-nowrap ${
                                enrollment.progress === 100 ? 'text-emerald-600' : 'text-on-surface'
                            }`}>
                                {enrollment.progress === 100 ? (
                                    <span className="flex items-center gap-1">
                                        <span className="material-icons-round text-sm">verified</span>
                                        Completed
                                    </span>
                                ) : (
                                    `${enrollment.progress || 0}%`
                                )}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseViewer;
