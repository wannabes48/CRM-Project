import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Hexagon, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SuccessPage() {
  
  useEffect(() => {
    // Fire a premium confetti burst when the page loads!
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#B2FF4D', '#FFFFFF'] });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#B2FF4D', '#111111'] });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-saas-bg flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-700">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-saas-neon/10 blur-[150px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none animate-pulse" />

      <div className="w-full max-w-xl bg-white/40 dark:bg-saas-surface/40 backdrop-blur-3xl rounded-[3.5rem] border border-gray-100 dark:border-gray-800 p-12 md:p-20 shadow-[0_40px_100px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.6)] text-center relative z-10 animate-in zoom-in-95 duration-700">
        
        <div className="w-fit mx-auto mb-12 relative">
           <div className="w-24 h-24 bg-saas-neon/10 rounded-[2.5rem] flex items-center justify-center mx-auto border border-saas-neon/30 shadow-2xl shadow-saas-neon/20 relative z-10">
              <CheckCircle2 size={48} className="text-saas-neon" strokeWidth={2.5} />
           </div>
           {/* Pulsing rings */}
           <div className="absolute inset-0 bg-saas-neon/20 rounded-[2.5rem] animate-ping duration-[3s]"></div>
           <div className="absolute inset-[-8px] bg-saas-neon/10 rounded-[2.8rem] animate-pulse duration-[2s]"></div>
        </div>
        
        <div className="inline-flex items-center gap-2 bg-saas-neon/10 px-4 py-2 rounded-full mb-6 border border-saas-neon/20">
           <Sparkles size={12} className="text-saas-neon" />
           <span className="text-[10px] font-black text-saas-neon uppercase tracking-[0.2em]">Deployment Successful</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter uppercase leading-none">
          Welcome to the<br/><span className="text-saas-neon">Future.</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-widest leading-loose mb-12 max-w-sm mx-auto">
          Your enterprise workspace is live. All premium features, AI insights, and global edge security are now active.
        </p>
        
        <Link 
          to="/dashboard" 
          className="group w-full bg-saas-neon hover:scale-[1.02] active:scale-95 text-black font-black py-6 rounded-[1.5rem] transition-all shadow-2xl shadow-saas-neon/30 flex items-center justify-center gap-4 uppercase text-xs tracking-[0.2em]"
        >
          Enter Workspace <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-2 transition-transform duration-300" />
        </Link>

        <div className="mt-12 flex items-center justify-center gap-3">
           <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-xl">
              <Hexagon size={16} className="text-gray-400" />
           </div>
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Xentrix Cloud Network</span>
        </div>
      </div>
    </div>
  );
}