const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const books = [
  { id: 1, title: "Introduction to Algorithms", author: "CLRS", subject: "CS", available: true, location: "Shelf A-12", dueDate: null, isbn: "978-0262033848" },
  { id: 2, title: "Clean Code", author: "Robert C. Martin", subject: "CS", available: false, location: "Shelf A-14", dueDate: "2026-06-15", isbn: "978-0132350884" },
  { id: 3, title: "Design Patterns", author: "Gang of Four", subject: "CS", available: true, location: "Shelf A-15", dueDate: null, isbn: "978-0201633610" },
  { id: 4, title: "The Pragmatic Programmer", author: "Hunt & Thomas", subject: "CS", available: false, location: "Shelf A-16", dueDate: "2026-06-20", isbn: "978-0135957059" },
  { id: 5, title: "Computer Networks", author: "Tanenbaum", subject: "CS", available: true, location: "Shelf B-02", dueDate: null, isbn: "978-0132126953" },
  { id: 6, title: "Operating System Concepts", author: "Silberschatz", subject: "CS", available: true, location: "Shelf B-04", dueDate: null, isbn: "978-1119800361" },
  { id: 7, title: "Database System Concepts", author: "Korth & Silberschatz", subject: "CS", available: false, location: "Shelf B-06", dueDate: "2026-06-18", isbn: "978-1260515046" },
  { id: 8, title: "Concepts of Physics Vol 1", author: "H.C. Verma", subject: "Physics", available: true, location: "Shelf C-03", dueDate: null, isbn: "978-8177091878" },
  { id: 9, title: "Concepts of Physics Vol 2", author: "H.C. Verma", subject: "Physics", available: true, location: "Shelf C-04", dueDate: null, isbn: "978-8177092325" },
  { id: 10, title: "University Physics", author: "Young & Freedman", subject: "Physics", available: false, location: "Shelf C-05", dueDate: "2026-06-25", isbn: "978-0135159552" },
  { id: 11, title: "Higher Engineering Mathematics", author: "B.S. Grewal", subject: "Math", available: true, location: "Shelf D-01", dueDate: null, isbn: "978-8174091955" },
  { id: 12, title: "Calculus", author: "James Stewart", subject: "Math", available: true, location: "Shelf D-03", dueDate: null, isbn: "978-1285740621" },
  { id: 13, title: "Linear Algebra", author: "Gilbert Strang", subject: "Math", available: false, location: "Shelf D-05", dueDate: "2026-06-22", isbn: "978-0980232776" },
  { id: 14, title: "Probability and Statistics", author: "Walpole", subject: "Math", available: true, location: "Shelf D-07", dueDate: null, isbn: "978-0134995472" },
  { id: 15, title: "1984", author: "George Orwell", subject: "Literature", available: true, location: "Shelf E-02", dueDate: null, isbn: "978-0451524935" },
  { id: 16, title: "The Great Gatsby", author: "F. Scott Fitzgerald", subject: "Literature", available: true, location: "Shelf E-04", dueDate: null, isbn: "978-0743273565" },
  { id: 17, title: "To Kill a Mockingbird", author: "Harper Lee", subject: "Literature", available: false, location: "Shelf E-05", dueDate: "2026-07-01", isbn: "978-0061935466" },
  { id: 18, title: "Signals and Systems", author: "Oppenheim", subject: "Electronics", available: true, location: "Shelf F-01", dueDate: null, isbn: "978-0138147570" },
  { id: 19, title: "VLSI Design", author: "Neil Weste", subject: "Electronics", available: true, location: "Shelf F-03", dueDate: null, isbn: "978-0321547743" },
  { id: 20, title: "Artificial Intelligence: A Modern Approach", author: "Russell & Norvig", subject: "CS", available: false, location: "Shelf A-20", dueDate: "2026-06-30", isbn: "978-0134610993" },
  { id: 21, title: "Deep Learning", author: "Goodfellow et al.", subject: "CS", available: true, location: "Shelf A-21", dueDate: null, isbn: "978-0262035613" },
  { id: 22, title: "Engineering Mechanics", author: "Meriam & Kraige", subject: "Mechanical", available: true, location: "Shelf G-01", dueDate: null, isbn: "978-1119726302" },
];

// GET /search?q=
app.get('/search', (req, res) => {
  const query = (req.query.q || '').toLowerCase();
  if (!query) return res.json(books.slice(0, 10));
  const results = books.filter(b =>
    b.title.toLowerCase().includes(query) ||
    b.author.toLowerCase().includes(query) ||
    b.subject.toLowerCase().includes(query)
  );
  res.json(results);
});

// GET /status
app.get('/status', (req, res) => {
  const totalBooks = books.length;
  const availableBooks = books.filter(b => b.available).length;
  res.json({
    name: "IIT Roorkee Central Library",
    hours: "Monday–Saturday: 8:00 AM – 11:00 PM | Sunday: 10:00 AM – 8:00 PM",
    totalBooks,
    availableBooks,
    checkedOut: totalBooks - availableBooks,
    totalSeats: 200,
    availableSeats: 143,
    occupiedSeats: 57,
    floors: 4,
    sections: ["Reading Room", "Digital Lab", "Reference Section", "Group Study Rooms"],
    wifi: "Library_WiFi (ask librarian for password)",
    contact: "library@iitr.ac.in | +91-1332-285005"
  });
});

// GET /book/:id
app.get('/book/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

app.get('/health', (req, res) => res.json({ status: 'ok', server: 'library' }));

const PORT = 4001;
app.listen(PORT, () => console.log(`📚 Library MCP Server running on port ${PORT}`));
