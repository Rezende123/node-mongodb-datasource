const DataSource = require('../index');
const db = new DataSource('mongodb+srv://developer:6gds943jfl0cASCsa@cluster0-vbuib.mongodb.net');

async function runTest() {

    await db.connectToDatabase();
    
    const data = await db.find('Finantial', 'Refund', {  }, {
        include: [{
            relation: '_payment',
            scope: {
                fields: ['lastDigits', 'firstDigits']
            }
        }]
    });

    console.log(data);
}

runTest()