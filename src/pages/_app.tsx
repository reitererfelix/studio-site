import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Reddit_Mono } from 'next/font/google';

const redditMono = Reddit_Mono({
  subsets: ['latin'],
  variable: '--font-reddit-mono',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={redditMono.className}>
      <Component {...pageProps} />
    </div>
  )
}
