import { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Scene3D from '../three/Scene3D';
import useTilt from '../hooks/useTilt';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const trustTilt = useTilt();
    const googleBtnRef = useRef(null);

    const { login, googleLogin, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    // Renders Google's own Sign-In button via the Identity Services script.
    // ponytail: no npm package for this — GIS is a two-line native script + button, adding a wrapper lib would be pure overhead.
    useEffect(() => {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (!clientId || user) return;

        const handleCredential = async (response) => {
            setError('');
            try {
                await googleLogin(response.credential);
            } catch (err) {
                setError(err);
            }
        };

        const renderButton = () => {
            window.google.accounts.id.initialize({ client_id: clientId, callback: handleCredential });
            window.google.accounts.id.renderButton(googleBtnRef.current, {
                theme: 'outline', size: 'large', width: 360, text: 'continue_with',
            });
        };

        if (window.google?.accounts?.id) {
            renderButton();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.onload = renderButton;
        document.body.appendChild(script);
        return () => script.remove();
    }, [user, googleLogin]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            // navigation is handled by useEffect
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 overflow-hidden" id="login-page">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] pointer-events-none">
                <Scene3D variant="blob" className="opacity-25" />
            </div>

            <div className="w-full max-w-md relative animate-slide-up">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                            <span className="material-icons-round text-white text-xl">auto_awesome</span>
                        </div>
                    </Link>
                    <h1 className="text-3xl font-bold text-on-surface mb-2">Welcome back</h1>
                    <p className="text-on-surface-variant">Continue your journey of discovery.</p>
                </div>

                {/* Card */}
                <div className="card-elevated !p-8 !rounded-3xl">
                    {/* Error Alert */}
                    {error && (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 mb-6 animate-fade-in" id="login-error">
                            <span className="material-icons-round text-error text-lg mt-0.5">error</span>
                            <p className="text-sm text-error font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={submitHandler} className="space-y-5" id="login-form">
                        <div>
                            <label htmlFor="email-address" className="block text-sm font-medium text-on-surface mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">mail</span>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    required
                                    className="input-field !pl-10"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-on-surface mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">lock</span>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="input-field !pl-10 !pr-10"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                                    id="toggle-password"
                                >
                                    <span className="material-icons-round text-lg">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full !py-3.5 text-base disabled:opacity-50"
                            id="login-submit"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Signing in...
                                </div>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
                        <>
                            <div className="flex items-center gap-3 my-6">
                                <div className="h-px flex-1 bg-outline-variant/30" />
                                <span className="text-xs text-on-surface-variant">or</span>
                                <div className="h-px flex-1 bg-outline-variant/30" />
                            </div>
                            <div ref={googleBtnRef} className="flex justify-center" id="google-login-btn" />
                        </>
                    )}

                    <div className="mt-6 text-center">
                        <p className="text-sm text-on-surface-variant">
                            New to the academy?{' '}
                            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors" id="link-to-register">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Social Proof */}
                <div className="mt-8 text-center">
                    <div
                        ref={trustTilt.ref}
                        onMouseMove={trustTilt.onMouseMove}
                        onMouseLeave={trustTilt.onMouseLeave}
                        style={trustTilt.style}
                        className="card-tonal tilt-card !p-4 !rounded-2xl inline-flex items-center gap-3"
                    >
                        <span className="material-icons-round text-primary-500 text-lg">public</span>
                        <p className="text-sm text-on-surface-variant">
                            <span className="font-semibold text-on-surface">50k+</span> peers worldwide
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
