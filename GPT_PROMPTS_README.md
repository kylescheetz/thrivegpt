# 🤖 GPT Prompt Templates for ThriveGPT Back-End

## Overview

This implementation provides a comprehensive set of GPT-4-turbo prompt templates designed to refine AI interactions for each module of ThriveGPT. The system includes structured prompt templates, response validation, and testing utilities to ensure reliable and scalable AI engine performance.

## 🎯 What's Built

### AI Engine Reliability & Scalability
✅ **4 Specialized Prompt Templates** - Each optimized for specific wellness use cases  
✅ **Structured JSON/YAML Output** - Clear formatting for reliable response parsing  
✅ **Type-Safe Implementation** - Full TypeScript support for all prompts and responses  
✅ **Response Validation** - Automated validation against defined schemas  
✅ **Testing Framework** - Comprehensive testing tools for prompt reliability  
✅ **Error Handling** - Robust error handling and fallback mechanisms  
✅ **Performance Monitoring** - Token usage and processing time tracking

## 📁 File Structure

```
src/
├── types/gpt-prompts.ts                    # TypeScript types and interfaces
├── services/
│   ├── gptService.ts                       # Main GPT service orchestrator
│   └── gpt-prompts/
│       ├── habit-review-prompt.ts          # Habit performance analysis
│       ├── checkin-sentiment-prompt.ts     # Mood and sentiment analysis
│       ├── journal-insight-prompt.ts       # Journal theme extraction
│       └── biohack-suggester-prompt.ts     # Routine recommendations
├── utils/responseParser.ts                 # Response parsing and validation
└── components/GPTPromptTester.tsx          # Testing interface component
```

## 🚀 Prompt Templates

### 1. **Habit Review Prompt** 📊
**Purpose**: Analyzes daily habit performance and provides personalized tips and insights

**Input Data**:
- Habit performance metrics (completion rates, streaks, difficulty)
- User goals and previous week comparison data
- Individual habit notes and context

**Output Structure**:
```json
{
  "summary": {
    "overallScore": 85,
    "totalHabits": 5,
    "completedToday": 4,
    "averageStreak": 12,
    "topPerformingHabit": "Morning meditation",
    "needsAttentionHabit": "Evening workout"
  },
  "insights": {
    "strengths": ["Consistent morning routines", "Strong mindfulness habits"],
    "improvements": ["Evening energy management", "Weekend consistency"],
    "patterns": ["Weather affects outdoor habits", "Stress impacts sleep routine"]
  },
  "tips": {
    "specific": [
      {
        "habitName": "Evening workout",
        "tip": "Try shorter 15-minute sessions when energy is low",
        "priority": "high",
        "category": "technique"
      }
    ],
    "general": ["Stack habits with existing routines", "Prepare backup plans"]
  },
  "motivation": {
    "encouragement": "Your morning routine consistency is impressive!",
    "nextSteps": ["Focus on evening routine", "Track energy patterns"]
  }
}
```

### 2. **Check-in Sentiment Prompt** 💭
**Purpose**: Analyzes user text and mood to identify emotional tone and suggest coping strategies

**Input Data**:
- User check-in text and mood ratings (1-10 scale)
- Context information (time of day, recent events)
- Previous check-in history for pattern analysis

**Output Structure**:
```json
{
  "sentiment": {
    "overall": "negative",
    "confidence": 0.85,
    "emotions": [
      {
        "emotion": "overwhelm",
        "intensity": 0.8,
        "description": "Strong sense of being overwhelmed by responsibilities"
      }
    ],
    "keywords": ["stressed", "overwhelmed", "anxious"],
    "concerns": ["Work-life balance", "Sleep deprivation"]
  },
  "emotionalState": {
    "primary": "overwhelm",
    "secondary": ["anxiety", "fatigue"],
    "stability": "declining",
    "trends": ["Increasing work stress", "Sleep issues affecting mood"]
  },
  "copingStrategies": [
    {
      "strategy": "Progressive Muscle Relaxation",
      "description": "Systematic tensing and relaxing of muscle groups",
      "timeRequired": "10-15 minutes",
      "effectiveness": "high",
      "category": "immediate",
      "instructions": ["Find quiet space", "Start with toes", "Work upward"]
    }
  ],
  "recommendations": [
    {
      "type": "activity",
      "title": "Take a 5-minute breathing break",
      "description": "Use 4-7-8 breathing technique to activate relaxation response",
      "priority": "high",
      "timeframe": "Now"
    }
  ],
  "followUp": [
    {
      "timing": "Tomorrow morning",
      "question": "How did you sleep last night?",
      "purpose": "Monitor sleep improvement"
    }
  ]
}
```

