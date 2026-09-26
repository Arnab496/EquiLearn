import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Material } from '../types';
import { 
  saveMaterialToOfflineCache, 
  saveBatchMaterialsToOfflineCache, 
  getAllCachedMaterialsFromOffline, 
  removeMaterialFromOfflineCache, 
  clearAllOfflineCache, 
  getOfflineCacheStats 
} from '../utils/offlineStorage';

interface MaterialsContextType {
  materials: Material[];
  activeMaterial: Material;
  setActiveMaterialById: (id: string) => void;
  addNewMaterial: (material: Material) => void;
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  // Browser-based offline caching
  isOnline: boolean;
  offlineSyncStatus: 'synced' | 'syncing' | 'offline';
  cachedCount: number;
  cacheSize: string;
  toggleOfflineAvailability: (id: string) => Promise<void>;
  cacheAllMaterialsOffline: () => Promise<void>;
  clearOfflineCache: () => Promise<void>;
}

const DEFAULT_MATERIALS: Material[] = [
  {
    id: 'mat-1',
    title: 'Cellular Respiration & Mitochondrial ATP Synthesis',
    category: 'Biology',
    type: 'pdf',
    pages: 4,
    dateAdded: '2026-09-24',
    size: '1.8 MB',
    summary: 'A high-yield biology review on glycolysis, pyruvate oxidation, Krebs citric acid cycle, and chemiosmosis.',
    readingTime: '6 min read',
    accessibleFormats: ['TTS Audio', 'OpenDyslexic Ready', 'Tactile Notes', 'Summary Tiers'],
    isOfflineAvailable: true,
    cachedAt: '2026-09-25T10:00:00.000Z',
    offlineSize: '18.4 KB',
    content: `Cellular respiration is the biochemical pathway by which aerobic organisms extract stored chemical energy from glucose molecules and convert it into adenosine triphosphate (ATP).

1. Glycolysis (Cytoplasmic Anaerobic Phase)
Glycolysis is universally preserved across all living domains. Occurring exclusively in the cell cytoplasm without requiring molecular oxygen, one 6-carbon glucose molecule undergoes ten sequential enzymatic steps. The investment of 2 ATP molecules activates the hexose, which is subsequent cleaved into two 3-carbon glyceraldehyde-3-phosphate (G3P) molecules. Enzymatic oxidation produces 4 gross ATP molecules (a net profit of 2 ATP) via substrate-level phosphorylation and 2 molecules of reduced NADH.

2. Pyruvate Oxidation and the Citric Acid Cycle (Mitochondrial Matrix)
Under aerobic conditions, pyruvate enters the mitochondria via active transport through the mitochondrial pyruvate carrier (MPC). Within the matrix, pyruvate dehydrogenase complex catalyzes oxidative decarboxylation:
Pyruvate + NAD+ + CoA -> Acetyl-CoA + NADH + CO2 + H+

Acetyl-CoA then transfers its 2-carbon acetyl unit to 4-carbon oxaloacetate, forming 6-carbon citrate. As citrate cycles through oxidation, decarboxylation, and isomerization reactions, the cycle regenerates oxaloacetate while producing 3 NADH, 1 FADH2, and 1 ATP/GTP per turn (yielding 6 NADH, 2 FADH2, and 2 ATP per glucose).

3. Oxidative Phosphorylation & Chemiosmotic ATP Synthesis
Along the inner mitochondrial cristae, high-energy electrons from NADH and FADH2 traverse four multi-protein complexes (Complex I through IV). Complex I, III, and IV pump hydrogen ions (protons, H+) across the impermeable inner membrane into the intermembrane space. This creates an electrochemical proton gradient termed the proton motive force.
Finally, ATP Synthase acts as a molecular turbine: protons rush down their electrochemical gradient back into the matrix through the F0 channel, rotating the F1 catalytic subunit to phosphorylate ADP and inorganic phosphate into ATP. This step yields approximately 28 to 32 ATP molecules. Molecular oxygen (O2) acts as the final terminal electron acceptor, accepting electrons and protons to produce metabolic water (H2O).`,
    definitions: [
      { term: 'Glycolysis', definition: 'The 10-step enzymatic breakdown of glucose into pyruvate in the cytoplasm, yielding 2 net ATP and 2 NADH.' },
      { term: 'ATP Synthase', definition: 'A rotary enzyme complex on the inner mitochondrial membrane that manufactures ATP from proton flow.' },
      { term: 'Chemiosmosis', definition: 'The movement of hydrogen ions across a semipermeable membrane down their electrochemical gradient to power ATP generation.' },
      { term: 'Proton Motive Force', definition: 'The combined electrical and chemical gradient across the inner mitochondrial membrane created by electron transport.' }
    ],
    keyPoints: [
      'Glycolysis occurs anaerobically in the cytoplasm with a net yield of 2 ATP.',
      'The Krebs cycle in the mitochondrial matrix oxidizes Acetyl-CoA, yielding electron carriers (NADH, FADH2).',
      'The electron transport chain establishes a proton gradient across the cristae.',
      'ATP Synthase drives the generation of ~30 ATP per glucose using chemiosmosis.',
      'Oxygen acts as the terminal electron acceptor, binding protons to form water.'
    ]
  },
  {
    id: 'mat-2',
    title: 'Ray Optics: Focal Length and Image Formation in Lenses',
    category: 'Physics',
    type: 'image',
    dateAdded: '2026-09-22',
    size: '950 KB',
    summary: 'A geometric optics diagram illustrating thin convex lenses, focal points, principal axis, and real inverted images.',
    readingTime: '3 min read',
    accessibleFormats: ['Alt-Text', 'Tactile Walkthrough', 'Audio Description', 'High Contrast'],
    isOfflineAvailable: true,
    cachedAt: '2026-09-25T10:00:00.000Z',
    offlineSize: '9.2 KB',
    diagramUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1000&q=80',
    altText: 'Diagram of a biconvex thin lens positioned on a horizontal principal axis with an upright object arrow on the left, three characteristic refracted light rays passing through the lens and converging on the right side to form an inverted real image.',
    detailedDescription: 'The diagram displays a horizontal dashed line labeled the Principal Axis. At the center sits a double convex glass lens represented by a vertical translucent blue oval. To the left of the lens is an upright vertical red arrow representing the Object at distance d_o from the optical center. Focal points F1 and F2 are marked equidistant on both sides. Three key ray paths are traced: (1) A parallel ray traveling horizontally from the tip of the object to the lens, refracting down through the focal point F2; (2) A focal ray traveling through F1 toward the lens, emerging parallel to the axis; (3) A central chief ray passing straight through the optical center without deviation. The intersection of these three refracted rays on the right produces a downward-pointing inverted green arrow representing the Real Image at distance d_i.',
    tactileDescription: 'For tactile graphic users: The principal axis runs left-to-right. A tall ridge on the left is the object (height h_o). The lens is a curved oval in the middle. Three distinct raised textured lines meet on the right at a lower inverted ridge representing the image. Notice the image is inverted because rays cross below the horizontal axis.'
  },
  {
    id: 'mat-3',
    title: 'The Atlantic Charter & Post-WWII International Alliances',
    category: 'History',
    type: 'video',
    dateAdded: '2026-09-20',
    size: '14.2 MB',
    duration: '04:15',
    summary: 'A historical video lecture discussing the August 1941 summit between Roosevelt and Churchill off Newfoundland.',
    readingTime: '4 min lecture',
    accessibleFormats: ['Whisper Captions', 'Speaker Transcript', 'ASL Translation Ready', 'Visual Summaries'],
    isOfflineAvailable: true,
    cachedAt: '2026-09-25T10:00:00.000Z',
    offlineSize: '12.5 KB',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    transcript: [
      { start: '00:00', end: '00:15', speaker: 'Prof. Davis', text: 'Welcome everyone. In today’s session, we are analyzing the pivotal diplomacy of August 1941.' },
      { start: '00:15', end: '00:38', speaker: 'Prof. Davis', text: 'President Franklin D. Roosevelt and Prime Minister Winston Churchill secretly met aboard warships in Placentia Bay, Newfoundland.' },
      { start: '00:38', end: '01:05', speaker: 'Prof. Davis', text: 'Together, they drafted the Atlantic Charter, an extraordinary joint declaration outlining eight universal principles for a post-war world.' },
      { start: '01:05', end: '01:34', speaker: 'Prof. Davis', text: 'Key provisions included no territorial aggrandizement, self-determination of peoples, global trade access, and disarmament of aggressor nations.' },
      { start: '01:34', end: '02:05', speaker: 'Prof. Davis', text: 'This historic document later served as the cornerstone foundation for both the Declaration by United Nations in 1942 and the modern UN Charter in 1945.' },
      { start: '02:05', end: '02:40', speaker: 'Prof. Davis', text: 'Notice how the principles balanced immediate wartime solidarity with a visionary institutional blueprint for international peace and security.' }
    ]
  },
  {
    id: 'mat-4',
    title: 'Organic Chemistry: Electrophilic Aromatic Substitution',
    category: 'Chemistry',
    type: 'audio',
    dateAdded: '2026-09-18',
    size: '5.4 MB',
    duration: '03:45',
    summary: 'An audio lecture breaking down the mechanism of benzene halogenation and carbocation arenium ion stability.',
    readingTime: '3 min audio',
    accessibleFormats: ['Full Text Sync', 'Sign Language Ready', 'Key Reactions Outline', 'Voice Playback'],
    isOfflineAvailable: true,
    cachedAt: '2026-09-25T10:00:00.000Z',
    offlineSize: '8.7 KB',
    audioTranscript: `Today we examine Electrophilic Aromatic Substitution, commonly abbreviated as EAS. 
Benzene is an extraordinarily stable, resonance-delocalized pi electron system. Despite its unsaturation, benzene does not readily undergo addition reactions like alkenes because addition would destroy its prized aromatic stabilization energy of 36 kcal/mol.

Instead, benzene reacts with strong electrophiles via substitution. The mechanism follows two key steps:
Step 1: The aromatic pi electron cloud attacks an activated electrophile, such as a nitronium ion (NO2+) or bromonium complex (Br+). This forms a resonance-stabilized arenium ion, also called a sigma complex or Wheland intermediate. Notice that the ring temporarily loses aromaticity in this step, making this the rate-determining endothermic step.

Step 2: A weak base deprotonates the sp3-hybridized carbon of the arenium intermediate. The electron pair from the C-H bond collapses back into the ring system, completely restoring aromatic resonance. The net result: a hydrogen atom is substituted by the electrophile, while the aromatic stability remains intact.`
  }
];

