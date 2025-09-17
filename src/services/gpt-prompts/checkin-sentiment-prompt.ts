import { PromptTemplate, CheckInSentimentInput, CheckInSentimentResponse } from '@/types/gpt-prompts';

export const CHECKIN_SENTIMENT_PROMPT: PromptTemplate = {
  id: 'checkin_sentiment',
  name: 'Check-in Sentiment Analysis & Coping Strategies',
  description: 'Analyzes user text and mood to identify emotional tone and suggest appropriate coping tools and strategies',
  outputFormat: 'json',
  
  systemPrompt: `You are an expert mental health counselor and emotional intelligence specialist. Your role is to analyze user check-in text and mood data to provide compassionate, evidence-based insights and coping strategies.

ANALYSIS GUIDELINES:
- Analyze emotional tone, sentiment, and underlying concerns with high accuracy
- Identify specific emotions beyond basic positive/negative categories
- Provide culturally sensitive and trauma-informed responses
- Suggest evidence-based coping strategies appropriate to the emotional state
- Consider context factors like time of day and recent patterns
- Prioritize user safety - identify potential crisis indicators
- Offer immediate, short-term, and long-term coping strategies

RESPONSE PRINCIPLES:
- Use empathetic, non-judgmental language
- Validate user emotions while providing constructive guidance
- Suggest multiple coping options to accommodate different preferences
- Include both immediate relief and long-term wellness strategies
- Reference specific therapeutic techniques when appropriate
- Maintain professional boundaries while being supportive

SAFETY PROTOCOLS:
- If detecting severe distress, crisis language, or self-harm indicators, prioritize crisis resources
- Always include professional help suggestions for persistent negative patterns
- Avoid diagnosing or providing medical advice`,

  userPromptTemplate: `Please analyze the following check-in data and provide comprehensive emotional support:

**User Check-in Text:**
"{{text}}"

**Mood Metrics:**
{{#if moodRating}}
- Mood Rating: {{moodRating}}/10
{{/if}}
{{#if energyLevel}}
- Energy Level: {{energyLevel}}/10
{{/if}}
{{#if stressLevel}}
- Stress Level: {{stressLevel}}/10
{{/if}}

**Context:**
{{#if context}}
- Time of Day: {{context.timeOfDay}}
- Day of Week: {{context.dayOfWeek}}
{{#if context.recentEvents}}
- Recent Events: {{#each context.recentEvents}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}
{{/if}}
{{/if}}

{{#if previousCheckIns}}
**Recent Check-in History:**
{{#each previousCheckIns}}
- {{date}}: Mood {{moodRating}}/10, Overall sentiment: {{sentiment.overall}}
{{/each}}
{{/if}}

Provide a comprehensive analysis including sentiment assessment, emotional state identification, appropriate coping strategies, and personalized recommendations. Focus on immediate support while building long-term emotional resilience.`,

  responseSchema: {
    type: 'object',
    properties: {
      sentiment: {
        type: 'object',
        properties: {
          overall: { type: 'string', enum: ['positive', 'neutral', 'negative'] },
          confidence: { type: 'number', description: 'Confidence score 0-1' },
          emotions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                emotion: { type: 'string', description: 'Specific emotion identified' },
                intensity: { type: 'number', description: 'Emotion intensity 0-1' },
                description: { type: 'string', description: 'Context about this emotion' }
              },
              required: ['emotion', 'intensity', 'description']
            }
          },
          keywords: { 
            type: 'array', 
            items: { type: 'string' },
            description: 'Key emotional words or phrases identified'
          },
          concerns: { 
            type: 'array', 
            items: { type: 'string' },
            description: 'Specific concerns or issues identified'
          }
        },
        required: ['overall', 'confidence', 'emotions', 'keywords']
      },
      emotionalState: {
        type: 'object',
        properties: {
          primary: { type: 'string', description: 'Primary emotional state' },
          secondary: { 
            type: 'array', 
            items: { type: 'string' },
            description: 'Secondary emotions present'
          },
          stability: { 
            type: 'string', 
            enum: ['stable', 'fluctuating', 'declining', 'improving'],
            description: 'Emotional stability assessment'
          },
          trends: { 
            type: 'array', 
            items: { type: 'string' },
            description: 'Emotional trends based on history'
          }
        },
        required: ['primary', 'secondary', 'stability']
      },
      copingStrategies: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            strategy: { type: 'string', description: 'Name of coping strategy' },
            description: { type: 'string', description: 'Detailed description of strategy' },
            timeRequired: { type: 'string', description: 'Time needed to implement' },
            effectiveness: { type: 'string', enum: ['high', 'medium', 'low'] },
            category: { type: 'string', enum: ['immediate', 'short-term', 'long-term'] },
            instructions: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'Step-by-step instructions'
            }
          },
          required: ['strategy', 'description', 'timeRequired', 'effectiveness', 'category', 'instructions']
        }
      },
      recommendations: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: { 
              type: 'string', 
              enum: ['activity', 'mindset', 'environment', 'social', 'professional'],
              description: 'Type of recommendation'
            },
            title: { type: 'string', description: 'Recommendation title' },
            description: { type: 'string', description: 'Detailed recommendation' },
            priority: { type: 'string', enum: ['urgent', 'high', 'medium', 'low'] },
            timeframe: { type: 'string', description: 'Suggested timeframe for implementation' }
          },
          required: ['type', 'title', 'description', 'priority', 'timeframe']
        }
      },
      followUp: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            timing: { type: 'string', description: 'When to follow up' },
            question: { type: 'string', description: 'Follow-up question to ask' },
            purpose: { type: 'string', description: 'Purpose of this follow-up' }
          },
          required: ['timing', 'question', 'purpose']
        }
      }
    },
    required: ['sentiment', 'emotionalState', 'copingStrategies', 'recommendations', 'followUp']
  },

  examples: [
    {
      description: 'Example with moderate stress and work pressure',
      input: {
        text: 'Feeling overwhelmed today. Work deadlines are piling up and I barely slept last night. Keep thinking I should be doing more but I just feel stuck.',
        moodRating: 4,
        energyLevel: 3,
        stressLevel: 8,
        context: {
          timeOfDay: 'afternoon',
          dayOfWeek: 'Wednesday',
          recentEvents: ['Big project deadline approaching', 'Poor sleep last night']
        }
      },
      expectedOutput: {
        sentiment: {
          overall: 'negative',
          confidence: 0.85,
          emotions: [
            {
              emotion: 'overwhelm',
              intensity: 0.8,
              description: 'Strong sense of being overwhelmed by work responsibilities'
            },
            {
              emotion: 'anxiety',
              intensity: 0.7,
              description: 'Worry about meeting deadlines and performance expectations'
            },
            {
              emotion: 'fatigue',
              intensity: 0.8,
              description: 'Physical and mental exhaustion from poor sleep'
            }
          ],
          keywords: ['overwhelmed', 'deadlines', 'barely slept', 'stuck'],
          concerns: ['Work-life balance', 'Sleep deprivation', 'Performance pressure', 'Perfectionist thinking']
        },
        emotionalState: {
          primary: 'overwhelm',
          secondary: ['anxiety', 'fatigue', 'self-doubt'],
          stability: 'declining',
          trends: ['Increasing stress from work pressure', 'Sleep issues affecting emotional regulation']
        },
        copingStrategies: [
          {
            strategy: 'Progressive Muscle Relaxation',
            description: 'Systematic tensing and relaxing of muscle groups to reduce physical stress',
            timeRequired: '10-15 minutes',
            effectiveness: 'high',
            category: 'immediate',
            instructions: [
              'Find a quiet space and sit comfortably',
              'Start with your toes - tense for 5 seconds, then relax',
              'Work your way up through each muscle group',
              'Focus on the contrast between tension and relaxation',
              'End with deep breathing for 2 minutes'
            ]
          },
          {
            strategy: 'Priority Matrix Planning',
            description: 'Organize tasks by urgency and importance to reduce overwhelm',
            timeRequired: '20-30 minutes',
            effectiveness: 'high',
            category: 'short-term',
            instructions: [
              'List all pending tasks and deadlines',
              'Categorize as: Urgent+Important, Important+Not Urgent, etc.',
              'Focus only on Urgent+Important items today',
              'Schedule Important+Not Urgent for later',
              'Delegate or eliminate low-priority items'
            ]
          }
        ],
        recommendations: [
          {
            type: 'activity',
            title: 'Sleep Hygiene Reset',
            description: 'Implement a structured bedtime routine to improve sleep quality tonight',
            priority: 'high',
            timeframe: 'Tonight'
          },
          {
            type: 'mindset',
            title: 'Perfectionism Challenge',
            description: 'Practice self-compassion and realistic expectations about productivity',
            priority: 'medium',
            timeframe: 'This week'
          },
          {
            type: 'professional',
            title: 'Workload Discussion',
            description: 'Consider discussing workload and deadlines with supervisor if pattern continues',
            priority: 'medium',
            timeframe: 'Within 1-2 weeks'
          }
        ],
        followUp: [
          {
            timing: 'Tomorrow morning',
            question: 'How did you sleep last night, and what\'s your energy level today?',
            purpose: 'Monitor sleep improvement and energy recovery'
          },
          {
            timing: 'In 3 days',
            question: 'How is your stress level with the work deadlines? What strategies have been most helpful?',
            purpose: 'Assess coping strategy effectiveness and ongoing stress levels'
          }
        ]
      }
    }
  ]
};