import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, AlertCircle, HelpCircle, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';

export default function IdentityLogin({ onAuthenticated }) {
  const [inputName, setInputName] = useState('');
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'doubt' | 'wrong' | 'empty', title: '', message: '' }
  const [isShaking, setIsShaking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const normalizeText = (text) => {
    return text
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  const triggerConfetti = () => {
    // Elegant dual confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#0284c7', '#fda4af', '#f43f5e', '#fef08a']
    });
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#38bdf8', '#bae6fd', '#f472b6']
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#38bdf8', '#bae6fd', '#f472b6']
      });
    }, 250);
  };

  const triggerShake = () => {
    setIsShaking(true);
    if (navigator.vibrate) {
      navigator.vibrate(120);
    }
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const raw = inputName.trim();
    const normalized = normalizeText(raw);

    if (!raw) {
      triggerShake();
      sound.playPlayfulDoubt();
      setFeedback({
        type: 'empty',
        title: '¡Espera un momento!',
        message: 'Oye, ¡tienes que escribir tu nombre primero! 😉'
      });
      return;
    }

    // CASE 1: Contains "shofis" (case-insensitive, can contain anything else like last name)
    if (normalized.includes('shofis')) {
      setIsSuccess(true);
      sound.playSuccess();
      triggerConfetti();
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 150]);
      }

      setFeedback({
        type: 'success',
        title: '¡Esoooo! Tu nombre es Shofis ✨🥰',
        message: 'Cargando mensajito <3'
      });

      // 3-second countdown to the main experience
      let remaining = 3;
      const interval = setInterval(() => {
        remaining -= 1;
        setCountdown(remaining);
        if (remaining <= 0) {
          clearInterval(interval);
          onAuthenticated();
        }
      }, 1000);
      return;
    }

    // CASE 2: Contains "sofia" or "lorena" without "shofis"
    if (normalized.includes('sofia') || normalized.includes('lorena')) {
      triggerShake();
      sound.playPlayfulDoubt();
      setFeedback({
        type: 'doubt',
        title: 'Mmm...',
        message: 'Mmmm me suena mucho "Sofia" pero no es la persona que estamos buscando 🤔'
      });
      return;
    }

    // CASE 3: Completely different name (e.g. Tatiana, Laura, etc.)
    const displayName = raw.charAt(0).toUpperCase() + raw.slice(1);
    triggerShake();
    sound.playWrong();
    setFeedback({
      type: 'wrong',
      title: 'Acceso no reconocido',
      message: `Mmm, ${displayName}... Parece que este QR llegó a manos equivocadas 🛑. Este detalle tiene dueña exclusiva.`
    });
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[90vh]">
      {/* Main Glass Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`w-full glass-card rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-300 ${
          isSuccess 
            ? 'ring-4 ring-emerald-300/80 bg-white/90' 
            : 'ring-1 ring-white/60'
        } ${isShaking ? 'animate-shake' : ''}`}
      >
        {/* Soft top aura */}
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-sky-300/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-pink-200/30 rounded-full blur-2xl pointer-events-none" />

        {/* Header Icon & Greeting */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-sky-400 to-sky-200 text-white shadow-md shadow-sky-300/50 mb-3 animate-float">
            {isSuccess ? (
              <Sparkles className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '6s' }} />
            ) : (
              <Lock className="w-8 h-8 text-white" />
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-800 tracking-tight">
            Validación de Destinataria
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Para desbloquear lo que este dulce tiene para ti, responde con sinceridad:
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 text-left">
              ¿Cuál es tu nombre?
            </label>
            <div className="relative">
              <input
                type="text"
                disabled={isSuccess}
                value={inputName}
                onChange={(e) => {
                  setInputName(e.target.value);
                  if (feedback && feedback.type !== 'success') {
                    setFeedback(null);
                  }
                }}
                placeholder="Escribe tu nombre aquí..."
                autoComplete="off"
                autoFocus
                className={`w-full px-4 py-3.5 rounded-2xl text-base text-slate-800 placeholder-slate-400 bg-white/80 border transition-all duration-200 focus:outline-none shadow-inner ${
                  isSuccess
                    ? 'border-emerald-400 bg-emerald-50/50 text-emerald-800 font-semibold'
                    : feedback?.type === 'wrong' || feedback?.type === 'doubt' || feedback?.type === 'empty'
                    ? 'border-amber-400 focus:ring-4 focus:ring-amber-200/50'
                    : 'border-sky-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-200/50'
                }`}
              />
              <span className="absolute right-3.5 top-3.5 text-lg pointer-events-none select-none">
                {isSuccess ? '✨' : '✍️'}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          {!isSuccess && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl font-heading font-semibold text-white bg-gradient-to-r from-sky-500 via-sky-600 to-sky-700 shadow-lg shadow-sky-400/40 hover:shadow-sky-500/50 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Verificar identidad</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          )}
        </form>

        {/* Feedback Area */}
        <AnimatePresence mode="wait">
          {feedback && (
            <motion.div
              key={feedback.type + feedback.title}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`mt-5 p-4 rounded-2xl text-left border ${
                feedback.type === 'success'
                  ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 text-emerald-900'
                  : feedback.type === 'doubt'
                  ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 text-amber-900'
                  : feedback.type === 'empty'
                  ? 'bg-sky-50 border-sky-200 text-sky-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {feedback.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  {feedback.type === 'doubt' && <HelpCircle className="w-5 h-5 text-amber-600 animate-bounce" />}
                  {feedback.type === 'wrong' && <AlertCircle className="w-5 h-5 text-rose-600" />}
                  {feedback.type === 'empty' && <Sparkles className="w-5 h-5 text-sky-600" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-heading font-bold text-sm">
                    {feedback.title}
                  </h4>
                  <p className="text-xs sm:text-sm mt-0.5 opacity-90 leading-relaxed">
                    {feedback.message}
                  </p>

                  {/* Countdown bar during the 3 seconds */}
                  {feedback.type === 'success' && (
                    <div className="mt-3 pt-2.5 border-t border-emerald-200/60 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                        <span className="text-xs font-semibold text-emerald-800">
                          {feedback.message}
                        </span>
                        <motion.span 
                          key={countdown}
                          initial={{ scale: 1.4, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs shadow-sm"
                        >
                          {countdown}
                        </motion.span>
                      </div>
                      <div className="w-20 h-2 bg-emerald-200/80 rounded-full overflow-hidden p-0.5">
                        <motion.div
                          initial={{ width: '0%' }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 3, ease: 'linear' }}
                          className="h-full bg-emerald-500 rounded-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer note */}
        <div className="mt-6 pt-4 border-t border-slate-200/50 text-center">
          <p className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
            <Heart className="w-3 h-3 text-sky-400 fill-sky-400 inline" />
            <span>Para alguien muy especial</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
