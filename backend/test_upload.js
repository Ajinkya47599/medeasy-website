const FormData = require('form-data');
const fs = require('fs');
const http = require('http');

fs.writeFileSync('test.jpg', 'fake image payload');

const form = new FormData();
form.append('image', fs.createReadStream('test.jpg'));

const request = http.request({
    method: 'POST',
    host: 'localhost',
    port: 5000,
    path: '/api/upload',
    headers: form.getHeaders(),
});

form.pipe(request);

request.on('response', (res) => {
    console.log('STATUS:', res.statusCode);
    res.on('data', chunk => console.log('BODY:', chunk.toString()));
});
