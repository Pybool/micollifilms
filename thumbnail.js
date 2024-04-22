 
const axios = require('axios');

// Function to fetch video details from YouTube Data API
// async function fetchVideoDetails(videoUrl) {
//     try {
//         const videoId = extractVideoId(videoUrl);
//         const apiKey = 'AIzaSyDpXPKWorg5JHrLt5uf__71irp5EvPI-Vo';
//         const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`;

//         const response = await axios.get(apiUrl);
//         return response.data.items[0];
//     } catch (error) {
//         console.error('Error fetching video details:', error);
//         return null;
//     }
// }

async function fetchVideoDetails(videoUrl) {
    try {
        const videoId = extractVideoId(videoUrl);
        const apiKey = 'AIzaSyDpXPKWorg5JHrLt5uf__71irp5EvPI-Vo';
        const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`;

        const response = await axios.get(apiUrl);
        const videoDetails = response.data.items[0];
        
        // Fetch maxres thumbnail if available, otherwise fetch the high-quality thumbnail
        const thumbnailUrl = videoDetails.snippet.thumbnails.maxres ? 
                             videoDetails.snippet.thumbnails.maxres.url : 
                             videoDetails.snippet.thumbnails.high.url;

        return { ...videoDetails, thumbnailUrl };
    } catch (error) {
        console.error('Error fetching video details:', error);
        return null;
    }
}


// Function to extract video ID from YouTube video URL
function extractVideoId(videoUrl) {
    const regex = /[?&]v=([^?&]+)/;
    const match = videoUrl.match(regex);
    return match ? match[1] : null;
}

// Function to generate thumbnail URL from video details
function generateThumbnailUrl(videoDetails) {
    if (videoDetails && videoDetails.snippet) {
        return videoDetails.snippet.thumbnails.medium.url;
    }
    return null;
}

const addThumbNail = (async (embedUrl) => {
    const videoUrl = embedUrl.replace("embed/", "watch?v=")
    const videoDetails = await fetchVideoDetails(videoUrl);
    const thumbnailUrl = generateThumbnailUrl(videoDetails);
    return thumbnailUrl.replace("mqdefault.jpg","maxresdefault.jpg")
});

module.exports = addThumbNail

