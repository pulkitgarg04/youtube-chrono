# YouTube Chrono
YouTube Chrono is an online tool that calculates the total duration of a YouTube playlist. Built using React with TypeScript, it utilizes the YouTube Data API to fetch playlist details and video durations.

### Features
- Calculate the total duration of any YouTube playlist.
- Get detailed insights like:
    - Total videos in the playlist.
    - Average video duration.
    - Total duration at different playback speeds (1.25x, 1.5x, 1.75x, 2.0x).
- User-friendly interface with error handling.

### Installation
#### Prerequisites
- Node.js and npm/yarn installed.
- YouTube Data API key.

### Steps
1. Clone this repository:
```bash
git clone https://github.com/pulkitgarg04/YouTube-Chrono.git 
```

2. Navigate to the project folder:
```bash
cd YouTube-Chrono  
Install dependencies:
```

```bash
npm install
```

3. Add your YouTube Data API Key to .env file:
```env
VITE_YOUTUBE_API_KEY=your-api-key-here  
```

4. Start the development server:
```bash
npm run dev  
```

5. Open the app in your browser at http://localhost:5173.

### Usage
1. Paste the link to a YouTube playlist in the input field.
2. Click on Calculate Duration.
3. View the total duration, average duration, and playback times at different speeds.

### Technologies Used
- React (with TypeScript): Frontend framework.
- Tailwind CSS: For styling.
- YouTube Data API: For fetching playlist and video details.

### Environment Variables
You need the following environment variable to run this project:
- `VITE_YOUTUBE_API_KEY`: Your YouTube Data API key.

### Limitations
- API quota limitations may restrict fetching details for large playlists.
- The app processes up to 50 videos in one request due to YouTube API constraints.

### Contributing
We appreciate your interest in contributing to YouTube Chrono! Your contributions help us improve and grow. Please feel free to submit pull requests, report issues, or suggest new features. Your feedback and participation are highly valued as we continue to develop and enhance the platform.

1. Fork the repository.
2. Create a new branch:
```bash
git checkout -b feature-name  
```

3. Commit your changes:
```bash
git commit -m "Add feature name"  
```

4. Push to the branch:
```bash
git push origin feature-name  
```

5. Open a pull request.

### License
This project is licensed under the MIT License - see the LICENSE file for details.