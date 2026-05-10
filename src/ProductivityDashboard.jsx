import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

import {
  Home, CheckSquare, Calendar, BarChart2, FileText, Flame,
  Timer, Brain, Star, Moon, Sun, Plus, Trash2, ChevronRight,
  Award, Clock, Layers, Bell, Search, Zap, Target, Coffee,
  Check, X, TrendingUp, Edit3, BookOpen, Settings, Activity,
  AlarmClock, RotateCcw, Play, Pause, ChevronLeft, Smile, AlertCircle
} from "lucide-react";

const ACCENT = '#22d3ee';
const VIOLET = '#818cf8';
const GREEN = '#34d399';
const AMBER = '#fbbf24';
const RED = '#f87171';
const PINK = '#f472b6';
const CHART_COLORS = [ACCENT, VIOLET, GREEN, AMBER, RED, PINK];

const INITIAL_TASKS = {
  daily: [
    { id: 1, title: 'Review morning emails', completed: false, priority: 'high', time: '09:00', category: 'Work' },
    { id: 2, title: 'Team standup meeting', completed: true, priority: 'high', time: '10:00', category: 'Work' },
    { id: 3, title: 'Work on project proposal', completed: false, priority: 'medium', time: '11:00', category: 'Work' },
    { id: 4, title: 'Code review session', completed: false, priority: 'medium', time: '14:00', category: 'Work' },
    { id: 5, title: 'Evening workout', completed: true, priority: 'low', time: '18:00', category: 'Health' },
    { id: 6, title: 'Read for 30 minutes', completed: false, priority: 'low', time: '21:00', category: 'Personal' },
  ],
  monthly: [
    { id: 1, title: 'Complete Q2 Analytics Report', completed: false, priority: 'high', dueDate: '2026-05-31', progress: 65, category: 'Work', tags: ['report', 'Q2'] },
    { id: 2, title: 'Launch new product feature', completed: false, priority: 'high', dueDate: '2026-05-25', progress: 40, category: 'Work', tags: ['product'] },
    { id: 3, title: 'Read 2 books this month', completed: false, priority: 'medium', dueDate: '2026-05-31', progress: 50, category: 'Personal', tags: ['reading'] },
    { id: 4, title: 'Exercise 20 times', completed: false, priority: 'medium', dueDate: '2026-05-31', progress: 70, category: 'Health', tags: ['fitness'] },
    { id: 5, title: 'Monthly budget review', completed: true, priority: 'high', dueDate: '2026-05-15', progress: 100, category: 'Finance', tags: ['finance'] },
    { id: 6, title: 'Learn new TypeScript features', completed: false, priority: 'low', dueDate: '2026-05-31', progress: 30, category: 'Work', tags: ['learning'] },
  ]
};

const INITIAL_HABITS = [
  { id: 1, name: 'Morning Meditation', emoji: '🧘', streak: 12, target: 21, color: VIOLET, completedToday: false },
  { id: 2, name: 'Drink 8 Glasses Water', emoji: '💧', streak: 7, target: 30, color: ACCENT, completedToday: true },
  { id: 3, name: 'Read 30 Minutes', emoji: '📚', streak: 5, target: 21, color: GREEN, completedToday: false },
  { id: 4, name: 'No Social Media 9pm+', emoji: '📵', streak: 3, target: 30, color: AMBER, completedToday: true },
  { id: 5, name: 'Cold Shower', emoji: '🚿', streak: 8, target: 21, color: RED, completedToday: false },
  { id: 6, name: 'Gratitude Journaling', emoji: '✍️', streak: 15, target: 30, color: PINK, completedToday: true },
];

const INITIAL_NOTES = [
  { id: 1, title: 'Project Ideas', content: 'Build a productivity dashboard with AI integration. Consider using Next.js for SSR. Explore real-time collaboration features.', color: VIOLET, pinned: true, createdAt: '2026-05-08' },
  { id: 2, title: 'Weekly Goals', content: '1. Complete the Q2 report\n2. Exercise 3x this week\n3. Finish chapter 5 of Atomic Habits\n4. Call mentor on Friday', color: ACCENT, pinned: false, createdAt: '2026-05-07' },
  { id: 3, title: 'Meeting Notes - Design Review', content: 'Discussed new feature rollout timeline. Key stakeholders: John, Sarah, Mike. Next steps: wireframes by EOW.', color: GREEN, pinned: false, createdAt: '2026-05-06' },
  { id: 4, title: 'Book Highlights', content: '"Focus on systems, not goals." — James Clear. The aggregation of marginal gains principle. 1% better every day.', color: AMBER, pinned: true, createdAt: '2026-05-05' },
];

const WEEKLY_DATA = [
  { day: 'Mon', score: 82, tasks: 8, focus: 180 },
  { day: 'Tue', score: 91, tasks: 12, focus: 240 },
  { day: 'Wed', score: 75, tasks: 6, focus: 150 },
  { day: 'Thu', score: 88, tasks: 10, focus: 210 },
  { day: 'Fri', score: 94, tasks: 14, focus: 270 },
  { day: 'Sat', score: 60, tasks: 4, focus: 90 },
  { day: 'Sun', score: 70, tasks: 5, focus: 120 },
];

const MONTHLY_DATA = [
  { week: 'W1', completed: 32, pending: 8 },
  { week: 'W2', completed: 28, pending: 12 },
  { week: 'W3', completed: 35, pending: 5 },
  { week: 'W4', completed: 41, pending: 9 },
];

