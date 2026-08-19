const goals = [
  {
    id: 'tech_mastery',
    title: 'Master cloud, Docker, deployment, and data science',
    type: 'checkbox',
    cadence: 'Daily',
    points: 18
  },
  {
    id: 'english',
    title: 'Improve English',
    type: 'checkbox',
    cadence: 'Daily',
    points: 10
  },
  {
    id: 'foreign_language',
    title: 'Learn Spanish or Dutch',
    type: 'checkbox',
    cadence: 'Daily',
    points: 12
  },
  {
    id: 'internships',
    title: 'Apply for internships',
    type: 'number',
    cadence: 'Daily (target: 5)',
    target: 5,
    pointsPerUnit: 6
  },
  {
    id: 'workout',
    title: 'Workout session',
    type: 'checkbox',
    cadence: 'Once every 2 days',
    points: 15,
    everyNDays: 2
  },
  {
    id: 'nutrition',
    title: 'Eat good food',
    type: 'checkbox',
    cadence: 'Daily',
    points: 10
  },
  {
    id: 'coffee_shop',
    title: 'Work in the coffee shop from 8:00 to 17:00',
    type: 'checkbox',
    cadence: 'Daily',
    points: 18
  }
];

const goodDayQuotes = [
  'Excellent consistency today. Be proud, then keep pushing tomorrow.',
  'You executed well today. Celebrate briefly, then continue the climb.',
  'Strong day. Keep this rhythm and double down on your focus.'
];

const badDayQuotes = [
  'Tough days happen. Reset, breathe, and start fresh tomorrow—don’t give up.',
  'Progress is never linear. Learn from today and show up again tomorrow.',
  'One hard day does not define you. Keep going, step by step.'
];

const milestoneQuotes = [
  'Milestone unlocked. Momentum is your superpower—protect it.',
  'You earned this checkpoint. Keep compounding your effort.',
  'Big win. Stay hungry and keep your standards high.'
];

const reminders = [
  { id: 'morning', time: '09:00', title: 'Start strong', body: 'Focus on cloud, Docker, deployment, and data science.' },
  { id: 'language', time: '11:30', title: 'Language block', body: 'Practice English and Spanish/Dutch for at least one focused session.' },
  { id: 'internships', time: '14:00', title: 'Internship push', body: 'Aim for 5 internship applications today.' },
  { id: 'fitness', time: '18:00', title: 'Health reminder', body: 'Check if workout and healthy food goals are completed.' },
  { id: 'reflection', time: '21:00', title: 'End-of-day reflection', body: 'Complete your day summary and keep your streak alive.' }
];

const todayKey = new Date().toISOString().slice(0, 10);
let state = { entries: {}, reminderLog: {}, celebratedMilestones: [] };

const goalsContainer = document.getElementById('goals');
const todayPointsEl = document.getElementById('todayPoints');
const todayTargetEl = document.getElementById('todayTarget');
const lifetimePointsEl = document.getElementById('lifetimePoints');
const milestonesEl = document.getElementById('milestones');
const milestoneQuoteEl = document.getElementById('milestoneQuote');
const endOfDayMessageEl = document.getElementById('endOfDayMessage');
const completeDayBtn = document.getElementById('completeDayBtn');

const getRandomQuote = (arr) => arr[Math.floor(Math.random() * arr.length)];

const formatDate = (date) => date.toISOString().slice(0, 10);

const isWorkoutDue = () => {
  const allDays = Object.keys(state.entries).sort();
  const lastWorkoutDay = allDays.reverse().find((day) => state.entries[day]?.workout === true);
  if (!lastWorkoutDay) {
    return true;
  }
  const lastDate = new Date(`${lastWorkoutDay}T00:00:00`);
  const diffMs = new Date(`${todayKey}T00:00:00`).getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays >= 2;
};

const currentEntry = () => {
  if (!state.entries[todayKey]) {
    state.entries[todayKey] = {
      tech_mastery: false,
      english: false,
      foreign_language: false,
      internships: 0,
      workout: false,
      nutrition: false,
      coffee_shop: false,
      endDayMessage: '',
      reflectedAt: null
    };
  }
  return state.entries[todayKey];
};

const targetPointsForToday = () => goals.reduce((sum, goal) => {
  if (goal.id === 'workout' && !isWorkoutDue()) {
    return sum;
  }
  if (goal.type === 'number') {
    return sum + goal.target * goal.pointsPerUnit;
  }
  return sum + goal.points;
}, 0);

const calculateTodayPoints = () => {
  const entry = currentEntry();
  return goals.reduce((sum, goal) => {
    if (goal.id === 'workout' && !isWorkoutDue()) {
      return sum;
    }

    if (goal.type === 'checkbox') {
      return sum + (entry[goal.id] ? goal.points : 0);
    }

    const value = Number(entry[goal.id] || 0);
    return sum + Math.min(value, goal.target) * goal.pointsPerUnit;
  }, 0);
};

const calculateLifetimePoints = () => {
  return Object.keys(state.entries).reduce((sum, date) => {
    const entry = state.entries[date];
    const dayPoints = goals.reduce((subtotal, goal) => {
      if (goal.id === 'workout') {
        const dateObj = new Date(`${date}T00:00:00`);
        const previous = new Date(dateObj);
        previous.setDate(previous.getDate() - 2);
        const prevKey = formatDate(previous);
        const workoutDue = !state.entries[prevKey]?.workout;
        if (!workoutDue) {
          return subtotal;
        }
      }

      if (goal.type === 'checkbox') {
        return subtotal + (entry[goal.id] ? goal.points : 0);
      }

      return subtotal + Math.min(Number(entry[goal.id] || 0), goal.target) * goal.pointsPerUnit;
    }, 0);
    return sum + dayPoints;
  }, 0);
};

