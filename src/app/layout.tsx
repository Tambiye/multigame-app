import '@richaadgigi/stylexui/css/xui.min.css'
import './globals.css'
import '@/styles/utilities.css'

import type { ReactNode } from 'react'

import Topbar from '@/components/Topbar'
// import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'
import Providers from '@/components/Providers'
import { LayoutProvider } from '@/context/LayoutContext' // ✅ ADD THIS

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className="app-shell">

        <Providers>
          <LayoutProvider> {/* ✅ THIS FIXES YOUR ERROR */}

            <div className="dashboard-layout">
              
              {/* <Sidebar /> */}

              <div className="main-area">
                <Topbar />

                <main className="page-content">
                  {children}
                </main>

                <Footer /> {/* ✅ MOVE FOOTER HERE */}
              </div>

            </div>

          </LayoutProvider>
        </Providers>

      </body>
    </html>
  )
}