### 3. **Journal Insight Prompt** 📝
**Purpose**: Extracts key themes from journal entries and provides cognitive reframing for negative thoughts

**Input Data**:
- Journal entry text and date
- User goals and current challenges
- Previous entries for pattern analysis

**Output Structure**:
```json
{
  "themes": [
    {
      "theme": "Self-criticism and perfectionism",
      "relevance": 0.9,
      "frequency": 3,
      "category": "personal",
      "keyPhrases": ["should have done better", "not good enough"]
    }
  ],
  "sentiment": {
    "overall": "negative",
    "confidence": 0.8,
    "emotions": [
      {
        "emotion": "self-doubt",
        "intensity": 0.7,
        "description": "Questioning personal capabilities"
      }
    ]
  },
  "insights": [
    {
      "insight": "Strong perfectionist tendencies creating unrealistic standards",
      "category": "pattern",
      "confidence": 0.9,
      "supportingEvidence": ["should have prepared more", "always mess up"]
    }
  ],
  "reframes": [
    {
      "originalThought": "I always mess things up when it matters most",
      "cognitiveDistortion": "All-or-nothing thinking",
      "reframedThought": "I had some challenges, but I've also had successes",
      "technique": "Balanced thinking",
      "explanation": "Counters absolute language with realistic perspective"
    }
  ],
  "patterns": [
    {
      "pattern": "Catastrophizing minor mistakes",
      "description": "Viewing small errors as major failures",
      "frequency": "weekly",
      "impact": "negative",
      "suggestions": ["Practice self-compassion", "Keep success journal"]
    }
  ],
  "actionItems": [
    {
      "action": "Write down three things that went well today",
      "priority": "high",
      "timeframe": "Tonight",
      "category": "immediate",
      "relatedThemes": ["Self-criticism and perfectionism"]
    }
  ],
  "reflection": [
    {
      "prompt": "What would you tell a friend in this situation?",
      "purpose": "Develop self-compassion",
      "category": "growth"
    }
  ]
}
```

### 4. **Biohack Suggester Prompt** 🧬
**Purpose**: Suggests new wellness routines based on user goals, preferences, and past performance ratings

**Input Data**:
- User goals with categories and priorities
- Current routines and past effectiveness ratings
- User profile (fitness level, time availability, preferences)
- Target improvement areas

**Output Structure**:
```json
{
  "recommendations": [
    {
      "id": "morning_light_therapy",
      "name": "Morning Light Exposure",
      "description": "15-30 minutes of bright light within 1 hour of waking",
      "category": "circadian",
      "difficulty": "beginner",
      "timeRequired": "15-30 minutes",
      "frequency": "daily",
      "expectedBenefits": ["Enhanced alertness", "Better sleep quality"],
      "targetGoals": ["Increase energy", "Improve sleep"],
      "instructions": ["Go outside within 30 minutes of waking", "Face east"],
      "equipment": ["Light therapy box (optional)"],
      "scientificBasis": "Light exposure advances circadian phase...",
      "compatibleWith": ["Morning coffee", "Exercise"],
      "incompatibleWith": [],
      "priority": 9
    }
  ],
  "optimizations": [
    {
      "routineId": "morning_coffee",
      "currentRoutine": "Morning Coffee",
      "optimization": "Delay first cup until 90-120 minutes after waking",
      "reasoning": "Natural cortisol peaks 30-45 minutes after waking",
      "expectedImprovement": "More sustained energy, better sleep",
      "implementation": ["Set delayed alarm", "Start with light exposure"]
    }
  ],
  "sequences": [
    {
      "name": "Optimal Morning Energy Sequence",
      "description": "Synergistic morning routine for maximum energy",
      "routines": ["Light Exposure", "Delayed Coffee", "Brief Movement"],
      "timing": "Within 2 hours of waking",
      "totalDuration": "45-60 minutes",
      "synergies": ["Light primes system for caffeine effectiveness"]
    }
  ],
  "warnings": [
    {
      "type": "contraindication",
      "message": "Consult healthcare provider if you have bipolar disorder",
      "severity": "high",
      "affectedRoutines": ["Morning Light Exposure"]
    }
  ],
  "progressTracking": [
    {
      "metric": "Morning Energy Level",
      "description": "Subjective energy 2 hours after waking",
      "frequency": "daily",
      "targetValue": "7-8/10",
      "trackingMethod": "Rate in morning journal"
    }
  ]
}
```

