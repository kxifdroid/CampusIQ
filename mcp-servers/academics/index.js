const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const schedule = {
  monday: [
    { time: "08:00–09:00", course: "Engineering Mathematics III", code: "MA-201", room: "LH-1", professor: "Prof. Anand Mishra" },
    { time: "09:00–10:00", course: "Data Structures & Algorithms", code: "CS-201", room: "CLT-1", professor: "Prof. Neeraj Kumar" },
    { time: "10:00–11:00", course: "Digital Electronics", code: "EC-203", room: "EC-204", professor: "Prof. Sudhir Agarwal" },
    { time: "11:00–12:00", course: "Engineering Mechanics", code: "ME-201", room: "LH-3", professor: "Prof. R.K. Sharma" },
    { time: "14:00–16:00", course: "DSA Lab", code: "CS-201L", room: "CS Lab-2", professor: "Prof. Neeraj Kumar / TAs" }
  ],
  tuesday: [
    { time: "08:00–09:00", course: "Engineering Mathematics III", code: "MA-201", room: "LH-1", professor: "Prof. Anand Mishra" },
    { time: "09:00–10:00", course: "Computer Networks", code: "CS-301", room: "CLT-2", professor: "Prof. Dhirendra Kumar" },
    { time: "10:00–11:00", course: "Database Management Systems", code: "CS-302", room: "LH-5", professor: "Prof. S.K. Gupta" },
    { time: "11:00–13:00", course: "Digital Electronics Lab", code: "EC-203L", room: "EC Lab-1", professor: "Prof. Sudhir Agarwal / TAs" }
  ],
  wednesday: [
    { time: "08:00–09:00", course: "Data Structures & Algorithms", code: "CS-201", room: "CLT-1", professor: "Prof. Neeraj Kumar" },
    { time: "09:00–10:00", course: "Computer Networks", code: "CS-301", room: "CLT-2", professor: "Prof. Dhirendra Kumar" },
    { time: "10:00–11:00", course: "Engineering Mechanics", code: "ME-201", room: "LH-3", professor: "Prof. R.K. Sharma" },
    { time: "11:00–12:00", course: "Database Management Systems", code: "CS-302", room: "LH-5", professor: "Prof. S.K. Gupta" }
  ],
  thursday: [
    { time: "08:00–09:00", course: "Engineering Mathematics III", code: "MA-201", room: "LH-1", professor: "Prof. Anand Mishra" },
    { time: "09:00–10:00", course: "Data Structures & Algorithms", code: "CS-201", room: "CLT-1", professor: "Prof. Neeraj Kumar" },
    { time: "10:00–11:00", course: "Digital Electronics", code: "EC-203", room: "EC-204", professor: "Prof. Sudhir Agarwal" },
    { time: "14:00–17:00", course: "Computer Networks Lab", code: "CS-301L", room: "CS Lab-3", professor: "Prof. Dhirendra Kumar / TAs" }
  ],
  friday: [
    { time: "08:00–09:00", course: "Computer Networks", code: "CS-301", room: "CLT-2", professor: "Prof. Dhirendra Kumar" },
    { time: "09:00–10:00", course: "Database Management Systems", code: "CS-302", room: "LH-5", professor: "Prof. S.K. Gupta" },
    { time: "10:00–11:00", course: "Engineering Mathematics III", code: "MA-201", room: "LH-1", professor: "Prof. Anand Mishra" },
    { time: "11:00–12:00", course: "Engineering Mechanics", code: "ME-201", room: "LH-3", professor: "Prof. R.K. Sharma" }
  ],
  saturday: [
    { time: "08:00–09:00", course: "Database Management Systems", code: "CS-302", room: "LH-5", professor: "Prof. S.K. Gupta" },
    { time: "09:00–10:00", course: "Digital Electronics", code: "EC-203", room: "EC-204", professor: "Prof. Sudhir Agarwal" }
  ]
};

const now = new Date();
const d = (offset) => {
  const dt = new Date(now);
  dt.setDate(dt.getDate() + offset);
  return dt.toISOString().split('T')[0];
};