const MaterialsContext = createContext<MaterialsContextType | undefined>(undefined);

export const MaterialsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [materials, setMaterials] = useState<Material[]>(() => {
    const saved = localStorage.getItem('equilearn_materials');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_MATERIALS;
      }
    }
    return DEFAULT_MATERIALS;
  });

  const [activeMaterial, setActiveMaterial] = useState<Material>(DEFAULT_MATERIALS[0]);
  const [bookmarks, setBookmarks] = useState<string[]>(['mat-1']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Offline Caching State
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [offlineSyncStatus, setOfflineSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');
  const [cachedCount, setCachedCount] = useState<number>(DEFAULT_MATERIALS.length);
  const [cacheSize, setCacheSize] = useState<string>('58.8 KB');

  // Refresh cache stats
  const refreshCacheStats = useCallback(async () => {
    try {
      const stats = await getOfflineCacheStats();
      setCachedCount(stats.count);
      setCacheSize(stats.formattedSize);
    } catch (e) {
      console.warn('Could not read offline stats', e);
    }
  }, []);

  // Sync IndexedDB on mount
  useEffect(() => {
    let isMounted = true;

    async function initializeOfflineCache() {
      try {
        setOfflineSyncStatus('syncing');
        const cachedFromDB = await getAllCachedMaterialsFromOffline();

        if (cachedFromDB.length > 0 && isMounted) {
          // Merge cached items with in-memory state
          setMaterials((prev) => {
            const map = new Map<string, Material>();
            prev.forEach((m) => map.set(m.id, m));
            cachedFromDB.forEach((m) => map.set(m.id, { ...m, isOfflineAvailable: true }));
            return Array.from(map.values());
          });
        } else {
          // Seed defaults into IndexedDB so they are immediately available offline
          await saveBatchMaterialsToOfflineCache(DEFAULT_MATERIALS);
        }

        await refreshCacheStats();
        if (isMounted) {
          setOfflineSyncStatus(navigator.onLine ? 'synced' : 'offline');
        }
      } catch (err) {
        console.warn('Offline cache init warning:', err);
        if (isMounted) setOfflineSyncStatus('synced');
      }
    }

    initializeOfflineCache();

    // Online / Offline network listeners
    const handleOnline = () => {
      setIsOnline(true);
      setOfflineSyncStatus('synced');
    };
    const handleOffline = () => {
      setIsOnline(false);
      setOfflineSyncStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      isMounted = false;
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [refreshCacheStats]);

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('equilearn_materials', JSON.stringify(materials));
  }, [materials]);

  const setActiveMaterialById = (id: string) => {
    const found = materials.find((m) => m.id === id);
    if (found) {
      setActiveMaterial(found);
    }
  };

  /**
   * Adds newly uploaded or converted material and automatically writes it to IndexedDB browser cache
   */
  const addNewMaterial = async (newMat: Material) => {
    const enriched: Material = {
      ...newMat,
      isOfflineAvailable: true,
      cachedAt: new Date().toISOString(),
      isCustomUploaded: true
    };

    // Update in-memory state
    setMaterials((prev) => [enriched, ...prev.filter((m) => m.id !== enriched.id)]);
    setActiveMaterial(enriched);

    // Save to IndexedDB cache for offline access
    setOfflineSyncStatus('syncing');
    try {
      await saveMaterialToOfflineCache(enriched);
      await refreshCacheStats();
      setOfflineSyncStatus(isOnline ? 'synced' : 'offline');
    } catch (e) {
      console.warn('Failed to cache material to IndexedDB', e);
      setOfflineSyncStatus(isOnline ? 'synced' : 'offline');
    }
  };

  /**
   * Explicitly toggle offline availability for an individual material
   */
  const toggleOfflineAvailability = async (id: string) => {
    const target = materials.find((m) => m.id === id);
    if (!target) return;

    const willBeAvailable = !target.isOfflineAvailable;

    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isOfflineAvailable: willBeAvailable } : m))
    );

    if (willBeAvailable) {
      await saveMaterialToOfflineCache({ ...target, isOfflineAvailable: true });
    } else {
      await removeMaterialFromOfflineCache(id);
    }

    await refreshCacheStats();
  };

  /**
   * Cache all existing materials offline in a single click
   */
  const cacheAllMaterialsOffline = async () => {
    setOfflineSyncStatus('syncing');
    await saveBatchMaterialsToOfflineCache(materials);
    setMaterials((prev) => prev.map((m) => ({ ...m, isOfflineAvailable: true })));
    await refreshCacheStats();
    setOfflineSyncStatus(isOnline ? 'synced' : 'offline');
  };

  /**
   * Clear offline cache
   */
  const clearOfflineCache = async () => {
    await clearAllOfflineCache();
    setMaterials((prev) => prev.map((m) => ({ ...m, isOfflineAvailable: false })));
    await refreshCacheStats();
  };

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  return (
    <MaterialsContext.Provider
      value={{
        materials,
        activeMaterial,
        setActiveMaterialById,
        addNewMaterial,
        bookmarks,
        toggleBookmark,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        isOnline,
        offlineSyncStatus,
        cachedCount,
        cacheSize,
        toggleOfflineAvailability,
        cacheAllMaterialsOffline,
        clearOfflineCache,
      }}
    >
      {children}
    </MaterialsContext.Provider>
  );
};

export const useMaterials = () => {
  const context = useContext(MaterialsContext);
  if (!context) {
    throw new Error('useMaterials must be used within a MaterialsProvider');
  }
  return context;
};
