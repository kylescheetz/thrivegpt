import { PromptTemplate, JournalInsightInput, JournalInsightResponse } from '@/types/gpt-prompts';

export const JOURNAL_INSIGHT_PROMPT: PromptTemplate = {
  id: 'journal_insight',
  name: 'Journal Insight & Thought Reframing',
  description: 'Extracts key themes from journal entries and provides cognitive reframing for negative thought patterns',
  outputFormat: 'json',
  
  systemPrompt: `You are an expert cognitive behavioral therapist and mindfulness coach specializing in journal analysis and thought reframing. Your role is to help users gain insights from their writing and develop healthier thought patterns.

ANALYSIS APPROACH:
- Identify recurring themes, patterns, and emotional undertones in journal entries
- Recognize cognitive distortions and negative thought patterns
- Provide evidence-based cognitive reframing using CBT techniques
- Extract actionable insights for personal growth and self-awareness
- Maintain a balance between validation and constructive challenge
- Consider the user's goals and previous entries for context

COGNITIVE REFRAMING TECHNIQUES:
- All-or-nothing thinking → Balanced perspective
- Catastrophizing → Realistic probability assessment
- Mind reading → Evidence-based assumptions
- Emotional reasoning → Facts vs. feelings distinction
- Should statements → Preference-based language
- Labeling → Behavior-specific observations

THERAPEUTIC PRINCIPLES:
- Validate emotions while challenging unhelpful thoughts
- Use Socratic questioning to promote self-discovery
- Provide specific, actionable reframes
- Encourage self-compassion and growth mindset
- Focus on strengths and resilience alongside challenges
- Respect the user's autonomy and perspective`,

  userPromptTemplate: `Please analyze the following journal entry and provide comprehensive insights:

**Date:** {{date}}

**Journal Entry:**
"{{entry}}"

{{#if userGoals}}
**User's Current Goals:**
{{#each userGoals}}
- {{this}}
{{/each}}
{{/if}}

{{#if currentChallenges}}
**Current Challenges:**
{{#each currentChallenges}}
- {{this}}
{{/each}}
{{/if}}

{{#if previousEntries}}
**Previous Entry Context (for pattern analysis):**
{{#each previousEntries}}
**{{date}}:** {{content}}
---
{{/each}}
{{/if}}

Analyze this journal entry to extract key themes, identify cognitive patterns, provide thoughtful reframes for negative thinking, and offer insights that promote self-awareness and personal growth. Focus on both celebrating strengths and gently challenging unhelpful thought patterns.`,

  responseSchema: {
    type: 'object',
    properties: {
      themes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            theme: { type: 'string', description: 'Main theme identified' },
            relevance: { type: 'number', description: 'Relevance score 0-1' },
            frequency: { type: 'number', description: 'How often this theme appears' },
            category: { 
              type: 'string', 
              enum: ['growth', 'challenge', 'relationship', 'work', 'health', 'personal'],
              description: 'Category of the theme'
            },
            keyPhrases: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'Key phrases supporting this theme'
            }
          },
          required: ['theme', 'relevance', 'category', 'keyPhrases']
        }
      },
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
                emotion: { type: 'string' },
                intensity: { type: 'number' },
                description: { type: 'string' }
              },
              required: ['emotion', 'intensity', 'description']
            }
          },
          keywords: { type: 'array', items: { type: 'string' } },
          concerns: { type: 'array', items: { type: 'string' } }
        },
        required: ['overall', 'confidence', 'emotions']
      },
      insights: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            insight: { type: 'string', description: 'Key insight about the user' },
            category: { 
              type: 'string', 
              enum: ['strength', 'pattern', 'opportunity', 'concern'],
              description: 'Type of insight'
            },
            confidence: { type: 'number', description: 'Confidence in this insight 0-1' },
            supportingEvidence: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'Evidence from the text supporting this insight'
            }
          },
          required: ['insight', 'category', 'confidence', 'supportingEvidence']
        }
      },
      reframes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            originalThought: { type: 'string', description: 'Original negative or unhelpful thought' },
            cognitiveDistortion: { 
              type: 'string', 
              description: 'Type of cognitive distortion if present'
            },
            reframedThought: { type: 'string', description: 'Healthier, more balanced thought' },
            technique: { type: 'string', description: 'CBT technique used for reframing' },
            explanation: { type: 'string', description: 'Why this reframe is helpful' }
          },
          required: ['originalThought', 'reframedThought', 'technique', 'explanation']
        }
      },
      patterns: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            pattern: { type: 'string', description: 'Behavioral or thought pattern identified' },
            description: { type: 'string', description: 'Detailed description of the pattern' },
            frequency: { 
              type: 'string', 
              enum: ['daily', 'weekly', 'occasional', 'rare'],
              description: 'How often this pattern occurs'
            },
            impact: { 
              type: 'string', 
              enum: ['positive', 'neutral', 'negative'],
              description: 'Impact of this pattern on wellbeing'
            },
            suggestions: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'Suggestions for addressing this pattern'
            }
          },
          required: ['pattern', 'description', 'frequency', 'impact', 'suggestions']
        }
      },
      actionItems: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            action: { type: 'string', description: 'Specific action the user can take' },
            priority: { type: 'string', enum: ['high', 'medium', 'low'] },
            timeframe: { type: 'string', description: 'Suggested timeframe for this action' },
            category: { 
              type: 'string', 
              enum: ['immediate', 'this-week', 'this-month', 'ongoing'],
              description: 'When to implement this action'
            },
            relatedThemes: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'Themes this action addresses'
            }
          },
          required: ['action', 'priority', 'timeframe', 'category']
        }
      },
      reflection: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            prompt: { type: 'string', description: 'Reflective question or prompt' },
            purpose: { type: 'string', description: 'Purpose of this reflection prompt' },
            category: { 
              type: 'string', 
              enum: ['gratitude', 'growth', 'challenge', 'future', 'values'],
              description: 'Type of reflection'
            }
          },
          required: ['prompt', 'purpose', 'category']
        }
      }
    },
    required: ['themes', 'sentiment', 'insights', 'reframes', 'patterns', 'actionItems', 'reflection']
  },

  examples: [
    {
      description: 'Example with self-doubt and perfectionism themes',
      input: {
        entry: 'Had a presentation at work today and I think it went terribly. I stumbled over a few words and forgot one of my key points. Everyone probably thinks I\'m incompetent now. I should have prepared more, practiced more. I always mess things up when it matters most. Maybe I\'m just not cut out for this job. I keep comparing myself to Sarah who always seems so confident and polished.',
        date: '2024-01-16',
        userGoals: ['Build confidence at work', 'Improve public speaking'],
        currentChallenges: ['Imposter syndrome', 'Perfectionism']
      },
      expectedOutput: {
        themes: [
          {
            theme: 'Self-criticism and perfectionism',
            relevance: 0.9,
            frequency: 1,
            category: 'personal',
            keyPhrases: ['should have prepared more', 'I always mess things up', 'not cut out for this job']
          },
          {
            theme: 'Social comparison',
            relevance: 0.7,
            frequency: 1,
            category: 'work',
            keyPhrases: ['comparing myself to Sarah', 'always seems so confident']
          },
          {
            theme: 'Performance anxiety',
            relevance: 0.8,
            frequency: 1,
            category: 'work',
            keyPhrases: ['went terribly', 'stumbled over words', 'when it matters most']
          }
        ],
        sentiment: {
          overall: 'negative',
          confidence: 0.9,
          emotions: [
            {
              emotion: 'shame',
              intensity: 0.8,
              description: 'Strong feelings of inadequacy about work performance'
            },
            {
              emotion: 'anxiety',
              intensity: 0.7,
              description: 'Worry about others\' perceptions and future performance'
            }
          ],
          keywords: ['terribly', 'incompetent', 'mess things up'],
          concerns: ['Self-worth tied to performance', 'All-or-nothing thinking', 'Mind reading others\' thoughts']
        },
        insights: [
          {
            insight: 'Strong perfectionist tendencies that create unrealistic standards',
            category: 'pattern',
            confidence: 0.9,
            supportingEvidence: ['should have prepared more', 'I always mess things up', 'not cut out for this job']
          },
          {
            insight: 'Uses social comparison as a measure of self-worth',
            category: 'concern',
            confidence: 0.8,
            supportingEvidence: ['comparing myself to Sarah', 'always seems so confident and polished']
          }
        ],
        reframes: [
          {
            originalThought: 'Everyone probably thinks I\'m incompetent now',
            cognitiveDistortion: 'Mind reading',
            reframedThought: 'I don\'t know what others are thinking. Most people are focused on their own concerns and likely didn\'t notice small mistakes as much as I did.',
            technique: 'Evidence examination',
            explanation: 'This reframe challenges the assumption that we can know others\' thoughts and reminds us that people are generally less focused on our mistakes than we imagine.'
          },
          {
            originalThought: 'I always mess things up when it matters most',
            cognitiveDistortion: 'All-or-nothing thinking',
            reframedThought: 'I had some challenges with this presentation, but I\'ve also had successful presentations before. This is one experience, not a pattern of total failure.',
            technique: 'Balanced thinking',
            explanation: 'This reframe counters the absolute language and helps recognize that performance varies and improvement is possible.'
          }
        ],
        patterns: [
          {
            pattern: 'Catastrophizing minor mistakes',
            description: 'Tendency to view small errors as major failures with lasting consequences',
            frequency: 'occasional',
            impact: 'negative',
            suggestions: [
              'Practice self-compassion exercises',
              'Keep a success journal to balance perspective',
              'Set realistic expectations for performance'
            ]
          }
        ],
        actionItems: [
          {
            action: 'Write down three things that went well in the presentation',
            priority: 'high',
            timeframe: 'Today',
            category: 'immediate',
            relatedThemes: ['Self-criticism and perfectionism']
          },
          {
            action: 'Practice self-compassion by speaking to yourself as you would a good friend',
            priority: 'medium',
            timeframe: 'This week',
            category: 'ongoing',
            relatedThemes: ['Self-criticism and perfectionism']
          }
        ],
        reflection: [
          {
            prompt: 'What would you tell a friend who had the same experience with their presentation?',
            purpose: 'Develop self-compassion and balanced perspective',
            category: 'growth'
          },
          {
            prompt: 'What are three skills or qualities you bring to your work, regardless of this one presentation?',
            purpose: 'Reconnect with personal strengths and value',
            category: 'values'
          }
        ]
      }
    }
  ]
};