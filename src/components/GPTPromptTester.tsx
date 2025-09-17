import React, { useState } from 'react';
import { Play, CheckCircle, AlertCircle, Clock, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { gptService } from '@/services/gptService';
import { ResponseParser } from '@/utils/responseParser';
import { PromptTemplateId, GPTResponse } from '@/types/gpt-prompts';

interface TestResult {
  templateId: string;
  success: boolean;
  response?: GPTResponse;
  validationSummary?: string;
  timestamp: Date;
  processingTime?: number;
}

export const GPTPromptTester: React.FC = () => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customInput, setCustomInput] = useState<string>('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);

  const templates = gptService.getAllTemplates();

  const sampleInputs = {
    [PromptTemplateId.HABIT_REVIEW]: JSON.stringify({
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
    }, null, 2),

    [PromptTemplateId.CHECKIN_SENTIMENT]: JSON.stringify({
      text: 'Feeling overwhelmed today. Work deadlines are piling up and I barely slept last night. Keep thinking I should be doing more but I just feel stuck.',
      moodRating: 4,
      energyLevel: 3,
      stressLevel: 8,
      context: {
        timeOfDay: 'afternoon',
        dayOfWeek: 'Wednesday',
        recentEvents: ['Big project deadline approaching', 'Poor sleep last night']
      }
    }, null, 2),

    [PromptTemplateId.JOURNAL_INSIGHT]: JSON.stringify({
      entry: 'Had a presentation at work today and I think it went terribly. I stumbled over a few words and forgot one of my key points. Everyone probably thinks I\'m incompetent now. I should have prepared more, practiced more. I always mess things up when it matters most.',
      date: '2024-01-16',
      userGoals: ['Build confidence at work', 'Improve public speaking'],
      currentChallenges: ['Imposter syndrome', 'Perfectionism']
    }, null, 2),

    [PromptTemplateId.BIOHACK_SUGGESTER]: JSON.stringify({
      userGoals: [
        {
          goal: 'Increase daily energy levels',
          category: 'energy',
          priority: 'high',
          timeline: '4 weeks'
        }
      ],
      targetAreas: ['Energy', 'Sleep', 'Morning alertness'],
      userProfile: {
        age: 32,
        fitnessLevel: 'intermediate',
        timeAvailable: 'moderate',
        preferences: ['Natural methods', 'Morning routines'],
        restrictions: ['No stimulants after 2 PM']
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
      pastRatings: []
    }, null, 2)
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    setCustomInput(sampleInputs[templateId as keyof typeof sampleInputs] || '');
  };

  const runTest = async (templateId: string, useCustomInput: boolean = false) => {
    setIsLoading(true);
    setCurrentTest(templateId);

    try {
      let input: any;
      
      if (useCustomInput && customInput.trim()) {
        try {
          input = JSON.parse(customInput);
        } catch (error) {
          toast({
            title: 'Invalid JSON',
            description: 'Please provide valid JSON input',
            variant: 'destructive',
          });
          setIsLoading(false);
          setCurrentTest(null);
          return;
        }
      } else {
        const template = templates.find(t => t.id === templateId);
        input = template?.examples?.[0]?.input || {};
      }

      const response = await gptService.executePrompt({
        templateId,
        variables: input,
        temperature: 0.3
      });

      // Validate response if successful
      let validationSummary = '';
      if (response.success && response.data) {
        const template = gptService.getTemplate(templateId);
        if (template) {
          const parseResult = ResponseParser.parseAndValidate(
            JSON.stringify(response.data),
            template.responseSchema,
            'json'
          );
          validationSummary = ResponseParser.generateValidationSummary({
            valid: parseResult.success,
            errors: parseResult.errors,
            warnings: parseResult.warnings
          });
        }
      }

      const testResult: TestResult = {
        templateId,
        success: response.success,
        response,
        validationSummary,
        timestamp: new Date(),
        processingTime: response.processingTime
      };

      setTestResults(prev => [testResult, ...prev.slice(0, 9)]); // Keep last 10 results

      toast({
        title: response.success ? 'Test successful' : 'Test failed',
        description: response.success 
          ? `Template ${templateId} executed successfully` 
          : response.error,
        variant: response.success ? 'default' : 'destructive',
      });

    } catch (error) {
      const testResult: TestResult = {
        templateId,
        success: false,
        response: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        timestamp: new Date()
      };

      setTestResults(prev => [testResult, ...prev.slice(0, 9)]);

      toast({
        title: 'Test failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setCurrentTest(null);
    }
  };

  const runAllTests = async () => {
    for (const template of templates) {
      await runTest(template.id);
      // Add small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: 'Content has been copied to clipboard',
    });
  };

  const exportResults = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      results: testResults,
      summary: {
        totalTests: testResults.length,
        successful: testResults.filter(r => r.success).length,
        failed: testResults.filter(r => !r.success).length
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gpt-prompt-test-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Results exported',
      description: 'Test results have been downloaded',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">GPT Prompt Template Tester</h3>
          <p className="text-sm text-muted-foreground">
            Test and validate GPT prompt templates with sample or custom data
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={runAllTests} disabled={isLoading} variant="outline">
            <Play className="h-4 w-4 mr-2" />
            Test All Templates
          </Button>
          {testResults.length > 0 && (
            <Button onClick={exportResults} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </Button>
          )}
        </div>
      </div>

      {/* Template Selection and Testing */}
      <Card>
        <CardHeader>
          <CardTitle>Single Template Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Select Template</label>
              <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template to test" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => runTest(selectedTemplate, true)} 
                disabled={!selectedTemplate || isLoading}
                className="w-full"
              >
                {isLoading && currentTest === selectedTemplate ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Test
                  </>
                )}
              </Button>
            </div>
          </div>

          {selectedTemplate && (
            <div>
              <label className="text-sm font-medium">Test Input (JSON)</label>
              <Textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter custom JSON input or use the sample data"
                rows={8}
                className="font-mono text-sm"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Template Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Available Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map(template => (
              <div key={template.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{template.name}</h4>
                  <Badge variant="outline">{template.outputFormat.toUpperCase()}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {template.description}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => runTest(template.id)}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading && currentTest === template.id ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Quick Test
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Test Results
              <Badge variant="outline">
                {testResults.filter(r => r.success).length}/{testResults.length} Passed
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {result.success ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className="font-semibold">{result.templateId}</span>
                      <Badge variant={result.success ? 'default' : 'destructive'}>
                        {result.success ? 'Success' : 'Failed'}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {result.timestamp.toLocaleTimeString()}
                      {result.processingTime && (
                        <span className="ml-2">({result.processingTime}ms)</span>
                      )}
                    </div>
                  </div>

                  {result.response && (
                    <Tabs defaultValue="summary" className="mt-4">
                      <TabsList>
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                        <TabsTrigger value="response">Response</TabsTrigger>
                        <TabsTrigger value="raw">Raw Output</TabsTrigger>
                      </TabsList>

                      <TabsContent value="summary" className="space-y-2">
                        {result.success ? (
                          <div className="text-sm">
                            <p className="text-green-600">✅ Test passed successfully</p>
                            {result.validationSummary && (
                              <pre className="bg-muted p-2 rounded text-xs mt-2 whitespace-pre-wrap">
                                {result.validationSummary}
                              </pre>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm">
                            <p className="text-red-600">❌ Test failed</p>
                            {result.response.error && (
                              <p className="text-red-600 mt-1">Error: {result.response.error}</p>
                            )}
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="response">
                        {result.response.data ? (
                          <div className="space-y-2">
                            <div className="flex justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(JSON.stringify(result.response.data, null, 2))}
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                              </Button>
                            </div>
                            <pre className="bg-muted p-4 rounded text-xs overflow-auto max-h-64">
                              {JSON.stringify(result.response.data, null, 2)}
                            </pre>
                          </div>
                        ) : (
                          <p className="text-muted-foreground">No response data</p>
                        )}
                      </TabsContent>

                      <TabsContent value="raw">
                        {result.response.rawResponse ? (
                          <div className="space-y-2">
                            <div className="flex justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(result.response.rawResponse!)}
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                              </Button>
                            </div>
                            <pre className="bg-muted p-4 rounded text-xs overflow-auto max-h-64">
                              {result.response.rawResponse}
                            </pre>
                          </div>
                        ) : (
                          <p className="text-muted-foreground">No raw response</p>
                        )}
                      </TabsContent>
                    </Tabs>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};