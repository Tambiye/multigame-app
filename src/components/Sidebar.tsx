'use client'

import styles from '@/styles/sidebar.module.css'
import { useLayout } from '@/context/LayoutContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  LayoutDashboard,
  Gamepad2,
  User,
  Store,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()
  const { collapsed, toggleSidebar } = useLayout()

  const navItems = [
    { name: 'Games', icon: LayoutDashboard, path: '/' },
    // { name: 'Games', icon: Gamepad2, path: '/games' },
    // { name: 'Profile', icon: User, path: '/profile' },
    // { name: 'Store', icon: Store, path: '/store' },
    // { name: 'Social', icon: Users, path: '/social' },
    // { name: 'Settings', icon: Settings, path: '/settings' }
  ]

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>

      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.logo}>
          🎮 {!collapsed && <span>PLAYCIA</span>}
        </div>

        <button
          type="button"
          onClick={toggleSidebar}
          className={styles.toggleBtn}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* NAV */}
      <nav className={styles.nav}>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.path

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <Icon size={20} />

              {!collapsed && (
                <span className={styles.label}>{item.name}</span>
              )}

              {collapsed && (
                <span className={styles.tooltip}>{item.name}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* BOTTOM */}
      <div className={styles.bottom}>
        {/* <button
          type="button"
          className={`${styles.navItem} ${styles.logout}`}
        >
          <LogOut size={20} />

          {!collapsed && (
            <span className={styles.label}>Log Out</span>
          )}

          {collapsed && (
            <span className={styles.tooltip}>Log Out</span>
          )}
        </button> */}
      </div>

    </aside>
  )
}