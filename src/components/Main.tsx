import React, { useState } from "react";

const Main: React.FC = () => {
  const [playlistLink, setPlaylistLink] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [playlistInfo, setPlaylistInfo] = useState<any>(null);

  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

  const formatDuration = (duration: string): number => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (match) {
      const hours = parseInt(match[1] || "0", 10);
      const minutes = parseInt(match[2] || "0", 10);
      const seconds = parseInt(match[3] || "0", 10);
      return hours * 3600 + minutes * 60 + seconds;
    }
    return 0;
  };

  const calculateTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours} hours ${minutes} minutes ${secs} seconds`;
  };

  const fetchPlaylistDetails = async (playlistId: string) => {
    setLoading(true);
    try {
      const playlistResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${API_KEY}`
      );
      const playlistData = await playlistResponse.json();
  
      const playlistTitle = playlistData.items[0]?.snippet?.title || "Untitled Playlist";

      const videoResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails,snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}`
      );
      const videoData = await videoResponse.json();
  
      const videos = videoData.items.map((item: any) => ({
        id: item.contentDetails.videoId,
        title: item.snippet.title,
        creator: item.snippet.channelTitle,
      }));
  
      const totalDurationSeconds = await fetchVideoDurations(videos);
      const averageSeconds = totalDurationSeconds / videos.length;
  
      setPlaylistInfo({
        title: playlistTitle,
        id: playlistId,
        creator: videos[0].creator,
        videoCount: videos.length,
        videoRange: `1 to ${videos.length}`,
        averageDuration: calculateTime(Math.round(averageSeconds)),
        totalDuration: calculateTime(totalDurationSeconds),
        speeds: {
          "1.25x": calculateTime(Math.round(totalDurationSeconds / 1.25)),
          "1.50x": calculateTime(Math.round(totalDurationSeconds / 1.5)),
          "1.75x": calculateTime(Math.round(totalDurationSeconds / 1.75)),
          "2.00x": calculateTime(Math.round(totalDurationSeconds / 2)),
        },
      });
    } catch (error) {
      console.error("Error fetching playlist details:", error);
    }
    setLoading(false);
  };
  

  const fetchVideoDurations = async (videos: any[]) => {
    const videoIds = videos.map((video) => video.id).join(",");
    const videoResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${API_KEY}`
    );
    const videoData = await videoResponse.json();
    return videoData.items.reduce(
      (sum: number, video: any) =>
        sum + formatDuration(video.contentDetails.duration),
      0
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const playlistIdMatch = playlistLink.match(/[&?]list=([^&]+)/);
    if (playlistIdMatch) {
      fetchPlaylistDetails(playlistIdMatch[1]);
    } else {
      alert("Invalid playlist URL");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white pt-16 pb-16">
      <main className="flex-1 flex items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg p-8 bg-white dark:bg-gray-900 rounded-lg shadow-md space-y-6"
        >
          <h1 className="text-2xl font-bold text-center">
            Find the Length of Any YouTube Playlist 🎵
          </h1>

          <label className="block text-gray-700 dark:text-gray-300 font-semibold">
            Enter YouTube Playlist Link
          </label>
          <input
            type="url"
            value={playlistLink}
            onChange={(e) => setPlaylistLink(e.target.value)}
            placeholder="https://www.youtube.com/playlist?list=..."
            className="w-full p-4 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="w-full py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-lg focus:outline-none focus:ring-4 focus:ring-blue-500"
          >
            {loading ? "Calculating..." : "Calculate Duration ⏱️"}
          </button>

          {playlistInfo && (
            <div className="mt-6 space-y-4 text-lg">
              <h2 className="font-bold truncate">Playlist: {playlistInfo.title}</h2>
              <p className="truncate">ID: {playlistInfo.id}</p>
              <p className="truncate">Creator: {playlistInfo.creator}</p>
              <p>
                Video count: {playlistInfo.videoCount} (from{" "}
                {playlistInfo.videoRange}) (0 unavailable)
              </p>
              <p>Average video length: {playlistInfo.averageDuration}</p>
              <p>Total length: {playlistInfo.totalDuration}</p>
              {Object.entries(playlistInfo.speeds).map(([speed, time]) => (
                <p key={speed}>
                  At {speed}: {time}
                </p>
              ))}
            </div>
          )}
        </form>
      </main>
    </div>
  );
};

export default Main;