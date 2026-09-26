import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useMaterials } from '../context/MaterialsContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Layers, 
  BookOpen, 
  Award,
  ChevronRight,
  Volume2
} from 'lucide-react';

export const SummaryQuizPage: React.FC = () => {
  const { activeMaterial } = useMaterials();
  const { playSpeech, triggerSoundCue } = useAccessibility();

  const [activeTier, setActiveTier] = useState<'simple' | 'medium' | 'detailed'>('simple');
  const [activeSubTab, setActiveSubTab] = useState<'summary' | 'flashcards' | 'quiz'>('summary');

  // Flashcards state
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const FLASHCARDS = [
    { front: 'Where does Glycolysis occur in the cell?', back: 'Exclusively in the cell cytoplasm. It is an anaerobic process yielding 2 net ATP and 2 NADH.' },
    { front: 'What is the primary role of ATP Synthase?', back: 'A rotary enzyme along the inner mitochondrial membrane that manufactures ATP using proton motive force (chemiosmosis).' },
    { front: 'What is the terminal electron acceptor in aerobic respiration?', back: 'Molecular oxygen (O2), which accepts electrons and combines with protons to produce water (H2O).' },
    { front: 'Why does benzene undergo substitution rather than addition?', back: 'Addition would destroy its prized 36 kcal/mol aromatic resonance stabilization energy, whereas substitution retains aromaticity.' }
  ];

  const QUIZ_QUESTIONS = [
    {
      question: 'Which stage of cellular respiration produces the highest quantity of ATP?',
      options: [
        'Glycolysis in the cytoplasm',
        'Oxidative phosphorylation & ATP Synthase on mitochondrial cristae',
        'The Citric Acid Cycle in the matrix',
        'Pyruvate decarboxylation'
      ],
      correctIndex: 1,
      explanation: 'Oxidative phosphorylation via chemiosmosis generates approximately 28 to 32 ATP per glucose molecule (about 90% of total yield).'
    },
    {
      question: 'In the Atlantic Charter of 1941, Roosevelt and Churchill pledged to promote:',
      options: [
        'Immediate territorial expansion for Allied nations',
        'Universal self-determination of peoples, economic collaboration, and disarmament',
        'Immediate total isolation from international trade',
        'Sole dominance of naval war vessels'
      ],
      correctIndex: 1,
      explanation: 'The Atlantic Charter outlined eight foundational principles for world peace, notably self-determination and freedom of the seas.'
    },
    {
      question: 'In thin convex lenses, a light ray traveling parallel to the principal axis refracts:',
      options: [
        'Directly through the center without bending',
        'Straight through the focal point (F2) on the opposite side',
        'Reflects backwards at 90 degrees',
        'Disperses into infrared spectrum only'
      ],
      correctIndex: 1,
      explanation: 'By optical definition of a converging lens, parallel incident rays converge through the principal focal point.'
    }
  ];

  const handleSelectOption = (idx: number) => {
    if (hasSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setHasSubmitted(true);

    const isCorrect = selectedOption === QUIZ_QUESTIONS[currentQuestionIndex].correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      triggerSoundCue('success');
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } else {
      triggerSoundCue('alert');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setHasSubmitted(false);
    } else {
      setQuizCompleted(true);
      triggerSoundCue('success');
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
      });
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setHasSubmitted(false);
    setScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl glass-card bg-white/80 dark:bg-slate-900/80 border border-[#E7EAF2] dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B6B]">
            Cognitive Comprehension Engine
          </span>
          <h1 className="text-xl font-bold text-[#24324A] dark:text-white">
            Smart Summaries, Flashcards & Mastery Quiz
          </h1>
          <p className="text-xs text-[#64748B] dark:text-slate-400">
            Topic: {activeMaterial.title}
          </p>
        </div>

        {/* 3 Main Action Subtabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F7F9FC] dark:bg-slate-800 rounded-xl border border-[#E7EAF2] dark:border-slate-700">
          <button
            onClick={() => setActiveSubTab('summary')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              activeSubTab === 'summary'
                ? 'bg-white dark:bg-slate-900 text-[#FF6B6B] shadow-xs'
                : 'text-[#64748B] dark:text-slate-400 hover:text-[#24324A] dark:hover:text-white'
            }`}
          >
            Summary Tiers
          </button>
          <button
            onClick={() => setActiveSubTab('flashcards')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              activeSubTab === 'flashcards'
                ? 'bg-white dark:bg-slate-900 text-[#2EC4B6] shadow-xs'
                : 'text-[#64748B] dark:text-slate-400 hover:text-[#24324A] dark:hover:text-white'
            }`}
          >
            Flashcards
          </button>
          <button
            onClick={() => setActiveSubTab('quiz')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              activeSubTab === 'quiz'
                ? 'bg-white dark:bg-slate-900 text-[#9B8AFB] shadow-xs'
                : 'text-[#64748B] dark:text-slate-400 hover:text-[#24324A] dark:hover:text-white'
            }`}
          >
            Mastery Quiz
          </button>
        </div>
      </div>

      {/* SUBTAB 1: 3-TIER SUMMARY */}
      {activeSubTab === 'summary' && (
        <div className="space-y-6">
          {/* Tier Switcher Pills */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setActiveTier('simple')}
              className={`p-3 rounded-xl border text-left transition ${
                activeTier === 'simple'
                  ? 'bg-[#2EC4B6]/10 border-[#2EC4B6] text-[#24324A] dark:text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-[#E7EAF2] dark:border-slate-800 text-[#64748B]'
              }`}
            >
              <div className="text-xs font-bold text-[#2EC4B6]">Tier 1: Simple (ELIF5)</div>
              <div className="text-[11px] text-[#64748B] line-clamp-1">Plain language, active voice, bulleted</div>
            </button>

            <button
              onClick={() => setActiveTier('medium')}
              className={`p-3 rounded-xl border text-left transition ${
                activeTier === 'medium'
                  ? 'bg-[#F4B942]/10 border-[#F4B942] text-[#24324A] dark:text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-[#E7EAF2] dark:border-slate-800 text-[#64748B]'
              }`}
            >
              <div className="text-xs font-bold text-[#F4B942]">Tier 2: Medium (High School)</div>
              <div className="text-[11px] text-[#64748B] line-clamp-1">Balanced concepts & standard vocabulary</div>
            </button>

            <button
              onClick={() => setActiveTier('detailed')}
              className={`p-3 rounded-xl border text-left transition ${
                activeTier === 'detailed'
                  ? 'bg-[#9B8AFB]/10 border-[#9B8AFB] text-[#24324A] dark:text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-[#E7EAF2] dark:border-slate-800 text-[#64748B]'
              }`}
            >
              <div className="text-xs font-bold text-[#9B8AFB]">Tier 3: Detailed (Academic)</div>
              <div className="text-[11px] text-[#64748B] line-clamp-1">Rigorous biochemical & historical analysis</div>
            </button>
          </div>

          {/* Summary Content Card */}
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-[#E7EAF2] dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7EAF2] dark:border-slate-800">
              <h2 className="font-bold text-sm text-[#24324A] dark:text-white capitalize">
                {activeTier} Summary Overview
              </h2>
              <button
                onClick={() => {
                  const txt = activeTier === 'simple'
                    ? 'Glycolysis is like cutting a large sandwich in half. Energy is made step by step.'
                    : activeMaterial.summary;
                  playSpeech(txt);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#2EC4B6]/10 text-[#2EC4B6] hover:bg-[#2EC4B6]/20 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen to Summary</span>
              </button>
            </div>

            {activeTier === 'simple' && (
              <div className="space-y-4 text-sm leading-relaxed text-[#24324A] dark:text-slate-100">
                <p className="font-semibold text-[#2EC4B6]">
                  Here is the big idea explained simply:
                </p>
                <ul className="space-y-3 list-disc pl-5">
                  <li><strong>Your body makes battery energy:</strong> Cells take the sugar from the food you eat and convert it into tiny energy packets called ATP.</li>
                  <li><strong>Step 1 happens without air:</strong> In the outer part of the cell, sugar gets chopped in half to make two small pieces and a tiny bit of energy.</li>
                  <li><strong>The powerhouse finishes the job:</strong> Inside the mitochondria, oxygen helps pull tiny charges along a wire to make 90% of your energy.</li>
                  <li><strong>Water is the clean byproduct:</strong> Oxygen grabs the extra charges and makes clean water inside you.</li>
                </ul>
              </div>
            )}

            {activeTier === 'medium' && (
              <div className="space-y-4 text-sm leading-relaxed text-[#24324A] dark:text-slate-100">
                <p>
                  Cellular respiration is the biochemical process that converts chemical energy in glucose into readily usable ATP.
                  The process occurs in three coordinated stages:
                </p>
                <ol className="space-y-2 list-decimal pl-5">
                  <li><strong>Glycolysis:</strong> An anaerobic 10-step sequence in the cytoplasm yielding 2 net ATP and 2 NADH per glucose.</li>
                  <li><strong>The Citric Acid Cycle:</strong> Occurring in the mitochondrial matrix, Acetyl-CoA is oxidized to produce CO2, NADH, FADH2, and ATP.</li>
                  <li><strong>Oxidative Phosphorylation:</strong> The electron transport chain pumps protons across the inner mitochondrial membrane, driving ATP Synthase to synthesize the vast majority of cellular ATP via chemiosmosis.</li>
                </ol>
              </div>
            )}

            {activeTier === 'detailed' && (
              <div className="space-y-4 text-sm leading-relaxed text-[#24324A] dark:text-slate-100">
                <p>
                  Aerobic catabolism couples the free energy release of glucose oxidation (ΔG°' = -686 kcal/mol) with endergonic ATP synthesis.
                  In stage 1, cytoplasmic hexokinase and phosphofructokinase-1 regulate substrate-level phosphorylation. In stage 2, the multi-enzyme pyruvate dehydrogenase complex performs oxidative decarboxylation, feeding Acetyl-CoA into the mitochondrial tricarboxylic acid (TCA) cycle.
                </p>
                <p>
                  In stage 3, Complexes I, III, and IV establish a 140 mV electrochemical proton gradient (proton motive force). Rotational catalysis of ATP Synthase's F1 catalytic domain produces approximately 2.5 ATP per NADH and 1.5 ATP per FADH2, governed by Peter Mitchell's chemiosmotic hypothesis.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: FLASHCARDS */}
      {activeSubTab === 'flashcards' && (
        <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-[#E7EAF2] dark:border-slate-800 shadow-xs flex flex-col items-center space-y-6">
          <div className="w-full flex items-center justify-between text-xs text-[#64748B] dark:text-slate-400">
            <span>Card {currentFlashcardIndex + 1} of {FLASHCARDS.length}</span>
            <span>Click card to reveal answer</span>
          </div>

          {/* Interactive Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full max-w-lg aspect-[16/10] rounded-2xl p-8 border-2 border-[#2EC4B6]/30 bg-gradient-to-br from-[#FFFDF8] to-[#EFFBF9] dark:from-slate-900 dark:to-slate-800 shadow-md cursor-pointer flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-[1.02]"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2EC4B6] mb-3">
              {isFlipped ? 'Answer / Explanation' : 'Concept Question'}
            </span>
            <p className="text-base sm:text-lg font-bold text-[#24324A] dark:text-white leading-relaxed">
              {isFlipped ? FLASHCARDS[currentFlashcardIndex].back : FLASHCARDS[currentFlashcardIndex].front}
            </p>
            <span className="text-[11px] text-[#64748B] dark:text-slate-400 mt-4">
              (Click to {isFlipped ? 'show question' : 'flip'})
            </span>
          </div>

          {/* Card Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentFlashcardIndex((prev) => Math.max(0, prev - 1));
              }}
              disabled={currentFlashcardIndex === 0}
              className="px-4 py-2 rounded-xl bg-[#F7F9FC] dark:bg-slate-800 text-[#64748B] dark:text-slate-300 hover:text-[#24324A] dark:hover:text-white disabled:opacity-40 text-xs font-bold transition"
            >
              Previous Card
            </button>
            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentFlashcardIndex((prev) => Math.min(FLASHCARDS.length - 1, prev + 1));
              }}
              disabled={currentFlashcardIndex === FLASHCARDS.length - 1}
              className="px-4 py-2 rounded-xl bg-[#2EC4B6] text-white hover:bg-[#25ab9e] disabled:opacity-40 text-xs font-bold transition"
            >
              Next Card
            </button>
          </div>
        </div>
      )}

      {/* SUBTAB 3: MASTERY QUIZ */}
      {activeSubTab === 'quiz' && (
        <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-[#E7EAF2] dark:border-slate-800 shadow-xs space-y-6">
          {quizCompleted ? (
            /* Quiz Completion Screen */
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#2EC4B6]/15 text-[#2EC4B6] flex items-center justify-center mx-auto">
                <Award className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#24324A] dark:text-white">
                Quiz Completed! 🎉
              </h2>
              <p className="text-sm text-[#64748B] dark:text-slate-300">
                You scored <strong>{score} out of {QUIZ_QUESTIONS.length}</strong> ({Math.round((score / QUIZ_QUESTIONS.length) * 100)}%)
              </p>
              <button
                onClick={handleResetQuiz}
                className="mt-4 px-6 py-2.5 rounded-xl bg-[#2EC4B6] text-white font-bold text-xs hover:bg-[#25ab9e] transition shadow-xs"
              >
                Retake Quiz
              </button>
            </div>
          ) : (
            /* Active Question Screen */
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs text-[#64748B] dark:text-slate-400 pb-3 border-b border-[#E7EAF2] dark:border-slate-800">
                <span>Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}</span>
                <span className="font-semibold text-[#2EC4B6]">Current Score: {score}</span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-[#24324A] dark:text-white">
                {QUIZ_QUESTIONS[currentQuestionIndex].question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {QUIZ_QUESTIONS[currentQuestionIndex].options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === QUIZ_QUESTIONS[currentQuestionIndex].correctIndex;

                  let borderClass = 'border-[#E7EAF2] dark:border-slate-800 hover:border-[#2EC4B6]';
                  let bgClass = 'bg-[#F7F9FC] dark:bg-slate-800/60 text-[#24324A] dark:text-slate-100';

                  if (hasSubmitted) {
                    if (isCorrect) {
                      borderClass = 'border-[#2EC4B6] ring-1 ring-[#2EC4B6]';
                      bgClass = 'bg-[#2EC4B6]/10 text-[#2EC4B6] dark:text-[#38D9FF] font-semibold';
                    } else if (isSelected && !isCorrect) {
                      borderClass = 'border-[#FF6B6B] ring-1 ring-[#FF6B6B]';
                      bgClass = 'bg-[#FF6B6B]/10 text-[#FF6B6B]';
                    }
                  } else if (isSelected) {
                    borderClass = 'border-[#2EC4B6] ring-1 ring-[#2EC4B6]';
                    bgClass = 'bg-[#2EC4B6]/10 text-[#2EC4B6] dark:text-[#38D9FF] font-semibold';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={hasSubmitted}
                      className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition flex items-center justify-between ${borderClass} ${bgClass}`}
                    >
                      <span>{opt}</span>
                      {hasSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-[#2EC4B6] shrink-0" />}
                      {hasSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-[#FF6B6B] shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box */}
              {hasSubmitted && (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-[#24324A] dark:text-amber-200">
                  <span className="font-bold">Explanation: </span>
                  {QUIZ_QUESTIONS[currentQuestionIndex].explanation}
                </div>
              )}

              {/* Footer Actions */}
              <div className="pt-4 flex justify-end gap-3">
                {!hasSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    className="px-5 py-2.5 rounded-xl bg-[#2EC4B6] hover:bg-[#25ab9e] disabled:opacity-40 text-white font-bold text-xs transition"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-5 py-2.5 rounded-xl bg-[#2EC4B6] hover:bg-[#25ab9e] text-white font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <span>{currentQuestionIndex + 1 === QUIZ_QUESTIONS.length ? 'View Results' : 'Next Question'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
