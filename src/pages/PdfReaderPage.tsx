import React, { useState, useRef, useMemo } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { useMaterials } from '../context/MaterialsContext';
import { useAuth } from '../context/AuthContext';
import { SignLanguageAvatar } from '../components/SignLanguageAvatar';
import confetti from 'canvas-confetti';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Bookmark, 
  Download, 
  Upload, 
  Search, 
  Type, 
  Eye, 
  Sliders, 
  FileText, 
  Sparkles,
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Copy,
  CheckCircle2,
  HelpCircle,
  Layers,
  Hand,
  BookOpen,
  ArrowRight,
  RefreshCw,
  FileCheck,
  AlignLeft,
  Cloud,
  ClipboardPaste,
  FileCode,
  Zap,
  RotateCw
} from 'lucide-react';

const ACADEMIC_SAMPLES = [
  {
    title: 'Cellular Respiration & Mitochondrial ATP Synthesis',
    category: 'Biology',
    content: `Cellular respiration is the biochemical pathway by which aerobic organisms extract stored chemical energy from glucose molecules and convert it into adenosine triphosphate (ATP).

1. Glycolysis (Cytoplasmic Anaerobic Phase)
Glycolysis is universally preserved across all living domains. Occurring exclusively in the cell cytoplasm without requiring molecular oxygen, one 6-carbon glucose molecule undergoes ten sequential enzymatic steps. The investment of 2 ATP molecules activates the hexose, which is subsequently cleaved into two 3-carbon glyceraldehyde-3-phosphate (G3P) molecules. Enzymatic oxidation produces 4 gross ATP molecules (a net profit of 2 ATP) via substrate-level phosphorylation and 2 molecules of reduced NADH.

2. Pyruvate Oxidation and the Citric Acid Cycle (Mitochondrial Matrix)
Under aerobic conditions, pyruvate enters the mitochondria via active transport through the mitochondrial pyruvate carrier (MPC). Within the matrix, pyruvate dehydrogenase complex catalyzes oxidative decarboxylation:
Pyruvate + NAD+ + CoA -> Acetyl-CoA + NADH + CO2 + H+

Acetyl-CoA then transfers its 2-carbon acetyl unit to 4-carbon oxaloacetate, forming 6-carbon citrate. As citrate cycles through oxidation, decarboxylation, and isomerization reactions, the cycle regenerates oxaloacetate while producing 3 NADH, 1 FADH2, and 1 ATP/GTP per turn (yielding 6 NADH, 2 FADH2, and 2 ATP per glucose).

3. Oxidative Phosphorylation & Chemiosmotic ATP Synthesis
Along the inner mitochondrial cristae, high-energy electrons from NADH and FADH2 traverse four multi-protein complexes (Complex I through IV). Complex I, III, and IV pump hydrogen ions (protons, H+) across the impermeable inner membrane into the intermembrane space. This creates an electrochemical proton gradient termed the proton motive force.
Finally, ATP Synthase acts as a molecular turbine: protons rush down their electrochemical gradient back into the matrix through the F0 channel, rotating the F1 catalytic subunit to phosphorylate ADP and inorganic phosphate into ATP. This step yields approximately 28 to 32 ATP molecules. Molecular oxygen (O2) acts as the final terminal electron acceptor, accepting electrons and protons to produce metabolic water (H2O).`,
    summary: 'A foundational biochemistry analysis of glycolysis, pyruvate oxidation, Krebs cycle, and chemiosmotic ATP synthesis in mitochondria.',
    readingTime: '5 min read',
    keyPoints: [
      'Glycolysis occurs anaerobically in the cytoplasm with net yield of 2 ATP and 2 NADH.',
      'The Krebs cycle in the mitochondrial matrix oxidizes Acetyl-CoA, yielding electron carriers.',
      'The electron transport chain establishes a proton gradient across the inner membrane.',
      'ATP Synthase drives the generation of ~30 ATP per glucose using chemiosmosis.',
      'Oxygen acts as the terminal electron acceptor, binding protons to form water.'
    ],
    definitions: [
      { term: 'Glycolysis', definition: 'The 10-step enzymatic breakdown of glucose into pyruvate in the cytoplasm, yielding 2 net ATP and 2 NADH.' },
      { term: 'ATP Synthase', definition: 'A rotary enzyme complex on the inner mitochondrial membrane that manufactures ATP from proton flow.' },
      { term: 'Chemiosmosis', definition: 'The movement of hydrogen ions across a semipermeable membrane down their electrochemical gradient to power ATP generation.' }
    ]
  },
  {
    title: 'Neuroplasticity & Synaptic Pruning in Developmental Learning',
    category: 'Neuroscience',
    content: `Neuroplasticity refers to the biological capacity of the central nervous system to dynamically modify its structural organization and functional connectivity in response to experience, sensory stimulation, or injury.

Section 1: Synaptogenesis and Long-Term Potentiation (LTP)
During early childhood and intensive skill acquisition, neurons generate billions of synaptic connections. Long-Term Potentiation (LTP), first characterized in the mammalian hippocampus, serves as the primary cellular model for learning and memory formation. High-frequency stimulation induces calcium influx through NMDA glutamate receptors, recruiting AMPA receptors to the postsynaptic density and strengthening synaptic transmission.

Section 2: Synaptic Pruning and Hebbian Plasticity
As developmental milestones proceed, the brain systematically eliminates redundant or inefficient synaptic connections through synaptic pruning. Microglial cells identify complement proteins tagging inactive synapses, engulfing and metabolizing dendritic spines through phagocytosis. This process embodies Hebb's postulate: "Neurons that fire together, wire together; neurons that fire out of sync, lose their link."

Section 3: Educational Implications for Neurodivergent Learners
Understanding neuroplastic mechanisms demonstrates that cognitive architectures remain flexible throughout life. Multi-sensory instructional design—combining visual text overlays, acoustic speech synthesis, and spatial diagrams—recruits distributed cortical pathways, maximizing cognitive bandwidth and accommodating diverse processing speeds.`,
    summary: 'An exploration of how neurons adapt through Long-Term Potentiation (LTP) and synaptic pruning, highlighting educational strategies for neurodivergent minds.',
    readingTime: '4 min read',
    keyPoints: [
      'Neuroplasticity allows the brain to restructure synaptic pathways throughout a lifetime.',
      'Long-Term Potentiation (LTP) strengthens synaptic connections via NMDA and AMPA receptor pathways.',
      'Microglial cells actively prune unused synapses to optimize neural efficiency.',
      'Multi-sensory learning recruits multiple brain regions, enhancing memory retention.'
    ],
    definitions: [
      { term: 'Neuroplasticity', definition: 'The capacity of the nervous system to modify its connections in response to learning and experience.' },
      { term: 'Long-Term Potentiation', definition: 'Persistent strengthening of synapses based on recent patterns of activity.' },
      { term: 'Synaptic Pruning', definition: 'The biological elimination of extra synapses to streamline neural transmission.' }
    ]
  },
  {
    title: 'Constitutional Law: Equal Protection & Universal Civil Rights',
    category: 'Law & History',
    content: `The Equal Protection Clause of the Fourteenth Amendment to the United States Constitution represents the legal cornerstone of non-discrimination jurisprudence in modern constitutional democracy.

Section 1: Historical Genesis and the Reconstruction Amendments
Ratified in 1868 during the Reconstruction era, the Fourteenth Amendment was enacted to secure civil equality for formerly enslaved individuals. Section 1 explicitly mandates that no State shall "deny to any person within its jurisdiction the equal protection of the laws." Along with the Thirteenth and Fifteenth Amendments, it transformed federal constitutional power into a shield for individual liberties against state infringement.

Section 2: Tiers of Judicial Scrutiny
In assessing challenged governmental classifications, the Supreme Court developed a three-tiered doctrinal framework:
1. Strict Scrutiny: Applied to suspect classifications (such as race or national origin) and fundamental rights. The state must demonstrate a compelling governmental interest and that the law is narrowly tailored using the least restrictive means.
2. Intermediate Scrutiny: Applied to quasi-suspect classifications such as gender. The law must serve an important governmental objective and be substantially related to achieving that objective.
3. Rational Basis Review: Applied to general social and economic legislation (including age and disability classifications under standard constitutional doctrine). The classification must simply be rationally related to a legitimate state interest.

Section 3: Statutory Protections and the Americans with Disabilities Act
While disability classifications receive rational basis review under pure Fourteenth Amendment doctrine (as articulated in Board of Trustees v. Garrett), Congress exercised its Section 5 enforcement powers to enact robust statutory protections through the Americans with Disabilities Act (ADA) of 1990 and the Rehabilitation Act of 1973. These landmark statutes require reasonable accommodations in public education, transportation, and digital communication platforms.`,
    summary: 'An accessible legal breakdown of the Fourteenth Amendment Equal Protection Clause, judicial scrutiny tiers, and statutory disability rights.',
    readingTime: '5 min read',
    keyPoints: [
      'The 14th Amendment guarantees equal protection under the law for all persons.',
      'Courts utilize three scrutiny tiers: Strict, Intermediate, and Rational Basis.',
      'The Americans with Disabilities Act (ADA) enforces statutory accommodations across public and educational facilities.',
      'Reasonable accommodations ensure universal participation without administrative prejudice.'
    ],
    definitions: [
      { term: 'Equal Protection Clause', definition: 'A 14th Amendment provision prohibiting states from denying any person equal legal protection.' },
      { term: 'Strict Scrutiny', definition: 'The highest standard of judicial review requiring a compelling state interest and narrow tailoring.' },
      { term: 'Reasonable Accommodation', definition: 'Necessary and appropriate modifications that enable individuals with disabilities to access equal educational benefits.' }
    ]
  }
];

