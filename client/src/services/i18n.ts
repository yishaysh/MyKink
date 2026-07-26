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

    onboardingStep1Title: 'Step 1: Your Secret Alias & Role',
    onboardingStep1Sub: 'Choose an anonymous sexy nickname and your preferred dynamic role for your partner to see.',
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

    onboardingStep1Title: 'שלב 1: כינוי סקסי ותפקיד',
    onboardingStep1Sub: 'בחרו כינוי אנונימי ותפקיד מועדף שיוצגו לבן/בת הזוג.',
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
