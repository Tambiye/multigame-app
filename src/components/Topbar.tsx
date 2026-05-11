'use client'

import NextLink from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Joystick} from 'lucide-react'
import styles from '@/styles/topbar.module.css'

export default function Topbar() {
  const navItems = [{ name: 'Games', icon: Joystick, path: '/' }]
  const pathname = usePathname()

  return (
    <header className={styles.topbar}>
      <div className={styles.inner}>

        {/* LEFT — Logo */}
        <NextLink href="/" className={styles.logoWrap}>
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={500}
            height={500}
            priority
            className={styles.logo}
          />
        </NextLink>

        {/* RIGHT — Nav */}
        <nav className={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path
            return (
              <NextLink
                key={item.name}
                href={item.path}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              >
                <Icon size={20} />
                <span className={styles.navText}>{item.name}</span>
              </NextLink>
            )
          })}
        </nav>

      </div>
    </header>
  )
}