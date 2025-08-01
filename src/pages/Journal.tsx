import React, { useState } from 'react';
import { ArrowLeft, Mic, Paperclip, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const journalModes = {
  'mental-unload': {
    label: 'Mental Unload',
    prompts: [
      "What's weighing on your mind today?",
      "Dump all your thoughts here - no judgment.",
      "What would you tell your best friend about today?",
      "What's taking up mental space right now?"
    ]
  },
  'goal-setting': {
    label: 'Goal Setting',
    prompts: [
      "What do you want to accomplish this week?",
      "What would make tomorrow feel successful?",
      "What's one small step toward your bigger vision?",
      "How do you want to grow this month?"
    ]
  },
  'reflection': {
    label: 'Reflection',
    prompts: [
      "What are you most grateful for today?",
      "What did you learn about yourself today?",
      "What moment made you smile today?",
      "How did you show up for yourself today?"
    ]
  }
};

export default function Journal() {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<keyof typeof journalModes>('mental-unload');
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [entry, setEntry] = useState('');
  const [showInsights, setShowInsights] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentPrompts = journalModes[activeMode].prompts;
  const currentPrompt = currentPrompts[currentPromptIndex];

  const handleModeChange = (mode: string) => {
    setActiveMode(mode as keyof typeof journalModes);
    setCurrentPromptIndex(0);
    setEntry('');
    setShowInsights(false);
  };

  const handleSaveEntry = async () => {
    if (!entry.trim()) return;

    setIsLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsLoading(false);
      setShowInsights(true);
    }, 2000);
  };

  const getInsightForMode = () => {
    switch (activeMode) {
      case 'mental-unload':
        return {
          themes: ['stress release', 'clarity'],
          insight: "You're processing a lot right now. Consider a 5-minute meditation to help settle your mind."
        };
      case 'goal-setting':
        return {
          themes: ['growth', 'focus'],
          insight: "Your goals show a strong commitment to well-being. Break them into smaller daily actions."
        };
      case 'reflection':
        return {
          themes: ['gratitude', 'mindfulness'],
          insight: "Your gratitude practice is building resilience. Notice how it shifts your perspective."
        };
      default:
        return {
          themes: ['self-awareness'],
          insight: "Great insight into your inner world."
        };
    }
  };

  if (showInsights) {
    const { themes, insight } = getInsightForMode();
    
    return (
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border">
          <div className="flex items-center justify-between p-4 max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold">Journal</h1>
            </div>
          </div>
        </div>

        <div className="p-4 max-w-md mx-auto space-y-6">
          {/* Success Message */}
          <Card className="shadow-wellness bg-gradient-wellness border-0">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="text-lg font-semibold mb-2">Entry Saved!</h3>
              <p className="text-sm text-muted-foreground">
                Your thoughts have been captured and analyzed.
              </p>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="shadow-wellness">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Themes Detected</h4>
                <div className="flex flex-wrap gap-2">
                  {themes.map((theme, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">Insight</h4>
                <p className="text-sm text-muted-foreground">{insight}</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={() => setShowInsights(false)}
              className="w-full"
              variant="outline"
            >
              Write Another Entry
            </Button>
            <Button 
              onClick={() => navigate('/')}
              className="w-full"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center justify-between p-4 max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Journal</h1>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-6">
        {/* Mode Selector Tabs */}
        <Tabs value={activeMode} onValueChange={handleModeChange}>
          <TabsList className="grid w-full grid-cols-3">
            {Object.entries(journalModes).map(([key, mode]) => (
              <TabsTrigger key={key} value={key} className="text-xs">
                {mode.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.keys(journalModes).map((mode) => (
            <TabsContent key={mode} value={mode} className="mt-6">
              <Card className="shadow-wellness">
                <CardContent className="p-6 space-y-4">
                  {/* Prompt Area */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm text-muted-foreground">Prompt:</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentPromptIndex((prev) => 
                          (prev + 1) % currentPrompts.length
                        )}
                        className="text-xs h-6 px-2"
                      >
                        Next
                      </Button>
                    </div>
                    <p className="text-lg font-medium">{currentPrompt}</p>
                  </div>

                  {/* Text Input */}
                  <Textarea
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                    placeholder="Write or speak freely..."
                    className="min-h-[200px] resize-none"
                  />

                  {/* Optional Buttons */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Mic className="h-4 w-4 mr-2" />
                      Voice Note
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Paperclip className="h-4 w-4 mr-2" />
                      Attach Photo
                    </Button>
                  </div>

                  {/* Save Button */}
                  <Button 
                    onClick={handleSaveEntry}
                    disabled={!entry.trim() || isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      'Save Entry'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}