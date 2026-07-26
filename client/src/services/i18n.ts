export type Language = 'en' | 'he';

export interface TranslationDictionary {
  // Header
  digitalSanctuary: string;
  code: string;
  generate: string;
  partnerConnected: string;
  waitingPartner: string;
  tabDiscovery: string;
  tabMatches: string;
  tabChallenges: string;
  tabAria: string;
  
  // Onboarding Step 1
  onboardingStep1Title: string;
  onboardingStep1Sub: string;
  googleSignInBtn: string;
  googleSignedInAs: string;
  sexyAliasLabel: string;
  sexyAliasPlaceholder: string;
  intimacyRoleLabel: string;
  roleGiver: string;
  roleGiverSub: string;
  roleReceiver: string;
  roleReceiverSub: string;
  roleSwitch: string;
  roleSwitchSub: string;

  // Onboarding Step 2
  onboardingStep2Title: string;
  onboardingStep2Sub: string;

  // Onboarding Step 3
  onboardingStep3Title: string;
  onboardingStep3Sub: string;
  intensityLabel: string;
  intensityVanilla: string;
  intensitySpicy: string;
  intensityAdventurous: string;
  safewordTitle: string;
  safewordSub: string;

  // Onboarding Step 4
  onboardingStep4Title: string;
  onboardingStep4Sub: string;
  yourCoupleCode: string;
  copyInviteLink: string;
  linkCopied: string;
  scanQR: string;
  orEnterCode: string;
  connect: string;
  completeSetupBtn: string;

  // Common Buttons
  back: string;
  continue: string;

  // Discovery Swiper
  filterTitle: string;
  allCategories: string;
  allIntensities: string;
  roleGiverBadge: string;
  roleReceiverBadge: string;
  noPrivacyFootnote: string;
  btnNo: string;
  btnMaybe: string;
  btnYes: string;
  quizCompletedTitle: string;
  quizCompletedSub: string;
  viewMatchesBtn: string;
  restartQuizBtn: string;

  // Matches
  matchesTitle: string;
  matchesSub: string;
  filterAll: string;
  filterYes: string;
  filterMaybe: string;
  badgeMutualMatch: string;
  badgeMutualMaybe: string;
  badgeTentativeMatch: string;
  complementaryRoles: string;
  favoriteBtn: string;
  noMatchesTitle: string;
  noMatchesSub: string;

  // Challenges
  challengesTitle: string;
  challengesSub: string;
  rewardPoints: string;
  newChallengeBtn: string;
  statusPending: string;
  statusCompleted: string;
  statusExpired: string;
  noChallengesTitle: string;
  noChallengesSub: string;
  issueChallengeModalTitle: string;
  challengeTitleLabel: string;
  challengeDescLabel: string;
  durationLabel: string;

  // Aria & Scenario
  scenarioTab: string;
  ariaTab: string;
  scenarioTitle: string;
  scenarioSub: string;
  selectIntensity: string;
  generateScenarioBtn: string;
  stepNumber: string;
  ariaHeaderTitle: string;
  ariaHeaderSub: string;
  ariaWelcomeMsg: string;
  askPlaceholder: string;
  sendBtn: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    digitalSanctuary: 'Digital Sanctuary • Encrypted',
    code: 'Code:',
    generate: 'Generate',
    partnerConnected: 'Partner Connected',
    waitingPartner: 'Waiting for Partner',
    tabDiscovery: 'Discovery',
    tabMatches: 'Matches',
    tabChallenges: 'Challenges',
    tabAria: 'Aria AI',

    onboardingStep1Title: 'Step 1: Google Account & Secret Alias',
    onboardingStep1Sub: 'Sign in with your Google account for 1-to-1 unique identity, and choose an anonymous sexy nickname.',
    googleSignInBtn: 'Sign in with Google',
    googleSignedInAs: 'Signed in as:',
    sexyAliasLabel: 'Sexy Nickname / Alias:',
    sexyAliasPlaceholder: 'e.g. Velvet Goddess, Shadow Prince, Silk Siren',
    intimacyRoleLabel: 'Preferred Intimacy Role:',
    roleGiver: 'Dominant / Giver',
    roleGiverSub: 'Taking control',
    roleReceiver: 'Submissive / Receiver',
    roleReceiverSub: 'Surrendering',
    roleSwitch: 'Switch / Versatile',
    roleSwitchSub: 'Both roles',

