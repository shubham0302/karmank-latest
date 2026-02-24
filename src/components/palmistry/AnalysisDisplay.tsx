import React, { useState, useRef } from 'react';
import { AnalysisOutput, Language } from '../types';
import { ArrowLeft, ChevronDown, Download, Loader2, Globe } from 'lucide-react';
import WelcomePalmistryTab from './tabs/WelcomePalmistryTab';
import KandasTab from './tabs/KandasTab';
import TimelineTab from './tabs/TimelineTab';
import RemediesTab from './tabs/RemediesTab';
import GeometricAnalysisTab from './tabs/GeometricAnalysisTab';
import ConfidenceIndicator from './ConfidenceIndicator';
import { exportPalmistryTabToPDF, exportFullPalmistryReportToPDF } from '../../utils/pdfExport';
import { getLanguageName } from '../../services/palmistryTranslations';

interface AnalysisDisplayProps {
  data: AnalysisOutput;
  onReset: () => void;
  lang: Language;
  onLanguageChange?: (lang: Language) => void;
  palmImage?: string;
  userName?: string;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({
  data,
  onReset,
  lang,
  onLanguageChange,
  palmImage,
  userName,
}) => {
  const [activeTab, setActiveTab] = useState('Welcome');
  const [showPdfDropdown, setShowPdfDropdown] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showLangSelector, setShowLangSelector] = useState(false);
  const pdfDropdownRef = useRef<HTMLDivElement>(null);

  const tabs = ['Welcome', '12 Kandas', 'Timeline', 'Analysis', 'Remedies'];

  const getTabLabel = (tab: string) => {
    const labels: Record<string, Record<string, string>> = {
      'Welcome': { en: 'Welcome', hi: 'स्वागत', ta: 'வரவேற்பு', sa: 'स्वागतम्' },
      '12 Kandas': { en: '12 Kandas', hi: '12 कांड', ta: '12 காண்டம்', sa: '१२ काण्डानि' },
      'Timeline': { en: 'Timeline', hi: 'समयरेखा', ta: 'காலக்கோடு', sa: 'कालरेखा' },
      'Analysis': { en: 'Analysis', hi: 'विश्लेषण', ta: 'பகுப்பாய்வு', sa: 'विश्लेषणम्' },
      'Remedies': { en: 'Remedies', hi: 'उपचार', ta: 'தீர்வுகள்', sa: 'उपायाः' },
    };
    return labels[tab]?.[lang] || labels[tab]?.en || tab;
  };

  // Download current tab as PDF
  const handleDownloadCurrentTab = async () => {
    try {
      setIsDownloading(true);
      setShowPdfDropdown(false);
      await exportPalmistryTabToPDF(activeTab, userName || 'User');
    } catch (error) {
      console.error('Error downloading tab:', error);
      alert(lang === 'en' ? 'Failed to download report. Please try again.' : 'रिपोर्ट डाउनलोड करने में विफल। कृपया पुनः प्रयास करें।');
    } finally {
      setIsDownloading(false);
    }
  };

  // Download full report (all tabs) as PDF
  const handleDownloadFullReport = async () => {
    try {
      setIsDownloading(true);
      setShowPdfDropdown(false);
      await exportFullPalmistryReportToPDF(tabs, setActiveTab, userName || 'User');
    } catch (error) {
      console.error('Error downloading full report:', error);
      alert(lang === 'en' ? 'Failed to download full report. Please try again.' : 'पूर्ण रिपोर्ट डाउनलोड करने में विफल। कृपया पुनः प्रयास करें।');
    } finally {
      setIsDownloading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Welcome':
        return <WelcomePalmistryTab data={data} lang={lang} />;
      case '12 Kandas':
        return <KandasTab data={data} lang={lang} />;
      case 'Timeline':
        return <TimelineTab data={data} lang={lang} />;
      case 'Analysis':
        return <GeometricAnalysisTab data={data} lang={lang} palmImage={palmImage} />;
      case 'Remedies':
        return <RemediesTab data={data} lang={lang} />;
      default:
        return <WelcomePalmistryTab data={data} lang={lang} />;
    }
  };

  const handleLanguageChange = (newLang: Language) => {
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
  };

  // Get display name from data or use placeholder
  const displayName = userName || data.nadiLeafCategory || (lang === 'en' ? 'Seeker' : 'साधक');

