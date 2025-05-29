import '../styles/globals.css'
import { Reddit_Mono } from 'next/font/google'

const redditMono = Reddit_Mono({ subsets: ['latin'] })

export const metadata = {
  title: 'mulipan',
  description: 'Creative Studio',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={redditMono.className}>
      <body>{children}</body>
    </html>
  )
}
