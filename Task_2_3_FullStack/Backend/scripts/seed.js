const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Event = require('../models/Event');
const Product = require('../models/Product');
const Workshop = require('../models/Workshop');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Subscription = require('../models/Subscription');

// Load environment variables
dotenv.config();

const seedData = {
    workshops: [
        {
            name: "Urban Gardening Workshop",
            category: "workshops",
            type: "workshop",
            price: 25.00,
            image: "/Images/workshop-gardening.jpg",
            description: "Learn the basics of growing your own food in small urban spaces.",
            date: "2024-04-15",
            time: "10:00 AM",
            location: "Community Center",
            capacity: 20,
            enrolled: 12
        },
        {
            name: "Eco Photography Class",
            category: "workshops",
            type: "workshop",
            price: 45.00,
            image: "/Images/workshop-photography.jpg",
            description: "Capture the beauty of nature while learning sustainable photography techniques.",
            date: "2024-04-20",
            time: "09:00 AM",
            location: "City Botanical Garden",
            capacity: 15,
            enrolled: 5
        },
        {
            name: "Green Writing & Journaling",
            category: "workshops",
            type: "workshop",
            price: 20.00,
            image: "/Images/workshop-journaling.jpg",
            description: "Connect with nature through the art of writing and mindful journaling.",
            date: "2024-04-22",
            time: "06:00 PM",
            location: "Community Library",
            capacity: 25,
            enrolled: 8
        },
        {
            name: "DIY Natural Products",
            category: "workshops",
            type: "workshop",
            price: 35.00,
            image: "/Images/workshop-diy.jpg",
            description: "Learn to make your own eco-friendly soaps, scrubs, and household cleaners.",
            date: "2024-04-25",
            time: "02:00 PM",
            location: "Craft Studio",
            capacity: 12,
            enrolled: 10
        }
    ],
    products: [
        {
            name: "Organic Vegetable Box",
            category: "products",
            type: "product",
            price: 35.00,
            image: "/Images/product-veggie-box.jpg",
            description: "Rediscover the joy of cooking with vegetables that taste the way nature intended. Every week, we hand-select the crispest, most vibrant organic produce from the season’s harvest and deliver it straight to you. From crunchy leafy greens to hearty root vegetables, our $35 Weekly Box is a curated surprise that inspires healthier, more delicious meals for you and your family. Eat fresh, eat seasonal, and taste the difference.",
            available: true
        },
        {
            name: "Eco-Friendly Water Bottle",
            category: "products",
            type: "product",
            price: 18.00,
            image: "/Images/product-water-bottle.jpg",
            description: "Durable, reusable stainless steel water bottle to reduce plastic waste.",
            available: true
        }
    ],
    events: [
        {
            name: "Sustainability Summit 2024",
            category: "events",
            type: "event",
            price: 50.00,
            image: "/Images/event-summit.jpg",
            description: "Join industry leaders and community activists for a day of talks and networking.",
            date: "2024-05-20",
            time: "09:00 AM",
            location: "Convention Hall",
            capacity: 200,
            enrolled: 150
        },
        {
            name: "Community Harvest Festival",
            category: "events",
            type: "event",
            price: 15.00,
            image: "/Images/workshop-gardening.jpg",
            description: "Celebrate the season with fresh produce, music, and community spirit.",
            date: "2024-06-15",
            time: "10:00 AM",
            location: "City Park",
            capacity: 500,
            enrolled: 120
        },
        {
            name: "Green Living Expo",
            category: "events",
            type: "event",
            price: 45.00,
            image: "/Images/products.jpg",
            description: "Discover the latest in eco-friendly technology and sustainable living solutions.",
            date: "2024-07-01",
            time: "09:00 AM",
            location: "Exhibition Center",
            capacity: 1000,
            enrolled: 350
        }
    ]
};

const users = [
    {
        name: "Admin User",
        email: "admin@urbanharvest.com",
        password: "password123",
        role: "admin"
    },
    {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        role: "user"
    },
    {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
        role: "user"
    }
];

const subscriptions = [
    { email: "subscriber1@example.com", active: true },
    { email: "subscriber2@example.com", active: true },
    { email: "subscriber3@example.com", active: false }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected for seeding');

        // Clear existing data
        await Event.deleteMany({});
        await Product.deleteMany({});
        await Workshop.deleteMany({});
        await User.deleteMany({});
        await Booking.deleteMany({});
        await Review.deleteMany({});
        await Subscription.deleteMany({});
        console.log('Cleared existing data');

        // Insert Events, Products, Workshops
        const createdEvents = await Event.insertMany(seedData.events);
        console.log('Events seeded');

        const createdProducts = await Product.insertMany(seedData.products);
        console.log('Products seeded');

        const createdWorkshops = await Workshop.insertMany(seedData.workshops);
        console.log('Workshops seeded');

        // Insert Users (with hashed passwords)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password123", salt);

        const usersWithHashedPasswords = users.map(user => ({
            ...user,
            password: hashedPassword
        }));

        const createdUsers = await User.insertMany(usersWithHashedPasswords);
        console.log('Users seeded');

        // Create Bookings
        // John Doe books an event and a workshop
        const john = createdUsers.find(u => u.email === "john@example.com");
        const eventToBook = createdEvents[0];
        const workshopToBook = createdWorkshops[0];

        const bookings = [
            {
                user: john._id,
                itemId: eventToBook._id,
                itemType: 'Event',
                status: 'confirmed'
            },
            {
                user: john._id,
                itemId: workshopToBook._id,
                itemType: 'Workshop',
                status: 'confirmed'
            }
        ];
        await Booking.insertMany(bookings);
        console.log('Bookings seeded');

        // Create Reviews
        // Jane Smith reviews a product
        const jane = createdUsers.find(u => u.email === "jane@example.com");
        const productToReview = createdProducts[0];

        const reviews = [
            {
                user: jane._id,
                itemId: productToReview._id,
                itemType: 'Product',
                rating: 5,
                comment: "Absolutely fresh and delicious! Highly recommended."
            },
            {
                user: john._id,
                itemId: eventToBook._id,
                itemType: 'Event',
                rating: 4,
                comment: "Great experience, learned a lot."
            }
        ];
        await Review.insertMany(reviews);
        console.log('Reviews seeded');

        // Insert Subscriptions
        await Subscription.insertMany(subscriptions);
        console.log('Subscriptions seeded');

        mongoose.disconnect();
        console.log('Database seeding completed');
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedDatabase();