## 🛠 Technical Implementation

### GPT Service Architecture
```typescript
export class GPTService {
  // Type-safe methods for each prompt template
  async analyzeHabits(input: HabitReviewInput): Promise<GPTResponse<HabitReviewResponse>>
  async analyzeCheckInSentiment(input: CheckInSentimentInput): Promise<GPTResponse<CheckInSentimentResponse>>
  async analyzeJournalEntry(input: JournalInsightInput): Promise<GPTResponse<JournalInsightResponse>>
  async suggestBiohacks(input: BiohackSuggesterInput): Promise<GPTResponse<BiohackSuggesterResponse>>
  
  // Generic execution method
  async executePrompt<T>(request: GPTRequest): Promise<GPTResponse<T>>
}
```

### Template Compilation System
- **Handlebars-style templating** for dynamic prompt generation
- **Variable substitution** with nested object support
- **Conditional rendering** with `{{#if}}` and `{{#unless}}`
- **Loop handling** with `{{#each}}` for arrays

### Response Validation
- **Schema-based validation** against defined JSON schemas
- **Type checking** for all response properties
- **Error reporting** with detailed validation messages
- **Warning system** for optional improvements

### Error Handling & Fallbacks
- **Mock responses** for development and testing
- **Graceful degradation** when API is unavailable
- **Retry mechanisms** for transient failures
- **Detailed error logging** for debugging

## 🧪 Testing Framework

### Automated Testing
- **Individual template testing** with sample data
- **Batch testing** for all templates simultaneously
- **Response validation** against schemas
- **Performance monitoring** (tokens used, processing time)

### Development Tools
- **Interactive test interface** in Dashboard (development mode)
- **Custom input testing** with JSON editor
- **Result export** for analysis and debugging
- **Validation summaries** with detailed feedback

### Test Coverage
```typescript
// Example test execution
const result = await gptService.testPrompt('habit_review', {
  date: '2024-01-15',
  userGoals: ['Improve energy'],
  habits: [/* habit data */]
});

// Validation results
const validation = ResponseParser.parseAndValidate(
  result.rawResponse,
  HABIT_REVIEW_PROMPT.responseSchema
);
```

## ⚙️ Configuration & Setup

### API Key Configuration
```typescript
// Set OpenAI API key
gptService.setApiKey('your-openai-api-key');

// Configure model preferences
const response = await gptService.executePrompt({
  templateId: 'habit_review',
  variables: inputData,
  model: GPTModel.GPT4_TURBO,
  temperature: 0.3,
  maxTokens: 2000
});
```

### Development Mode
```typescript
// Mock responses for development (no API key required)
const mockResponse = await gptService.testPrompt('habit_review');

// Enable development tools in Dashboard
process.env.NODE_ENV === 'development' // Shows testing interface
```

## 📊 Performance Monitoring

### Metrics Tracked
- **Token Usage**: Input and output token consumption
- **Processing Time**: End-to-end response time
- **Success Rate**: Percentage of successful API calls
- **Validation Rate**: Percentage of responses passing schema validation

### Optimization Features
- **Temperature Control**: Adjustable creativity vs consistency
- **Token Limits**: Configurable maximum response length
- **Caching**: Response caching for repeated queries (future enhancement)
- **Rate Limiting**: Built-in rate limiting for API calls

## 🔒 Security & Privacy

### Data Protection
- **No Data Persistence**: Responses not stored unless explicitly saved
- **API Key Security**: Secure API key management
- **Input Sanitization**: Clean and validate all user inputs
- **Error Masking**: Don't expose sensitive information in errors