    onboardingStep2Title: 'Step 2: Select Favorite Categories',
    onboardingStep2Sub: 'Select the fantasy categories you are interested in exploring together.',

    onboardingStep3Title: 'Step 3: Boundaries & Intensity',
    onboardingStep3Sub: 'Define your preferred intensity level and agree to fundamental safety principles.',
    intensityLabel: 'Preferred Intensity Level:',
    intensityVanilla: 'Vanilla & Mild',
    intensitySpicy: 'Spicy & Hot',
    intensityAdventurous: 'Adventurous & Bold',
    safewordTitle: 'Safeword & Consent Agreement',
    safewordSub: 'I agree that Red means stop immediately, Yellow means slow down, and Green means continue.',

    onboardingStep4Title: 'Step 4: Anonymous Couple Pairing',
    onboardingStep4Sub: "Share your invite link or enter your partner's code to unlock mutual matches.",
    yourCoupleCode: 'Your Unique Couple Code:',
    copyInviteLink: 'Copy Partner Invite Link',
    linkCopied: 'Link Copied!',
    scanQR: "Scan QR from partner's phone",
    orEnterCode: "Or enter partner's pair code:",
    connect: 'Connect',
    completeSetupBtn: 'Complete Setup & Enter Sanctuary',

    back: 'Back',
    continue: 'Continue',

    filterTitle: 'Filter Category & Intensity:',
    allCategories: 'All Categories',
    allIntensities: 'All Intensity Levels',
    roleGiverBadge: 'Role: Giver / Dominant',
    roleReceiverBadge: 'Role: Receiver / Submissive',
    noPrivacyFootnote: '"NO" answers are client-encrypted & strictly hidden from your partner',
    btnNo: 'NO 🔒',
    btnMaybe: 'MAYBE 🤔',
    btnYes: 'YES! 💖',
    quizCompletedTitle: 'Quiz Completed!',
    quizCompletedSub: 'You have evaluated all items in this category. Check "Matches" to see your verified mutual interests.',
    viewMatchesBtn: 'View Mutual Matches',
    restartQuizBtn: 'Restart Quiz',

    matchesTitle: 'Verified Mutual Matches',
    matchesSub: 'Exclusively displaying desires where both partners selected "YES" or "MAYBE". Declined items remain unrevealed.',
    filterAll: 'All',
    filterYes: 'Mutual YES',
    filterMaybe: 'Mutual MAYBE',
    badgeMutualMatch: 'Mutual Match 💖',
    badgeMutualMaybe: 'Mutual Maybe 🤔',
    badgeTentativeMatch: 'Tentative Match 💡',
    complementaryRoles: 'Complementary Roles: Giver & Receiver',
    favoriteBtn: 'Favorite',
    noMatchesTitle: 'No Mutual Matches Yet',
    noMatchesSub: 'Complete the Discovery Quiz in the first tab. Once both partners select "YES" or "MAYBE" for an item, it will automatically appear here!',

    challengesTitle: 'Intimacy Challenges & Rewards',
    challengesSub: 'Issue timed dares (24-48 hours). Completing dares earns reward points on your couple ledger!',
    rewardPoints: 'Reward Points:',
    newChallengeBtn: 'New Challenge',
    statusPending: 'Pending Execution',
    statusCompleted: 'Completed!',
    statusExpired: 'Expired',
    noChallengesTitle: 'No Active Challenges',
    noChallengesSub: 'Click "New Challenge" to issue a timed dare to your partner.',
    issueChallengeModalTitle: 'Issue New Intimacy Challenge',
    challengeTitleLabel: 'Challenge Title:',
    challengeDescLabel: 'Description & Guidelines:',
    durationLabel: 'Duration Limit:',

