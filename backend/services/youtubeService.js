const axios = require('axios');

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

/**
 * Search YouTube for educational playlists matching a query.
 * Returns an array of normalized course objects.
 */
const searchPlaylists = async (query, maxResults = 12) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey || apiKey === 'YOUR_YOUTUBE_API_KEY_HERE') {
        console.warn('⚠️ YOUTUBE_API_KEY not configured. Returning fallback mock courses for search.');
        return getFallbackForQuery(query);
    }

    try {
        // Step 1: Search for playlists
        const searchRes = await axios.get(`${YOUTUBE_API_BASE}/search`, {
            params: {
                part: 'snippet',
                q: `${query} tutorial course`,
                type: 'playlist',
                maxResults,
                relevanceLanguage: 'en',
                safeSearch: 'strict',
                key: apiKey,
            },
        });

        const items = searchRes.data.items || [];
        if (items.length === 0) return [];

        // Step 2: Get playlist details (item counts)
        const playlistIds = items.map(item => item.id.playlistId).join(',');
        const detailsRes = await axios.get(`${YOUTUBE_API_BASE}/playlists`, {
            params: {
                part: 'contentDetails,snippet',
                id: playlistIds,
                key: apiKey,
            },
        });

        const detailsMap = {};
        (detailsRes.data.items || []).forEach(pl => {
            detailsMap[pl.id] = {
                itemCount: pl.contentDetails.itemCount,
                channelTitle: pl.snippet.channelTitle,
            };
        });

        // Step 3: Normalize into course objects
        return items.map(item => {
            const details = detailsMap[item.id.playlistId] || {};
            return {
                _id: `yt-${item.id.playlistId}`,
                title: item.snippet.title,
                description: item.snippet.description || 'A YouTube educational playlist.',
                category: inferCategory(query),
                price: 0,
                instructor: { name: details.channelTitle || item.snippet.channelTitle },
                image: getBestThumbnail(item.snippet.thumbnails),
                youtubeUrl: `https://www.youtube.com/playlist?list=${item.id.playlistId}`,
                videoCount: details.itemCount || 0,
                source: 'youtube',
            };
        });
    } catch (error) {
        // ponytail: a bad/expired/quota-exhausted key is a config problem, not a request
        // failure — degrade to curated fallback instead of breaking every caller (trending + search).
        if (error.response?.status === 403 || error.response?.status === 400) {
            console.warn(`⚠️ YouTube API key rejected (${error.response.status}: ${error.response.data?.error?.message || 'unknown'}). Returning fallback courses.`);
            return getFallbackForQuery(query);
        }
        throw error;
    }
};

/**
 * Curated fallback courses filtered to loosely match a search query.
 */
function getFallbackForQuery(query) {
    const allFallbacks = getFallbackCourses();
    const lowerQuery = query.toLowerCase();
    const filtered = allFallbacks.filter(c =>
        c.title.toLowerCase().includes(lowerQuery) ||
        c.category.toLowerCase().includes(lowerQuery)
    );
    return filtered.length > 0 ? filtered : allFallbacks.slice(0, 3); // return some so UI doesn't look completely broken
}

/**
 * Get trending / popular educational playlists across multiple categories.
 */
const getTrendingCourses = async () => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey || apiKey === 'YOUR_YOUTUBE_API_KEY_HERE') {
        return getFallbackCourses();
    }

    const categories = [
        'web development',
        'python programming',
        'machine learning',
        'react javascript',
        'data science',
        'ui ux design',
        'cybersecurity',
        'cloud computing AWS',
        'mobile app development',
    ];

    try {
        const results = await Promise.allSettled(
            categories.map(cat => searchPlaylists(cat, 4))
        );

        const allCourses = [];
        const seenIds = new Set();

        results.forEach(result => {
            if (result.status === 'fulfilled') {
                result.value.forEach(course => {
                    if (!seenIds.has(course._id)) {
                        seenIds.add(course._id);
                        allCourses.push(course);
                    }
                });
            }
        });

        return allCourses;
    } catch (error) {
        console.error('Error fetching trending courses:', error.message);
        return getFallbackCourses();
    }
};

