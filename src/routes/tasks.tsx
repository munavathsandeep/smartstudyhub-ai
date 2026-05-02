import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Plus, Trash2, CheckCircle, Circle, Filter, Search, Clock, Flag } from 'lucide-react'
import { PageLayout } from '@/components/Navigation'
import { store, SUBJECT_COLORS } from '@/lib/store'
import type { Task } from '@/lib/store'

export const Route = createFileRoute('/tasks')({
  component: TaskManager,
})

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'History', 'Computer Science', 'Biology', 'English', 'Economics']
const PRIORITIES = ['high', 'medium', 'low'] as const

function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    subject: 'Mathematics',
    priority: 'medium' as typeof PRIORITIES[number],
    dueDate: '',
    estimatedMinutes: 60,
  })

  useEffect(() => {
    setTasks(store.getTasks())
  }, [])

  const saveTasks = (updated: Task[]) => {
    setTasks(updated)
    store.setTasks(updated)
  }

  const toggleComplete = (id: string) => {
    saveTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter(t => t.id !== id))
  }

  const addTask = () => {
    if (!newTask.title.trim()) return
    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      completed: false,
    }
    saveTasks([task, ...tasks])
    setNewTask({ title: '', subject: 'Mathematics', priority: 'medium', dueDate: '', estimatedMinutes: 60 })
    setShowAdd(false)
  }

  const filtered = tasks.filter(t => {
    const matchFilter = filter === 'all' || (filter === 'pending' ? !t.completed : t.completed)
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const pending = tasks.filter(t => !t.completed).length
  const completed = tasks.filter(t => t.completed).length
  const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0

  const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 }
  const sorted = [...filtered].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  return (
    <PageLayout
      currentPath="/tasks"
      title="Task Manager"
      subtitle="Organize and track all your assignments and study goals"
    >
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total', value: tasks.length, color: '#6366f1' },
          { label: 'Pending', value: pending, color: '#f59e0b' },
          { label: 'Done', value: completed, color: '#10b981' },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="p-4 rounded-xl text-center"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          >
            <div className="text-2xl font-black" style={{ color }}>{value}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mb-6 p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <div className="flex justify-between text-sm mb-2">
          <span style={{ color: 'var(--text-secondary)' }}>Overall Completion</span>
          <span style={{ color: '#10b981' }}>{completionRate}%</span>
        </div>
        <div className="h-3 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${completionRate}%`, background: 'linear-gradient(90deg, #10b981, #34d399)' }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="input-glass pl-9"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'pending', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all"
              style={{
                background: filter === f ? 'rgba(99,102,241,0.15)' : 'var(--bg-card)',
                color: filter === f ? '#818cf8' : 'var(--text-secondary)',
                border: `1px solid ${filter === f ? 'rgba(99,102,241,0.3)' : 'var(--border-color)'}`,
              }}
            >
              {f}
            </button>
          ))}
          <button onClick={() => setShowAdd(true)} className="btn-primary px-4 py-2">
            <Plus size={16} />
            Add Task
          </button>
        </div>
      </div>

      {/* Add task form */}
      {showAdd && (
        <div
          className="p-5 rounded-2xl mb-5"
          style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)' }}
        >
          <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>New Task</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div className="md:col-span-2">
              <input
                type="text"
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Task title..."
                className="input-glass"
                onKeyDown={e => e.key === 'Enter' && addTask()}
                autoFocus
              />
            </div>
            <select
              value={newTask.subject}
              onChange={e => setNewTask({ ...newTask, subject: e.target.value })}
              className="input-glass"
            >
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={newTask.priority}
              onChange={e => setNewTask({ ...newTask, priority: e.target.value as typeof PRIORITIES[number] })}
              className="input-glass"
            >
              {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)} Priority</option>)}
            </select>
            <input
              type="date"
              value={newTask.dueDate}
              onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
              className="input-glass"
            />
            <input
              type="number"
              value={newTask.estimatedMinutes}
              onChange={e => setNewTask({ ...newTask, estimatedMinutes: parseInt(e.target.value) || 30 })}
              placeholder="Estimated minutes"
              className="input-glass"
              min="5"
              max="480"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={addTask} className="btn-primary">
              <Plus size={16} />
              Add Task
            </button>
            <button onClick={() => setShowAdd(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Task list */}
      <div className="space-y-2">
        {sorted.length === 0 && (
          <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
            <CheckCircle size={48} className="mx-auto mb-3 opacity-30" />
            <div className="font-medium">No tasks found</div>
            <div className="text-sm mt-1">
              {filter === 'completed' ? 'No completed tasks yet.' : 'Add a task to get started!'}
            </div>
          </div>
        )}
        {sorted.map(task => {
          const subjectColor = SUBJECT_COLORS[task.subject] || '#6366f1'
          return (
            <div
              key={task.id}
              className={`p-4 rounded-xl transition-all priority-${task.priority} ${task.completed ? 'opacity-60' : ''}`}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleComplete(task.id)}
                  className="mt-0.5 flex-shrink-0 transition-all"
                  style={{ color: task.completed ? '#10b981' : 'var(--text-muted)' }}
                >
                  {task.completed
                    ? <CheckCircle size={20} />
                    : <Circle size={20} />
                  }
                </button>

                <div className="flex-1 min-w-0">
                  <div
                    className="font-medium"
                    style={{
                      color: 'var(--text-primary)',
                      textDecoration: task.completed ? 'line-through' : 'none',
                      opacity: task.completed ? 0.6 : 1,
                    }}
                  >
                    {task.title}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: `${subjectColor}20`, color: subjectColor }}
                    >
                      {task.subject}
                    </span>
                    {task.dueDate && (
                      <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <Clock size={10} />
                        {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      ~{task.estimatedMinutes}min
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`badge badge-${task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'success'}`}
                  >
                    <Flag size={10} />
                    {task.priority}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 rounded-lg transition-all"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </PageLayout>
  )
}
