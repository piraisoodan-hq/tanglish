export const TEST_CASES = [
  // Greetings & Basics
  { input: 'vanakkam', expected: 'வணக்கம்' },
  { input: 'nandri', expected: 'நன்றி' },
  { input: 'kaalai vanakkam', expected: 'காலை வணக்கம்' },

  // Pronouns
  { input: 'naan', expected: 'நான்' },
  { input: 'neenga', expected: 'நீங்க' },
  { input: 'avanga', expected: 'அவங்க' },

  // Questions
  { input: 'enna', expected: 'என்ன' },
  { input: 'eppadi', expected: 'எப்படி' },
  { input: 'yenga', expected: 'எங்க' },

  // Verbs (Colloquial endings)
  { input: 'saaptingalaa', expected: 'சாப்டிங்கலா' },
  { input: 'varala', expected: 'வரல' },
  { input: 'theriyathu', expected: 'தெரியது' },
  { input: 'puriyala', expected: 'புரியல' },

  // Contextual 'n' (Dental vs Alveolar)
  { input: 'intha', expected: 'இந்த' },
  { input: 'antha', expected: 'அந்த' },
  { input: 'panthu', expected: 'பந்து' },
  { input: 'vanthu', expected: 'வந்து' },

  // Contextual 'l' / 'zh'
  { input: 'palam', expected: 'பலம்' },
  { input: 'pazham', expected: 'பழம்' },
  { input: 'paalam', expected: 'பாலம்' },

  // Sentences
  { input: 'ennanga eppadi irukkeenga', expected: 'என்னங்க எப்படி இருக்கீங்க' },
  { input: 'naan nalla irukken', expected: 'நான் நல்ல இருக்கென்' },
  { input: 'saappaadu nalla irukku', expected: 'சாப்பாடு நல்ல இருக்கு' },
  { input: 'Konja neram wait pannunga naa class a mudichittu kilambiruven', expected: 'கொஞ்ச நேரம் வைட் பண்ணுங்க நா கிளாஸ் அ முடிச்சிட்டு கிலம்பிருவென்' }
];
