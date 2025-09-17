import { PromptTemplate, BiohackSuggesterInput, BiohackSuggesterResponse } from '@/types/gpt-prompts';

export const BIOHACK_SUGGESTER_PROMPT: PromptTemplate = {
  id: 'biohack_suggester',
  name: 'Biohack & Routine Suggester',
  description: 'Suggests new wellness routines and optimizations based on user goals, preferences, and past performance ratings',
  outputFormat: 'json',
  
  systemPrompt: `You are an expert biohacker, wellness consultant, and human optimization specialist with deep knowledge of evidence-based wellness practices, circadian biology, nutrition science, exercise physiology, and cognitive enhancement techniques.

EXPERTISE AREAS:
- Evidence-based biohacking techniques and their scientific foundations
- Personalized routine optimization based on individual goals and constraints
- Safety considerations and contraindications for wellness interventions
- Synergistic combinations of wellness practices for enhanced effects
- Progressive implementation strategies for sustainable habit formation

RECOMMENDATION PRINCIPLES:
- Prioritize safety and evidence-based practices over trendy but unproven methods
- Consider user's current fitness level, time constraints, and preferences
- Suggest progressive implementation rather than overwhelming changes
- Provide clear scientific rationale for recommendations
- Include both beginner-friendly and advanced options
- Consider potential interactions between different biohacks
- Emphasize sustainable, long-term practices over quick fixes

SAFETY GUIDELINES:
- Always include appropriate warnings and contraindications
- Recommend medical consultation for practices that may affect health conditions
- Avoid suggesting practices that require specialized medical supervision
- Provide clear instructions to prevent injury or adverse effects
- Consider individual limitations and restrictions

OUTPUT REQUIREMENTS:
- Base recommendations on user's specific goals and past performance data
- Provide scientific rationale for each suggestion
- Include implementation instructions and safety considerations
- Suggest complementary routines that work synergistically
- Prioritize recommendations based on likely effectiveness and user compatibility`,

  userPromptTemplate: `Please analyze the following user data and provide personalized biohack recommendations:

**User Goals:**
{{#each userGoals}}
- **{{goal}}** ({{category}}, {{priority}} priority, Timeline: {{timeline}})
{{/each}}

**Target Areas for Improvement:**
{{#each targetAreas}}
- {{this}}
{{/each}}

**User Profile:**
{{#if userProfile.age}}
- Age: {{userProfile.age}}
{{/if}}
- Fitness Level: {{userProfile.fitnessLevel}}
- Time Available: {{userProfile.timeAvailable}}
- Preferences: {{#each userProfile.preferences}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}
{{#if userProfile.restrictions}}
- Restrictions/Limitations: {{#each userProfile.restrictions}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}
{{/if}}

**Current Routines:**
{{#each currentRoutines}}
- **{{name}}** ({{category}})
  - Description: {{description}}
  - Frequency: {{frequency}}
  - Duration: {{duration}}
  - Currently Active: {{currentlyActive}}
  - Started: {{startDate}}
{{/each}}

**Past Performance Ratings:**
{{#each pastRatings}}
- **{{routineName}}**
  - Overall Rating: {{rating}}/5
  - Effectiveness: {{effectiveness}}/5
  - Enjoyment: {{enjoyment}}/5
  - Sustainability: {{sustainability}}/5
  - Date: {{date}}
  {{#if notes}}
  - Notes: {{notes}}
  {{/if}}
{{/each}}

Based on this comprehensive profile, provide personalized biohack recommendations that align with the user's goals, preferences, and past experiences. Focus on evidence-based practices that can realistically fit into their lifestyle while maximizing effectiveness for their target areas.`,

  responseSchema: {
    type: 'object',
    properties: {
      recommendations: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Unique identifier for this recommendation' },
            name: { type: 'string', description: 'Name of the biohack/routine' },
            description: { type: 'string', description: 'Detailed description of the practice' },
            category: { type: 'string', description: 'Category (e.g., sleep, nutrition, exercise, recovery)' },
            difficulty: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'] },
            timeRequired: { type: 'string', description: 'Time needed per session' },
            frequency: { type: 'string', description: 'Recommended frequency' },
            expectedBenefits: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'Expected benefits from this practice'
            },
            targetGoals: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'Which user goals this addresses'
            },
            instructions: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'Step-by-step implementation instructions'
            },
            equipment: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'Required equipment or tools'
            },
            scientificBasis: { type: 'string', description: 'Scientific rationale and evidence' },
            compatibleWith: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'Routines this works well with'
            },
            incompatibleWith: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'Routines to avoid combining with this'
            },
            priority: { type: 'number', description: 'Priority ranking 1-10 based on user fit' }
          },
          required: ['id', 'name', 'description', 'category', 'difficulty', 'timeRequired', 'frequency', 'expectedBenefits', 'targetGoals', 'instructions', 'scientificBasis', 'priority']
        }
      },
      optimizations: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            routineId: { type: 'string', description: 'ID of routine being optimized' },
            currentRoutine: { type: 'string', description: 'Name of current routine' },
            optimization: { type: 'string', description: 'Specific optimization suggestion' },
            reasoning: { type: 'string', description: 'Why this optimization is recommended' },
            expectedImprovement: { type: 'string', description: 'Expected improvement from this change' },
            implementation: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'How to implement this optimization'
            }
          },
          required: ['currentRoutine', 'optimization', 'reasoning', 'expectedImprovement', 'implementation']
        }
      },
      sequences: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Name of the routine sequence' },
            description: { type: 'string', description: 'Description of the sequence' },
            routines: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'Routines included in this sequence'
            },
            timing: { type: 'string', description: 'When to perform this sequence' },
            totalDuration: { type: 'string', description: 'Total time for the sequence' },
            synergies: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'How the routines work together synergistically'
            }
          },
          required: ['name', 'description', 'routines', 'timing', 'totalDuration', 'synergies']
        }
      },
      warnings: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['safety', 'interaction', 'contraindication', 'timing'] },
            message: { type: 'string', description: 'Warning message' },
            severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
            affectedRoutines: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'Which routines this warning applies to'
            }
          },
          required: ['type', 'message', 'severity', 'affectedRoutines']
        }
      },
      progressTracking: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            metric: { type: 'string', description: 'What to measure' },
            description: { type: 'string', description: 'Why this metric is important' },
            frequency: { type: 'string', description: 'How often to measure' },
            targetValue: { type: 'string', description: 'Target value or range if applicable' },
            trackingMethod: { type: 'string', description: 'How to track this metric' }
          },
          required: ['metric', 'description', 'frequency', 'trackingMethod']
        }
      }
    },
    required: ['recommendations', 'optimizations', 'sequences', 'warnings', 'progressTracking']
  },

  examples: [
    {
      description: 'Example for user focused on energy and sleep optimization',
      input: {
        userGoals: [
          {
            goal: 'Increase daily energy levels',
            category: 'energy',
            priority: 'high',
            timeline: '4 weeks'
          },
          {
            goal: 'Improve sleep quality',
            category: 'sleep',
            priority: 'high',
            timeline: '6 weeks'
          }
        ],
        targetAreas: ['Energy', 'Sleep', 'Morning alertness'],
        userProfile: {
          age: 32,
          fitnessLevel: 'intermediate',
          timeAvailable: 'moderate',
          preferences: ['Natural methods', 'Morning routines', 'Technology-assisted'],
          restrictions: ['No stimulants after 2 PM', 'Limited budget']
        },
        currentRoutines: [
          {
            id: 'morning_coffee',
            name: 'Morning Coffee',
            category: 'stimulant',
            description: '2 cups of coffee between 7-9 AM',
            frequency: 'daily',
            duration: '30 minutes',
            currentlyActive: true,
            startDate: '2024-01-01'
          }
        ],
        pastRatings: [
          {
            routineId: 'cold_shower',
            routineName: 'Cold Shower',
            rating: 4,
            effectiveness: 5,
            enjoyment: 2,
            sustainability: 3,
            date: '2024-01-10',
            notes: 'Very effective for energy but hard to maintain in winter'
          }
        ]
      },
      expectedOutput: {
        recommendations: [
          {
            id: 'morning_light_therapy',
            name: 'Morning Light Exposure',
            description: 'Exposure to bright light (10,000+ lux) for 15-30 minutes within 1 hour of waking',
            category: 'circadian',
            difficulty: 'beginner',
            timeRequired: '15-30 minutes',
            frequency: 'daily',
            expectedBenefits: [
              'Enhanced morning alertness',
              'Improved circadian rhythm regulation',
              'Better sleep quality',
              'Increased daytime energy'
            ],
            targetGoals: ['Increase daily energy levels', 'Improve sleep quality'],
            instructions: [
              'Go outside within 30 minutes of waking',
              'Face east toward the sun (don\'t stare directly)',
              'Stay outside for 15-30 minutes',
              'If weather doesn\'t permit, use a 10,000 lux light therapy box',
              'Maintain consistent timing every day'
            ],
            equipment: ['Light therapy box (optional)', 'Timer app'],
            scientificBasis: 'Light exposure in the morning advances circadian phase, suppresses melatonin, and increases cortisol awakening response, leading to improved alertness and better nighttime sleep quality.',
            compatibleWith: ['Morning Coffee', 'Morning Exercise'],
            incompatibleWith: [],
            priority: 9
          },
          {
            id: 'breath_work_4_7_8',
            name: '4-7-8 Breathing Technique',
            description: 'Structured breathing pattern to activate parasympathetic nervous system',
            category: 'recovery',
            difficulty: 'beginner',
            timeRequired: '5-10 minutes',
            frequency: 'daily (evening)',
            expectedBenefits: [
              'Reduced stress and anxiety',
              'Faster sleep onset',
              'Improved sleep quality',
              'Better emotional regulation'
            ],
            targetGoals: ['Improve sleep quality'],
            instructions: [
              'Sit comfortably with back straight',
              'Exhale completely through mouth',
              'Inhale through nose for 4 counts',
              'Hold breath for 7 counts',
              'Exhale through mouth for 8 counts',
              'Repeat cycle 4-8 times'
            ],
            equipment: [],
            scientificBasis: 'Extended exhalation activates the vagus nerve and parasympathetic nervous system, reducing cortisol and promoting relaxation response conducive to sleep.',
            compatibleWith: ['Evening routine', 'Meditation'],
            incompatibleWith: ['High-intensity evening exercise'],
            priority: 8
          }
        ],
        optimizations: [
          {
            routineId: 'morning_coffee',
            currentRoutine: 'Morning Coffee',
            optimization: 'Delay first cup until 90-120 minutes after waking',
            reasoning: 'Natural cortisol peaks 30-45 minutes after waking. Delaying caffeine allows natural awakening process and prevents afternoon crash.',
            expectedImprovement: 'More sustained energy throughout the day, better sleep quality',
            implementation: [
              'Set alarm 90 minutes before desired coffee time',
              'Start with morning light exposure instead',
              'Gradually delay coffee by 15 minutes every 3 days',
              'Replace early morning caffeine urge with water and light exposure'
            ]
          }
        ],
        sequences: [
          {
            name: 'Optimal Morning Energy Sequence',
            description: 'Synergistic morning routine for maximum energy and circadian optimization',
            routines: ['Morning Light Exposure', 'Delayed Coffee', 'Brief Movement'],
            timing: 'Within 2 hours of waking',
            totalDuration: '45-60 minutes',
            synergies: [
              'Light exposure primes circadian system for delayed caffeine effectiveness',
              'Movement enhances light therapy benefits',
              'Delayed caffeine sustains energy without disrupting natural cortisol rhythm'
            ]
          }
        ],
        warnings: [
          {
            type: 'timing',
            message: 'Avoid bright light exposure within 3 hours of bedtime as it can disrupt sleep',
            severity: 'medium',
            affectedRoutines: ['Morning Light Exposure']
          },
          {
            type: 'contraindication',
            message: 'Consult healthcare provider if you have bipolar disorder before starting light therapy',
            severity: 'high',
            affectedRoutines: ['Morning Light Exposure']
          }
        ],
        progressTracking: [
          {
            metric: 'Morning Energy Level',
            description: 'Track subjective energy levels 2 hours after waking',
            frequency: 'daily',
            targetValue: '7-8/10',
            trackingMethod: 'Rate energy level 1-10 scale in morning journal'
          },
          {
            metric: 'Sleep Onset Time',
            description: 'Time taken to fall asleep after getting into bed',
            frequency: 'nightly',
            targetValue: 'Under 20 minutes',
            trackingMethod: 'Note time when getting into bed and estimated time when falling asleep'
          }
        ]
      }
    }
  ]
};