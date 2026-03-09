const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Medicine = require('./models/Medicine');
const Order = require('./models/Order');
const connectDB = require('./utils/db');
const bcrypt = require('bcryptjs');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Order.deleteMany();
        await Medicine.deleteMany();
        // Removed: await User.deleteMany();

        // Check if our default test users exist
        let adminUserDoc = await User.findOne({ email: 'admin@medeasy.com' });

        if (!adminUserDoc) {
            const hashedPassword = await bcrypt.hash('password123', 10);

            const createdUsers = await User.insertMany([
                {
                    name: 'Admin User',
                    email: 'admin@medeasy.com',
                    password: hashedPassword,
                    phone: '1234567890',
                    address: 'Admin Base, MedEasy HQ',
                    role: 'admin',
                },
                {
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: hashedPassword,
                    phone: '9876543210',
                    address: '123 Test Street, City',
                },
            ]);
            adminUserDoc = createdUsers[0];
        }

        const adminUser = adminUserDoc._id;

        const sampleMedicines = [
            {
                name: 'Paracetamol 500mg',
                image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500',
                description: 'Used for fever and mild to moderate pain.',
                manufacturer: 'GlaxoSmithKline',
                ingredients: ['Paracetamol 500mg'],
                usage: 'Take 1 tablet every 4 to 6 hours as needed. Do not exceed 4 tablets in 24 hours.',
                sideEffects: ['Nausea', 'Allergic allergic reactions', 'Stomach pain', 'Liver damage (in overdose)'],
                category: 'Fever',
                price: 30,
                stock: 100,
                requiresPrescription: false,
                expiryDate: new Date('2025-12-31'),
            },
            {
                name: 'Amoxicillin 250mg',
                image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500',
                description: 'Antibiotic used to treat bacterial infections.',
                manufacturer: 'Pfizer',
                ingredients: ['Amoxicillin Trihydrate 250mg'],
                usage: 'Take 1 capsule every 8 hours with or without food. Complete the full prescribed course.',
                sideEffects: ['Nausea', 'Vomiting', 'Diarrhea', 'Rash'],
                category: 'Antibiotics',
                price: 150,
                stock: 50,
                requiresPrescription: true,
                expiryDate: new Date('2025-06-30'),
            },
            {
                name: 'Cough Syrup',
                image: 'https://images.unsplash.com/photo-1550572017-edb799bc5701?w=500',
                description: 'For dry and wet cough relief.',
                manufacturer: 'Dabur',
                ingredients: ['Diphenhydramine', 'Ammonium Chloride', 'Sodium Citrate'],
                usage: 'Adults: 10ml every 6 hours. Children: Consult a physician.',
                sideEffects: ['Drowsiness', 'Dizziness', 'Dry mouth'],
                category: 'Cough & Cold',
                price: 85,
                stock: 40,
                requiresPrescription: false,
                expiryDate: new Date('2024-11-30'),
            },
            {
                name: 'Vitamin C 1000mg',
                image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500',
                description: 'Immunity booster effervescent tablets.',
                manufacturer: 'Bayer',
                ingredients: ['Ascorbic Acid 1000mg', 'Zinc 10mg'],
                usage: 'Drop one tablet in a glass of water and drink once fully dissolved. Take once daily.',
                sideEffects: ['Stomach upset (if taken on empty stomach)'],
                category: 'Vitamins & Supplements',
                price: 220,
                stock: 150,
                requiresPrescription: false,
                expiryDate: new Date('2026-05-15'),
            },
            {
                name: 'Ibuprofen 400mg',
                image: 'https://images.unsplash.com/photo-1627854612344-934fa68f9a94?w=500',
                description: 'Relieves pain, tenderness, swelling, and stiffness caused by osteoarthritis and rheumatoid arthritis.',
                manufacturer: 'Abbott',
                ingredients: ['Ibuprofen 400mg'],
                usage: 'Take 1 tablet every 6 to 8 hours with food or milk to prevent stomach upset.',
                sideEffects: ['Heartburn', 'Stomach pain', 'Dizziness', 'Ringing in the ears'],
                category: 'Pain Relief',
                price: 55,
                stock: 200,
                requiresPrescription: false,
                expiryDate: new Date('2026-01-20'),
            },
            {
                name: 'Omeprazole 20mg',
                image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=500',
                description: 'Used to treat certain conditions where there is too much acid in the stomach.',
                manufacturer: 'Dr. Reddy\'s Laboratories',
                ingredients: ['Omeprazole 20mg'],
                usage: 'Take 1 capsule daily before a meal, preferably in the morning.',
                sideEffects: ['Headache', 'Stomach pain', 'Nausea', 'Diarrhea'],
                category: 'Digestive Care',
                price: 110,
                stock: 80,
                requiresPrescription: true,
                expiryDate: new Date('2025-08-10'),
            },
            {
                name: 'Metformin 500mg',
                image: 'https://images.unsplash.com/photo-1550572017-edb799bc5701?w=500',
                description: 'Used with a proper diet and exercise program to control high blood sugar.',
                manufacturer: 'Sun Pharmaceutical Industries',
                ingredients: ['Metformin Hydrochloride 500mg'],
                usage: 'Take 1 tablet twice daily with meals to reduce stomach/bowel side effects.',
                sideEffects: ['Nausea', 'Vomiting', 'Stomach upset', 'Diarrhea', 'Metallic taste'],
                category: 'Diabetes',
                price: 45,
                stock: 120,
                requiresPrescription: true,
                expiryDate: new Date('2026-03-25'),
            },
            {
                name: 'Cetirizine 10mg',
                image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500',
                description: 'Antihistamine used to relieve allergy symptoms such as watery eyes, runny nose, itching eyes/nose, sneezing.',
                manufacturer: 'Cipla',
                ingredients: ['Cetirizine Hydrochloride 10mg'],
                usage: 'Take 1 tablet daily. May be taken with or without food.',
                sideEffects: ['Drowsiness', 'Tiredness', 'Dry mouth'],
                category: 'Allergies',
                price: 25,
                stock: 300,
                requiresPrescription: false,
                expiryDate: new Date('2027-11-05'),
            }
        ];

        await Medicine.insertMany(sampleMedicines);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();