const CATEGORY_DATA = [
  { name: 'Work', value: 45, color: ACCENT },
  { name: 'Health', value: 20, color: GREEN },
  { name: 'Personal', value: 20, color: VIOLET },
  { name: 'Finance', value: 15, color: AMBER },
];

const RADAR_DATA = [
  { subject: 'Focus', A: 85 }, { subject: 'Output', A: 72 },
  { subject: 'Energy', A: 90 }, { subject: 'Balance', A: 60 },
  { subject: 'Growth', A: 78 }, { subject: 'Wellness', A: 82 },
];

const HOURS_DATA = Array.from({ length: 12 }, (_, i) => ({
  hour: `${8 + i}:00`, productivity: Math.floor(20 + Math.random() * 75),
}));

const PRIORITY_COLOR = { high: RED, medium: AMBER, low: GREEN };
const PRIORITY_BG = { high: 'rgba(248,113,113,0.15)', medium: 'rgba(251,191,36,0.15)', low: 'rgba(52,211,153,0.15)' };

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'daily', label: 'Daily Tasks', icon: CheckSquare },
  { id: 'monthly', label: 'Monthly Tasks', icon: Layers },
  { id: 'habits', label: 'Habit Tracker', icon: Flame },
  { id: 'pomodoro', label: 'Pomodoro', icon: Timer },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'ai', label: 'AI Coach', icon: Brain },
];