    scenarioTab: 'Evening Scenario Generator',
    ariaTab: 'Aria AI Coach',
    scenarioTitle: 'Custom Evening Scenario Generator',
    scenarioSub: 'Synthesizes your verified mutual matches into a tailored 4-step romantic progression for tonight.',
    selectIntensity: 'Select Intensity:',
    generateScenarioBtn: 'Generate Evening Scenario',
    stepNumber: 'Step',
    ariaHeaderTitle: 'Aria AI Intimacy Guide',
    ariaHeaderSub: 'Private, non-judgmental couples advisor',
    ariaWelcomeMsg: "Hello, I'm Aria — your AI intimacy & communication guide. Ask me anything about exploring boundaries, discussing fantasies with your partner, or introducing new ideas safely.",
    askPlaceholder: 'Ask Aria anything...',
    sendBtn: 'Send'
  },
  he: {
    digitalSanctuary: 'סביבה מוצפנת ואינטימית',
    code: 'קוד:',
    generate: 'צור קוד',
    partnerConnected: 'בן/בת הזוג מחוברים',
    waitingPartner: 'ממתין לצימוד זוגי',
    tabDiscovery: 'גילוי העדפות',
    tabMatches: 'התאמות',
    tabChallenges: 'אתגרים',
    tabAria: 'אריאל AI',

    onboardingStep1Title: 'שלב 1: חשבון Google וכינוי סקסי',
    onboardingStep1Sub: 'התחברו עם חשבון גוגל לזיהוי חד-ערכי ייחודי, ובחרו כינוי אנונימי שיוצג לבן/בת הזוג.',
    googleSignInBtn: 'התחברות מהירה באמצעות Google',
    googleSignedInAs: 'מחובר כחשבון:',
    sexyAliasLabel: 'כינוי סקסי / אנונימי:',
    sexyAliasPlaceholder: 'למשל: נסיך האופל, אלילת המשי, מאהב מסתורי',
    intimacyRoleLabel: 'תפקיד דינמי מועדף:',
    roleGiver: 'שולט / מעניק',
    roleGiverSub: 'לקיחת שליטה',
    roleReceiver: 'נשלט / מקבל',
    roleReceiverSub: 'תשוקה והתמסרות',
    roleSwitch: 'משתנה / ורסטילי',
    roleSwitchSub: 'שני התפקידים',

    onboardingStep2Title: 'שלב 2: בחירת קטגוריות מועדפות',
    onboardingStep2Sub: 'סמנו את הקטגוריות והפנטזיות שתרצו לחקור יחד.',

    onboardingStep3Title: 'שלב 3: גבולות ועוצמה',
    onboardingStep3Sub: 'הגדירו את רמת העוצמה המבוקשת ואשרו את הסכם הבטיחות.',
    intensityLabel: 'רמת עוצמה מועדפת:',
    intensityVanilla: 'מעודן (ווניל)',
    intensitySpicy: 'פילפלי ולוהט',
    intensityAdventurous: 'הרפתקני ונועז',
    safewordTitle: 'הסכם מילות בטיחות והסכמה',
    safewordSub: 'אני מאשר/ת שאדום פירושו עצירה מיידית, צהוב פירושו האטה, וירוק פירושו להמשיך.',

    onboardingStep4Title: 'שלב 4: צימוד זוגי אנונימי',
    onboardingStep4Sub: 'שתפו את קישור ההזמנה או הזינו את הקוד של בן/בת הזוג לגילוי התאמות.',
    yourCoupleCode: 'קוד הצימוד הייחודי שלכם:',
    copyInviteLink: 'העתק קישור הזמנה לזוג',
    linkCopied: 'הקישור הועתק!',
    scanQR: 'סריקת קוד QR מהטלפון השני',
    orEnterCode: 'או הזן קוד צימוד של בן/בת הזוג:',
    connect: 'תחבר',
    completeSetupBtn: 'סיום הרשמה וכניסה לאפליקציה',

    back: 'חזרה',
    continue: 'המשך',

    filterTitle: 'סינון לפי קטגוריה ועוצמה:',
    allCategories: 'כל הקטגוריות',
    allIntensities: 'כל דרגות העוצמה',
    roleGiverBadge: 'תפקיד: מעניק / שולט',
    roleReceiverBadge: 'תפקיד: מקבל / נשלט',
    noPrivacyFootnote: 'תשובות "לא" מוצפנות באופן מוחלט ומוסתרות מבן/בת הזוג',
    btnNo: 'לא 🔒',
    btnMaybe: 'אולי 🤔',
    btnYes: 'כן! 💖',
    quizCompletedTitle: 'השאלון הושלם!',
    quizCompletedSub: 'עברת על כל הפריטים בקטגוריה זו. עברו לטאב "התאמות" לצפייה ברצונות המשותפים!',
    viewMatchesBtn: 'צפייה בהתאמות משותפות',
    restartQuizBtn: 'התחל שאלון מחדש',

    matchesTitle: 'התאמות זוגיות מאומתות',
    matchesSub: 'תצוגה בלעדית של תשוקות בהן שני בני הזוג בחרו "כן" או "אולי". רצונות שסורבו נשארים חסויים.',
    filterAll: 'הכל',
    filterYes: 'כן משותף',
    filterMaybe: 'אולי משותף',
    badgeMutualMatch: 'התאמה מלאה 💖',
    badgeMutualMaybe: 'התאמה כמעט 💡',
    badgeTentativeMatch: 'התאמה משולבת 💡',
    complementaryRoles: 'תפקידים משלימים: מעניק ומקבל',
    favoriteBtn: 'מועדף',
    noMatchesTitle: 'אין עדיין התאמות משותפות',
    noMatchesSub: 'מלאו את השאלון בטאב הראשון. ברגע ששני בני הזוג יבחרו "כן" או "אולי", ההתאמה תופיע כאן!',

    challengesTitle: 'אתגרים זוגיים ופרסים',
    challengesSub: 'שלחו אתגרים מוגבלי זמן (24-48 שעות). ביצוע אתגר מזכה בנקודות פרס זוגיות!',
    rewardPoints: 'נקודות פרס:',
    newChallengeBtn: 'אתגר חדש',
    statusPending: 'ממתין לביצוע',
    statusCompleted: 'בוצע בהצלחה!',
    statusExpired: 'פג תוקף',
    noChallengesTitle: 'אין אתגרים פעילים',
    noChallengesSub: 'לחצו על "אתגר חדש" כדי לשלוח משימה רומנטית לבן/בת הזוג.',
    issueChallengeModalTitle: 'יצירת אתגר זוגי חדש',
    challengeTitleLabel: 'כותרת האתגר:',
    challengeDescLabel: 'הוראות והנחיות:',
    durationLabel: 'זמן מוקצב:',

    scenarioTab: 'מחולל תרחישי ערב',
    ariaTab: 'אריאל AI ייעוץ',
    scenarioTitle: 'מחולל תרחישים זוגיים לערב',
    scenarioSub: 'משלב את ההתאמות המשותפות שלכם לתרחיש רומנטי ב-4 שלבים.',
    selectIntensity: 'בחירת עוצמה:',
    generateScenarioBtn: 'צור תרחיש רומנטי לערב',
    stepNumber: 'שלב',
    ariaHeaderTitle: 'אריאל AI - יועצת אינטימיות',
    ariaHeaderSub: 'ייעוץ זוגי דיסקרטי ללא שיפוטיות',
    ariaWelcomeMsg: 'שלום, אני אריאל — יועצת התקשורת והאינטימיות שלכם. שאלו אותי כל דבר על גבולות, שיחה על פנטזיות או רעיונות חדשים לחדר המיטות.',
    askPlaceholder: 'שאלו את אריאל כל דבר...',
    sendBtn: 'שלח'
  }
};