  return (
    <div className="min-h-screen w-full relative">
      {/* Top Navigation Bar - Above Header */}
      <div className="flex justify-between items-center mb-6 px-4 md:px-6 pt-6">
        <button
          onClick={onReset}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-4 py-2 rounded-md text-sm font-medium transition duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          {lang === 'en' ? 'Back' : lang === 'hi' ? 'वापस' : 'Back'}
        </button>

        <div className="flex items-center gap-4">
          {/* AI Confidence Badge */}
          {data.predictionConfidence && (
            <div className="hidden md:block">
              <ConfidenceIndicator confidence={data.predictionConfidence} lang={lang} compact />
            </div>
          )}

          {/* Language Selector - Expanded */}
          <div className="relative">
            <button
              onClick={() => setShowLangSelector(!showLangSelector)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/20 text-white/80 hover:text-white transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
              {getLanguageName(lang)}
              <ChevronDown className={`w-3 h-3 transition-transform ${showLangSelector ? 'rotate-180' : ''}`} />
            </button>
            {showLangSelector && (
              <div className="absolute right-0 mt-2 bg-gray-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-lg shadow-xl z-50 overflow-hidden min-w-[140px]">
                {(['en', 'hi', 'ta', 'sa'] as Language[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      handleLanguageChange(l);
                      setShowLangSelector(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
                      lang === l
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-300'
                    }`}
                  >
                    <span className="w-6">{l === 'en' ? '🇬🇧' : l === 'hi' ? '🇮🇳' : l === 'ta' ? '🏛️' : '🕉️'}</span>
                    {getLanguageName(l)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Name Display */}
          <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-400/50 rounded-lg text-cyan-300 text-sm font-medium">
            {displayName}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>

          {/* Download PDF Dropdown */}
          <div className="relative" ref={pdfDropdownRef}>
            <button
              onClick={() => setShowPdfDropdown(!showPdfDropdown)}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-cyan-400/50 rounded-lg text-cyan-300 text-sm font-medium hover:from-cyan-600/30 hover:to-purple-600/30 transition-all duration-200 disabled:opacity-50"
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isDownloading
                ? (lang === 'en' ? 'Generating...' : 'जनरेट हो रहा है...')
                : (lang === 'en' ? 'Download' : 'डाउनलोड')
              }
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showPdfDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showPdfDropdown && !isDownloading && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-lg shadow-xl z-50 overflow-hidden">
                <button
                  onClick={handleDownloadCurrentTab}
                  className="w-full px-4 py-3 text-left text-sm text-cyan-300 hover:bg-cyan-500/20 transition-colors flex items-center gap-2 border-b border-cyan-500/20"
                >
                  <Download className="h-4 w-4" />
                  {lang === 'en' ? `Download ${activeTab} Tab` : `${getTabLabel(activeTab)} टैब डाउनलोड करें`}
                </button>
                <button
                  onClick={handleDownloadFullReport}
                  className="w-full px-4 py-3 text-left text-sm text-cyan-300 hover:bg-cyan-500/20 transition-colors flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {lang === 'en' ? 'Download Full Report' : 'पूर्ण रिपोर्ट डाउनलोड करें'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Futuristic Gate Header - Matches Numerology */}
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="relative w-full h-40 mb-8 overflow-hidden rounded-xl border border-cyan-500/20">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/40 via-gray-950 to-black" />

          {/* Grid pattern with perspective */}
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, rgba(34, 211, 238, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(34, 211, 238, 0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: 'center bottom'
          }} />

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">KarmAnk</span>
              <span className="text-white">™</span>
            </h1>
            <p className="text-cyan-300/70 uppercase tracking-[0.4em] text-[10px] font-black">
              {lang === 'en' ? 'NADI PALMISTRY SYSTEM' : lang === 'hi' ? 'नाडी हस्तरेखा प्रणाली' : 'NADI PALMISTRY SYSTEM'}
            </p>
          </div>

          {/* Glow effects */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent blur-sm" />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="mb-4 border-b border-cyan-400/20 flex flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 font-medium transition-colors duration-300 ${
                activeTab === tab
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-cyan-200/70 hover:text-cyan-300'
              }`}
            >
              {getTabLabel(tab)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        <div id="palmistry-report-content" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderTabContent()}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-cyan-500/20 bg-gray-900/50 py-8 mt-16">
        <div className="max-w-5xl mx-auto px-4 md:px-6 text-center">
          <p className="text-xs text-cyan-400/50">
            {lang === 'en'
              ? '© 2026 KarmAnk™ • Nadi Palmistry System • Ancient Wisdom, Modern Precision'
              : '© 2026 KarmAnk™ • नाडी हस्तरेखा प्रणाली • प्राचीन ज्ञान, आधुनिक सटीकता'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDisplay;
