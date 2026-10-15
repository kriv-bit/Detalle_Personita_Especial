import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SkyBackground from './components/SkyBackground';
import IdentityLogin from './components/IdentityLogin';
import DetailLetter from './components/DetailLetter';

function App() {
  const [stage, setStage] = useState('login'); // 'login' | 'detail'

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-x-hidden">
      {/* Animated Clear Sky Background */}
      <SkyBackground />

      {/* Screen Views with Page Transitions */}
      <main className="w-full relative z-10">
        <AnimatePresence mode="wait">
          {stage === 'login' ? (
            <motion.div
              key="login-stage"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04, filter: 'blur(6px)' }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="w-full"
            >
              <IdentityLogin onAuthenticated={() => setStage('detail')} />
            </motion.div>
          ) : (
            <motion.div
              key="detail-stage"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-full"
            >
              <DetailLetter onReset={() => setStage('login')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