/**
 * Infer a course category from the search query.
 */
function inferCategory(query) {
    const q = query.toLowerCase();
    if (q.includes('react') || q.includes('frontend') || q.includes('javascript') || q.includes('web'))
        return 'Web Development';
    if (q.includes('python')) return 'Python';
    if (q.includes('machine learning') || q.includes('ml') || q.includes('ai'))
        return 'Machine Learning';
    if (q.includes('data science') || q.includes('data'))
        return 'Data Science';
    if (q.includes('design') || q.includes('ui') || q.includes('ux'))
        return 'Design';
    if (q.includes('cybersecurity') || q.includes('security'))
        return 'Cybersecurity';
    if (q.includes('cloud') || q.includes('aws') || q.includes('azure'))
        return 'Cloud Computing';
    if (q.includes('mobile') || q.includes('android') || q.includes('ios') || q.includes('flutter'))
        return 'Mobile Development';
    if (q.includes('devops') || q.includes('docker') || q.includes('kubernetes'))
        return 'DevOps';
    return 'Programming';
}

/**
 * Get the best quality thumbnail from a thumbnails object.
 */
function getBestThumbnail(thumbnails) {
    return (
        thumbnails?.maxres?.url ||
        thumbnails?.standard?.url ||
        thumbnails?.high?.url ||
        thumbnails?.medium?.url ||
        thumbnails?.default?.url ||
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'
    );
}

/**
 * Fallback curated course list when API is not available.
 */
