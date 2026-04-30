export interface CategoryRule {
  category: string;
  expected_patterns: string[];
  normal_anomalies: string[];
  high_risk_signals: string[];
  weight_adjustments: { signalId: string; weightModifier: number }[];
  false_positive_traps: string[];
}

export const categoryRules: CategoryRule[] = [
  {
    category: 'electronics',
    expected_patterns: ['battery life', 'performance', 'screen quality', 'specs'],
    normal_anomalies: ['doa units', 'shipping damage'],
    high_risk_signals: ['perfect 5-star burst', 'generic praise'],
    weight_adjustments: [
      { signalId: 'SIG-S009', weightModifier: 1.2 },
      { signalId: 'SIG-S010', weightModifier: 0.8 },
    ],
    false_positive_traps: ['viral tech review spikes', 'enthusiast niche hardware'],
  },
  {
    category: 'tools',
    expected_patterns: ['durability', 'torque', 'build quality', 'heaviness'],
    normal_anomalies: ['case quality issues', 'missing small parts'],
    high_risk_signals: ['aesthetic only praise', 'fake professional endorsements'],
    weight_adjustments: [
      { signalId: 'SIG-G002', weightModifier: 1.5 },
    ],
    false_positive_traps: ['bulk purchases by contractors'],
  },
  {
    category: 'apparel',
    expected_patterns: ['sizing', 'fit', 'material', 'wash quality'],
    normal_anomalies: ['color mismatch in photos'],
    high_risk_signals: ['no mention of sizing', 'stock photo uploads'],
    weight_adjustments: [
      { signalId: 'SIG-S002', weightModifier: 1.5 },
    ],
    false_positive_traps: ['influencer collection drops'],
  },
  {
    category: 'supplements',
    expected_patterns: ['taste', 'solubility', 'energy levels'],
    normal_anomalies: ['packaging changes'],
    high_risk_signals: ['miracle claims', 'instant results'],
    weight_adjustments: [
      { signalId: 'SIG-S002', weightModifier: 1.8 },
      { signalId: 'SIG-S009', weightModifier: 1.5 },
    ],
    false_positive_traps: ['biohacker community spikes'],
  }
];