// Comprehensive Hebrew Translation Dictionary for QuestionCatalog (All DB Items)
const catalogTranslationsHeByTitle: Record<string, { title: string; description: string; category?: string }> = {
  "Sensual Oil Massage": {
    title: "עיסוי שמן חושי",
    description: "מתן או קבלת עיסוי שמן חם לכל הגוף לאור נרות.",
    category: "חושים ומגע"
  },
  "Mutual Bath / Shower Romance": {
    title: "אמבטיה/מקלחת רומנטית משותפת",
    description: "שיתוף אמבט אינטימי עם נרות, מוזיקה ומגע רך.",
    category: "חושים ומגע"
  },
  "Erotic Whisper & Verbal Teasing": {
    title: "לחישות אירוטיות וגירוי מילולי",
    description: "לחישת פנטזיות ותשוקות אירוטיות באוזן בן/בת הזוג במהלך היום.",
    category: "חושים ומגע"
  },
  "Public Secret Displays of Affection": {
    title: "מגע סודי דיסקרטי במרחב ציבורי",
    description: "מגע נסתר ודיסקרטי או אותות מרמזים במקומות חצי-ציבוריים.",
    category: "חושים ומגע"
  },
  "Slow Erotic Dancing": {
    title: "ריקוד אירוטי איטי",
    description: "ריקוד אינטימי וצמוד באור עמום בחדר השינה למוזיקה איטית.",
    category: "חושים ומגע"
  },
  "Light Silk Restraints": {
    title: "קשירות משי רכות",
    description: "שימוש בסרטי משי רכים או צמידי סאטן במהלך האינטימיות.",
    category: "BDSM וקשירות"
  },
  "Temperature Play (Ice & Warm Wax)": {
    title: "משחקי טמפרטורה (קרח ושעווה חמה)",
    description: "שילוב בין שעוות נרות חמה לבין קוביות קרח על עור רגיש.",
    category: "BDSM וקשירות"
  },
  "Sensory Deprivation (Noise-cancelling + Blindfold)": {
    title: "ניטרול חושים (כיסוי עיניים ואוזניות)",
    description: "העצמת תחושת המגע על ידי ניטרול מלא של הראייה והשמיעה.",
    category: "BDSM וקשירות"
  },
  "Blindfolded Touch & Sensation Play": {
    title: "משחקי תחושות וכיסוי עיניים",
    description: "חקירת מגע וחושים כאשר אחד מבני הזוג ממוסך עיניים עם שמנים, קרח, נוצות או משי.",
    category: "חושים ומגע"
  },
  "Temperature Play (Warm Wax & Ice)": {
    title: "משחקי טמפרטורה (שעווה חמה וקרח)",
    description: "שילוב בין נטיפות שעוות עיסוי חמה לבין קוביות קרח צוננות על עור חשוף.",
    category: "חושים ומגע"
  },
  "Feather Tease & Tickle": {
    title: "דגדוג ומגע נוצה מענג",
    description: "שימוש בנוצות רכות וצמר גפן לגירוי עדין ואיטי של אזורים ארוגניים.",
    category: "חושים ומגע"
  },
  "Silk & Satin Restraints": {
    title: "קשירות משי וסאטן רכות",
    description: "עטיפה ועגינה של פרקי הידיים בסרטי סאטן נעימים למיטה.",
    category: "BDSM וקשירות"
  },
  "Leather Cuffs & Anchoring": {
    title: "צמידי עור ועגינה יציבה",
    description: "שימוש בצמידי עור איכותיים לקיבוע ידיים או רגליים במהלך המשחק.",
    category: "BDSM וקשירות"
  },
  "Light Whip & Crop Tease": {
    title: "מצלף משי וגירוי קל",
    description: "נגיעות קלות וטפיחות מעוררות עם מצלף עור או מברשת רכה.",
    category: "BDSM וקשירות"
  },
  "Shibari Rope Bondage": {
    title: "אמנות קשרים ושיבארי (Shibari)",
    description: "קשירה אמנותית של הגוף בחבלי יוטה או כותנה רכים לחוויית התמסרות עמוקה.",
    category: "BDSM וקשירות"
  },
  "Sensual Spanking": {
    title: "מכות ישבן תשוקתיות (Spanking)",
    description: "טפיחות כף יד קלות עד איתנות על הישבן במהלך התשוקה.",
    category: "BDSM וקשירות"
  },
  "Edge & Orgasm Control": {
    title: "שליטה באורגזמה והארכת גירוי (Edging)",
    description: "הבאת בן/בת הזוג לסף השיא מספר פעמים לפני שחרור מלא.",
    category: "BDSM וקשירות"
  },
  "Strangers at a Hotel Bar Roleplay": {
    title: "מפגש זרים בבר מלון",
    description: "התחזות לשני זרים מסקרנים הנפגשים בבר מלון ומתחילים ברומן אנונימי.",
    category: "משחקי תפקידים"
  },
  "Doctor & Patient Inspection Roleplay": {
    title: "משחק תפקידים: רופא ומטופלת",
    description: "תרחיש בדיקה רפואית שובבה ומלאת פנטזיה.",
    category: "משחקי תפקידים"
  },
  "French Maid / Manor Master Roleplay": {
    title: "משחק תפקידים: חדרנית ואדון האחוזה",
    description: "תרחיש קלאסי של שליטה, שירותיות וציות להוראות.",
    category: "משחקי תפקידים"
  },
  "Secret Agents / Heist Partner Scenario": {
    title: "משחק תפקידים: סוכנים חסויים במבצע",
    description: "תרחיש סוכנים חשאיים החוגגים ניצחון במשימה מסוכנת.",
    category: "משחקי תפקידים"
  },
  "Erotic Fantasy Story Co-writing": {
    title: "כתיבת וקריאת סיפור אירוטי משותף",
    description: "יצירה וקריאה של סיפור תשוקתי מותאם אישית יחד במיטה.",
    category: "משחקי תפקידים"
  },
  "Remote-Controlled Toy in Public": {
    title: "צעצוע אינטימי בשלט רחוק בציבור",
    description: "לבישת רוטט נשלט מרחוק דרך אפליקציה במהלך מסעדה או טיול.",
    category: "צעצועים"
  },
  "Wand Massager Exploration": {
    title: "עיסוי עוצמתי עם Wand Massager",
    description: "שילוב מעסה רוטט בעל עוצמה גבוהה לגירוי ממושך.",
    category: "צעצועים"
  },
  "Suction & Nipple Stimulators": {
    title: "מעסי יניקה וגירוי פטמות",
    description: "שימוש בפעמוני יניקה או בצבטים רוטטים עדינים.",
    category: "צעצועים"
  },
  "Electro-Stimulation (E-Stim Lite)": {
    title: "גירוי חשמלי עדין (E-Stim)",
    description: "שימוש בפולסים חשמליים מיקרוסקופיים לחוויה תחושתית חדשה.",
    category: "צעצועים"
  },
  "Watching Erotic Films / Audio Together": {
    title: "צפייה או האזנה לתוכן אירוטי זוגי",
    description: "הנאה משותפת מתכנים אירוטיים או פודקאסטים תשוקתיים.",
    category: "פנטזיות פתוחות"
  },
  "Flirting with Couples Online (Fantasy Only)": {
    title: "פלרטוט זוגי ברשת (לצורך פנטזיה בלבד)",
    description: "חקר פורומים או אפליקציות זוגיות לקבלת רעיונות והשראה בלבד.",
    category: "פנטזיות פתוחות"
  },
  "Hotwife / Hall Pass Discussion": {
    title: "שיחה על פנטזיית יחסים פתוחים",
    description: "דיבור פתוח על תרחישים היפותטיים בסביבה בטוחה וללא שיפוטיות.",
    category: "פנטזיות פתוחות"
  },
  "Being Spanked (Receiver)": {
    title: "קבלת טפיחות ישבן (נשלט/ת)",
    description: "רצון שבן/בת הזוג יעניקו לי טפיחות ישבן במהלך המשחק.",
    category: "BDSM וקשירות"
  },
  "Spanking Partner (Giver)": {
    title: "מתן טפיחות ישבן (שולט/ת)",
    description: "רצון להעניק לבן/בת הזוג טפיחות ישבן עדינות או איתנות.",
    category: "BDSM וקשירות"
  },
  "Surrendering Control (Submissive / Receiver)": {
    title: "התמסרות ושחרור שליטה מלא (נשלט/ת)",
    description: "רצון להשתחרר משליטה, להתמסר ולמלא את הוראות בן/בת הזוג.",
    category: "BDSM וקשירות"
  },
  "Dominant Control (Dominant / Giver)": {
    title: "לקיחת שליטה דומיננטית (שולט/ת)",
    description: "רצון לקחת שליטה מלאה בסשן ולהנחות את בן/בת הזוג.",
    category: "BDSM וקשירות"
  },
  "Being Tied Up (Bondage Receiver)": {
    title: "להיות קשור/ה (מקבל/ת)",
    description: "רצון שבן/בת הזוג יקשרו אותי בבטחה בחבלים או ברצועות.",
    category: "BDSM וקשירות"
  },
  "Tying Up Partner (Shibari / Bondage Giver)": {
    title: "לקשור את בן/בת הזוג (מעניק/ת)",
    description: "רצון לקשור את בן/בת הזוג בחבלי משי רכים או ברצועות עור.",
    category: "BDSM וקשירות"
  },
  "Wearing Collar & Leash (Submissive Pet)": {
    title: "ענידת קולר ורצועה (נשלט/ת)",
    description: "רצון שבן/בת הזוג יענדו לי קולר ויובילו אותי ברצועה.",
    category: "BDSM וקשירות"
  },
  "Wearing Collar & Leash (Dominant Owner)": {
    title: "ענידת קולר ורצועה (שולט/ת)",
    description: "רצון להעניק לבן/בת הזוג קולר ולהנחות אותם ברצועה.",
    category: "BDSM וקשירות"
  },
  "Receiving Deep Body Massage": {
    title: "קבלת עיסוי גוף מענג",
    description: "רצון שבן/בת הזוג יעניקו לי עיסוי מפנק ללא הפרעות.",
    category: "חושים ומגע"
  },
  "Giving Deep Body Massage": {
    title: "מתן עיסוי גוף מפנק",
    description: "רצון להעניק לבן/בת הזוג עיסוי עמוק ומפנק במשך 30 דקות.",
    category: "חושים ומגע"
  },
  "Being Hand-Fed Blindfolded": {
    title: "אכילה מידי בן/בת הזוג בכיסוי עיניים",
    description: "רצון שבן/בת הזוג יאכילו אותי במעפים טעימים בעיניים מכוסות.",
    category: "חושים ומגע"
  },
  "Feed Partner Exotic Treats Blindfolded": {
    title: "האכלת בן/בת הזוג בכיסוי עיניים",
    description: "רצון להאכיל את בן/בת הזוג בעיניים מכוסות בפירות, שוקולד או יין.",
    category: "חושים ומגע"
  }
};

export function translateQuestion(
  q: { id: string; title: string; description: string; category: string },
  lang: Language
) {
  if (lang === 'he') {
    const cleanTitle = (q.title || '').trim();
    const byTitle = catalogTranslationsHeByTitle[cleanTitle];

    if (byTitle) {
      return {
        ...q,
        title: byTitle.title,
        description: byTitle.description,
        category: byTitle.category || q.category
      };
    }

    // Dynamic Category Translate Fallback
    const categoryMap: Record<string, string> = {
      Sensual: 'חושים ומגע',
      BDSM: 'BDSM וקשירות',
      Roleplay: 'משחקי תפקידים',
      Toys: 'צעצועים',
      ENM: 'פנטזיות פתוחות'
    };

    return {
      ...q,
      category: categoryMap[q.category] || q.category
    };
  }

  return q;
}
