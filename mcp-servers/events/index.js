const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Events relative to today's date for demo realism
const now = new Date();
const d = (offset) => {
  const dt = new Date(now);
  dt.setDate(dt.getDate() + offset);
  return dt.toISOString().split('T')[0];
};

const allEvents = [
  {
    id: 1, name: "HackNITR x IITR Hackathon", date: d(1), time: "09:00 AM",
    venue: "Computer Science Block — Network Lab", club: "Coding Club",
    category: "tech", description: "36-hour hackathon open to all students. Build real-world solutions. Prizes worth ₹50,000. Register at cdc.iitr.ac.in"
  },
  {
    id: 2, name: "Guest Lecture: Future of AI in Healthcare", date: d(0), time: "03:00 PM",
    venue: "Lecture Hall Complex — LH1", club: "IEEE Student Branch",
    category: "seminar", description: "Prof. Rajesh Kumar from IISc Bangalore will speak on AI-driven diagnostics and medical imaging. Open to all."
  },
  {
    id: 3, name: "Annual Cultural Fest — Cognizance 2026", date: d(3), time: "06:00 PM",
    venue: "James Thompson Building & Open Grounds", club: "SAC (Student Activity Center)",
    category: "cultural", description: "3-day mega cultural fest with concerts, competitions, fashion show, and celebrity performances."
  },
  {
    id: 4, name: "Workshop: React & Next.js Deep Dive", date: d(2), time: "02:00 PM",
    venue: "NCC Building — Room 204", club: "Web Development Club",
    category: "workshop", description: "Hands-on 4-hour workshop covering React 18 hooks, Next.js 14 App Router, and deployment on Vercel. Bring your laptops."
  },
  {
    id: 5, name: "Inter-Hostel Basketball Tournament", date: d(0), time: "05:00 PM",
    venue: "Institute Basketball Court", club: "Sports Board",
    category: "sports", description: "Semi-finals today! Rajendra vs Cautley at 5 PM. Sudhanshubhushan vs Radhakrishnan at 7 PM. Finals tomorrow."
  },
  {
    id: 6, name: "Open Mic Night", date: d(4), time: "07:30 PM",
    venue: "Convocation Hall Lawns", club: "MusicMania",
    category: "cultural", description: "Showcase your talent in music, poetry, spoken word, stand-up. Register by 6 PM at SAC. All genres welcome."
  },
  {
    id: 7, name: "Environment Day Tree Plantation Drive", date: d(1), time: "07:00 AM",
    venue: "NSS Office (meeting point) → Canal Road", club: "NSS IITR",
    category: "seminar", description: "Plant saplings around campus as part of Green IITR initiative. Volunteers get certificates."
  },
  {
    id: 8, name: "Robotics Workshop: Line Following & PID Control", date: d(5), time: "10:00 AM",
    venue: "EC Block — Electronics Lab", club: "Robocon Team",
    category: "workshop", description: "Build and calibrate a line-following robot. Hardware kits provided. ₹200 participation fee."
  },
  {
    id: 9, name: "Yoga & Meditation Session", date: d(0), time: "06:00 AM",
    venue: "College Ground (near gymnasium)", club: "Wellness Club",
    category: "seminar", description: "Daily 45-min yoga session. All are welcome. Bring a mat. Instructor: Sri Ramesh Sharma."
  },
  {
    id: 10, name: "Placement Preparation Workshop", date: d(2), time: "11:00 AM",
    venue: "Training & Placement Cell — Conference Room", club: "CDC",
    category: "seminar", description: "Resume writing, aptitude test strategies, and mock PI sessions. Especially useful for pre-final year students."
  },
  {
    id: 11, name: "Photography Club Field Trip", date: d(6), time: "05:30 AM",
    venue: "Meet at Main Gate", club: "IITR Photography Club",
    category: "cultural", description: "Sunrise photography at Rajaji National Park buffer zone. Limited to 20 participants. DSLR preferred."
  },
  {
    id: 12, name: "Cricket Match: CS vs ME Department", date: d(1), time: "04:00 PM",
    venue: "Main Cricket Ground", club: "Sports Board",
    category: "sports", description: "Department T20 league match. Free entry for all spectators. Food stalls will be open."
  },
  {
    id: 13, name: "Talk: Quantum Computing Fundamentals", date: d(3), time: "12:00 PM",
    venue: "Physics Department — Seminar Hall", club: "Physics Society",
    category: "seminar", description: "Dr. Priya Nair from IBM Research presents quantum gates, circuits, and near-term quantum advantage."
  },
  {
    id: 14, name: "Speed Coding Contest", date: d(4), time: "09:00 PM",
    venue: "Codeforces (Online)", club: "Coding Club",
    category: "tech", description: "Rated online contest on Codeforces platform. 2 hours, 6 problems. Div 2+3 combined. Link in club WhatsApp."
  },
  {
    id: 15, name: "Alumni Talk: Startup Journey", date: d(7), time: "04:00 PM",
    venue: "Convocation Hall", club: "E-Cell IITR",
    category: "seminar", description: "IITR alumnus (2015 batch) talks about founding a ₹100Cr SaaS startup. Q&A session after the talk."
  }
];

// GET /events (all or filtered by category)
app.get('/events', (req, res) => {
  const cat = req.query.category;
  if (cat) {
    const filtered = allEvents.filter(e => e.category === cat.toLowerCase());
    return res.json(filtered);
  }
  const sorted = [...allEvents].sort((a, b) => new Date(a.date) - new Date(b.date));
  res.json(sorted);
});

// GET /events/today
app.get('/events/today', (req, res) => {
  const today = d(0);
  const todayEvents = allEvents.filter(e => e.date === today);
  res.json({ date: today, events: todayEvents });
});

// GET /events/this-week
app.get('/events/this-week', (req, res) => {
  const weekEvents = allEvents.filter(e => {
    const eventDate = new Date(e.date);
    const nowDate = new Date(now);
    const diff = (eventDate - nowDate) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  }).sort((a, b) => new Date(a.date) - new Date(b.date));
  res.json({ from: d(0), to: d(7), events: weekEvents });
});

app.get('/health', (req, res) => res.json({ status: 'ok', server: 'events' }));

const PORT = 4003;
app.listen(PORT, () => console.log(`🎉 Events MCP Server running on port ${PORT}`));
