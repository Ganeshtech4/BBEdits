import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "BBEdits - Professional Video Editing Learning Platform",
  description: "Learn professional video editing with BBEdits LMS. Master Adobe Premiere Pro, After Effects, DaVinci Resolve and more.",
  keywords: "video editing, online courses, BBEdits, premiere pro, after effects, davinci resolve",
  authors: [{ name: "BBEdits" }],
  icons: {
    icon: [
      { url: '/images/anil-logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/anil-logo.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/images/anil-logo.png',
  },
  openGraph: {
    title: "BBEdits - Professional Video Editing Courses",
    description: "Learn professional video editing with expert instructors",
    url: "https://bbedits.in",
    siteName: "BBEdits",
    images: [
      {
        url: '/images/anil-logo.png',
        width: 1200,
        height: 630,
        alt: 'BBEdits Logo',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "BBEdits - Professional Video Editing Courses",
    description: "Learn professional video editing with expert instructors",
    images: ['/images/anil-logo.png'],
  },
};