### Best Practices
- **Minimal Data**: Only send necessary data to API
- **Anonymization**: Remove personally identifiable information where possible
- **Audit Logging**: Track API usage and responses for debugging
- **Fallback Responses**: Provide helpful responses when API is unavailable

## 🚀 Usage Examples

### Habit Analysis
```typescript
const habitAnalysis = await gptService.analyzeHabits({
  date: '2024-01-15',
  userGoals: ['Improve energy', 'Better sleep'],
  habits: userHabits,
  previousWeekData: previousWeekHabits
});

if (habitAnalysis.success) {
  const insights = habitAnalysis.data.insights;
  const tips = habitAnalysis.data.tips.specific;
  // Use insights to update UI
}
```

### Sentiment Analysis
```typescript
const sentimentResult = await gptService.analyzeCheckInSentiment({
  text: userCheckInText,
  moodRating: 6,
  energyLevel: 4,
  context: {
    timeOfDay: 'evening',
    dayOfWeek: 'Friday'
  }
});

if (sentimentResult.success) {
  const copingStrategies = sentimentResult.data.copingStrategies;
  const recommendations = sentimentResult.data.recommendations;
  // Provide personalized support
}
```

### Journal Insights
```typescript
const journalInsights = await gptService.analyzeJournalEntry({
  entry: journalText,
  date: '2024-01-15',
  userGoals: ['Build confidence'],
  currentChallenges: ['Perfectionism']
});

if (journalInsights.success) {
  const themes = journalInsights.data.themes;
  const reframes = journalInsights.data.reframes;
  // Show insights and reframing suggestions
}
```

### Biohack Recommendations
```typescript
const biohackSuggestions = await gptService.suggestBiohacks({
  userGoals: userGoals,
  currentRoutines: currentBiohacks,
  pastRatings: userRatings,
  userProfile: {
    fitnessLevel: 'intermediate',
    timeAvailable: 'moderate',
    preferences: ['Natural methods']
  },
  targetAreas: ['Energy', 'Sleep']
});

if (biohackSuggestions.success) {
  const recommendations = biohackSuggestions.data.recommendations;
  const optimizations = biohackSuggestions.data.optimizations;
  // Present personalized biohack suggestions
}
```

## 🎯 Success Metrics

### AI Engine Reliability
- **Response Success Rate**: >95% successful API calls
- **Schema Validation Rate**: >90% responses passing validation
- **Processing Time**: <3 seconds average response time
- **Token Efficiency**: Optimized prompts for minimal token usage

### User Experience Impact
- **Personalization Quality**: Relevant, actionable insights
- **Engagement**: Increased user interaction with AI features
- **Satisfaction**: Positive feedback on AI recommendations
- **Retention**: Improved user retention through personalized guidance

## 🔄 Future Enhancements

### Advanced Features
- **Context Memory**: Remember previous conversations
- **Multi-turn Conversations**: Support for follow-up questions
- **Personalization Learning**: Adapt prompts based on user preferences
- **A/B Testing**: Test different prompt variations

### Integration Improvements
- **Real-time Streaming**: Stream responses as they're generated
- **Offline Fallbacks**: Cached responses for offline use
- **Voice Integration**: Support for voice input/output
- **Multi-language**: Support for multiple languages

### Performance Optimizations
- **Response Caching**: Cache common responses
- **Batch Processing**: Process multiple requests efficiently
- **Edge Computing**: Deploy closer to users for faster responses
- **Cost Optimization**: Optimize token usage and model selection

## 🎉 Implementation Complete!

The ThriveGPT GPT Prompt Template system is now fully implemented with:

- ✅ **4 Specialized Prompt Templates** - Habit Review, Sentiment Analysis, Journal Insights, Biohack Suggestions
- ✅ **Type-Safe Implementation** - Full TypeScript support with comprehensive interfaces
- ✅ **Structured JSON Output** - Reliable, parseable responses with schema validation
- ✅ **Testing Framework** - Interactive testing tools and automated validation
- ✅ **Error Handling** - Robust error handling with fallback mechanisms
- ✅ **Performance Monitoring** - Token usage and processing time tracking
- ✅ **Development Tools** - Integrated testing interface for development
- ✅ **Documentation** - Comprehensive documentation and examples

**Ready to power reliable, scalable AI interactions across all ThriveGPT modules! 🚀**