// GPT Prompt Templates and Response Types for ThriveGPT

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  userPromptTemplate: string;
  outputFormat: 'json' | 'yaml' | 'text';
  responseSchema: any;
  examples?: PromptExample[];
}

export interface PromptExample {
  input: Record<string, any>;
  expectedOutput: any;
  description?: string;
}

export interface GPTRequest {
  templateId: string;
  variables: Record<string, any>;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface GPTResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  rawResponse?: string;
  tokensUsed?: number;
  processingTime?: number;
}

// Habit Review Types
export interface HabitReviewInput {
  habits: HabitPerformance[];
  date: string;
  userGoals: string[];
  previousWeekData?: HabitPerformance[];
}

export interface HabitPerformance {
  habitId: string;
  habitName: string;
  targetFrequency: 'daily' | 'weekly' | 'custom';
  completedToday: boolean;
  currentStreak: number;
  completionRate7Days: number;
  completionRate30Days: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  notes?: string;
}

export interface HabitReviewResponse {
  summary: {
    overallScore: number;
    totalHabits: number;
    completedToday: number;
    averageStreak: number;
    topPerformingHabit: string;
    needsAttentionHabit: string;
  };
  insights: {
    strengths: string[];
    improvements: string[];
    patterns: string[];
  };
  tips: {
    specific: HabitTip[];
    general: string[];
  };
  motivation: {
    encouragement: string;
    nextSteps: string[];
  };
}

export interface HabitTip {
  habitId: string;
  habitName: string;
  tip: string;
  priority: 'high' | 'medium' | 'low';
  category: 'timing' | 'technique' | 'motivation' | 'environment';
}

// Check-in Sentiment Types
export interface CheckInSentimentInput {
  text: string;
  moodRating?: number; // 1-10 scale
  energyLevel?: number; // 1-10 scale
  stressLevel?: number; // 1-10 scale
  context?: {
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    dayOfWeek: string;
    recentEvents?: string[];
  };
  previousCheckIns?: CheckInHistory[];
}

export interface CheckInHistory {
  date: string;
  sentiment: SentimentAnalysis;
  moodRating: number;
}

export interface CheckInSentimentResponse {
  sentiment: SentimentAnalysis;
  emotionalState: EmotionalState;
  copingStrategies: CopingStrategy[];
  recommendations: Recommendation[];
  followUp: FollowUpSuggestion[];
}

export interface SentimentAnalysis {
  overall: 'positive' | 'neutral' | 'negative';
  confidence: number; // 0-1
  emotions: EmotionScore[];
  keywords: string[];
  concerns: string[];
}

export interface EmotionScore {
  emotion: string;
  intensity: number; // 0-1
  description: string;
}

export interface EmotionalState {
  primary: string;
  secondary: string[];
  stability: 'stable' | 'fluctuating' | 'declining' | 'improving';
  trends: string[];
}

export interface CopingStrategy {
  strategy: string;
  description: string;
  timeRequired: string;
  effectiveness: 'high' | 'medium' | 'low';
  category: 'immediate' | 'short-term' | 'long-term';
  instructions: string[];
}

export interface Recommendation {
  type: 'activity' | 'mindset' | 'environment' | 'social' | 'professional';
  title: string;
  description: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  timeframe: string;
}

export interface FollowUpSuggestion {
  timing: string;
  question: string;
  purpose: string;
}

// Journal Insight Types
export interface JournalInsightInput {
  entry: string;
  date: string;
  previousEntries?: JournalEntry[];
  userGoals?: string[];
  currentChallenges?: string[];
}

