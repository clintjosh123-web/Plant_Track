import React, { useState } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Ruler, 
  Plus, 
  Camera, 
  Sparkles, 
  ArrowRight, 
  Trash2, 
  Layers,
  ChevronRight,
  SplitSquareVertical,
  Activity
} from 'lucide-react';
import { usePlantContext } from '../context/PlantContext';
import { Plant, GrowthRecord, GrowthPhoto } from '../types';

export const GrowthTracker: React.FC = () => {
  const { 
    plants, 
    growthRecords, 
    growthPhotos, 
    deleteGrowthRecord,
    deleteGrowthPhoto,
    setIsGrowthModalOpen,
    setGrowthModalPlantId,
    setIsPhotoModalOpen,
    setPhotoModalPlantId
  } = usePlantContext();

  // Active selected plant for growth tracking (default to Minty or first plant)
  const [selectedPlantId, setSelectedPlantId] = useState<string>(
    plants[0]?.id || ''
  );

  const [comparisonMode, setComparisonMode] = useState<boolean>(false);
  const [compareWeekA, setCompareWeekA] = useState<number>(0); // first photo index
  const [compareWeekB, setCompareWeekB] = useState<number>(1); // latest photo index

  const activePlant = plants.find((p) => p.id === selectedPlantId) || plants[0];

  // Records for this plant sorted chronologically
  const plantRecords = growthRecords
    .filter((r) => r.plantId === activePlant?.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Photos for this plant
  const plantPhotos = growthPhotos.filter((p) => p.plantId === activePlant?.id);

  // Height calculations
  const initialHeight = plantRecords[0]?.heightCm || 0;
  const currentHeight = plantRecords[plantRecords.length - 1]?.heightCm || initialHeight;
  const totalGrowth = Math.max(0, currentHeight - initialHeight);
  const latestCondition = plantRecords[plantRecords.length - 1]?.condition || 'Healthy 🌱';

  // Open modals
  const handleOpenLogModal = () => {
    if (activePlant) {
      setGrowthModalPlantId(activePlant.id);
      setIsGrowthModalOpen(true);
    }
  };

  const handleOpenPhotoModal = () => {
    if (activePlant) {
      setPhotoModalPlantId(activePlant.id);
      setIsPhotoModalOpen(true);
    }
  };

  // SVG Line Chart Coordinate calculation
  const chartWidth = 600;
  const chartHeight = 220;
  const padding = 40;

  const heights = plantRecords.map((r) => r.heightCm);
  const minH = Math.max(0, Math.min(...heights, 0));
  const maxH = Math.max(...heights, 10) * 1.25;

  const points = plantRecords.map((rec, i) => {
    const x = plantRecords.length === 1 
      ? chartWidth / 2 
      : padding + (i / (plantRecords.length - 1)) * (chartWidth - padding * 2);
    const y = chartHeight - padding - ((rec.heightCm - minH) / (maxH - minH || 1)) * (chartHeight - padding * 2);
    return { x, y, rec };
  });

  const svgPath = points.length > 0 
    ? points.reduce((acc, pt, i) => i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`, '')
    : '';

  const svgAreaPath = points.length > 0
    ? `${svgPath} L ${points[points.length - 1].x},${chartHeight - padding} L ${points[0].x},${chartHeight - padding} Z`
    : '';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Plant Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#166534] text-xs font-bold mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Growth Monitoring & Photo Progression</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#14381F] tracking-tight">
            📊 Plant Growth Tracker
          </h1>
          <p className="text-xs sm:text-sm text-[#52796F]">
            Record height changes, condition updates, and weekly photo logs.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenPhotoModal}
            className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-[#F3FAF4] text-[#193B22] border border-[#CBD5E1] rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors"
          >
            <Camera className="w-4 h-4 text-purple-600" />
            <span>📸 Weekly Photo</span>
          </button>
          <button
            id="log-growth-main-btn"
            onClick={handleOpenLogModal}
            className="flex items-center gap-2 px-4 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>➕ Log Growth</span>
          </button>
        </div>
      </div>

      {/* Plant Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-[#EDF2EC]">
        {plants.map((p) => {
          const isSelected = p.id === activePlant?.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPlantId(p.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#16A34A] text-white shadow-xs'
                  : 'bg-white hover:bg-[#F8FAF7] text-[#475569] border border-[#E2E8E0]'
              }`}
            >
              <img
                src={p.imageUrl}
                alt={p.name}
                referrerPolicy="no-referrer"
                className="w-5 h-5 rounded-full object-cover"
              />
              <span>{p.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                isSelected ? 'bg-white/20 text-white' : 'bg-[#EDF2EC] text-[#64748B]'
              }`}>
                {p.type}
              </span>
            </button>
          );
        })}
      </div>

      {/* High-Level Growth Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8E0] shadow-xs">
          <span className="text-xs font-semibold text-[#64748B] block">Current Height</span>
          <div className="text-2xl sm:text-3xl font-black text-[#14381F] mt-1 flex items-baseline gap-1">
            <span>{currentHeight}</span>
            <span className="text-sm font-bold text-[#64748B]">cm</span>
          </div>
          <span className="text-xs text-[#16A34A] font-semibold mt-1 block">
            Latest measurement
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E2E8E0] shadow-xs">
          <span className="text-xs font-semibold text-[#64748B] block">Total Growth</span>
          <div className="text-2xl sm:text-3xl font-black text-[#16A34A] mt-1 flex items-baseline gap-1">
            <span>+{totalGrowth.toFixed(1)}</span>
            <span className="text-sm font-bold text-[#64748B]">cm</span>
          </div>
          <span className="text-xs text-[#52796F] font-semibold mt-1 block">
            Since {activePlant?.datePlanted || 'planting'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E2E8E0] shadow-xs">
          <span className="text-xs font-semibold text-[#64748B] block">Latest Condition</span>
          <div className="text-lg sm:text-xl font-black text-[#1E2922] mt-2 truncate">
            {latestCondition}
          </div>
          <span className="text-xs text-[#64748B] font-medium block mt-1">
            Status: {activePlant?.status === 'healthy' ? '🟢 Healthy' : '🟡 Needs Attention'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E2E8E0] shadow-xs">
          <span className="text-xs font-semibold text-[#64748B] block">Weekly Photos</span>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 mt-1 flex items-baseline gap-1">
            <span>{plantPhotos.length}</span>
            <span className="text-sm font-bold text-[#64748B]">weeks</span>
          </div>
          <span className="text-xs text-purple-700 font-semibold mt-1 block">
            Photo progression logged
          </span>
        </div>
      </div>

      {/* SVG Growth Chart Section */}
      <div className="bg-white rounded-3xl p-6 border border-[#E2E8E0] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E8F5E9] text-[#16A34A] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1E2922]">
                Growth Trajectory Curve
              </h3>
              <p className="text-xs text-[#64748B]">
                Visual progression in centimeters (cm) over time
              </p>
            </div>
          </div>
          <button
            onClick={handleOpenLogModal}
            className="text-xs font-bold text-[#16A34A] hover:text-[#15803D] flex items-center gap-1"
          >
            <span>+ Add Entry</span>
          </button>
        </div>

        {/* The SVG Chart */}
        {plantRecords.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <div className="min-w-[500px]">
              <svg 
                viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                className="w-full h-56 overflow-visible"
              >
                <defs>
                  <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16A34A" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#16A34A" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid Lines */}
                {[0, 0.33, 0.66, 1].map((ratio, idx) => {
                  const yVal = chartHeight - padding - ratio * (chartHeight - padding * 2);
                  const hLabel = Math.round(minH + ratio * (maxH - minH));
                  return (
                    <g key={idx}>
                      <line
                        x1={padding}
                        y1={yVal}
                        x2={chartWidth - padding}
                        y2={yVal}
                        stroke="#EDF2EC"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={padding - 10}
                        y={yVal + 4}
                        textAnchor="end"
                        fontSize="10"
                        fill="#94A3B8"
                        fontWeight="600"
                      >
                        {hLabel} cm
                      </text>
                    </g>
                  );
                })}

                {/* Shaded Area Under Line */}
                {svgAreaPath && (
                  <path d={svgAreaPath} fill="url(#growthGradient)" />
                )}

                {/* Line Path */}
                {svgPath && (
                  <path
                    d={svgPath}
                    fill="none"
                    stroke="#16A34A"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Data Points */}
                {points.map((pt, i) => (
                  <g key={i} className="group cursor-pointer">
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="6"
                      fill="#FFFFFF"
                      stroke="#16A34A"
                      strokeWidth="3"
                    />
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="10"
                      fill="#16A34A"
                      opacity="0"
                      className="hover:opacity-20 transition-opacity"
                    />
                    {/* Height Label Bubble */}
                    <rect
                      x={pt.x - 22}
                      y={pt.y - 30}
                      width="44"
                      height="20"
                      rx="6"
                      fill="#14381F"
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 16}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="bold"
                      fill="#FFFFFF"
                    >
                      {pt.rec.heightCm} cm
                    </text>
                    {/* Date label at bottom */}
                    <text
                      x={pt.x}
                      y={chartHeight - 12}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="600"
                      fill="#64748B"
                    >
                      {pt.rec.date.split(',')[0]}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-[#64748B]">
            <p className="text-sm">No growth records logged yet for this plant.</p>
            <button
              onClick={handleOpenLogModal}
              className="mt-2 text-xs font-bold text-[#16A34A] underline"
            >
              Log initial height
            </button>
          </div>
        )}
      </div>

      {/* Growth History Table (Section 5 from prompt):
          Date | Height | Condition
          Sept. 10 | 5 cm | Healthy 🌱
          Sept. 15 | 7 cm | Healthy 🌿
          Sept. 20 | 9 cm | Growing well 🌿
      */}
      <div className="bg-white rounded-3xl p-6 border border-[#E2E8E0] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-[#1E2922] flex items-center gap-2">
              <span>Growth Log Records</span>
              <span className="text-xs font-normal text-[#64748B]">
                ({plantRecords.length} entries recorded)
              </span>
            </h3>
            <p className="text-xs text-[#64748B]">
              Detailed historical logs of plant height and observed health condition
            </p>
          </div>
          <button
            onClick={handleOpenLogModal}
            className="px-3 py-1.5 bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#166534] text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Height</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EDF2EC] text-xs font-extrabold text-[#475569] uppercase tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Height</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-xs sm:text-sm">
              {plantRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-[#F8FAF7] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#1E2922] whitespace-nowrap flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>{rec.date}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#14381F] whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-lg bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]">
                      {rec.heightCm} cm
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#1E2922] whitespace-nowrap">
                    <span>{rec.condition}</span>
                  </td>
                  <td className="py-3.5 px-4 text-[#64748B] max-w-xs truncate">
                    {rec.notes || '—'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => deleteGrowthRecord(rec.id)}
                      title="Delete record"
                      className="p-1.5 text-[#94A3B8] hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 📸 Section 7: Growth Photos: “Week 1 → Week 2 → Week 3 → Week 4” */}
      <div className="bg-gradient-to-br from-[#FAF5FF] via-white to-[#F3E8FF] rounded-3xl p-6 border border-[#E9D5FF] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-extrabold mb-1">
              <Camera className="w-3.5 h-3.5 text-purple-600" />
              <span>Section 7: Weekly Photo Progression</span>
            </div>
            <h3 className="text-xl font-black text-[#3B0764] tracking-tight">
              📸 Growth Photos
            </h3>
            <p className="text-xs sm:text-sm text-purple-700 font-medium">
              “Week 1 → Week 2 → Week 3 → Week 4” — See how your plant has changed over time!
            </p>
          </div>

          <div className="flex items-center gap-2">
            {plantPhotos.length >= 2 && (
              <button
                onClick={() => setComparisonMode(!comparisonMode)}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 ${
                  comparisonMode
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                    : 'bg-white text-purple-700 border-purple-200 hover:bg-purple-50'
                }`}
              >
                <SplitSquareVertical className="w-4 h-4" />
                <span>{comparisonMode ? 'Hide Comparison' : 'Compare Weeks'}</span>
              </button>
            )}

            <button
              onClick={handleOpenPhotoModal}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>+ Add Photo</span>
            </button>
          </div>
        </div>

        {/* Side-by-side comparison view if toggled */}
        {comparisonMode && plantPhotos.length >= 2 && (
          <div className="bg-white p-5 rounded-2xl border-2 border-purple-300 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                Visual Transformation: Side-by-Side Comparison
              </h4>
              <div className="flex items-center gap-3 text-xs">
                <select
                  value={compareWeekA}
                  onChange={(e) => setCompareWeekA(Number(e.target.value))}
                  className="px-2.5 py-1 rounded-lg border border-purple-200 font-semibold bg-purple-50"
                >
                  {plantPhotos.map((p, idx) => (
                    <option key={p.id} value={idx}>
                      {p.weekLabel} ({p.date})
                    </option>
                  ))}
                </select>
                <span className="font-bold text-purple-600">vs</span>
                <select
                  value={compareWeekB}
                  onChange={(e) => setCompareWeekB(Number(e.target.value))}
                  className="px-2.5 py-1 rounded-lg border border-purple-200 font-semibold bg-purple-50"
                >
                  {plantPhotos.map((p, idx) => (
                    <option key={p.id} value={idx}>
                      {p.weekLabel} ({p.date})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="relative h-48 sm:h-64 rounded-xl overflow-hidden bg-purple-100 border border-purple-200">
                  <img
                    src={plantPhotos[compareWeekA]?.imageUrl}
                    alt="Compare A"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-black/60 text-white font-bold text-xs backdrop-blur-xs">
                    {plantPhotos[compareWeekA]?.weekLabel} • {plantPhotos[compareWeekA]?.heightCm} cm
                  </span>
                </div>
                <p className="text-xs text-purple-800 font-medium truncate">
                  {plantPhotos[compareWeekA]?.caption}
                </p>
              </div>

              <div className="space-y-2">
                <div className="relative h-48 sm:h-64 rounded-xl overflow-hidden bg-purple-100 border border-purple-200">
                  <img
                    src={plantPhotos[compareWeekB]?.imageUrl}
                    alt="Compare B"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-purple-700 text-white font-bold text-xs backdrop-blur-xs">
                    {plantPhotos[compareWeekB]?.weekLabel} • {plantPhotos[compareWeekB]?.heightCm} cm
                  </span>
                </div>
                <p className="text-xs text-purple-800 font-medium truncate">
                  {plantPhotos[compareWeekB]?.caption}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Weekly Timeline Gallery: Week 1 → Week 2 → Week 3 → Week 4 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plantPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className="bg-white rounded-2xl overflow-hidden border border-purple-100 shadow-xs flex flex-col justify-between group hover:shadow-md transition-all"
            >
              <div>
                <div className="relative h-48 w-full bg-purple-50 overflow-hidden">
                  <img
                    src={photo.imageUrl}
                    alt={photo.weekLabel}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-lg text-xs font-black text-purple-900 border border-purple-200 shadow-xs">
                    {photo.weekLabel}
                  </div>
                  {photo.heightCm && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-md text-[11px] font-bold text-white">
                      {photo.heightCm} cm
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 text-[11px] font-semibold text-white bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded">
                    {photo.date}
                  </div>
                </div>

                <div className="p-3.5 space-y-1">
                  <p className="text-xs text-purple-950 font-medium line-clamp-2">
                    {photo.caption || 'Weekly growth progress snapshot.'}
                  </p>
                </div>
              </div>

              <div className="px-3.5 pb-3 pt-1 border-t border-purple-50 flex items-center justify-between text-xs">
                <span className="text-purple-600 font-bold">
                  Stage {index + 1}
                </span>
                <button
                  onClick={() => deleteGrowthPhoto(photo.id)}
                  title="Remove photo"
                  className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Add next week placeholder card */}
          <div
            onClick={handleOpenPhotoModal}
            className="border-2 border-dashed border-purple-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-purple-50/50 hover:border-purple-400 transition-all min-h-[220px]"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
              <Camera className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-purple-900">
              Snap Week {plantPhotos.length + 1}
            </span>
            <p className="text-xs text-purple-600 mt-1 max-w-[160px]">
              Take next weekly photo to maintain visual growth record
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
