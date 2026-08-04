import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Clock, AlertCircle, Tag, BatteryCharging, ListChecks } from 'lucide-react';
import { Task, TaskImportance, TaskEnergyLevel } from '../types';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'status'> & { id?: string }) => void;
  initialTask?: Task | null;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [importance, setImportance] = useState<TaskImportance>('medium');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(30);
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('Work');
  const [energyLevel, setEnergyLevel] = useState<TaskEnergyLevel>('medium');
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setImportance(initialTask.importance);
      setEstimatedMinutes(initialTask.estimatedMinutes);
      setDeadline(initialTask.deadline || '');
      setCategory(initialTask.category || 'Work');
      setEnergyLevel(initialTask.energyLevel || 'medium');
      setSubtasks(initialTask.subtasks?.map(s => s.title) || []);
    } else {
      setTitle('');
      setDescription('');
      setImportance('medium');
      setEstimatedMinutes(30);
      setDeadline('');
      setCategory('Work');
      setEnergyLevel('medium');
      setSubtasks([]);
    }
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([...subtasks, newSubtaskTitle.trim()]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: initialTask?.id,
      title: title.trim(),
      description: description.trim(),
      importance,
      estimatedMinutes: Math.max(5, estimatedMinutes),
      deadline: deadline.trim() || undefined,
      category: category.trim() || 'Work',
      energyLevel,
      subtasks: subtasks.map((st, idx) => ({
        id: `st-${Date.now()}-${idx}`,
        title: st,
        completed: false
      }))
    });

    onClose();
  };

  return (
    <div id="task-modal-backdrop" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div id="task-modal-card" className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 id="task-modal-title" className="text-base font-semibold text-white flex items-center gap-2">
            {initialTask ? 'Edit Task' : 'Add New Work Task'}
          </h2>
          <button
            id="btn-close-task-modal"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Task Title <span className="text-rose-400">*</span>
            </label>
            <input
              id="input-task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Fix API performance bottleneck"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description / Context
            </label>
            <textarea
              id="input-task-description"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key notes, links, or background requirements..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Importance */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-indigo-400" /> Importance
              </label>
              <select
                id="select-task-importance"
                value={importance}
                onChange={(e) => setImportance(e.target.value as TaskImportance)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="low">Low Importance</option>
                <option value="medium">Medium Importance</option>
                <option value="high">High Importance</option>
                <option value="critical">Critical / Blocker</option>
              </select>
            </div>

            {/* Estimated Duration */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> Length (Minutes)
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="input-task-minutes"
                  type="number"
                  min={5}
                  max={480}
                  step={5}
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(parseInt(e.target.value, 10) || 15)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3 text-slate-400" /> Category
              </label>
              <input
                id="input-task-category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Work, Admin..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Energy Level */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <BatteryCharging className="w-3 h-3 text-slate-400" /> Energy
              </label>
              <select
                id="select-task-energy"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(e.target.value as TaskEnergyLevel)}
                className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="low">Low Energy</option>
                <option value="medium">Med Energy</option>
                <option value="high">High Energy</option>
              </select>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Deadline
              </label>
              <input
                id="input-task-deadline"
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="Today 5pm"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Subtasks */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <ListChecks className="w-3.5 h-3.5 text-indigo-400" /> Actionable Subtasks
            </label>
            <div className="flex gap-2 mb-2">
              <input
                id="input-new-subtask"
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubtask(); } }}
                placeholder="Add sub-step..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              />
              <button
                id="btn-add-subtask"
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700"
              >
                Add
              </button>
            </div>
            {subtasks.length > 0 && (
              <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                {subtasks.map((st, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
                    <span className="text-slate-300">{st}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(idx)}
                      className="text-slate-500 hover:text-rose-400 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              id="btn-cancel-task-modal"
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              id="btn-save-task-modal"
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all"
            >
              {initialTask ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
