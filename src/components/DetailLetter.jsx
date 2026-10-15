import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, RotateCcw, MailOpen } from 'lucide-react';
import Cloud3DScene from './Cloud3DScene';

export default function DetailLetter({ onReset }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 flex flex-col items-center">
      {/* Top greeting badge */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-pill px-4 py-1.5 rounded-full flex items-center gap-2 mb-2 shadow-sm text-sky-900 text-xs font-bold"
      >
        <span className="text-sm">🌧️</span>
        <span>Para la persona que ilumina mi cielo</span>
        <span className="text-sm">✨</span>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-800 text-center tracking-tight mb-2"
      >
        ¡Hola, mi Shofis! <span className="inline-block animate-bounce">🥰</span>
      </motion.h1>

      {/* 3D Fluffy Cloud Canvas */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full"
      >
        <Cloud3DScene />
      </motion.div>

      {/* Letter / Message Box Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="w-full glass-card rounded-3xl p-6 sm:p-7 shadow-xl text-center relative overflow-hidden mt-2"
      >
        {/* Soft background accents */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-sky-200/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-pink-200/40 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-center gap-2 text-sky-600 mb-3">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Un chocolatito para alegrar tu día</span>
          <Sparkles className="w-4 h-4" />
        </div>

        <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
          Un empujoncito dulce para que lo disfrutes en medio de tus pendientes... Tómate un minutito y abre el mensajito:
        </p>

        {/* Expandable heartfelt card */}
        <div className="mt-5">
          {!isOpen ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsOpen(true)}
              className="py-3 px-6 rounded-2xl font-heading font-semibold text-white bg-gradient-to-r from-sky-500 to-sky-700 shadow-md shadow-sky-400/40 flex items-center justify-center gap-2 mx-auto text-sm"
            >
              <MailOpen className="w-4 h-4" />
              <span>Abrir mensajito &lt;3</span>
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.4 }}
              className="mt-4 p-5 sm:p-6 rounded-2xl bg-white/95 border border-sky-100 shadow-inner text-left font-handwriting text-xl sm:text-2xl text-slate-800 leading-relaxed space-y-4"
            >
              <p className="text-sky-700 font-bold text-2xl">
                «Para mi Shofis:»
              </p>
              <p>
                Sé lo pesado que puede ponerse el semestre, más con la monitoría y tu trabajo, el cansancio que a veces se acumula... por eso quise endulzarte un poquito el momento con algo pequeñito, y para que recuerdes que pues tú eres una persona muy inteligente y capaz de todo, como me lo has demostrado siempre.
              </p>
              <p>
                La verdad no me gusta verte estresada, entiendo que eres una personita bastante perfeccionista y todo pero igual recuerda que no estás sola y que aquí siempre cuentas conmigo, no todo tiene que recaer en ti, y pues ya verás cómo en dos mesecitos miras atrás y viste que sí fuiste muy capaz de sacar todo adelante.
              </p>
              <p>
                Gracias por permitirme cuidarte y por cada sonrisa que me regalas. Espero que podamos seguir escribiendo una linda historia juntos.
              </p>
              <p className="text-right text-sky-800 font-bold text-2xl pt-2">
                — Kevin
              </p>
            </motion.div>
          )}
        </div>

        {/* Quick Restart / Re-test Login button for Kevin */}
        <div className="mt-6 pt-4 border-t border-slate-200/50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">
            🌧️ Shofis Josa
          </span>
          <button
            onClick={onReset}
            className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Probar login de nuevo</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
