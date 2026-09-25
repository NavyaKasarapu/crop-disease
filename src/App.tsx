import React, { useState } from 'react';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Detection } from './pages/Detection';
import { About } from './pages/About';
import { Dataset } from './pages/Dataset';
import { Contact } from './pages/Contact';
import { BackendCodeModal } from './components/BackendCodeModal';
import { SampleLeaf } from './data/sampleImages';
import { Leaf, Code2, Heart, ExternalLink } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isBackendModalOpen, setIsBackendModalOpen] = useState<boolean>(false);
  const [preselectedSample, setPreselectedSample] = useState<SampleLeaf | null>(null);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSampleAndDetect = (sample: SampleLeaf) => {
    setPreselectedSample(sample);
    setCurrentPage('detection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Navigation */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenBackendModal={() => setIsBackendModalOpen(true)}
      />

      {/* Main Page Body */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <Home
            onNavigate={handleNavigate}
            onSelectSampleAndDetect={handleSelectSampleAndDetect}
          />
        )}

        {currentPage === 'detection' && (
          <Detection
            initialSample={preselectedSample}
            onClearInitialSample={() => setPreselectedSample(null)}
            onOpenBackendModal={() => setIsBackendModalOpen(true)}
          />
        )}

        {currentPage === 'about' && (
          <About onOpenBackendModal={() => setIsBackendModalOpen(true)} />
        )}

        {currentPage === 'dataset' && <Dataset />}

        {currentPage === 'contact' && <Contact />}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/80 bg-white py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <span className="font-display font-extrabold text-base text-stone-900">
                  Plant<span className="text-emerald-700">AI</span>
                </span>
                <p className="text-xs text-stone-500">
                  Vision Transformer (ViT) Plant Disease Detection · PlantVillage Benchmark
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-stone-600">
              <button
                onClick={() => handleNavigate('home')}
                className="hover:text-emerald-700 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => handleNavigate('detection')}
                className="hover:text-emerald-700 transition-colors"
              >
                Disease Detection
              </button>
              <button
                onClick={() => handleNavigate('about')}
                className="hover:text-emerald-700 transition-colors"
              >
                About & ViT Architecture
              </button>
              <button
                onClick={() => handleNavigate('dataset')}
                className="hover:text-emerald-700 transition-colors"
              >
                PlantVillage Dataset
              </button>
              <button
                onClick={() => handleNavigate('contact')}
                className="hover:text-emerald-700 transition-colors"
              >
                Project Demonstration
              </button>
              <button
                onClick={() => setIsBackendModalOpen(true)}
                className="inline-flex items-center gap-1 text-emerald-700 font-semibold hover:underline"
              >
                <Code2 className="w-3.5 h-3.5" />
                FastAPI main.py
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
            <div>
              Academic Project Demonstration · Prepared for Final-Year Defense & Evaluation
            </div>
            <div className="font-mono text-[11px]">
              FastAPI Ready: <code className="text-emerald-700">POST /predict</code>
            </div>
          </div>
        </div>
      </footer>

      {/* Backend Code & Setup Modal */}
      <BackendCodeModal
        isOpen={isBackendModalOpen}
        onClose={() => setIsBackendModalOpen(false)}
      />
    </div>
  );
}
