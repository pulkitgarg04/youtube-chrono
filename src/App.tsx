import React, { useState } from "react";

interface Video {
  title: string;
  duration: string;
  formattedDuration: string;
  thumbnail: string;
}

const App: React.FC = () => {
  const [playlistURL, setPlaylistURL] = useState<string>("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [totalDuration, setTotalDuration] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

  const formatDuration = (duration: string): string => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

    if (match) {
      const hours = parseInt(match[1] || "0", 10);
      const minutes = parseInt(match[2] || "0", 10);
      const seconds = parseInt(match[3] || "0", 10);

      return `${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}m ` : ""}${seconds}s`;
    }

    return "0s";
  };

  const fetchPlaylistDetails = async (playlistId: string) => {
    setLoading(true);
    let allVideos: Video[] = [];
    let nextPageToken: string | undefined = "";

    try {
      do {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails,snippet&maxResults=50&playlistId=${playlistId}&pageToken=${nextPageToken}&key=${API_KEY}`
        );

        if (!response.ok) {
          console.error("Failed to fetch playlist items:", response.statusText);
          break;
        }

        const data = await response.json();

        if (!data.items || data.items.length === 0) {
          console.error("No items found in response:", data);
          break;
        }

        nextPageToken = data.nextPageToken;

        const videoIds = data.items
          .map((item: any) => item.contentDetails?.videoId)
          .filter((id: string | undefined) => id)
          .join(",");

        if (!videoIds) {
          console.error("No video IDs found in current page:", data.items);
          continue;
        }

        const videoResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${API_KEY}`
        );

        if (!videoResponse.ok) {
          console.error(
            "Failed to fetch video details:",
            videoResponse.statusText
          );
          break;
        }

        const videoData = await videoResponse.json();

        if (!videoData.items || videoData.items.length === 0) {
          console.error("No video details found in response:", videoData);
          break;
        }

        const fetchedVideos = videoData.items.map((item: any) => ({
          title: item.snippet.title,
          duration: item.contentDetails.duration,
          formattedDuration: formatDuration(item.contentDetails.duration),
          thumbnail: item.snippet.thumbnails.high?.url,
        }));
        allVideos = [...allVideos, ...fetchedVideos];
      } while (nextPageToken);

      setVideos(allVideos);
      calculateTotalDuration(allVideos);
    } catch (error) {
      console.error("Error fetching playlist details:", error);
    }
    setLoading(false);
  };

  const calculateTotalDuration = (videos: Video[]) => {
    let totalSeconds = 0;

    videos.forEach((video) => {
      const match = video.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

      if (match) {
        const hours = parseInt(match[1] || "0", 10);
        const minutes = parseInt(match[2] || "0", 10);
        const seconds = parseInt(match[3] || "0", 10);
        totalSeconds += hours * 3600 + minutes * 60 + seconds;
      }
    });

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    setTotalDuration(`${hours}h ${minutes}m ${seconds}s`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const playlistIdMatch = playlistURL.match(/[&?]list=([^&]+)/);
    if (playlistIdMatch) {
      const playlistId = playlistIdMatch[1];
      fetchPlaylistDetails(playlistId);
    } else {
      alert("Invalid playlist URL");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center bg-[url('https://static.soapcentral.com/editor/2024/09/dc884-17262004042678.jpg')] text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h1 className="text-2xl font-bold text-center mb-4">YouTube Chrono</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter YouTube Playlist URL"
            value={playlistURL}
            onChange={(e) => setPlaylistURL(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-gray-700"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
          >
            {loading ? "Calculating..." : "Calculate"}
          </button>
        </form>
        {totalDuration && (
          <div className="mt-4">
            <h2 className="text-lg font-bold">Total Playlist Duration:</h2>
            <p className="text-blue-500 text-xl">{totalDuration}</p>
          </div>
        )}
        {videos.length > 0 && (
          <div className="mt-4">
            <h2 className="text-lg font-bold">Video Details:</h2>
            <ul className="space-y-4">
              {videos.map((video, index) => (
                <li key={index} className="flex items-center space-x-4 border-b py-2">
                  <img
                    src={video.thumbnail}
                    alt={`${video.title} Thumbnail`}
                    className="w-32 h-20 rounded-lg object-cover"
                  />
                  <div>
                    <div className="font-bold">{video.title}</div>
                    <div className="text-gray-300">{video.formattedDuration}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;