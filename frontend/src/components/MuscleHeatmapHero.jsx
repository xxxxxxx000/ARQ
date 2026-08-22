import { useState, useEffect } from 'react'
import BodyMap from './BodyMap.jsx'
import Icon from './Icon.jsx'

const SPLITS = [
  {
    id: 'push',
    name: 'Push Routine',
    desc: 'Chest · Shoulders · Triceps',
    exercises: ['Barbell Bench Press', 'Incline Dumbbell Press', 'Triceps Pushdown', 'Dips'],
    load: { chest: 14, deltoids: 10, triceps: 10, serratus: 4 }
  },
  {
    id: 'pull',
    name: 'Pull Routine',
    desc: 'Lats · Upper Back · Biceps',
    exercises: ['Barbell Deadlift', 'Weighted Pull-Up', 'Barbell Row', 'Biceps Curls'],
    load: { 'upper-back': 14, trapezius: 10, biceps: 10, forearm: 6, 'lower-back': 8 }
  },
  {
    id: 'legs',
    name: 'Legs Routine',
    desc: 'Quads · Hamstrings · Glutes',
    exercises: ['Barbell Squats', 'Romanian Deadlift', 'Leg Press', 'Calf Raises'],
    load: { quadriceps: 14, gluteal: 12, hamstring: 10, calves: 8, 'hip-flexors': 6 }
  },
  {
    id: 'full',
    name: 'Full Body Protocol',
    desc: 'Total Strength & Power',
    exercises: ['Squat', 'Bench Press', 'Deadlift', 'Overhead Press'],
    load: { chest: 8, 'upper-back': 8, quadriceps: 8, gluteal: 8, deltoids: 6, abs: 6, triceps: 5, biceps: 5 }
  }
]

export default function MuscleHeatmapHero() {
  const [activeSplitIdx, setActiveSplitIdx] = useState(0)
  const [activeExIdx, setActiveExIdx] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const current = SPLITS[activeSplitIdx]

  // Auto-cycle splits
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setActiveSplitIdx(prev => (prev + 1) % SPLITS.length)
      setActiveExIdx(0)
    }, 4000)
    return () => clearInterval(timer)
  }, [isPaused])

  // Cycle exercises within the current split
  useEffect(() => {
    const exTimer = setInterval(() => {
      setActiveExIdx(prev => (prev + 1) % current.exercises.length)
    }, 2000)
    return () => clearInterval(exTimer)
  }, [current])

  return (
    <div 
      className="muscle-heatmap-hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Split Header */}
      <div className="heatmap-header-row">
        <div className="heatmap-split-title">
          <span className="live-heat-indicator" />
          <span>{current.name}</span>
        </div>
        <div className="heatmap-split-desc">{current.desc}</div>
      </div>

      {/* Anatomical Heatmap Rendering */}
      <div className="heatmap-map-container">
        <BodyMap load={current.load} body="male" className="hero-bodymap animated-bodymap" />
      </div>

      {/* Live Animated Exercise Ticker */}
      <div className="heatmap-exercise-ticker">
        <Icon name="sparkles" style={{ fontSize: 13, color: 'var(--acc)' }} />
        <span className="ticker-label">Target Movement:</span>
        <span key={activeExIdx} className="ticker-exercise-name">
          {current.exercises[activeExIdx]}
        </span>
      </div>

      {/* Interactive Split Switcher */}
      <div className="heatmap-pill-selector">
        {SPLITS.map((split, idx) => (
          <button
            key={split.id}
            type="button"
            className={`heat-pill-btn ${activeSplitIdx === idx ? 'active' : ''}`}
            onClick={() => {
              setActiveSplitIdx(idx)
              setActiveExIdx(0)
              setIsPaused(true)
            }}
          >
            {split.id.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}