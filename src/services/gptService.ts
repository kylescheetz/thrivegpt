import { 
  GPTRequest, 
  GPTResponse, 
  PromptTemplate, 
  PromptTemplateId, 
  GPTModel,
  HabitReviewInput,
  HabitReviewResponse,
  CheckInSentimentInput,
  CheckInSentimentResponse,
  JournalInsightInput,
  JournalInsightResponse,
  BiohackSuggesterInput,
  BiohackSuggesterResponse
} from '@/types/gpt-prompts';

// Import prompt templates
import { HABIT_REVIEW_PROMPT } from './gpt-prompts/habit-review-prompt';
import { CHECKIN_SENTIMENT_PROMPT } from './gpt-prompts/checkin-sentiment-prompt';
import { JOURNAL_INSIGHT_PROMPT } from './gpt-prompts/journal-insight-prompt';
import { BIOHACK_SUGGESTER_PROMPT } from './gpt-prompts/biohack-suggester-prompt';

// Handlebars-style template compilation
class TemplateCompiler {
  static compile(template: string, variables: Record<string, any>): string {
    let compiled = template;
    
    // Handle each loops: {{#each items}}...{{/each}}
    compiled = compiled.replace(/\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, arrayName, content) => {
      const array = this.getNestedValue(variables, arrayName);
      if (!Array.isArray(array)) return '';
      
      return array.map((item, index) => {
        let itemContent = content;
        // Replace {{this}} with current item
        itemContent = itemContent.replace(/\{\{this\}\}/g, String(item));
        // Replace {{@index}} with current index
        itemContent = itemContent.replace(/\{\{@index\}\}/g, String(index));
        // Replace {{@last}} with boolean for last item
        itemContent = itemContent.replace(/\{\{@last\}\}/g, String(index === array.length - 1));
        
        // Handle nested properties like {{item.property}}
        if (typeof item === 'object' && item !== null) {
          Object.keys(item).forEach(key => {
            const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
            itemContent = itemContent.replace(regex, String(item[key] || ''));
          });
        }
        
        return itemContent;
      }).join('');
    });
    
    // Handle if conditions: {{#if condition}}...{{/if}}
    compiled = compiled.replace(/\{\{#if\s+(\w+(?:\.\w+)*)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, condition, content) => {
      const value = this.getNestedValue(variables, condition);
      return value ? content : '';
    });
    
    // Handle unless conditions: {{#unless condition}}...{{/unless}}
    compiled = compiled.replace(/\{\{#unless\s+(\w+(?:\.\w+)*)\}\}([\s\S]*?)\{\{\/unless\}\}/g, (match, condition, content) => {
      const value = this.getNestedValue(variables, condition);
      return !value ? content : '';
    });
    
    // Handle simple variables: {{variable}} or {{object.property}}
    compiled = compiled.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (match, path) => {
      const value = this.getNestedValue(variables, path);
      return value !== undefined ? String(value) : '';
    });
    
    return compiled;
  }
  
  private static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && typeof current === 'object' ? current[key] : undefined;
    }, obj);
  }
}

export class GPTService {
  private static instance: GPTService;
  private templates: Map<string, PromptTemplate> = new Map();
  private apiKey: string | null = null;
  
  private constructor() {
    this.initializeTemplates();
  }
  
  static getInstance(): GPTService {
    if (!GPTService.instance) {
      GPTService.instance = new GPTService();
    }
    return GPTService.instance;
  }
  