function CircularProgress({ value, size = 80, stroke = 8, color = ACCENT, children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
      </svg>
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
}

export default function ProductivityDashboard() {
  const [dark, setDark] = useState(true);
  const [view, setView] = useState('dashboard');
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [habits, setHabits] = useState(INITIAL_HABITS);
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [newTask, setNewTask] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [newNote, setNewNote] = useState({ title: '', content: '', color: VIOLET });
  const [showNewNote, setShowNewNote] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [search, setSearch] = useState('');
  const [calDate, setCalDate] = useState(new Date(2026, 4, 10));
  const [aiMessages, setAiMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your AI productivity coach 🎯 I can help you prioritize tasks, beat procrastination, and optimize your workflow. What would you like to improve today?" }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [pomo, setPomo] = useState({ min: 25, sec: 0, running: false, mode: 'focus', sessions: 0, totalFocus: 0 });
  const [taskFilter, setTaskFilter] = useState('all');
  const pomRef = useRef(null);
  const aiEndRef = useRef(null);

  const bg = dark ? '#060d1a' : '#f0f4f8';
  const surface = dark ? '#0c1526' : '#ffffff';
  const card = dark ? '#0f1e33' : '#ffffff';
  const cardBorder = dark ? 'rgba(34,211,238,0.1)' : 'rgba(0,0,0,0.08)';
  const text = dark ? '#e2e8f0' : '#1a202c';
  const muted = dark ? '#64748b' : '#94a3b8';
  const inputBg = dark ? '#071120' : '#f8fafc';
  const navActive = dark ? 'rgba(34,211,238,0.12)' : 'rgba(34,211,238,0.1)';
  const hover = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';

  const cardStyle = { background: card, border: `1px solid ${cardBorder}`, borderRadius: 16, padding: 20 };
  const inputStyle = { background: inputBg, border: `1px solid ${cardBorder}`, borderRadius: 10, padding: '10px 14px', color: text, width: '100%', outline: 'none', fontSize: 14 };

  useEffect(() => {
    if (pomo.running) {
      pomRef.current = setInterval(() => {
        setPomo(p => {
          if (p.sec > 0) return { ...p, sec: p.sec - 1 };
          if (p.min > 0) return { ...p, min: p.min - 1, sec: 59 };
          const next = p.mode === 'focus' ? 'break' : 'focus';
          return { ...p, running: false, mode: next, min: next === 'focus' ? 25 : 5, sec: 0, sessions: p.mode === 'focus' ? p.sessions + 1 : p.sessions, totalFocus: p.mode === 'focus' ? p.totalFocus + 25 : p.totalFocus };
        });
      }, 1000);
    }
    return () => clearInterval(pomRef.current);
  }, [pomo.running]);

  useEffect(() => { aiEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [aiMessages]);

  const completedDaily = tasks.daily.filter(t => t.completed).length;
  const totalDaily = tasks.daily.length;
  const dailyScore = totalDaily ? Math.round((completedDaily / totalDaily) * 100) : 0;
  const completedMonthly = tasks.monthly.filter(t => t.completed).length;
  const habitStreak = Math.max(...habits.map(h => h.streak));
  const habitsDone = habits.filter(h => h.completedToday).length;

  const toggleTask = (type, id) => setTasks(p => ({ ...p, [type]: p[type].map(t => t.id === id ? { ...t, completed: !t.completed } : t) }));
  const deleteTask = (type, id) => setTasks(p => ({ ...p, [type]: p[type].filter(t => t.id !== id) }));
  const addTask = (type) => {
    if (!newTask.trim()) return;
    const t = { id: Date.now(), title: newTask, completed: false, priority: newPriority, category: 'Work', time: '09:00', dueDate: '2026-05-31', progress: 0, tags: [] };
    setTasks(p => ({ ...p, [type]: [...p[type], t] }));
    setNewTask('');
  };
  const toggleHabit = (id) => setHabits(p => p.map(h => h.id === id ? { ...h, completedToday: !h.completedToday, streak: !h.completedToday ? h.streak + 1 : Math.max(0, h.streak - 1) } : h));

  const sendAi = async () => {
    if (!aiInput.trim() || aiLoading) return;
    const msg = { role: 'user', content: aiInput };
    const history = [...aiMessages, msg];
    setAiMessages(history);
    setAiInput('');
    setAiLoading(true);
    try {
      const ctx = `User's productivity today: ${completedDaily}/${totalDaily} daily tasks done (${dailyScore}% score), ${completedMonthly}/${tasks.monthly.length} monthly tasks done, ${habitsDone}/${habits.length} habits completed, ${pomo.sessions} pomodoro sessions.`;
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are an expert AI productivity coach embedded in a productivity dashboard. ${ctx} Be warm, motivating, and give specific, actionable advice. Keep responses concise (2-4 sentences) unless detail is requested. Use occasional emojis sparingly.`,
          messages: history
        })
      });
      const data = await res.json();
      setAiMessages(prev => [...prev, { role: 'assistant', content: data.content?.[0]?.text || "Let me think about that..." }]);
    } catch {
      setAiMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting right now. Please try again in a moment! 🔄" }]);
    }
    setAiLoading(false);
  };

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDay = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const taskDates = tasks.monthly.map(t => t.dueDate).filter(Boolean);

  // ─── VIEWS ───────────────────────────────────────────────────────────────

  const renderDashboard = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 700, color: text, letterSpacing: -0.5 }}>Good morning, Vanthan 👋</div>
          <div style={{ color: muted, fontSize: 14, marginTop: 4 }}>Sunday, May 10, 2026 · Week 19</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ ...cardStyle, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => setView('pomodoro')}>
            <Timer size={15} color={ACCENT} />
            <span style={{ color: ACCENT, fontSize: 13, fontWeight: 600 }}>Start Focus</span>
          </div>
          <div style={{ ...cardStyle, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => setView('ai')}>
            <Brain size={15} color={VIOLET} />
            <span style={{ color: VIOLET, fontSize: 13, fontWeight: 600 }}>AI Coach</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: "Today's Score", value: `${dailyScore}%`, icon: Zap, color: ACCENT, sub: `${completedDaily}/${totalDaily} tasks` },
          { label: 'Longest Streak', value: `${habitStreak}d`, icon: Flame, color: AMBER, sub: 'habit streak' },
          { label: 'Habits Done', value: `${habitsDone}/${habits.length}`, icon: Award, color: GREEN, sub: 'today' },
          { label: 'Focus Sessions', value: `${pomo.sessions}`, icon: Timer, color: VIOLET, sub: `${pomo.totalFocus} min focused` },
        ].map((s, i) => (
          <div key={i} style={{ ...cardStyle, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -10, right: -10, width: 60, height: 60, borderRadius: '50%', background: `${s.color}15` }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ color: muted, fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
                <div style={{ color: s.color, fontSize: 32, fontWeight: 800, marginTop: 6, letterSpacing: -1 }}>{s.value}</div>
                <div style={{ color: muted, fontSize: 12, marginTop: 2 }}>{s.sub}</div>
              </div>
              <div style={{ background: `${s.color}20`, borderRadius: 10, padding: 8 }}>
                <s.icon size={18} color={s.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div style={cardStyle}>
          <div style={{ color: text, fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Weekly Productivity</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={WEEKLY_DATA}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={ACCENT} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
              <XAxis dataKey="day" tick={{ fill: muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: muted, fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: card, border: `1px solid ${cardBorder}`, borderRadius: 10, color: text, fontSize: 12 }} />
              <Area type="monotone" dataKey="score" stroke={ACCENT} strokeWidth={2} fill="url(#scoreGrad)" dot={{ fill: ACCENT, r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={cardStyle}>
          <div style={{ color: text, fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Task Categories</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {CATEGORY_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: card, border: `1px solid ${cardBorder}`, borderRadius: 10, color: text, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {CATEGORY_DATA.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: muted }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                {d.name} {d.value}%
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Tasks + Habits */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ color: text, fontWeight: 600, fontSize: 14 }}>Today's Priority Tasks</div>
            <div style={{ cursor: 'pointer', color: ACCENT, fontSize: 12 }} onClick={() => setView('daily')}>See all →</div>
          </div>
          {tasks.daily.filter(t => t.priority === 'high' || !t.completed).slice(0, 4).map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${cardBorder}` }}>
              <div onClick={() => toggleTask('daily', t.id)} style={{ cursor: 'pointer', color: t.completed ? GREEN : muted, flexShrink: 0 }}>
                {t.completed ? <Check size={18} /> : <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${muted}` }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: t.completed ? muted : text, fontSize: 13, textDecoration: t.completed ? 'line-through' : 'none' }}>{t.title}</div>
                <div style={{ color: muted, fontSize: 11, marginTop: 2 }}>{t.time} · {t.category}</div>
              </div>
              <div style={{ padding: '2px 8px', borderRadius: 6, background: PRIORITY_BG[t.priority], color: PRIORITY_COLOR[t.priority], fontSize: 10, fontWeight: 600, textTransform: 'uppercase' }}>{t.priority}</div>
            </div>
          ))}
        </div>
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ color: text, fontWeight: 600, fontSize: 14 }}>Habit Streaks</div>
            <div style={{ cursor: 'pointer', color: ACCENT, fontSize: 12 }} onClick={() => setView('habits')}>See all →</div>
          </div>
          {habits.slice(0, 4).map(h => (
            <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: `1px solid ${cardBorder}` }}>
              <div onClick={() => toggleHabit(h.id)} style={{ cursor: 'pointer', width: 32, height: 32, borderRadius: '50%', background: h.completedToday ? h.color : 'transparent', border: `2px solid ${h.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }}>
                {h.completedToday && <Check size={14} color="#fff" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: text, fontSize: 13 }}>{h.emoji} {h.name}</div>
                <div style={{ height: 4, background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', borderRadius: 2, marginTop: 6, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.round((h.streak / h.target) * 100)}%`, background: h.color, borderRadius: 2, transition: 'width 0.5s' }} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: AMBER, fontSize: 12, fontWeight: 700 }}>
                <Flame size={13} color={AMBER} /> {h.streak}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important Tasks */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <AlertCircle size={16} color={RED} />
          <div style={{ color: text, fontWeight: 600, fontSize: 14 }}>⚡ High Priority — Monthly Tasks</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {tasks.monthly.filter(t => t.priority === 'high' && !t.completed).map(t => (
            <div key={t.id} style={{ background: dark ? 'rgba(248,113,113,0.06)' : 'rgba(248,113,113,0.05)', border: `1px solid rgba(248,113,113,0.25)`, borderRadius: 12, padding: 14 }}>
              <div style={{ color: RED, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>HIGH PRIORITY</div>
              <div style={{ color: text, fontSize: 13, fontWeight: 500, marginBottom: 8 }}>{t.title}</div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden', marginBottom: 8 }}>
                <div style={{ height: '100%', width: `${t.progress}%`, background: RED, borderRadius: 2 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: muted, fontSize: 11 }}>Due {t.dueDate}</span>
                <span style={{ color: RED, fontSize: 11, fontWeight: 600 }}>{t.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDailyTasks = () => {
    const filtered = tasks.daily.filter(t =>
      taskFilter === 'all' ? true : taskFilter === 'completed' ? t.completed : !t.completed
    );
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: text }}>Daily Tasks</div>
            <div style={{ color: muted, fontSize: 13, marginTop: 2 }}>{completedDaily} of {totalDaily} tasks completed · {dailyScore}% done</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['all', 'pending', 'completed'].map(f => (
              <button key={f} onClick={() => setTaskFilter(f)} style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${taskFilter === f ? ACCENT : cardBorder}`, background: taskFilter === f ? `${ACCENT}20` : 'transparent', color: taskFilter === f ? ACCENT : muted, fontSize: 12, cursor: 'pointer', fontWeight: taskFilter === f ? 600 : 400 }}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: text, fontSize: 13, fontWeight: 500 }}>Daily Progress</span>
            <span style={{ color: ACCENT, fontSize: 13, fontWeight: 700 }}>{dailyScore}%</span>
          </div>
          <div style={{ height: 8, background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${dailyScore}%`, background: `linear-gradient(90deg, ${ACCENT}, ${VIOLET})`, borderRadius: 4, transition: 'width 0.5s' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ color: muted, fontSize: 11 }}>{completedDaily} completed</span>
            <span style={{ color: muted, fontSize: 11 }}>{totalDaily - completedDaily} remaining</span>
          </div>
        </div>

        {/* Add task */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', gap: 10 }}>
            <input value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask('daily')} placeholder="Add a new task for today..." style={{ ...inputStyle, flex: 1 }} />
            <select value={newPriority} onChange={e => setNewPriority(e.target.value)} style={{ ...inputStyle, width: 110 }}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button onClick={() => addTask('daily')} style={{ background: ACCENT, border: 'none', borderRadius: 10, padding: '10px 18px', color: '#000', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <Plus size={15} /> Add
            </button>
          </div>
        </div>

        {/* Task list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(t => (
            <div key={t.id} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', transition: 'all 0.2s', opacity: t.completed ? 0.7 : 1 }}>
              <div onClick={() => toggleTask('daily', t.id)} style={{ cursor: 'pointer', width: 24, height: 24, borderRadius: '50%', border: `2px solid ${t.completed ? GREEN : cardBorder}`, background: t.completed ? GREEN : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                {t.completed && <Check size={13} color="#fff" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: t.completed ? muted : text, fontSize: 14, textDecoration: t.completed ? 'line-through' : 'none', fontWeight: 500 }}>{t.title}</div>
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <span style={{ color: muted, fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} /> {t.time}</span>
                  <span style={{ color: muted, fontSize: 11 }}>{t.category}</span>
                </div>
              </div>
              <div style={{ padding: '3px 10px', borderRadius: 6, background: PRIORITY_BG[t.priority], color: PRIORITY_COLOR[t.priority], fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>{t.priority}</div>
              <div onClick={() => deleteTask('daily', t.id)} style={{ cursor: 'pointer', color: muted, padding: 4, borderRadius: 6 }}>
                <Trash2 size={14} />
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ ...cardStyle, textAlign: 'center', padding: 40, color: muted }}>
              <Check size={32} style={{ margin: '0 auto 12px', display: 'block' }} />
              <div style={{ fontSize: 15, fontWeight: 500 }}>All caught up! 🎉</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMonthlyTasks = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: text }}>Monthly Tasks</div>
      <div style={cardStyle}>
        <div style={{ display: 'flex', gap: 10 }}>
          <input value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask('monthly')} placeholder="Add a new monthly goal or task..." style={{ ...inputStyle, flex: 1 }} />
          <select value={newPriority} onChange={e => setNewPriority(e.target.value)} style={{ ...inputStyle, width: 110 }}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button onClick={() => addTask('monthly')} style={{ background: VIOLET, border: 'none', borderRadius: 10, padding: '10px 18px', color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <Plus size={15} /> Add
          </button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {tasks.monthly.map(t => (
          <div key={t.id} style={{ ...cardStyle, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: `${t.progress}%`, height: 3, background: t.completed ? GREEN : PRIORITY_COLOR[t.priority] }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div onClick={() => toggleTask('monthly', t.id)} style={{ cursor: 'pointer', width: 22, height: 22, borderRadius: '50%', border: `2px solid ${t.completed ? GREEN : cardBorder}`, background: t.completed ? GREEN : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2, flexShrink: 0 }}>
                  {t.completed && <Check size={12} color="#fff" />}
                </div>
                <div>
                  <div style={{ color: t.completed ? muted : text, fontSize: 14, fontWeight: 500, textDecoration: t.completed ? 'line-through' : 'none' }}>{t.title}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                    {t.tags.map((tag, i) => <span key={i} style={{ padding: '2px 8px', borderRadius: 4, background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)', color: muted, fontSize: 10 }}>#{tag}</span>)}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <div style={{ padding: '2px 8px', borderRadius: 6, background: PRIORITY_BG[t.priority], color: PRIORITY_COLOR[t.priority], fontSize: 10, fontWeight: 600, textTransform: 'uppercase' }}>{t.priority}</div>
                <div onClick={() => deleteTask('monthly', t.id)} style={{ cursor: 'pointer', color: muted }}><Trash2 size={13} /></div>
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: muted, fontSize: 11 }}>{t.category}</span>
                <span style={{ color: muted, fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={10} /> {t.dueDate}</span>
              </div>
              <div style={{ height: 6, background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${t.progress}%`, background: t.completed ? GREEN : PRIORITY_COLOR[t.priority], borderRadius: 3 }} />
              </div>
              <div style={{ textAlign: 'right', color: muted, fontSize: 11, marginTop: 4 }}>{t.progress}% complete</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHabits = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: text }}>Habit Tracker</div>
          <div style={{ color: muted, fontSize: 13, marginTop: 2 }}>{habitsDone} of {habits.length} habits completed today</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <CircularProgress value={Math.round((habitsDone / habits.length) * 100)} size={64} stroke={6} color={AMBER}>
            <span style={{ color: text, fontSize: 14, fontWeight: 700 }}>{Math.round((habitsDone / habits.length) * 100)}%</span>
          </CircularProgress>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {habits.map(h => (
          <div key={h.id} style={{ ...cardStyle, position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{h.emoji}</div>
                <div style={{ color: text, fontSize: 14, fontWeight: 500 }}>{h.name}</div>
              </div>
              <div onClick={() => toggleHabit(h.id)} style={{ cursor: 'pointer', width: 36, height: 36, borderRadius: '50%', border: `2px solid ${h.color}`, background: h.completedToday ? h.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }}>
                {h.completedToday && <Check size={16} color="#fff" />}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Flame size={14} color={AMBER} />
                <span style={{ color: AMBER, fontWeight: 700, fontSize: 18 }}>{h.streak}</span>
                <span style={{ color: muted, fontSize: 11 }}>day streak</span>
              </div>
              <span style={{ color: muted, fontSize: 11 }}>goal: {h.target}d</span>
            </div>
            <div style={{ height: 6, background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(100, Math.round((h.streak / h.target) * 100))}%`, background: h.color, borderRadius: 3, transition: 'width 0.5s' }} />
            </div>
            <div style={{ color: muted, fontSize: 11, marginTop: 6 }}>{Math.min(100, Math.round((h.streak / h.target) * 100))}% to goal</div>
          </div>
        ))}
      </div>

      {/* Streak leaderboard */}
      <div style={cardStyle}>
        <div style={{ color: text, fontWeight: 600, fontSize: 14, marginBottom: 16 }}>🏆 Streak Leaderboard</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[...habits].sort((a, b) => b.streak - a.streak).map((h, i) => (
            <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ color: i < 3 ? [AMBER, muted, '#cd7f32'][i] : muted, fontWeight: 700, fontSize: 14, width: 20 }}>{i + 1}</span>
              <span style={{ fontSize: 16 }}>{h.emoji}</span>
              <span style={{ color: text, fontSize: 13, flex: 1 }}>{h.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Flame size={13} color={AMBER} />
                <span style={{ color: AMBER, fontWeight: 700, fontSize: 14 }}>{h.streak}</span>
              </div>
              <div style={{ width: 80, height: 6, background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.round((h.streak / habitStreak) * 100)}%`, background: h.color, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPomodoro = () => {
    const total = pomo.mode === 'focus' ? 25 * 60 : 5 * 60;
    const elapsed = total - (pomo.min * 60 + pomo.sec);
    const progress = Math.round((elapsed / total) * 100);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: text }}>Pomodoro Timer</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 40, gap: 24 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              {['focus', 'break'].map(m => (
                <button key={m} onClick={() => setPomo(p => ({ ...p, mode: m, min: m === 'focus' ? 25 : 5, sec: 0, running: false }))} style={{ padding: '6px 20px', borderRadius: 20, border: `1px solid ${pomo.mode === m ? ACCENT : cardBorder}`, background: pomo.mode === m ? `${ACCENT}20` : 'transparent', color: pomo.mode === m ? ACCENT : muted, fontSize: 13, cursor: 'pointer', fontWeight: pomo.mode === m ? 600 : 400 }}>
                  {m === 'focus' ? '🧠 Focus' : '☕ Break'}
                </button>
              ))}
            </div>
            <CircularProgress value={progress} size={220} stroke={12} color={pomo.mode === 'focus' ? ACCENT : GREEN}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: text, fontSize: 52, fontWeight: 800, fontFamily: 'monospace', letterSpacing: 2 }}>
                  {String(pomo.min).padStart(2, '0')}:{String(pomo.sec).padStart(2, '0')}
                </div>
                <div style={{ color: muted, fontSize: 14, marginTop: 4 }}>{pomo.mode === 'focus' ? 'Focus Time' : 'Break Time'}</div>
              </div>
            </CircularProgress>
            <div style={{ display: 'flex', gap: 14 }}>
              <button onClick={() => setPomo(p => ({ ...p, running: !p.running }))} style={{ width: 56, height: 56, borderRadius: '50%', border: 'none', background: pomo.mode === 'focus' ? ACCENT : GREEN, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {pomo.running ? <Pause size={22} color="#000" /> : <Play size={22} color="#000" />}
              </button>
              <button onClick={() => setPomo(p => ({ ...p, running: false, min: p.mode === 'focus' ? 25 : 5, sec: 0 }))} style={{ width: 56, height: 56, borderRadius: '50%', border: `1px solid ${cardBorder}`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted }}>
                <RotateCcw size={20} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Sessions Today', value: pomo.sessions, icon: Timer, color: ACCENT },
              { label: 'Total Focus Time', value: `${pomo.totalFocus}m`, icon: Clock, color: VIOLET },
              { label: 'Current Streak', value: `${pomo.sessions} 🔥`, icon: Flame, color: AMBER },
            ].map((s, i) => (
              <div key={i} style={cardStyle}>
                <div style={{ color: muted, fontSize: 12 }}>{s.label}</div>
                <div style={{ color: s.color, fontSize: 28, fontWeight: 800, marginTop: 4 }}>{s.value}</div>
              </div>
            ))}
            <div style={cardStyle}>
              <div style={{ color: text, fontWeight: 500, fontSize: 13, marginBottom: 12 }}>Session Schedule</div>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: i <= pomo.sessions ? ACCENT : dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {i <= pomo.sessions && <Check size={12} color="#000" />}
                  </div>
                  <div style={{ color: i <= pomo.sessions ? text : muted, fontSize: 13 }}>Session {i} — 25 min focus</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ color: text, fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Weekly Focus Time</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={WEEKLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
              <XAxis dataKey="day" tick={{ fill: muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: card, border: `1px solid ${cardBorder}`, borderRadius: 10, color: text, fontSize: 12 }} />
              <Bar dataKey="focus" fill={ACCENT} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    const days = getDaysInMonth(calDate);
    const firstDay = getFirstDay(calDate);
    const monthName = calDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    const cells = Array.from({ length: firstDay + days }, (_, i) => i < firstDay ? null : i - firstDay + 1);
    const today = 10;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: text }}>Calendar</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setCalDate(d => new Date(d.getFullYear(), d.getMonth() - 1))} style={{ background: 'transparent', border: `1px solid ${cardBorder}`, borderRadius: 8, padding: '6px 12px', color: muted, cursor: 'pointer' }}><ChevronLeft size={16} /></button>
            <span style={{ color: text, fontWeight: 600, minWidth: 160, textAlign: 'center' }}>{monthName}</span>
            <button onClick={() => setCalDate(d => new Date(d.getFullYear(), d.getMonth() + 1))} style={{ background: 'transparent', border: `1px solid ${cardBorder}`, borderRadius: 8, padding: '6px 12px', color: muted, cursor: 'pointer' }}><ChevronRight size={16} /></button>
          </div>
        </div>
        <div style={cardStyle}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 8 }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} style={{ textAlign: 'center', color: muted, fontSize: 12, fontWeight: 600, padding: '8px 0' }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {cells.map((day, i) => {
              const dateStr = day ? `2026-05-${String(day).padStart(2, '0')}` : null;
              const hasTasks = dateStr && taskDates.includes(dateStr);
              const isToday = day === today;
              return (
                <div key={i} style={{ aspect: '1', borderRadius: 10, background: isToday ? ACCENT : hasTasks ? `${VIOLET}20` : 'transparent', border: isToday ? 'none' : hasTasks ? `1px solid ${VIOLET}40` : `1px solid transparent`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: day ? 'pointer' : 'default', padding: 4, position: 'relative' }}>
                  {day && <span style={{ color: isToday ? '#000' : text, fontSize: 13, fontWeight: isToday ? 700 : 400 }}>{day}</span>}
                  {hasTasks && !isToday && <div style={{ width: 4, height: 4, borderRadius: '50%', background: VIOLET, position: 'absolute', bottom: 5 }} />}
                </div>
              );
            })}
          </div>
        </div>
        <div style={cardStyle}>
          <div style={{ color: text, fontWeight: 600, fontSize: 14, marginBottom: 14 }}>Upcoming Deadlines</div>
          {tasks.monthly.filter(t => !t.completed).sort((a, b) => a.dueDate.localeCompare(b.dueDate)).map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: `1px solid ${cardBorder}` }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: PRIORITY_COLOR[t.priority], flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ color: text, fontSize: 13 }}>{t.title}</div>
                <div style={{ color: muted, fontSize: 11, marginTop: 2 }}>{t.category}</div>
              </div>
              <span style={{ color: muted, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={11} /> {t.dueDate}</span>
              <div style={{ padding: '2px 8px', borderRadius: 6, background: PRIORITY_BG[t.priority], color: PRIORITY_COLOR[t.priority], fontSize: 10, fontWeight: 600 }}>{t.priority}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderNotes = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: text }}>Notes</div>
        <button onClick={() => setShowNewNote(true)} style={{ background: ACCENT, border: 'none', borderRadius: 10, padding: '8px 18px', color: '#000', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <Plus size={15} /> New Note
        </button>
      </div>
      {showNewNote && (
        <div style={cardStyle}>
          <div style={{ color: text, fontWeight: 600, fontSize: 14, marginBottom: 14 }}>New Note</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input value={newNote.title} onChange={e => setNewNote(p => ({ ...p, title: e.target.value }))} placeholder="Note title..." style={inputStyle} />
            <textarea value={newNote.content} onChange={e => setNewNote(p => ({ ...p, content: e.target.value }))} placeholder="Start writing..." rows={4} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ color: muted, fontSize: 12 }}>Color:</span>
              {[VIOLET, ACCENT, GREEN, AMBER, RED, PINK].map(c => (
                <div key={c} onClick={() => setNewNote(p => ({ ...p, color: c }))} style={{ width: 20, height: 20, borderRadius: '50%', background: c, cursor: 'pointer', border: newNote.color === c ? '2px solid white' : 'none' }} />
              ))}
              <div style={{ flex: 1 }} />
              <button onClick={() => setShowNewNote(false)} style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${cardBorder}`, background: 'transparent', color: muted, cursor: 'pointer', fontSize: 12 }}>Cancel</button>
              <button onClick={() => { if (!newNote.title.trim()) return; setNotes(p => [{ id: Date.now(), ...newNote, pinned: false, createdAt: '2026-05-10' }, ...p]); setNewNote({ title: '', content: '', color: VIOLET }); setShowNewNote(false); }} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: ACCENT, color: '#000', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Save</button>
            </div>
          </div>
        </div>
      )}
      {/* Pinned */}
      {notes.filter(n => n.pinned).length > 0 && (
        <>
          <div style={{ color: muted, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>📌 Pinned</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
            {notes.filter(n => n.pinned).map(n => <NoteCard key={n.id} note={n} />)}
          </div>
        </>
      )}
      <div style={{ color: muted, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>All Notes</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {notes.filter(n => !n.pinned).map(n => <NoteCard key={n.id} note={n} />)}
      </div>
    </div>
  );

  function NoteCard({ note }) {
    return (
      <div style={{ ...cardStyle, borderLeft: `3px solid ${note.color}`, position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div style={{ color: note.color, fontSize: 13, fontWeight: 600 }}>{note.title}</div>
          <button onClick={() => setNotes(p => p.filter(n => n.id !== note.id))} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: muted, padding: 2 }}><X size={14} /></button>
        </div>
        <div style={{ color: muted, fontSize: 12, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{note.content.slice(0, 150)}{note.content.length > 150 ? '...' : ''}</div>
        <div style={{ color: muted, fontSize: 10, marginTop: 12 }}>{note.createdAt}</div>
      </div>
    );
  }

  const renderAnalytics = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: text }}>Analytics Dashboard</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Avg Daily Score', value: '82%', color: ACCENT },
          { label: 'Tasks This Week', value: '49', color: VIOLET },
          { label: 'Focus Hours', value: `${Math.round(WEEKLY_DATA.reduce((s, d) => s + d.focus, 0) / 60)}h`, color: GREEN },
          { label: 'Completion Rate', value: '78%', color: AMBER },
        ].map((s, i) => (
          <div key={i} style={cardStyle}>
            <div style={{ color: muted, fontSize: 11, fontWeight: 500, textTransform: 'uppercase' }}>{s.label}</div>
            <div style={{ color: s.color, fontSize: 30, fontWeight: 800, marginTop: 6 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={cardStyle}>
          <div style={{ color: text, fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Daily Productivity Score</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={WEEKLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
              <XAxis dataKey="day" tick={{ fill: muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: muted, fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: card, border: `1px solid ${cardBorder}`, borderRadius: 10, color: text, fontSize: 12 }} />
              <Line type="monotone" dataKey="score" stroke={ACCENT} strokeWidth={2.5} dot={{ fill: ACCENT, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={cardStyle}>
          <div style={{ color: text, fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Weekly Completed vs Pending</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
              <XAxis dataKey="week" tick={{ fill: muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: card, border: `1px solid ${cardBorder}`, borderRadius: 10, color: text, fontSize: 12 }} />
              <Bar dataKey="completed" fill={GREEN} radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" fill={RED} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={cardStyle}>
          <div style={{ color: text, fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Work Balance Radar</div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke={dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: muted, fontSize: 11 }} />
              <Radar name="You" dataKey="A" stroke={VIOLET} fill={VIOLET} fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div style={cardStyle}>
          <div style={{ color: text, fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Task Categories</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={CATEGORY_DATA} cx="50%" cy="50%" outerRadius={85} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={{ stroke: muted }}>
                {CATEGORY_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: card, border: `1px solid ${cardBorder}`, borderRadius: 10, color: text, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ color: text, fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Hourly Productivity Timeline</div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={HOURS_DATA}>
            <defs>
              <linearGradient id="hourGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={VIOLET} stopOpacity={0.3} />
                <stop offset="95%" stopColor={VIOLET} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
            <XAxis dataKey="hour" tick={{ fill: muted, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: muted, fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: card, border: `1px solid ${cardBorder}`, borderRadius: 10, color: text, fontSize: 12 }} />
            <Area type="monotone" dataKey="productivity" stroke={VIOLET} fill="url(#hourGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {[
          { label: 'Productivity Score', value: dailyScore, color: ACCENT },
          { label: 'Habit Completion', value: Math.round((habitsDone / habits.length) * 100), color: GREEN },
          { label: 'Monthly Progress', value: Math.round((completedMonthly / tasks.monthly.length) * 100), color: VIOLET },
        ].map((m, i) => (
          <div key={i} style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: 30 }}>
            <CircularProgress value={m.value} size={100} stroke={8} color={m.color}>
              <span style={{ color: m.color, fontWeight: 800, fontSize: 20 }}>{m.value}%</span>
            </CircularProgress>
            <span style={{ color: muted, fontSize: 13, textAlign: 'center' }}>{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAI = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: text }}>AI Productivity Coach</div>
          <div style={{ color: muted, fontSize: 13, marginTop: 2 }}>Powered by Claude · Your personal productivity advisor</div>
        </div>
        <div style={{ background: `${VIOLET}20`, borderRadius: 50, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: GREEN }} />
          <span style={{ color: GREEN, fontSize: 12, fontWeight: 600 }}>Online</span>
        </div>
      </div>

      {/* Quick prompts */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['Prioritize my tasks', 'Give me a productivity tip', 'Analyze my habits', 'Suggest a focus schedule'].map(p => (
          <button key={p} onClick={() => setAiInput(p)} style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${cardBorder}`, background: 'transparent', color: muted, fontSize: 12, cursor: 'pointer' }}>{p}</button>
        ))}
      </div>

      {/* Chat */}
      <div style={{ ...cardStyle, flex: 1, minHeight: 400, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, padding: 20 }}>
        {aiMessages.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: m.role === 'user' ? `${ACCENT}30` : `${VIOLET}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {m.role === 'user' ? <span style={{ fontSize: 14 }}>👤</span> : <Brain size={15} color={VIOLET} />}
            </div>
            <div style={{ maxWidth: '75%', background: m.role === 'user' ? `${ACCENT}15` : dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', borderRadius: m.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', padding: '12px 16px', border: `1px solid ${m.role === 'user' ? `${ACCENT}30` : cardBorder}` }}>
              <div style={{ color: text, fontSize: 13, lineHeight: 1.6 }}>{m.content}</div>
            </div>
          </div>
        ))}
        {aiLoading && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${VIOLET}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Brain size={15} color={VIOLET} /></div>
            <div style={{ padding: '12px 16px', background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', borderRadius: '4px 16px 16px 16px', border: `1px solid ${cardBorder}` }}>
              <div style={{ display: 'flex', gap: 5 }}>
                {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: VIOLET, animation: `bounce 1.2s ${i * 0.2}s infinite` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={aiEndRef} />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <input value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendAi()} placeholder="Ask your AI coach anything..." style={{ ...inputStyle, flex: 1 }} />
        <button onClick={sendAi} disabled={aiLoading} style={{ background: aiLoading ? muted : VIOLET, border: 'none', borderRadius: 10, padding: '10px 20px', color: '#fff', fontWeight: 600, cursor: aiLoading ? 'not-allowed' : 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Zap size={15} /> Send
        </button>
      </div>
    </div>
  );

  const VIEWS = { dashboard: renderDashboard, daily: renderDailyTasks, monthly: renderMonthlyTasks, habits: renderHabits, pomodoro: renderPomodoro, calendar: renderCalendar, notes: renderNotes, analytics: renderAnalytics, ai: renderAI };

  return (
    <div style={{ display: 'flex', height: '100vh', background: bg, fontFamily: "'Inter', -apple-system, sans-serif", overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(99,179,237,0.2); border-radius: 2px; }
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        input::placeholder, textarea::placeholder { color: #4a5568; }
      `}</style>

      {/* SIDEBAR */}
      <div style={{ width: 230, background: surface, borderRight: `1px solid ${cardBorder}`, display: 'flex', flexDirection: 'column', padding: '20px 12px', gap: 4, flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px 16px' }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(135deg, ${ACCENT}, ${VIOLET})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={16} color="#000" />
          </div>
          <span style={{ color: text, fontWeight: 700, fontSize: 16, letterSpacing: -0.3 }}>FlowPlan</span>
        </div>

        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: inputBg, border: `1px solid ${cardBorder}`, borderRadius: 10, padding: '8px 12px', marginBottom: 8 }}>
          <Search size={14} color={muted} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ background: 'transparent', border: 'none', outline: 'none', color: text, fontSize: 13, width: '100%' }} />
        </div>

        {/* Nav */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_ITEMS.map(item => {
            const active = view === item.id;
            return (
              <button key={item.id} onClick={() => setView(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, border: 'none', background: active ? navActive : 'transparent', color: active ? ACCENT : muted, cursor: 'pointer', fontSize: 13, fontWeight: active ? 600 : 400, width: '100%', textAlign: 'left', transition: 'all 0.15s' }}>
                <item.icon size={16} />
                {item.label}
                {item.id === 'ai' && <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: GREEN }} />}
              </button>
            );
          })}
        </div>

        {/* User + Theme */}
        <div style={{ borderTop: `1px solid ${cardBorder}`, paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={() => setDark(d => !d)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 10, border: 'none', background: 'transparent', color: muted, cursor: 'pointer', fontSize: 12 }}>
            {dark ? <Sun size={15} /> : <Moon size={15} />}
            {dark ? 'Light Mode' : 'Dark Mode'}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${VIOLET}, ${ACCENT})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>V</div>
            <div>
              <div style={{ color: text, fontSize: 13, fontWeight: 500 }}>Vanthan</div>
              <div style={{ color: muted, fontSize: 10 }}>vxnthn@gmail.com</div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        {VIEWS[view]?.()}
      </div>
    </div>
  );
}
