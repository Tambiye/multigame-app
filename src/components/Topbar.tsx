'use client'

import { useLayout } from '@/context/LayoutContext'
import { Menu, Search, Globe, CircleUser } from 'lucide-react'
import styles from '@/styles/topbar.module.css'
import { useState } from 'react'

export default function Topbar() {
  const { toggleSidebar } = useLayout()
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className={styles.topbar}>
      <div className={styles.inner}>

        {/* RIGHT */}
        <div className={styles.right}>
          {/* <div className={`${styles.search} ${searchOpen ? styles.open : ''}`}>
            <button
              type="button"
              className={styles.iconBtn}
              aria-label="Open search"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search size={18} />
            </button>

            <input
              type="text"
              placeholder="Search games..."
              className={styles.input}
              aria-label="Search games"
            />
          </div> */}
        </div>

        {/* LEFT */}
        <div className={styles.left}>
          <button
            type="button"
            aria-label="Toggle sidebar"
            className={styles.menuBtn}
            onClick={toggleSidebar}
          >
            <Menu size={20} />
          </button>

          <div className={styles.userSection}>
            {/* PROFILE */}
            {/* <div className={styles.profile}>
              <div className={styles.avatarWrap}>
                <img src="/avatar.png" alt="User avatar" className={styles.avatar} />
                <span className={styles.onlineDot}></span>
              </div>

              <div className={styles.meta}>
                <span className={styles.name}>User</span>

                <div className={styles.progress}>
                  <div className={styles.fill}></div>
                </div>
              </div>
            </div> */}

            {/* LANGUAGE */}
            {/* <div className={`${styles.pill} ${styles.langPill}`}>
              <Globe size={18} className={styles.icon} />

              <select
                className={styles.select}
                aria-label="Select language"
                defaultValue="English"
              >
                <option value="English">English</option>
                <option value="French">French</option>
                <option value="Italian">Italian</option>
              </select>
            </div> */}

            {/* PROFILE BUTTON */}
            {/* <button
              type="button"
              className={`${styles.pill} ${styles.profileBtn}`}
              aria-label="Open user profile"
            >
              <CircleUser size={26} />
            </button> */}
          </div>
        </div>

      </div>
    </header>
  )
}