  private initializeTemplates(): void {
    const templates = [
      HABIT_REVIEW_PROMPT,
      CHECKIN_SENTIMENT_PROMPT,
      JOURNAL_INSIGHT_PROMPT,
      BIOHACK_SUGGESTER_PROMPT
    ];
    
    templates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }
  
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }
  
  getTemplate(templateId: string): PromptTemplate | undefined {
    return this.templates.get(templateId);
  }
  
  getAllTemplates(): PromptTemplate[] {
    return Array.from(this.templates.values());
  }
  
  // Type-safe method for habit review
  async analyzeHabits(input: HabitReviewInput): Promise<GPTResponse<HabitReviewResponse>> {
    return this.executePrompt<HabitReviewResponse>({
      templateId: PromptTemplateId.HABIT_REVIEW,
      variables: input,
      model: GPTModel.GPT4_TURBO,
      temperature: 0.3
    });
  }
  
  // Type-safe method for check-in sentiment analysis
  async analyzeCheckInSentiment(input: CheckInSentimentInput): Promise<GPTResponse<CheckInSentimentResponse>> {
    return this.executePrompt<CheckInSentimentResponse>({
      templateId: PromptTemplateId.CHECKIN_SENTIMENT,
      variables: input,
      model: GPTModel.GPT4_TURBO,
      temperature: 0.2
    });
  }
  
  // Type-safe method for journal insights
  async analyzeJournalEntry(input: JournalInsightInput): Promise<GPTResponse<JournalInsightResponse>> {
    return this.executePrompt<JournalInsightResponse>({
      templateId: PromptTemplateId.JOURNAL_INSIGHT,
      variables: input,
      model: GPTModel.GPT4_TURBO,
      temperature: 0.3
    });
  }
  
  // Type-safe method for biohack suggestions
  async suggestBiohacks(input: BiohackSuggesterInput): Promise<GPTResponse<BiohackSuggesterResponse>> {
    return this.executePrompt<BiohackSuggesterResponse>({
      templateId: PromptTemplateId.BIOHACK_SUGGESTER,
      variables: input,
      model: GPTModel.GPT4_TURBO,
      temperature: 0.4
    });
  }
  
  // Generic method for executing any prompt
  async executePrompt<T = any>(request: GPTRequest): Promise<GPTResponse<T>> {
    const startTime = Date.now();
    
    try {
      const template = this.templates.get(request.templateId);
      if (!template) {
        return {
          success: false,
          error: `Template not found: ${request.templateId}`
        };
      }
      
      // Compile the user prompt with variables
      const compiledPrompt = TemplateCompiler.compile(template.userPromptTemplate, request.variables);
      
      // For development/testing, return mock response if no API key
      if (!this.apiKey) {
        return this.getMockResponse<T>(template, request.variables);
      }
      
      // Make API call to OpenAI
      const response = await this.callOpenAI(
        template.systemPrompt,
        compiledPrompt,
        request.model || GPTModel.GPT4_TURBO,
        request.temperature || 0.3,
        request.maxTokens || 2000
      );
      
      const processingTime = Date.now() - startTime;
      
      // Parse response based on output format
      const parsedData = this.parseResponse<T>(response.content, template.outputFormat);
      
      return {
        success: true,
        data: parsedData,
        rawResponse: response.content,
        tokensUsed: response.tokensUsed,
        processingTime
      };
      
    } catch (error) {
      const processingTime = Date.now() - startTime;
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        processingTime
      };
    }
  }
  
  private async callOpenAI(
    systemPrompt: string,
    userPrompt: string,
    model: string,
    temperature: number,
    maxTokens: number
  ): Promise<{ content: string; tokensUsed: number }> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature,
        max_tokens: maxTokens,
        response_format: { type: 'json_object' }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    
    return {
      content: data.choices[0]?.message?.content || '',
      tokensUsed: data.usage?.total_tokens || 0
    };
  }
  
  private parseResponse<T>(content: string, format: 'json' | 'yaml' | 'text'): T {
    if (format === 'json') {
      try {
        return JSON.parse(content);
      } catch (error) {
        throw new Error(`Failed to parse JSON response: ${error}`);
      }
    } else if (format === 'yaml') {
      // For now, we'll treat YAML as JSON since we're requesting JSON format
      try {
        return JSON.parse(content);
      } catch (error) {
        throw new Error(`Failed to parse YAML response: ${error}`);
      }
    } else {
      return content as unknown as T;
    }
  }
  
  private getMockResponse<T>(template: PromptTemplate, variables: Record<string, any>): GPTResponse<T> {
    // Return example response if available for testing
    if (template.examples && template.examples.length > 0) {
      const example = template.examples[0];
      return {
        success: true,
        data: example.expectedOutput as T,
        rawResponse: JSON.stringify(example.expectedOutput, null, 2),
        tokensUsed: 0,
        processingTime: 100
      };
    }
    
    // Return a basic mock structure
    const mockData = this.generateMockFromSchema(template.responseSchema) as T;
    return {
      success: true,
      data: mockData,
      rawResponse: JSON.stringify(mockData, null, 2),
      tokensUsed: 0,
      processingTime: 100
    };
  }
  
  private generateMockFromSchema(schema: any): any {
    if (!schema || typeof schema !== 'object') {
      return null;
    }
    
    switch (schema.type) {
      case 'object':
        const obj: any = {};
        if (schema.properties) {
          Object.keys(schema.properties).forEach(key => {
            obj[key] = this.generateMockFromSchema(schema.properties[key]);
          });
        }
        return obj;
        
      case 'array':
        if (schema.items) {
          return [this.generateMockFromSchema(schema.items)];
        }
        return [];
        
      case 'string':
        if (schema.enum) {
          return schema.enum[0];
        }
        return schema.description || 'Mock string value';
        
      case 'number':
        return 0;
        
      case 'boolean':
        return false;
        
      default:
        return null;
    }
  }
  
  // Utility method to validate response against schema
  validateResponse(data: any, schema: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    const validate = (value: any, schemaNode: any, path: string = ''): void => {
      if (!schemaNode) return;
      
      if (schemaNode.required && Array.isArray(schemaNode.required)) {
        schemaNode.required.forEach((field: string) => {
          if (value === null || value === undefined || !(field in value)) {
            errors.push(`Missing required field: ${path}.${field}`);
          }
        });
      }
      
      if (schemaNode.properties) {
        Object.keys(schemaNode.properties).forEach(key => {
          if (value && key in value) {
            validate(value[key], schemaNode.properties[key], path ? `${path}.${key}` : key);
          }
        });
      }
      
      if (schemaNode.type === 'array' && schemaNode.items && Array.isArray(value)) {
        value.forEach((item, index) => {
          validate(item, schemaNode.items, `${path}[${index}]`);
        });
      }
    };
    
    validate(data, schema);
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  // Method to test a prompt with sample data
  async testPrompt(templateId: string, sampleInput?: any): Promise<GPTResponse> {
    const template = this.getTemplate(templateId);
    if (!template) {
      return {
        success: false,
        error: `Template not found: ${templateId}`
      };
    }
    
    const testInput = sampleInput || (template.examples?.[0]?.input) || {};
    
    return this.executePrompt({
      templateId,
      variables: testInput,
      model: GPTModel.GPT4_TURBO,
      temperature: 0.3
    });
  }
}

// Export singleton instance
export const gptService = GPTService.getInstance();