export interface JournalEntry {
  date: string;
  content: string;
  themes?: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface JournalInsightResponse {
  themes: JournalTheme[];
  sentiment: SentimentAnalysis;
  insights: JournalInsight[];
  reframes: ThoughtReframe[];
  patterns: JournalPattern[];
  actionItems: ActionItem[];
  reflection: ReflectionPrompt[];
}

export interface JournalTheme {
  theme: string;
  relevance: number; // 0-1
  frequency: number; // how often this theme appears
  category: 'growth' | 'challenge' | 'relationship' | 'work' | 'health' | 'personal';
  keyPhrases: string[];
}

export interface JournalInsight {
  insight: string;
  category: 'strength' | 'pattern' | 'opportunity' | 'concern';
  confidence: number; // 0-1
  supportingEvidence: string[];
}

export interface ThoughtReframe {
  originalThought: string;
  cognitiveDistortion?: string;
  reframedThought: string;
  technique: string;
  explanation: string;
}

export interface JournalPattern {
  pattern: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'occasional' | 'rare';
  impact: 'positive' | 'neutral' | 'negative';
  suggestions: string[];
}

export interface ActionItem {
  action: string;
  priority: 'high' | 'medium' | 'low';
  timeframe: string;
  category: 'immediate' | 'this-week' | 'this-month' | 'ongoing';
  relatedThemes: string[];
}

export interface ReflectionPrompt {
  prompt: string;
  purpose: string;
  category: 'gratitude' | 'growth' | 'challenge' | 'future' | 'values';
}

// Biohack Suggester Types
export interface BiohackSuggesterInput {
  userGoals: UserGoal[];
  currentRoutines: BiohackRoutine[];
  pastRatings: BiohackRating[];
  userProfile: {
    age?: number;
    fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
    timeAvailable: 'minimal' | 'moderate' | 'flexible';
    preferences: string[];
    restrictions: string[];
  };
  targetAreas: string[];
}

export interface UserGoal {
  goal: string;
  category: 'energy' | 'focus' | 'sleep' | 'fitness' | 'stress' | 'longevity';
  priority: 'high' | 'medium' | 'low';
  timeline: string;
}

export interface BiohackRoutine {
  id: string;
  name: string;
  category: string;
  description: string;
  frequency: string;
  duration: string;
  currentlyActive: boolean;
  startDate: string;
}

export interface BiohackRating {
  routineId: string;
  routineName: string;
  rating: number; // 1-5
  effectiveness: number; // 1-5
  enjoyment: number; // 1-5
  sustainability: number; // 1-5
  date: string;
  notes?: string;
}

export interface BiohackSuggesterResponse {
  recommendations: BiohackRecommendation[];
  optimizations: BiohackOptimization[];
  sequences: BiohackSequence[];
  warnings: BiohackWarning[];
  progressTracking: ProgressMetric[];
}

export interface BiohackRecommendation {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeRequired: string;
  frequency: string;
  expectedBenefits: string[];
  targetGoals: string[];
  instructions: string[];
  equipment: string[];
  scientificBasis: string;
  compatibleWith: string[];
  incompatibleWith: string[];
  priority: number; // 1-10
}

export interface BiohackOptimization {
  routineId: string;
  currentRoutine: string;
  optimization: string;
  reasoning: string;
  expectedImprovement: string;
  implementation: string[];
}

export interface BiohackSequence {
  name: string;
  description: string;
  routines: string[];
  timing: string;
  totalDuration: string;
  synergies: string[];
}

export interface BiohackWarning {
  type: 'safety' | 'interaction' | 'contraindication' | 'timing';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedRoutines: string[];
}

export interface ProgressMetric {
  metric: string;
  description: string;
  frequency: string;
  targetValue?: string;
  trackingMethod: string;
}

// Prompt Template IDs
export enum PromptTemplateId {
  HABIT_REVIEW = 'habit_review',
  CHECKIN_SENTIMENT = 'checkin_sentiment',
  JOURNAL_INSIGHT = 'journal_insight',
  BIOHACK_SUGGESTER = 'biohack_suggester'
}

// GPT Model Options
export enum GPTModel {
  GPT4_TURBO = 'gpt-4-1106-preview',
  GPT4 = 'gpt-4',
  GPT35_TURBO = 'gpt-3.5-turbo-1106'
}

// Response Validation Schema Types
export interface ResponseSchema {
  type: 'object' | 'array' | 'string' | 'number' | 'boolean';
  properties?: Record<string, ResponseSchema>;
  items?: ResponseSchema;
  required?: string[];
  enum?: any[];
  description?: string;
}