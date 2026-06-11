const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const menu = {
  mon: {
    breakfast: [
      { item: "Aloo Parantha", veg: true, price: 25, calories: 320 },
      { item: "Curd", veg: true, price: 10, calories: 60 },
      { item: "Chai", veg: true, price: 5, calories: 50 },
      { item: "Bread Butter", veg: true, price: 15, calories: 200 }
    ],
    lunch: [
      { item: "Dal Tadka", veg: true, price: 30, calories: 180 },
      { item: "Jeera Rice", veg: true, price: 25, calories: 260 },
      { item: "Paneer Butter Masala", veg: true, price: 55, calories: 340 },
      { item: "Roti (4 pcs)", veg: true, price: 20, calories: 240 },
      { item: "Salad", veg: true, price: 15, calories: 40 }
    ],
    snacks: [
      { item: "Samosa (2 pcs)", veg: true, price: 15, calories: 280 },
      { item: "Chai", veg: true, price: 5, calories: 50 }
    ],
    dinner: [
      { item: "Chole", veg: true, price: 35, calories: 210 },
      { item: "Basmati Rice", veg: true, price: 25, calories: 260 },
      { item: "Aloo Gobi", veg: true, price: 40, calories: 175 },
      { item: "Roti (4 pcs)", veg: true, price: 20, calories: 240 },
      { item: "Raita", veg: true, price: 20, calories: 90 },
      { item: "Chicken Curry", veg: false, price: 70, calories: 380 }
    ]
  },
  tue: {
    breakfast: [
      { item: "Poha", veg: true, price: 20, calories: 250 },
      { item: "Boiled Eggs (2)", veg: false, price: 20, calories: 140 },
      { item: "Chai", veg: true, price: 5, calories: 50 },
      { item: "Banana", veg: true, price: 10, calories: 90 }
    ],
    lunch: [
      { item: "Rajma", veg: true, price: 35, calories: 220 },
      { item: "Steamed Rice", veg: true, price: 20, calories: 200 },
      { item: "Mix Veg", veg: true, price: 40, calories: 150 },
      { item: "Roti (4 pcs)", veg: true, price: 20, calories: 240 },
      { item: "Papad", veg: true, price: 5, calories: 35 }
    ],
    snacks: [
      { item: "Bread Pakoda", veg: true, price: 20, calories: 320 },
      { item: "Nimbu Paani", veg: true, price: 10, calories: 30 }
    ],
    dinner: [
      { item: "Dal Makhani", veg: true, price: 40, calories: 250 },
      { item: "Jeera Rice", veg: true, price: 25, calories: 260 },
      { item: "Kadai Paneer", veg: true, price: 60, calories: 360 },
      { item: "Egg Curry", veg: false, price: 50, calories: 280 },
      { item: "Roti (4 pcs)", veg: true, price: 20, calories: 240 }
    ]
  },
  wed: {
    breakfast: [
      { item: "Idli Sambar (4 pcs)", veg: true, price: 25, calories: 280 },
      { item: "Coconut Chutney", veg: true, price: 5, calories: 45 },
      { item: "Chai", veg: true, price: 5, calories: 50 }
    ],
    lunch: [
      { item: "Dahl Fry", veg: true, price: 30, calories: 190 },
      { item: "Pulao Rice", veg: true, price: 35, calories: 310 },
      { item: "Aloo Jeera", veg: true, price: 35, calories: 210 },
      { item: "Roti (4 pcs)", veg: true, price: 20, calories: 240 }
    ],
    snacks: [
      { item: "Maggi (1 plate)", veg: true, price: 25, calories: 350 },
      { item: "Chai", veg: true, price: 5, calories: 50 }
    ],
    dinner: [
      { item: "Palak Paneer", veg: true, price: 55, calories: 310 },
      { item: "Biryani Rice", veg: true, price: 45, calories: 380 },
      { item: "Mutton Curry", veg: false, price: 90, calories: 450 },
      { item: "Raita", veg: true, price: 20, calories: 90 }
    ]
  },
  thu: {
    breakfast: [
      { item: "Upma", veg: true, price: 20, calories: 200 },
      { item: "Chai", veg: true, price: 5, calories: 50 },
      { item: "Omelette (2 eggs)", veg: false, price: 25, calories: 180 }
    ],
    lunch: [
      { item: "Chana Masala", veg: true, price: 35, calories: 220 },
      { item: "Jeera Rice", veg: true, price: 25, calories: 260 },
      { item: "Baingan Bharta", veg: true, price: 40, calories: 160 },
      { item: "Roti (4 pcs)", veg: true, price: 20, calories: 240 }
    ],
    snacks: [
      { item: "Vada Pav", veg: true, price: 20, calories: 290 },
      { item: "Tea", veg: true, price: 5, calories: 50 }
    ],
    dinner: [
      { item: "Toor Dal", veg: true, price: 30, calories: 175 },
      { item: "Steamed Rice", veg: true, price: 20, calories: 200 },
      { item: "Paneer Bhurji", veg: true, price: 50, calories: 280 },
      { item: "Chicken Biryani", veg: false, price: 85, calories: 480 },
      { item: "Roti (4 pcs)", veg: true, price: 20, calories: 240 }
    ]
  },
  fri: {
    breakfast: [
      { item: "Chole Bhature", veg: true, price: 40, calories: 480 },
      { item: "Chai", veg: true, price: 5, calories: 50 }
    ],
    lunch: [
      { item: "Dal Tadka", veg: true, price: 30, calories: 180 },
      { item: "Fried Rice", veg: true, price: 40, calories: 370 },
      { item: "Paneer Tikka Masala", veg: true, price: 65, calories: 380 },
      { item: "Roti (4 pcs)", veg: true, price: 20, calories: 240 },
      { item: "Lassi", veg: true, price: 25, calories: 160 }
    ],
    snacks: [
      { item: "Pav Bhaji", veg: true, price: 30, calories: 380 },
      { item: "Chai", veg: true, price: 5, calories: 50 }
    ],
    dinner: [
      { item: "Dal Makhani", veg: true, price: 40, calories: 250 },
      { item: "Basmati Rice", veg: true, price: 25, calories: 260 },
      { item: "Shahi Paneer", veg: true, price: 70, calories: 420 },
      { item: "Butter Naan (2 pcs)", veg: true, price: 30, calories: 280 },
      { item: "Fish Curry", veg: false, price: 75, calories: 340 }
    ]
  },
  sat: {
    breakfast: [
      { item: "Dosa with Sambar", veg: true, price: 30, calories: 300 },
      { item: "Chai", veg: true, price: 5, calories: 50 }
    ],
    lunch: [
      { item: "Special Thali (Rajma, Rice, 2 Roti, Dal, Sabzi, Curd, Salad)", veg: true, price: 75, calories: 720 },
      { item: "Biryani (Non-Veg)", veg: false, price: 90, calories: 480 }
    ],
    snacks: [
      { item: "Burger", veg: true, price: 45, calories: 350 },
      { item: "Cold Coffee", veg: true, price: 35, calories: 180 }
    ],
    dinner: [
      { item: "Puri Sabzi", veg: true, price: 35, calories: 320 },
      { item: "Dal Khichdi", veg: true, price: 30, calories: 280 },
      { item: "Egg Bhurji", veg: false, price: 40, calories: 220 },
      { item: "Sweet Kheer", veg: true, price: 25, calories: 200 }
    ]
  },
  sun: {
    breakfast: [
      { item: "Poori Aloo (4 pcs)", veg: true, price: 35, calories: 440 },
      { item: "Chai", veg: true, price: 5, calories: 50 }
    ],
    lunch: [
      { item: "Sunday Special — Butter Chicken / Paneer Butter Masala", veg: false, price: 85, calories: 420 },
      { item: "Naan (2 pcs)", veg: true, price: 20, calories: 240 },
      { item: "Jeera Rice", veg: true, price: 25, calories: 260 },
      { item: "Gulab Jamun (2 pcs)", veg: true, price: 20, calories: 180 }
    ],
    snacks: [
      { item: "Pizza Slice", veg: true, price: 55, calories: 400 },
      { item: "Cold Coffee", veg: true, price: 35, calories: 180 }
    ],
    dinner: [
      { item: "Mix Dal", veg: true, price: 35, calories: 190 },
      { item: "Biryani", veg: false, price: 90, calories: 480 },
      { item: "Roti (4 pcs)", veg: true, price: 20, calories: 240 }
    ]
  }
};

