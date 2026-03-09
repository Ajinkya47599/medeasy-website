const http = require('http');

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/users/send-otp',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (d) => {
        data += d;
    });
    res.on('end', () => {
        console.log("Response:", data);
    });
});

req.on('error', (e) => {
    console.error(e);
});

req.write(JSON.stringify({ email: 'testotp2@example.com' }));
req.end();
