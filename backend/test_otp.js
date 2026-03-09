const http = require('http');

async function testFlow() {
    try {
        console.log("1. Sending OTP to test email...");

        const sendOtpReq = await fetch('http://localhost:5000/api/users/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'ajinkyasmohite2006@gmail.com' })
        });

        const res1 = await sendOtpReq.json();
        console.log("Response 1:", res1);

        console.log("2. Waiting 2 seconds to check logs manually (we will just fake the OTP check by reading DB in real code, but here we can just query MongoDB directly to get the OTP!)");

        const mongoose = require('mongoose');
        const OTP = require('./models/OTP');
        const dotenv = require('dotenv');
        dotenv.config();

        await mongoose.connect(process.env.MONGO_URI);
        const otpRecord = await OTP.findOne({ email: 'ajinkyasmohite2006@gmail.com' });
        console.log("Found OTP in DB:", otpRecord.otp);

        console.log("3. Registering user with correct OTP...");
        const registerReq = await fetch('http://localhost:5000/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Test OTP User",
                email: "ajinkyasmohite2006@gmail.com",
                password: "Password1!",
                phone: "+919876543210",
                address: "Test Address",
                otp: otpRecord.otp
            })
        });

        const res2 = await registerReq.json();
        console.log("Registration Response:", res2);

        if (registerReq.ok) {
            console.log("✅ Registration successful!");
        } else {
            console.log("❌ Registration failed!");
        }

        console.log("4. Clean up test user");
        const User = require('./models/User');
        await User.deleteOne({ email: "ajinkyasmohite2006@gmail.com" });
        await mongoose.disconnect();

    } catch (e) {
        console.error("Test failed", e);
    }
}

testFlow();
