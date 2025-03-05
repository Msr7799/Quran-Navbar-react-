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
    console.log(
      'متصل بقاعدة البيانات: ' + connection.connection.db.databaseName
    );

    // إنشاء وثيقة سورة الفاتحة مباشرة في المجموعة
    const surahData = {
      number: 1,
      name: {
        ar: 'الفاتحة',
        en: 'The Opening',
        transliteration: 'Al-Fatihah'
      },
      revelation_place: {
        ar: 'مكية',
        en: 'meccan'
      },
      verses_count: 7,
      words_count: 29,
      letters_count: 139,
      verses: [
        {
          number: 1,
          text: {
            ar: 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ',
            en: 'In the name of Allah, the Entirely Merciful, the Especially Merciful'
          },
          juz: 1,
          page: 1,
          sajda: false
        },
        {
          number: 2,
          text: {
            ar: 'ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ',
            en: '[All] praise is [due] to Allah, Lord of the worlds'
          },
          juz: 1,
          page: 1,
          sajda: false
        }
      ]
    };

    try {
      // استخدام insertOne مباشرة لإدخال البيانات في المجموعة
      const result = await connection.connection.db
        .collection('surahs')
        .insertOne(surahData);
      console.log(
        `تم إدراج بيانات السورة بنجاح. معرف الوثيقة: ${result.insertedId}`
      );

      // التحقق من بيانات التفسير
      const tafsirData = [
        {
          id: 1,
          sura: 1,
          aya: 1,
          text: 'سورة الفاتحة سميت هذه السورة بالفاتحة؛ لأنه يفتتح بها القرآن العظيم...'
        },
        {
          id: 2,
          sura: 1,
          aya: 2,
          text: '(الحَمْدُ للهِ رَبِّ العَالَمِينَ) الثناء على الله بصفاته...'
        }
      ];

      const tafsirResult = await connection.connection.db
        .collection('tafseer')
        .insertMany(tafsirData);
      console.log(
        `تم إدراج بيانات التفسير بنجاح. عدد الوثائق: ${tafsirResult.insertedCount}`
      );

      process.exit(0);
    } catch (error) {
      console.error(`خطأ في إدراج البيانات: ${error.message}`);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error(`خطأ في الاتصال بقاعدة البيانات: ${err.message}`);
    process.exit(1);
  });
