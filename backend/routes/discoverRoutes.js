const express = require('express');
const router = express.Router();
const { searchPlaylists, getTrendingCourses } = require('../services/youtubeService');
const { searchGlobalCourses } = require('../services/globalSearchService');

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

// @desc    Search YouTube and the Web for educational courses
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
        
        // Fetch from both YouTube and Global Web Search simultaneously
        const [youtubeCourses, globalCourses] = await Promise.all([
            searchPlaylists(q, maxResults),
            searchGlobalCourses(q, maxResults)
        ]);
        
        // Interleave the results to make it look mixed (YouTube, Global, YouTube, Global...)
        const combinedCourses = [];
        const maxLength = Math.max(youtubeCourses.length, globalCourses.length);
        
        for (let i = 0; i < maxLength; i++) {
            if (globalCourses[i]) combinedCourses.push(globalCourses[i]);
            if (youtubeCourses[i]) combinedCourses.push(youtubeCourses[i]);
        }

        res.json(combinedCourses);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
