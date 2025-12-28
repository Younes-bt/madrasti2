import { useState, useRef } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react'
import { Slider } from '../ui/slider'
import { Button } from '../ui/button'
import { useLesson } from '../../contexts/LessonContext'

export function VideoSection({
  videoUrl,
  title,
  sectionId,
  currentLanguage
}) {
  const { dispatch } = useLesson()
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [muted, setMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const videoRef = useRef(null)
  const isRTL = currentLanguage === 'ar'

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setPlaying(!playing)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)

      // Update progress
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      if (progress >= 80 && sectionId) {
        // Mark video as watched when 80% complete
        dispatch({ type: 'MARK_VIDEO_WATCHED' })
        dispatch({
          type: 'UPDATE_SECTION_PROGRESS',
          payload: { sectionId, progress: 100 }
        })
      }
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (value) => {
    const newTime = (value[0] / 100) * duration
    if (videoRef.current) {
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleVolumeChange = (value) => {
    const newVolume = value[0] / 100
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
      setMuted(newVolume === 0)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted
      setMuted(!muted)
    }
  }

  const handlePlaybackRateChange = (e) => {
    const rate = parseFloat(e.target.value)
    setPlaybackRate(rate)
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        videoRef.current.requestFullscreen()
      }
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🎥</span>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            {title || (isRTL ? 'شاهد الشرح التفصيلي' : 'Watch Detailed Explanation')}
          </h2>
        </div>

        {/* Video Player */}
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video mb-4">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setPlaying(false)}
          />
        </div>

        {/* Custom Controls */}
        <div className="space-y-3">
          {/* Progress Bar */}
          <Slider
            value={[progressPercentage]}
            onValueChange={handleSeek}
            max={100}
            step={0.1}
            className="cursor-pointer"
            aria-label={isRTL ? 'تقدم الفيديو' : 'Video progress'}
          />

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePlayPause}
                aria-label={playing ? (isRTL ? 'إيقاف مؤقت' : 'Pause') : (isRTL ? 'تشغيل' : 'Play')}
              >
                {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>

              {/* Time Display */}
              <span className="text-sm text-neutral-600 dark:text-neutral-400 font-mono" dir="ltr">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Volume */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  aria-label={muted ? (isRTL ? 'إلغاء الكتم' : 'Unmute') : (isRTL ? 'كتم الصوت' : 'Mute')}
                >
                  {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                <Slider
                  value={[muted ? 0 : volume * 100]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  className="w-20 hidden sm:block"
                  aria-label={isRTL ? 'مستوى الصوت' : 'Volume'}
                />
              </div>

              {/* Playback Speed */}
              <select
                value={playbackRate}
                onChange={handlePlaybackRateChange}
                className="text-sm border rounded px-2 py-1 bg-white dark:bg-neutral-800 dark:border-neutral-700"
                aria-label={isRTL ? 'سرعة التشغيل' : 'Playback speed'}
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>

              {/* Fullscreen */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                aria-label={isRTL ? 'ملء الشاشة' : 'Fullscreen'}
              >
                <Maximize className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Helpful Tip */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-2">
          <span className="text-lg">💡</span>
          <p className="text-sm text-blue-900 dark:text-blue-200">
            <strong>{isRTL ? 'نصيحة:' : 'Tip:'}</strong>{' '}
            {isRTL
              ? 'يمكنك تسريع الفيديو إلى 1.5x أو 2x للمراجعة السريعة'
              : 'You can speed up the video to 1.5x or 2x for quick review'
            }
          </p>
        </div>
    </div>
  )
}