const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const todayKey = days[new Date().getDay()];

// GET /menu (today's full menu)
app.get('/menu', (req, res) => {
  res.json({ day: todayKey, menu: menu[todayKey] });
});

// GET /menu/:day
app.get('/menu/:day', (req, res) => {
  const day = req.params.day.toLowerCase();
  if (!menu[day]) return res.status(404).json({ error: 'Invalid day. Use mon-sun.' });
  res.json({ day, menu: menu[day] });
});

// GET /specials
app.get('/specials', (req, res) => {
  res.json([
    { name: "Monday Thali", description: "Full veg Thali — Chole Bhature + Paneer + Dal + Rice + 2 Roti + Curd + Sweet", day: "Monday", price: 80, veg: true },
    { name: "Friday Fish Curry", description: "Fresh river fish in spicy masala gravy, served with rice and roti", day: "Friday", price: 75, veg: false },
    { name: "Sunday Biryani Brunch", description: "Chef's special dum biryani — chicken or veg available", day: "Sunday", price: 90, veg: false },
    { name: "Sattu Lassi (Daily)", description: "IIT tradition! High-protein sattu mixed with yogurt and spices", price: 20, veg: true },
    { name: "Fresh Samosa Evening", description: "Hot samosas available 4–6 PM daily at stall 2", price: 10, veg: true }
  ]);
});

// GET /timings
app.get('/timings', (req, res) => {
  res.json({
    cafeteria: "Open 24×7 (light snacks/beverages only after 11 PM)",
    meals: {
      breakfast: "7:00 AM – 9:00 AM",
      lunch: "12:00 PM – 2:30 PM",
      snacks: "4:00 PM – 6:00 PM",
      dinner: "7:30 PM – 9:30 PM"
    },
    stalls: [
      { name: "Main Canteen", type: "Full meals", timings: "12 PM – 10 PM" },
      { name: "Tea Stall (Bhola's)", type: "Chai, snacks", timings: "6 AM – 11 PM" },
      { name: "Night Canteen", type: "Maggi, sandwiches, omelette", timings: "10 PM – 5 AM" },
      { name: "Juice Corner", type: "Fresh juices, cold coffee", timings: "9 AM – 9 PM" }
    ],
    note: "Meal times may extend by 30 min during exam season."
  });
});

app.get('/health', (req, res) => res.json({ status: 'ok', server: 'cafeteria' }));

const PORT = 4002;
app.listen(PORT, () => console.log(`🍽️  Cafeteria MCP Server running on port ${PORT}`));
