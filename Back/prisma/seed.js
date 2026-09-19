// Seed: loads skins, images, cases and drop pools into the DB.
// Run: node prisma/seed.js  (or npx prisma db seed)
// Idempotent: re-running updates data, users are not touched.
const { PrismaClient } = require("@prisma/client");
const data = require("./seed-data.json");

const prisma = new PrismaClient();

const RARITY_WEIGHTS = {
  consumer: 72, industrial: 56, milspec: 44,
  restricted: 22, classified: 10, covert: 3.4, mythic: 0.85,
};

function weaponOf(name) {
  return String(name).split(" | ")[0].replace(/^\W+\s*/, "");
}

function skinWeight(skinPrice, casePrice, rarity) {
  const w = RARITY_WEIGHTS[String(rarity || "").toLowerCase()] || 1;
  const ratio = skinPrice > 0 ? casePrice / skinPrice : 1;
  const valuePenalty = Math.min(Math.max(ratio, 0.12), 1);
  let premiumPenalty = 1;
  if (casePrice >= 800) premiumPenalty = 0.42;
  else if (casePrice >= 450) premiumPenalty = 0.58;
  else if (casePrice >= 250) premiumPenalty = 0.776;
  return w * valuePenalty * premiumPenalty;
}

async function main() {
  // 1. Skins (name is not unique in schema -> manual upsert via findFirst)
  const skinIdByName = new Map();
  for (const s of data.skins) {
    const payload = {
      name: s.name,
      weapon: s.weapon || weaponOf(s.name),
      rarity: s.rarity,
      price: s.price,
      imageUrl: s.imageUrl || "",
    };
    const existing = await prisma.skin.findFirst({ where: { name: s.name } });
    const skin = existing
      ? await prisma.skin.update({ where: { id: existing.id }, data: payload })
      : await prisma.skin.create({ data: payload });
    skinIdByName.set(s.name, skin.id);
  }
  console.log("Skins:", skinIdByName.size);

  // 2. Cases + drop pools
  for (const c of data.cases) {
    const payload = {
      name: c.name,
      type: c.type,
      code: c.code,
      price: c.price,
      imageUrl: "",
      volatility: c.volatility,
      accent: c.accent,
    };
    const dbCase = await prisma.case.upsert({
      where: { id: c.id },
      update: payload,
      create: { id: c.id, ...payload },
    });

    // auto-create skins that are missing from seed-data.json
    for (const name of c.drops) {
      if (!skinIdByName.has(name)) {
        const created = await prisma.skin.create({
          data: {
            name: name,
            weapon: weaponOf(name),
            rarity: "milspec",
            price: 60,
            imageUrl: "",
          },
        });
        skinIdByName.set(name, created.id);
        console.log("Auto-created missing skin:", name);
      }
    }

    const weights = c.drops.map((name) => {
      const s = data.skins.find((x) => x.name === name);
      return skinWeight(s ? s.price : 60, c.price, s ? s.rarity : "milspec");
    });
    const total = weights.reduce((a, b) => a + b, 0);

    await prisma.caseSkin.deleteMany({ where: { caseId: dbCase.id } });
    await prisma.caseSkin.createMany({
      data: c.drops.map((name, i) => ({
        caseId: dbCase.id,
        skinId: skinIdByName.get(name),
        dropChance: (weights[i] / total) * 100,
      })),
      skipDuplicates: true,
    });
    console.log('Case "' + c.name + '":', c.drops.length, "drops");
  }
}

main()
  .then(() => console.log("Seed done"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
