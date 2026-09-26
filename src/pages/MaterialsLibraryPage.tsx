import React, { useState } from 'react';
import { useMaterials } from '../context/MaterialsContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { NavigationTab } from '../components/Sidebar';
import { 
  FolderOpen, 
  Search, 
  Filter, 
  FileText, 
  Video, 
  Image as ImageIcon, 
  Volume2, 
  Bookmark, 
  ArrowRight,
  Upload,
  Plus
} from 'lucide-react';

interface MaterialsLibraryPageProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const MaterialsLibraryPage: React.FC<MaterialsLibraryPageProps> = ({ onNavigate }) => {
  const { 
    materials, 
    activeMaterial, 
    setActiveMaterialById, 
    bookmarks, 
    toggleBookmark,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    addNewMaterial
  } = useMaterials();

  const { triggerSoundCue } = useAccessibility();

  const [formatFilter, setFormatFilter] = useState<'all' | 'pdf' | 'video' | 'image' | 'audio'>('all');

  const CATEGORIES = ['All', 'Biology', 'Physics', 'History', 'Chemistry'];

  const filteredMaterials = materials.filter((m) => {
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    const matchesFormat = formatFilter === 'all' || m.type === formatFilter;
    const matchesSearch = !searchQuery || 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesFormat && matchesSearch;
  });

  const handleUploadNew = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    addNewMaterial({
      id: `mat-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      category: 'Uploaded Material',
      type: file.name.endsWith('.mp4') ? 'video' : file.name.endsWith('.mp3') ? 'audio' : file.type.startsWith('image') ? 'image' : 'pdf',
      dateAdded: new Date().toISOString().split('T')[0],
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      summary: 'Uploaded course material ready for automated accessibility conversion.',
      readingTime: '5 min read',
      accessibleFormats: ['TTS Ready', 'Dyslexia Mode', 'Text Search'],
      content: `Uploaded Document: ${file.name}\n\nThis material is ready for inclusive review. EquiLearn automatically extracted clean OCR text, added Dyslexia typography layers, and synchronized text-to-speech audio.`
    });
    triggerSoundCue('success');
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-card bg-white/80 dark:bg-slate-900/80 border border-[#E7EAF2] dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FF6B6B]/15 text-[#FF6B6B] flex items-center justify-center">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B6B]">
              Courseware Library
            </span>
            <h1 className="text-xl font-bold text-[#24324A] dark:text-white">
              Accessible Learning Materials
            </h1>
            <p className="text-xs text-[#64748B] dark:text-slate-400">
              Browse textbooks, videos, diagrams, and audio files ready for adaptive learning
            </p>
          </div>
        </div>

        {/* Upload Button */}
        <label className="px-4 py-2.5 rounded-xl bg-[#2EC4B6] hover:bg-[#25ab9e] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition">
          <Plus className="w-4 h-4" />
          <span>Upload New Material</span>
          <input type="file" onChange={handleUploadNew} className="hidden" />
        </label>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-[#E7EAF2] dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-[#2EC4B6] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#24324A] hover:bg-[#F7F9FC] dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Format Selector */}
        <div className="flex items-center gap-1 bg-[#F7F9FC] dark:bg-slate-800 p-1 rounded-xl border border-[#E7EAF2] dark:border-slate-700">
          {(['all', 'pdf', 'video', 'image', 'audio'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setFormatFilter(fmt)}
              className={`px-2.5 py-1 text-xs font-semibold capitalize rounded-lg transition ${
                formatFilter === fmt
                  ? 'bg-white dark:bg-slate-900 text-[#2EC4B6] shadow-xs'
                  : 'text-[#64748B]'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((mat) => {
          const isBookmarked = bookmarks.includes(mat.id);
          const isPdf = mat.type === 'pdf';
          const isVideo = mat.type === 'video';
          const isImage = mat.type === 'image';
          const targetTab: NavigationTab = isPdf ? 'pdf' : isVideo ? 'video' : isImage ? 'image' : 'audio';

          const Icon = isPdf ? FileText : isVideo ? Video : isImage ? ImageIcon : Volume2;
          const accentColor = isPdf ? '#FF6B6B' : isVideo ? '#F4B942' : isImage ? '#2EC4B6' : '#8ACB88';

          return (
            <div
              key={mat.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-[#E7EAF2] dark:border-slate-800 hover:border-[#2EC4B6] shadow-xs hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <button
                    onClick={() => {
                      toggleBookmark(mat.id);
                      triggerSoundCue('chime');
                    }}
                    className={`p-2 rounded-lg transition ${
                      isBookmarked
                        ? 'text-[#F4B942] bg-amber-50 dark:bg-amber-950/30'
                        : 'text-[#64748B] hover:text-[#24324A]'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  {mat.category} · {mat.readingTime || mat.duration}
                </div>

                <h3 className="font-bold text-base text-[#24324A] dark:text-white line-clamp-2 group-hover:text-[#2EC4B6] transition">
                  {mat.title}
                </h3>

                <p className="text-xs text-[#64748B] dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {mat.summary}
                </p>

                {/* Formats badges */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {mat.accessibleFormats.map((fmt, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#F7F9FC] dark:bg-slate-800 text-[#64748B]"
                    >
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Launch Button */}
              <div className="mt-6 pt-4 border-t border-[#E7EAF2] dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono text-[#64748B]">{mat.size}</span>

                <button
                  onClick={() => {
                    setActiveMaterialById(mat.id);
                    onNavigate(targetTab);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#2EC4B6] hover:bg-[#25ab9e] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                >
                  <span>Launch Reader</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
