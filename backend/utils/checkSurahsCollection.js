const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// تحميل متغيرات البيئة
dotenv.config({ path: path.join(__dirname, '../.env') });

// الاتصال بقاعدة البيانات
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(async connection => {
    console.log('متصل بقاعدة البيانات');

    // طباعة أسماء جميع الجمع (collections) في قاعدة البيانات
    const collections = await connection.connection.db
      .listCollections()
      .toArray();
    console.log('الجمع المتوفرة في قاعدة البيانات:');
    collections.forEach(collection => {
      console.log(` - ${collection.name}`);
    });

    // التحقق من اسم مجموعة السور
    console.log('\nسيتم البحث عن جمع السور...');
    // سنبحث عن جميع المجموعات التي قد تكون للسور
    const possibleNames = [
      'surahs',
      'Surahs',
      'surah',
      'Surah',
      'surahs',
      'FULL-DATA'
    ];
    for (const name of possibleNames) {
      const found = collections.find(c => c.name === name);
      if (found) {
        console.log(`وجدنا جمع محتمل للسور باسم: ${name}`);

        // عرض عينة من البيانات
        const db = connection.connection.db;
        const sample = await db.collection(name).find().limit(1).toArray();
        console.log('عينة من البيانات:');
        console.log(JSON.stringify(sample, null, 2));
      }
    }

    // فحص العدد الإجمالي للوثائق في مجموعة surahs
    const defaultCollection = 'surahs';
    const count = await connection.connection.db
      .collection(defaultCollection)
      .countDocuments();
    console.log(`\nعدد الوثائق في مجموعة ${defaultCollection}: ${count}`);

    process.exit();
  })
  .catch(err => {
    console.error('خطأ في الاتصال بقاعدة البيانات:', err);
    process.exit(1);
  });
