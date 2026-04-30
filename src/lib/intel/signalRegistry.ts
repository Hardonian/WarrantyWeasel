export interface ReviewSignal {
  id: string;
  name: string;
  type: 'SUSPICIOUS' | 'SAFE' | 'HYBRID';
  weight: number;
  description: string;
  combination_logic?: string;
  example?: string;
  consumer_explanation?: string;
}

export const reviewSignals: ReviewSignal[] = [
  // SUSPICIOUS SIGNALS (SIG-S001 - SIG-S100)
  { id: 'SIG-S001', name: 'Burst_Arrival', type: 'SUSPICIOUS', weight: -40, description: '50+ reviews in < 12 hours.' },
  { id: 'SIG-S051', name: 'Unnatural_Length_Consistency', type: 'SUSPICIOUS', weight: -35, description: 'Reviews all within +/- 5 characters of each other.' },
  { id: 'SIG-S052', name: 'Pro_Lighting_Photos', type: 'SUSPICIOUS', weight: -20, description: 'User photos have studio-grade lighting/composition.' },
  { id: 'SIG-S053', name: 'Recursive_Author_Naming', type: 'SUSPICIOUS', weight: -30, description: 'Authors use patterns like User_001, User_002.' },
  { id: 'SIG-S054', name: 'Zero_Negative_Noun_Density', type: 'SUSPICIOUS', weight: -25, description: '100+ reviews without a single critical noun.' },
  { id: 'SIG-S055', name: 'Cross_Retailer_Text_Sync', type: 'SUSPICIOUS', weight: -45, description: 'Identical review text found on multiple retail sites.' },
  { id: 'SIG-S056', name: 'Vague_Value_Superlatives', type: 'SUSPICIOUS', weight: -15, description: 'Excessive use of "good value" without specific details.' },
  { id: 'SIG-S057', name: 'Temporal_Sentiment_Inversion', type: 'SUSPICIOUS', weight: -40, description: 'Sudden shift from 1-star to 5-star without product update.' },
  { id: 'SIG-S058', name: 'Mention_of_Competitor_Negative', type: 'SUSPICIOUS', weight: -20, description: 'Review focuses on trashing a specific competitor brand.' },
  { id: 'SIG-S059', name: 'Linguistic_Entropy_Floor', type: 'SUSPICIOUS', weight: -35, description: 'Text structure matches known LLM/Markov chain output patterns.' },
  { id: 'SIG-S060', name: 'Hidden_CTA', type: 'SUSPICIOUS', weight: -50, description: 'Review body contains instructions to "Contact us for a refund."' },

  // SAFE SIGNALS (SIG-G001 - SIG-G060)
  { id: 'SIG-G001', name: 'Verified_Purchase', type: 'SAFE', weight: 25, description: 'Purchase confirmed by platform.' },
  { id: 'SIG-G031', name: 'Hardware_Revision_Mention', type: 'SAFE', weight: 25, description: 'User notes specific version or revision.' },
  { id: 'SIG-G032', name: 'Competitor_Contrast', type: 'SAFE', weight: 20, description: 'Fair comparison with other products.' },
  { id: 'SIG-G033', name: 'Contextual_Home_Photo', type: 'SAFE', weight: 30, description: 'Image shows product in a real-world setting.' },
  { id: 'SIG-G034', name: 'Shipping_Honesty', type: 'SAFE', weight: 10, description: 'Mention of minor delivery or packaging issues.' },
  { id: 'SIG-G035', name: 'Follow_Up_Usage_6Mo', type: 'SAFE', weight: 35, description: 'Updated review after 6+ months of use.' },

  // HYBRID SIGNALS (SIG-H001 - SIG-H020)
  { id: 'SIG-H001', name: 'Verified_Burst', type: 'HYBRID', weight: -10, description: 'High volume of verified reviews in 24h.' },
  { id: 'SIG-H002', name: 'Influencer_Social_Mention', type: 'HYBRID', weight: -5, description: 'Mentions of specific social media handles.' }
];
