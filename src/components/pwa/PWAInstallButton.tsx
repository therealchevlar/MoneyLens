import React, { useState } from 'react';
import { Smartphone, Download, X, CheckCircle2, ShieldCheck, Share2, PlusSquare, ArrowRight } from 'lucide-react';
import { usePWAInstall } from '@/src/hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // If already running standalone, hide the prompt
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition-all shadow-sm group"
        title="Install MoneyLens as an Android / Mobile App"
      >
        <Smartphone className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline">Install Android / Mobile App</span>
        <span className="sm:hidden">Install App</span>
      </button>

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl fintech-card p-6 text-neutral-100 shadow-2xl border border-white/[0.1] space-y-5">
            <button
              onClick={() => setShowGuide(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                <Smartphone className="h-3 w-3" />
                <span>Mobile App & APK Instructions</span>
              </div>
              <h3 className="text-lg font-bold text-neutral-100">
                Install MoneyLens on Mobile
              </h3>
              <p className="text-xs text-neutral-400">
                Run MoneyLens with full native app performance, standalone full-screen, and zero browser bar.
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-neutral-900/80 border border-white/[0.06] space-y-2">
                <span className="font-semibold text-emerald-300 block">
                  Option 1: Direct Android 1-Click Install (Recommended)
                </span>
                <ol className="list-decimal list-inside space-y-1.5 text-neutral-300 text-[11px] leading-relaxed">
                  <li>Open this URL in Google Chrome on your Android device.</li>
                  <li>Tap the three dots menu (<span className="font-bold">⋮</span>) in the top-right.</li>
                  <li>Select <span className="font-bold text-white">"Install App"</span> or <span className="font-bold text-white">"Add to Home screen"</span>.</li>
                  <li>Android automatically compiles it into a native standalone WebAPK with its own launcher icon!</li>
                </ol>
              </div>

              <div className="p-3 rounded-xl bg-neutral-900/80 border border-white/[0.06] space-y-2">
                <span className="font-semibold text-emerald-300 block">
                  Option 2: Download Standalone .APK File
                </span>
                <p className="text-neutral-300 text-[11px] leading-relaxed">
                  To generate an installable standalone <span className="font-mono text-emerald-400">.apk</span> package:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-neutral-300 text-[11px] leading-relaxed">
                  <li>Go to <span className="font-mono text-emerald-400">PWABuilder.com</span> on any computer.</li>
                  <li>Enter your MoneyLens live URL and click <span className="font-semibold text-white">Build</span>.</li>
                  <li>Click <span className="font-semibold text-white">Android Package</span> to download the signed <span className="font-mono text-emerald-400">.apk</span> directly!</li>
                </ol>
              </div>

              {isIOS && (
                <div className="p-3 rounded-xl bg-neutral-900/80 border border-white/[0.06] space-y-1 text-[11px]">
                  <span className="font-semibold text-amber-300 block">iOS Safari Instructions</span>
                  <p className="text-neutral-300">
                    Tap <Share2 className="h-3 w-3 inline text-blue-400 mx-0.5" /> Share in the Safari toolbar, then scroll down and tap <PlusSquare className="h-3 w-3 inline text-neutral-200 mx-0.5" /> <span className="font-semibold text-white">"Add to Home Screen"</span>.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowGuide(false)}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-colors shadow-lg shadow-emerald-950/40"
              >
                Got It, Thanks!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