const deadlines = [
  { title: "DSA Assignment 3: Graph Algorithms", course: "CS-201", dueDate: d(3), type: "assignment", marks: 20, submissionMode: "Moodle" },
  { title: "DBMS Mini Project Proposal", course: "CS-302", dueDate: d(5), type: "project", marks: 30, submissionMode: "Email to Prof. S.K. Gupta" },
  { title: "Mathematics III Tutorial 8", course: "MA-201", dueDate: d(1), type: "assignment", marks: 10, submissionMode: "Physical submission" },
  { title: "Computer Networks Lab Record", course: "CS-301L", dueDate: d(7), type: "assignment", marks: 15, submissionMode: "Lab instructor on duty" },
  { title: "Digital Electronics Mid-Sem Viva", course: "EC-203", dueDate: d(4), type: "viva", marks: 25, submissionMode: "EC Lab-1 (oral)" },
  { title: "Engineering Mechanics Surprise Test", course: "ME-201", dueDate: d(9), type: "test", marks: 15, submissionMode: "In-class" }
];

const holidays = [
  { name: "End Semester Examinations Begin", date: "2026-07-01", type: "exam" },
  { name: "Independence Day", date: "2026-08-15", type: "national" },
  { name: "Diwali Break", date: "2026-10-24", type: "festival", duration: "5 days" },
  { name: "Dussehra", date: "2026-10-02", type: "festival" },
  { name: "Gandhi Jayanti", date: "2026-10-02", type: "national" },
  { name: "Eid-ul-Fitr (tentative)", date: "2027-03-20", type: "festival" },
  { name: "Holi Break", date: "2027-03-02", type: "festival", duration: "2 days" },
  { name: "Winter Vacation", date: "2026-12-22", type: "vacation", duration: "14 days" },
  { name: "Summer Vacation", date: "2026-05-15", type: "vacation", duration: "30 days" },
  { name: "Republic Day", date: "2027-01-26", type: "national" },
  { name: "Christmas Break", date: "2026-12-25", type: "national" }
];

const notices = [
  {
    id: 1, title: "Mid-Semester Examination Schedule Released",
    content: "Mid-sem exams will be held from June 23–29, 2026. Admit cards available on Channeli portal. Contact academic section for queries.",
    date: d(-2), department: "Academic Section", important: true
  },
  {
    id: 2, title: "Attendance Warning — Below 75%",
    content: "Students with attendance below 75% will not be allowed to appear in end-semester exams. Check your attendance on Channeli immediately.",
    date: d(-5), department: "Dean of Academic Affairs", important: true
  },
  {
    id: 3, title: "Fee Payment Deadline — Last Date June 20",
    content: "Semester fee payment last date is June 20, 2026. Late fee of ₹500/day will be charged thereafter. Pay via SBI Collect or Channeli portal.",
    date: d(-3), department: "Accounts Section", important: true
  },
  {
    id: 4, title: "New Elective Added: Deep Learning (CS-491)",
    content: "Prof. Manish Gupta will offer CS-491 Deep Learning as elective in Jul-Nov 2026 semester. Min CGPA 7.5 required. Register by June 30.",
    date: d(-1), department: "Computer Science Department", important: false
  },
  {
    id: 5, title: "Channeli Student Portal Maintenance",
    content: "Channeli will be down for maintenance on June 11, 2026 from 2 AM – 6 AM. Plan any urgent submissions accordingly.",
    date: d(0), department: "IT Department", important: false
  },
  {
    id: 6, title: "Library Book Return Reminder",
    content: "All checked-out books must be returned before end-semester exams. Fine: ₹5/day per book after due date.",
    date: d(-4), department: "Central Library", important: false
  }
];

// GET /schedule
app.get('/schedule', (req, res) => {
  res.json({ semester: "Jan–May 2026", schedule });
});

// GET /deadlines
app.get('/deadlines', (req, res) => {
  const sorted = [...deadlines].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  res.json(sorted);
});

// GET /holidays
app.get('/holidays', (req, res) => {
  const sorted = [...holidays].sort((a, b) => new Date(a.date) - new Date(b.date));
  res.json(sorted);
});

// GET /notices
app.get('/notices', (req, res) => {
  const sorted = [...notices].sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(sorted);
});

app.get('/health', (req, res) => res.json({ status: 'ok', server: 'academics' }));

const PORT = 4004;
app.listen(PORT, () => console.log(`📖 Academics MCP Server running on port ${PORT}`));
