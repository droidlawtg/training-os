import { useState, useEffect } from "react";

// ─── THEME ────────────────────────────────────────────────────────────────────
const T = {
  teal: "#00E5CC",
  pink: "#FF2D78",
  gold: "#FFD700",
  white: "#F0F8FF",
  bg: "#0A0F1A",
  card: "#0E1628",
  card2: "#131E35",
  border: "#1A2B4A",
  muted: "#4A6080",
  font: "'Bebas Neue', 'Impact', sans-serif",
  body: "'Rajdhani', 'Trebuchet MS', sans-serif",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${T.bg}; color: ${T.white}; font-family: ${T.body}; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: ${T.bg}; }
  ::-webkit-scrollbar-thumb { background: ${T.teal}40; border-radius: 3px; }
  input, select, textarea { font-family: ${T.body}; }
  input[type=range] { accent-color: ${T.teal}; cursor: pointer; width: 100%; }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
  @keyframes slideIn { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform:translateY(0); } }
  .card { background: ${T.card}; border: 1px solid ${T.border}; border-radius: 14px; padding: 20px; animation: slideIn 0.3s ease; }
  .btn { cursor: pointer; border: none; border-radius: 8px; font-family: ${T.font}; font-size: 18px; letter-spacing: 1px; padding: 10px 24px; transition: all 0.2s; }
  .btn:hover { transform: translateY(-1px); filter: brightness(1.1); }
  .btn-teal { background: ${T.teal}; color: ${T.bg}; }
  .btn-pink { background: ${T.pink}; color: white; }
  .btn-ghost { background: transparent; color: ${T.teal}; border: 1px solid ${T.teal}40; }
  .inp { background: ${T.bg}; border: 1px solid ${T.border}; color: ${T.white}; border-radius: 8px; padding: 10px 14px; font-size: 15px; width: 100%; font-family: ${T.body}; }
  .inp:focus { outline: none; border-color: ${T.teal}; }
  .lbl { color: ${T.muted}; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; display: block; margin-bottom: 6px; margin-top: 14px; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
  .grid4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .tab-active { color: ${T.teal} !important; border-bottom: 2px solid ${T.teal} !important; }
  .badge { display: inline-block; padding: 3px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; letter-spacing: 1px; }
  .streak-fire { color: ${T.gold}; font-size: 20px; }
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const PROGRAM_START = new Date("2026-03-02T12:00:00");
const DAYS_ORDER = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

const SCHEDULE = [
  // Weeks 1-4
  { weeks:[1,2,3,4], day:"MON", track:"6-8 x 200m @ 40s (90s Rest)", hr:"170-180 BPM", gym:"LEGS A", nutrition:"Refeed (+400 cal)", phase:1 },
  { weeks:[1,2,3,4], day:"TUE", track:"25 min Boring Jog", hr:"130-145 BPM", gym:"PUSH A + PULL A", nutrition:"Baseline", phase:1 },
  { weeks:[1,2,3,4], day:"WED", track:"FULL REST (10k Steps)", hr:"< 110 BPM", gym:"REST", nutrition:"Baseline", phase:1 },
  { weeks:[1,2,3,4], day:"THU", track:"8x Bleachers + 2x300m @ 58s", hr:"175-185 BPM", gym:"LEGS B", nutrition:"Refeed (+400 cal)", phase:1 },
  { weeks:[1,2,3,4], day:"FRI", track:"25 min Boring Jog", hr:"130-145 BPM", gym:"PUSH B + PULL B", nutrition:"Baseline", phase:1 },
  { weeks:[1,2,3,4], day:"SAT", track:"35-40 min Walk/Jog", hr:"120-135 BPM", gym:"REST", nutrition:"Baseline", phase:1 },
  { weeks:[1,2,3,4], day:"SUN", track:"FULL REST", hr:"Resting HR", gym:"REST", nutrition:"Recovery", phase:1 },
  // Weeks 5-8
  { weeks:[5,6,7,8], day:"MON", track:"5 x 200m @ 34-35s (2m Rest)", hr:"180-185 BPM", gym:"LEGS A", nutrition:"Refeed (+400 cal)", phase:2 },
  { weeks:[5,6,7,8], day:"TUE", track:"30 min Boring Jog", hr:"130-145 BPM", gym:"PUSH A + PULL A", nutrition:"Baseline", phase:2 },
  { weeks:[5,6,7,8], day:"WED", track:"FULL REST", hr:"< 110 BPM", gym:"REST", nutrition:"Baseline", phase:2 },
  { weeks:[5,6,7,8], day:"THU", track:"10x Bleachers + 3x300m @ 52s", hr:"185-190 BPM", gym:"LEGS B", nutrition:"Refeed (+400 cal)", phase:2 },
  { weeks:[5,6,7,8], day:"FRI", track:"30 min Boring Jog", hr:"130-145 BPM", gym:"PUSH B + PULL B", nutrition:"Baseline", phase:2 },
  { weeks:[5,6,7,8], day:"SAT", track:"45 min Walk/Jog", hr:"120-135 BPM", gym:"REST", nutrition:"Baseline", phase:2 },
  { weeks:[5,6,7,8], day:"SUN", track:"FULL REST", hr:"Resting HR", gym:"REST", nutrition:"Recovery", phase:2 },
  // Weeks 9-11
  { weeks:[9,10,11], day:"MON", track:"3x200m @ 30s + 1x400m @ 62s", hr:"MAX", gym:"LEGS A", nutrition:"Refeed (+400 cal)", phase:3 },
  { weeks:[9,10,11], day:"TUE", track:"25 min Easy Jog", hr:"130-140 BPM", gym:"PUSH A + PULL A", nutrition:"Baseline", phase:3 },
  { weeks:[9,10,11], day:"WED", track:"FULL REST", hr:"< 110 BPM", gym:"REST", nutrition:"Baseline", phase:3 },
  { weeks:[9,10,11], day:"THU", track:"1x600m @ 1:50 + 2x300m @ 48s", hr:"MAX", gym:"LEGS B", nutrition:"Refeed (+400 cal)", phase:3 },
  { weeks:[9,10,11], day:"FRI", track:"25 min Easy Jog", hr:"130-140 BPM", gym:"PUSH B + PULL B", nutrition:"Baseline", phase:3 },
  { weeks:[9,10,11], day:"SAT", track:"30 min Easy Walk", hr:"< 120 BPM", gym:"REST", nutrition:"Baseline", phase:3 },
  { weeks:[9,10,11], day:"SUN", track:"MAY 10: TEST DAY 🏆", hr:"GOAL PACE", gym:"REST", nutrition:"VICTORY", phase:3 },
];

const PHASE_NAMES = { 1:"Phase 1: Capacity", 2:"Phase 2: Strength", 3:"Phase 3: Goal" };
const PHASE_COLORS = { 1: T.teal, 2: T.gold, 3: T.pink };

// Workout programs from uploaded files
const WORKOUT_PROGRAMS = {
  "Athletic PPL": {
    description: "Push/Pull/Legs — Athletic focus with barbells & dumbbells",
    workouts: {
      "Push A": [
        { exercise:"Flat DB Bench Press", sets:4, reps:"8-10", rest:"2m" },
        { exercise:"BB OHP (Accessory)", sets:3, reps:"10-12", rest:"90s" },
        { exercise:"Incline DB Bench Press", sets:3, reps:"10-12", rest:"90s" },
        { exercise:"Banded Lateral Raises", sets:3, reps:"15-20", rest:"60s" },
        { exercise:"DB Skullcrushers", sets:3, reps:"12-15", rest:"60s" },
      ],
      "Pull A": [
        { exercise:"Weighted Pull-ups", sets:3, reps:"6-8", rest:"2m" },
        { exercise:"Barbell Overhand Row", sets:4, reps:"8-10", rest:"90s" },
        { exercise:"DB Shrugs", sets:3, reps:"12-15", rest:"60s" },
        { exercise:"Barbell Curls", sets:3, reps:"10-12", rest:"60s" },
        { exercise:"Banded Face Pulls", sets:3, reps:"20", rest:"60s" },
      ],
      "Legs A": [
        { exercise:"Barbell Back Squat", sets:3, reps:"6-8", rest:"3m" },
        { exercise:"Barbell RDL", sets:3, reps:"8-10", rest:"2m" },
        { exercise:"DB Walking Lunges", sets:3, reps:"12/leg", rest:"90s" },
        { exercise:"Banded Leg Curls", sets:3, reps:"20", rest:"60s" },
      ],
      "Push B": [
        { exercise:"Barbell OHP (Heavy)", sets:4, reps:"5-8", rest:"3m" },
        { exercise:"DB Floor Press", sets:3, reps:"10-12", rest:"90s" },
        { exercise:"Banded Push-ups", sets:3, reps:"AMRAP", rest:"60s" },
        { exercise:"Banded Lateral Raises", sets:3, reps:"15-20", rest:"60s" },
        { exercise:"DB 1-Arm Overhead Ext.", sets:3, reps:"12", rest:"60s" },
      ],
      "Pull B": [
        { exercise:"Barbell Pendlay Row", sets:4, reps:"6-8", rest:"2m" },
        { exercise:"BW Pull-ups", sets:3, reps:"AMRAP", rest:"90s" },
        { exercise:"DB Shrugs", sets:3, reps:"15-20", rest:"60s" },
        { exercise:"DB Hammer Curls", sets:3, reps:"10-12", rest:"60s" },
        { exercise:"Banded Pull-Aparts", sets:1, reps:"100 reps", rest:"--" },
      ],
      "Legs B": [
        { exercise:"Barbell Front Squat", sets:3, reps:"8-10", rest:"3m" },
        { exercise:"Bulgarian Split Squats", sets:3, reps:"10-12/leg", rest:"90s" },
        { exercise:"DB Romanian Deadlift", sets:3, reps:"12-15", rest:"90s" },
        { exercise:"DB Goblet Squat", sets:2, reps:"20", rest:"60s" },
      ],
    }
  },
  "Texas Method": {
    description: "Strength-focused 3-day linear progression",
    workouts: {
      "Day 1 — Volume": [
        { exercise:"Squat", sets:5, reps:"5 @ 90% 5RM", rest:"3m" },
        { exercise:"Bench Press / OH Press", sets:5, reps:"5 @ 90% 5RM", rest:"2m" },
        { exercise:"Deadlift", sets:1, reps:"5 @ 90% 5RM", rest:"5m" },
      ],
      "Day 2 — Recovery": [
        { exercise:"Squat", sets:2, reps:"5 @ 80% Day1", rest:"2m" },
        { exercise:"Overhead Press / Bench", sets:3, reps:"5 @ 90% Day1", rest:"2m" },
        { exercise:"Chin Up", sets:3, reps:"BW × AMRAP", rest:"2m" },
        { exercise:"Glute Work", sets:5, reps:"10", rest:"60s" },
      ],
      "Day 3 — Intensity": [
        { exercise:"Squat", sets:1, reps:"New 5RM PR", rest:"5m" },
        { exercise:"Bench Press", sets:1, reps:"New 5RM PR", rest:"5m" },
        { exercise:"Power Clean", sets:5, reps:"3 (or 6×2)", rest:"2m" },
      ],
    }
  },
  "AJAC 5×10": {
    description: "Beginner dumbbell program — 3 days/week alternating A/B",
    workouts: {
      "Workout A": [
        { exercise:"DB Goblet Squat", sets:5, reps:"10", rest:"2m" },
        { exercise:"DB Flat Bench Press", sets:5, reps:"10", rest:"2m" },
        { exercise:"1-Arm DB Row", sets:5, reps:"10/side", rest:"90s" },
      ],
      "Workout B": [
        { exercise:"DB Goblet Squat", sets:5, reps:"10", rest:"2m" },
        { exercise:"DB Shoulder Press", sets:5, reps:"10", rest:"2m" },
        { exercise:"DB Romanian Deadlift", sets:5, reps:"10", rest:"90s" },
      ],
    }
  },
  "AJAC PPL": {
    description: "Push/Pull/Legs — 4 days/week intermediate program",
    workouts: {
      "Push Day": [
        { exercise:"Low Incline BB Bench Press", sets:2, reps:"6-8", rest:"3m" },
        { exercise:"Flat Dumbbell Press", sets:4, reps:"15/12/10/8", rest:"2m" },
        { exercise:"Dips", sets:2, reps:"To Failure", rest:"2m" },
        { exercise:"1-Arm DB Lateral Raise", sets:3, reps:"10-15", rest:"60s" },
        { exercise:"DB Posterior Delt Raise", sets:3, reps:"20-25", rest:"60s" },
        { exercise:"Cable Pushdowns", sets:4, reps:"30/20/15/10", rest:"90s" },
      ],
      "Pull Day": [
        { exercise:"Wide Grip Upper Back Pulldown", sets:2, reps:"8-15", rest:"2m" },
        { exercise:"Neutral Grip Chin-up", sets:2, reps:"AMRAP", rest:"2m" },
        { exercise:"Moderate Grip Seated Row", sets:2, reps:"8-12", rest:"90s" },
        { exercise:"Bodyweight Inverted Row", sets:2, reps:"AMRAP", rest:"90s" },
        { exercise:"Stiff Leg DB Deadlift + Shrug", sets:2, reps:"20-25", rest:"90s" },
        { exercise:"Alternating DB Curl", sets:2, reps:"12-15", rest:"60s" },
        { exercise:"Alternating DB Hammer Curl", sets:2, reps:"15-20", rest:"60s" },
        { exercise:"EZ Bar Curl", sets:2, reps:"8-10", rest:"60s" },
      ],
      "Legs Day": [
        { exercise:"Seated Leg Curls", sets:4, reps:"8-12", rest:"90s" },
        { exercise:"ATG Split Squat", sets:8, reps:"5", rest:"90s" },
        { exercise:"VMO Goblet Squat (Heels Elevated)", sets:3, reps:"20", rest:"2m" },
        { exercise:"Stiff Leg BB Deadlifts", sets:2, reps:"8-12", rest:"3m" },
        { exercise:"Single Leg Calf Raise", sets:4, reps:"5-10", rest:"60s" },
        { exercise:"Seated Calf Raises", sets:3, reps:"10-15", rest:"60s" },
      ],
    }
  },
  "Home Workout": {
    description: "Home-based full body — Chest, Back, Legs, Shoulders, Arms",
    workouts: {
      "Chest & Back": [
        { exercise:"Flat DB Bench", sets:3, reps:"8-12", rest:"90s" },
        { exercise:"Incline Bench", sets:3, reps:"10", rest:"90s" },
        { exercise:"DB Fly", sets:3, reps:"10", rest:"60s" },
        { exercise:"NRW DB Bench", sets:3, reps:"8-12", rest:"90s" },
        { exercise:"Deadlift + Shrug", sets:2, reps:"20-25", rest:"90s" },
        { exercise:"Single Arm Row", sets:3, reps:"10", rest:"60s" },
        { exercise:"Lat Pulls / Pull-up", sets:3, reps:"10", rest:"90s" },
        { exercise:"Bodyweight Row", sets:3, reps:"AMRAP", rest:"60s" },
      ],
      "Legs": [
        { exercise:"Nordic Curl", sets:4, reps:"3-6", rest:"2m" },
        { exercise:"Calf Raises", sets:3, reps:"15", rest:"60s" },
        { exercise:"Bulgarian Squat", sets:8, reps:"5", rest:"90s" },
        { exercise:"Squat", sets:4, reps:"10", rest:"2m" },
        { exercise:"Stiff DL + Shrug", sets:3, reps:"5-8", rest:"2m" },
        { exercise:"OHP", sets:3, reps:"10", rest:"90s" },
        { exercise:"Shoulder Press", sets:3, reps:"10", rest:"90s" },
        { exercise:"Lateral Raise", sets:3, reps:"10-15", rest:"60s" },
        { exercise:"Delt Raises", sets:3, reps:"20-25", rest:"60s" },
      ],
      "Arms & Abs": [
        { exercise:"Alt. DB Curl", sets:3, reps:"10", rest:"60s" },
        { exercise:"Lying Tri Extension", sets:3, reps:"10", rest:"60s" },
        { exercise:"Hammer Curl", sets:3, reps:"10", rest:"60s" },
        { exercise:"Tri Pulldown", sets:3, reps:"10", rest:"60s" },
        { exercise:"Close Push-up", sets:3, reps:"10", rest:"60s" },
        { exercise:"Pronated Curl", sets:3, reps:"10", rest:"60s" },
        { exercise:"Chin-up", sets:3, reps:"AMRAP", rest:"90s" },
        { exercise:"Crunch", sets:3, reps:"10", rest:"30s" },
        { exercise:"Leg Raise", sets:3, reps:"10", rest:"30s" },
        { exercise:"Side Plank", sets:2, reps:"30s", rest:"30s" },
        { exercise:"Plank", sets:2, reps:"30s", rest:"30s" },
      ],
    }
  },
  "Old School Chest/Tri": {
    description: "Superset-based Chest/Tri + Back/Bi split with Legs",
    workouts: {
      "Chest / Tri": [
        { exercise:"Flat Bench 5×5", sets:5, reps:"5", rest:"3m" },
        { exercise:"Push-Ups", sets:3, reps:"AMRAP", rest:"60s" },
        { exercise:"DB Fly", sets:4, reps:"10", rest:"90s" },
        { exercise:"NR Grip Bench", sets:4, reps:"8-10", rest:"90s" },
        { exercise:"Decline Push-up", sets:3, reps:"AMRAP", rest:"60s" },
        { exercise:"Close-Grip DB Chest Press", sets:4, reps:"10", rest:"90s" },
        { exercise:"Arnold Press 5/5", sets:4, reps:"5/5", rest:"90s" },
        { exercise:"Svend Press", sets:3, reps:"10-12", rest:"60s" },
        { exercise:"Chest Fly Band", sets:4, reps:"15", rest:"60s" },
      ],
      "Back / Bi": [
        { exercise:"BB Deadlift 5×5", sets:5, reps:"5", rest:"3m" },
        { exercise:"T-Bar Row", sets:4, reps:"8-10", rest:"2m" },
        { exercise:"DB Shrug", sets:4, reps:"12-15", rest:"60s" },
        { exercise:"Single Arm Row", sets:4, reps:"10", rest:"90s" },
        { exercise:"Lat Pulldown", sets:4, reps:"10-12", rest:"90s" },
        { exercise:"Reverse Fly", sets:3, reps:"15", rest:"60s" },
        { exercise:"Z-Bar Curl", sets:2, reps:"10-12", rest:"60s" },
        { exercise:"Skull Crusher", sets:3, reps:"10", rest:"60s" },
        { exercise:"Hammer Curl", sets:2, reps:"10", rest:"60s" },
        { exercise:"Pulldown Tri", sets:2, reps:"12", rest:"60s" },
        { exercise:"Rope Curls", sets:2, reps:"12", rest:"60s" },
      ],
      "Legs": [
        { exercise:"Squat 5×5", sets:5, reps:"5", rest:"3m" },
        { exercise:"Single Leg DB DL", sets:4, reps:"8-10/leg", rest:"90s" },
        { exercise:"Shoulder Press (Barbell)", sets:3, reps:"8-10", rest:"2m" },
        { exercise:"Face Pull", sets:3, reps:"15-20", rest:"60s" },
        { exercise:"Front Squat", sets:4, reps:"8-10", rest:"2m" },
        { exercise:"Calf Raises", sets:4, reps:"15", rest:"60s" },
        { exercise:"Lateral Raise", sets:3, reps:"12-15", rest:"60s" },
        { exercise:"Hamstring Curl / Nordic", sets:3, reps:"8-10", rest:"90s" },
        { exercise:"Walking Lunges", sets:4, reps:"12/leg", rest:"90s" },
        { exercise:"Upright Row", sets:3, reps:"10-12", rest:"60s" },
      ],
    }
  },
};

// ─── COMMON FOODS DB ─────────────────────────────────────────────────────────
const FOOD_DB = [
  { name:"Chicken Breast (6oz)", cal:180, protein:38, carbs:0, fat:4 },
  { name:"Ground Beef 80/20 (6oz)", cal:426, protein:30, carbs:0, fat:34 },
  { name:"Beef Sirloin (8oz)", cal:371, protein:41, carbs:0, fat:23 },
  { name:"Salmon (6oz)", cal:350, protein:34, carbs:0, fat:22 },
  { name:"Eggs (2 large)", cal:140, protein:12, carbs:1, fat:10 },
  { name:"Whole Eggs (4)", cal:280, protein:24, carbs:2, fat:20 },
  { name:"Egg Whites (1 cup)", cal:120, protein:26, carbs:2, fat:0 },
  { name:"Whey Isolate (50g)", cal:190, protein:46, carbs:2, fat:1 },
  { name:"Greek Yogurt (1 cup)", cal:170, protein:17, carbs:6, fat:9 },
  { name:"Cottage Cheese (1 cup)", cal:220, protein:25, carbs:8, fat:10 },
  { name:"Tuna Can (5oz)", cal:130, protein:30, carbs:0, fat:1 },
  { name:"Shrimp (6oz)", cal:168, protein:36, carbs:2, fat:2 },
  { name:"White Rice (1 cup cooked)", cal:242, protein:4, carbs:53, fat:0 },
  { name:"Brown Rice (1 cup cooked)", cal:215, protein:5, carbs:45, fat:2 },
  { name:"Sweet Potato (medium)", cal:103, protein:2, carbs:24, fat:0 },
  { name:"Oats (1 cup)", cal:307, protein:11, carbs:55, fat:5 },
  { name:"Banana (medium)", cal:105, protein:1, carbs:27, fat:0 },
  { name:"Apple (medium)", cal:95, protein:0, carbs:25, fat:0 },
  { name:"Blueberries (1 cup)", cal:84, protein:1, carbs:21, fat:0 },
  { name:"Avocado (half)", cal:120, protein:1, carbs:6, fat:11 },
  { name:"Olive Oil (1 tbsp)", cal:126, protein:0, carbs:0, fat:14 },
  { name:"Peanut Butter (2 tbsp)", cal:188, protein:8, carbs:6, fat:16 },
  { name:"Almonds (1oz)", cal:164, protein:6, carbs:6, fat:14 },
  { name:"Whole Milk (1 cup)", cal:149, protein:8, carbs:12, fat:8 },
  { name:"Mixed Greens (2 cups)", cal:10, protein:1, carbs:2, fat:0 },
  { name:"Broccoli (1 cup)", cal:31, protein:3, carbs:6, fat:0 },
  { name:"Protein Bar (generic)", cal:200, protein:20, carbs:22, fat:7 },
];

// ─── UTILS ───────────────────────────────────────────────────────────────────
function dk(date = new Date()) {
  return date.toISOString().split("T")[0];
}

function getWeekInfo(date = new Date(), startDate = PROGRAM_START) {
  const start = new Date(startDate); start.setHours(0,0,0,0);
  const d = new Date(date); d.setHours(0,0,0,0);
  const diff = Math.floor((d - start) / 86400000);
  if (diff < 0 || diff >= 77) return null;
  return {
    weekNum: Math.floor(diff / 7) + 1,
    dayName: DAYS_ORDER[d.getDay()],
  };
}

function getTodayWorkout(date = new Date(), startDate = PROGRAM_START) {
  const info = getWeekInfo(date, startDate);
  if (!info) return null;
  return SCHEDULE.find(s => s.weeks.includes(info.weekNum) && s.day === info.dayName) || null;
}

function lsGet(key, def = null) {
  try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : def; } catch { return def; }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ─── MINI COMPONENTS ─────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="card" style={{ borderColor: color + "30" }}>
      <div style={{ color: T.muted, fontSize: 11, letterSpacing: 1.5, fontWeight: 700, marginBottom: 6 }}>{icon} {label}</div>
      <div style={{ color, fontWeight: 700, fontSize: 18, lineHeight: 1.2 }}>{value}</div>
      {sub && <div style={{ color: T.muted, fontSize: 12, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function MacroBar({ label, current, target, color }) {
  const pct = Math.min(100, (current / target) * 100);
  const over = current > target;
  return (
    <div className="card" style={{ borderColor: (over ? T.pink : color) + "30" }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom: 6 }}>
        <span style={{ color: T.muted, fontSize: 12, fontWeight: 700 }}>{label}</span>
        <span style={{ color: over ? T.pink : color, fontWeight: 700, fontSize: 13 }}>{Math.round(current)}</span>
      </div>
      <div style={{ background: T.border, borderRadius: 4, height: 6 }}>
        <div style={{ background: over ? T.pink : color, height: "100%", borderRadius: 4, width: pct + "%", transition:"width 0.4s" }} />
      </div>
      <div style={{ color: T.muted, fontSize: 11, marginTop: 4 }}>/ {target}</div>
    </div>
  );
}

// ─── TAB: TODAY ───────────────────────────────────────────────────────────────
function TodayTab({ startDate }) {
  const today = new Date();
  const info = getWeekInfo(today, startDate);
  const workout = getTodayWorkout(today, startDate);
  const todayKey = dk(today);

  const [log, setLog] = useState(() => lsGet("log_" + todayKey, ""));
  const [hitGoal, setHitGoal] = useState(() => lsGet("goal_" + todayKey, null));
  const [saved, setSaved] = useState(false);
  const [streak, setStreak] = useState(0);

  // Calculate streak
  useEffect(() => {
    let s = 0;
    let d = new Date(today);
    for (let i = 0; i < 77; i++) {
      d.setDate(d.getDate() - 1);
      const k = dk(d);
      const logged = lsGet("log_" + k, "");
      if (logged && logged.trim()) s++;
      else break;
    }
    setStreak(s);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today]);

  const prevSameWorkout = (() => {
    if (!info) return null;
    for (let w = info.weekNum - 1; w >= 1; w--) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + (w - 1) * 7 + DAYS_ORDER.indexOf(info.dayName) - DAYS_ORDER.indexOf("MON"));
      const k = dk(d);
      const prev = lsGet("log_" + k, "");
      if (prev) return { weekNum: w, log: prev };
    }
    return null;
  })();

  function save() {
    lsSet("log_" + todayKey, log);
    if (hitGoal !== null) lsSet("goal_" + todayKey, hitGoal);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const phase = workout?.phase;
  const phaseColor = phase ? PHASE_COLORS[phase] : T.teal;

  return (
    <div style={{ maxWidth: 740, margin:"0 auto", animation:"slideIn 0.3s ease" }}>
      {/* Header bar */}
      <div className="card" style={{ marginBottom: 16, borderColor: phaseColor + "50", display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap: 12, alignItems:"center" }}>
        <div>
          <div style={{ fontFamily: T.font, fontSize: 28, color: T.white, letterSpacing: 2 }}>
            {today.toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" })}
          </div>
          {info && <div style={{ color: T.muted, fontSize: 13 }}>Week {info.weekNum} of 11 · {PHASE_NAMES[phase]}</div>}
        </div>
        <div style={{ display:"flex", gap: 16, alignItems:"center" }}>
          {streak > 0 && <div style={{ textAlign:"center" }}>
            <div className="streak-fire">🔥 {streak}</div>
            <div style={{ color: T.muted, fontSize: 11 }}>DAY STREAK</div>
          </div>}
          {phase && <span className="badge" style={{ background: phaseColor + "20", color: phaseColor, border:`1px solid ${phaseColor}40` }}>{PHASE_NAMES[phase]}</span>}
        </div>
      </div>

      {!workout ? (
        <div className="card" style={{ textAlign:"center", padding: 48, color: T.muted }}>
          <div style={{ fontFamily: T.font, fontSize: 40, color: T.teal, marginBottom: 12 }}>PROGRAM STARTS MARCH 2</div>
          Get ready. It's time to build. 🏄
        </div>
      ) : (
        <>
          <div className="grid2" style={{ marginBottom: 14 }}>
            <StatCard icon="🏃" label="Track / Cardio" value={workout.track} sub={workout.hr} color={T.teal} />
            <StatCard icon="🏋️" label="Gym Workout" value={workout.gym} sub="" color={T.gold} />
          </div>
          <div className="grid2" style={{ marginBottom: 14 }}>
            <StatCard icon="❤️" label="HR Target" value={workout.hr} sub="" color={T.pink} />
            <StatCard icon="🥗" label="Nutrition Today" value={workout.nutrition} sub="" color="#00FF88" />
          </div>

          {/* Goal toggle */}
          <div className="card" style={{ marginBottom: 14 }}>
            <div style={{ color: T.muted, fontSize: 12, letterSpacing: 1.5, fontWeight: 700, marginBottom: 12 }}>DID YOU HIT YOUR GOAL?</div>
            <div style={{ display:"flex", gap: 10 }}>
              {[["✅ YES", "yes", T.teal], ["⚡ PARTIAL", "partial", T.gold], ["❌ NO", "no", T.pink]].map(([lbl, val, col]) => (
                <button key={val} className="btn" onClick={() => setHitGoal(val)}
                  style={{ flex: 1, background: hitGoal === val ? col : T.border, color: hitGoal === val ? T.bg : T.muted, fontSize: 14 }}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          {/* Log */}
          <div className="card" style={{ marginBottom: 14 }}>
            <div style={{ color: T.muted, fontSize: 12, letterSpacing: 1.5, fontWeight: 700, marginBottom: 10 }}>📝 WORKOUT LOG</div>
            <textarea value={log} onChange={e => setLog(e.target.value)}
              placeholder="Log your splits, reps, weights, how you felt..."
              className="inp" style={{ minHeight: 100, resize:"vertical" }} />
            <div style={{ display:"flex", gap: 10, marginTop: 10 }}>
              <button className="btn btn-teal" onClick={save} style={{ flex: 1, fontSize: 20 }}>{saved ? "✓ SAVED!" : "SAVE LOG"}</button>
            </div>
          </div>

          {/* Previous same workout */}
          {prevSameWorkout && (
            <div className="card" style={{ borderColor: T.teal + "20" }}>
              <div style={{ color: T.muted, fontSize: 12, letterSpacing: 1.5, fontWeight: 700, marginBottom: 8 }}>📋 LAST TIME YOU DID THIS (Week {prevSameWorkout.weekNum})</div>
              <div style={{ color: T.white, fontSize: 14, whiteSpace:"pre-wrap", opacity: 0.8 }}>{prevSameWorkout.log}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── TAB: SCHEDULE ────────────────────────────────────────────────────────────
function ScheduleTab() {
  const weeks = Array.from({length:11}, (_,i) => i+1);
  const days = ["MON","TUE","WED","THU","FRI","SAT","SUN"];
  return (
    <div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize: 12, minWidth: 900 }}>
        <thead>
          <tr style={{ background: T.card }}>
            <th style={{ padding:"10px 12px", color: T.muted, textAlign:"left", borderBottom:`1px solid ${T.border}`, fontFamily: T.font, letterSpacing:1 }}>WK</th>
            <th style={{ padding:"10px 12px", color: T.muted, textAlign:"left", borderBottom:`1px solid ${T.border}`, fontFamily: T.font, letterSpacing:1 }}>PHASE</th>
            {days.map(d => <th key={d} style={{ padding:"10px 12px", color: T.teal, textAlign:"left", borderBottom:`1px solid ${T.border}`, fontFamily: T.font, letterSpacing:1 }}>{d}</th>)}
          </tr>
        </thead>
        <tbody>
          {weeks.map(w => {
            const ph = w <= 4 ? 1 : w <= 8 ? 2 : 3;
            const col = PHASE_COLORS[ph];
            return (
              <tr key={w} style={{ background: w % 2 === 0 ? T.card : T.bg, transition:"background 0.2s" }}>
                <td style={{ padding:"10px 12px", color: T.white, fontFamily: T.font, fontSize: 16, borderBottom:`1px solid ${T.border}` }}>{w}</td>
                <td style={{ padding:"10px 12px", borderBottom:`1px solid ${T.border}` }}>
                  <span style={{ color: col, fontSize: 11, fontWeight: 700 }}>{PHASE_NAMES[ph].split(": ")[1]}</span>
                </td>
                {days.map(d => {
                  const row = SCHEDULE.find(s => s.weeks.includes(w) && s.day === d);
                  if (!row) return <td key={d} style={{ padding:"10px 12px", color: T.muted, borderBottom:`1px solid ${T.border}` }}>—</td>;
                  return (
                    <td key={d} style={{ padding:"10px 12px", borderBottom:`1px solid ${T.border}` }}>
                      <div style={{ color: T.teal, fontSize: 11 }}>{row.track}</div>
                      {row.gym !== "REST" && <div style={{ color: T.gold, fontSize: 11, marginTop: 2 }}>{row.gym}</div>}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── TAB: WEIGHT ROOM ─────────────────────────────────────────────────────────
const ALL_LIFTS = [
  "Back Squat","Front Squat","Zercher Squat","Romanian Deadlift","Conventional Deadlift",
  "Sumo Deadlift","Power Clean","Bench Press","Incline Bench Press","Close-Grip Bench",
  "Overhead Press","DB Shoulder Press","DB Bench Press","Barbell Row","Pendlay Row",
  "T-Bar Row","Pull-Up","Chin-Up","Dumbbell Row","Cable Row","Lat Pulldown",
  "Bulgarian Split Squat","Leg Press","Hack Squat","Dips","Lateral Raise",
  "Face Pull","Skull Crusher","Tricep Pushdown","Barbell Curl","Hammer Curl","EZ Bar Curl",
];

function WeightRoomTab() {
  const [activeSection, setActiveSection] = useState("calculator");
  // Calculator
  const [lift, setLift] = useState("Back Squat");
  const [max, setMax] = useState("");
  const [pct, setPct] = useState(80);
  // 1RM history
  const [maxHistory, setMaxHistory] = useState(() => lsGet("maxHistory", {}));
  // Active workout builder
  const [selectedProgram, setSelectedProgram] = useState("Athletic PPL");
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [workoutLog, setWorkoutLog] = useState({});

  const calculated = max ? Math.round(parseFloat(max) * pct / 100) : null;
  const warmupSets = max ? [40, 55, 70, 85].map(p => ({ pct: p, weight: Math.round(parseFloat(max) * p / 100) })) : [];

  function save1RM() {
    if (!max) return;
    const hist = { ...maxHistory, [lift]: [...(maxHistory[lift] || []), { date: dk(), weight: parseFloat(max) }] };
    setMaxHistory(hist);
    lsSet("maxHistory", hist);
  }

  function toggleWorkout(name) {
    setSelectedWorkouts(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  }

  function startWorkout(name) {
    setActiveWorkout({ name, exercises: WORKOUT_PROGRAMS[selectedProgram].workouts[name] });
    setWorkoutLog({});
    setActiveSection("active");
  }

  function logSet(exerciseIdx, setIdx, field, value) {
    const key = `${exerciseIdx}-${setIdx}-${field}`;
    setWorkoutLog(prev => ({ ...prev, [key]: value }));
  }

  function saveWorkout() {
    if (!activeWorkout) return;
    const saved = lsGet("workoutHistory", []);
    saved.unshift({ date: dk(), name: activeWorkout.name, log: workoutLog, program: selectedProgram });
    lsSet("workoutHistory", saved.slice(0, 50));
    setActiveWorkout(null);
    setActiveSection("builder");
  }

  return (
    <div style={{ maxWidth: 800, margin:"0 auto" }}>
      {/* Sub-nav */}
      <div style={{ display:"flex", gap: 4, marginBottom: 20, background: T.card, borderRadius: 10, padding: 4 }}>
        {[["calculator","📊 Calculator"], ["builder","🗂 Programs"], ["history","📈 1RM History"]].map(([id, lbl]) => (
          <button key={id} onClick={() => { setActiveSection(id); setActiveWorkout(null); }}
            style={{ flex: 1, background: activeSection === id ? T.teal : "transparent", color: activeSection === id ? T.bg : T.muted,
              border:"none", borderRadius: 8, padding:"10px 0", cursor:"pointer", fontFamily: T.font, fontSize: 16, letterSpacing: 1, transition:"all 0.2s" }}>
            {lbl}
          </button>
        ))}
      </div>

      {/* Calculator */}
      {activeSection === "calculator" && (
        <div className="card">
          <div style={{ fontFamily: T.font, fontSize: 28, color: T.teal, letterSpacing: 2, marginBottom: 20 }}>1RM CALCULATOR</div>
          <label className="lbl">Select Lift</label>
          <select value={lift} onChange={e => setLift(e.target.value)} className="inp">
            {ALL_LIFTS.map(l => <option key={l}>{l}</option>)}
          </select>
          <label className="lbl">1-Rep Max (lbs)</label>
          <input type="number" value={max} onChange={e => setMax(e.target.value)} placeholder="e.g. 225" className="inp" />
          <label className="lbl">Percentage: <span style={{ color: T.teal, fontFamily: T.font, fontSize: 22 }}>{pct}%</span></label>
          <input type="range" min={50} max={100} value={pct} onChange={e => setPct(parseInt(e.target.value))} style={{ marginBottom: 12 }} />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap: 6, marginBottom: 20 }}>
            {[60,65,70,75,80,85,90,95,100].map(p => (
              <button key={p} onClick={() => setPct(p)}
                style={{ background: pct === p ? T.teal : T.border, color: pct === p ? T.bg : T.muted,
                  border:"none", borderRadius: 6, padding:"8px 0", cursor:"pointer", fontFamily: T.font, fontSize: 15, transition:"all 0.2s" }}>
                {p}%
              </button>
            ))}
          </div>
          {calculated !== null && (
            <>
              <div style={{ background:`linear-gradient(135deg, ${T.teal}15, ${T.pink}10)`, border:`1px solid ${T.teal}30`,
                borderRadius: 12, padding: 24, textAlign:"center", marginBottom: 16 }}>
                <div style={{ color: T.muted, fontSize: 13, marginBottom: 4 }}>{lift} @ {pct}%</div>
                <div style={{ fontFamily: T.font, color: T.teal, fontSize: 64, letterSpacing: -2 }}>{calculated}</div>
                <div style={{ color: T.muted }}>lbs</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ color: T.muted, fontSize: 12, letterSpacing: 1.5, fontWeight: 700, marginBottom: 8 }}>🔥 WARM-UP RAMP</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap: 8 }}>
                  {warmupSets.map(s => (
                    <div key={s.pct} style={{ background: T.card2, borderRadius: 8, padding: 12, textAlign:"center", border:`1px solid ${T.border}` }}>
                      <div style={{ color: T.muted, fontSize: 11 }}>{s.pct}%</div>
                      <div style={{ fontFamily: T.font, color: T.gold, fontSize: 22 }}>{s.weight}</div>
                      <div style={{ color: T.muted, fontSize: 11 }}>lbs</div>
                    </div>
                  ))}
                </div>
              </div>
              <button className="btn btn-ghost" onClick={save1RM} style={{ width:"100%" }}>💾 Save This 1RM</button>
            </>
          )}
        </div>
      )}

      {/* Programs / Builder */}
      {activeSection === "builder" && !activeWorkout && (
        <div>
          <label className="lbl">Select Program</label>
          <select value={selectedProgram} onChange={e => { setSelectedProgram(e.target.value); setSelectedWorkouts([]); }} className="inp" style={{ marginBottom: 16 }}>
            {Object.keys(WORKOUT_PROGRAMS).map(p => <option key={p}>{p}</option>)}
          </select>
          <div style={{ color: T.muted, fontSize: 13, marginBottom: 16 }}>{WORKOUT_PROGRAMS[selectedProgram].description}</div>
          <div style={{ fontFamily: T.font, color: T.teal, fontSize: 20, letterSpacing: 1, marginBottom: 12 }}>WORKOUTS</div>
          {Object.entries(WORKOUT_PROGRAMS[selectedProgram].workouts).map(([name, exercises]) => (
            <div key={name} className="card" style={{ marginBottom: 12, borderColor: selectedWorkouts.includes(name) ? T.teal + "50" : T.border }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: 8 }}>
                <div style={{ fontFamily: T.font, fontSize: 20, color: T.white, letterSpacing: 1 }}>{name}</div>
                <div style={{ display:"flex", gap: 8 }}>
                  <button className="btn btn-teal" style={{ fontSize: 14, padding:"6px 16px" }} onClick={() => startWorkout(name)}>START</button>
                  <button className="btn" onClick={() => toggleWorkout(name)}
                    style={{ fontSize: 14, padding:"6px 16px", background: selectedWorkouts.includes(name) ? T.gold : T.border, color: selectedWorkouts.includes(name) ? T.bg : T.muted }}>
                    {selectedWorkouts.includes(name) ? "✓ QUEUED" : "QUEUE"}
                  </button>
                </div>
              </div>
              <div style={{ color: T.muted, fontSize: 13 }}>{exercises.length} exercises</div>
              <div style={{ marginTop: 8, display:"flex", flexWrap:"wrap", gap: 4 }}>
                {exercises.map(e => <span key={e.exercise} style={{ background: T.border, color: T.muted, borderRadius: 4, padding:"2px 8px", fontSize: 11 }}>{e.exercise}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active Workout Logger */}
      {activeSection === "active" && activeWorkout && (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: 16 }}>
            <div style={{ fontFamily: T.font, fontSize: 28, color: T.teal, letterSpacing: 2 }}>{activeWorkout.name}</div>
            <div style={{ display:"flex", gap: 8 }}>
              <button className="btn btn-teal" onClick={saveWorkout}>SAVE WORKOUT</button>
              <button className="btn btn-ghost" onClick={() => { setActiveWorkout(null); setActiveSection("builder"); }}>CANCEL</button>
            </div>
          </div>
          {activeWorkout.exercises.map((ex, ei) => (
            <div key={ei} className="card" style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: T.font, fontSize: 20, color: T.white, marginBottom: 4 }}>{ex.exercise}</div>
              <div style={{ color: T.muted, fontSize: 12, marginBottom: 12 }}>{ex.sets} sets · {ex.reps} reps · Rest {ex.rest}</div>
              <div style={{ display:"grid", gridTemplateColumns:"40px 1fr 1fr", gap: 8, marginBottom: 6 }}>
                <div style={{ color: T.muted, fontSize: 11, fontWeight: 700 }}>SET</div>
                <div style={{ color: T.muted, fontSize: 11, fontWeight: 700 }}>WEIGHT (lbs)</div>
                <div style={{ color: T.muted, fontSize: 11, fontWeight: 700 }}>REPS DONE</div>
              </div>
              {Array.from({ length: ex.sets }, (_, si) => (
                <div key={si} style={{ display:"grid", gridTemplateColumns:"40px 1fr 1fr", gap: 8, marginBottom: 6 }}>
                  <div style={{ color: T.teal, fontFamily: T.font, fontSize: 18, paddingTop: 8 }}>{si + 1}</div>
                  <input type="number" placeholder="lbs" className="inp" style={{ padding:"8px 12px" }}
                    value={workoutLog[`${ei}-${si}-weight`] || ""} onChange={e => logSet(ei, si, "weight", e.target.value)} />
                  <input type="number" placeholder="reps" className="inp" style={{ padding:"8px 12px" }}
                    value={workoutLog[`${ei}-${si}-reps`] || ""} onChange={e => logSet(ei, si, "reps", e.target.value)} />
                </div>
              ))}
            </div>
          ))}
          <button className="btn btn-teal" onClick={saveWorkout} style={{ width:"100%", fontSize: 22 }}>💪 SAVE WORKOUT</button>
        </div>
      )}

      {/* 1RM History */}
      {activeSection === "history" && (
        <div>
          <div style={{ fontFamily: T.font, fontSize: 28, color: T.teal, letterSpacing: 2, marginBottom: 16 }}>1RM HISTORY</div>
          {Object.keys(maxHistory).length === 0 ? (
            <div className="card" style={{ textAlign:"center", color: T.muted, padding: 40 }}>No 1RMs saved yet. Use the calculator and save your maxes.</div>
          ) : (
            Object.entries(maxHistory).map(([liftName, entries]) => (
              <div key={liftName} className="card" style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: T.font, fontSize: 20, color: T.white, marginBottom: 8 }}>{liftName}</div>
                <div style={{ display:"flex", gap: 8, flexWrap:"wrap" }}>
                  {entries.map((e, i) => (
                    <div key={i} style={{ background: T.card2, borderRadius: 8, padding:"8px 14px", border:`1px solid ${T.border}` }}>
                      <div style={{ color: T.muted, fontSize: 11 }}>{e.date}</div>
                      <div style={{ fontFamily: T.font, color: T.teal, fontSize: 22 }}>{e.weight}<span style={{ fontSize: 12, color: T.muted }}> lbs</span></div>
                    </div>
                  ))}
                </div>
                {entries.length > 1 && (
                  <div style={{ color: entries[entries.length-1].weight > entries[0].weight ? T.teal : T.pink, fontSize: 13, marginTop: 8, fontWeight: 700 }}>
                    {entries[entries.length-1].weight > entries[0].weight ? "▲" : "▼"} {Math.abs(entries[entries.length-1].weight - entries[0].weight)} lbs since start
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── TAB: NUTRITION ───────────────────────────────────────────────────────────
const TARGETS = { cal: 2075, protein: 173, carbs: 216, fat: 57 };

function NutritionTab() {
  const [selDate, setSelDate] = useState(dk());
  const [foods, setFoods] = useState(() => lsGet("nutrition_" + dk(), []));
  const [form, setForm] = useState({ name:"", cal:"", protein:"", carbs:"", fat:"" });
  const [search, setSearch] = useState("");
  const [showFoodDB, setShowFoodDB] = useState(false);

  useEffect(() => {
    setFoods(lsGet("nutrition_" + selDate, []));
  }, [selDate]);

  function saveFoods(f) { lsSet("nutrition_" + selDate, f); }

  function addFood(foodData = null) {
    const item = foodData || form;
    if (!item.name) return;
    const updated = [...foods, { ...item, id: Date.now() }];
    setFoods(updated); saveFoods(updated);
    if (!foodData) setForm({ name:"", cal:"", protein:"", carbs:"", fat:"" });
    setSearch(""); setShowFoodDB(false);
  }

  function removeFood(id) {
    const updated = foods.filter(f => f.id !== id);
    setFoods(updated); saveFoods(updated);
  }

  const totals = foods.reduce((a, f) => ({
    cal: a.cal + (parseFloat(f.cal)||0),
    protein: a.protein + (parseFloat(f.protein)||0),
    carbs: a.carbs + (parseFloat(f.carbs)||0),
    fat: a.fat + (parseFloat(f.fat)||0),
  }), { cal:0, protein:0, carbs:0, fat:0 });

  // Week view
  const dateObj = new Date(selDate + "T12:00:00");
  const dow = dateObj.getDay();
  const weekDates = Array.from({length:7}, (_,i) => {
    const d = new Date(dateObj); d.setDate(dateObj.getDate() - dow + i); return dk(d);
  });

  const weekTotals = weekDates.map(d => {
    const f = lsGet("nutrition_" + d, []);
    return { date: d, cal: f.reduce((a,x) => a+(parseFloat(x.cal)||0), 0) };
  });
  const weekAvgCal = weekTotals.filter(d => d.cal > 0).length > 0
    ? Math.round(weekTotals.reduce((a,d) => a+d.cal, 0) / weekTotals.filter(d => d.cal > 0).length) : 0;

  const filteredFoods = search ? FOOD_DB.filter(f => f.name.toLowerCase().includes(search.toLowerCase())) : FOOD_DB;

  return (
    <div style={{ maxWidth: 760, margin:"0 auto" }}>
      {/* Week strip */}
      <div style={{ display:"flex", gap: 6, marginBottom: 16, flexWrap:"wrap" }}>
        {weekDates.map(d => {
          const dayData = lsGet("nutrition_" + d, []);
          const dayCal = Math.round(dayData.reduce((a,f) => a+(parseFloat(f.cal)||0), 0));
          const dayName = new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday:"short" });
          return (
            <button key={d} onClick={() => setSelDate(d)}
              style={{ flex:1, minWidth: 60, background: d === selDate ? T.teal : T.card, color: d === selDate ? T.bg : T.muted,
                border:`1px solid ${d === selDate ? T.teal : T.border}`, borderRadius: 10, padding:"8px 4px", cursor:"pointer", transition:"all 0.2s", fontFamily: T.body }}>
              <div style={{ fontSize: 11, fontWeight: 700 }}>{dayName}</div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>{dayCal || "—"}</div>
              <div style={{ fontSize: 10, opacity: 0.7 }}>cal</div>
            </button>
          );
        })}
      </div>

      {/* Weekly avg */}
      <div className="card" style={{ marginBottom: 14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ color: T.muted, fontSize: 12, letterSpacing: 1.5, fontWeight: 700 }}>WEEK AVERAGE</div>
          <div style={{ fontFamily: T.font, fontSize: 32, color: T.gold }}>{weekAvgCal || "—"} <span style={{ fontSize: 16, color: T.muted }}>CAL/DAY</span></div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ color: T.muted, fontSize: 12 }}>Target: {TARGETS.cal} cal</div>
          <div style={{ color: weekAvgCal > TARGETS.cal ? T.pink : T.teal, fontWeight: 700, fontSize: 14 }}>
            {weekAvgCal ? (weekAvgCal > TARGETS.cal ? `+${weekAvgCal - TARGETS.cal} over` : `${TARGETS.cal - weekAvgCal} under`) : "No data"}
          </div>
        </div>
      </div>

      {/* Macro bars */}
      <div className="grid4" style={{ marginBottom: 16 }}>
        <MacroBar label="CALORIES" current={totals.cal} target={TARGETS.cal} color={T.gold} />
        <MacroBar label="PROTEIN g" current={totals.protein} target={TARGETS.protein} color={T.pink} />
        <MacroBar label="CARBS g" current={totals.carbs} target={TARGETS.carbs} color={T.teal} />
        <MacroBar label="FAT g" current={totals.fat} target={TARGETS.fat} color="#A78BFA" />
      </div>

      {/* Food search DB */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: T.font, fontSize: 20, color: T.teal, letterSpacing: 1, marginBottom: 12 }}>QUICK ADD FOOD</div>
        <input className="inp" placeholder="🔍 Search food database..." value={search}
          onChange={e => { setSearch(e.target.value); setShowFoodDB(true); }}
          onFocus={() => setShowFoodDB(true)} style={{ marginBottom: 8 }} />
        {showFoodDB && search && (
          <div style={{ maxHeight: 200, overflowY:"auto", background: T.bg, border:`1px solid ${T.border}`, borderRadius: 8 }}>
            {filteredFoods.map(f => (
              <div key={f.name} onClick={() => addFood(f)}
                style={{ padding:"10px 14px", cursor:"pointer", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}
                onMouseEnter={e => e.currentTarget.style.background = T.card2}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <span style={{ color: T.white, fontSize: 14 }}>{f.name}</span>
                <span style={{ color: T.muted, fontSize: 12 }}>{f.cal} cal · {f.protein}p · {f.carbs}c · {f.fat}f</span>
              </div>
            ))}
            {filteredFoods.length === 0 && <div style={{ padding: 14, color: T.muted }}>No foods found — use manual entry below</div>}
          </div>
        )}
      </div>

      {/* Manual entry */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: T.font, fontSize: 18, color: T.white, marginBottom: 12 }}>MANUAL ENTRY</div>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr", gap: 8 }}>
          <div><label className="lbl" style={{ marginTop: 0 }}>Food Name</label>
            <input className="inp" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Chicken" /></div>
          {["cal","protein","carbs","fat"].map(k => (
            <div key={k}><label className="lbl" style={{ marginTop: 0 }}>{k.charAt(0).toUpperCase()+k.slice(1)}</label>
              <input type="number" className="inp" value={form[k]} onChange={e => setForm({...form, [k]: e.target.value})} placeholder="0" /></div>
          ))}
        </div>
        <button className="btn btn-teal" onClick={() => addFood()} style={{ marginTop: 12 }}>+ ADD</button>
      </div>

      {/* Food list */}
      {foods.length > 0 && (
        <div className="card">
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {["Food","Cal","Protein","Carbs","Fat",""].map(h => (
                  <th key={h} style={{ padding:"8px 10px", color: T.muted, fontWeight: 700, textAlign:"left", borderBottom:`1px solid ${T.border}`, fontSize: 11, letterSpacing: 1 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {foods.map(f => (
                <tr key={f.id} style={{ borderBottom:`1px solid ${T.border}20` }}>
                  <td style={{ padding:"10px 10px", color: T.white }}>{f.name}</td>
                  <td style={{ padding:"10px 10px", color: T.gold, fontWeight: 700 }}>{f.cal}</td>
                  <td style={{ padding:"10px 10px", color: T.pink }}>{f.protein}g</td>
                  <td style={{ padding:"10px 10px", color: T.teal }}>{f.carbs}g</td>
                  <td style={{ padding:"10px 10px", color: "#A78BFA" }}>{f.fat}g</td>
                  <td style={{ padding:"10px 10px" }}><button onClick={() => removeFood(f.id)} style={{ background:"none", border:"none", color: T.pink, cursor:"pointer", fontSize: 18 }}>×</button></td>
                </tr>
              ))}
              <tr style={{ borderTop:`2px solid ${T.border}` }}>
                <td style={{ padding:"10px 10px", color: T.muted, fontWeight: 700, fontSize: 12 }}>TOTAL</td>
                <td style={{ padding:"10px 10px", color: T.gold, fontWeight: 700 }}>{Math.round(totals.cal)}</td>
                <td style={{ padding:"10px 10px", color: T.pink, fontWeight: 700 }}>{Math.round(totals.protein)}g</td>
                <td style={{ padding:"10px 10px", color: T.teal, fontWeight: 700 }}>{Math.round(totals.carbs)}g</td>
                <td style={{ padding:"10px 10px", color: "#A78BFA", fontWeight: 700 }}>{Math.round(totals.fat)}g</td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── TAB: BODY STATS ──────────────────────────────────────────────────────────
function BodyStatsTab() {
  const [weight, setWeight] = useState("");
  const [sleepScore, setSleepScore] = useState("");
  const [steps, setSteps] = useState("");
  const [selDate, setSelDate] = useState(dk());
  const [stats, setStats] = useState(() => lsGet("bodyStats", {}));
  const [saved, setSaved] = useState(false);

  const dayStats = stats[selDate] || {};

  useEffect(() => {
    setWeight(dayStats.weight || "");
    setSleepScore(dayStats.sleepScore || "");
    setSteps(dayStats.steps || "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selDate]);

  function saveDay() {
    const updated = { ...stats, [selDate]: { weight: parseFloat(weight)||null, sleepScore: parseFloat(sleepScore)||null, steps: parseInt(steps)||null } };
    setStats(updated); lsSet("bodyStats", updated);
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  }

  // Week context
  const dateObj = new Date(selDate + "T12:00:00");
  const dow = dateObj.getDay();
  const weekDates = Array.from({length:7}, (_,i) => { const d = new Date(dateObj); d.setDate(dateObj.getDate() - dow + i); return dk(d); });
  const weekWeights = weekDates.map(d => stats[d]?.weight).filter(Boolean);
  const weekAvgWeight = weekWeights.length ? (weekWeights.reduce((a,b) => a+b, 0) / weekWeights.length).toFixed(1) : null;

  // All weight entries for trend
  const allWeights = Object.entries(stats)
    .filter(([,v]) => v.weight)
    .sort(([a],[b]) => a.localeCompare(b))
    .map(([date, v]) => ({ date, weight: v.weight }));

  const weightTrend = allWeights.length > 1
    ? (allWeights[allWeights.length-1].weight - allWeights[0].weight).toFixed(1)
    : null;

  // Step goal
  const STEP_GOAL = 10000;
  const stepsPct = steps ? Math.min(100, (parseInt(steps) / STEP_GOAL) * 100) : 0;

  const sleepColor = sleepScore >= 85 ? T.teal : sleepScore >= 70 ? T.gold : T.pink;

  return (
    <div style={{ maxWidth: 700, margin:"0 auto" }}>
      {/* Date selector */}
      <div className="card" style={{ marginBottom: 16, display:"flex", alignItems:"center", gap: 16 }}>
        <div style={{ fontFamily: T.font, fontSize: 24, color: T.teal }}>BODY STATS</div>
        <input type="date" className="inp" value={selDate} onChange={e => setSelDate(e.target.value)} style={{ width:"auto" }} />
      </div>

      {/* Week strip */}
      <div style={{ display:"flex", gap: 6, marginBottom: 16 }}>
        {weekDates.map(d => {
          const s = stats[d] || {};
          return (
            <button key={d} onClick={() => setSelDate(d)}
              style={{ flex:1, background: d === selDate ? T.teal : T.card, color: d === selDate ? T.bg : T.muted,
                border:`1px solid ${d === selDate ? T.teal : T.border}`, borderRadius: 10, padding:"8px 4px", cursor:"pointer", fontFamily: T.body }}>
              <div style={{ fontSize: 11, fontWeight: 700 }}>{new Date(d+"T12:00:00").toLocaleDateString("en-US", { weekday:"short" })}</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{s.weight ? s.weight + " lb" : "—"}</div>
            </button>
          );
        })}
      </div>

      {/* Input cards */}
      <div className="grid3" style={{ marginBottom: 16 }}>
        <div className="card" style={{ borderColor: T.gold + "30" }}>
          <div style={{ color: T.muted, fontSize: 11, letterSpacing: 1.5, fontWeight: 700, marginBottom: 8 }}>⚖️ WEIGHT (lbs)</div>
          <input type="number" className="inp" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 185" step="0.1" />
        </div>
        <div className="card" style={{ borderColor: T.teal + "30" }}>
          <div style={{ color: T.muted, fontSize: 11, letterSpacing: 1.5, fontWeight: 700, marginBottom: 8 }}>😴 SLEEP SCORE</div>
          <input type="number" className="inp" value={sleepScore} onChange={e => setSleepScore(e.target.value)} placeholder="Apple score 0-100" min="0" max="100" />
          {sleepScore && <div style={{ fontFamily: T.font, fontSize: 20, color: sleepColor, marginTop: 6 }}>{sleepScore}/100</div>}
        </div>
        <div className="card" style={{ borderColor: T.pink + "30" }}>
          <div style={{ color: T.muted, fontSize: 11, letterSpacing: 1.5, fontWeight: 700, marginBottom: 8 }}>👟 STEPS</div>
          <input type="number" className="inp" value={steps} onChange={e => setSteps(e.target.value)} placeholder="e.g. 8500" />
          {steps && (
            <div style={{ marginTop: 8 }}>
              <div style={{ background: T.border, borderRadius: 4, height: 6 }}>
                <div style={{ background: stepsPct >= 100 ? T.teal : T.pink, height:"100%", borderRadius: 4, width: stepsPct + "%" }} />
              </div>
              <div style={{ color: T.muted, fontSize: 11, marginTop: 4 }}>{parseInt(steps).toLocaleString()} / {STEP_GOAL.toLocaleString()}</div>
            </div>
          )}
        </div>
      </div>

      <button className="btn btn-teal" onClick={saveDay} style={{ width:"100%", fontSize: 22, marginBottom: 20 }}>
        {saved ? "✓ SAVED!" : "SAVE TODAY'S STATS"}
      </button>

      {/* Weekly summary */}
      <div className="grid2" style={{ marginBottom: 16 }}>
        <div className="card" style={{ borderColor: T.gold + "30" }}>
          <div style={{ color: T.muted, fontSize: 11, letterSpacing: 1.5, fontWeight: 700, marginBottom: 4 }}>WEEK AVG WEIGHT</div>
          <div style={{ fontFamily: T.font, fontSize: 36, color: T.gold }}>{weekAvgWeight ? weekAvgWeight + " lb" : "—"}</div>
        </div>
        <div className="card" style={{ borderColor: T.teal + "30" }}>
          <div style={{ color: T.muted, fontSize: 11, letterSpacing: 1.5, fontWeight: 700, marginBottom: 4 }}>TOTAL TREND</div>
          {weightTrend !== null ? (
            <div style={{ fontFamily: T.font, fontSize: 36, color: parseFloat(weightTrend) <= 0 ? T.teal : T.pink }}>
              {parseFloat(weightTrend) > 0 ? "+" : ""}{weightTrend} lb
            </div>
          ) : <div style={{ color: T.muted, paddingTop: 8 }}>Track 2+ days to see trend</div>}
        </div>
      </div>

      {/* Weight log table */}
      {allWeights.length > 0 && (
        <div className="card">
          <div style={{ fontFamily: T.font, fontSize: 20, color: T.teal, marginBottom: 12 }}>WEIGHT LOG</div>
          <div style={{ maxHeight: 300, overflowY:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  {["Date","Weight","Sleep","Steps"].map(h => (
                    <th key={h} style={{ padding:"8px 10px", color: T.muted, fontSize: 11, letterSpacing: 1, fontWeight: 700, textAlign:"left", borderBottom:`1px solid ${T.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats).filter(([,v]) => v.weight || v.sleepScore || v.steps).sort(([a],[b]) => b.localeCompare(a)).map(([date, v]) => (
                  <tr key={date} style={{ borderBottom:`1px solid ${T.border}20` }}>
                    <td style={{ padding:"8px 10px", color: T.muted, fontSize: 12 }}>{date}</td>
                    <td style={{ padding:"8px 10px", color: T.gold, fontWeight: 700 }}>{v.weight ? v.weight + " lb" : "—"}</td>
                    <td style={{ padding:"8px 10px", color: v.sleepScore >= 85 ? T.teal : v.sleepScore >= 70 ? T.gold : T.pink }}>
                      {v.sleepScore ? v.sleepScore + "/100" : "—"}
                    </td>
                    <td style={{ padding:"8px 10px", color: v.steps >= STEP_GOAL ? T.teal : T.white }}>
                      {v.steps ? parseInt(v.steps).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
const TABS = [
  { id:"today", label:"TODAY" },
  { id:"schedule", label:"SCHEDULE" },
  { id:"weights", label:"WEIGHT ROOM" },
  { id:"nutrition", label:"NUTRITION" },
  { id:"body", label:"BODY STATS" },
];

export default function App() {
  const [tab, setTab] = useState("today");
  const [startDate, setStartDate] = useState(PROGRAM_START);

  return (
    <div style={{ minHeight:"100vh", background: T.bg }}>
      <style>{css}</style>

      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, #0A0F1A 0%, #0D1B2A 50%, #0A1520 100%)`,
        borderBottom: `2px solid ${T.teal}`,
        padding:"0 20px",
        position:"sticky", top:0, zIndex:100,
        boxShadow: `0 4px 30px ${T.teal}20`,
      }}>
        {/* Top bar */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0", borderBottom:`1px solid ${T.border}` }}>
          <div style={{ display:"flex", alignItems:"baseline", gap: 12 }}>
            <div style={{ fontFamily: T.font, fontSize: 32, letterSpacing: 4, background:`linear-gradient(90deg, ${T.teal}, ${T.pink})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              TRAINING OS
            </div>
            <div style={{ color: T.muted, fontSize: 12, letterSpacing: 2 }}>MIAMI · 2026</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap: 10 }}>
            <span style={{ color: T.muted, fontSize: 12 }}>START DATE:</span>
            <input type="date" className="inp" value={dk(startDate)} onChange={e => setStartDate(new Date(e.target.value + "T12:00:00"))}
              style={{ width:"auto", padding:"6px 10px", fontSize: 12 }} />
          </div>
        </div>
        {/* Tab bar */}
        <div style={{ display:"flex", gap: 0, overflowX:"auto" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                background:"none", border:"none", borderBottom: tab === t.id ? `3px solid ${T.teal}` : "3px solid transparent",
                color: tab === t.id ? T.teal : T.muted,
                padding:"14px 20px", cursor:"pointer",
                fontFamily: T.font, fontSize: 16, letterSpacing: 2,
                transition:"all 0.2s", whiteSpace:"nowrap",
              }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding:"24px 20px", maxWidth: 1100, margin:"0 auto" }}>
        {tab === "today" && <TodayTab startDate={startDate} />}
        {tab === "schedule" && <ScheduleTab />}
        {tab === "weights" && <WeightRoomTab />}
        {tab === "nutrition" && <NutritionTab />}
        {tab === "body" && <BodyStatsTab />}
      </div>
    </div>
  );
}