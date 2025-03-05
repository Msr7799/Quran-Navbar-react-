const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// تحميل متغيرات البيئة
dotenv.config({ path: path.join(__dirname, '../.env') });

const exploreDB = async () => {
  try {
    // الاتصال بقاعدة البيانات
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('========================================');
    console.log('تم الاتصال بقاعدة البيانات بنجاح!');
    console.log(`اسم قاعدة البيانات: ${conn.connection.db.databaseName}`);
    console.log('========================================\n');

    // عرض قائمة المجموعات
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('المجموعات الموجودة في قاعدة البيانات:');
    console.log('----------------------------------------');

    for (const collection of collections) {
      const count = await conn.connection.db
        .collection(collection.name)
        .countDocuments();
      console.log(`${collection.name}: ${count} وثيقة`);

      // عرض عينة من البيانات للمجموعات التي تحتوي على بيانات
      if (count > 0) {
        const sample = await conn.connection.db
          .collection(collection.name)
          .find()
          .limit(1)
          .toArray();

        console.log(`\nعينة من ${collection.name}:`);
        // إظهار بنية البيانات (مفاتيح الوثيقة الأولى)
        const keys = Object.keys(sample[0]).filter(k => k !== '_id');
        console.log(`المفاتيح: ${keys.join(', ')}`);

        // إذا كان هناك حقل number أو id، نفترض أنه قد يكون السورة أو التفسير
        if (sample[0].number || sample[0].id) {
          console.log('محتويات العينة:');
          console.log(
            JSON.stringify(sample[0], null, 2).substring(0, 300) + '...'
          );
        }
      }
      console.log('----------------------------------------');
    }

    process.exit();
  } catch (error) {
    console.error(`خطأ في استكشاف قاعدة البيانات: ${error.message}`);
    process.exit(1);
  }
};

exploreDB();
