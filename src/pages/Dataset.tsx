import React, { useState } from 'react';
import { PLANT_VILLAGE_CLASSES, PlantVillageClass } from '../data/plantVillageData';
import { Database, Search, Filter, CheckCircle2, AlertTriangle, Layers, Sprout } from 'lucide-react';

export const Dataset: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string>('All');
  const [filterType, setFilterType] = useState<'all' | 'healthy' | 'diseased'>('all');

  const crops = ['All', ...Array.from(new Set(PLANT_VILLAGE_CLASSES.map((c) => c.crop)))];

  const filteredClasses = PLANT_VILLAGE_CLASSES.filter((item) => {
    const matchesSearch =
      item.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.crop.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCrop = selectedCrop === 'All' || item.crop === selectedCrop;

    const matchesType =
      filterType === 'all' ||
      (filterType === 'healthy' && item.isHealthy) ||
      (filterType === 'diseased' && !item.isHealthy);

    return matchesSearch && matchesCrop && matchesType;
  });

  const totalSamples = PLANT_VILLAGE_CLASSES.reduce((acc, curr) => acc + curr.sampleCount, 0);
  const healthyClasses = PLANT_VILLAGE_CLASSES.filter((c) => c.isHealthy).length;
  const diseasedClasses = PLANT_VILLAGE_CLASSES.filter((c) => !c.isHealthy).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>PlantVillage Open Benchmark</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-display tracking-tight">
          PlantVillage Dataset Schema
        </h1>
        <p className="text-sm text-stone-600">
          Comprehensive directory of the 38 classification targets and specimen distribution.
        </p>
      </div>

      {/* Dataset Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="text-xs font-medium text-stone-500 uppercase tracking-wider">Total Images</div>
          <div className="text-2xl font-bold font-display text-stone-900 mt-1 tabular-nums">54,306</div>
          <div className="text-[11px] text-stone-400 mt-0.5">High-res leaf photos</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="text-xs font-medium text-stone-500 uppercase tracking-wider">Supported Crops</div>
          <div className="text-2xl font-bold font-display text-stone-900 mt-1 tabular-nums">14</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Commercial crop species</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="text-xs font-medium text-stone-500 uppercase tracking-wider">Diseased Classes</div>
          <div className="text-2xl font-bold font-display text-amber-700 mt-1 tabular-nums">{diseasedClasses}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Pathological conditions</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="text-xs font-medium text-stone-500 uppercase tracking-wider">Healthy Controls</div>
          <div className="text-2xl font-bold font-display text-emerald-700 mt-1 tabular-nums">{healthyClasses}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Negative control baseline</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search diseases (e.g. Blight, Scab, Rust, Tomato, Corn)..."
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          {/* Type segmented control */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filterType === 'all'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All (38)
            </button>
            <button
              onClick={() => setFilterType('diseased')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filterType === 'diseased'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Diseased (26)
            </button>
            <button
              onClick={() => setFilterType('healthy')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filterType === 'healthy'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Healthy (12)
            </button>
          </div>
        </div>

        {/* Crop category chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-stone-100 text-xs">
          <span className="text-stone-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Crop:
          </span>
          {crops.map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`px-2.5 py-1 rounded-lg transition-colors text-xs font-medium ${
                selectedCrop === crop
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClasses.length > 0 ? (
          filteredClasses.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-2xl border border-stone-200 hover:border-emerald-500/70 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-emerald-700 font-semibold uppercase tracking-wider flex items-center gap-1">
                    <Sprout className="w-3.5 h-3.5" />
                    {item.crop}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded ${
                      item.isHealthy
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {item.isHealthy ? 'Healthy Control' : 'Pathogenic Condition'}
                  </span>
                </div>
                <h3 className="font-bold text-stone-900 text-sm font-display">
                  {item.condition}
                </h3>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>Specimens in Dataset:</span>
                <span className="font-mono font-bold text-stone-800 tabular-nums">
                  {item.sampleCount.toLocaleString()} images
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-stone-500">
            No matching classes found. Try adjusting your search query or crop filter.
          </div>
        )}
      </div>
    </div>
  );
};
