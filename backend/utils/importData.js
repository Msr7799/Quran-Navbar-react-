const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import Surah model
const Surah = require('../models/surahModel');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Import sample data (Surah Al-Fatiha)
const importData = async () => {
  try {
    // Sample data for Surah Al-Fatiha
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
        },
        {
          number: 3,
          text: {
            ar: 'ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ',
            en: 'The Entirely Merciful, the Especially Merciful'
          },
          juz: 1,
          page: 1,
          sajda: false
        },
        {
          number: 4,
          text: {
            ar: 'مَٰلِكِ يَوۡمِ ٱلدِّينِ',
            en: 'Sovereign of the Day of Recompense'
          },
          juz: 1,
          page: 1,
          sajda: false
        },
        {
          number: 5,
          text: {
            ar: 'إِيَّاكَ نَعۡبُدُ وَإِيَّاكَ نَسۡتَعِينُ',
            en: 'It is You we worship and You we ask for help'
          },
          juz: 1,
          page: 1,
          sajda: false
        },
        {
          number: 6,
          text: {
            ar: 'ٱهۡدِنَا ٱلصِّرَٰطَ ٱلۡمُسۡتَقِيمَ',
            en: 'Guide us to the straight path'
          },
          juz: 1,
          page: 1,
          sajda: false
        },
        {
          number: 7,
          text: {
            ar: 'صِرَٰطَ ٱلَّذِينَ أَنۡعَمۡتَ عَلَيۡهِمۡ غَيۡرِ ٱلۡمَغۡضُوبِ عَلَيۡهِمۡ وَلَا ٱلضَّآلِّينَ',
            en: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray'
          },
          juz: 1,
          page: 1,
          sajda: false
        }
      ],
      audio: [
        {
          id: 1,
          reciter: {
            ar: 'أحمد الحواشي',
            en: 'Ahmed Al-Hawashi'
          },
          rewaya: {
            ar: 'حفص عن عاصم',
            en: 'Hafs on the authority of Asim'
          },
          server: 'https://server11.mp3quran.net/hawashi',
          link: 'https://server11.mp3quran.net/hawashi/001.mp3'
        },
        {
          id: 2,
          reciter: {
            ar: 'أحمد السويلم',
            en: 'Ahmed Al-Suwailem'
          },
          rewaya: {
            ar: 'حفص عن عاصم',
            en: 'Hafs on the authority of Asim'
          },
          server: 'https://server14.mp3quran.net/swlim/Rewayat-Hafs-A-n-Assem/',
          link: 'https://server14.mp3quran.net/swlim/Rewayat-Hafs-A-n-Assem//001.mp3'
        }
      ]
    };

    // Clear existing data
    await Surah.deleteMany({});

    // Insert the new data
    const createdSurah = await Surah.create(surahData);

    console.log(
      `Data imported successfully! Created Surah: ${createdSurah.name.en}`
    );
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

// Run the import function
importData();
