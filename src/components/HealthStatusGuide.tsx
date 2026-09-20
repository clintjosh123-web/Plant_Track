import React, { useState } from 'react';
import { 
  HeartPulse, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Droplets, 
  Sun, 
  ArrowRight,
  ShieldCheck,
  RotateCw,
  Sparkles,
  Stethoscope,
  Activity,
  Bug,
  ThermometerSnowflake,
  Flame,
  FileText,
  Lock,
  Zap,
  Clock,
  Check
} from 'lucide-react';
import { usePlantContext } from '../context/PlantContext';
import { useAuth } from '../context/AuthContext';
import { PlantHealthStatus } from '../types';
import { CareSheetModal } from './CareSheetModal';

interface AIDoctorDiagnosis {
  symptomId: string;
  name: string;
  category: string;
  severity: 'Critical' | 'Moderate' | 'Mild';
  severityColor: string;
  confidence: number;
  rootCause: string;
  immedateAction: string;
  recoveryRegimen: string;
  preventionTip: string;
  targetStatus: PlantHealthStatus;
  targetReason: string;
}

const AI_DIAGNOSES: Record<string, AIDoctorDiagnosis> = {
  root_rot: {
    symptomId: 'root_rot',
    name: 'Root Rot (Pythium / Phytophthora fungal rot)',
    category: 'Subsurface Root Disease',
    severity: 'Critical',
    severityColor: 'bg-red-500 text-white',
    confidence: 97,
    rootCause: 'Prolonged waterlogging in dense anaerobic soil preventing root oxygen uptake.',
    immedateAction: 'Withhold all water immediately. Gently slide plant out of pot and inspect roots. Trim off any blackened, mushy root filaments with sterilized shears.',
    recoveryRegimen: 'Repot into porous well-draining soil with 30% perlite. Let soil dry out 80% before giving small amounts of water.',
    preventionTip: 'Always discard excess runoff water from the drainage tray within 15 minutes of watering.',
    targetStatus: 'needs_care',
    targetReason: 'Critical: Root rot detected. Soil drying & root aeration required.',
  },
  chlorosis: {
    symptomId: 'chlorosis',
    name: 'Interveinal Chlorosis (Iron or Nitrogen Deficiency)',
    category: 'Nutritional Imbalance',
    severity: 'Moderate',
    severityColor: 'bg-amber-500 text-white',
    confidence: 93,
    rootCause: 'Alkaline tap water locking out chelated micronutrients or depleted potting compost.',
    immedateAction: 'Flush potting soil with room-temperature filtered water, then apply a half-strength balanced 10-10-10 organic liquid fertilizer.',
    recoveryRegimen: 'Supplement with chelated iron foliar spray once every 10 days until leaf veins regain deep emerald chlorophyll.',
    preventionTip: 'Rotate fertilizer every 4 weeks during active vegetative growing season.',
    targetStatus: 'needs_attention',
    targetReason: 'Nutritional deficiency: Foliar fertilizer needed to restore chlorophyll.',
  },
  spider_mites: {
    symptomId: 'spider_mites',
    name: 'Spider Mites & Sap Pests (Tetranychidae)',
    category: 'Insect Infestation',
    severity: 'Moderate',
    severityColor: 'bg-amber-500 text-white',
    confidence: 91,
    rootCause: 'Dry indoor air with low relative humidity allowing microscopic mites to multiply on undersides of leaves.',
    immedateAction: 'Isolate plant from nearby foliage. Wash down leaves with a gentle lukewarm spray, paying attention to the leaf undersides.',
    recoveryRegimen: 'Spray foliage thoroughly with organic cold-pressed Neem Oil emulsion or insecticidal soap every 4 days for 2 weeks.',
    preventionTip: 'Increase ambient relative humidity above 55% using pebble trays or regular morning misting.',
    targetStatus: 'needs_attention',
    targetReason: 'Spider mites detected: Isolate and apply neem oil treatment.',
  },
  powdery_mildew: {
    symptomId: 'powdery_mildew',
    name: 'Powdery Mildew (Erysiphales Fungus)',
    category: 'Airborne Fungal Spores',
    severity: 'Moderate',
    severityColor: 'bg-amber-500 text-white',
    confidence: 89,
    rootCause: 'Stagnant indoor airflow combined with high nighttime humidity and damp foliage.',
    immedateAction: 'Prune the most heavily infected leaves. Avoid splashing water onto foliage during watering.',
    recoveryRegimen: 'Apply potassium bicarbonate spray (1 tsp per quart water with a drop of Castile soap) across leaves in morning sun.',
    preventionTip: 'Position a small oscillating fan nearby to promote steady gentle air circulation.',
    targetStatus: 'needs_attention',
    targetReason: 'Powdery mildew: Pruned damaged leaves & applied antifungal spray.',
  },
  humidity_scorch: {
    symptomId: 'humidity_scorch',
    name: 'Crispy Leaf Scorch & Transpiration Stress',
    category: 'Environmental Drought',
    severity: 'Moderate',
    severityColor: 'bg-amber-500 text-white',
    confidence: 94,
    rootCause: 'Intense direct afternoon sun beam or placement directly next to hot air vents or cooling fans.',
    immedateAction: 'Move plant 2 to 3 feet back from direct scorching glass window into bright, diffused indirect sunlight.',
    recoveryRegimen: 'Provide deep bottom-watering until soil is evenly hydrated, then mist surrounding air in the morning.',
    preventionTip: 'Use sheer white curtains to filter harsh midday ultraviolet rays.',
    targetStatus: 'needs_attention',
    targetReason: 'Leaf scorch: Relocated to soft indirect light & hydrated.',
  },
  etiolation: {
    symptomId: 'etiolation',
    name: 'Etiolation (Severe Light Starvation / Leggy Stems)',
    category: 'Photomorphogenic Deficit',
    severity: 'Mild',
    severityColor: 'bg-emerald-600 text-white',
    confidence: 96,
    rootCause: 'Insufficient photoperiod or lux intensity, forcing stems to stretch unnaturally towards light source.',
    immedateAction: 'Move pot to an East or South-facing window sill with minimum 4-6 hours of natural daily sun.',
    recoveryRegimen: 'Prune back the top 1/3 of leggy stems to stimulate compact, bushy new lateral growth.',
    preventionTip: 'Rotate pot 90 degrees every week so all sides receive balanced photon distribution.',
    targetStatus: 'needs_attention',
    targetReason: 'Light starved: Relocated to sunny window & pruned leggy growth.',
  },
};

