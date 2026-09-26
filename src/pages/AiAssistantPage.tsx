import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { useMaterials } from '../context/MaterialsContext';
import { 
  Bot, 
  Send, 
  Mic, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  RotateCcw, 
  User, 
  Lightbulb, 
  BookOpen,
  HelpCircle,
  Check
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AiAssistantPage: React.FC = () => {
  const { user } = useAuth();
  const { settings, playSpeech, stopSpeech, isSpeaking, triggerSoundCue } = useAccessibility();
  const { activeMaterial } = useMaterials();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      role: 'assistant',
      text: `Hello ${user?.name.split(' ')[0] || 'there'}! I am EquiLearn's AI Learning Assistant, tuned specifically for your ${settings.profile} profile. How can I help you understand "${activeMaterial.title}" today?`,
      timestamp: 'Just now'
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!messageText) setInput('');
    setIsLoading(true);
    triggerSoundCue('chime');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          profile: settings.profile,
          currentMaterial: activeMaterial,
          conversationHistory: messages.map((m) => ({ role: m.role, text: m.text }))
        })
      });

      const json = await res.json();
      const replyText = json.reply || 'I am ready to help you with your next question!';

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
      triggerSoundCue('success');

      // Auto-read aloud for Blind students
      if (settings.profile === 'Blind') {
        playSpeech(replyText);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          text: `In "${activeMaterial.title}", the key insight is how cellular compartments separate energy reactions. Would you like a 3-bullet simplified breakdown?`,
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech Recognition is not supported in this browser.');
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRec();
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsListening(true);
    triggerSoundCue('chime');

    recognition.onresult = (e: any) => {
      const spokenText = e.results[0][0].transcript;
      setInput(spokenText);
      setIsListening(false);
      handleSend(spokenText);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const PROMPT_CHIPS = [
    'Explain the 3 stages of Cellular Respiration simply',
    'What is the difference between Glycolysis and Krebs cycle?',
    'Give me a 1-question quiz to test my memory',
    'Summarize this into 3 bullet points for ADHD focus'
  ];

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-4 rounded-2xl glass-card bg-white/80 dark:bg-slate-900/80 border border-[#E7EAF2] dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#9B8AFB]/15 text-[#9B8AFB] flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#24324A] dark:text-white flex items-center gap-2">
              AI Learning Assistant
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#9B8AFB]/15 text-[#9B8AFB]">
                Gemini 3.8 Flash
              </span>
            </h1>
            <p className="text-xs text-[#64748B] dark:text-slate-400">
              Personalized for: <strong className="text-[#2EC4B6]">{settings.profile} Profile</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: 'm-reset',
                role: 'assistant',
                text: `Conversation cleared! How can I assist you with "${activeMaterial.title}"?`,
                timestamp: 'Just now'
              }
            ]);
            triggerSoundCue('chime');
          }}
          className="p-2 rounded-xl text-[#64748B] hover:text-[#24324A] hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="Reset conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex flex-wrap gap-2">
        {PROMPT_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-[#E7EAF2] dark:border-slate-800 hover:border-[#9B8AFB] text-xs text-[#64748B] dark:text-slate-300 hover:text-[#9B8AFB] font-medium transition shadow-2xs"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Chat Messages Feed */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-[#E7EAF2] dark:border-slate-800 shadow-xs min-h-[420px] max-h-[500px] overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isUser = m.role === 'user';

          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                  isUser
                    ? 'bg-[#2EC4B6] text-white'
                    : 'bg-[#9B8AFB]/15 text-[#9B8AFB]'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-[#2EC4B6] text-white rounded-tr-xs'
                    : 'bg-[#F7F9FC] dark:bg-slate-800 text-[#24324A] dark:text-slate-100 border border-[#E7EAF2] dark:border-slate-700 rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-line font-medium">{m.text}</div>

                {/* Read Aloud trigger for assistant replies */}
                {!isUser && (
                  <div className="mt-2 pt-2 border-t border-[#E7EAF2] dark:border-slate-700 flex items-center justify-between text-[11px] text-[#64748B]">
                    <span>{m.timestamp}</span>
                    <button
                      onClick={() => playSpeech(m.text)}
                      className="hover:text-[#9B8AFB] flex items-center gap-1 font-semibold"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Speak</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3 text-xs text-[#64748B] italic">
            <Sparkles className="w-4 h-4 text-[#9B8AFB] animate-spin" />
            <span>Assistant is adapting response for {settings.profile} learner...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="relative flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Ask a question with your voice or keyboard (${settings.profile} mode)...`}
          className="flex-1 pl-4 pr-24 py-3 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-[#E7EAF2] dark:border-slate-800 text-[#24324A] dark:text-white outline-none focus:border-[#9B8AFB] focus:ring-1 focus:ring-[#9B8AFB] shadow-xs"
        />

        <div className="absolute right-2.5 flex items-center gap-1.5">
          {/* Voice Input Button */}
          <button
            onClick={handleVoiceInput}
            title="Speak with Microphone (Web Speech API)"
            className={`p-2 rounded-lg transition ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'text-[#64748B] hover:text-[#9B8AFB] hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Send Button */}
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-lg bg-[#9B8AFB] hover:bg-[#8b79f8] disabled:opacity-40 text-white shadow-xs transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
