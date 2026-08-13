import { motion } from 'framer-motion';
import { Loader2, Plane, Sparkles } from 'lucide-react';

export default function AviationLoader({ message = 'Loading cabin crew training modules...', size = 'md' }) {
  const isSmall = size === 'sm';

  return (
    <div className={`flex flex-col items-center justify-center ${isSmall ? 'py-6' : 'py-16'} text-center select-none`}>
      <div className="relative mb-4">
        {/* Pulsing halo */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="absolute inset-0 bg-aerora-blueLight rounded-2xl filter blur-sm"
        />

        <div className="relative w-14 h-14 rounded-2xl bg-white border-2 border-aerora-border shadow-sm flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
          >
            <Loader2 className="w-6 h-6 text-aerora-blue animate-spin" />
          </motion.div>

          <div className="absolute inset-0 flex items-center justify-center">
            <Plane className="w-4 h-4 text-aerora-blue -rotate-45" />
          </div>
        </div>
      </div>

      <p className="text-sm font-extrabold text-aerora-ink font-heading mb-1">{message}</p>
      <p className="text-xs font-semibold text-aerora-muted flex items-center gap-1.5 justify-center">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Connecting to SkyReady Cloud...
      </p>
    </div>
  );
}

export function CardSkeleton({ count = 4 }) {
  return (
    <div className="space-y-3.5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border-2 border-aerora-border p-5 animate-pulse flex items-center justify-between"
        >
          <div className="space-y-2.5 flex-1 pr-4">
            <div className="flex gap-2">
              <div className="w-16 h-5 bg-aerora-border/60 rounded-full" />
              <div className="w-24 h-5 bg-aerora-border/40 rounded-full" />
            </div>
            <div className="w-3/4 h-5 bg-aerora-border/70 rounded-lg" />
            <div className="w-1/2 h-3.5 bg-aerora-border/40 rounded-lg" />
          </div>
          <div className="w-8 h-8 rounded-xl bg-aerora-border/50 flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}

export function GridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border-2 border-aerora-border p-4 animate-pulse flex items-center justify-between"
        >
          <div className="space-y-2 flex-1 pr-3">
            <div className="w-24 h-5 bg-aerora-border/70 rounded-lg" />
            <div className="w-32 h-3.5 bg-aerora-border/40 rounded-lg" />
          </div>
          <div className="w-6 h-6 rounded-lg bg-aerora-border/40 flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}
