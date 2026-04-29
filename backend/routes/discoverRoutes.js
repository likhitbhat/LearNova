const express = require('express');
const router = express.Router();
const { searchPlaylists, getTrendingCourses } = require('../services/youtubeService');

// @desc    Get trending/popular educational courses from YouTube
// @route   GET /api/discover/trending
// @access  Public
router.get('/trending', async (req, res, next) => {
    try {
        const courses = await getTrendingCourses();
        res.json(courses);
    } catch (error) {
        next(error);
    }
});

// @desc    Search YouTube for educational playlists
// @route   GET /api/discover/search?q=react&limit=12
// @access  Public
router.get('/search', async (req, res, next) => {
    try {
        const { q, limit } = req.query;
        if (!q) {
            res.status(400);
            throw new Error('Search query (q) is required');
        }
        const maxResults = Math.min(parseInt(limit) || 12, 25);
        const courses = await searchPlaylists(q, maxResults);
        res.json(courses);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
