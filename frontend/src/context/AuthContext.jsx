import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            throw error.response?.data?.message || 'Login failed';
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await api.post('/auth/register', { name, email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            throw error.response?.data?.message || 'Registration failed';
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
    };

    const enroll = async (courseData) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await api.post('/auth/enroll', courseData, config);

            // Refresh the user profile to get the updated enrolledCourses list
            const { data } = await api.get('/auth/profile', config);

            // Keep the token since /auth/profile doesn't return it
            const updatedUser = { ...data, token: user.token };
            setUser(updatedUser);
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));

            return true;
        } catch (error) {
            throw error.response?.data?.message || 'Enrollment failed';
        }
    };

    const markComplete = async (enrollmentId) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await api.put(`/auth/enroll/${enrollmentId}/complete`, {}, config);

            // Refresh the user profile to get the updated progress
            const { data } = await api.get('/auth/profile', config);

            const updatedUser = { ...data, token: user.token };
            setUser(updatedUser);
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));

            return true;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to mark as complete';
        }
    };

    const updateProgress = async (enrollmentId, progress) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await api.put(`/auth/enroll/${enrollmentId}/progress`, { progress: Math.min(progress, 100) }, config);

            // Re-fetch user profile to sync the new progress value across the app
            const profileReq = await api.get('/auth/profile', config);

            const updatedUser = { ...profileReq.data, token: user.token };
            setUser(updatedUser);
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));

            return data.progress;
        } catch (error) {
            console.error('Failed to update progress', error);
            // Don't throw loudly here so the video playback isn't interrupted by background sync failures
            return null;
        }
    };

    const unenroll = async (enrollmentId) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await api.delete(`/auth/enroll/${enrollmentId}`, config);

            // Refresh the user profile to get the updated enrolledCourses list
            const { data } = await api.get('/auth/profile', config);

            const updatedUser = { ...data, token: user.token };
            setUser(updatedUser);
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));

            return true;
        } catch (error) {
            throw error.response?.data?.message || 'Unenrollment failed';
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, enroll, unenroll, markComplete, updateProgress, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