function getFallbackCourses() {
    return [
        {
            _id: 'fb-1', title: 'React Tutorial for Beginners',
            description: 'Master React JS with this comprehensive beginner playlist covering components, hooks, routing and more.',
            category: 'Web Development', price: 0, instructor: { name: 'Programming with Mosh' },
            image: 'https://i.ytimg.com/vi/bMknfKXIFA8/hqdefault.jpg',
            youtubeUrl: 'https://www.youtube.com/playlist?list=PLu0W_9lII9agq5Trn9WSUo_P0x5pE47gD',
            videoCount: 30, source: 'youtube',
        },
        {
            _id: 'fb-2', title: 'Complete Web Development Bootcamp',
            description: 'A complete guide to full-stack web development covering HTML, CSS, JavaScript, Node.js and MongoDB.',
            category: 'Web Development', price: 0, instructor: { name: 'CodeWithHarry' },
            image: 'https://i.ytimg.com/vi/F9uVDUGzuOM/hqdefault.jpg',
            youtubeUrl: 'https://www.youtube.com/playlist?list=PLu0W_9lII9ahR1blWXxgSlL4y9iQBnLpR',
            videoCount: 75, source: 'youtube',
        },
        {
            _id: 'fb-3', title: 'Python Tutorial for Absolute Beginners',
            description: 'Start your programming journey with Python. Step-by-step tutorials from basics to intermediate.',
            category: 'Python', price: 0, instructor: { name: 'Corey Schafer' },
            image: 'https://i.ytimg.com/vi/HW29067qVWk/hqdefault.jpg',
            youtubeUrl: 'https://www.youtube.com/playlist?list=PL-osiE80TeTskpqRQzWAlcbceCEEx51ce',
            videoCount: 60, source: 'youtube',
        },
        {
            _id: 'fb-4', title: 'Data Structures and Algorithms in Java',
            description: 'Learn fundamental data structures and critical algorithms step-by-step using Java.',
            category: 'Data Science', price: 0, instructor: { name: 'FreeCodeCamp' },
            image: 'https://i.ytimg.com/vi/8hly31xKli0/hqdefault.jpg',
            youtubeUrl: 'https://youtube.com/playlist?list=PL2eHwL4rL3y1H8sIqE8Rk405Rks5Kj-9Q',
            videoCount: 45, source: 'youtube',
        },
        {
            _id: 'fb-5', title: 'Machine Learning Course for Beginners',
            description: 'An introduction to Machine Learning for complete beginners. Covers algorithms, TensorFlow, and more.',
            category: 'Machine Learning', price: 0, instructor: { name: 'Kylie Ying' },
            image: 'https://i.ytimg.com/vi/f_uwKZIAeM0/hqdefault.jpg',
            youtubeUrl: 'https://youtube.com/playlist?list=PLi_72TqMzq1A3qB1eXwS2-G4B_5cQosEM',
            videoCount: 40, source: 'youtube',
        },
        {
            _id: 'fb-6', title: 'UI/UX Design Full Course',
            description: 'Learn the complete workflow of UI/UX design: user research, wireframing, and Figma prototyping.',
            category: 'Design', price: 0, instructor: { name: 'Envato Tuts+' },
            image: 'https://i.ytimg.com/vi/c9Wg6Cb_YlU/hqdefault.jpg',
            youtubeUrl: 'https://youtube.com/playlist?list=PLmZpdHWJepHXZ_T-Snt7xP0n5vGqIqFzS',
            videoCount: 25, source: 'youtube',
        },
        {
            _id: 'fb-7', title: 'Node.js Tutorial for Beginners',
            description: 'Complete Node.js tutorial from scratch. Build REST APIs, work with databases, and deploy apps.',
            category: 'Web Development', price: 0, instructor: { name: 'Net Ninja' },
            image: 'https://i.ytimg.com/vi/zb3Qk8SG5Ms/hqdefault.jpg',
            youtubeUrl: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9jsz4LDYc6kv3limPmBSoWj',
            videoCount: 36, source: 'youtube',
        },
        {
            _id: 'fb-8', title: 'Git & GitHub Crash Course',
            description: 'Learn Git version control and GitHub from scratch. Essential for every developer.',
            category: 'Programming', price: 0, instructor: { name: 'Traversy Media' },
            image: 'https://i.ytimg.com/vi/SWYqp7iY_Tc/hqdefault.jpg',
            youtubeUrl: 'https://www.youtube.com/playlist?list=PLillGF-RfqbYRpJo_6CoYcIsXnNkvF3kg',
            videoCount: 12, source: 'youtube',
        },
        {
            _id: 'fb-9', title: 'TypeScript Full Course',
            description: 'Learn TypeScript from beginner to advanced. Type safety, generics, decorators and more.',
            category: 'Web Development', price: 0, instructor: { name: 'Academind' },
            image: 'https://i.ytimg.com/vi/BwuLxPH8IDs/hqdefault.jpg',
            youtubeUrl: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9gUgr39Q_yD6v-bSyMwKPUI',
            videoCount: 22, source: 'youtube',
        },
        {
            _id: 'fb-10', title: 'CSS Flexbox & Grid - Complete Guide',
            description: 'Master modern CSS layout with Flexbox and Grid. Build responsive designs like a pro.',
            category: 'Web Development', price: 0, instructor: { name: 'Kevin Powell' },
            image: 'https://i.ytimg.com/vi/rg7Fvvl3taU/hqdefault.jpg',
            youtubeUrl: 'https://www.youtube.com/playlist?list=PL4-IK0AVhVjPv2QFoCP4An21FPuQMbG3M',
            videoCount: 18, source: 'youtube',
        },
        {
            _id: 'fb-11', title: 'Docker for Beginners',
            description: 'Learn Docker containerization from scratch. Build, ship, and run applications anywhere.',
            category: 'DevOps', price: 0, instructor: { name: 'TechWorld with Nana' },
            image: 'https://i.ytimg.com/vi/pg19Z8LL06w/hqdefault.jpg',
            youtubeUrl: 'https://www.youtube.com/playlist?list=PLy7NrYWoggjzfAHlUusx2wuDwfCrmJYcs',
            videoCount: 16, source: 'youtube',
        },
        {
            _id: 'fb-12', title: 'Flutter & Dart - The Complete Guide',
            description: 'Build beautiful mobile apps for iOS and Android with Flutter and Dart programming language.',
            category: 'Mobile Development', price: 0, instructor: { name: 'Academind' },
            image: 'https://i.ytimg.com/vi/x0uinJvhNxI/hqdefault.jpg',
            youtubeUrl: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9jLYyp2Aoh6hcWuxFDX6PBJ',
            videoCount: 35, source: 'youtube',
        },
    ];
}

module.exports = { searchPlaylists, getTrendingCourses, getFallbackCourses };
