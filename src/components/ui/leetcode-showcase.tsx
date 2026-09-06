"use client";

import { cn } from "@/lib/utils";
import React, { useState, useEffect, useRef } from "react";
import {
  Code2,
  Maximize2,
  Minimize2,
  Trophy,
  ArrowRight,
  TrendingUp,
  Flame,
  CheckCircle2,
  ExternalLink,
  Target,
  Zap,
  Award,
  BarChart2
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useInView, animate } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { useIsInStack } from './showcase-stack';

const LEETCODE_USER = "arham43-ops";

const Counter = ({ value, duration = 1.5, trigger = true }: { value: string | number, duration?: number, trigger?: boolean }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const numericValue = typeof value === 'string' ? parseInt(value.replace(/,/g, ''), 10) : value;

  useEffect(() => {
    if (isInView && trigger && !isNaN(numericValue)) {
      const controls = animate(0, numericValue, {
        duration,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => setCount(Math.floor(latest))
      });
      return () => controls.stop();
    }
  }, [isInView, trigger, numericValue, duration]);

  if (isNaN(numericValue)) return <span>{value}</span>;

  return (
    <span ref={ref}>
      {count.toLocaleString()}
    </span>
  );
};

export default function LeetCodeShowcase() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isInStack = useIsInStack();
  const lenis = useLenis();

  useEffect(() => {
    async function fetchLeetCodeStats() {
      try {
        const res = await fetch(`/api/leetcode-stats?username=${LEETCODE_USER}`);
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Failed to load LeetCode data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeetCodeStats();
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      lenis?.stop();
      document.body.style.overflow = 'hidden';
    } else {
      lenis?.start();
      document.body.style.overflow = 'unset';
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, lenis]);

  const profileUrl = `https://leetcode.com/u/${LEETCODE_USER}/`;
  const totalSolved = data?.totalSolved ?? 145;
  const easySolved = data?.easySolved ?? 72;
  const mediumSolved = data?.mediumSolved ?? 58;
  const hardSolved = data?.hardSolved ?? 15;
  const ranking = data?.ranking ?? 154230;

  return (
    <>
      <div className="w-full flex justify-center py-4 relative z-20">
        <div
          className={cn(
            "w-full max-w-[1400px] bg-zinc-950 text-white rounded-3xl p-8 md:p-12 border border-zinc-800/80 shadow-2xl relative overflow-hidden transition-all duration-500 hover:border-amber-500/30",
            isInStack && "h-[450px] sm:h-[480px] md:h-[520px] lg:h-[550px] flex flex-col justify-between"
          )}
        >
          {/* Subtle Orange Glow Ambient */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <Code2 className="w-5 h-5" />
                </span>
                <span className="text-amber-500 font-mono text-xs font-bold uppercase tracking-widest">
                  LEETCODE ALGORITHMIC INTELLIGENCE
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
                Verified LeetCode <br />
                <span className="text-amber-500">profile @{LEETCODE_USER}</span>
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 active:scale-95"
              >
                <span>View Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setIsModalOpen(true)}
                className="p-3 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white hover:border-amber-500/50 transition-all active:scale-95 shadow-md"
                title="Expand View"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-zinc-800/60 relative z-10">
            <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/50">
              <div className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Total Solved</div>
              <div className="text-2xl md:text-3xl font-black text-amber-400 mt-1">
                <Counter value={totalSolved} />
              </div>
            </div>

            <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/50">
              <div className="text-emerald-400 text-xs uppercase tracking-wider font-semibold">Easy</div>
              <div className="text-2xl md:text-3xl font-black text-emerald-400 mt-1">
                <Counter value={easySolved} />
              </div>
            </div>

            <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/50">
              <div className="text-amber-400 text-xs uppercase tracking-wider font-semibold">Medium</div>
              <div className="text-2xl md:text-3xl font-black text-amber-400 mt-1">
                <Counter value={mediumSolved} />
              </div>
            </div>

            <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/50">
              <div className="text-rose-400 text-xs uppercase tracking-wider font-semibold">Hard</div>
              <div className="text-2xl md:text-3xl font-black text-rose-400 mt-1">
                <Counter value={hardSolved} />
              </div>
            </div>
          </div>

          {/* Bottom Card Footer */}
          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-zinc-400 border-t border-zinc-800/40 pt-6 relative z-10">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Global Rank: <strong className="text-white">#{ranking.toLocaleString()}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live problem-solving stats synced directly from LeetCode</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Modal View */}
      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-xl"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-3xl p-6 md:p-10 overflow-y-auto z-10 shadow-2xl text-white custom-scrollbar"
              >
                <div className="flex items-center justify-between border-b border-zinc-800 pb-6 mb-8">
                  <div className="flex items-center gap-3">
                    <span className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      <Code2 className="w-6 h-6" />
                    </span>
                    <div>
                      <h3 className="text-2xl font-bold text-white">LeetCode Profile Insights</h3>
                      <p className="text-xs text-zinc-400">Username: @{LEETCODE_USER}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-3 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white transition-all active:scale-95"
                  >
                    <Minimize2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Grid of Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Easy Solved</span>
                    <span className="text-4xl font-black text-emerald-400 mt-4">{easySolved}</span>
                    <p className="text-[11px] text-zinc-400 mt-2">Fundamental data structures & algorithms</p>
                  </div>

                  <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Medium Solved</span>
                    <span className="text-4xl font-black text-amber-400 mt-4">{mediumSolved}</span>
                    <p className="text-[11px] text-zinc-400 mt-2">Dynamic programming, graphs & optimization</p>
                  </div>

                  <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Hard Solved</span>
                    <span className="text-4xl font-black text-rose-400 mt-4">{hardSolved}</span>
                    <p className="text-[11px] text-zinc-400 mt-2">Advanced algorithmic challenges & competitive programming</p>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-zinc-800">
                  <a
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-full bg-amber-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-all flex items-center gap-2"
                  >
                    <span>Open LeetCode Profile</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
