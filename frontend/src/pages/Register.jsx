import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Scene3D from '../three/Scene3D';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { register, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setMessage('');
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
        } else {
            setLoading(true);
            try {
                await register(name, email, password);
            } catch (err) {
                setMessage(err);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 overflow-hidden" id="register-page">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] pointer-events-none">
                <Scene3D variant="blob" color="#a78bfa" className="opacity-25" />
            </div>

            <div className="w-full max-w-md relative animate-slide-up">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                            <span className="material-icons-round text-white text-xl">auto_awesome</span>
                        </div>
                    </Link>
                    <h1 className="text-3xl font-bold text-on-surface mb-2">Join the Academy</h1>
                    <p className="text-on-surface-variant">Start your journey of continuous discovery.</p>
                </div>

                {/* Card */}
                <div className="card-elevated !p-8 !rounded-3xl">
                    {/* Error Alert */}
                    {message && (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 mb-6 animate-fade-in" id="register-error">
                            <span className="material-icons-round text-error text-lg mt-0.5">error</span>
                            <p className="text-sm text-error font-medium">{message}</p>
                        </div>
                    )}

                    <form onSubmit={submitHandler} className="space-y-4" id="register-form">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-on-surface mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">person</span>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    className="input-field !pl-10"
                                    placeholder="Alex Rivers"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

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
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                                    id="toggle-password-reg"
                                >
                                    <span className="material-icons-round text-lg">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-on-surface mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">lock</span>
                                <input
                                    id="confirm-password"
                                    name="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="input-field !pl-10"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full !py-3.5 text-base !mt-6 disabled:opacity-50"
                            id="register-submit"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating Account...
                                </div>
                            ) : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-on-surface-variant">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors" id="link-to-login">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
