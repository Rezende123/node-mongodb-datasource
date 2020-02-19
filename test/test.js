const DataSource = require('../src/index');
const db = new DataSource('URL_CONNECTION');

async function runTest() {

    await db.connectToDatabase();
    
    const data = await db.find('Finantial', 'Refund', {}, {
        include: [{
            model: 'Payment',
            foreignKey: 'payment',
            field: '_payment'
        }],
        limit: 10
    });

    console.log(data);
}

runTest()