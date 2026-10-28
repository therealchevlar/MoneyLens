import React, { useState } from 'react';
import {
  Globe,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  Download,
  Share2,
  PlusSquare,
  Sparkles,
  ShieldCheck,
  Zap,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { usePWAInstall } from '@/src/hooks/usePWAInstall';

interface PlatformChoiceScreenProps {
  onSelectPlatform: (platform: 'web' | 'android' | 'ios') => void;
}

export const PlatformChoiceScreen: React.FC<PlatformChoiceScreenProps> = ({
  onSelectPlatform,
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showAndroidModal, setShowAndroidModal] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(isInstalled);

  const handleChooseWeb = () => {
    localStorage.setItem('moneylens_platform_selected', 'web');
    onSelectPlatform('web');
  };

  const handleChooseAndroid = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) {
        setInstalledSuccess(true);
      }
    }
    setShowAndroidModal(true);
  };

  const handleChooseIOS = () => {
    setShowIOSModal(true);
  };

  const handleProceedFromModal = (platform: 'android' | 'ios') => {
    localStorage.setItem('moneylens_platform_selected', platform);
    onSelectPlatform(platform);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-40" />
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-emerald-500/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="relative w-full max-w-2xl fintech-card rounded-2xl border border-white/[0.08] shadow-2xl p-6 sm:p-9 bg-neutral-900/90 backdrop-blur-xl space-y-7">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Welcome to MoneyLens</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-100">
            How would you like to use MoneyLens?
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
            Choose whether to run directly in your web browser or install the native app for Android or iOS.
          </p>
        </div>

        {/* 3 Platform Choice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* OPTION 1: WEB BROWSER */}
          <div
            onClick={handleChooseWeb}
            className="group relative p-5 rounded-2xl border border-white/[0.08] bg-neutral-950/80 hover:bg-neutral-900/90 hover:border-emerald-500/50 transition-all cursor-pointer flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="h-11 w-11 rounded-xl bg-neutral-900 border border-white/[0.1] flex items-center justify-center text-emerald-400 group-hover:scale-105 group-hover:border-emerald-500/30 transition-transform">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-neutral-100">Web Browser</h3>
                  {!isAndroid && !isIOS && (
                    <Badge variant="outline" className="text-[9px] font-mono border-emerald-500/30 text-emerald-400 py-0 px-1.5">
                      Fastest
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-neutral-400 mt-1 leading-snug">
                  Launch instantly in any browser. No downloads required, full offline storage and ledger tracking.
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs font-semibold gap-1.5 border-white/[0.1] group-hover:border-emerald-500 group-hover:bg-emerald-500/10 group-hover:text-emerald-300"
              onClick={(e) => {
                e.stopPropagation();
                handleChooseWeb();
              }}
            >
              <span>Use on Web</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>

          {/* OPTION 2: ANDROID APP */}
          <div
            onClick={handleChooseAndroid}
            className={`group relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
              isAndroid
                ? 'border-emerald-500/60 bg-emerald-950/20 hover:border-emerald-400'
                : 'border-white/[0.08] bg-neutral-950/80 hover:bg-neutral-900/90 hover:border-emerald-500/50'
            }`}
          >
            <div className="space-y-3">
              <div className="h-11 w-11 rounded-xl bg-neutral-900 border border-white/[0.1] flex items-center justify-center text-emerald-400 group-hover:scale-105 group-hover:border-emerald-500/30 transition-transform">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-neutral-100">Android App</h3>
                  {isAndroid && (
                    <Badge variant="success" className="text-[9px] font-mono py-0 px-1.5">
                      Detected
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-neutral-400 mt-1 leading-snug">
                  Native standalone WebAPK & app icon in your Android drawer. Runs full screen without browser bars.
                </p>
              </div>
            </div>

            <Button
              variant={isAndroid ? 'primary' : 'outline'}
              size="sm"
              className="w-full text-xs font-semibold gap-1.5 shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                handleChooseAndroid();
              }}
            >
              <Download className="h-3 w-3" />
              <span>Android App</span>
            </Button>
          </div>

          {/* OPTION 3: IOS APP (IPHONE) */}
          <div
            onClick={handleChooseIOS}
            className={`group relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
              isIOS
                ? 'border-emerald-500/60 bg-emerald-950/20 hover:border-emerald-400'
                : 'border-white/[0.08] bg-neutral-950/80 hover:bg-neutral-900/90 hover:border-emerald-500/50'
            }`}
          >
            <div className="space-y-3">
              <div className="h-11 w-11 rounded-xl bg-neutral-900 border border-white/[0.1] flex items-center justify-center text-emerald-400 group-hover:scale-105 group-hover:border-emerald-500/30 transition-transform">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-current"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.72-.93 2.74 1.01.08 2.03-.5 2.64-1.24z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-neutral-100">iOS / iPhone</h3>
                  {isIOS && (
                    <Badge variant="success" className="text-[9px] font-mono py-0 px-1.5">
                      Detected
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-neutral-400 mt-1 leading-snug">
                  Add to iPhone or iPad Home Screen via Safari. Standalone window with high-res icon and zero latency.
                </p>
              </div>
            </div>

            <Button
              variant={isIOS ? 'primary' : 'outline'}
              size="sm"
              className="w-full text-xs font-semibold gap-1.5 shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                handleChooseIOS();
              }}
            >
              <PlusSquare className="h-3 w-3" />
              <span>iOS Version</span>
            </Button>
          </div>
        </div>

        {/* Feature Highlights Footer */}
        <div className="pt-2 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>100% Private Ledger • Zero Bank Logins • Offline First</span>
          </div>
          <button
            type="button"
            onClick={handleChooseWeb}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium underline flex items-center gap-1"
          >
            <span>Skip to Web Setup</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* ANDROID MODAL / GUIDE */}
      {showAndroidModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl fintech-card p-6 text-neutral-100 shadow-2xl border border-white/[0.1] space-y-5 bg-neutral-900">
            <div className="flex items-center gap-3 border-b border-white/[0.06] pb-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-100">Android App Installation</h3>
                <span className="text-[11px] font-mono text-emerald-400">WebAPK & Direct Download</span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-neutral-300">
              <div className="p-3 rounded-xl bg-neutral-950/80 border border-white/[0.06] space-y-1.5">
                <span className="font-semibold text-neutral-100 block">Method 1: Direct 1-Tap Install</span>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  In Chrome on your Android phone, tap the browser menu (<strong>⋮</strong>) and tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>. Android will build a native WebAPK with full offline access!
                </p>
                {isInstallable && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={async () => {
                      await install();
                      setInstalledSuccess(true);
                    }}
                    className="w-full mt-2 text-xs font-semibold gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Install Now to Android Home Screen</span>
                  </Button>
                )}
              </div>

              <div className="p-3 rounded-xl bg-neutral-950/80 border border-white/[0.06] space-y-1.5">
                <span className="font-semibold text-neutral-100 block">Method 2: Standalone .APK File</span>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Need a sideloadable <strong>.apk</strong> package? You can generate one instantly at <strong>PWABuilder.com</strong> by entering your shared app URL.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowAndroidModal(false)}
                className="text-xs text-neutral-400 hover:text-neutral-200"
              >
                Cancel
              </button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleProceedFromModal('android')}
                className="gap-1.5 text-xs font-semibold"
              >
                <span>Proceed to Wallet Setup</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* IOS MODAL / GUIDE */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl fintech-card p-6 text-neutral-100 shadow-2xl border border-white/[0.1] space-y-5 bg-neutral-900">
            <div className="flex items-center gap-3 border-b border-white/[0.06] pb-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Share2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-100">Add to iPhone / iPad</h3>
                <span className="text-[11px] font-mono text-emerald-400">Apple iOS Safari Setup</span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-neutral-300">
              <p className="text-neutral-400">
                Follow these 2 quick steps in Safari to add MoneyLens to your iPhone home screen:
              </p>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-neutral-950/80 border border-white/[0.06] flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold font-mono text-xs shrink-0">
                    1
                  </div>
                  <div className="text-[11px] leading-snug">
                    Tap the <strong>Share</strong> button at the bottom of Safari (
                    <Share2 className="inline h-3 w-3 text-emerald-400 mx-0.5" />
                    ).
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950/80 border border-white/[0.06] flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold font-mono text-xs shrink-0">
                    2
                  </div>
                  <div className="text-[11px] leading-snug">
                    Scroll down and tap <strong>"Add to Home Screen"</strong> (
                    <PlusSquare className="inline h-3 w-3 text-emerald-400 mx-0.5" />
                    ), then tap <strong>Add</strong>.
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>MoneyLens will launch in a clean, standalone fullscreen window without browser address bars!</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="text-xs text-neutral-400 hover:text-neutral-200"
              >
                Cancel
              </button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleProceedFromModal('ios')}
                className="gap-1.5 text-xs font-semibold"
              >
                <span>Proceed to Wallet Setup</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
