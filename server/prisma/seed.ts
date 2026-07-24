import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding MyKink Question Catalog...');

  // Clean existing questions
  await prisma.userAnswer.deleteMany();
  await prisma.sharedMatch.deleteMany();
  await prisma.questionCatalog.deleteMany();

  const symmetricQuestions = [
    // SENSUAL & ROMANTIC
    { title: 'Sensual Oil Massage', description: 'Giving or receiving a full body warm oil massage with candles.', category: 'Sensual', intensityLevel: 'VANILLA' },
    { title: 'Blindfolded Touch & Sensation Play', description: 'Exploring touch while one partner is blindfolded using feathers, ice, or silk.', category: 'Sensual', intensityLevel: 'VANILLA' },
    { title: 'Mutual Bath / Shower Romance', description: 'Sharing an intimate bath with candles, music, and soft touching.', category: 'Sensual', intensityLevel: 'VANILLA' },
    { title: 'Erotic Whisper & Verbal Teasing', description: 'Whispering erotic fantasies and desires into your partner\'s ear during the day.', category: 'Sensual', intensityLevel: 'VANILLA' },
    { title: 'Public Secret Displays of Affection', description: 'Discreet, hidden touch or suggestive signals in semi-public settings.', category: 'Sensual', intensityLevel: 'SPICY' },
    { title: 'Slow Erotic Dancing', description: 'Dancing intimately together in bedroom light to slow music.', category: 'Sensual', intensityLevel: 'VANILLA' },

    // BDSM & DOMINANCE (Symmetric options)
    { title: 'Light Silk Restraints', description: 'Using soft silk scarves or satin cuffs during intimacy.', category: 'BDSM', intensityLevel: 'SPICY' },
    { title: 'Temperature Play (Ice & Warm Wax)', description: 'Alternating warm candle wax and ice cubes across sensitive skin.', category: 'BDSM', intensityLevel: 'SPICY' },
    { title: 'Sensory Deprivation (Noise-cancelling + Blindfold)', description: 'Heightening touch by removing sight and hearing completely.', category: 'BDSM', intensityLevel: 'ADVENTUROUS' },
    { title: 'Edge & Orgasm Control', description: 'Bringing partner close to climax multiple times before release.', category: 'BDSM', intensityLevel: 'SPICY' },

    // ROLEPLAY & FANTASY
    { title: 'Strangers at a Hotel Bar Roleplay', description: 'Pretending to meet for the first time as intrigue-seeking strangers.', category: 'Roleplay', intensityLevel: 'SPICY' },
    { title: 'Doctor & Patient Inspection Roleplay', description: 'A playful examination scenario with medical roleplay elements.', category: 'Roleplay', intensityLevel: 'SPICY' },
    { title: 'French Maid / Manor Master Roleplay', description: 'Classic service and authority roleplay scenario.', category: 'Roleplay', intensityLevel: 'SPICY' },
    { title: 'Secret Agents / Heist Partner Scenario', description: 'High-stakes undercover agents celebrating a successful stealth mission.', category: 'Roleplay', intensityLevel: 'ADVENTUROUS' },
    { title: 'Erotic Fantasy Story Co-writing', description: 'Creating and reading a custom erotic short story together.', category: 'Roleplay', intensityLevel: 'VANILLA' },

    // TOYS & TECH
    { title: 'Remote-Controlled Toy in Public', description: 'Using a smartphone-controlled vibe during a dinner date or stroll.', category: 'Toys', intensityLevel: 'SPICY' },
    { title: 'Wand Massager Exploration', description: 'Incorporating high-power wand vibrators during intimate sessions.', category: 'Toys', intensityLevel: 'VANILLA' },
    { title: 'Suction & Nipple Stimulators', description: 'Using vacuum suction cups or gentle electric/vibrating clamps.', category: 'Toys', intensityLevel: 'SPICY' },
    { title: 'Electro-Stimulation (E-Stim Lite)', description: 'Using gentle micro-current pulse stimulation pads.', category: 'Toys', intensityLevel: 'ADVENTUROUS' },

    // ENM & EXPANDED HORIZONS
    { title: 'Watching Erotic Films / Audio Together', description: 'Enjoying ethical erotic media or audio stories as a couple.', category: 'ENM', intensityLevel: 'VANILLA' },
    { title: 'Flirting with Couples Online (Fantasy Only)', description: 'Exploring online kink forums or couple apps strictly for inspiration.', category: 'ENM', intensityLevel: 'SPICY' },
    { title: 'Hotwife / Hall Pass Discussion', description: 'Talking about non-monogamy hypotheticals in a safe, non-judgmental environment.', category: 'ENM', intensityLevel: 'ADVENTUROUS' }
  ];

  for (const q of symmetricQuestions) {
    await prisma.questionCatalog.create({
      data: {
        title: q.title,
        description: q.description,
        category: q.category,
        intensityLevel: q.intensityLevel,
        roleType: 'SYMMETRIC'
      }
    });
  }

  // ASYMMETRIC PAIRS (Giver & Receiver pairs)
  const asymmetricPairs = [
    {
      giver: { title: 'Spanking Partner (Giver)', description: 'I want to spank my partner gently or firmly across their bottom.', category: 'BDSM', intensityLevel: 'SPICY' },
      receiver: { title: 'Being Spanked (Receiver)', description: 'I want my partner to spank me across my bottom during intimacy.', category: 'BDSM', intensityLevel: 'SPICY' }
    },
    {
      giver: { title: 'Dominant Control (Dominant / Giver)', description: 'I want to take full dominant control of the session and issue commands.', category: 'BDSM', intensityLevel: 'SPICY' },
      receiver: { title: 'Surrendering Control (Submissive / Receiver)', description: 'I want to surrender full control to my partner and obey commands.', category: 'BDSM', intensityLevel: 'SPICY' }
    },
    {
      giver: { title: 'Tying Up Partner (Shibari / Bondage Giver)', description: 'I want to tie up my partner with soft ropes or leather straps.', category: 'BDSM', intensityLevel: 'ADVENTUROUS' },
      receiver: { title: 'Being Tied Up (Bondage Receiver)', description: 'I want my partner to tie me up securely with rope or straps.', category: 'BDSM', intensityLevel: 'ADVENTUROUS' }
    },
    {
      giver: { title: 'Wearing Collar & Leash (Dominant Owner)', description: 'I want to put a sleek collar and leash on my partner during play.', category: 'BDSM', intensityLevel: 'ADVENTUROUS' },
      receiver: { title: 'Wearing Collar & Leash (Submissive Pet)', description: 'I want my partner to place a collar on me and guide me with a leash.', category: 'BDSM', intensityLevel: 'ADVENTUROUS' }
    },
    {
      giver: { title: 'Giving Deep Body Massage', description: 'I want to spend 30 minutes giving my partner a thorough massage.', category: 'Sensual', intensityLevel: 'VANILLA' },
      receiver: { title: 'Receiving Deep Body Massage', description: 'I want my partner to give me an extended uninterrupted massage.', category: 'Sensual', intensityLevel: 'VANILLA' }
    },
    {
      giver: { title: 'Feed Partner Exotic Treats Blindfolded', description: 'I want to hand-feed my blindfolded partner fruits, chocolate, or wine.', category: 'Sensual', intensityLevel: 'VANILLA' },
      receiver: { title: 'Being Hand-Fed Blindfolded', description: 'I want my partner to hand-feed me delicious treats while blindfolded.', category: 'Sensual', intensityLevel: 'VANILLA' }
    }
  ];

  for (const pair of asymmetricPairs) {
    const giverQ = await prisma.questionCatalog.create({
      data: {
        title: pair.giver.title,
        description: pair.giver.description,
        category: pair.giver.category,
        intensityLevel: pair.giver.intensityLevel,
        roleType: 'GIVER'
      }
    });

    const receiverQ = await prisma.questionCatalog.create({
      data: {
        title: pair.receiver.title,
        description: pair.receiver.description,
        category: pair.receiver.category,
        intensityLevel: pair.receiver.intensityLevel,
        roleType: 'RECEIVER',
        linkedQuestionId: giverQ.id
      }
    });

    // Update giver question with link to receiver
    await prisma.questionCatalog.update({
      where: { id: giverQ.id },
      data: { linkedQuestionId: receiverQ.id }
    });
  }

  const count = await prisma.questionCatalog.count();
  console.log(`✅ Seeding complete! Inserted ${count} catalog questions.`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
