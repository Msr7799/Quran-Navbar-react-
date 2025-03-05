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

    // التحقق من وجود جمع التفسير
    const tafseerCollection = collections.find(c => c.name === 'tafseer');
    if (tafseerCollection) {
      console.log('تم العثور على جمع التفسير!');

      // عرض عينة من بيانات التفسير
      const db = connection.connection.db;
      const tafseerSample = await db
        .collection('tafseer')
        .find()
        .limit(1)
        .toArray();
      console.log('عينة من بيانات التفسير:');
      console.log(JSON.stringify(tafseerSample, null, 2));
    } else {
      console.error('لم يتم العثور على جمع التفسير باسم "tafseer"');
    }

    process.exit();
  })
  .catch(err => {
    console.error('خطأ في الاتصال بقاعدة البيانات:', err);
    process.exit(1);
  });