const generatedMilestones = () => {
  const base = targetPointsForToday();
  return [
    { id: 'm1', label: '3-day momentum', threshold: base * 3 },
    { id: 'm2', label: '1-week consistency', threshold: base * 7 },
    { id: 'm3', label: '2-week discipline', threshold: base * 14 },
    { id: 'm4', label: '1-month transformation', threshold: base * 30 }
  ];
};

const saveState = async () => {
  await window.appApi.saveState(state);
};

const updateStats = () => {
  const todayPoints = calculateTodayPoints();
  const targetPoints = targetPointsForToday();
  const lifetimePoints = calculateLifetimePoints();

  todayPointsEl.textContent = String(todayPoints);
  todayTargetEl.textContent = String(targetPoints);
  lifetimePointsEl.textContent = String(lifetimePoints);

  const milestones = generatedMilestones();
  milestonesEl.innerHTML = '';

  milestones.forEach((milestone) => {
    const done = lifetimePoints >= milestone.threshold;
    const div = document.createElement('div');
    div.className = `milestone-item ${done ? 'done' : ''}`;
    div.innerHTML = `<strong>${milestone.label}</strong><div class="progress">${lifetimePoints}/${milestone.threshold} points</div>`;
    milestonesEl.appendChild(div);

    if (done && !state.celebratedMilestones.includes(milestone.id)) {
      state.celebratedMilestones.push(milestone.id);
      milestoneQuoteEl.textContent = getRandomQuote(milestoneQuotes);
      window.appApi.notify('Milestone achieved', milestoneQuoteEl.textContent);
    }
  });
};

const renderGoals = () => {
  const entry = currentEntry();
  goalsContainer.innerHTML = '';

  goals.forEach((goal) => {
    const wrap = document.createElement('div');
    wrap.className = 'goal-item';

    const dueSuffix = goal.id === 'workout' && !isWorkoutDue() ? ' (optional today)' : '';

    const top = document.createElement('div');
    top.className = 'goal-top';
    top.innerHTML = `<div><strong>${goal.title}${dueSuffix}</strong><small>${goal.cadence}</small></div>`;

    const controls = document.createElement('div');
    controls.className = 'goal-controls';

    if (goal.type === 'checkbox') {
      const label = document.createElement('label');
      label.innerHTML = `<input type="checkbox" ${entry[goal.id] ? 'checked' : ''}/> Done (+${goal.points})`;
      const input = label.querySelector('input');
      input.addEventListener('change', async (e) => {
        entry[goal.id] = e.target.checked;
        await saveState();
        updateStats();
      });
      controls.appendChild(label);
    } else {
      const label = document.createElement('label');
      label.textContent = `Applications submitted (0-${goal.target})`;
      const input = document.createElement('input');
      input.type = 'number';
      input.min = 0;
      input.max = goal.target;
      input.value = String(entry[goal.id] || 0);
      input.addEventListener('input', async (e) => {
        const numeric = Math.max(0, Number(e.target.value || 0));
        entry[goal.id] = numeric;
        await saveState();
        updateStats();
      });
      controls.appendChild(label);
      controls.appendChild(input);
    }

    wrap.appendChild(top);
    wrap.appendChild(controls);
    goalsContainer.appendChild(wrap);
  });
};

const runEndDayReflection = async (triggeredByScheduler = false) => {
  const entry = currentEntry();
  const todayPoints = calculateTodayPoints();
  const targetPoints = targetPointsForToday();
  const internshipDone = Number(entry.internships || 0) >= 5;
  const ratio = targetPoints === 0 ? 0 : todayPoints / targetPoints;
  const goodDay = ratio >= 0.7 && internshipDone;

  const quote = goodDay ? getRandomQuote(goodDayQuotes) : getRandomQuote(badDayQuotes);
  const message = goodDay
    ? `Great day (${todayPoints}/${targetPoints} points). ${quote}`
    : `Rough day (${todayPoints}/${targetPoints} points). ${quote}`;

  endOfDayMessageEl.textContent = message;
  entry.endDayMessage = message;
  entry.reflectedAt = new Date().toISOString();
  await saveState();

  if (triggeredByScheduler || !goodDay) {
    window.appApi.notify(goodDay ? 'Great work today' : 'Keep going', message);
  }
};

const scheduleNotifications = () => {
  const checkReminders = async () => {
    const now = new Date();
    const day = formatDate(now);
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (!state.reminderLog[day]) {
      state.reminderLog[day] = [];
    }

    for (const reminder of reminders) {
      if (currentTime === reminder.time && !state.reminderLog[day].includes(reminder.id)) {
        await window.appApi.notify(reminder.title, reminder.body);
        state.reminderLog[day].push(reminder.id);
      }
    }

    if (currentTime === '21:05') {
      const entry = currentEntry();
      if (!entry.reflectedAt || !entry.reflectedAt.startsWith(day)) {
        await runEndDayReflection(true);
      }
    }

    await saveState();
  };

  checkReminders();
  setInterval(checkReminders, 60 * 1000);
};

const hydrate = async () => {
  const loadedState = await window.appApi.loadState();
  state = {
    entries: loadedState.entries || {},
    reminderLog: loadedState.reminderLog || {},
    celebratedMilestones: loadedState.celebratedMilestones || []
  };

  currentEntry();
  renderGoals();
  updateStats();

  if (state.entries[todayKey]?.endDayMessage) {
    endOfDayMessageEl.textContent = state.entries[todayKey].endDayMessage;
  }

  completeDayBtn.addEventListener('click', () => runEndDayReflection(false));
  scheduleNotifications();
  await saveState();
};

hydrate();
