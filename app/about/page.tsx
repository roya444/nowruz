"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen pattern-bg flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 border-2 border-amber-100 relative overflow-hidden">
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-gold/20 to-transparent rounded-br-full" />
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-spring/20 to-transparent rounded-tl-full" />

          <div className="text-center mb-8">
            <p className="text-4xl mb-3">🌷</p>
            <h1 className="text-3xl md:text-4xl font-bold text-charcoal">
              What is Nowruz?
            </h1>
          </div>

          <div className="space-y-5 text-gray-700 leading-relaxed">
            <p>
              <strong className="text-spring">Nowruz</strong> (نوروز), meaning
              &ldquo;New Day,&rdquo; is the Persian New Year celebrated on the
              spring equinox — typically around March 20th. With roots going back
              over 3,000 years, it is one of the oldest holidays still observed
              today. Nowruz marks the first day of Farvardin, the first month of
              the Iranian solar calendar, and is celebrated by over 300 million
              people worldwide across Iran, Afghanistan, Central Asia, and the
              diaspora.
            </p>

            <p>
              At the heart of Nowruz celebrations is the{" "}
              <strong className="text-gold">Sofreh Haftsin</strong> (سفره هفت‌سین)
              — a beautifully arranged table featuring seven symbolic items that
              each start with the Persian letter <em>Sīn</em> (س). Each item
              represents a hope or wish for the new year, from health and
              prosperity to love and patience.
            </p>

            <p>
              Families gather around the Haftsin table as the new year arrives,
              often alongside a mirror, candles, painted eggs, a book of poetry
              (typically Hafez), and a bowl of goldfish — each adding layers of
              meaning to this joyful tradition of renewal and togetherness.
            </p>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/build"
              className="px-8 py-4 bg-gradient-to-r from-gold to-amber-500 text-charcoal text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all inline-block"
            >
              Build Your Sofreh 🌿
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
