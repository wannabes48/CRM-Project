import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, LayoutDashboard, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti'; // Optional: npm install canvas-confetti @types/canvas-confetti

export default function SuccessPage() {
  
  useEffect(() => {
    // Fire a quick confetti burst when the page loads!
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#064E3B', '#10B981', '#B2FF4D'] });
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-10 rounded-[2rem] border border-gray-100 shadow-2xl max-w-lg w-full text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 border-8 border-white shadow-sm">
          <CheckCircle2 size={48} className="text-[#064E3B]" />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Payment Successful!</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Welcome to Xentrix Professional. Your workspace has been successfully upgraded and all premium features are now unlocked.
        </p>
        
        <Link to="/dashboard" className="w-full bg-[#064E3B] hover:bg-[#043d2e] text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
          Go to Dashboard <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}