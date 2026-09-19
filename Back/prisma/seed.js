// Seed: переносить каталог скинів, картинки, кейси і дроп-пули з фронта в БД.
// Запуск: node prisma/seed.js   (або npx prisma db seed)
// Ідемпотентний: повторний запуск оновлює дані, юзерів не чіпає.
const { PrismaClient } = require("@prisma/client");
const data = require("./seed-data.json");

const prisma = new PrismaClient();

// Та сама формула ваги, що в src/utils/randomSkinGeter.js — щоб dropChance
// у case_skins був реальним відсотком (сума ≈ 100 на кейс).
const RARITY_WEIGHTS = {
  consumer: 72, industrial: 56, milspec: 44,
  restricted: 22, classified: 10, covert: 3.4, mythic: 0.85,
};

function skinWeight(skinPrice, casePrice, rarity) {
  const w = RARITY_WEIGHTS[(rarity || "").toLowerCase()] || 1;
  const ratio = skinPrice > 0 ? casePrice / skinPrice : 1;
  const valuePenalty = Math.min(Math.max(ratio, 0.12), 1);
  let premiumPenalty = 1;
  if (casePrice >= 800) premiumPenalty = 0.42;
  else if (casePrice >= 450) premiumPenalty = 0.58;
  else if (casePrice >= 250) premiumPenalty = 0.776;
  return w * valuePenalty * premiumPenalty;
}

async function main() {
  // 1. Скини: name не unique в схемі — upsert вручну через findFirst.
  const skinIdByName = new Map();
  for (const s of data.skins) {
    const payload = {
      name: s.name, weapon: s.weapon, rarity: s.rarity,
      price: s.price, imageUrl: s.imageUrl,
    };
    const existing = await prisma.skin.findFirst({ where: { name: s.name } });
    const skin = existing
      ? await prisma.skin.update({ where: { id: existing.id }, data: payload })
      : await prisma.skin.create({ data: payload });
    skinIdByName.set(s.name, skin.id);
  }
  console.log(`Skins: ${skinIdByName.size}`);

  // 2. Кейси + дроп-пули.
  for (const c of data.cases) {
    const payload = {
      name: c.name, type: c.type, code: c.code, price: c.price,
      imageUrl: "", volatility: c.volatility, accent: c.accent,
    };
    const dbCase = await prisma.case.upsert({
      where: { id: c.id },
      update: payload,
      create: { id: c.id, ...payload },
    });

    const weights = c.drops.map((name) => {
      const s = data.skins.find((x) => x.name === name);
      return skinWeight(s ? s.price : 1, c.price, s ? s.rarity : "consumer");
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
    console.log(`Case "${c.name}": ${c.drops.length} drops`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
