import React, { useState } from 'react';
import { X, Mic, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DailyCheckInProps {
  isOpen: boolean;
  onClose: () => void;
}

const moodEmojis = [
  { emoji: '😊', label: 'Great', value: 5 },
  { emoji: '🙂', label: 'Good', value: 4 },
  { emoji: '😐', label: 'Okay', value: 3 },
  { emoji: '🙁', label: 'Not great', value: 2 },
  { emoji: '😢', label: 'Tough', value: 1 },
];

export function DailyCheckIn({ isOpen, onClose }: DailyCheckInProps) {
  const [feeling, setFeeling] = useState('');
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = async () => {
    if (!feeling.trim() && selectedMood === null) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsSubmitted(true);
    }, 2000);
  };

  const handleClose = () => {
    setFeeling('');
    setSelectedMood(null);
    setIsSubmitted(false);
    setIsAnalyzing(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-card shadow-float">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl font-semibold">Daily Check-In</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          {!isSubmitted ? (
            <>
              <div className="space-y-6">
                <div>
                  <p className="text-lg font-medium mb-4">How are you feeling today?</p>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <Button variant="outline" size="sm" className="flex-shrink-0">
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Textarea
                      placeholder="Write or speak freely…"
                      value={feeling}
                      onChange={(e) => setFeeling(e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-3">Quick mood selector:</p>
                  <div className="flex justify-between gap-2">
                    {moodEmojis.map(({ emoji, label, value }) => (
                      <button
                        key={value}
                        onClick={() => setSelectedMood(value)}
                        className={cn(
                          "flex flex-col items-center p-2 rounded-lg border transition-all duration-200",
                          selectedMood === value
                            ? "border-primary bg-primary/10 scale-105 shadow-wellness"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        )}
                      >
                        <span className="text-2xl mb-1">{emoji}</span>
                        <span className="text-xs text-muted-foreground">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={handleSubmit}
                  disabled={!feeling.trim() && selectedMood === null}
                  className="w-full bg-gradient-primary hover:shadow-wellness transition-all duration-300"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Analyzing…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Log Feeling
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <Card className="bg-gradient-subtle border-0 shadow-card">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">AI Summary</h3>
                  <p className="text-sm text-muted-foreground">
                    You sound thoughtful today. Taking time to reflect shows great self-awareness.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-wellness border-0 shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">💡</span>
                    <div>
                      <h4 className="font-medium text-sm mb-1">Suggestion</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Try a 3-minute breathing exercise to center yourself.
                      </p>
                      <Button size="sm" variant="outline">
                        Start Exercise
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button onClick={handleClose} className="w-full" variant="secondary">
                Continue to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}