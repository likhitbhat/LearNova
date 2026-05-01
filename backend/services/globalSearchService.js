const axios = require('axios');

/**
 * Searches the web for courses using Google Search via SerpApi.
 * Targets major educational platforms.
 */
const searchGlobalCourses = async (query, maxResults = 10) => {
    const apiKey = process.env.SERPAPI_KEY;
    
    // If no key is configured, return an empty array so YouTube results can still show
    if (!apiKey || apiKey === 'YOUR_SERPAPI_KEY_HERE') {
        console.warn('⚠️ SERPAPI_KEY not configured. Skipping global web search.');
        return [];
    }

    try {
        // Build the search query targeting specific course domains
        const searchTarget = `${query} course (site:udemy.com OR site:coursera.org OR site:edx.org OR site:pw.live OR site:codecademy.com OR site:skillshare.com)`;
        
        const response = await axios.get('https://serpapi.com/search.json', {
            params: {
                engine: 'google',
                q: searchTarget,
                api_key: apiKey,
                num: maxResults
            }
        });

        const organicResults = response.data.organic_results || [];

        // Map the Google search results to our Course format
        return organicResults.map((result, index) => {
            // Try to extract platform name from the link or source
            let source = 'Web';
            let price = 'Check site';
            
            if (result.link.includes('udemy.com')) source = 'Udemy';
            else if (result.link.includes('coursera.org')) source = 'Coursera';
            else if (result.link.includes('edx.org')) source = 'edX';
            else if (result.link.includes('pw.live')) source = 'Physics Wallah';
            else if (result.link.includes('codecademy.com')) source = 'Codecademy';

            return {
                _id: `global-${Date.now()}-${index}`,
                title: result.title.replace(/\|.*/, '').trim(), // Clean up title tags
                description: result.snippet || `Learn ${query} on ${source}.`,
                category: query,
                price: price,
                instructor: { name: source },
                // Generate a reliable placeholder image since search results usually don't have high-res thumbnails
                image: `https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80`,
                externalUrl: result.link,
                source: source.toLowerCase(),
            };
        });
    } catch (error) {
        console.error('Global search error:', error.message);
        return [];
    }
};

module.exports = { searchGlobalCourses };
