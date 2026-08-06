import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Video, 
  History, 
  Settings, 
  LogOut, 
  LayoutDashboard,
  Clock,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { auth } from '../lib/firebase';
import { Project } from '../types';
import ClipGenerator from './ClipGenerator';
import ProjectModal from './ProjectModal';

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [view, setView] = useState<'list' | 'create'>('list');
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'projects'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(projs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white p-6 hidden lg:flex flex-col">
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">ClipGenius</span>
        </div>

        <nav className="space-y-1.5 flex-grow">
          <button 
            onClick={() => setView('list')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${view === 'list' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Library
          </button>
          <button 
            onClick={() => setView('create')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${view === 'create' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Plus className="w-4 h-4" /> Create Clips
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 cursor-not-allowed">
            <History className="w-4 h-4" /> Analytics <span className="ml-auto text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded uppercase">Pro</span>
          </button>
        </nav>

        <div className="pt-6 border-t border-slate-100 space-y-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Usage</span>
              <span className="text-[10px] font-bold text-indigo-600">2 / 5 Credits</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-2/5" />
            </div>
          </div>
          <button 
            onClick={() => auth.signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {view === 'list' ? 'Your Projects' : 'New Analysis'}
            </h1>
            <p className="text-slate-500">Welcome back, {auth.currentUser?.displayName || auth.currentUser?.email}</p>
          </div>
          {view === 'list' && (
            <button 
              onClick={() => setView('create')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-200"
            >
              <Plus className="w-5 h-5" /> New Analysis
            </button>
          )}
        </header>

        <AnimatePresence mode="wait">
          {view === 'list' ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid gap-4"
            >
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                  <Video className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900">No projects yet</h3>
                  <p className="text-slate-500 mb-6">Start by analyzing your first video transcript.</p>
                  <button 
                    onClick={() => setView('create')}
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    Create Project →
                  </button>
                </div>
              ) : (
                projects.map((proj) => (
                  <div 
                    key={proj.id} 
                    onClick={() => setSelectedProject(proj)}
                    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-100 p-3 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <Video className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900">{proj.videoTitle}</h3>
                          {proj.status === 'queued' && (
                            <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">
                              Queued
                            </span>
                          )}
                          {proj.status === 'processing' && (
                            <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">
                              Processing
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(proj.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                          {proj.status === 'completed' && (
                            <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-indigo-400" /> {proj.clips.length} Clips</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="create"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ClipGenerator onComplete={() => setView('list')} />
            </motion.div>
          )}
        </AnimatePresence>

        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      </main>
    </div>
  );
}
