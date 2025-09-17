import { PromptTemplate, HabitReviewInput, HabitReviewResponse } from '@/types/gpt-prompts';

export const HABIT_REVIEW_PROMPT: PromptTemplate = {
  id: 'habit_review',
  name: 'Habit Review & Performance Analysis',
  description: 'Analyzes daily habit performance and provides personalized tips and insights',
  outputFormat: 'json',
  
  systemPrompt: `You are an expert wellness coach and behavioral psychologist specializing in habit formation and maintenance. Your role is to analyze user habit performance data and provide actionable insights, encouragement, and specific tips to help users improve their wellness journey.

ANALYSIS GUIDELINES:
- Focus on patterns, trends, and behavioral insights
- Provide specific, actionable advice tailored to each habit
- Balance encouragement with constructive feedback
- Consider habit difficulty and user's current streak when giving advice
- Identify both strengths to celebrate and areas for improvement
- Suggest evidence-based techniques for habit optimization

OUTPUT REQUIREMENTS:
- Always respond in valid JSON format
- Include numerical scores where specified
- Provide specific habit-level recommendations
- Keep language positive and motivational
- Base insights on provided data only`,

  userPromptTemplate: `Please analyze the following habit performance data and provide comprehensive insights:

**Date:** {{date}}

**User Goals:** {{userGoals}}

**Habit Performance Data:**
{{#each habits}}
- **{{habitName}}** ({{category}}, {{difficulty}} difficulty)
  - Completed Today: {{completedToday}}
  - Current Streak: {{currentStreak}} days
  - 7-Day Completion Rate: {{completionRate7Days}}%
  - 30-Day Completion Rate: {{completionRate30Days}}%
  - Target Frequency: {{targetFrequency}}
  {{#if notes}}
  - User Notes: {{notes}}
  {{/if}}
{{/each}}

{{#if previousWeekData}}
**Previous Week Comparison:**
{{#each previousWeekData}}
- {{habitName}}: {{completionRate7Days}}% completion rate
{{/each}}
{{/if}}

Analyze this data and provide a comprehensive review with specific insights, tips, and motivation. Focus on actionable advice that will help the user improve their habit consistency and overall wellness journey.`,

  responseSchema: {
    type: 'object',
    properties: {
      summary: {
        type: 'object',
        properties: {
          overallScore: { type: 'number', description: 'Overall performance score 0-100' },
          totalHabits: { type: 'number', description: 'Total number of habits tracked' },
          completedToday: { type: 'number', description: 'Number of habits completed today' },
          averageStreak: { type: 'number', description: 'Average streak across all habits' },
          topPerformingHabit: { type: 'string', description: 'Name of best performing habit' },
          needsAttentionHabit: { type: 'string', description: 'Habit that needs most attention' }
        },
        required: ['overallScore', 'totalHabits', 'completedToday', 'averageStreak']
      },
      insights: {
        type: 'object',
        properties: {
          strengths: { 
            type: 'array', 
            items: { type: 'string' },
            description: 'User\'s habit strengths and positive patterns'
          },
          improvements: { 
            type: 'array', 
            items: { type: 'string' },
            description: 'Areas where user can improve'
          },
          patterns: { 
            type: 'array', 
            items: { type: 'string' },
            description: 'Behavioral patterns identified in the data'
          }
        },
        required: ['strengths', 'improvements', 'patterns']
      },
      tips: {
        type: 'object',
        properties: {
          specific: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                habitId: { type: 'string' },
                habitName: { type: 'string' },
                tip: { type: 'string', description: 'Specific actionable tip for this habit' },
                priority: { type: 'string', enum: ['high', 'medium', 'low'] },
                category: { type: 'string', enum: ['timing', 'technique', 'motivation', 'environment'] }
              },
              required: ['habitName', 'tip', 'priority', 'category']
            }
          },
          general: { 
            type: 'array', 
            items: { type: 'string' },
            description: 'General habit formation tips'
          }
        },
        required: ['specific', 'general']
      },
      motivation: {
        type: 'object',
        properties: {
          encouragement: { type: 'string', description: 'Personalized encouraging message' },
          nextSteps: { 
            type: 'array', 
            items: { type: 'string' },
            description: 'Recommended next steps for habit improvement'
          }
        },
        required: ['encouragement', 'nextSteps']
      }
    },
    required: ['summary', 'insights', 'tips', 'motivation']
  },

  examples: [
    {
      description: 'Example with mixed habit performance',
      input: {
        date: '2024-01-15',
        userGoals: ['Improve energy', 'Better sleep'],
        habits: [
          {
            habitId: 'water_intake',
            habitName: 'Drink 8 glasses of water',
            targetFrequency: 'daily',
            completedToday: true,
            currentStreak: 12,
            completionRate7Days: 86,
            completionRate30Days: 78,
            difficulty: 'easy',
            category: 'health'
          },
          {
            habitId: 'morning_walk',
            habitName: 'Morning walk',
            targetFrequency: 'daily',
            completedToday: false,
            currentStreak: 0,
            completionRate7Days: 43,
            completionRate30Days: 52,
            difficulty: 'medium',
            category: 'movement',
            notes: 'Struggled with rainy weather this week'
          }
        ]
      },
      expectedOutput: {
        summary: {
          overallScore: 65,
          totalHabits: 2,
          completedToday: 1,
          averageStreak: 6,
          topPerformingHabit: 'Drink 8 glasses of water',
          needsAttentionHabit: 'Morning walk'
        },
        insights: {
          strengths: [
            'Excellent consistency with water intake - 12-day streak shows strong habit formation',
            'Water habit completion rate of 86% this week demonstrates good routine establishment'
          ],
          improvements: [
            'Morning walk consistency needs attention - only 43% completion this week',
            'Weather dependency is affecting outdoor exercise habits'
          ],
          patterns: [
            'Strong performance with easy, indoor habits',
            'Environmental factors significantly impact movement habits'
          ]
        },
        tips: {
          specific: [
            {
              habitName: 'Morning walk',
              tip: 'Create a backup indoor routine for rainy days - try 10 minutes of indoor stretching or stair climbing',
              priority: 'high',
              category: 'environment'
            },
            {
              habitName: 'Drink 8 glasses of water',
              tip: 'Great consistency! Consider linking water intake to meals to maintain this strong habit',
              priority: 'low',
              category: 'technique'
            }
          ],
          general: [
            'Prepare backup plans for weather-dependent habits',
            'Stack new habits onto existing strong ones for better success'
          ]
        },
        motivation: {
          encouragement: 'You\'re doing great with your water intake habit - that 12-day streak is impressive! Don\'t let a few missed walks discourage you; every wellness journey has ups and downs.',
          nextSteps: [
            'Set up an indoor backup routine for rainy days',
            'Track weather patterns to anticipate challenging days',
            'Celebrate your water intake success as motivation for other habits'
          ]
        }
      }
    }
  ]
};