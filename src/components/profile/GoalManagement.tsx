import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Target, CheckCircle2, Pause, Archive } from 'lucide-react';
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
import { Goal, GoalCategory, Priority, GoalStatus, WELLNESS_GOALS, calculateGoalProgress } from '@/types/profile';
import { ProfileStorage } from '@/utils/profileStorage';

interface GoalManagementProps {
  onGoalsChange?: () => void;
}

export const GoalManagement: React.FC<GoalManagementProps> = ({ onGoalsChange }) => {
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'energy' as GoalCategory,
    priority: 'medium' as Priority,
    targetValue: '',
    unit: ''
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    const userGoals = ProfileStorage.getGoals();
    setGoals(userGoals);
  };

  const handleAddGoal = () => {
    if (!formData.title.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a goal title.',
        variant: 'destructive',
      });
      return;
    }

    const goalTemplate = WELLNESS_GOALS.find(g => g.category === formData.category);
    const newGoal = ProfileStorage.addGoal({
      title: formData.title,
      description: formData.description || goalTemplate?.description || '',
      icon: goalTemplate?.icon || '🎯',
      category: formData.category,
      priority: formData.priority,
      status: 'active',
      targetValue: formData.targetValue ? parseFloat(formData.targetValue) : undefined,
      currentValue: 0,
      unit: formData.unit || undefined
    });

    setGoals(prev => [...prev, newGoal]);
    setIsAddDialogOpen(false);
    resetForm();
    onGoalsChange?.();
    
    toast({
      title: 'Goal added',
      description: `"${newGoal.title}" has been added to your goals.`,
    });
  };

  const handleEditGoal = () => {
    if (!editingGoal || !formData.title.trim()) return;

    const updatedGoal = ProfileStorage.updateGoal(editingGoal.id, {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      priority: formData.priority,
      targetValue: formData.targetValue ? parseFloat(formData.targetValue) : undefined,
      unit: formData.unit || undefined
    });

    if (updatedGoal) {
      setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
      setIsEditDialogOpen(false);
      setEditingGoal(null);
      resetForm();
      onGoalsChange?.();
      
      toast({
        title: 'Goal updated',
        description: `"${updatedGoal.title}" has been updated.`,
      });
    }
  };

  const handleDeleteGoal = (goal: Goal) => {
    if (window.confirm(`Are you sure you want to delete "${goal.title}"?`)) {
      ProfileStorage.deleteGoal(goal.id);
      setGoals(prev => prev.filter(g => g.id !== goal.id));
      onGoalsChange?.();
      
      toast({
        title: 'Goal deleted',
        description: `"${goal.title}" has been removed.`,
      });
    }
  };

  const handleStatusChange = (goal: Goal, newStatus: GoalStatus) => {
    const updatedGoal = ProfileStorage.updateGoal(goal.id, { status: newStatus });
    if (updatedGoal) {
      setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
      onGoalsChange?.();
      
      toast({
        title: 'Goal status updated',
        description: `"${goal.title}" is now ${newStatus}.`,
      });
    }
  };

  const handleProgressUpdate = (goal: Goal, newValue: number) => {
    const updatedGoal = ProfileStorage.updateGoal(goal.id, { currentValue: newValue });
    if (updatedGoal) {
      setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
      onGoalsChange?.();
    }
  };

  const openEditDialog = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      priority: goal.priority,
      targetValue: goal.targetValue?.toString() || '',
      unit: goal.unit || ''
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'energy',
      priority: 'medium',
      targetValue: '',
      unit: ''
    });
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusColor = (status: GoalStatus) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');
  const otherGoals = goals.filter(g => !['active', 'completed'].includes(g.status));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Your Goals</h3>
          <p className="text-sm text-muted-foreground">
            {activeGoals.length} active • {completedGoals.length} completed
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Improve sleep quality"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as GoalCategory }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WELLNESS_GOALS.map(goal => (
                      <SelectItem key={goal.id} value={goal.category}>
                        {goal.icon} {goal.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as Priority }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
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
                    placeholder="e.g., 8"
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit (optional)</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                    placeholder="e.g., hours"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your goal..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddGoal}>
                  Add Goal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-primary">Active Goals</h4>
          {activeGoals.map((goal) => (
            <Card key={goal.id} className="shadow-wellness">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{goal.icon}</span>
                    <div>
                      <h5 className="font-semibold">{goal.title}</h5>
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(goal.priority)}>
                      {goal.priority}
                    </Badge>
                    <Badge className={getStatusColor(goal.status)}>
                      {goal.status}
                    </Badge>
                  </div>
                </div>

                {goal.targetValue && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>
                        {goal.currentValue || 0}/{goal.targetValue} {goal.unit}
                      </span>
                    </div>
                    <Progress value={calculateGoalProgress(goal)} className="h-2" />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(goal, 'completed')}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Complete
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(goal, 'paused')}
                    >
                      <Pause className="h-4 w-4 mr-1" />
                      Pause
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditDialog(goal)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteGoal(goal)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-green-600">Completed Goals 🎉</h4>
          {completedGoals.map((goal) => (
            <Card key={goal.id} className="shadow-wellness bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{goal.icon}</span>
                    <div>
                      <h5 className="font-semibold">{goal.title}</h5>
                      <p className="text-sm text-muted-foreground">
                        Completed on {new Date(goal.completedAt!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(goal, 'active')}
                    >
                      Reactivate
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(goal, 'archived')}
                    >
                      <Archive className="h-4 w-4 mr-1" />
                      Archive
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {goals.length === 0 && (
        <Card className="shadow-wellness">
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h4 className="font-semibold mb-2">No goals yet</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Set your first wellness goal to start your journey!
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Goal Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as GoalCategory }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WELLNESS_GOALS.map(goal => (
                    <SelectItem key={goal.id} value={goal.category}>
                      {goal.icon} {goal.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as Priority }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
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
              <Button onClick={handleEditGoal}>
                Update Goal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};