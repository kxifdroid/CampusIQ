export const MOCK_LIBRARY_DATA = {
  books: [
    { id: 1, title: "Introduction to Algorithms", author: "CLRS", subject: "CS", available: true, location: "Shelf A-12", dueDate: null, isbn: "978-0262033848" },
    { id: 2, title: "Clean Code", author: "Robert C. Martin", subject: "CS", available: false, location: "Shelf A-14", dueDate: "2026-06-15", isbn: "978-0132350884" },
    { id: 3, title: "Design Patterns", author: "Gang of Four", subject: "CS", available: true, location: "Shelf A-15", dueDate: null, isbn: "978-0201633610" }
  ],
  status: {
    name: "IIT Roorkee Central Library",
    hours: "Mon–Sat: 8AM–11PM | Sun: 10AM–8PM",
    totalBooks: 150000, availableBooks: 124500, totalSeats: 200, availableSeats: 143,
    sections: ["Reading Room", "Digital Lab", "Reference Section"],
    contact: "library@iitr.ac.in"
  }
};

export const MOCK_CAFETERIA_DATA: any = {
  timings: { cafeteria: "Open 24×7", meals: { breakfast: "7-9 AM", lunch: "12-2:30 PM", snacks: "4-6 PM", dinner: "7:30-9:30 PM" } },
  specials: [{ name: "Monday Thali", description: "Full veg Thali", price: 80, veg: true }],
  mon: {
    breakfast: [{ item: "Aloo Parantha", veg: true, price: 25, calories: 320 }],
    lunch: [{ item: "Dal Tadka", veg: true, price: 30, calories: 180 }, { item: "Paneer Butter Masala", veg: true, price: 55, calories: 340 }],
    snacks: [{ item: "Samosa", veg: true, price: 10, calories: 150 }],
    dinner: [{ item: "Chole", veg: true, price: 35, calories: 210 }]
  },
  tue: {
    breakfast: [{ item: "Poha", veg: true, price: 20, calories: 250 }],
    lunch: [{ item: "Rajma", veg: true, price: 35, calories: 220 }],
    snacks: [{ item: "Bread Pakoda", veg: true, price: 15, calories: 200 }],
    dinner: [{ item: "Dal Makhani", veg: true, price: 40, calories: 250 }]
  }
};
// Trimmed other days for brevity as requested by user to "make it small"
MOCK_CAFETERIA_DATA.wed = MOCK_CAFETERIA_DATA.mon;
MOCK_CAFETERIA_DATA.thu = MOCK_CAFETERIA_DATA.tue;
MOCK_CAFETERIA_DATA.fri = MOCK_CAFETERIA_DATA.mon;
MOCK_CAFETERIA_DATA.sat = MOCK_CAFETERIA_DATA.tue;
MOCK_CAFETERIA_DATA.sun = MOCK_CAFETERIA_DATA.mon;

export const MOCK_EVENTS_DATA = [
  { id: 1, name: "HackNITR x IITR Hackathon", date: "2026-06-12", time: "09:00 AM", venue: "CS Block", club: "Coding Club", category: "tech" },
  { id: 2, name: "Guest Lecture: Future of AI", date: "2026-06-11", time: "03:00 PM", venue: "LH1", club: "IEEE", category: "seminar" }
];

export const MOCK_ACADEMICS_DATA: any = {
  schedule: {
    monday: [{ time: "08:00–09:00", course: "Engineering Math III", code: "MA-201", room: "LH-1", professor: "Prof. Anand Mishra" }],
    tuesday: [{ time: "10:00–11:00", course: "Digital Logic Design", code: "CS-202", room: "LH-2", professor: "Prof. S. Rama" }]
  },
  deadlines: [{ title: "DSA Assignment 3", course: "CS-201", dueDate: "2026-06-14", type: "assignment", marks: 20 }],
  notices: [{ id: 1, title: "Mid-Sem Exam Schedule Released", date: "2026-06-09", department: "Academic Section", important: true }]
};
// Mapping other days
MOCK_ACADEMICS_DATA.schedule.wednesday = MOCK_ACADEMICS_DATA.schedule.monday;
MOCK_ACADEMICS_DATA.schedule.thursday = MOCK_ACADEMICS_DATA.schedule.tuesday;
MOCK_ACADEMICS_DATA.schedule.friday = MOCK_ACADEMICS_DATA.schedule.monday;
