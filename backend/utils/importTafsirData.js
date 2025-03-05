const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import Tafsir model
const Tafsir = require('../models/tafsirModel');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Import sample tafsir data
const importData = async () => {
  try {
    // Sample tafsir data for Surah Al-Fatiha, verses 1 and 2
    const tafsirData = [
      {
        id: 1,
        sura: 1,
        aya: 1,
        text: 'سورة الفاتحة سميت هذه السورة بالفاتحة؛ لأنه يفتتح بها القرآن العظيم، وتسمى المثاني؛ لأنها تقرأ في كل ركعة، ولها أسماء أخر. أبتدئ قراءة القرآن باسم الله مستعينا به، (اللهِ) علم على الرب -تبارك وتعالى- المعبود بحق دون سواه، وهو أخص أسماء الله تعالى، ولا يسمى به غيره سبحانه. (الرَّحْمَنِ) ذي الرحمة العامة الذي وسعت رحمته جميع الخلق، (الرَّحِيمِ) بالمؤمنين، وهما اسمان من أسمائه تعالى، يتضمنان إثبات صفة الرحمة لله تعالى كما يليق بجلاله.'
      },
      {
        id: 2,
        sura: 1,
        aya: 2,
        text: '(الحَمْدُ للهِ رَبِّ العَالَمِينَ) الثناء على الله بصفاته التي كلُّها أوصاف كمال، وبنعمه الظاهرة والباطنة، الدينية والدنيوية، وفي ضمنه أَمْرٌ لعباده أن يحمدوه، فهو المستحق له وحده، وهو سبحانه المنشئ للخلق، القائم بأمورهم، المربي لجميع خلقه بنعمه، ولأوليائه بالإيمان والعمل الصالح.'
      }
    ];

    // Clear existing tafsir data for these verses to avoid duplicates
    await Tafsir.deleteMany({ sura: 1, aya: { $in: [1, 2] } });

    // Insert the new tafsir data
    const result = await Tafsir.insertMany(tafsirData);

    console.log(
      `Tafsir data imported successfully! Inserted ${result.length} documents`
    );
    process.exit();
  } catch (error) {
    console.error(`Error importing tafsir data: ${error.message}`);
    process.exit(1);
  }
};

// Run the import function
importData();
