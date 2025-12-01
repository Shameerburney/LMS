import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipBack, SkipForward } from 'lucide-react';

const VideoPlayer = ({ videoUrl, videoType = 'url', onProgress, onComplete, initialProgress = 0 }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showControls, setShowControls] = useState(true);
    const videoRef = useRef(null);
    const progressRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && initialProgress > 0) {
            videoRef.current.currentTime = initialProgress;
        }
    }, [initialProgress]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const current = videoRef.current.currentTime;
            setCurrentTime(current);

            // Report progress
            if (onProgress && duration > 0) {
                onProgress(current, duration);
            }

            // Check if 90% watched
            if (onComplete && duration > 0 && current / duration >= 0.9) {
                onComplete();
            }
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleProgressClick = (e) => {
        if (progressRef.current && videoRef.current) {
            const rect = progressRef.current.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            videoRef.current.currentTime = pos * duration;
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }
    };

    const changePlaybackRate = (rate) => {
        setPlaybackRate(rate);
        if (videoRef.current) {
            videoRef.current.playbackRate = rate;
        }
    };

    const skip = (seconds) => {
        if (videoRef.current) {
            videoRef.current.currentTime += seconds;
        }
    };

    const toggleFullscreen = () => {
        if (videoRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                videoRef.current.requestFullscreen();
            }
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Render YouTube/Vimeo embed
    if (videoType === 'youtube' || videoType === 'vimeo') {
        const embedUrl = videoType === 'youtube'
            ? `https://www.youtube.com/embed/${videoUrl}?enablejsapi=1`
            : `https://player.vimeo.com/video/${videoUrl}`;

        return (
            <div className="video-player-container">
                <iframe
                    src={embedUrl}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ width: '100%', height: '100%', minHeight: '400px' }}
                />
            </div>
        );
    }

    // Render custom HTML5 player
    return (
        <div
            className="video-player-container"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(isPlaying ? false : true)}
        >
            <video
                ref={videoRef}
                src={videoUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onClick={togglePlay}
                style={{ width: '100%', height: '100%', minHeight: '400px' }}
            />

            {showControls && (
                <div className="video-controls">
                    {/* Progress Bar */}
                    <div
                        ref={progressRef}
                        className="progress-container"
                        onClick={handleProgressClick}
                    >
                        <div
                            className="progress-bar"
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                        />
                    </div>

                    {/* Control Buttons */}
                    <div className="controls-row">
                        <div className="controls-left">
                            <button onClick={togglePlay} className="control-btn">
                                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                            </button>

                            <button onClick={() => skip(-10)} className="control-btn">
                                <SkipBack size={18} />
                            </button>

                            <button onClick={() => skip(10)} className="control-btn">
                                <SkipForward size={18} />
                            </button>

                            <div className="volume-control">
                                <button onClick={toggleMute} className="control-btn">
                                    {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    className="volume-slider"
                                />
                            </div>

                            <span className="time-display">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                        </div>

                        <div className="controls-right">
                            <div className="speed-control">
                                <Settings size={18} />
                                <select
                                    value={playbackRate}
                                    onChange={(e) => changePlaybackRate(parseFloat(e.target.value))}
                                    className="speed-select"
                                >
                                    <option value="0.5">0.5x</option>
                                    <option value="0.75">0.75x</option>
                                    <option value="1">1x</option>
                                    <option value="1.25">1.25x</option>
                                    <option value="1.5">1.5x</option>
                                    <option value="2">2x</option>
                                </select>
                            </div>

                            <button onClick={toggleFullscreen} className="control-btn">
                                <Maximize size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
        .video-player-container {
          position: relative;
          background: #000;
          border-radius: var(--radius-xl);
          overflow: hidden;
        }

        video {
          display: block;
          cursor: pointer;
        }

        .video-controls {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          padding: var(--space-4);
          transition: opacity var(--transition-base);
        }

        .progress-container {
          width: 100%;
          height: 6px;
          background: rgba(255,255,255,0.3);
          border-radius: var(--radius-full);
          cursor: pointer;
          margin-bottom: var(--space-3);
        }

        .progress-bar {
          height: 100%;
          background: var(--primary-500);
          border-radius: var(--radius-full);
          transition: width 0.1s;
        }

        .controls-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .controls-left,
        .controls-right {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .control-btn {
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          padding: var(--space-2);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background var(--transition-fast);
        }

        .control-btn:hover {
          background: rgba(255,255,255,0.2);
        }

        .volume-control {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .volume-slider {
          width: 80px;
          height: 4px;
          -webkit-appearance: none;
          appearance: none;
          background: rgba(255,255,255,0.3);
          border-radius: var(--radius-full);
          outline: none;
        }

        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          background: white;
          border-radius: var(--radius-full);
          cursor: pointer;
        }

        .time-display {
          color: white;
          font-size: var(--text-sm);
          margin-left: var(--space-2);
        }

        .speed-control {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          color: white;
        }

        .speed-select {
          background: rgba(255,255,255,0.2);
          color: white;
          border: none;
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-md);
          cursor: pointer;
          font-size: var(--text-sm);
        }

        .speed-select option {
          background: var(--bg-primary);
          color: var(--text-primary);
        }

        @media (max-width: 640px) {
          .volume-slider {
            display: none;
          }

          .time-display {
            font-size: var(--text-xs);
          }
        }
      `}</style>
        </div>
    );
};

export default VideoPlayer;
