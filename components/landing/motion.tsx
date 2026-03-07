'use client'

import { motion, type HTMLMotionProps } from 'framer-motion'
import { type ReactNode } from 'react'

// ─── Fade In on Scroll ───────────────────────────────────────────
interface FadeInProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  distance?: number
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.6,
  direction = 'up',
  distance = 24,
  ...props
}: FadeInProps) {
  const directionMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...directionMap[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// ─── Stagger Container ──────────────────────────────────────────
interface StaggerContainerProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  staggerDelay?: number
  delayStart?: number
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  delayStart = 0,
  ...props
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delayStart,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// ─── Stagger Item ────────────────────────────────────────────────
interface StaggerItemProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  distance?: number
}

export function StaggerItem({
  children,
  direction = 'up',
  distance = 24,
  ...props
}: StaggerItemProps) {
  const directionMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, ...directionMap[direction] },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// ─── Scale on Hover ──────────────────────────────────────────────
interface ScaleOnHoverProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  scale?: number
}

export function ScaleOnHover({
  children,
  scale = 1.02,
  ...props
}: ScaleOnHoverProps) {
  return (
    <motion.div
      whileHover={{ scale, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// ─── Re-export motion for direct use ─────────────────────────────
export { motion, type HTMLMotionProps }
export { AnimatePresence } from 'framer-motion'
