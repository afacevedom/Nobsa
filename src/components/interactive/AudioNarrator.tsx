import { useEffect, useState } from 'react';
import { Square, Volume2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface AudioNarratorProps {
  text: string;
  label?: string;
}

export function AudioNarrator({ text, label }: AudioNarratorProps) {
  const { t } = useLanguage();
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!supported) return null;

  const handleToggle = () => {
    const synth = window.speechSynthesis;
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }

    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-CO';
    utterance.rate = 0.96;
    const voices = synth.getVoices();
    const esVoice =
      voices.find((v) => v.lang.toLowerCase().startsWith('es-co')) ||
      voices.find((v) => v.lang.toLowerCase().startsWith('es'));
    if (esVoice) utterance.voice = esVoice;

    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    synth.speak(utterance);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex min-h-[38px] items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
        speaking
          ? 'bg-grana text-lana'
          : 'border border-tinta/15 bg-lana-soft text-tinta hover:border-grana hover:text-grana'
      }`}
    >
      {speaking ? (
        <>
          <Square className="h-3.5 w-3.5 fill-current" />
          {t.stopAudio}
        </>
      ) : (
        <>
          <Volume2 className="h-3.5 w-3.5" />
          {label || t.listenAudio}
        </>
      )}
    </button>
  );
}
