'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import styles from '@/styles/reaction-game.module.css'

type Score = {
  time: number
  date: string
}

export default function ReactionGame() {
  const [status, setStatus] = useState<
    'idle' | 'waiting' | 'ready' | 'clicked'
  >('idle')

  const [message, setMessage] = useState('Tap to start')
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [coins, setCoins] = useState(0)
  const [streak, setStreak] = useState(0)
  const [leaderboard, setLeaderboard] = useState<Score[]>([])

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    const saved = localStorage.getItem('reaction-scores')

    if (saved) {
      setLeaderboard(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (leaderboard.length > 0) {
      localStorage.setItem(
        'reaction-scores',
        JSON.stringify(leaderboard)
      )
    }
  }, [leaderboard])

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  const startTest = useCallback(() => {
    setStatus('waiting')
    setMessage('Wait for green...')
    setReactionTime(null)

    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    const delay = Math.random() * 3000 + 1500

    timerRef.current = setTimeout(() => {
      setStatus('ready')
      setMessage('⚡ TAP NOW!')
      startTimeRef.current = performance.now()
    }, delay)
  }, [])

  const handleClick = () => {
    if (status === 'idle' || status === 'clicked') {
      startTest()
    } else if (status === 'waiting') {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      setStatus('idle')
      setMessage('Too early! Tap to retry.')
      setStreak(0)
    } else if (status === 'ready') {
      const endTime = performance.now()
      const time = Math.floor(endTime - startTimeRef.current)

      const reward =
        time < 200 ? 50 : time < 300 ? 30 : 10

      const streakBonus = Math.floor(streak / 5) * 10

      setReactionTime(time)
      setCoins((prev) => prev + reward + streakBonus)
      setStreak((prev) => prev + 1)

      const newScore = {
        time,
        date: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }

      setLeaderboard((prev) =>
        [...prev, newScore]
          .sort((a, b) => a.time - b.time)
          .slice(0, 5)
      )

      setStatus('clicked')

      setMessage(
        time < 200
          ? 'GODLIKE ⚡'
          : time < 300
          ? 'Amazing Reflexes 🔥'
          : 'Nice Reflexes 👏'
      )
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <h1>⚡ Reflex Rush</h1>
        <p>Test your reaction speed</p>
      </div>

      <div className={styles.statsPanel}>
        <div className={styles.statItem}>
          <span className={styles.label}>Coins</span>
          <span className={styles.value}>🪙 {coins}</span>
        </div>

        <div className={styles.statItem}>
          <span className={styles.label}>Streak</span>
          <span className={styles.value}>🔥 {streak}</span>
        </div>

        <div className={styles.statItem}>
          <span className={styles.label}>Best</span>
          <span className={styles.value}>
            {leaderboard[0]?.time || '--'} ms
          </span>
        </div>
      </div>

      <div
        className={`${styles.gameBox} ${styles[status]}`}
        onClick={handleClick}
      >
        <div className={styles.content}>
          <h2 className={styles.title}>
            {status === 'ready'
              ? 'CLICK!'
              : status === 'waiting'
              ? 'GET READY'
              : 'REACTION TEST'}
          </h2>

          <p className={styles.message}>{message}</p>

          {reactionTime && (
            <div className={styles.reactionTime}>
              {reactionTime} ms
            </div>
          )}
        </div>
      </div>

      <div className={styles.leaderboardSection}>
        <h3 className={styles.lbTitle}>
          🏆 Top Reactions
        </h3>

        {leaderboard.length === 0 ? (
          <p className={styles.empty}>
            No scores yet
          </p>
        ) : (
          leaderboard.map((score, index) => (
            <div
              key={index}
              className={styles.scoreRow}
            >
              <div className={styles.rank}>
                #{index + 1}
              </div>

              <div className={styles.time}>
                {score.time} ms
              </div>

              <div className={styles.date}>
                {score.date}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}