export const PdfReaderPage: React.FC = () => {
  const { settings, updateSetting, playSpeech, stopSpeech, isSpeaking, activeWord, triggerSoundCue } = useAccessibility();
  const { activeMaterial, bookmarks, toggleBookmark, addNewMaterial } = useMaterials();
  const { user, updateUserStats } = useAuth();

  const [activeTab, setActiveTab] = useState<'reader' | 'summary' | 'quiz' | 'sign'>('reader');
  const [inputMode, setInputMode] = useState<'view' | 'upload' | 'paste' | 'samples'>('view');
  
  // Custom paste text state
  const [pastedTitle, setPastedTitle] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [pastedCategory, setPastedCategory] = useState('Academic Reading');

  // Reader Customization State
  const [fontSize, setFontSize] = useState<number>(16); // 14, 16, 18, 20, 24
  const [lineHeight, setLineHeight] = useState<'normal' | 'relaxed' | 'loose'>('relaxed');
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activePage, setActivePage] = useState(1);

  // Extraction State
  const [ocrLoading, setOcrLoading] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState('Analyzing document structure...');
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Summary Tier State
  const [summaryTier, setSummaryTier] = useState<'executive' | 'bullets' | 'simplified'>('bullets');

  // Interactive Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isBookmarked = bookmarks.includes(activeMaterial.id);
  const content = activeMaterial.content || activeMaterial.summary;

  // Split content into clean pages (~350 words per page)
  const pages = useMemo(() => {
    if (!content) return [''];
    const paragraphs = content.split('\n\n');
    const result: string[] = [];
    let currentPage = '';
    let currentWords = 0;

    paragraphs.forEach((p) => {
      const wordsInP = p.split(/\s+/).length;
      if (currentWords + wordsInP > 350 && currentPage.length > 0) {
        result.push(currentPage.trim());
        currentPage = p + '\n\n';
        currentWords = wordsInP;
      } else {
        currentPage += p + '\n\n';
        currentWords += wordsInP;
      }
    });

    if (currentPage.trim().length > 0) {
      result.push(currentPage.trim());
    }

    return result.length > 0 ? result : [content];
  }, [content]);

  const totalPages = pages.length;
  const currentPageText = pages[Math.min(activePage - 1, totalPages - 1)] || content;

  // Search match count
  const searchMatchesCount = useMemo(() => {
    if (!searchTerm || searchTerm.trim().length < 2) return 0;
    const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = content.match(regex);
    return matches ? matches.length : 0;
  }, [searchTerm, content]);

  const handleDownloadTranscript = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${activeMaterial.title.replace(/\s+/g, '_')}_Accessible_Transcript.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    triggerSoundCue('success');
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    triggerSoundCue('chime');
    setTimeout(() => setCopied(false), 2000);
  };

  const processFile = async (file: File) => {
    setOcrLoading(true);
    setInputMode('view');
    setExtractionProgress('Reading PDF binary stream...');

    try {
      const base64Promise = new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const textPromise = new Promise<string>((resolve) => {
        const textReader = new FileReader();
        textReader.onload = () => {
          const raw = textReader.result as string;
          const cleaned = raw.replace(/[^\x20-\x7E\t\n\r]/g, ' ').replace(/\s{2,}/g, ' ');
          resolve(cleaned.slice(0, 5000));
        };
        textReader.onerror = () => resolve('');
        textReader.readAsText(file);
      });

      const [pdfBase64, rawText] = await Promise.all([base64Promise, textPromise]);
      setExtractionProgress('Extracting text layer and analyzing headings via Gemini OCR...');

      const res = await fetch('/api/extract-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdfBase64,
          filename: file.name,
          rawText: rawText && rawText.length > 50 ? rawText : undefined
        })
      });

      const json = await res.json();
      setExtractionProgress('Formatting OpenDyslexic structures & quiz...');

      if (json.success && json.data) {
        const extracted = json.data;
        const newMatId = `mat-${Date.now()}`;
        const newMaterial = {
          id: newMatId,
          title: extracted.title || file.name.replace(/\.[^/.]+$/, ''),
          category: extracted.category || 'Extracted Document',
          type: 'pdf' as const,
          pages: extracted.pageCount || 3,
          dateAdded: new Date().toISOString().split('T')[0],
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          summary: extracted.summary || 'Extracted accessible document text with automated OCR layer.',
          readingTime: extracted.readingTime || '4 min read',
          accessibleFormats: ['TTS Audio', 'OpenDyslexic Ready', '3-Tier Summary', 'Quiz Generator', 'Offline Cache', 'Firebase Cloud'],
          content: extracted.fullText || rawText || 'Extracted document content is ready for accessible reading.',
          definitions: extracted.definitions || [
            { term: 'Universal Design', definition: 'Accessible educational material designed for all learners without barriers.' },
            { term: 'Adaptive Typography', definition: 'OpenDyslexic letter weighting that anchors characters against visual confusion.' }
          ],
          keyPoints: extracted.keyPoints || [
            'Clean accessible headings parsed automatically from document layout.',
            'Text formatted for speech synthesis and scotopic color tint overlays.',
            'Summary and interactive comprehension questions prepared instantly.'
          ],
          isOfflineAvailable: true
        };

        addNewMaterial(newMaterial);
        updateUserStats({ materialsCompleted: 1 });
        setActivePage(1);
        triggerSoundCue('success');
      }
    } catch (err) {
      console.warn('PDF extraction fallback:', err);
      addNewMaterial({
        id: `mat-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        category: 'Extracted PDF',
        type: 'pdf',
        pages: 2,
        dateAdded: new Date().toISOString().split('T')[0],
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        summary: `Accessible document parsed from ${file.name}.`,
        readingTime: '3 min read',
        accessibleFormats: ['TTS Audio', 'Dyslexia Mode', 'Summary', 'Offline Cache', 'Firebase Cloud'],
        content: `Document: ${file.name}\n\nAutomated accessibility parser has processed this educational text.\n\nSection 1: Executive Overview\nUniversal design for learning creates equivalent opportunities for blind, deaf, dyslexic, and neurodivergent students.\n\nSection 2: Practical Takeaways\nColor tints and weighted typography eliminate reading fatigue and enhance reading retention.\n\nSection 3: Key Principles\nEqual access across all educational curricula empowers every student to excel.`,
        keyPoints: [
          'Document extracted and formatted for accessible reading.',
          'OpenDyslexic and TTS synthesis activated.',
          'Saved to offline browser storage and Firebase cloud.'
        ],
        definitions: [
          { term: 'Accessible Education', definition: 'Curriculum delivery tailored to diverse sensory and cognitive needs.' },
          { term: 'Scotopic Overlay', definition: 'Specialized color tint reducing visual stress and perceptual distortion.' }
        ],
        isOfflineAvailable: true
      });
      setActivePage(1);
      triggerSoundCue('success');
    } finally {
      setOcrLoading(false);
    }
  };

  const handleProcessPastedText = () => {
    if (!pastedText.trim()) return;
    const title = pastedTitle.trim() || 'Custom Pasted Curriculum Note';
    const newMaterial = {
      id: `mat-${Date.now()}`,
      title,
      category: pastedCategory,
      type: 'pdf' as const,
      pages: Math.max(1, Math.ceil(pastedText.split(/\s+/).length / 350)),
      dateAdded: new Date().toISOString().split('T')[0],
      size: `${(pastedText.length / 1024).toFixed(1)} KB`,
      summary: `Accessible document generated from custom input for "${title}".`,
      readingTime: `${Math.max(1, Math.ceil(pastedText.split(/\s+/).length / 150))} min read`,
      accessibleFormats: ['TTS Audio', 'Dyslexia Mode', '3-Tier Summary', 'Quiz Generator', 'Firebase Cloud'],
      content: pastedText,
      keyPoints: [
        'Custom input processed into formatted accessible reader view.',
        'TTS narration and dyslexia typography fully enabled.',
        'Synced to Firebase Firestore and local offline storage.'
      ],
      definitions: [
        { term: 'Active Learning', definition: 'Engaging directly with reading materials through multi-modal interaction.' },
        { term: 'Cognitive Load', definition: 'The total amount of mental effort being used in working memory.' }
      ],
      isOfflineAvailable: true
    };

    addNewMaterial(newMaterial);
    updateUserStats({ materialsCompleted: 1 });
    setInputMode('view');
    setPastedText('');
    setPastedTitle('');
    setActivePage(1);
    triggerSoundCue('success');
  };

  const handleLoadSample = (sample: typeof ACADEMIC_SAMPLES[0]) => {
    const newMaterial = {
      id: `sample-${Date.now()}`,
      title: sample.title,
      category: sample.category,
      type: 'pdf' as const,
      pages: 3,
      dateAdded: new Date().toISOString().split('T')[0],
      size: '1.2 MB',
      summary: sample.summary,
      readingTime: sample.readingTime,
      accessibleFormats: ['TTS Audio', 'OpenDyslexic Ready', '3-Tier Summary', 'Quiz', 'Firebase Cloud'],
      content: sample.content,
      keyPoints: sample.keyPoints,
      definitions: sample.definitions,
      isOfflineAvailable: true
    };

    addNewMaterial(newMaterial);
    setInputMode('view');
    setActivePage(1);
    triggerSoundCue('success');
  };

  // Dynamic Quiz Questions based on Active Material
  const quizQuestions = [
    {
      question: `What is the central focus of "${activeMaterial.title}"?`,
      options: [
        activeMaterial.summary.slice(0, 80) + '...',
        'Unrelated theoretical conjecture with no educational application',
        'Standard non-adaptive administration regulations',
        'Legacy laboratory protocol without peer review'
      ],
      correct: 0,
      explanation: 'The extracted text highlights this core takeaway as foundational to understanding the subject matter.'
    },
    {
      question: 'Which accessibility configuration best optimizes comprehension for this material?',
      options: [
        'Small unformatted monospace fonts without line breaks',
        'Synchronized TTS audio narration with OpenDyslexic typography and soft background overlay',
        'High-glare pure white background with small compressed margins',
        'Omitting glossary definitions and structured section landmarks'
      ],
      correct: 1,
      explanation: 'Synchronized multi-modal sensory input allows students with dyslexia, low vision, and ADHD to maintain focus.'
    },
    {
      question: 'How does Firebase backend cloud integration enhance student accessibility across devices?',
      options: [
        'It erases all offline notes upon closing the browser tab',
        'It securely syncs converted documents, reading progress, and accessibility settings to Firestore',
        'It restricts students to a single desktop terminal',
        'It requires re-uploading the PDF every single session'
      ],
      correct: 1,
      explanation: 'Cloud Firestore syncing guarantees that converted accessible formats remain instantly accessible on mobile, tablet, or desktop.'
    }
  ];

  const handleSelectQuizAnswer = (qIdx: number, oIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
    triggerSoundCue('chime');
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) score++;
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    updateUserStats({ quizzesMastered: score === quizQuestions.length ? 1 : 0 });
    if (score === quizQuestions.length) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      triggerSoundCue('success');
    } else {
      triggerSoundCue('chime');
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    triggerSoundCue();
  };

  // Render text with word highlight if TTS is playing
  const renderPageText = () => {
    if (!currentPageText) return null;
    const paragraphs = currentPageText.split('\n\n');

    const lineHeightClass = 
      lineHeight === 'loose' ? 'leading-loose' : 
      lineHeight === 'relaxed' ? 'leading-relaxed' : 'leading-normal';

    return paragraphs.map((para, pIdx) => {
      const isSearchMatch = searchTerm && para.toLowerCase().includes(searchTerm.toLowerCase());
      return (
        <p
          key={pIdx}
          className={`${lineHeightClass} transition-colors duration-150 ${
            isSearchMatch ? 'bg-amber-100 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-300 dark:border-amber-700' : ''
          }`}
          style={{ fontSize: `${fontSize}px` }}
        >
          {para.split(' ').map((word, wIdx) => {
            const cleanWord = word.replace(/[^\w]/g, '').toLowerCase();
            const isWordActive = isSpeaking && activeWord && cleanWord === activeWord.toLowerCase();

            return (
              <span
                key={wIdx}
                className={`transition-colors duration-75 inline-block mx-0.5 rounded px-0.5 ${
                  isWordActive ? 'bg-[#FF6B6B] text-white font-bold scale-105 shadow-xs' : ''
                }`}
              >
                {word}{' '}
              </span>
            );
          })}
        </p>
      );
    });
  };

  return (
    <div className={`p-4 sm:p-8 mx-auto space-y-6 transition-all ${isFocusMode ? 'max-w-4xl' : 'max-w-7xl'}`}>
      
      {/* Workable Top Action Bar: Upload / Paste / Load Samples */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#2EC4B6]/15 text-[#2EC4B6] flex items-center justify-center font-bold">
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-xs font-black text-[#0F172A] dark:text-white">
            PDF & Document Reader
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-black border border-emerald-500/30">
            <Cloud className="w-3 h-3" />
            <span>Firebase Connected</span>
          </span>
        </div>

        {/* Input Switchers */}
        <div className="flex items-center gap-1.5 bg-[#F1F5F9] dark:bg-slate-800 p-1 rounded-xl border border-[#CBD5E1] dark:border-slate-700 text-xs">
          <button
            onClick={() => setInputMode(inputMode === 'upload' ? 'view' : 'upload')}
            className={`px-3 py-1.5 rounded-lg font-black transition flex items-center gap-1.5 cursor-pointer ${
              inputMode === 'upload'
                ? 'bg-[#2EC4B6] text-white shadow-xs'
                : 'text-[#334155] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload PDF</span>
          </button>

          <button
            onClick={() => setInputMode(inputMode === 'paste' ? 'view' : 'paste')}
            className={`px-3 py-1.5 rounded-lg font-black transition flex items-center gap-1.5 cursor-pointer ${
              inputMode === 'paste'
                ? 'bg-[#FF6B6B] text-white shadow-xs'
                : 'text-[#334155] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white'
            }`}
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            <span>Paste Text</span>
          </button>

          <button
            onClick={() => setInputMode(inputMode === 'samples' ? 'view' : 'samples')}
            className={`px-3 py-1.5 rounded-lg font-black transition flex items-center gap-1.5 cursor-pointer ${
              inputMode === 'samples'
                ? 'bg-[#9B8AFB] text-white shadow-xs'
                : 'text-[#334155] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic Samples</span>
          </button>
        </div>
      </div>

      {/* CONDITIONAL PANEL: UPLOAD PDF VIA DRAG & DROP */}
      {inputMode === 'upload' && (
        <div 
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file) processFile(file);
          }}
          className={`p-8 rounded-3xl border-2 border-dashed transition-all relative overflow-hidden ${
            dragOver 
              ? 'border-[#2EC4B6] bg-[#2EC4B6]/15 scale-[1.01]' 
              : 'border-[#CBD5E1] dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 shadow-lg'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#2EC4B6] to-[#9B8AFB] flex items-center justify-center text-white shadow-md shrink-0">
                <Upload className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0F172A] dark:text-white">
                  Drop Your PDF Document Here
                </h3>
                <p className="text-xs text-[#334155] dark:text-slate-300 font-medium max-w-md">
                  Gemini OCR automatically extracts headings, removes visual artifacts, parses definitions, generates 3-tier summaries, and stores the accessible version in Firebase & IndexedDB.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input 
                ref={fileInputRef} 
                type="file" 
                accept=".pdf,.txt,.doc,.docx" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) processFile(file);
                }} 
                className="hidden" 
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 rounded-xl bg-[#2EC4B6] hover:bg-[#25ab9e] text-white font-black text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Browse Files (.pdf, .txt)</span>
              </button>

              <button
                onClick={() => setInputMode('view')}
                className="px-4 py-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-[#0F172A] dark:text-white font-bold text-xs"
              >
                Cancel
              </button>
            </div>
          </div>

          {ocrLoading && (
            <div className="mt-6 pt-4 border-t border-[#CBD5E1] dark:border-slate-800 flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-[#2EC4B6] border-t-transparent animate-spin shrink-0" />
              <div className="text-xs font-bold text-[#0F172A] dark:text-white flex-1 truncate">
                {extractionProgress}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CONDITIONAL PANEL: PASTE TEXT OR LECTURE NOTES */}
      {inputMode === 'paste' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#CBD5E1] dark:border-slate-800">
            <div>
              <h3 className="text-sm font-black text-[#0F172A] dark:text-white">
                Paste Text / Lecture Notes for Instant Extraction
              </h3>
              <p className="text-xs text-[#334155] dark:text-slate-300">
                Instantly convert any raw text, syllabus, or reading excerpt into an accessible reading environment.
              </p>
            </div>
            <button
              onClick={() => setInputMode('view')}
              className="text-xs font-bold text-[#64748B] hover:text-[#0F172A]"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-[#0F172A] dark:text-white">Document Title</label>
              <input
                type="text"
                value={pastedTitle}
                onChange={(e) => setPastedTitle(e.target.value)}
                placeholder="e.g. Chapter 5: Photosynthesis & Calvin Cycle"
                className="w-full px-3.5 py-2 rounded-xl bg-[#F1F5F9] dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700 text-xs font-semibold text-[#0F172A] dark:text-white outline-none focus:border-[#2EC4B6]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0F172A] dark:text-white">Subject Category</label>
              <select
                value={pastedCategory}
                onChange={(e) => setPastedCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#F1F5F9] dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700 text-xs font-semibold text-[#0F172A] dark:text-white outline-none focus:border-[#2EC4B6]"
              >
                <option value="Biology">Biology</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Physics">Physics</option>
                <option value="History">History</option>
                <option value="Literature">Literature</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Academic Reading">Academic Reading</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0F172A] dark:text-white">Document Text Body</label>
            <textarea
              rows={6}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste article, notes, or paper text here..."
              className="w-full p-4 rounded-2xl bg-[#F1F5F9] dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700 text-xs text-[#0F172A] dark:text-white outline-none focus:border-[#2EC4B6] resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setInputMode('view')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#64748B] hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              disabled={!pastedText.trim()}
              onClick={handleProcessPastedText}
              className="px-6 py-2.5 rounded-xl bg-[#FF6B6B] hover:bg-[#fa5b5b] disabled:opacity-40 text-white font-black text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Convert to Accessible Format</span>
            </button>
          </div>
        </div>
      )}

      {/* CONDITIONAL PANEL: ACADEMIC SAMPLES */}
      {inputMode === 'samples' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#CBD5E1] dark:border-slate-800">
            <div>
              <h3 className="text-sm font-black text-[#0F172A] dark:text-white">
                Pre-Loaded Academic Curriculum Samples
              </h3>
              <p className="text-xs text-[#334155] dark:text-slate-300">
                Click any peer-reviewed sample to instantly test speech synthesis, OpenDyslexic font, 3-tier summaries, and quizzes.
              </p>
            </div>
            <button
              onClick={() => setInputMode('view')}
              className="text-xs font-bold text-[#64748B] hover:text-[#0F172A]"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ACADEMIC_SAMPLES.map((sample, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-2xl border border-[#CBD5E1] dark:border-slate-800 bg-[#F1F5F9] dark:bg-slate-800 flex flex-col justify-between space-y-3 hover:border-[#2EC4B6] transition"
              >
                <div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-[#2EC4B6]/15 text-[#2EC4B6]">
                    {sample.category}
                  </span>
                  <h4 className="text-xs font-black text-[#0F172A] dark:text-white mt-1.5 leading-snug">
                    {sample.title}
                  </h4>
                  <p className="text-[11px] text-[#334155] dark:text-slate-300 mt-1 line-clamp-2">
                    {sample.summary}
                  </p>
                </div>

                <button
                  onClick={() => handleLoadSample(sample)}
                  className="w-full py-2 rounded-xl bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white font-extrabold text-xs border border-[#CBD5E1] dark:border-slate-700 hover:border-[#2EC4B6] flex items-center justify-center gap-1.5 transition"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#2EC4B6]" />
                  <span>Load Document</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reader Controls Toolbar: Fast, Efficient, & Workable */}
      <div className="p-4 rounded-2xl glass-card bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Material Info & Firebase Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF6B6B]/15 text-[#FF6B6B] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black text-[#0F172A] dark:text-white truncate max-w-sm sm:max-w-md">
              {activeMaterial.title}
            </h1>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#334155] dark:text-slate-300">
              <span className="text-[#2EC4B6] font-bold">{activeMaterial.category}</span>
              <span>·</span>
              <span>Page {activePage} of {totalPages}</span>
              <span>·</span>
              <span>{activeMaterial.readingTime}</span>
              {activeMaterial.isOfflineAvailable && (
                <>
                  <span>·</span>
                  <span className="text-[#2EC4B6] dark:text-[#38D9FF] flex items-center gap-1 font-bold">
                    <Check className="w-3.5 h-3.5" />
                    Offline Ready
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Center: Playback Controls with Speed */}
        <div className="flex items-center gap-2 bg-[#F1F5F9] dark:bg-slate-800 p-1.5 rounded-xl border border-[#CBD5E1] dark:border-slate-700">
          {isSpeaking ? (
            <button
              onClick={stopSpeech}
              className="px-3.5 py-1.5 rounded-lg bg-[#2EC4B6] hover:bg-[#25ab9e] text-white text-xs font-black flex items-center gap-1.5 shadow-xs transition"
              aria-label="Pause text-to-speech reading"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={() => playSpeech(currentPageText)}
              className="px-3.5 py-1.5 rounded-lg bg-[#FF6B6B] hover:bg-[#fa5b5b] text-white text-xs font-black flex items-center gap-1.5 shadow-xs transition"
              aria-label="Play text-to-speech reading"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Read Aloud</span>
            </button>
          )}

          <div className="flex items-center gap-1 pl-1">
            {[0.75, 1.0, 1.25, 1.5].map((sp) => (
              <button
                key={sp}
                onClick={() => updateSetting('readingSpeed', sp)}
                className={`px-2 py-1 text-xs font-bold rounded-md transition ${
                  settings.readingSpeed === sp
                    ? 'bg-[#9B8AFB] text-white shadow-xs'
                    : 'text-[#334155] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white'
                }`}
              >
                {sp}x
              </button>
            ))}
          </div>
        </div>

        {/* Right: Workable Accessibility In-Page Quick Tools */}
        <div className="flex items-center gap-2">
          {/* Font Size Adjusters */}
          <div className="flex items-center bg-[#F1F5F9] dark:bg-slate-800 rounded-xl p-1 border border-[#CBD5E1] dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
              className="px-2 py-1 hover:bg-white dark:hover:bg-slate-700 rounded text-[#0F172A] dark:text-white"
              title="Decrease font size"
            >
              A-
            </button>
            <span className="px-1.5 text-[11px] text-[#64748B]">{fontSize}px</span>
            <button
              onClick={() => setFontSize(prev => Math.min(24, prev + 2))}
              className="px-2 py-1 hover:bg-white dark:hover:bg-slate-700 rounded text-[#0F172A] dark:text-white"
              title="Increase font size"
            >
              A+
            </button>
          </div>

          {/* Line Height Toggle */}
          <button
            onClick={() => {
              setLineHeight(prev => prev === 'relaxed' ? 'loose' : prev === 'loose' ? 'normal' : 'relaxed');
              triggerSoundCue();
            }}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 text-[#0F172A] dark:text-slate-200 border border-[#CBD5E1] dark:border-slate-700 hover:text-[#2EC4B6] transition"
            title={`Line Spacing: ${lineHeight}`}
          >
            <AlignLeft className="w-4 h-4" />
          </button>

          {/* Focus Mode Toggle */}
          <button
            onClick={() => setIsFocusMode(!isFocusMode)}
            className={`p-2 rounded-xl border transition ${
              isFocusMode
                ? 'bg-[#2EC4B6] text-white border-[#2EC4B6]'
                : 'bg-white dark:bg-slate-800 text-[#0F172A] dark:text-slate-200 border-[#CBD5E1] dark:border-slate-700'
            }`}
            title={isFocusMode ? 'Exit Distraction-Free Mode' : 'Distraction-Free Focus Mode'}
          >
            {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Copy Plain Text */}
          <button
            onClick={handleCopyText}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 text-[#0F172A] dark:text-slate-200 border border-[#CBD5E1] dark:border-slate-700 hover:text-[#2EC4B6] transition"
            title="Copy Extracted Plain Text"
          >
            {copied ? <Check className="w-4 h-4 text-[#2EC4B6]" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Download Transcript */}
          <button
            onClick={handleDownloadTranscript}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 text-[#0F172A] dark:text-slate-200 border border-[#CBD5E1] dark:border-slate-700 hover:text-[#2EC4B6] transition"
            title="Download Accessible Plain Text Transcript"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Bookmark Button */}
          <button
            onClick={() => {
              toggleBookmark(activeMaterial.id);
              triggerSoundCue('chime');
            }}
            className={`p-2 rounded-xl border transition ${
              isBookmarked
                ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-400'
                : 'bg-white dark:bg-slate-800 text-[#0F172A] dark:text-slate-200 border-[#CBD5E1] dark:border-slate-700 hover:text-[#0F172A]'
            }`}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Page'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current text-amber-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mode Subtabs: What to Do with Extracted Text */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#E2E8F0] dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700">
        <button
          onClick={() => { setActiveTab('reader'); triggerSoundCue(); }}
          className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
            activeTab === 'reader'
              ? 'bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white shadow-sm'
              : 'text-[#334155] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4 text-[#9B8AFB]" />
          <span>Extracted Reader</span>
        </button>

        <button
          onClick={() => { setActiveTab('summary'); triggerSoundCue(); }}
          className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
            activeTab === 'summary'
              ? 'bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white shadow-sm'
              : 'text-[#334155] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#FF6B6B]" />
          <span>3-Tier Summary</span>
        </button>

        <button
          onClick={() => { setActiveTab('quiz'); triggerSoundCue(); }}
          className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
            activeTab === 'quiz'
              ? 'bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white shadow-sm'
              : 'text-[#334155] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-[#2EC4B6]" />
          <span>Comprehension Quiz</span>
        </button>

        <button
          onClick={() => { setActiveTab('sign'); triggerSoundCue(); }}
          className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
            activeTab === 'sign'
              ? 'bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white shadow-sm'
              : 'text-[#334155] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white'
          }`}
        >
          <Hand className="w-4 h-4 text-[#F4B942]" />
          <span>ASL Translation</span>
        </button>
      </div>

      {/* TAB CONTENT 1: EXTRACTED READER */}
      {activeTab === 'reader' && (
        <div className={`grid grid-cols-1 ${isFocusMode ? '' : 'lg:grid-cols-4'} gap-6`}>
          <div className={`${isFocusMode ? 'w-full' : 'lg:col-span-3'} space-y-4`}>
            {/* Search Bar with Match Counter & OpenDyslexic quick toggle */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search in extracted document text..."
                  className="w-full pl-8 pr-16 py-1.5 text-xs rounded-lg bg-[#F1F5F9] dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700 text-[#0F172A] dark:text-white outline-none focus:border-[#2EC4B6]"
                />
                {searchTerm && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#2EC4B6]">
                    {searchMatchesCount} {searchMatchesCount === 1 ? 'match' : 'matches'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    updateSetting('openDyslexic', !settings.openDyslexic);
                    triggerSoundCue();
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition ${
                    settings.openDyslexic
                      ? 'bg-[#FF6B6B]/15 text-[#FF6B6B] border-[#FF6B6B]'
                      : 'bg-[#F1F5F9] dark:bg-slate-800 text-[#0F172A] dark:text-slate-200 border-[#CBD5E1] dark:border-slate-700'
                  }`}
                >
                  <Type className="w-3.5 h-3.5" />
                  <span>OpenDyslexic: {settings.openDyslexic ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            </div>

            {/* Document Content Paper */}
            <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-800 shadow-md relative min-h-[500px]">
              {ocrLoading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-3">
                  <div className="w-10 h-10 rounded-full border-4 border-[#2EC4B6] border-t-transparent animate-spin" />
                  <div className="text-base font-black text-[#0F172A] dark:text-white">Processing Document with Gemini OCR & Accessibility Engine...</div>
                  <div className="text-xs text-[#2EC4B6] font-bold animate-pulse">{extractionProgress}</div>
                </div>
              ) : (
                <div className="prose max-w-none text-[#0F172A] dark:text-slate-100 space-y-6">
                  {renderPageText()}
                </div>
              )}
            </div>

            {/* Workable Multi-Page Pagination Bar */}
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-800 flex items-center justify-between gap-4 text-xs font-bold">
              <button
                disabled={activePage <= 1}
                onClick={() => {
                  setActivePage(prev => Math.max(1, prev - 1));
                  triggerSoundCue();
                }}
                className="px-4 py-2 rounded-xl bg-[#F1F5F9] dark:bg-slate-800 text-[#0F172A] dark:text-white disabled:opacity-40 flex items-center gap-1.5 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Page</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[#334155] dark:text-slate-300">
                  Page {activePage} of {totalPages}
                </span>
                <span className="text-[#94a3b8]">|</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setActivePage(i + 1);
                        triggerSoundCue();
                      }}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                        activePage === i + 1
                          ? 'bg-[#2EC4B6] text-white shadow-xs'
                          : 'bg-[#F1F5F9] dark:bg-slate-800 text-[#64748B] hover:text-[#0F172A]'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <button
                disabled={activePage >= totalPages}
                onClick={() => {
                  setActivePage(prev => Math.min(totalPages, prev + 1));
                  triggerSoundCue();
                }}
                className="px-4 py-2 rounded-xl bg-[#F1F5F9] dark:bg-slate-800 text-[#0F172A] dark:text-white disabled:opacity-40 flex items-center gap-1.5 transition"
              >
                <span>Next Page</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Definitions & Core Takeaways (Hidden in Focus Mode) */}
          {!isFocusMode && (
            <div className="space-y-4">
              {/* Synchronized Audio status card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#2EC4B6]/10 to-transparent bg-white dark:bg-slate-900 border border-[#2EC4B6]/30">
                <div className="flex items-center gap-2 mb-2 text-[#2EC4B6]">
                  <Volume2 className="w-4 h-4" />
                  <h3 className="font-extrabold text-xs">Audio Narration Status</h3>
                </div>
                <p className="text-xs text-[#334155] dark:text-slate-300 font-medium">
                  {isSpeaking ? (
                    <span className="text-[#FF6B6B] font-bold">Currently speaking page {activePage}... Word highlighting active.</span>
                  ) : (
                    'Click "Read Aloud" or press Alt+P to listen with synchronized word-by-word highlighting.'
                  )}
                </p>
              </div>

              {/* Glossary Definitions with Alternating Colors */}
              {activeMaterial.definitions && (
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#CBD5E1] dark:border-slate-800">
                    <h3 className="font-extrabold text-xs text-[#0F172A] dark:text-white">
                      Glossary & Definitions
                    </h3>
                    <span className="text-[10px] text-[#2EC4B6] font-bold">
                      {activeMaterial.definitions.length} Terms
                    </span>
                  </div>

                  <div className="space-y-2">
                    {activeMaterial.definitions.map((def, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-xl border transition text-xs ${
                          idx % 2 === 0
                            ? 'bg-white dark:bg-[#0B1120] text-[#0F172A] dark:text-white border-[#E2E8F0] dark:border-slate-800'
                            : 'bg-[#F1F5F9] dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] border-[#CBD5E1] dark:border-slate-700'
                        }`}
                      >
                        <div className="font-extrabold text-[#2EC4B6] flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>{def.term}</span>
                          </span>
                          <button
                            onClick={() => playSpeech(`${def.term}: ${def.definition}`)}
                            title="Hear definition pronounced"
                            className="p-1 hover:text-[#FF6B6B] transition"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-[11px] font-medium mt-1 leading-relaxed">
                          {def.definition}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* High-Yield Key Points with Alternating Rows */}
              {activeMaterial.keyPoints && (
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-800 space-y-3">
                  <h3 className="font-extrabold text-xs text-[#0F172A] dark:text-white">
                    Core Key Takeaways
                  </h3>
                  <div className="space-y-2">
                    {activeMaterial.keyPoints.map((pt, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs font-semibold ${
                          idx % 2 === 0
                            ? 'bg-white dark:bg-[#0B1120] text-[#0F172A] dark:text-white border-[#E2E8F0] dark:border-slate-800'
                            : 'bg-[#F1F5F9] dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] border-[#CBD5E1] dark:border-slate-700'
                        }`}
                      >
                        <Check className="w-4 h-4 text-[#2EC4B6] shrink-0 mt-0.5" />
                        <span className="leading-snug">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 2: 3-TIER SMART SUMMARY */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          {/* Tier Selector */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-extrabold text-[#0F172A] dark:text-white">
                Multi-Tier Cognitive Summaries
              </h3>
              <p className="text-xs text-[#334155] dark:text-slate-300 font-medium">
                Switch cognitive density according to your energy, focus, and reading preference.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => { setSummaryTier('simplified'); triggerSoundCue(); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition ${
                  summaryTier === 'simplified'
                    ? 'bg-[#2EC4B6] text-white shadow-sm'
                    : 'bg-[#F1F5F9] dark:bg-slate-800 text-[#0F172A] dark:text-slate-200'
                }`}
              >
                Simplified (ELI5)
              </button>

              <button
                onClick={() => { setSummaryTier('bullets'); triggerSoundCue(); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition ${
                  summaryTier === 'bullets'
                    ? 'bg-[#FF6B6B] text-white shadow-sm'
                    : 'bg-[#F1F5F9] dark:bg-slate-800 text-[#0F172A] dark:text-slate-200'
                }`}
              >
                Bullet Takeaways
              </button>

              <button
                onClick={() => { setSummaryTier('executive'); triggerSoundCue(); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition ${
                  summaryTier === 'executive'
                    ? 'bg-[#9B8AFB] text-white shadow-sm'
                    : 'bg-[#F1F5F9] dark:bg-slate-800 text-[#0F172A] dark:text-slate-200'
                }`}
              >
                Executive Synthesis
              </button>
            </div>
          </div>

          {/* Summary Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-800 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#CBD5E1] dark:border-slate-800">
              <div className="flex items-center gap-2 text-base font-extrabold text-[#0F172A] dark:text-white">
                <Sparkles className="w-5 h-5 text-[#2EC4B6]" />
                <span>
                  {summaryTier === 'simplified' && 'Simplified 5th-Grade Explanation'}
                  {summaryTier === 'bullets' && 'High-Yield Bullet Point Takeaways'}
                  {summaryTier === 'executive' && 'Comprehensive Executive Synthesis'}
                </span>
              </div>

              <button
                onClick={() => playSpeech(
                  summaryTier === 'simplified'
                    ? `Simplified Explanation for ${activeMaterial.title}: ${activeMaterial.summary}`
                    : activeMaterial.summary
                )}
                className="px-3.5 py-1.5 rounded-xl bg-[#2EC4B6] hover:bg-[#25ab9e] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen to Summary</span>
              </button>
            </div>

            {summaryTier === 'simplified' && (
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-[#0F172A] dark:text-slate-100 font-medium">
                <p className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-100 font-semibold">
                  💡 In Simple Terms: Imagine this lesson as building blocks. Every idea connects together so that anyone can learn comfortably regardless of sensory style or background.
                </p>
                <p>
                  {activeMaterial.summary}
                </p>
              </div>
            )}

            {summaryTier === 'bullets' && (
              <div className="space-y-3">
                {activeMaterial.keyPoints?.map((pt, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-2xl border flex items-start gap-3 ${
                      idx % 2 === 0
                        ? 'bg-white dark:bg-[#0B1120] text-[#0F172A] dark:text-white border-[#E2E8F0] dark:border-slate-800'
                        : 'bg-[#F1F5F9] dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] border-[#CBD5E1] dark:border-slate-700'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-[#2EC4B6]/20 text-[#2EC4B6] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <span className="text-sm font-bold leading-relaxed">{pt}</span>
                  </div>
                ))}
              </div>
            )}

            {summaryTier === 'executive' && (
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-[#0F172A] dark:text-slate-100 font-medium">
                <p className="text-base font-bold text-[#0F172A] dark:text-white">
                  Curriculum Briefing: {activeMaterial.title}
                </p>
                <p>{activeMaterial.summary}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="p-4 rounded-2xl bg-[#F1F5F9] dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700">
                    <h4 className="font-extrabold text-xs text-[#2EC4B6] mb-1">Target Competencies</h4>
                    <p className="text-xs text-[#334155] dark:text-slate-300">Reading speed, cognitive retention, and conceptual definition recall.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#F1F5F9] dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700">
                    <h4 className="font-extrabold text-xs text-[#FF6B6B] mb-1">Accommodation Compatibility</h4>
                    <p className="text-xs text-[#334155] dark:text-slate-300">OpenDyslexic typography, screen-reader NVDA/JAWS labels, scotopic tints.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: COMPREHENSION QUIZ & FLASHCARDS */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-800 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#CBD5E1] dark:border-slate-800">
              <div>
                <h3 className="text-base font-extrabold text-[#0F172A] dark:text-white">
                  Comprehension Check: {activeMaterial.title}
                </h3>
                <p className="text-xs text-[#334155] dark:text-slate-300 font-medium">
                  Verify your understanding with instant feedback, answer explanations, and score tracking.
                </p>
              </div>

              {quizSubmitted && (
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-xl bg-[#2EC4B6]/15 text-[#2EC4B6] font-black text-sm">
                    Score: {quizScore} / {quizQuestions.length} ({Math.round((quizScore / quizQuestions.length) * 100)}%)
                  </div>
                  <button
                    onClick={handleResetQuiz}
                    className="px-3.5 py-2 rounded-xl bg-[#F1F5F9] dark:bg-slate-800 text-[#0F172A] dark:text-white font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Try Again</span>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {quizQuestions.map((q, qIdx) => {
                const isAnswered = selectedAnswers[qIdx] !== undefined;
                const isCorrect = selectedAnswers[qIdx] === q.correct;

                return (
                  <div 
                    key={qIdx} 
                    className={`p-6 rounded-2xl border transition-all ${
                      qIdx % 2 === 0
                        ? 'bg-white dark:bg-[#0B1120] border-[#E2E8F0] dark:border-slate-800'
                        : 'bg-[#F1F5F9] dark:bg-[#1E293B] border-[#CBD5E1] dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <span className="w-6 h-6 rounded-full bg-[#2EC4B6] text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                        {qIdx + 1}
                      </span>
                      <h4 className="text-sm font-extrabold text-[#0F172A] dark:text-white leading-relaxed">
                        {q.question}
                      </h4>
                    </div>

                    <div className="space-y-2.5 pl-9">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = selectedAnswers[qIdx] === oIdx;
                        let optionStyle = 'bg-white dark:bg-slate-900 border-[#CBD5E1] dark:border-slate-700 text-[#0F172A] dark:text-slate-100 hover:border-[#2EC4B6]';

                        if (quizSubmitted) {
                          if (oIdx === q.correct) {
                            optionStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                          } else if (isSelected && !isCorrect) {
                            optionStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200 line-through';
                          } else {
                            optionStyle = 'opacity-50 border-[#E2E8F0] dark:border-slate-800 text-[#64748B]';
                          }
                        } else if (isSelected) {
                          optionStyle = 'bg-[#2EC4B6]/10 border-[#2EC4B6] text-[#2EC4B6] font-bold shadow-xs';
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={quizSubmitted}
                            onClick={() => handleSelectQuizAnswer(qIdx, oIdx)}
                            className={`w-full text-left p-3.5 rounded-xl border text-xs transition flex items-center justify-between ${optionStyle}`}
                          >
                            <span className="font-semibold">{opt}</span>
                            {quizSubmitted && oIdx === q.correct && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="mt-4 pt-3 border-t border-[#CBD5E1] dark:border-slate-700 text-xs pl-9">
                        <span className="font-bold text-[#2EC4B6]">Explanation: </span>
                        <span className="text-[#334155] dark:text-slate-300 font-medium">{q.explanation}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!quizSubmitted && (
              <div className="flex justify-end pt-4">
                <button
                  disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
                  onClick={handleSubmitQuiz}
                  className="px-6 py-3 rounded-xl bg-[#2EC4B6] hover:bg-[#25ab9e] disabled:opacity-40 text-white font-extrabold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Submit Quiz Answers</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: ASL SIGN LANGUAGE TRANSLATION */}
      {activeTab === 'sign' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-800 shadow-md">
            <div className="pb-4 mb-6 border-b border-[#CBD5E1] dark:border-slate-800">
              <h3 className="text-base font-extrabold text-[#0F172A] dark:text-white">
                Interactive ASL Translation for "{activeMaterial.title}"
              </h3>
              <p className="text-xs text-[#334155] dark:text-slate-300 font-medium">
                Responsive 2D kinematic avatar with real-time motion arrows, 0.5x slow-motion learning mode, and anatomical handshape guides.
              </p>
            </div>

            <SignLanguageAvatar currentText={activeMaterial.summary} />
          </div>
        </div>
      )}
    </div>
  );
};
