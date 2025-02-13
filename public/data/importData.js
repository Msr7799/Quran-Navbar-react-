// import fs from 'fs';
// import csv from 'csv-parser';
// import { MongoClient } from 'mongodb';

// const uri = 'YOUR_DATA_BASE_URI'; /
// const client = new MongoClient(uri);

// async function run() {
//   try {
//     await client.connect();
//     const database = client.db('quranDB'); // استبدل هذا باسم قاعدة البيانات الخاصة بك
//     const collection = database.collection('quranData'); // استبدل هذا باسم المجموعة الخاصة بك

//     const results = [];

//     fs.createReadStream(
//         'PATH/TO/YOUR/FILE',
        
        
//     )
//       .pipe(csv())
//       .on('data', data => results.push(data))
//       .on('end', async () => {
//         await collection.insertMany(results);
//         console.log('Data imported successfully');
//         await client.close();
//       });
//   } catch (err) {
//     console.error(err);
//   }
// }

// run();