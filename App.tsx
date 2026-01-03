
import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars, ContactShadows } from '@react-three/drei';
import { ScienceModule } from './types';
import { MODULES } from './constants';
import { ScienceSimulation } from './components/SimulationModels';
import { Instructor } from './components/Instructor';
import { speakText } from './services/geminiService';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ScienceModule>(ScienceModule.ATOM);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [points, setPoints] = useState(0);
  const [completedModules, setCompletedModules] = useState<Set<ScienceModule>>(new Set());
  
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<{ correct: boolean; message: string } | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const currentAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const moduleData = MODULES[activeModule];

  useEffect(() => {
    // Reset state when switching modules
    if (currentAudioSourceRef.current) {
      try { currentAudioSourceRef.current.stop(); } catch(e) {}
      currentAudioSourceRef.current = null;
    }
    setIsSpeaking(false);
    setShowQuiz(false);
  }, [activeModule]);

  const handleStartLecture = async () => {
    // If already speaking, stop and restart or just return
    if (isSpeaking) return;

    if (currentAudioSourceRef.current) {
      try { currentAudioSourceRef.current.stop(); } catch (e) {}
      currentAudioSourceRef.current = null;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    // Set speaking to TRUE to bring in the Instructor
    setIsSpeaking(true);
    
    // Call Gemini TTS Service
    const source = await speakText(moduleData.lectureText, audioContextRef.current);
    
    if (source) {
      currentAudioSourceRef.current = source;
      source.onended = () => {
        // Wait a small moment before dismissing instructor and showing quiz
        setTimeout(() => {
          setIsSpeaking(false);
          currentAudioSourceRef.current = null;
          setShowQuiz(true);
        }, 1200);
      };
    } else {
      // Fallback if TTS fails
      setIsSpeaking(false);
      setShowQuiz(true);
    }
  };

  const handleQuizAnswer = (optionIndex: number) => {
    const isCorrect = optionIndex === moduleData.quiz[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      setPoints(prev => prev + 100);
      setQuizFeedback({ correct: true, message: "Correct! Your neural patterns are aligning." });
    } else {
      setQuizFeedback({ correct: false, message: "Inaccurate data. Recalibrate and try again." });
    }

    setTimeout(() => {
      setQuizFeedback(null);
      if (currentQuestionIndex < moduleData.quiz.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        if (quizScore + (isCorrect ? 1 : 0) >= 2) {
          setCompletedModules(prev => new Set(prev).add(activeModule));
          setPoints(prev => prev + 500);
        }
        resetQuiz();
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setShowQuiz(false);
    setCurrentQuestionIndex(0);
    setQuizScore(0);
  };

  const totalProgress = (completedModules.size / Object.keys(MODULES).length) * 100;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100">
      {/* HUD Sidebar */}
      <aside className={`transition-all duration-500 ease-in-out ${sidebarOpen ? 'w-80' : 'w-0'} bg-slate-900/80 backdrop-blur-2xl border-r border-cyan-500/20 flex flex-col z-20 overflow-hidden shadow-2xl`}>
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">NOVASCI</h1>
            <p className="text-[10px] text-cyan-500/60 uppercase font-bold tracking-[0.2em] mt-1">Holodeck v3.0</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-full hover:bg-white/10 text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth={2.5} /></svg>
          </button>
        </div>
        
        <div className="p-8 border-b border-white/5 space-y-4">
           <div className="flex justify-between items-end">
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Mastery</span>
             <span className="text-lg font-display font-bold text-cyan-400">{Math.round(totalProgress)}%</span>
           </div>
           <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
             <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000 ease-out" style={{ width: `${totalProgress}%` }} />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {Object.values(MODULES).map((mod) => (
            <button
              key={mod.id}
              onClick={() => { setActiveModule(mod.id); }}
              className={`w-full p-4 rounded-xl text-left transition-all duration-300 group border ${
                activeModule === mod.id 
                  ? 'bg-cyan-500/10 border-cyan-500/40 text-white' 
                  : 'bg-transparent border-transparent text-slate-500 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold transition-all ${
                  activeModule === mod.id ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/50' : 'bg-slate-800'
                }`}>
                  {Object.values(MODULES).indexOf(mod) + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm tracking-tight truncate">{mod.title}</p>
                </div>
                {completedModules.has(mod.id) && (
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
                )}
              </div>
            </button>
          ))}
        </div>
      </aside>

      <main className="flex-1 relative flex flex-col bg-[#020617]">
        {/* Top Header */}
        <header className="absolute top-0 left-0 right-0 p-6 z-10 flex justify-between items-center pointer-events-none">
          <div className="pointer-events-auto">
             {!sidebarOpen && (
               <button onClick={() => setSidebarOpen(true)} className="bg-slate-900/80 backdrop-blur-xl p-3 rounded-xl text-cyan-400 border border-white/5 shadow-2xl">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" strokeWidth={2.5} /></svg>
               </button>
             )}
          </div>
          <div className="px-6 py-2 bg-slate-900/80 backdrop-blur-xl rounded-xl border border-white/5 shadow-2xl flex items-center gap-3 pointer-events-auto">
             <div className="w-2 h-2 rounded-full bg-yellow-500 animate-ping" />
             <span className="text-xs font-display font-bold text-yellow-500 tracking-widest">{points} XP</span>
          </div>
        </header>

        {/* 3D Scene */}
        <div className="flex-1 outline-none">
          <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
            <PerspectiveCamera makeDefault position={[0, 4, 15]} fov={40} />
            <OrbitControls 
              enablePan={false} 
              maxDistance={25} 
              minDistance={5} 
              autoRotate={!isSpeaking && !showQuiz} 
              autoRotateSpeed={0.5} 
              maxPolarAngle={Math.PI / 1.8}
            />
            
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={1} fade speed={2} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 20, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
            <pointLight position={[-10, -5, -10]} color="#22d3ee" intensity={1} />
            
            <Suspense fallback={null}>
              <Environment preset="night" />
              <ContactShadows position={[0, -5, 0]} opacity={0.4} scale={40} blur={2.5} far={10} color="#000000" />
              <ScienceSimulation type={activeModule} />
              {/* Instructor instance */}
              <Instructor isSpeaking={isSpeaking} />
            </Suspense>
          </Canvas>
        </div>

        {/* Quiz Overlay */}
        {showQuiz && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-6 animate-in fade-in duration-500">
            <div className="w-full max-w-lg bg-slate-900/90 border border-white/10 p-8 rounded-3xl shadow-2xl text-center">
               <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] mb-4 block">Assessment Unit</span>
               <h2 className="text-xl font-display font-bold text-white mb-6 leading-tight">{moduleData.quiz[currentQuestionIndex].question}</h2>
               
               {quizFeedback ? (
                 <div className={`p-6 rounded-2xl text-center animate-in zoom-in duration-300 ${quizFeedback.correct ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    <p className="font-bold">{quizFeedback.message}</p>
                 </div>
               ) : (
                 <div className="grid gap-3">
                   {moduleData.quiz[currentQuestionIndex].options.map((opt, idx) => (
                     <button
                       key={idx}
                       onClick={() => handleQuizAnswer(idx)}
                       className="p-4 rounded-xl text-left border border-white/5 bg-white/5 text-slate-300 font-medium hover:bg-white/10 hover:border-cyan-500/40 hover:text-white transition-all duration-300"
                     >
                       {opt}
                     </button>
                   ))}
                 </div>
               )}
            </div>
          </div>
        )}

        {/* Console / Command Bar */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 z-10">
          <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/5 p-6 rounded-[2rem] shadow-2xl flex flex-col md:flex-row gap-6 items-center">
             <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center border border-white/10">
                <div className={`w-8 h-8 ${isSpeaking ? 'text-cyan-400 animate-pulse scale-110' : 'text-slate-600'} transition-all duration-500`}>
                   <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full" strokeWidth={2}>
                     <path d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                   </svg>
                </div>
             </div>
             
             <div className="flex-1">
                <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-1">Module: {moduleData.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed max-w-xl italic">
                  {isSpeaking ? `Transmission in progress...` : `Standing by. Select 'Initiate Lesson' to begin holographic instruction.`}
                </p>
             </div>
             
             <button 
                onClick={handleStartLecture}
                disabled={isSpeaking}
                className={`px-8 py-3.5 rounded-full font-display font-bold text-[10px] uppercase tracking-[0.2em] transition-all duration-500 ${
                  isSpeaking 
                    ? 'bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed opacity-50' 
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:shadow-lg hover:shadow-cyan-500/30'
                }`}
             >
                Initiate Lesson
             </button>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(34,211,238,0.2); border-radius: 10px; }
      `}} />
    </div>
  );
};

export default App;
