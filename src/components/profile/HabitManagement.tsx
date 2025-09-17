import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, Circle, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  TrackedHabit, 
  HabitCategory, 
  Difficulty, 
  HabitFrequency, 
  HABIT_LIBRARY,
  calculateHabitCompletionRate 
} from '@/types/profile';
import { ProfileStorage } from '@/utils/profileStorage';

interface HabitManagementProps {
  onHabitsChange?: () => void;
}

export const HabitManagement: React.FC<HabitManagementProps> = ({ onHabitsChange }) => {
  const { toast } = useToast();
  const [habits, setHabits] = useState<TrackedHabit[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<TrackedHabit | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'health' as HabitCategory,
    difficulty: 'easy' as Difficulty,
    frequency: 'daily' as HabitFrequency,
    targetValue: '',
    unit: ''
  });

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = () => {
    const userHabits = ProfileStorage.getTrackedHabits();
    setHabits(userHabits);
  };

  const handleAddHabit = () => {
    if (!formData.title.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a habit title.',
        variant: 'destructive',
      });
      return;
    }

    const habitTemplate = HABIT_LIBRARY.find(h => h.category === formData.category);
    const newHabit = ProfileStorage.addTrackedHabit({
      title: formData.title,
      description: formData.description || habitTemplate?.description || '',
      icon: habitTemplate?.icon || '✅',
      category: formData.category,
      difficulty: formData.difficulty,
      frequency: formData.frequency,
      targetValue: formData.targetValue ? parseFloat(formData.targetValue) : undefined,
      unit: formData.unit || undefined
    });

    setHabits(prev => [...prev, newHabit]);
    setIsAddDialogOpen(false);
    resetForm();
    onHabitsChange?.();
    
    toast({
      title: 'Habit added',
      description: `"${newHabit.title}" has been added to your tracked habits.`,
    });
  };

  const handleEditHabit = () => {
    if (!editingHabit || !formData.title.trim()) return;

    const updatedHabit = ProfileStorage.updateTrackedHabit(editingHabit.id, {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      difficulty: formData.difficulty,
      frequency: formData.frequency,
      targetValue: formData.targetValue ? parseFloat(formData.targetValue) : undefined,
      unit: formData.unit || undefined
    });

    if (updatedHabit) {
      setHabits(prev => prev.map(h => h.id === updatedHabit.id ? updatedHabit : h));
      setIsEditDialogOpen(false);
      setEditingHabit(null);
      resetForm();
      onHabitsChange?.();
      
      toast({
        title: 'Habit updated',
        description: `"${updatedHabit.title}" has been updated.`,
      });
    }
  };

  const handleDeleteHabit = (habit: TrackedHabit) => {
    if (window.confirm(`Are you sure you want to delete "${habit.title}"? This will remove all tracking history.`)) {
      ProfileStorage.removeTrackedHabit(habit.id);
      setHabits(prev => prev.filter(h => h.id !== habit.id));
      onHabitsChange?.();
      
      toast({
        title: 'Habit deleted',
        description: `"${habit.title}" has been removed.`,
      });
    }
  };

  const handleCompleteHabit = (habit: TrackedHabit) => {
    if (habit.completedToday) {
      toast({
        title: 'Already completed',
        description: `You've already completed "${habit.title}" today!`,
      });
      return;
    }

    const updatedHabit = ProfileStorage.completeHabitToday(habit.id);
    if (updatedHabit) {
      setHabits(prev => prev.map(h => h.id === updatedHabit.id ? updatedHabit : h));
      onHabitsChange?.();
      
      toast({
        title: 'Habit completed! 🎉',
        description: `Great job completing "${habit.title}"!`,
      });
    }
  };

  const openEditDialog = (habit: TrackedHabit) => {
    setEditingHabit(habit);
    setFormData({
      title: habit.title,
      description: habit.description,
      category: habit.category,
      difficulty: habit.difficulty,
      frequency: habit.frequency,
      targetValue: habit.targetValue?.toString() || '',
      unit: habit.unit || ''
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'health',
      difficulty: 'easy',
      frequency: 'daily',
      targetValue: '',
      unit: ''
    });
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getCategoryColor = (category: HabitCategory) => {
    const colors = {
      health: 'bg-blue-100 text-blue-800',
      movement: 'bg-orange-100 text-orange-800',
      mindfulness: 'bg-purple-100 text-purple-800',
      growth: 'bg-indigo-100 text-indigo-800',
      nutrition: 'bg-green-100 text-green-800',
      productivity: 'bg-cyan-100 text-cyan-800',
      social: 'bg-pink-100 text-pink-800',
      environment: 'bg-teal-100 text-teal-800'
    };
    return colors[category] || 'bg-secondary text-secondary-foreground';
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '🏆';
    if (streak >= 14) return '🔥';
    if (streak >= 7) return '⭐';
    if (streak >= 3) return '🎯';
    return '🌱';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Tracked Habits</h3>
          <p className="text-sm text-muted-foreground">
            {habits.length} habits • {habits.filter(h => h.completedToday).length} completed today
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Habit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Habit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Habit Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Morning meditation"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as HabitCategory }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="movement">Movement</SelectItem>
                      <SelectItem value="mindfulness">Mindfulness</SelectItem>
                      <SelectItem value="growth">Growth</SelectItem>
                      <SelectItem value="nutrition">Nutrition</SelectItem>
                      <SelectItem value="productivity">Productivity</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="environment">Environment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value as Difficulty }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value as HabitFrequency }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="targetValue">Target Value (optional)</Label>
                  <Input
                    id="targetValue"
                    type="number"
                    value={formData.targetValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetValue: e.target.value }))}
                    placeholder="e.g., 10"
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit (optional)</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                    placeholder="e.g., minutes"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your habit..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddHabit}>
                  Add Habit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Habits List */}
      <div className="space-y-4">
        {habits.map((habit) => {
          const completionRate = calculateHabitCompletionRate(habit, 7);
          
          return (
            <Card key={habit.id} className="shadow-wellness">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant={habit.completedToday ? "default" : "outline"}
                      onClick={() => handleCompleteHabit(habit)}
                      className={habit.completedToday ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      {habit.completedToday ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                    </Button>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{habit.icon}</span>
                        <h5 className="font-semibold">{habit.title}</h5>
                        {habit.streak > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-lg">{getStreakEmoji(habit.streak)}</span>
                            <span className="text-sm font-medium text-orange-600">
                              {habit.streak}
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{habit.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(habit.category)}>
                      {habit.category}
                    </Badge>
                    <Badge className={getDifficultyColor(habit.difficulty)}>
                      {habit.difficulty}
                    </Badge>
                  </div>
                </div>

                {/* Progress and Stats */}
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>7-day completion</span>
                      <span>{Math.round(completionRate)}%</span>
                    </div>
                    <Progress value={completionRate} className="h-2" />
                  </div>
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span>Current streak:</span>
                      <span className="font-medium">{habit.streak} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frequency:</span>
                      <span className="font-medium capitalize">{habit.frequency}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {habit.targetValue && (
                      <span className="text-sm text-muted-foreground">
                        Target: {habit.targetValue} {habit.unit}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditDialog(habit)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteHabit(habit)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {habits.length === 0 && (
        <Card className="shadow-wellness">
          <CardContent className="p-8 text-center">
            <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h4 className="font-semibold mb-2">No habits tracked yet</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Start tracking your first habit to build consistency!
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Habit
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Habit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Habit Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as HabitCategory }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="movement">Movement</SelectItem>
                    <SelectItem value="mindfulness">Mindfulness</SelectItem>
                    <SelectItem value="growth">Growth</SelectItem>
                    <SelectItem value="nutrition">Nutrition</SelectItem>
                    <SelectItem value="productivity">Productivity</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="environment">Environment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-difficulty">Difficulty</Label>
                <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value as Difficulty }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-frequency">Frequency</Label>
              <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value as HabitFrequency }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-targetValue">Target Value</Label>
                <Input
                  id="edit-targetValue"
                  type="number"
                  value={formData.targetValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetValue: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit-unit">Unit</Label>
                <Input
                  id="edit-unit"
                  value={formData.unit}
                  onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditHabit}>
                Update Habit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};