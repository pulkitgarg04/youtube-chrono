import { useState } from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"
import MouseFollower from "./mouse-follower"
import { motion } from "framer-motion"
import AnimatedBackground from "./animated-background"
import Toast from "./toast"
import LoadingSkeleton from "./loading-skeleton"

interface PlaylistInfo {
  title: string
  id: string
  creator: string
  videoCount: number
  videoRange: string
  averageDuration: string
  totalDuration: string
  speeds: {
    "1.25x": string
    "1.50x": string
    "1.75x": string
    "2.00x": string
  }
}

export default function Home() {
  const [playlistLink, setPlaylistLink] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [playlistInfo, setPlaylistInfo] = useState<PlaylistInfo | null>(null)
  const [error, setError] = useState<string>("")
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info"; visible: boolean }>({
    message: "",
    type: "info",
    visible: false,
  })

  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY

  const formatDuration = (duration: string): number => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    if (match) {
      const hours = Number.parseInt(match[1] || "0", 10)
      const minutes = Number.parseInt(match[2] || "0", 10)
      const seconds = Number.parseInt(match[3] || "0", 10)
      return hours * 3600 + minutes * 60 + seconds
    }
    return 0
  }

  const calculateTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours} hours ${minutes} minutes ${secs} seconds`
  }

  const fetchPlaylistDetails = async (playlistId: string) => {
    setLoading(true)
    setError("")
    try {
      const playlistResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${API_KEY}`,
      )
      const playlistData = await playlistResponse.json()

      if (playlistData.items?.length === 0) {
        setError("Playlist not found or invalid.")
        setLoading(false)
        return
      }

      const playlistTitle = playlistData.items?.[0]?.snippet?.title || "Untitled Playlist"

      const videoResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails,snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}`,
      )
      const videoData = await videoResponse.json()

      interface VideoItem {
        contentDetails: {
          videoId: string;
        };
        snippet: {
          title: string;
          channelTitle: string;
        };
      }

      const videos = videoData.items.map((item: VideoItem) => ({
        id: item.contentDetails.videoId,
        title: item.snippet.title,
        creator: item.snippet.channelTitle,
      }))

      const totalDurationSeconds = await fetchVideoDurations(videos)
      const averageSeconds = totalDurationSeconds / videos.length

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
      })
      setToast({
        message: `Successfully calculated duration for "${playlistTitle}"`,
        type: "success",
        visible: true,
      })
    } catch (error) {
      console.error("Error fetching playlist details:", error)
      setError("An error occurred while fetching the playlist details.")
      setToast({
        message: "Failed to fetch playlist details. Please check the URL and try again.",
        type: "error",
        visible: true,
      })
    }
    setLoading(false)
  }

  interface Video {
    id: string;
    title: string;
    creator: string;
  }

  const fetchVideoDurations = async (videos: Video[]) => {
    const videoIds = videos.map((video) => video.id).join(",")
    const videoResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${API_KEY}`,
    )
    const videoData = await videoResponse.json()
    interface VideoDetails {
      contentDetails: {
        duration: string;
      };
    }

    return videoData.items.reduce((sum: number, video: VideoDetails) => sum + formatDuration(video.contentDetails.duration), 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const playlistIdMatch = playlistLink.match(/[&?]list=([^&]+)/)
    if (playlistIdMatch) {
      fetchPlaylistDetails(playlistIdMatch[1])
    } else {
      setError("Invalid playlist URL.")
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-zinc-200">
      <MouseFollower />
      <AnimatedBackground />
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg"
        >
          <motion.form
            onSubmit={handleSubmit}
            className="w-full p-8 bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800 shadow-xl space-y-6"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h1
              className="text-2xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Find the Length of Any YouTube Playlist 🎵
            </motion.h1>

            <div className="space-y-2">
              <label className="block text-zinc-400 font-medium text-sm">Enter YouTube Playlist Link</label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="url"
                value={playlistLink}
                onChange={(e) => setPlaylistLink(e.target.value)}
                placeholder="https://www.youtube.com/playlist?list=..."
                className="w-full p-4 text-zinc-200 bg-zinc-800/50 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <motion.button
              type="submit"
              className="glow-element w-full py-3 text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg font-semibold text-lg focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Calculating...
                </span>
              ) : (
                "Calculate Duration ⏱️"
              )}
            </motion.button>

            {error && (
              <motion.p
                className="text-red-400 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.p>
            )}

            {loading ? (
              <LoadingSkeleton />
            ) : (
              playlistInfo &&
              !error && (
                <motion.div
                  className="mt-6 space-y-4 text-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="space-y-3 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                    <h2 className="font-bold truncate text-xl bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                      {playlistInfo.title}
                    </h2>
                    <p className="truncate text-sm text-zinc-400">ID: {playlistInfo.id}</p>
                    <p className="truncate text-sm text-zinc-400">Creator: {playlistInfo.creator}</p>

                    <div className="pt-2 border-t border-zinc-700">
                      <p className="text-sm">
                        <span className="text-zinc-400">Video count:</span> {playlistInfo.videoCount} (from{" "}
                        {playlistInfo.videoRange}) (0 unavailable)
                      </p>
                      <p className="text-sm">
                        <span className="text-zinc-400">Average video length:</span> {playlistInfo.averageDuration}
                      </p>
                      <p className="text-sm font-medium">
                        <span className="text-zinc-400">Total length:</span>{" "}
                        <span className="text-purple-400">{playlistInfo.totalDuration}</span>
                      </p>
                    </div>

                    <div className="pt-2 border-t border-zinc-700 grid grid-cols-2 gap-2">
                      {Object.entries(playlistInfo.speeds).map(([speed, time], index) => (
                        <motion.p
                          key={speed}
                          className="text-sm"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index, duration: 0.3 }}
                        >
                          <span className="text-zinc-400">At {speed}:</span> {time}
                        </motion.p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            )}
          </motion.form>
        </motion.div>
      </main>
      <Footer />
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </div>
  )
}