export const HealthStatusGuide: React.FC = () => {
  const { plants, updatePlant, waterPlant, resolveSunlight, showToast } = usePlantContext();
  const { isPro, setIsSubscribeModalOpen } = useAuth();

  const [selectedPlantId, setSelectedPlantId] = useState<string>(plants[0]?.id || '');
  const [selectedSymptom, setSelectedSymptom] = useState<string>('dry_soil');

  // AI Doctor state (Pro feature)
  const [doctorPlantId, setDoctorPlantId] = useState<string>(plants[0]?.id || '');
  const [doctorSymptomId, setDoctorSymptomId] = useState<string>('chlorosis');
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [activePrescription, setActivePrescription] = useState<AIDoctorDiagnosis | null>(
    AI_DIAGNOSES['chlorosis']
  );
  const [isCareSheetOpen, setIsCareSheetOpen] = useState<boolean>(false);

  const healthyPlants = plants.filter((p) => p.status === 'healthy');
  const attentionPlants = plants.filter((p) => p.status === 'needs_attention');
  const carePlants = plants.filter((p) => p.status === 'needs_care');

  const targetPlant = plants.find((p) => p.id === selectedPlantId) || plants[0];
  const doctorPlant = plants.find((p) => p.id === doctorPlantId) || plants[0];

  const symptoms = [
    {
      id: 'dry_soil',
      label: 'Soil feels completely dry to touch',
      diagnosis: 'Soil dehydrated. Plant needs watering immediately.',
      recommendedStatus: 'needs_attention' as PlantHealthStatus,
      icon: Droplets,
      actionText: 'Water Plant',
      action: () => targetPlant && waterPlant(targetPlant.id),
    },
    {
      id: 'yellow_leaves',
      label: 'Leaves turning pale or stretching towards window',
      diagnosis: 'Insufficient light exposure. Needs brighter indirect sunlight.',
      recommendedStatus: 'needs_attention' as PlantHealthStatus,
      icon: Sun,
      actionText: 'Move to Window',
      action: () => targetPlant && resolveSunlight(targetPlant.id, 'Sunny Window'),
    },
    {
      id: 'crispy_edges',
      label: 'Crispy leaf tips or severe drooping',
      diagnosis: 'Low humidity or drought stress. Needs deep hydration and misting.',
      recommendedStatus: 'needs_care' as PlantHealthStatus,
      icon: AlertTriangle,
      actionText: 'Flag as Needs Care',
      action: () => targetPlant && updatePlant(targetPlant.id, { 
        status: 'needs_care', 
        statusReason: 'Severe drought stress. Soil parched.' 
      }),
    },
    {
      id: 'thriving',
      label: 'Vibrant green leaves, firm stems, steady growth',
      diagnosis: 'Optimal equilibrium! Plant is receiving great care.',
      recommendedStatus: 'healthy' as PlantHealthStatus,
      icon: CheckCircle2,
      actionText: 'Confirm Healthy',
      action: () => targetPlant && updatePlant(targetPlant.id, { 
        status: 'healthy', 
        statusReason: 'Plant is getting enough care and thriving 🟢' 
      }),
    },
  ];

  const currentSymptom = symptoms.find((s) => s.id === selectedSymptom) || symptoms[0];

  const handleRunAIDiagnosis = () => {
    setIsDiagnosing(true);
    setTimeout(() => {
      setActivePrescription(AI_DIAGNOSES[doctorSymptomId] || AI_DIAGNOSES['chlorosis']);
      setIsDiagnosing(false);
      showToast('AI Botanical Diagnosis complete! Prescription generated. 🩺', 'success');
    }, 700);
  };

  const handleApplyDoctorTreatment = () => {
    if (!activePrescription || !doctorPlant) return;
    updatePlant(doctorPlant.id, {
      status: activePrescription.targetStatus,
      statusReason: activePrescription.targetReason,
      notes: doctorPlant.notes 
        ? `${doctorPlant.notes} | AI Doctor: ${activePrescription.name} - Applied emergency protocol.`
        : `AI Doctor: ${activePrescription.name} - Applied emergency protocol.`,
    });
    showToast(`Prescription applied to ${doctorPlant.name}! Care schedule updated. 🌱`, 'success');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold mb-2">
            <HeartPulse className="w-3.5 h-3.5 text-emerald-600" />
            <span>Section 9: Plant Health & Diagnostics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#14381F] tracking-tight">
            📊 Plant Health Status & AI Doctor
          </h1>
          <p className="text-xs sm:text-sm text-[#52796F]">
            3-tier health evaluation system and AI-powered botanical symptom diagnosis.
          </p>
        </div>

        {/* Pro Feature: Printable Care Sheet Button */}
        <button
          onClick={() => setIsCareSheetOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-amber-50 text-[#14381F] rounded-xl text-xs sm:text-sm font-bold border border-amber-300 shadow-xs transition-all self-start sm:self-auto"
        >
          <FileText className="w-4 h-4 text-amber-600" />
          <span>Care Sheet & Sitter Guide</span>
          <span className="text-[10px] bg-amber-200 text-amber-900 font-extrabold px-1.5 py-0.2 rounded-md">
            PRO
          </span>
        </button>
      </div>

      {/* The 3 Status Tiers from User Prompt */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 🟢 Healthy */}
        <div className="bg-gradient-to-br from-[#F0FDF4] to-white rounded-3xl p-6 border-2 border-[#86EFAC] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl">🟢</span>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#14532D]">
              {healthyPlants.length} Plants
            </span>
          </div>
          <div>
            <h3 className="text-lg font-black text-[#14532D]">Healthy</h3>
            <p className="text-xs font-bold text-[#16A34A] mt-0.5">
              Plant is getting enough care
            </p>
          </div>
          <p className="text-xs text-[#334155] leading-relaxed">
            Foliage is plump and vibrant green, soil moisture matches the schedule, and new shoots or roots are developing steadily.
          </p>
          <div className="pt-2 border-t border-[#BBF7D0] text-xs text-[#166534] font-medium space-y-1">
            {healthyPlants.map((p) => (
              <div key={p.id} className="flex items-center justify-between">
                <span>• {p.name} ({p.type})</span>
                <span className="text-[11px] font-bold">Good</span>
              </div>
            ))}
            {healthyPlants.length === 0 && <span className="text-gray-400 italic">No plants in this status</span>}
          </div>
        </div>

        {/* 🟡 Needs Attention */}
        <div className="bg-gradient-to-br from-[#FEFCE8] to-white rounded-3xl p-6 border-2 border-[#FDE047] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl">🟡</span>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#FEF08A] text-[#713F12]">
              {attentionPlants.length} Plants
            </span>
          </div>
          <div>
            <h3 className="text-lg font-black text-[#713F12]">Needs Attention</h3>
            <p className="text-xs font-bold text-[#CA8A04] mt-0.5">
              Check water or sunlight
            </p>
          </div>
          <p className="text-xs text-[#334155] leading-relaxed">
            Soil is starting to dry past the regular interval, or light levels are slightly dim causing faint leaf discoloration.
          </p>
          <div className="pt-2 border-t border-[#FEF08A] text-xs text-[#854D0E] font-medium space-y-1">
            {attentionPlants.map((p) => (
              <div key={p.id} className="flex items-center justify-between">
                <span>• {p.name}</span>
                <span className="text-[11px] font-bold text-amber-700 truncate max-w-[120px]">{p.statusReason || 'Check care'}</span>
              </div>
            ))}
            {attentionPlants.length === 0 && <span className="text-gray-400 italic">No plants need attention</span>}
          </div>
        </div>

        {/* 🔴 Needs Care */}
        <div className="bg-gradient-to-br from-[#FEF2F2] to-white rounded-3xl p-6 border-2 border-[#FCA5A5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl">🔴</span>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#FEE2E2] text-[#7F1D1D]">
              {carePlants.length} Plants
            </span>
          </div>
          <div>
            <h3 className="text-lg font-black text-[#7F1D1D]">Needs Care</h3>
            <p className="text-xs font-bold text-[#DC2626] mt-0.5">
              Immediate attention is needed
            </p>
          </div>
          <p className="text-xs text-[#334155] leading-relaxed">
            Severe dehydration, signs of leaf burn, or roots bound tight. Rapid corrective intervention prevents permanent damage.
          </p>
          <div className="pt-2 border-t border-[#FCA5A5] text-xs text-[#991B1B] font-medium space-y-1">
            {carePlants.map((p) => (
              <div key={p.id} className="flex items-center justify-between">
                <span>• {p.name}</span>
                <span className="text-[11px] font-bold text-red-700">Urgent</span>
              </div>
            ))}
            {carePlants.length === 0 && <span className="text-emerald-700 font-bold text-xs">All plants safe from danger!</span>}
          </div>
        </div>
      </div>

      {/* PRO FEATURE: AI Plant Doctor & Leaf Diagnoser */}
      <div className="bg-gradient-to-br from-[#14381F] via-[#1B4324] to-[#142D1A] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#2D6A4F] relative overflow-hidden space-y-6">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-10 -translate-y-10">
          <Stethoscope className="w-80 h-80 text-emerald-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-emerald-800/60 pb-5">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-extrabold border border-amber-400/40">
                <Sparkles className="w-3 h-3" />
                <span>Subscription Feature • Pro ₱20/mo</span>
              </span>
              {isPro && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                  <Check className="w-3 h-3" />
                  <span>Unlocked VIP</span>
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <Stethoscope className="w-7 h-7 text-emerald-400" />
              <span>AI Plant Doctor & Leaf Diagnoser</span>
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200">
              Run botanical diagnostic scans on leaf symptoms, diagnose pests & nutrient deficiencies, and receive clinical step-by-step recovery plans.
            </p>
          </div>

          {!isPro && (
            <button
              onClick={() => setIsSubscribeModalOpen(true)}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-[#14381F] font-black text-xs sm:text-sm rounded-xl shadow-xs transition-transform active:scale-95 shrink-0"
            >
              Unlock Full Doctor (₱20/mo)
            </button>
          )}
        </div>

        {/* Doctor Diagnostic Controls */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider mb-2">
              Select Patient Plant
            </label>
            <select
              value={doctorPlantId}
              onChange={(e) => setDoctorPlantId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-emerald-600/50 text-white font-semibold text-sm outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {plants.map((p) => (
                <option key={p.id} value={p.id} className="text-gray-900">
                  {p.name} ({p.type}) — {p.location}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider mb-2">
              Botanical Symptom Observed
            </label>
            <select
              value={doctorSymptomId}
              onChange={(e) => setDoctorSymptomId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-emerald-600/50 text-white font-semibold text-sm outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="chlorosis" className="text-gray-900">Yellow leaves with green veins (Chlorosis / Mineral Deficit)</option>
              <option value="root_rot" className="text-gray-900">Mushy dark stem base & rotting soil odor (Root Rot / Overwatering)</option>
              <option value="spider_mites" className="text-gray-900">Fine webbing under leaves & speckled yellow stippling (Spider Mites)</option>
              <option value="powdery_mildew" className="text-gray-900">White powdery chalk coating on foliage (Powdery Mildew Fungus)</option>
              <option value="humidity_scorch" className="text-gray-900">Crispy curled leaf tips & dry edges (Low Humidity / Scorch)</option>
              <option value="etiolation" className="text-gray-900">Leggy stretched stems & pale sparse leaves (Light Starvation)</option>
            </select>
          </div>
        </div>

        {/* Run Diagnosis Button */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="text-xs text-emerald-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Botanical Neural Engine: Analyzes species, humidity, and photoperiod</span>
          </div>

          <button
            type="button"
            disabled={isDiagnosing}
            onClick={handleRunAIDiagnosis}
            className="py-2.5 px-5 bg-[#16A34A] hover:bg-[#15803D] active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            {isDiagnosing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Analyzing Botanical Symptoms...</span>
              </>
            ) : (
              <>
                <Stethoscope className="w-4 h-4" />
                <span>Run AI Diagnostic Scan</span>
              </>
            )}
          </button>
        </div>

        {/* Prescription Breakdown Card */}
        {activePrescription && (
          <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 text-gray-900 space-y-4 border border-emerald-300/40 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                    Clinical Diagnosis
                  </span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${activePrescription.severityColor}`}>
                    {activePrescription.severity} Severity
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                    {activePrescription.confidence}% Match
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-[#14381F] mt-0.5">
                  {activePrescription.name}
                </h3>
                <span className="text-xs text-gray-500 font-medium">
                  Identified for: <strong>{doctorPlant?.name}</strong> ({doctorPlant?.type})
                </span>
              </div>

              {isPro ? (
                <button
                  type="button"
                  onClick={handleApplyDoctorTreatment}
                  className="px-4 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Apply Treatment Protocol</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSubscribeModalOpen(true)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Unlock Treatment for ₱20/mo</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-red-50/80 border border-red-200 space-y-1">
                <span className="font-extrabold text-red-900 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                  <span>1. Immediate Emergency Action</span>
                </span>
                <p className="text-red-950 leading-relaxed font-medium">
                  {activePrescription.immedateAction}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 space-y-1">
                <span className="font-extrabold text-amber-900 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>2. 7-Day Recovery Regimen</span>
                </span>
                <p className="text-amber-950 leading-relaxed font-medium">
                  {activePrescription.recoveryRegimen}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-1">
                <span className="font-extrabold text-emerald-900 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>3. Long-Term Prevention</span>
                </span>
                <p className="text-emerald-950 leading-relaxed font-medium">
                  {activePrescription.preventionTip}
                </p>
              </div>
            </div>

            <div className="text-[11px] text-gray-500 flex items-center justify-between pt-1 border-t border-gray-100">
              <span>Root Cause: {activePrescription.rootCause}</span>
              <span>Plant Track Pro Botanical Diagnostics</span>
            </div>
          </div>
        )}
      </div>

      {/* Standard Interactive Plant Symptom & Health Diagnoser */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8E0] shadow-xs space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1E2922]">
              Quick Health Evaluator
            </h3>
            <p className="text-xs text-[#64748B]">
              Inspect daily symptoms on your plants and update their health status instantly.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-[#1E2922] uppercase tracking-wider mb-2">
              Select Plant to Evaluate
            </label>
            <select
              value={selectedPlantId}
              onChange={(e) => setSelectedPlantId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] font-semibold text-sm bg-white outline-none focus:ring-2 focus:ring-[#16A34A]"
            >
              {plants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.type}) — Currently {p.status === 'healthy' ? '🟢 Healthy' : p.status === 'needs_attention' ? '🟡 Needs Attention' : '🔴 Needs Care'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1E2922] uppercase tracking-wider mb-2">
              Observed Symptom
            </label>
            <select
              value={selectedSymptom}
              onChange={(e) => setSelectedSymptom(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] font-semibold text-sm bg-white outline-none focus:ring-2 focus:ring-[#16A34A]"
            >
              {symptoms.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Diagnosis Result Card */}
        <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#EDF2EC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#CBD5E1] flex items-center justify-center shrink-0">
              <currentSymptom.icon className="w-5 h-5 text-[#16A34A]" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#1E2922] block">
                Assessment Recommendation:
              </span>
              <p className="text-xs text-[#52796F] mt-0.5">
                {currentSymptom.diagnosis}
              </p>
            </div>
          </div>

          <button
            onClick={currentSymptom.action}
            className="px-4 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
          >
            <span>{currentSymptom.actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Care Sheet Modal */}
      <CareSheetModal 
        isOpen={isCareSheetOpen} 
        onClose={() => setIsCareSheetOpen(false)} 
      />
    </div>
  );
};

