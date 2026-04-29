/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                manrope: ['Manrope', 'system-ui', 'sans-serif'],
            },
            colors: {
                primary: {
                    DEFAULT: '#4a4bd7',
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4a4bd7',
                    700: '#3d3dcb',
                    800: '#3730a3',
                    900: '#312e81',
                    container: '#7073ff',
                    dim: '#3d3dcb',
                },
                secondary: {
                    DEFAULT: '#684cb6',
                    100: '#f3e8ff',
                    200: '#e8ddff',
                    300: '#dbcdff',
                    400: '#c4b5fd',
                    500: '#a78bfa',
                    600: '#684cb6',
                    700: '#5b3fa9',
                    container: '#e8ddff',
                },
                tertiary: {
                    DEFAULT: '#4954bd',
                    400: '#818cf8',
                    500: '#747fea',
                    container: '#818cf8',
                },
                surface: {
                    DEFAULT: '#fcf8fe',
                    bright: '#fcf8fe',
                    dim: '#dbd8e4',
                    container: '#f0ecf6',
                    'container-high': '#eae7f1',
                    'container-highest': '#e4e1ed',
                    'container-low': '#f6f2fb',
                    'container-lowest': '#ffffff',
                },
                'on-surface': '#32323b',
                'on-surface-variant': '#5f5e68',
                outline: '#7b7984',
                'outline-variant': '#b3b0bc',
                error: '#a8364b',
            },
            borderRadius: {
                'xl': '1.25rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
            },
            boxShadow: {
                'ambient': '0 8px 32px rgba(50, 50, 59, 0.06)',
                'ambient-lg': '0 16px 64px rgba(50, 50, 59, 0.06)',
                'glow': '0 0 40px rgba(99, 102, 241, 0.15)',
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #4a4bd7, #7073ff)',
                'gradient-hero': 'linear-gradient(135deg, #4a4bd7 0%, #818cf8 50%, #a78bfa 100%)',
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-out forwards',
                'slide-up': 'slideUp 0.5s ease-out forwards',
                'float': 'float 6s ease-in-out infinite',
                'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '0.6' },
                    '50%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
