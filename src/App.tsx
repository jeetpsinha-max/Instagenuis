/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { auth } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import { motion } from 'motion/react';
import { Scissors, Zap, Sparkles, Video, ArrowRight } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  if (showAuth) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Scissors className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">ClipGenius</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowAuth(true)}
            className="text-slate-600 font-semibold hover:text-slate-900 transition-colors"
          >
            Log In
          </button>
          <button 
            onClick={() => setShowAuth(true)}
            className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-8"
          >
            <Sparkles className="w-3 h-3" /> Next-Gen AI Clipping
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]"
          >
            Scale Your <span className="text-indigo-600">Content Empire</span> <br /> 10x Faster with AI
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Automagically transform your long-form videos into high-engagement clips for TikTok, Reels, and Shorts. Built for modern creators.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={() => setShowAuth(true)}
              className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 group"
            >
              Start Creating Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
              Watch Demo
            </button>
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-20 pt-20 border-t border-slate-100"
          >
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Trusted by 500+ Top Creators</p>
            <div className="flex flex-wrap justify-center gap-12 grayscale opacity-40">
              {['CreatorA', 'PodcastX', 'MediaGroup', 'VlogHub'].map((logo) => (
                <span key={logo} className="text-2xl font-black italic">{logo}</span>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Feature Grid */}
        <section className="bg-white py-32 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="bg-indigo-50 w-12 h-12 rounded-2xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Instant Analysis</h3>
                <p className="text-slate-500 leading-relaxed">Our AI processes hours of transcript in seconds, finding the exact moments that will hook your audience.</p>
              </div>
              <div className="space-y-4">
                <div className="bg-amber-50 w-12 h-12 rounded-2xl flex items-center justify-center">
                  <Video className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Platform Optimized</h3>
                <p className="text-slate-500 leading-relaxed">Every clip suggestion includes custom captions and hooks tailored for TikTok, Reels, and YouTube Shorts.</p>
              </div>
              <div className="space-y-4">
                <div className="bg-teal-50 w-12 h-12 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Viral Strategy</h3>
                <p className="text-slate-500 leading-relaxed">Built-in justification tells you exactly why each clip has viral potential based on modern social algorithms.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 text-center text-slate-400 text-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Scissors className="w-4 h-4" />
          <span className="font-bold text-slate-900">ClipGenius AI</span>
        </div>
        <p>&copy; 2026 ClipGenius Technologies Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
