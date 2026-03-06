import { Song } from '../types';

export const initialSongs: Song[] = [
  // Hymnal Songs
  {
    id: 1,
    number: '001',
    category: 'hymnal',
    titleAmharic: 'እግዚአብሔር ሆይ ምሕረትህ',
    titleEnglish: 'O God, Your Mercy',
    lyrics: [
      'እግዚአብሔር ሆይ ምሕረትህ\nበሰማይ ላይ ደረሰ\nእምነትህም እስከ ደመና\nይደርሳል ምንም ሳይለወጥ',
      'ጽድቅህ እንደ ተራሮች ተራራ ነው\nፍርድህም እንደ ታላቅ ጥልቅ\nእግዚአብሔር ሆይ ሰውንና እንስሳን\nታድናለህ በምሕረትህ',
      'በምድር ላይ ያሉት ሰዎች\nበክንፍህ ጥላ ይተማመናሉ\nከቤትህ ጣፋጭነት ይጠግባሉ\nከደስታህ ወንዝ ታጠጣቸዋለህ'
    ],
    metadata: {
      creator: 'Traditional',
      uploader: 'Admin',
      updatedDate: '2024-12-02'
    }
  },
  {
    id: 2,
    number: '015',
    category: 'hymnal',
    titleAmharic: 'ጌታ እረኛዬ ነው',
    titleEnglish: 'The Lord is My Shepherd',
    lyrics: [
      'ጌታ እረኛዬ ነው\nምንም አልጎደለኝም\nበለምለም ሜዳ ያሳድረኛል\nወደ ጸጥታ ውሃም ይመራኛል',
      'ነፍሴን ያድሳል\nበጽድቅ መንገድ ይመራኛል\nበስሙ ምክንያት\nክብሩን ለማስመዝገብ',
      'በሞት ጥላ ሸለቆም ብሄድ\nመከራን አልፈራም\nአንተ ከእኔ ጋር ነህና\nበትርህና በመንትሌህ\nታጽናኛለህ'
    ],
    metadata: {
      creator: 'Traditional',
      uploader: 'Admin',
      updatedDate: '2024-12-02'
    }
  },
  {
    id: 3,
    number: '023',
    category: 'hymnal',
    titleAmharic: 'ክብር ለአብ ለወልድ',
    titleEnglish: 'Glory to the Father',
    lyrics: [
      'ክብር ለአብ ለወልድ\nለመንፈስ ቅዱስ\nበመሰረቱ ያለ\nአሁንም ሁሌም',
      'ለዘላለምም ዓለም\nያለ ፍጻሜ\nኧረ እናት ቅድስት ድንግል\nማርያም ለእኛ ጸልይ',
      'በምድር ሰላም\nለሰው ደግሞ መልካም ሰዎች\nምሕረትህን በእኛ ላይ አደርግ\nወይም እኛ ሰላምህን እንቀበላለን'
    ],
    metadata: {
      creator: 'Traditional',
      uploader: 'Admin',
      updatedDate: '2024-12-02'
    }
  },
  {
    id: 4,
    number: '042',
    category: 'hymnal',
    titleAmharic: 'ሃሌሉያ አመስግኑ',
    titleEnglish: 'Hallelujah Praise Him',
    lyrics: [
      'ሃሌሉያ አመስግኑ\nእግዚአብሔርን በቅድስና\nአመስግኑት በኃይሉ ጠንካራነት',
      'በኃያላን ተግባሮቹ አመስግኑት\nእንደ ታላቅነቱ ብዛት አመስግኑት',
      'በመለከት ድምፅ አመስግኑት\nበዜማና በከበሮ አመስግኑት\nአመስግኑት በጭፈራና በመዝሙር',
      'መንፈስ ያለው ሁሉ\nእግዚአብሔርን ያመስግን\nሃሌሉያ!'
    ],
    metadata: {
      creator: 'Traditional',
      uploader: 'Admin',
      updatedDate: '2024-12-02'
    }
  },
  {
    id: 5,
    number: '078',
    category: 'hymnal',
    titleAmharic: 'በእግዚአብሔር ታመንበት',
    titleEnglish: 'Trust in the Lord',
    lyrics: [
      'በእግዚአብሔር በምሉ ልብህ ታመንበት\nበራስህ ግንዛቤ አትተማመን\nበሁሉ መንገዶችህ አውቀው\nእርሱም መንገዶችህን ያቅናል',
      'በዓይንህ ጥበበኛ አትሁን\nእግዚአብሔርን ፍራ\nከክፉም ራቅ\nለሰውነትህ ፈውስ ይሆንልሃል',
      'በሀብትህ እግዚአብሔርን አክብር\nከሁሉ ፍሬዎችህ የመጀመሪያ ውጤትም\nጓሮዎችህ በብዛት ይሞላሉ\nወፍጮዎችህም በአዲስ ወይን ይታጠፋሉ'
    ],
    metadata: {
      creator: 'Traditional',
      uploader: 'Admin',
      updatedDate: '2024-12-02'
    }
  },

  // Local Songs
  {
    id: 6,
    number: '101',
    category: 'local',
    titleAmharic: 'የኔ ደስታ የኔ ተስፋ',
    titleEnglish: 'My Joy, My Hope',
    lyrics: [
      'የኔ ደስታ የኔ ተስፋ\nየኔ አምላክ ኢየሱስ\nየኔ ብርሃን የኔ ኃይል\nመድኃኒቴ ኢየሱስ',
      'በእምነት አገኘሁት\nበጸሎት አመስግነዋለሁ\nበውድቀቴ አነሳኝ\nበሕይወቴ ይመራኛል',
      'ሃሌሉያ ክብር ለእርሱ\nሃሌሉያ ቅዱስ ነው\nሃሌሉያ አመሰግናለሁ\nለዘላለም እወድሃለሁ'
    ],
    metadata: {
      creator: 'Kebena Church',
      uploader: 'Admin',
      updatedDate: '2024-12-02'
    }
  },
  {
    id: 7,
    number: '105',
    category: 'local',
    titleAmharic: 'እንዴት እመስግንህ',
    titleEnglish: 'How Can I Thank You',
    lyrics: [
      'እንዴት እመስግንህ\nእግዚአብሔር አምላኬ\nለምሕረትህ ለፍቅርህ\nለታማኝነትህ ሁሉ',
      'ወደ ሞት ሳለፍ\nነፃ አወጣኸኝ\nበደምህ በዋዛህ\nኃጢአቴን አጥብህ',
      'አሁን ልቤ ያመሰግንሃል\nነፍሴ ታከብርሃለች\nለዘላለም ዓለም\nስምህን እከብራለሁ'
    ],
    metadata: {
      creator: 'Kebena Church',
      uploader: 'Admin',
      updatedDate: '2024-12-02'
    }
  },
  {
    id: 8,
    number: '112',
    category: 'local',
    titleAmharic: 'ተመልከት ምን ያህል ይወድናል',
    titleEnglish: 'Behold How He Loves Us',
    lyrics: [
      'ተመልከት ምን ያህል ይወድናል\nእግዚአብሔር አምላካችን\nልጆቹ እንድንሆን ጠራን\nበዳግም ልደት አዲስ አደረገን',
      'በመንፈስ ቅዱስ ኃይል\nአንተ ጋር እንኖራለን\nምስክርነትህን እንሸከማለን\nፍቅርህን እናካፍላለን',
      'ዓለም ማወቅ አይችልም\nምክንያቱም አንተን አያውቀውምና\nግን እኛ የምንወድህ ልጆችህ\nክብርህን እናንፀባርቃለን'
    ],
    metadata: {
      creator: 'Kebena Church',
      uploader: 'Admin',
      updatedDate: '2024-12-02'
    }
  },
  {
    id: 9,
    number: '118',
    category: 'local',
    titleAmharic: 'መንፈስ ቅዱስ ንገረኝ',
    titleEnglish: 'Holy Spirit Speak to Me',
    lyrics: [
      'መንፈስ ቅዱስ ንገረኝ\nበሁሉ መንገዶቼ\nይመራኝ በእውነት\nበፍቅር በስላም',
      'አብራኝ አብራኝ\nበዚህ ሕይወቴ ጉዞ\nክብርህን አሳየኝ\nኃይልህን አጠናክረኝ',
      'ተስፋ የለሽ ሰዎችን አንተን አሳያቸው\nተሰብሯል ላሉት ፈውስህን አድርግ\nበአንተ ሁሌ እኖራለሁ\nበዘመናት ሁሉ'
    ],
    metadata: {
      creator: 'Kebena Church',
      uploader: 'Admin',
      updatedDate: '2024-12-02'
    }
  },
  {
    id: 10,
    number: '125',
    category: 'local',
    titleAmharic: 'ከአንተ ጋር እኖራለሁ',
    titleEnglish: 'I Will Dwell With You',
    lyrics: [
      'ከአንተ ጋር እኖራለሁ\nእግዚአብሔር አምላኬ\nበቤትህ እቆያለሁ\nለዘላለም ዘመን',
      'በፊትህ እጨፍራለሁ\nበደስታ እዘምራለሁ\nስምህን እከብራለሁ\nክብርህን እናገራለሁ',
      'በምድር ላይ ምንም ነገር\nከአንተ ፍቅር ሊለየኝ አይችልም\nበሰማይም በምድርም\nአንተን ብቻ እወዳለሁ'
    ],
    metadata: {
      creator: 'Kebena Church',
      uploader: 'Admin',
      updatedDate: '2024-12-02'
    }
  }
];
