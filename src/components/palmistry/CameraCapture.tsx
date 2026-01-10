
import React, { useRef, useState, useCallback, useEffect } from 'react';

interface CameraCaptureProps {
  onCapture: (image: string) => void;
  label: string;
  instruction: string;
  mode: 'palm' | 'thumb';
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, label, instruction, mode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Persistence for user-preferred capture settings
  const [highPrecision, setHighPrecision] = useState(() => {
    const saved = localStorage.getItem('nadi_high_precision');
    return saved === 'true';
  });

  const togglePrecision = () => {
    const newVal = !highPrecision;
    setHighPrecision(newVal);
    localStorage.setItem('nadi_high_precision', String(newVal));
  };

  const startCamera = useCallback(async () => {
    try {
      const constraints = { 
        video: { 
          facingMode: 'environment',
          width: { ideal: highPrecision ? 2160 : 1080 },
          height: { ideal: highPrecision ? 2160 : 1080 }
        } 
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);
      }
    } catch (err) {
      setError("Camera access required for Nadi reading.");
    }
  }, [highPrecision]);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        // Using higher quality if highPrecision is active
        onCapture(canvasRef.current.toDataURL('image/jpeg', highPrecision ? 0.98 : 0.92));
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto p-6 md:p-8 bg-slate-900/90 backdrop-blur-3xl rounded-[3rem] border border-amber-500/20 shadow-2xl relative overflow-hidden">
      {error && <p className="text-red-400 text-xs font-bold uppercase mb-2 text-center">{error}</p>}
      
      <div className="text-center space-y-2">
        <h3 className="text-2xl md:text-3xl font-black gradient-text uppercase italic tracking-tighter">{label}</h3>
        <p className="text-slate-400 text-sm font-medium italic px-4">{instruction}</p>
      </div>

      {/* Persistence Toggle */}
      <div className="w-full flex justify-between items-center px-6 py-3 bg-slate-950/50 rounded-2xl border border-slate-800/50">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">High Precision Mode</span>
        <button 
          onClick={togglePrecision}
          className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${highPrecision ? 'bg-amber-600' : 'bg-slate-800'}`}
        >
          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${highPrecision ? 'translate-x-6' : 'translate-x-0'}`}></div>
        </button>
      </div>

      <div className="relative w-full aspect-square bg-slate-950 rounded-[2.5rem] overflow-hidden border-2 border-slate-800 group shadow-inner">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
        
        {/* Advanced Visual Guides Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {mode === 'palm' ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-[85%] h-[85%] text-amber-500/30 animate-[silhouette-float_6s_ease-in-out_infinite]" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 170C40 150 32 120 42 90C45 80 52 75 57 80C62 85 59 100 57 110M62 70C57 50 62 30 72 30C82 30 87 50 82 70M92 60C92 40 97 20 107 20C117 20 122 40 122 60M132 70C137 50 147 35 157 40C167 45 162 65 157 85M162 120C172 140 167 170 147 185C127 200 67 200 47 185" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 5" />
              </svg>
              
              <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-amber-500/60 rounded-tl-2xl animate-[bracket-pulse_3s_ease-in-out_infinite]"></div>
              <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-amber-500/60 rounded-tr-2xl animate-[bracket-pulse_3s_ease-in-out_infinite_500ms]"></div>
              <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-amber-500/60 rounded-bl-2xl animate-[bracket-pulse_3s_ease-in-out_infinite_1000ms]"></div>
              <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-amber-500/60 rounded-br-2xl animate-[bracket-pulse_3s_ease-in-out_infinite_1500ms]"></div>
              
              <div className="absolute bottom-10 text-amber-500/50 text-[10px] font-black uppercase tracking-[0.3em] bg-slate-950/40 px-3 py-1 rounded-full backdrop-blur-sm">Align Entire Palm</div>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative w-56 h-56 flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-amber-500/40 rounded-full animate-[ping_3s_linear_infinite]"></div>
                <div className="absolute inset-4 border-4 border-amber-500/60 rounded-full shadow-[0_0_50px_rgba(245,158,11,0.3)]"></div>
                <div className="absolute inset-10 border-2 border-dashed border-amber-500/30 rounded-full animate-[spin_12s_linear_infinite]"></div>
                <div className="absolute h-full w-[1px] bg-amber-500/20"></div>
                <div className="absolute w-full h-[1px] bg-amber-500/20"></div>
                <div className="w-4 h-4 bg-amber-500/20 border border-amber-500 rounded-full flex items-center justify-center">
                   <div className="w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,1)]"></div>
                </div>
              </div>
              <div className="absolute bottom-12 text-amber-500/50 text-[10px] font-black uppercase tracking-[0.3em] bg-slate-950/40 px-3 py-1 rounded-full backdrop-blur-sm">Center Thumb Print</div>
            </div>
          )}
          
          <div className="absolute top-0 w-full h-1.5 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent animate-[scan_4s_linear_infinite]"></div>
        </div>
        
        <div className="absolute top-6 right-6 flex items-center gap-2 bg-slate-950/40 p-2 rounded-xl backdrop-blur-md">
            <div className={`w-2 h-2 rounded-full animate-pulse ${highPrecision ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
            <span className={`${highPrecision ? 'text-amber-500' : 'text-emerald-500'} text-[8px] font-black uppercase tracking-widest`}>
              {highPrecision ? '2K Precision Active' : 'Optimal Sync'}
            </span>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <button 
        onClick={handleCapture} 
        disabled={!isActive} 
        className="w-full py-6 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 rounded-3xl font-black text-white shadow-xl active:scale-95 hover:scale-[1.02] transition-all uppercase tracking-[0.2em] text-xs disabled:opacity-50 disabled:grayscale"
      >
        Capture {mode === 'palm' ? 'Palm Record' : 'Thumb Impression'}
      </button>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes silhouette-float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.15; }
          50% { transform: translateY(-8px) scale(1.01); opacity: 0.35; }
        }
        @keyframes bracket-pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default CameraCapture;
