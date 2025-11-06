import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * MultiverseHelix - DNA-like helical symbol representing multiversal consciousness
 * Two intertwined threads with nodes, creating a living, breathing symbol
 */
export default function MultiverseHelix({ size = 64 }: { size?: number }) {
  const shouldReduceMotion = useReducedMotion()
  const height = size
  const width = size * 0.6 // More vertical aspect ratio
  const centerX = width / 2
  const helixHeight = height * 0.8
  const pitch = helixHeight / 3 // 3 full turns
  const amplitude = width * 0.15
  const nodeRadius = Math.max(1.5, size * 0.03)
  const threadThickness = Math.max(1, size * 0.015)

  // Generate helix path points
  const generateHelixPath = (phase: number, points: number = 50) => {
    let path = ''
    for (let i = 0; i <= points; i++) {
      const t = (i / points) * helixHeight
      const y = t
      const x = centerX + Math.sin((t / pitch) * Math.PI * 2 + phase) * amplitude

      if (i === 0) {
        path += `M ${x} ${y}`
      } else {
        path += ` L ${x} ${y}`
      }
    }
    return path
  }

  // Generate node positions
  const generateNodes = (phase: number, count: number = 8) => {
    const nodes = []
    for (let i = 0; i < count; i++) {
      const t = (i / (count - 1)) * helixHeight
      const y = t
      const x = centerX + Math.sin((t / pitch) * Math.PI * 2 + phase) * amplitude
      nodes.push({ x, y, index: i })
    }
    return nodes
  }

  const helix1Nodes = generateNodes(0)
  const helix2Nodes = generateNodes(Math.PI)

  const helixAnimation = shouldReduceMotion ? {} : {
    rotateY: [0, 360],
    transition: { duration: 30, repeat: Infinity },
  }

  return (
    <motion.svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Multiverse helix symbol"
      animate={helixAnimation}
      style={{ transformStyle: 'preserve-3d' }}
      className="multiverse-helix"
    >
      <defs>
        <linearGradient id="helixGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EADBC8" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#B99AFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#6AD1E3" stopOpacity="0.8" />
        </linearGradient>

        <linearGradient id="helixGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6AD1E3" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#B99AFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#EADBC8" stopOpacity="0.8" />
        </linearGradient>

        <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* First helix thread */}
      <motion.path
        d={generateHelixPath(0)}
        fill="none"
        stroke="url(#helixGradient1)"
        strokeWidth={threadThickness}
        strokeLinecap="round"
        opacity={0.7}
        animate={shouldReduceMotion ? {} : {
          opacity: [0.6, 0.8, 0.6],
          transition: { duration: 12, repeat: Infinity }
        }}
      />

      {/* Second helix thread */}
      <motion.path
        d={generateHelixPath(Math.PI)}
        fill="none"
        stroke="url(#helixGradient2)"
        strokeWidth={threadThickness}
        strokeLinecap="round"
        opacity={0.7}
        animate={shouldReduceMotion ? {} : {
          opacity: [0.6, 0.8, 0.6],
          transition: { duration: 12, delay: 6, repeat: Infinity }
        }}
      />

      {/* Connecting rungs (subtle) */}
      {helix1Nodes.map((node1, i) => {
        const node2 = helix2Nodes[i]
        if (node2) {
          return (
            <motion.line
              key={`rung-${i}`}
              x1={node1.x}
              y1={node1.y}
              x2={node2.x}
              y2={node2.y}
              stroke="#B99AFF"
              strokeWidth={threadThickness * 0.5}
              opacity={0.3}
              animate={shouldReduceMotion ? {} : {
                opacity: [0.2, 0.4, 0.2],
                transition: { duration: 8, delay: i * 0.5, repeat: Infinity }
              }}
            />
          )
        }
        return null
      })}

      {/* Helix 1 nodes */}
      {helix1Nodes.map((node, i) => (
        <motion.circle
          key={`node1-${i}`}
          cx={node.x}
          cy={node.y}
          r={nodeRadius}
          fill="url(#helixGradient1)"
          style={{ filter: 'url(#nodeGlow)' }}
          animate={shouldReduceMotion ? {} : {
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
            transition: { duration: 6, delay: i * 0.8, repeat: Infinity }
          }}
        />
      ))}

      {/* Helix 2 nodes */}
      {helix2Nodes.map((node, i) => (
        <motion.circle
          key={`node2-${i}`}
          cx={node.x}
          cy={node.y}
          r={nodeRadius}
          fill="url(#helixGradient2)"
          style={{ filter: 'url(#nodeGlow)' }}
          animate={shouldReduceMotion ? {} : {
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
            transition: { duration: 6, delay: i * 0.8 + 3, repeat: Infinity }
          }}
        />
      ))}

      {/* Central energy flow */}
      <motion.path
        d={`M ${centerX} 0 L ${centerX} ${helixHeight}`}
        fill="none"
        stroke="#6AD1E3"
        strokeWidth={threadThickness * 0.3}
        opacity={0.4}
        strokeDasharray={`${helixHeight * 0.1} ${helixHeight * 0.05}`}
        animate={shouldReduceMotion ? {} : {
          strokeDashoffset: [0, helixHeight * 0.15],
          transition: { duration: 20, repeat: Infinity }
        }}
      />
    </motion.svg>
  )
}
