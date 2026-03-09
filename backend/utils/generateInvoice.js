const PDFDocument = require('pdfkit');

const generateInvoice = (order) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            let buffers = [];

            // Catch PDF data
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            // Header
            doc.fillColor('#444444')
                .fontSize(20)
                .text('MedEasy Inc.', 50, 57)
                .fontSize(10)
                .text('123 MedStreet, Healthville, IN 12345', 200, 65, { align: 'right' })
                .text('support@medeasy.com', 200, 80, { align: 'right' })
                .moveDown();

            doc.moveTo(50, 100).lineTo(550, 100).stroke();

            // Order Info
            doc.fontSize(16).fillColor('#000000').text('Invoice / Receipt', 50, 120);
            doc.fontSize(10).text(`Order ID: ${order._id}`, 50, 140);
            doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 50, 155);
            doc.text(`Payment Method: ${order.paymentMethod}`, 50, 170);

            // Customer Info
            doc.fontSize(12).text('Billed To:', 300, 120);
            doc.fontSize(10)
                .text(order.user.name, 300, 140)
                .text(order.user.email, 300, 155)
                .text(`${order.deliveryAddress.address}, ${order.deliveryAddress.city}, ${order.deliveryAddress.postalCode}`, 300, 170);

            doc.moveTo(50, 200).lineTo(550, 200).stroke();

            // Table Header
            let y = 220;
            doc.font('Helvetica-Bold');
            doc.text('Item', 50, y);
            doc.text('Quantity', 280, y, { width: 90, align: 'right' });
            doc.text('Price', 370, y, { width: 90, align: 'right' });
            doc.text('Amount', 460, y, { width: 90, align: 'right' });

            doc.font('Helvetica');
            y += 20;

            // Table Rows
            order.orderItems.forEach(item => {
                doc.text(item.name, 50, y);
                doc.text(item.qty.toString(), 280, y, { width: 90, align: 'right' });
                doc.text(`Rs. ${item.price}`, 370, y, { width: 90, align: 'right' });
                doc.text(`Rs. ${item.price * item.qty}`, 460, y, { width: 90, align: 'right' });
                y += 20;
            });

            doc.moveTo(50, y + 10).lineTo(550, y + 10).stroke();

            // Total
            y += 30;
            doc.font('Helvetica-Bold').fontSize(12);
            doc.text('Total Amount:', 370, y, { width: 90, align: 'right' });
            doc.text(`Rs. ${order.totalAmount}`, 460, y, { width: 90, align: 'right' });

            // Footer
            doc.font('Helvetica').fontSize(10).fillColor('gray');
            doc.text('Thank you for choosing MedEasy for your healthcare needs.', 50, 700, { align: 'center', width: 500 });

            // Finalize PDF file
            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = generateInvoice;
