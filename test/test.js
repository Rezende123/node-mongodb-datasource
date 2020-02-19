const DataSource = require('../src/index');
const db = new DataSource('mongodb+srv://developer:6gds943jfl0cASCsa@cluster0-vbuib.mongodb.net');

async function runTest() {

    await db.connectToDatabase();
    
    const data = await db.find('Finantial', 'Refund', {}, {
        include: [{
            model: 'Payment',
            foreignKey: 'payment',
            field: '_payment',
            scope: {
                fields: ['lastDigits', 'firstDigits']
            }
        }],
        limit: 10
    });

    console.log(data);
}

runTest()