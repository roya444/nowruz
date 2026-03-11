"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserSelection } from "@/lib/types";
import SofrehDisplay from "@/components/SofrehDisplay";
import DownloadButton from "@/components/DownloadButton";
import Link from "next/link";

export default function ViewPage() {
  const router = useRouter();
  const sofrehRef = useRef<HTMLDivElement>(null);
  const [selections, setSelections] = useState<UserSelection[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("sofrehSelections");
    if (stored) {
      setSelections(JSON.parse(stored));
      setLoaded(true);
    } else {
      router.push("/build");
    }
  }, [router]);

  if (!loaded) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading your sofreh...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen pattern-bg px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <p className="text-4xl mb-2">🎉</p>
          <h1 className="text-3xl md:text-4xl font-bold text-charcoal mb-2">
            Your Haftsin
          </h1>
          <p className="text-gray-500">
            Nowruz Mobarak! Here is your personalized Haftsin table.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 overflow-x-auto flex justify-center"
        >
          <SofrehDisplay ref={sofrehRef} selections={selections} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <DownloadButton targetRef={sofrehRef} />
          <button
            disabled
            className="px-6 py-3 bg-gray-200 text-gray-400 rounded-xl font-semibold cursor-not-allowed flex items-center gap-2"
            title="Coming soon"
          >
            📧 Share (Coming Soon)
          </button>
          <Link
            href="/build"
            className="px-6 py-3 border-2 border-spring text-spring rounded-xl font-semibold hover:bg-green-50 transition-colors"
          >
            🔄 Start Over
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
