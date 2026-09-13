import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  FlaskConical,
  Gem,
  Gift,
  History,
  KeyRound,
  Lock,
  LogIn,
  Mail,
  PackageOpen,
  RefreshCw,
  Shield,
  ShoppingBag,
  Sparkles,
  Star,
  Swords,
  Target,
  Trophy,
  User,
  UserPlus,
  Vault,
  WandSparkles,
  Wallet,
  Bitcoin,
  Settings,
  Search,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  Check,
} from "lucide-react";
import "./index.css";

const caseTypes = [
  { id: "all", label: "Усі", helper: "Весь пул" },
  { id: "free", label: "Безкоштовний", helper: "Стартовий кейс" },
  { id: "default", label: "Дефолтні", helper: "Базові дропи" },
  { id: "tactical", label: "Тактичні", helper: "Стабільний ризик" },
  { id: "premium", label: "Преміум", helper: "Вищий шанс" },
  { id: "mythic", label: "Міфічні", helper: "Рідкісний лут" },
];

const rarityMeta = {
  consumer: { label: "Consumer", color: "#8aa0ad", glow: "rgba(138,160,173,.28)" },
  industrial: { label: "Industrial", color: "#5c91ff", glow: "rgba(92,145,255,.28)" },
  milspec: { label: "Mil-Spec", color: "#315dff", glow: "rgba(49,93,255,.32)" },
  restricted: { label: "Restricted", color: "#8b5cf6", glow: "rgba(139,92,246,.32)" },
  classified: { label: "Classified", color: "#d946ef", glow: "rgba(217,70,239,.35)" },
  covert: { label: "Covert", color: "#ff4f64", glow: "rgba(255,79,100,.35)" },
  mythic: { label: "Mythic", color: "#ffc857", glow: "rgba(255,200,87,.38)" },
};

const defaultDropPool = [
  "P2000 | Granite Marbleized",
  "Nova | Clear Polymer",
  "M4A1-S | Basilisk",
  "Five-SeveN | Capillary",
  "AWP | Atheris",
  "USP-S | Blueprint",
  "MP9 | Black Sand",
  "Glock-18 | Moonrise",
  "M4A4 | Neo-Noir",
  "CZ75-Auto | Polymer",
  "Sawed-Off | Wasteland Princess",
  "Driver Gloves | Queen Jaguar",
  "P90 | Death by Kitty",
  "MP7 | Urban Hazard",
  "Sawed-Off | Black Sand",
  "MP5-SD | Kitbash",
];

const tacticalDropPool = [
  "AUG | Momentum",
  "MAC-10 | Disco Tech",
  "M4A4 | The Emperor",
  "MP9 | Modest Threat",
  "AK-47 | Asiimov",
  "AWP | Neo-Noir",
  "FAMAS | Meow 36",
  "USP-S | Printstream",
  "AK-47 | Ice Coaled",
  "P250 | Cassette",
  "Desert Eagle | Printstream",
  "Skeleton Knife | Tiger Tooth",
  "Tec-9 | Fuel Injector",
  "M4A1-S | Decimator",
];

const premiumDropPool = [
  "AK-47 | Neon Rider",
  "M4A4 | Cyber Security",
  "AWP | Hyper Beast",
  "Karambit | Lore",
  "Glock-18 | Vogue",
  "USP-S | Kill Confirmed",
  "M9 Bayonet | Crimson Web",
  "SSG 08 | Dragonfire",
  "AK-47 | Inheritance",
  "Sport Gloves | Bronze Morph",
  "USP-S | Orion",
  "M4A1-S | Knight",
];

const mythicDropPool = [
  "AWP | Gungnir",
  "AK-47 | Wild Lotus",
  "Butterfly Knife | Fade",
  "M4A4 | Howl",
  "AWP | Dragon Lore",
  "Talon Knife | Marble Fade",
  "Specialist Gloves | Fade",
  "Desert Eagle | Blaze",
  "AK-47 | Fire Serpent",
  "Sport Gloves | Pandora's Box",
  "Karambit | Lore",
  "M9 Bayonet | Crimson Web",
];

const allDropNames = [...defaultDropPool, ...tacticalDropPool, ...premiumDropPool, ...mythicDropPool];

function buildCaseDrops(featuredDrops, pools, targetCount = 24) {
  const result = [];

  [...featuredDrops, ...pools.flat(), ...allDropNames].forEach((name) => {
    if (result.length < targetCount && !result.includes(name)) {
      result.push(name);
    }
  });

  return result;
}

const cases = [
  {
    id: "starter-free",
    name: "Starter Case",
    type: "default",
    code: "FREE",
    price: 0,
    volatility: "Low",
    accent: "#4db57d",
    drops: buildCaseDrops(["P2000 | Granite Marbleized", "Nova | Clear Polymer", "M4A1-S | Basilisk"], [defaultDropPool, tacticalDropPool], 10),
  },
  {
    id: "op-bravo",
    name: "Operation Bravo",
    type: "default",
    code: "DP-001",
    price: 24,
    volatility: "Low",
    accent: "#4db57d",
    drops: buildCaseDrops(["P2000 | Granite Marbleized", "Nova | Clear Polymer", "M4A1-S | Basilisk"], [defaultDropPool, tacticalDropPool], 24),
  },
  {
    id: "spectrum",
    name: "Spectrum",
    type: "default",
    code: "SP-025",
    price: 34,
    volatility: "Low",
    accent: "#69d2ff",
    drops: buildCaseDrops(["Five-SeveN | Capillary", "AWP | Atheris", "USP-S | Blueprint"], [defaultDropPool, premiumDropPool], 24),
  },
  {
    id: "clutch",
    name: "Clutch",
    type: "default",
    code: "CL-017",
    price: 46,
    volatility: "Mid",
    accent: "#e94a5f",
    drops: buildCaseDrops(["MP9 | Black Sand", "Glock-18 | Moonrise", "M4A4 | Neo-Noir"], [defaultDropPool, tacticalDropPool], 24),
  },
  {
    id: "glove",
    name: "Glove Case",
    type: "default",
    code: "GL-013",
    price: 82,
    volatility: "Mid",
    accent: "#d2b47d",
    drops: buildCaseDrops(["CZ75-Auto | Polymer", "Sawed-Off | Wasteland Princess", "Driver Gloves | Queen Jaguar"], [defaultDropPool, premiumDropPool], 24),
  },
  {
    id: "prisma",
    name: "Prisma",
    type: "tactical",
    code: "PR-031",
    price: 58,
    volatility: "Mid",
    accent: "#c66cff",
    drops: buildCaseDrops(["AUG | Momentum", "MAC-10 | Disco Tech", "M4A4 | The Emperor"], [tacticalDropPool, defaultDropPool], 25),
  },
  {
    id: "danger-zone",
    name: "Danger Zone",
    type: "tactical",
    code: "DZ-009",
    price: 66,
    volatility: "High",
    accent: "#ff8d46",
    drops: buildCaseDrops(["MP9 | Modest Threat", "AK-47 | Asiimov", "AWP | Neo-Noir"], [tacticalDropPool, premiumDropPool, defaultDropPool], 25),
  },
  {
    id: "recoil",
    name: "Recoil",
    type: "tactical",
    code: "RC-044",
    price: 74,
    volatility: "Mid",
    accent: "#69e0b0",
    drops: buildCaseDrops(["FAMAS | Meow 36", "USP-S | Printstream", "AK-47 | Ice Coaled"], [tacticalDropPool, defaultDropPool, premiumDropPool], 25),
  },
  {
    id: "fracture",
    name: "Fracture",
    type: "tactical",
    code: "FR-037",
    price: 92,
    volatility: "High",
    accent: "#ff5b4a",
    drops: buildCaseDrops(["P250 | Cassette", "Desert Eagle | Printstream", "Skeleton Knife | Tiger Tooth"], [tacticalDropPool, premiumDropPool, mythicDropPool], 25),
  },
  {
    id: "neon-grid",
    name: "Neon Grid",
    type: "premium",
    code: "NG-101",
    price: 124,
    volatility: "Mid",
    accent: "#00d0ff",
    drops: buildCaseDrops(["Tec-9 | Fuel Injector", "M4A1-S | Decimator", "AK-47 | Neon Rider"], [premiumDropPool, tacticalDropPool, defaultDropPool], 26),
  },
  {
    id: "bat-elite",
    name: "Bat Elite",
    type: "premium",
    code: "CE-115",
    price: 150,
    volatility: "High",
    accent: "#46d690",
    drops: buildCaseDrops(["M4A4 | Cyber Security", "AWP | Hyper Beast", "Karambit | Lore"], [premiumDropPool, mythicDropPool, tacticalDropPool], 26),
  },
  {
    id: "bloodline",
    name: "Bloodline",
    type: "premium",
    code: "BL-122",
    price: 165,
    volatility: "High",
    accent: "#ff485d",
    drops: buildCaseDrops(["Glock-18 | Vogue", "USP-S | Kill Confirmed", "M9 Bayonet | Crimson Web"], [premiumDropPool, mythicDropPool, tacticalDropPool], 26),
  },
  {
    id: "aether",
    name: "Aether Protocol",
    type: "premium",
    code: "AE-140",
    price: 180,
    volatility: "High",
    accent: "#9d7cff",
    drops: buildCaseDrops(["SSG 08 | Dragonfire", "AK-47 | Inheritance", "Sport Gloves | Bronze Morph"], [premiumDropPool, mythicDropPool, defaultDropPool], 26),
  },
  {
    id: "myth-onyx",
    name: "Mythic Onyx",
    type: "mythic",
    code: "MY-001",
    price: 245,
    volatility: "Extreme",
    accent: "#f6c85f",
    drops: buildCaseDrops(["AWP | Gungnir", "AK-47 | Wild Lotus", "Butterfly Knife | Fade"], [mythicDropPool, premiumDropPool, tacticalDropPool], 28),
  },
  {
    id: "dragon-rite",
    name: "Dragon Rite",
    type: "mythic",
    code: "MY-014",
    price: 280,
    volatility: "Extreme",
    accent: "#ff8a4d",
    drops: buildCaseDrops(["M4A4 | Howl", "AWP | Dragon Lore", "Talon Knife | Marble Fade"], [mythicDropPool, premiumDropPool, tacticalDropPool], 28),
  },
  {
    id: "stellar-case",
    name: "Stellar Case",
    type: "mythic",
    code: "MY-027",
    price: 225,
    volatility: "Extreme",
    accent: "#8ae8ff",
    drops: buildCaseDrops(["USP-S | Orion", "M4A1-S | Knight", "Specialist Gloves | Fade"], [mythicDropPool, premiumDropPool, defaultDropPool], 28),
  },
  {
    id: "relic-zero",
    name: "Relic Zero",
    type: "mythic",
    code: "MY-040",
    price: 255,
    volatility: "Extreme",
    accent: "#d8ff6a",
    drops: buildCaseDrops(["Desert Eagle | Blaze", "AK-47 | Fire Serpent", "Sport Gloves | Pandora's Box"], [mythicDropPool, premiumDropPool, tacticalDropPool], 28),
  },
];

const totalSkinCount = new Set(cases.flatMap((crate) => crate.drops)).size;

const inventorySeed = [
  { id: "i1", name: "Nova | Clear Polymer", weapon: "Nova", rarity: "milspec", price: 49, wear: "Field-Tested" },
  { id: "i2", name: "P2000 | Granite Marbleized", weapon: "P2000", rarity: "industrial", price: 18, wear: "Minimal Wear" },
  { id: "i3", name: "P90 | Death by Kitty", weapon: "P90", rarity: "restricted", price: 118, wear: "Factory New" },
  { id: "i4", name: "MP7 | Urban Hazard", weapon: "MP7", rarity: "industrial", price: 76, wear: "Field-Tested" },
  { id: "i5", name: "Tec-9 | Fuel Injector", weapon: "Tec-9", rarity: "classified", price: 190, wear: "Minimal Wear" },
  { id: "i6", name: "Sawed-Off | Black Sand", weapon: "Sawed-Off", rarity: "milspec", price: 33, wear: "Battle-Scarred" },
];

const targets = [
  { name: "Nova | Clear Polymer", rarity: "milspec", price: 49 },
  { name: "P2000 | Granite Marbleized", rarity: "industrial", price: 18 },
  { name: "Tec-9 | Fuel Injector", rarity: "classified", price: 190 },
  { name: "MP5-SD | Kitbash", rarity: "restricted", price: 95 },
  { name: "AWP | Atheris", rarity: "restricted", price: 125 },
  { name: "USP-S | Kill Confirmed", rarity: "covert", price: 460 },
  { name: "M4A4 | Howl", rarity: "mythic", price: 1100 },
];

const skinCatalog = {
  "P2000 | Granite Marbleized": { rarity: "industrial", price: 18 },
  "Nova | Clear Polymer": { rarity: "milspec", price: 49 },
  "M4A1-S | Basilisk": { rarity: "restricted", price: 84 },
  "Five-SeveN | Capillary": { rarity: "industrial", price: 21 },
  "AWP | Atheris": { rarity: "restricted", price: 125 },
  "USP-S | Blueprint": { rarity: "milspec", price: 72 },
  "MP9 | Black Sand": { rarity: "industrial", price: 24 },
  "Glock-18 | Moonrise": { rarity: "restricted", price: 93 },
  "M4A4 | Neo-Noir": { rarity: "classified", price: 240 },
  "CZ75-Auto | Polymer": { rarity: "industrial", price: 18 },
  "Sawed-Off | Wasteland Princess": { rarity: "milspec", price: 64 },
  "Driver Gloves | Queen Jaguar": { rarity: "covert", price: 620 },
  "AUG | Momentum": { rarity: "classified", price: 185 },
  "MAC-10 | Disco Tech": { rarity: "classified", price: 205 },
  "M4A4 | The Emperor": { rarity: "covert", price: 390 },
  "MP9 | Modest Threat": { rarity: "milspec", price: 36 },
  "AK-47 | Asiimov": { rarity: "covert", price: 430 },
  "AWP | Neo-Noir": { rarity: "covert", price: 410 },
  "FAMAS | Meow 36": { rarity: "milspec", price: 52 },
  "USP-S | Printstream": { rarity: "covert", price: 510 },
  "AK-47 | Ice Coaled": { rarity: "classified", price: 260 },
  "P250 | Cassette": { rarity: "industrial", price: 19 },
  "Desert Eagle | Printstream": { rarity: "covert", price: 520 },
  "Skeleton Knife | Tiger Tooth": { rarity: "mythic", price: 950 },
  "Tec-9 | Fuel Injector": { rarity: "classified", price: 190 },
  "M4A1-S | Decimator": { rarity: "classified", price: 225 },
  "AK-47 | Neon Rider": { rarity: "covert", price: 470 },
  "M4A4 | Cyber Security": { rarity: "classified", price: 210 },
  "AWP | Hyper Beast": { rarity: "covert", price: 490 },
  "Karambit | Lore": { rarity: "mythic", price: 980 },
  "Glock-18 | Vogue": { rarity: "restricted", price: 118 },
  "USP-S | Kill Confirmed": { rarity: "covert", price: 460 },
  "M9 Bayonet | Crimson Web": { rarity: "mythic", price: 1080 },
  "SSG 08 | Dragonfire": { rarity: "covert", price: 390 },
  "AK-47 | Inheritance": { rarity: "classified", price: 275 },
  "Sport Gloves | Bronze Morph": { rarity: "mythic", price: 920 },
  "AWP | Gungnir": { rarity: "mythic", price: 1250 },
  "AK-47 | Wild Lotus": { rarity: "mythic", price: 1180 },
  "Butterfly Knife | Fade": { rarity: "mythic", price: 1320 },
  "M4A4 | Howl": { rarity: "mythic", price: 1100 },
  "AWP | Dragon Lore": { rarity: "mythic", price: 1400 },
  "Talon Knife | Marble Fade": { rarity: "mythic", price: 1010 },
  "USP-S | Orion": { rarity: "covert", price: 380 },
  "M4A1-S | Knight": { rarity: "mythic", price: 790 },
  "Specialist Gloves | Fade": { rarity: "mythic", price: 990 },
  "Desert Eagle | Blaze": { rarity: "mythic", price: 840 },
  "AK-47 | Fire Serpent": { rarity: "mythic", price: 1160 },
  "Sport Gloves | Pandora's Box": { rarity: "mythic", price: 1220 },
  "P90 | Death by Kitty": { rarity: "restricted", price: 118 },
  "MP7 | Urban Hazard": { rarity: "industrial", price: 76 },
};

const skinImages = {
  "P2000 | Granite Marbleized": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL5lYayrXIL0Pq3V6N_If6aGmKvzOtyufRkASuylkh2tjvdmd2ocy6eaw90WJJxROVbskW9ldXjYuPn4AHYidlEy3ngznQe6034Y2E",
  "Nova | Clear Polymer": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL_kYDhwiFO0PyhfqVSMP-fF2qV09F6ueZhW2exxkR-tmWEmIyoJXyWZw4iDsclROVftxm7wIe1NbizswPe2YlHmCuvkGoXuVU3K7Ec",
  "M4A1-S | Basilisk": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_GCMWrEwL9lj-NoXCC_nA4sjDCAnobsLGWXbgEnC8RzEOUOuxS7w9S0P77k7g3e2dgWzn-oiSlLuCw967wBB6F35OSJ2FhRctFB",
  "Five-SeveN | Capillary": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL3l4Dl7idN6vyRa7FSJvmFC3SV1-t4j_dsRieMmRQguynLmY79IinFbA90CZN2Q-Bc4UW6x9KyZLnjtQCMjo8WyXr7jy1O6Ck_sfFCD_SqR6qLvA",
  "AWP | Atheris": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V7JkMPWBMWqVxedjva85Girklhl2sWuAmYusICqWbQJxCcclRe4C4Ba5ldOyYeri7gKLg95E02yg2f7FnVOo",
  "USP-S | Blueprint": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA0tF0vPRsXzu6mwkYuziEjJa3dy6fbwYhXpN4TeVfukOwm4bkY77l5gXfgooQniX-2iMdvC0-6-4BBL1lpPM4MSFYyg",
  "MP9 | Black Sand": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8js_f_jdk4uL3V6ZhIfOYMXSRz-pJuORoWTD9kBslt27Vyo2udymWb1VxXMEjQLED4xCxxNLvMuzltQyM2NhAnCn3jjQJsHhlmzcNoA",
  "Glock-18 | Moonrise": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1a7s2pZKtuK8_CVliF0-x3vt5kQCa9qhsipTiXpYL8JSLSMxgnApJwF-ALsxXpm4W1N7zr4lCK2Y1FzXmoiS5PvCpvsbwFAKBwrKfVkUifZu_LJHFP",
  "M4A4 | Neo-Noir": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiFO0P_6afBSLvWcMWmfyPxJveRtRjy-2xh15D7dyN_9In7GaQN1C5V2QrReuhLtm9TlZb-w7gzbiY8Uyn_5jXlXrnE8Rz2LjAE",
  "CZ75-Auto | Polymer": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLyhMG1_B1a4s2tcrI_H_2VMWuZxuZi_rcwSnHjwxgh527SzI6oIHKUZ1dxA8ckTbUCskG6ldTuY-nh5FTf34JbjXKpj6qz0B4",
  "Sawed-Off | Wasteland Princess": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLin4Hl-S1d6c2tfZt6MM-AD3CVxeFwtt5kSi26gBBp4jjXw9f9JHOXaAF0WMNwTeEIuhK_k4DlY-uz4gPai4NNnCqsiyIc7TErvbiW3Wbv9Q",
  "Driver Gloves | Queen Jaguar": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5T441rsfhr9kYDl7h1I4_utY5tnIfeGD3Wv2Ot6vO5-cCS2kRQyvnPTztqqJS6TaAAhXJtzQu9Z4xi7ldW1Yr7itASL2YNBzSWvjCtMuik-_a9cBnBnu6hR",
  "AUG | Momentum": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwi5Hf_jdk7uepV6liLfWdGnKd_uNztOh8QmfikU0m52vVno2gJ37DbQVzD5BzQ7YKtBS-ltfvYrjmsQLeg98UnyqqkGoXuewRZ8dF",
  "MAC-10 | Disco Tech": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8n5WxrR1Y-s2jaac8cM-dD2SCxNF7teVgWiT9kBkupjDLz9_6c3mWPFBxX8N0EOMIsULpmtHjPuvq41bc2dhAzy3_2ngfvHpt5_FCD_RJLjxjaQ",
  "M4A4 | The Emperor": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiVI0P_6afBSJf2DC3Wf09F7teVgWiT9kEtxsW_dntepcn2SZgF1CcN3RORe4RTtlN2yYenh7wPXiYxDmS_22jQJsHjOUN0CaQ",
  "MP9 | Modest Threat": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8js_f-jFk4uL3V6diLP-dFzfB_uNztOh8QmfikRgpjDCAnobsLGWVOwd1XJcmRuZZthewlYXvMO7h5w2K3oxHz3r22jQJsHiZ9Gbu9w",
  "AK-47 | Asiimov": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSIeOaB2qf19F6ueZhW2e2wEt-t2jcytf6dymSO1JxA5oiRecLsRa5kIfkYr-241aLgotHz3-rkGoXuUp8oX57",
  "AWP | Neo-Noir": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V6poL_6cB3WvzOtyufRkASuwzEl35Dvdw9yqIyjDb1UlC8d2Q7ZZ5BK7mtSyMrjj4wHyFntbA",
  "FAMAS | Meow 36": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL3n5vh7h1c_M2oaalsM8-QAXWA_uNzv_ZWQyC0nQlp6jvVztaudCnEbAUgDsckFOAJsBLtlN2yP7zqslGMiooXyCX43H8Y5zErvbiVlZtU7g",
  "USP-S | Printstream": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_v5kue99XD2hkBwqjDCAnobsLGXFOwQnCZQmE7MPu0G5l9HhNe7q7lOK2tgXmCn4jiofvCZisboKWfZw5OSJ2G1OXXQx",
  "AK-47 | Ice Coaled": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSI_-UGm-Zz-llj-xsSyCmmFMj62Tcwt-gJC_BbwNyDZokQu8I4BK6wdazMuq35AbW3YIWmy_4h3tO8G81tKCz9TDP",
  "P250 | Cassette": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhzMOwwiFO0OL8PfRSI_GAHWKE1etJveRtRjy-20h14GnRzY2gcS-UPABxWcB0FOcM5hS8kYKxZOLl5gze34NDzyv_23lXrnE8AHot8o8",
  "Desert Eagle | Printstream": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7OeRbKFsJ8-DHG6e1f1iouRoQha-kBkupjDLw96pcX6TZg5yCZJ5TbNZtxjtwNS2NemztgDbidoQyH-sjCga6no-6_FCD_QEyQmfGQ",
  "Skeleton Knife | Tiger Tooth": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1I5PeibbBiLs-SAFiEyOlzot5mXSi9khgYvzSCkpu3dyjBagAlXMB4R-YOt0OxlIe2ZuuztQXdjNhAySn52i5Mv3tj5rlRUb1lpPPHmhG_Tw",
  "Tec-9 | Fuel Injector": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLlm5W5wiVI0Oara_1SM-WDC3WTye9kt-RtcCW6khUz_Wvcy9qgdCnEPQ8hApBzRrQJ4RW7moDgMLzktFDZiI5HnyWr3ChN5yp1o7FVg4hNKG8",
  "M4A1-S | Decimator": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_eAMWrEwL9JtORqRiSygRI1jDCAnobsLGXBawMlXJohFLRY5BO5kILiMuzrsQTWi9gWnyr9insYuCZj5LtQVaEk5OSJ2CFIuQ75",
  "AK-47 | Neon Rider": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlV6poL_6sHG6UxPxJveRtRjy-2xh15D7dyN_9In7GaQN1C5V2QrReuhLtm9TlZb-w7gzbiY8Uyn_5jXlXrnE8Rz2LjAE",
  "M4A4 | Cyber Security": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiFO0P_6afBSLvWcMWmfyPxJveRtRjy-20h-5HnVzIysJCmePVIhApMkEO8Nuheww9PuMe3h5w2K3oxHz3r22jQJsHiZ9Gbu9w",
  "AWP | Hyper Beast": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V6x0MPWBMWWVwP1ij-xsSyCmmFMj62Tcwt-gJC_BbwNyDZokQu8I4BK6wdazMuq35AbW3YIWmy_4h3tO8G81tKCz9TDP",
  "Karambit | Lore": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-QG1ibwPx3vd5lQDu2qhEutDWR1IqrIHLCZlUmDJYlTLFb50HuwdyxPu2w4lCKjI5HniT2jS1PuCxj5e0cEf1y9ZCADXU",
  "Glock-18 | Vogue": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1Y-s2pZKtuK8-WF2KTzuBiseJ9cCS2kRQyvnOEwtb6dHyUOAEhWJdxTbELsxi4mtHuN-jr7wXfi44Xni2vjSsd7ydo_a9cBrvZd2pE",
  "USP-S | Kill Confirmed": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_uV_vO1WTCa9kxQ1vjiBpYL8JSLSMxghCMEjEeNe5hHpw9zhYuOz5VfcitpBmyqt3X9O6itrsesFUfYmrKzTkUifZqPQtnZK",
  "M9 Bayonet | Crimson Web": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Wts2sab1iLvWHMW-J_vlzsvJWQyC0nQlp4GrWzYuqeHjDZlN1XJohTecO5xawwdDvNuLm5wPcjY0QzyX83Xsd7zErvbgxKe4lfw",
  "SSG 08 | Dragonfire": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLijZGwpR1Y-s29e6M9eM-XHGaXzuBwufNscDqwmg0ijDGMnYftbyrFPVAoWcQjELQOuxO4k4e1N-nnsQfW2I5Mz3ivi3wb7Stj5ukAUKY7uvqAqS55_Pw",
  "AK-47 | Inheritance": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiNQ0OKheqdoLPGaAFidxOp_pewnSn6wl0p-4D7Ryo34cSqeOwMlWZt5QbJfuhW9koKyMO3ksgWMiY8TzDK-0H009BnnIw",
  "Sport Gloves | Bronze Morph": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Tk5UvzWCL2kpn2-DFk_OKherB0H-CcB3Sfz9Fwou5ucDu2kSIgoTiAlLDxJCrRJxghC5J4Q-IMsBe7xNfvP7i0tgTYjt8RxS34iH5O6X1j5bpQVqp2-a2EkUifZktacSYp",
  "AWP | Gungnir": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf-jFk7uW-V6N4LvedB3WvzOtyufRkASuwzEl35Dvdw9yqIyjDb1UlC8d2Q7ZZ5BK7mtSyMrjj4QzcjIlNnyzgznQesHByhus",
  "AK-47 | Wild Lotus": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlV61-LPGdCliWzeFkse1WQiy3nAgq_T_Tzon_cnnGOgMpXpFwQLECtBW_k9ayMbzisgCIiN5CxC2siiwa6Cp1o7FV456Pn5U",
  "Butterfly Knife | Fade": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Z-ua6bbZrLOmsD2avx-9ytd5lRi67gVNwsDvSwtqqc3iXZg4kCZYjReYLtRbum9XgYuvm5wbWjtgUzCn3iSsf8G81tFEeH9rw",
  "M4A4 | Howl": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiFO0P_6afVSKP-EAm6extF7teVgWiT9wh5_5zyAwo6oeSrDawUkCMN0QbEM5BO-wNazMe3qsgHZg4wQyy-t2jQJsHi3nDJ37A",
  "AWP | Dragon Lore": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk4veqYaF7IfysCnWRxuF4j-B-Xxa-kBkupjDLw96pcX6TZg5yCZJ5TbNZtxjtwNS2NemztgDbidoQyH-sjCga6no-6_FCD_QEyQmfGQ",
  "Talon Knife | Marble Fade": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1M5vahf6lsK_WBMWad_uN3ouNlSha1lB4-jDCAnobsLGWVOwd1XJcmRuZZthewlYXvMO7h5w2K3oxHz3r22jQJsHiZ9Gbu9w",
  "USP-S | Orion": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XuWbwcuyMESA4Fdl-4nnpU7iQA3-kKn17jJk_PuibapuJeLdWGLFwL8i4eVsFiqxxUt34jmHnoysJ3qVOAYgCJZwQrRb5EPul4XlYvSiuVIHgy4Xvg",
  "M4A1-S | Knight": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_GeMWqV1e96o95lRi67gVNwsWTQzdn4JHyQZ1QhWMZyQe5YsxK-ktPnZOi5gXfgooQniX-2iMdvC0-6-4BBL1lpPM4MSFYyg",
  "Specialist Gloves | Fade": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Tk71ruQBH4jYLf-i5U-fe9V7d9JfOaD2uZ0vpJtuBtSha_nBovp3PQy42sdX6eagIjW5AlQOVetBXuk92xNLvg4gOMjd5AmC2ointB53w__a9cBqntWBk3",
  "Desert Eagle | Blaze": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7vORbqhsLfWAMWuZxuZi_uI_TX6wxxkjsGXXnImsJ37COlUoWcByEOMOtxa5kdXmNu3i4MTT2v3XsYPH1w",
  "AK-47 | Fire Serpent": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0PSneqF-JeKDC2mE_u995LZWTTuygxIYvzSCkpu3cnvFPQB2DpUkROFY4Rntw93lP7i241DbiI1BxSuviHlKunk_6-sHU71lpPMTRLyP4Q",
  "Sport Gloves | Pandora's Box": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Tk5UvzWCL2kpn2-DFk_OKherB0H-CGHHecxNF6ueZhW2exk01w4j7cmYn4eHPCbAMhApdwTOIN5BPsx9yyYu605FTeid0Uy3j3kGoXueKyz5wo",
  "P90 | Death by Kitty": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhx8bf_jdk7PO6e694LPyAMXfJkdF7teVgWiT9xU1-sWTTwt-tc3iSaVMgXpp5RLQMtBS8ltLlML7j5AaLg4pEmST72jQJsHgn5qmykw",
  "MP7 | Urban Hazard": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8jsHf_jdk4uL5JadiLf2SAGOV09F7teVgWiT9wExz52nVyIysJCmePVIhApMkEO8Nuheww9PuMe3h5w2K3oxHz3r22jQJsHiZ9Gbu9w",
  "Sawed-Off | Black Sand": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLin4Hl-S1d6c2tfZt-IeeWCmiWx9F0vOBqRBaglBMjjDGMnYftb3qSOAF2XpV0ELMJsUS_ldGzMO_isVHagt9Az32ojiob6Hk9sbtXB6o7uvqARF8zTjE",
  "MP5-SD | Kitbash": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8jsPz-R1c_M2jePF-JM-ED3SExOJ3vuVWQyy0lB4-jDCAnobsLGWVOwd1XJcmRuZZthewlYXvMO7h5w2K3oxHz3r22jQJsHiZ9Gbu9w",
};

Object.assign(skinImages, {
  "AWP | Neo-Noir": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V6poL_6cB3WvzedxuPUnHirrxR4l423SyI39I3KXPwdxWZclQeNZ5EXskYfnNeyw71OMi9lNzDK-0H3r66pOTw",
  "AK-47 | Neon Rider": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlV6poL_6sHG6UxPxJveRtRjy-2x9_5GiBmYn4JHiVa1NyXMMkRuNe5ka5k9eyM-q2sQHc2NpCmyWvin5XrnE89iGyCXM",
  "MP9 | Modest Threat": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8js_f-jFk4uL3V6diLP-dFzfB_uNztOh8Qmfixh8mtTuGm9iocXKTbQEjWZAjRbNZshCwm9HvNLy04wPeidhCyX38kGoXua4ClY9d",
  "Desert Eagle | Blaze": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7vORbqhsLfWAMWuZxuZi_uI_TX6wxxkjsGXXnImsJ37COlUoWcByEOMOtxa5kdXmNu3htVPZjN1bjXKpkHLRfQU",
  "Talon Knife | Marble Fade": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1M5vahf6lsK_WBMWad_uN3ouNlSha1lBkijCqMnoDuHifOOV5kFJMlQecC4RW5x4bkMLvgsgGP2IIXzy_-iysaunlo4bwEBfYh_aLS3A7fcepqAVr8ibw",
  "M4A4 | Cyber Security": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiFO0P_6afBSI-mRC3WA1OB9j-xsSyCmmFN_5Tvdm9ypcXnGPQ8iXMYjF7EM50a8wdKzMOLntFfb3d5BnnmriH9N8G81tGbS0tGU",
  "M4A1-S | Knight": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_GeMWqV1e96o95lRi67gVNwsWTQzdn4JHyQZ1QhWMZyQe5YsxK-ktPnZOiwtVDcjo9ExS393ytB8G81tGXpYjdX",
  "MAC-10 | Disco Tech": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8n5WxrR1Y-s2jaac8cM-dD2SCxNF7teVgWiT9xht3tWzXy9j_eXuWagAlXJVxFOcI4BK7ltXmP-rltgCPjYhEnCuqhzQJsHgdu4rIbA",
  "AK-47 | Ice Coaled": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSI_-UGm-Zz-llj-1gSCGn2x4l5z_RyNj6JXnEbgFzXMYjEOUIsBe5m9exP-zg4leMj4pGxXn7jCJXrnE84asPq_0",
  "Desert Eagle | Printstream": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7OeRbKFsJ8-DHG6e1f1iouRoQha_nBovp3OGmdeqInyVP1V0XsYlRbEI50a5wNyzZr605AyI3t5MmCSohylAuC89_a9cBoMY9UkV",
  "MP5-SD | Kitbash": "https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8jsPz-R1c_M2jePF-JM-ED3SExOJ3vuVWQyy0lB4-jDGMnYftb32XZ1NyX5B5QuJcthi7k9K0Ye6zsQeP2IMRyiX4iSJLvC5q6-4HUaY7uvqAsG-atjE",
});

const wearOptions = ["Factory New", "Minimal Wear", "Field-Tested", "Battle-Scarred"];

// const mockSteamProfile = {
//   steamId: "76561199584721642",
//   nickname: "Arsenii",
//   personaState: "Online",
//   connectedAt: "13.09.2026",
//   avatar:
//     "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%2353ad79'/%3E%3Cstop offset='.55' stop-color='%23233244'/%3E%3Cstop offset='1' stop-color='%23426dff'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='160' height='160' rx='30' fill='%23070b10'/%3E%3Ccircle cx='80' cy='80' r='68' fill='url(%23g)'/%3E%3Ccircle cx='58' cy='61' r='14' fill='%23f4f7fb' opacity='.95'/%3E%3Ccircle cx='105' cy='58' r='18' fill='%23f4f7fb' opacity='.92'/%3E%3Cpath d='M39 116c9-24 71-25 82 0' fill='none' stroke='%23f4f7fb' stroke-width='13' stroke-linecap='round'/%3E%3Cpath d='M35 41l90 76' stroke='%23070b10' stroke-width='8' opacity='.38'/%3E%3C/svg%3E",
// };

const rarityDropWeight = {
  consumer: 72,
  industrial: 56,
  milspec: 44,
  restricted: 22,
  classified: 10,
  covert: 3.4,
  mythic: 0.85,
};

function getSkinInfo(name) {
  return skinCatalog[name] || { rarity: "milspec", price: 60 };
}

function getWeaponName(name) {
  return name.replace(/^★\s*/, "").split(" | ")[0];
}

function previewItemFromName(name) {
  const base = getSkinInfo(name);

  return {
    id: `preview-${name}`,
    name,
    weapon: getWeaponName(name),
    rarity: base.rarity,
    price: base.price,
    wear: "",
  };
}

function pickWeightedDrop(crate) {
  const pool = crate.drops.map((name) => {
    const item = getSkinInfo(name);
    const valuePenalty = Math.max(0.12, Math.min(1, crate.price / Math.max(item.price, 1)));
    const premiumPenalty = item.price >= 800 ? 0.42 : item.price >= 450 ? 0.58 : item.price >= 250 ? 0.76 : 1;

    return {
      name,
      weight: (rarityDropWeight[item.rarity] || 24) * valuePenalty * premiumPenalty,
    };
  });
  const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const item of pool) {
    roll -= item.weight;
    if (roll <= 0) return item.name;
  }

  return pool[0]?.name || crate.drops[0];
}

function calculateUpgradeChance(item, target) {
  if (!item || !target) return 0;

  return Math.max(1, Math.min(95, Math.round((item.price / Math.max(target.price, 1)) * 100)));
}

function itemFromName(name, cratePrice = 0) {
  const base = getSkinInfo(name);
  const variance = 0.84 + Math.random() * 0.32;

  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    weapon: getWeaponName(name),
    rarity: base.rarity,
    price: Math.max(8, Math.round((base.price + cratePrice * 0.15) * variance)),
    wear: wearOptions[Math.floor(Math.random() * wearOptions.length)],
  };
}

function App() {
  const [activeView, setActiveView] = useState("cases");
  const [activeType, setActiveType] = useState("all");
  const [inventory, setInventory] = useState([]);
  const [balance, setBalance] = useState(30);
  const [selectedCase, setSelectedCase] = useState(cases[0]);
  const [lastDrop, setLastDrop] = useState(null);
  const [openResult, setOpenResult] = useState(null);
  const [upgradeResult, setUpgradeResult] = useState(null);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeRoll, setUpgradeRoll] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [steamProfile, setSteamProfile] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(targets[0]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLogin, setAdminLogin] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminView, setAdminView] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [editingCase, setEditingCase] = useState(null);
  const [isOpening, setIsOpening] = useState(false);
  const [rollingItems, setRollingItems] = useState([]);
  const [upgradeMultiplier, setUpgradeMultiplier] = useState(2);
  const [openCount, setOpenCount] = useState(1);
  const [users, setUsers] = useState([
    { id: 1, steamId: "76561199584721642", nickname: "Arsenii", balance: 30, connectedAt: new Date().toISOString() },
  ]);

  const caseGroupKey = (item) => (item.price === 0 ? "free" : item.type);

  const filteredCases = useMemo(() => {
    if (activeType === "all") return cases;
    return cases.filter((item) => caseGroupKey(item) === activeType);
  }, [activeType]);

  const groupedCases = useMemo(() => {
    return caseTypes
      .filter((type) => type.id !== "all")
      .map((type) => ({
        ...type,
        cases: cases.filter((item) => caseGroupKey(item) === type.id),
      }));
  }, []);

  const upgradeTargets = useMemo(() => {
    if (!selectedItem) return targets;
    const wanted = selectedItem.price * upgradeMultiplier;
    const pool = Object.entries(skinCatalog)
      .filter(([name]) => name !== selectedItem.name)
      .map(([name, info]) => ({ name, rarity: info.rarity, price: info.price }))
      .filter((entry) => entry.price >= wanted * 0.7 && entry.price <= wanted * 1.5)
      .sort((a, b) => Math.abs(a.price - wanted) - Math.abs(b.price - wanted))
      .slice(0, 8);

    return pool.length ? pool : targets;
  }, [selectedItem, upgradeMultiplier]);

  useEffect(() => {
    if (upgradeTargets.length && !upgradeTargets.some((target) => target.name === selectedTarget?.name)) {
      setSelectedTarget(upgradeTargets[0]);
    }
  }, [upgradeTargets, selectedTarget]);

  const viewCase = (crate = selectedCase) => {
    if (isOpening) return;
    setSelectedCase(crate);
    setOpenCount(1);
    setOpenResult({ crate, item: null, items: [], error: "" });
    setUpgradeResult(null);
    setActiveView("opening");
  };

  const openCase = (crate = selectedCase, count = openCount) => {
    if (isOpening) return;

    const amount = Math.max(1, count);
    const cost = crate.price * amount;

    if (balance < cost) {
      setOpenResult({ crate, item: null, items: [], error: `Недостатньо кредитів для відкриття ${amount > 1 ? `${amount} кейсів` : "цього кейса"}.` });
      return;
    }

    const rolledItems = Array.from({ length: amount }, () => {
      let dropItem = itemFromName(pickWeightedDrop(crate), crate.price);
      if (crate.id === "starter-free" && dropItem.price < 30) {
        dropItem = { ...dropItem, price: 30 };
      }
      return dropItem;
    });
    const bestItem = rolledItems.reduce((best, entry) => (entry.price > best.price ? entry : best), rolledItems[0]);

    setIsOpening(true);
    setBalance((value) => value - cost);
    setRollingItems(rolledItems);

    window.setTimeout(() => {
      setLastDrop(bestItem);
      setInventory((items) => [...rolledItems, ...items].slice(0, 16));
      setSelectedItem(bestItem);
      setOpenResult({ crate, item: bestItem, items: rolledItems, error: "" });
      setUpgradeResult(null);
      setIsOpening(false);
      setRollingItems([]);
    }, 3200 + (amount - 1) * 150);
  };

  const upgradeChance = calculateUpgradeChance(selectedItem, selectedTarget);

  const quickSell = (item) => {
    setBalance((value) => value + item.price);
    const nextItems = inventory.filter((entry) => entry.id !== item.id);
    setInventory(nextItems);
    if (selectedItem?.id === item.id) {
      setSelectedItem(nextItems[0] || null);
    }
  };

  const sellAll = () => {
    const total = inventory.reduce((sum, item) => sum + item.price, 0);
    setBalance((value) => value + total);
    setInventory([]);
    setSelectedItem(null);
  };

  const runUpgrade = () => {
    if (!selectedItem || isUpgrading) return;

    const inputItem = selectedItem;
    const targetItem = selectedTarget;
    const chance = calculateUpgradeChance(inputItem, targetItem);
    const roll = Math.round((Math.random() * 100 + Number.EPSILON) * 10) / 10;
    const won = roll <= chance;

    setIsUpgrading(true);
    setUpgradeRoll({ roll, won, chance });
    setUpgradeResult(null);

    window.setTimeout(() => {
      const remainingItems = inventory.filter((item) => item.id !== inputItem.id);
      const remainingSelected = remainingItems[0] || null;
      const resultItem = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name: targetItem.name,
        weapon: getWeaponName(targetItem.name),
        rarity: targetItem.rarity,
        price: targetItem.price,
        wear: wearOptions[Math.floor(Math.random() * wearOptions.length)],
      };
      const nextItems = won ? [resultItem, ...remainingItems] : remainingItems;

      setInventory(nextItems);
      setSelectedItem(won ? resultItem : remainingSelected);
      setLastDrop(won ? resultItem : lastDrop);
      setUpgradeResult({ won, input: inputItem, target: resultItem, chance, roll });
      setIsUpgrading(false);
    }, 2800);
  };

  const connectSteam = () => {
    window.location.href = "/api/auth/steam";
  };

  const disconnectSteam = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setSteamProfile(null);
      setActiveView("auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleAdminLogin = (login, password) => {
    if (login === "admin" && password === "admin") {
      setIsAdmin(true);
      setAdminLogin("");
      setAdminPassword("");
    } else {
      alert("Невірний логін або пароль");
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setActiveView("auth");
  };

  const updateUserBalance = (userId, newBalance) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, balance: newBalance } : user)));
    // If it's the current user (admin testing), update their balance too
    if (steamProfile && steamProfile.steamId === users.find(u => u.id === userId)?.steamId) {
      setBalance(newBalance);
    }
  };

  const updateCasePrice = (caseId, newPrice) => {
    const updatedCases = cases.map((crate) => (crate.id === caseId ? { ...crate, price: newPrice } : crate));
    // Update the selected case if it's the one being edited
    if (selectedCase.id === caseId) {
      setSelectedCase(updatedCases.find(c => c.id === caseId));
    }
    console.log("Updated case:", caseId, "new price:", newPrice);
  };

  const addSkinToCase = (caseId, skinName) => {
    const updatedCases = cases.map((crate) => (crate.id === caseId ? { ...crate, drops: [...crate.drops, skinName] } : crate));
    if (selectedCase.id === caseId) {
      setSelectedCase(updatedCases.find(c => c.id === caseId));
    }
    console.log("Added skin to case:", caseId, "skin:", skinName);
  };

  const removeSkinFromCase = (caseId, skinName) => {
    const updatedCases = cases.map((crate) => (crate.id === caseId ? { ...crate, drops: crate.drops.filter((skin) => skin !== skinName) } : crate));
    if (selectedCase.id === caseId) {
      setSelectedCase(updatedCases.find(c => c.id === caseId));
    }
    console.log("Removed skin from case:", caseId, "skin:", skinName);
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        if (data.profile) {
          setSteamProfile(data.profile);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    };

    loadProfile();

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("steam") === "connected") {
      loadProfile();
      window.history.replaceState({}, "", window.location.pathname);
    } else if (urlParams.get("steam") === "failed") {
      console.error("Steam authentication failed");
      window.history.replaceState({}, "", window.location.pathname);
    }

    if (window.location.pathname === "/admin") {
      setActiveView("admin");
    }
  }, []);

  return (
    <div className="app-shell">
      <main className="page-wrap">
        {activeView === "cases" && (
          <CasesView
            activeType={activeType}
            filteredCases={filteredCases}
            groupedCases={groupedCases}
            onOpen={viewCase}
            onSelect={setSelectedCase}
            selectedCase={selectedCase}
            setActiveType={setActiveType}
          />
        )}
        {activeView === "opening" && (
          <OpeningView
            balance={balance}
            count={openCount}
            onSelectCount={setOpenCount}
            onOpen={() => openResult?.crate && openCase(openResult.crate, openCount)}
            onAgain={() => viewCase(openResult?.crate || selectedCase)}
            onBack={() => setActiveView("cases")}
            onKeep={() => setActiveView("inventory")}
            onSell={(item) => {
              quickSell(item);
              setOpenResult((result) => ({ ...result, item: { ...item, sold: true } }));
            }}
            onSellAll={(items) => {
              const soldIds = new Set(items.map((entry) => entry.id));
              setBalance((value) => value + items.reduce((sum, entry) => sum + entry.price, 0));
              setInventory((current) => current.filter((entry) => !soldIds.has(entry.id)));
              if (selectedItem && soldIds.has(selectedItem.id)) setSelectedItem(null);
              setOpenResult((result) => ({
                ...result,
                soldAll: true,
                items: result.items.map((entry) => ({ ...entry, sold: true })),
              }));
            }}
            result={openResult}
            isOpening={isOpening}
            rollingItems={rollingItems}
          />
        )}
        {activeView === "vault" && (
          <VaultView balance={balance} dropsCount={inventory.length} lastDrop={lastDrop} onOpen={() => viewCase(selectedCase)} selectedCase={selectedCase} />
        )}
        {activeView === "upgrade" && (
          <UpgradeView
            chance={upgradeChance}
            item={selectedItem}
            inventory={inventory}
            isUpgrading={isUpgrading}
            multiplier={upgradeMultiplier}
            onSelectItem={setSelectedItem}
            onSelectMultiplier={setUpgradeMultiplier}
            onSelectTarget={setSelectedTarget}
            onUpgrade={runUpgrade}
            result={upgradeResult}
            roll={upgradeRoll}
            selectedTarget={selectedTarget}
            targetOptions={upgradeTargets}
          />
        )}
        {activeView === "inventory" && (
          <InventoryView inventory={inventory} onSell={quickSell} onSellAll={sellAll} />
        )}
        {activeView === "profile" && (
          <ProfileView balance={balance} inventory={inventory} onSteamLogin={connectSteam} onSteamLogout={disconnectSteam} steamProfile={steamProfile} onDeposit={() => setActiveView("deposit")} />
        )}
        {activeView === "auth" && (
          <AuthView
            mode={authMode}
            onSteamLogin={connectSteam}
            onSteamLogout={disconnectSteam}
            setMode={setAuthMode}
            steamProfile={steamProfile}
          />
        )}
        {activeView === "deposit" && (
          <DepositView balance={balance} onDeposit={(amount) => setBalance((prev) => prev + amount)} />
        )}
        {activeView === "admin" && (
          <AdminView
            isAdmin={isAdmin}
            onLogin={handleAdminLogin}
            onLogout={handleAdminLogout}
            users={users}
            onUpdateBalance={updateUserBalance}
            onUpdateCasePrice={updateCasePrice}
            onAddSkin={addSkinToCase}
            onRemoveSkin={removeSkinFromCase}
            cases={cases}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            adminView={adminView}
            setAdminView={setAdminView}
            editingCase={editingCase}
            setEditingCase={setEditingCase}
            adminLogin={adminLogin}
            setAdminLogin={setAdminLogin}
            adminPassword={adminPassword}
            setAdminPassword={setAdminPassword}
          />
        )}
      </main>
      <BottomNav activeView={activeView} balance={balance} onChange={setActiveView} />
    </div>
  );
}

function CasesView({ activeType, filteredCases, groupedCases, onOpen, onSelect, selectedCase, setActiveType }) {
  return (
    <section className="screen cases-screen">
      <div className="free-drop-banner">
        <Gift size={18} />
        <span>
          Для нових користувачів — <b>1 безкоштовне відкриття</b> кейса Starter Case
        </span>
      </div>

      <div className="hero-band">
        <div className="hero-copy">
          <span className="eyebrow">CS cases · tactical unboxing protocol</span>
          <h1>
            BAT
            <span>CASE</span>
          </h1>
          <div className="hero-stats">
            <span>16 cases</span>
            <span>{totalSkinCount} skins</span>
            <span>free + paid</span>
          </div>
        </div>
        <FeaturedCase crate={selectedCase} onOpen={() => onOpen(selectedCase)} />
      </div>

      <div className="section-head">
        <div>
          <span className="eyebrow">Sectors</span>
          <h2>Available Crates</h2>
        </div>
        <span className="muted">{filteredCases.length} кейсів у фільтрі</span>
      </div>

      <div className="type-tabs" role="tablist" aria-label="Case types">
        {caseTypes.map((type) => (
          <button
            className={activeType === type.id ? "type-tab active" : "type-tab"}
            key={type.id}
            onClick={() => setActiveType(type.id)}
            type="button"
          >
            <span>{type.label}</span>
            <small>{type.helper}</small>
          </button>
        ))}
      </div>

      {activeType === "all" ? (
        groupedCases.map((group) => (
          <div className="case-group" key={group.id}>
            <div className="case-group-title">
              <h3>{group.label}</h3>
              <span>{group.cases.length} cases</span>
            </div>
            <div className="case-grid">
              {group.cases.map((crate) => (
                <CaseCard crate={crate} key={crate.id} onOpen={onOpen} onSelect={onSelect} selected={selectedCase.id === crate.id} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="case-grid">
          {filteredCases.map((crate) => (
            <CaseCard crate={crate} key={crate.id} onOpen={onOpen} onSelect={onSelect} selected={selectedCase.id === crate.id} />
          ))}
        </div>
      )}
    </section>
  );
}

function FeaturedCase({ crate, onOpen }) {
  return (
    <aside className="featured-case">
      <div className="featured-top">
        <span>{crate.code}</span>
        <span>{crate.price ? `${crate.price} cr` : "free"}</span>
      </div>
      <CrateArt accent={crate.accent} variant={crate.type} />
      <h3>{crate.name}</h3>
      <p>{crate.drops.length} skins · {crate.volatility} volatility · {caseTypes.find((type) => type.id === (crate.price === 0 ? "free" : crate.type))?.label}</p>
      <button className="primary-action" onClick={onOpen} type="button">
        <PackageOpen size={16} />
        Open selected
      </button>
    </aside>
  );
}

function CaseCard({ crate, onOpen, onSelect, selected }) {
  return (
    <article className={selected ? "case-card selected" : "case-card"}>
      <div className="case-card-top">
        <span>{crate.code}</span>
        <span>{crate.price ? `${crate.price} cr` : "free"}</span>
      </div>
      <CrateArt accent={crate.accent} variant={crate.type} />
      <div className="case-card-body">
        <h3>{crate.name}</h3>
        <p>{crate.drops.length} skins · {crate.drops.slice(0, 2).join(" · ")}</p>
        <div className="case-card-actions">
          <button className="select-button" disabled={selected} onClick={() => onSelect(crate)} type="button">
            {selected ? "Обрано" : "Обрати"}
          </button>
          <button className="open-button" onClick={() => onOpen(crate)} type="button">
            Відкрити
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}

function OpeningView({ balance, count, onOpen, onAgain, onBack, onKeep, onSelectCount, onSell, onSellAll, result, isOpening, rollingItems }) {
  const crate = result?.crate || cases[0];
  const item = result?.item;
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!item) {
      setShowResult(false);
      return;
    }
    const timer = setTimeout(() => setShowResult(true), 350);
    return () => clearTimeout(timer);
  }, [item]);

  if (result?.error) {
    return (
      <section className="screen opening-screen">
        <div className="opening-error-center">
          <div className="error-icon">
            <AlertTriangle size={28} />
          </div>
          <h2>Не вистачає кредитів</h2>
          <p>{result.error}</p>
          <button className="primary-action wide" onClick={onBack} type="button">
            До кейсів
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="screen opening-screen">
      <div className="opening-center">
        <div className="opening-header">
          <span className="eyebrow">{item ? "You won" : "Case opening"}</span>
          <h2>{crate.name}</h2>
          <p>
            {crate.code} · ціна {crate.price ? `${crate.price} cr` : "free"} · баланс {balance} cr
          </p>
        </div>

        <div className="opening-case-display">
          {!isOpening && !item && (
            <>
              <CrateArt accent={crate.accent} variant={crate.type} />
              <div className="multiplier-tabs">
                {[1, 2, 3, 5].map((value) => (
                  <button
                    className={count === value ? "multiplier-tab active" : "multiplier-tab"}
                    key={value}
                    onClick={() => onSelectCount(value)}
                    type="button"
                  >
                    x{value}
                  </button>
                ))}
              </div>
              <button className="primary-action wide open-case-button" onClick={onOpen} type="button">
                <PackageOpen size={16} />
                {crate.price
                  ? `Відкрити${count > 1 ? ` x${count}` : ""} за ${crate.price * count} cr`
                  : "Відкрити безкоштовно"}
              </button>
            </>
          )}
          {isOpening && rollingItems.length > 0 && (
            <div className="case-scroll-stack">
              {rollingItems.map((drop, index) => (
                <CaseScroll crate={crate} delay={index * 150} finalItem={drop} key={drop.id} />
              ))}
            </div>
          )}
        </div>

        {item && showResult && (
          <div className="opening-result-reveal">
            {result.items?.length > 1 ? (
              <>
                <div className="multi-drop-grid">
                  {result.items.map((drop) => (
                    <div
                      className={drop.sold ? "multi-drop-item sold" : "multi-drop-item"}
                      key={drop.id}
                      style={{ "--rarity": rarityMeta[drop.rarity].color }}
                    >
                      <WeaponMark item={drop} compact />
                      <span>{drop.name}</span>
                      <b>{drop.price} cr</b>
                    </div>
                  ))}
                </div>
                <p className="multi-drop-total">
                  Разом: <b>{result.items.reduce((sum, entry) => sum + entry.price, 0)} cr</b>
                </p>
                <div className="drop-actions">
                  <button className="primary-action" disabled={result.soldAll} onClick={onKeep} type="button">
                    <ShoppingBag size={17} />
                    {result.soldAll ? "Продано" : "Залишити все"}
                  </button>
                  <button className="result-sell" disabled={result.soldAll} onClick={() => onSellAll(result.items)} type="button">
                    <CircleDollarSign size={17} />
                    Продати все
                    <b>{result.items.reduce((sum, entry) => sum + entry.price, 0)} cr</b>
                  </button>
                  <button className="ghost-action" onClick={onAgain} type="button">
                    <RefreshCw size={17} />
                    Ще раз
                  </button>
                </div>
              </>
            ) : (
              <>
                <ItemShowcase item={item} large />
                <div className="drop-actions">
                  <button className="primary-action" disabled={item?.sold} onClick={onKeep} type="button">
                    <ShoppingBag size={17} />
                    {item?.sold ? "Продано" : "Залишити"}
                  </button>
                  <button className="result-sell" disabled={item?.sold} onClick={() => onSell(item)} type="button">
                    <CircleDollarSign size={17} />
                    Продати
                    <b>{item?.price || 0} cr</b>
                  </button>
                  <button className="ghost-action" onClick={onAgain} type="button">
                    <RefreshCw size={17} />
                    Ще раз
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

const SCROLL_CARD_WIDTH = 110;
const SCROLL_CARD_GAP = 12;
const SCROLL_LEAD_ITEMS = 34;
const SCROLL_TRAIL_ITEMS = 6;
const SCROLL_DURATION_MS = 3000;

function CaseScroll({ crate, delay = 0, finalItem }) {
  const { rollItems, landingX } = useMemo(() => {
    const pool = crate.drops.length ? crate.drops : ["P2000 | Granite Marbleized"];
    const lead = Array.from({ length: SCROLL_LEAD_ITEMS }, () =>
      previewItemFromName(pool[Math.floor(Math.random() * pool.length)])
    );
    const trail = Array.from({ length: SCROLL_TRAIL_ITEMS }, () =>
      previewItemFromName(pool[Math.floor(Math.random() * pool.length)])
    );
    const items = [...lead, finalItem, ...trail];
    const finalIndex = lead.length;
    const cardCenter = finalIndex * (SCROLL_CARD_WIDTH + SCROLL_CARD_GAP) + SCROLL_CARD_WIDTH / 2;
    const jitter = (Math.random() * 2 - 1) * (SCROLL_CARD_WIDTH / 2 - 16);

    return { rollItems: items, landingX: -(cardCenter + jitter) };
  }, [crate, finalItem]);

  const [offset, setOffset] = useState(-370);

  useEffect(() => {
    const timer = setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setOffset(landingX));
      });
    }, delay);
    return () => clearTimeout(timer);
  }, [landingX, delay]);

  return (
    <div className="case-scroll">
      <div className="scroll-marker" />
      <div
        className="scroll-track"
        style={{
          transform: `translateX(${offset}px)`,
          transition: `transform ${SCROLL_DURATION_MS}ms cubic-bezier(.12, .78, .12, 1)`,
        }}
      >
        {rollItems.map((rollItem, index) => (
          <div className="scroll-card" key={`${rollItem.name}-${index}`}>
            <WeaponMark item={rollItem} compact />
            <span>{rollItem.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CrateArt({ accent, variant, className = "" }) {
  return (
    <div className={`crate-art crate-${variant} ${className}`} style={{ "--crate-accent": accent }}>
      <span className="crate-shadow" />
      <span className="crate-handle" />
      <span className="crate-lid" />
      <span className="crate-core" />
      <span className="crate-faceplate">CS CASE</span>
      <span className="crate-lock" />
      <span className="crate-bolt top-left" />
      <span className="crate-bolt top-right" />
      <span className="crate-bolt bottom-left" />
      <span className="crate-bolt bottom-right" />
      <span className="crate-line one" />
      <span className="crate-line two" />
      <span className="crate-glow" />
    </div>
  );
}

function VaultView({ balance, dropsCount, lastDrop, onOpen, selectedCase }) {
  return (
    <section className="screen vault-screen">
      <div className="vault-layout">
        <div className="vault-main">
          <span className="eyebrow">Vault terminal</span>
          <h2>Останній дроп</h2>
          {lastDrop ? (
            <ItemShowcase item={lastDrop} large />
          ) : (
            <EmptyState
              icon={PackageOpen}
              title="Ще нічого не випало"
              text="Відкрий кейс — тут з'явиться твій перший дроп."
            />
          )}
          <button className="primary-action wide" onClick={onOpen} type="button">
            <RefreshCw size={16} />
            Відкрити {selectedCase.name}
          </button>
        </div>
        <div className="summary-grid">
          <MetricCard icon={Vault} label="Balance" value={`${balance} cr`} />
          <MetricCard icon={PackageOpen} label="Case now" value={selectedCase.name} />
          <MetricCard icon={Sparkles} label="Last rarity" value={lastDrop ? rarityMeta[lastDrop.rarity].label : "—"} />
          <MetricCard icon={History} label="Session" value={`${dropsCount} drops`} />
        </div>
      </div>
    </section>
  );
}

function UpgradeWheel({ chance, roll }) {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    if (!roll) return;
    setAngle((prev) => {
      const current = ((prev % 360) + 360) % 360;
      const target = (((360 - roll.roll * 3.6) % 360) + 360) % 360;
      const delta = (((target - current) % 360) + 360) % 360;
      return prev + 360 * 4 + delta;
    });
  }, [roll]);

  return (
    <div className="upgrade-wheel">
      <span className="wheel-pointer" />
      <div
        className="wheel-disc"
        style={{ "--chance": `${chance}%`, transform: `rotate(${angle}deg)` }}
      >
        <span className="wheel-ticks" />
      </div>
      <div className="wheel-hub">
        <b>{chance}%</b>
        <small>шанс</small>
      </div>
    </div>
  );
}

function SkinPickRow({ active, entry, onSelect }) {
  return (
    <button className={active ? "pick-row active" : "pick-row"} onClick={() => onSelect(entry)} type="button">
      <WeaponMark item={entry} compact />
      <span className="pick-row-name">{entry.name}</span>
      <b>{entry.price} cr</b>
    </button>
  );
}

function UpgradeView({ chance, isUpgrading, item, inventory, multiplier, onSelectItem, onSelectMultiplier, onSelectTarget, onUpgrade, result, roll, selectedTarget, targetOptions }) {
  const multipliers = [2, 5, 10];

  return (
    <section className="screen">
      <div className="section-head">
        <div>
          <span className="eyebrow">Sector 03</span>
          <h2>Synthesis Lab</h2>
          <p className="subcopy">Обери предмет з інвентаря, множник і ціль — колесо вирішить результат.</p>
        </div>
      </div>
      <div className="upgrade-grid">
        <div className="tool-panel">
          <PanelTitle icon={FlaskConical} title="Input material" />
          {item ? (
            <>
              <ItemShowcase item={item} />
              <div className="pick-list">
                {inventory.slice(0, 6).map((entry) => (
                  <SkinPickRow active={entry.id === item.id} entry={entry} key={entry.id} onSelect={onSelectItem} />
                ))}
              </div>
            </>
          ) : (
            <EmptyState icon={ShoppingBag} title="Інвентар порожній" text="Відкрий кейс або виграй апгрейд, щоб мати матеріал для синтезу." />
          )}
        </div>
        <div className="tool-panel center-panel">
          <PanelTitle icon={Target} title="Probability wheel" />
          <div className="multiplier-tabs">
            {multipliers.map((value) => (
              <button
                className={multiplier === value ? "multiplier-tab active" : "multiplier-tab"}
                key={value}
                onClick={() => onSelectMultiplier(value)}
                type="button"
              >
                x{value}
              </button>
            ))}
          </div>
          <UpgradeWheel chance={chance} roll={roll} />
          <p className="muted">
            {item ? `${item.price} cr → ${selectedTarget.price} cr` : "Потрібен предмет для апгрейду"}
          </p>
          <button className="primary-action wide" disabled={!item || isUpgrading} onClick={onUpgrade} type="button">
            <WandSparkles size={16} />
            {isUpgrading ? "Крутиться..." : "Start upgrade"}
          </button>
          {result && (
            <div className={result.won ? "upgrade-result won" : "upgrade-result lost"}>
              <b>
                {result.won ? <Trophy size={16} /> : <AlertTriangle size={16} />}
                {result.won ? "Вітаємо! Апгрейд успішний" : "Упс! Не пощастило"}
              </b>
              <span>
                {result.won
                  ? `${result.target.name} додано в інвентар`
                  : `${result.input.name} витрачено — спробуй ще раз!`}
              </span>
              <small>Шанс був {result.chance}% · roll {result.roll}</small>
            </div>
          )}
        </div>
        <div className="tool-panel">
          <PanelTitle icon={Trophy} title="Target asset" />
          <ItemShowcase
            item={{
              id: "target-preview",
              name: selectedTarget.name,
              weapon: getWeaponName(selectedTarget.name),
              rarity: selectedTarget.rarity,
              price: selectedTarget.price,
              wear: "Target item",
            }}
          />
          <div className="pick-list target-list">
            {targetOptions.map((target) => (
              <SkinPickRow
                active={selectedTarget.name === target.name}
                entry={target}
                key={target.name}
                onSelect={onSelectTarget}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function InventoryView({ inventory, onSell, onSellAll }) {
  const total = inventory.reduce((sum, item) => sum + item.price, 0);
  return (
    <section className="screen">
      <div className="section-head">
        <div>
          <span className="eyebrow">Sector 04</span>
          <h2>The Armory</h2>
        </div>
        <div className="inventory-total">
          <span>{inventory.length} items</span>
          <b>{total} cr</b>
        </div>
      </div>
      {inventory.length > 0 ? (
        <>
          <div className="inventory-toolbar">
            <span>Вартість інвентаря: {total} cr</span>
            <button className="danger-action" onClick={onSellAll} type="button">
              <CircleDollarSign size={15} />
              Продати все
            </button>
          </div>
          <div className="inventory-grid">
            {inventory.map((item) => (
              <article className="skin-card" key={item.id}>
                <div className="skin-preview">
                  <WeaponMark item={item} />
                </div>
                <div className="skin-info">
                  <span>{rarityMeta[item.rarity].label}</span>
                  <h3>{item.name}</h3>
                  <p>{item.wear}</p>
                </div>
                <button className="sell-button" onClick={() => onSell(item)} type="button">
                  <CircleDollarSign size={14} />
                  Quick sell · {item.price} cr
                </button>
              </article>
            ))}
          </div>
        </>
      ) : (
        <EmptyState icon={ShoppingBag} title="Інвентар порожній" text="Відкрий кейс, щоб отримати перший предмет." />
      )}
    </section>
  );
}

function ProfileView({ balance, inventory, onSteamLogin, onSteamLogout, steamProfile, onDeposit }) {
  const value = inventory.reduce((sum, item) => sum + item.price, 0);
  const history = inventory.slice(0, 5);
  const nickname = steamProfile?.nickname || "Guest";
  const steamId = steamProfile?.steamId || "Steam не підключено";

  return (
    <section className="screen profile-screen">
      <div className="profile-card">
        {steamProfile ? (
          <img alt={`${nickname} Steam avatar`} className="steam-avatar" src={steamProfile.avatar} />
        ) : (
          <div className="avatar-tile">?</div>
        )}
        <div>
          <span className="eyebrow">Steam profile</span>
          <h2>{nickname}</h2>
          <p>{steamId}</p>
          {steamProfile && (
            <div className="steam-meta">
              <span>{steamProfile.personaState}</span>
              <span>Connected {steamProfile.connectedAt}</span>
            </div>
          )}
        </div>
        <div className="profile-actions">
          <b>{balance} cr</b>
          <button className="ghost-action" onClick={onDeposit} type="button">
            <CircleDollarSign size={14} />
            Deposit
          </button>
          {steamProfile ? (
            <button className="ghost-action" onClick={onSteamLogout} type="button">Disconnect</button>
          ) : (
            <button className="steam-button compact" onClick={onSteamLogin} type="button">
              <span className="steam-logo" />
              Connect Steam
            </button>
          )}
        </div>
      </div>
      <div className="summary-grid profile-metrics">
        <MetricCard icon={Boxes} label="Items" value={inventory.length} />
        <MetricCard icon={Gem} label="Total value" value={`${value} cr`} />
        <MetricCard icon={Shield} label="SteamID64" value={steamProfile ? steamProfile.steamId : "not linked"} />
        <MetricCard icon={Star} label="Cases opened" value="4" />
      </div>
      <div className="history-panel">
        <PanelTitle icon={History} title="Drop History" />
        {history.map((item) => (
          <div className="history-row" key={item.id}>
            <RarityDot rarity={item.rarity} />
            <div>
              <b>{item.name}</b>
              <span>{item.weapon} · {item.wear}</span>
            </div>
            <strong>{item.price} cr</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function AdminView({ isAdmin, onLogin, onLogout, users, onUpdateBalance, onUpdateCasePrice, onAddSkin, onRemoveSkin, cases, searchQuery, setSearchQuery, sortBy, setSortBy, adminView, setAdminView, editingCase, setEditingCase, adminLogin, setAdminLogin, adminPassword, setAdminPassword }) {
  if (!isAdmin) {
    return (
      <section className="screen admin-screen">
        <div className="auth-card">
          <div className="auth-icon">
            <Lock size={22} />
          </div>
          <h2>Admin Login</h2>
          <p>Enter admin credentials to access the panel</p>
          <form onSubmit={(e) => {
            e.preventDefault();
            onLogin(adminLogin, adminPassword);
          }}>
            <label>
              Username
              <input type="text" placeholder="admin" value={adminLogin} onChange={(e) => setAdminLogin(e.target.value)} />
            </label>
            <label>
              Password
              <input type="password" placeholder="admin" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} />
            </label>
            <button className="primary-action wide" type="submit">
              <Shield size={16} />
              Login to Admin Panel
            </button>
          </form>
        </div>
      </section>
    );
  }

  const filteredSkins = Object.keys(skinCatalog)
    .filter((skin) => skin.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") return a.localeCompare(b);
      if (sortBy === "price") return skinCatalog[a].price - skinCatalog[b].price;
      return 0;
    });

  return (
    <section className="screen admin-screen">
      <div className="section-head">
        <div>
          <span className="eyebrow">Administration</span>
          <h2>Admin Panel</h2>
        </div>
        <button className="ghost-action" onClick={onLogout} type="button">
          <LogIn size={14} />
          Logout
        </button>
      </div>

      <div className="admin-tabs">
        <button className={adminView === "users" ? "active" : ""} onClick={() => setAdminView("users")} type="button">
          <User size={16} />
          Users
        </button>
        <button className={adminView === "cases" ? "active" : ""} onClick={() => setAdminView("cases")} type="button">
          <PackageOpen size={16} />
          Cases
        </button>
      </div>

      {adminView === "users" && (
        <div className="admin-content">
          <div className="admin-section">
            <h3>Registered Users</h3>
            <div className="admin-table">
              <div className="admin-table-header">
                <span>Steam ID</span>
                <span>Nickname</span>
                <span>Balance</span>
                <span>Connected</span>
                <span>Actions</span>
              </div>
              {users.map((user) => (
                <div className="admin-table-row" key={user.id}>
                  <span>{user.steamId}</span>
                  <span>{user.nickname}</span>
                  <span>{user.balance} cr</span>
                  <span>{new Date(user.connectedAt).toLocaleDateString()}</span>
                  <div className="admin-actions">
                    <button className="ghost-action compact" onClick={() => {
                      const newBalance = prompt("Enter new balance:", user.balance);
                      if (newBalance !== null) {
                        onUpdateBalance(user.id, parseInt(newBalance));
                      }
                    }} type="button">
                      <Edit size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {adminView === "cases" && (
        <div className="admin-content">
          <div className="admin-section">
            <h3>Case Management</h3>
            <div className="admin-cases-grid">
              {cases.map((crate) => (
                <div className="admin-case-card" key={crate.id}>
                  <div className="admin-case-header">
                    <h4>{crate.name}</h4>
                    <span className="case-price">{crate.price} cr</span>
                  </div>
                  <div className="admin-case-actions">
                    <button className="ghost-action compact" onClick={() => {
                      const newPrice = prompt("Enter new price:", crate.price);
                      if (newPrice !== null) {
                        onUpdateCasePrice(crate.id, parseInt(newPrice));
                      }
                    }} type="button">
                      <Edit size={14} />
                      Edit Price
                    </button>
                    <button className="ghost-action compact" onClick={() => setEditingCase(crate)} type="button">
                      <Settings size={14} />
                      Edit Drops
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {editingCase && (
            <div className="admin-modal">
              <div className="admin-modal-content">
                <div className="admin-modal-header">
                  <h3>Edit {editingCase.name} Drops</h3>
                  <button className="ghost-action compact" onClick={() => setEditingCase(null)} type="button">
                    <X size={16} />
                  </button>
                </div>

                <div className="admin-search">
                  <Search size={16} />
                  <input
                    placeholder="Search skins..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="name">Sort by Name</option>
                    <option value="price">Sort by Price</option>
                  </select>
                </div>

                <div className="admin-skins-grid">
                  {filteredSkins.map((skinName) => {
                    const skin = skinCatalog[skinName];
                    const isInCase = editingCase.drops.includes(skinName);
                    return (
                      <div
                        className={`admin-skin-card ${isInCase ? "included" : ""}`}
                        key={skinName}
                        onClick={() => {
                          if (isInCase) {
                            onRemoveSkin(editingCase.id, skinName);
                          } else {
                            onAddSkin(editingCase.id, skinName);
                          }
                        }}
                      >
                        <div className="admin-skin-info">
                          <h5>{skinName}</h5>
                          <span className="skin-price">{skin.price} cr</span>
                          <span className={`rarity-badge ${skin.rarity}`}>{rarityMeta[skin.rarity].label}</span>
                        </div>
                        {isInCase && <Check size={16} className="check-icon" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function AuthView({ mode, onSteamLogin, onSteamLogout, setMode, steamProfile }) {
  const content = {
    login: {
      icon: LogIn,
      title: "Welcome back",
      subtitle: "Log into your account",
      button: "Log in",
      footer: "Create account",
      next: "register",
    },
    register: {
      icon: UserPlus,
      title: "Create your account",
      subtitle: "Sign up to get started",
      button: "Create account",
      footer: "Log in",
      next: "login",
    },
    reset: {
      icon: Mail,
      title: "Reset password",
      subtitle: "We'll send you a link to reset it",
      button: "Send reset link",
      footer: "Back to login",
      next: "login",
    },
    invalid: {
      icon: Lock,
      title: "Invalid reset link",
      subtitle: "This password reset link is missing or invalid",
      button: "Request a new link",
      footer: "Back to login",
      next: "login",
    },
  }[mode];
  const Icon = content.icon;

  return (
    <section className="auth-screen">
      <div className="auth-switcher">
        {["login", "register", "reset", "invalid"].map((entry) => (
          <button className={mode === entry ? "active" : ""} key={entry} onClick={() => setMode(entry)} type="button">
            {entry}
          </button>
        ))}
      </div>
      <div className="auth-card">
        <div className="auth-icon">
          <Icon size={22} />
        </div>
        <h2>{content.title}</h2>
        <p>{content.subtitle}</p>
        {steamProfile ? (
          <div className="steam-connected-card">
            <img alt={`${steamProfile.nickname} Steam avatar`} className="steam-avatar small" src={steamProfile.avatar} />
            <div>
              <span>Signed in with Steam</span>
              <b>{steamProfile.nickname}</b>
              <small>{steamProfile.steamId}</small>
            </div>
            <button className="ghost-action" onClick={onSteamLogout} type="button">Disconnect</button>
          </div>
        ) : mode !== "invalid" ? (
          <form>
            {mode !== "reset" && (
              <button className="steam-button" onClick={onSteamLogin} type="button">
                <span className="steam-logo" />
                Continue with Steam
              </button>
            )}
            {mode !== "reset" && <div className="divider">or</div>}
            <label>
              Email
              <input placeholder="you@example.com" type="email" />
            </label>
            {mode !== "reset" && (
              <label>
                Password
                <input placeholder="••••••••" type="password" />
              </label>
            )}
            {mode === "register" && (
              <label>
                Confirm Password
                <input placeholder="••••••••" type="password" />
              </label>
            )}
            {mode === "login" && (
              <button className="text-link inline" onClick={() => setMode("reset")} type="button">
                Forgot password?
              </button>
            )}
            <button className="primary-action wide" type="button">{content.button}</button>
          </form>
        ) : (
          <div className="alert-box">This link appears to be incomplete. Please request a new password reset email.</div>
        )}
        <button className="text-link" onClick={() => setMode(content.next)} type="button">
          {content.footer}
        </button>
      </div>
    </section>
  );
}

function DepositView({ balance, onDeposit }) {
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [formData, setFormData] = useState({});
  const [showDemoMessage, setShowDemoMessage] = useState(false);

  const paymentMethods = [
    { id: "card", label: "Credit Card", icon: CreditCard, color: "#3b82f6" },
    { id: "crypto", label: "Crypto", icon: Bitcoin, color: "#f59e0b" },
    { id: "paypal", label: "PayPal", icon: Wallet, color: "#003087" },
    { id: "bank", label: "Bank Transfer", icon: Sparkles, color: "#10b981" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(formData).length > 0) {
      setShowDemoMessage(true);
      setTimeout(() => {
        setShowDemoMessage(false);
        onDeposit(100);
        setFormData({});
      }, 3000);
    }
  };

  const isFormValid = () => {
    if (selectedMethod === "card") {
      return formData.cardNumber && formData.expiry && formData.cvv && formData.name;
    }
    if (selectedMethod === "crypto") {
      return formData.wallet && formData.amount;
    }
    if (selectedMethod === "paypal") {
      return formData.email && formData.amount;
    }
    if (selectedMethod === "bank") {
      return formData.account && formData.amount && formData.bank;
    }
    return false;
  };

  return (
    <section className="screen deposit-screen">
      <div className="section-head">
        <div>
          <span className="eyebrow">Finance</span>
          <h2>Deposit Funds</h2>
        </div>
        <div className="balance-display">
          <small>Current balance</small>
          <b>{balance} cr</b>
        </div>
      </div>

      <div className="deposit-methods">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          return (
            <button
              className={selectedMethod === method.id ? "method-card active" : "method-card"}
              key={method.id}
              onClick={() => {
                setSelectedMethod(method.id);
                setFormData({});
                setShowDemoMessage(false);
              }}
              style={{ borderColor: selectedMethod === method.id ? method.color : "" }}
              type="button"
            >
              <div className="method-icon" style={{ backgroundColor: method.color }}>
                <Icon size={20} />
              </div>
              <span>{method.label}</span>
            </button>
          );
        })}
      </div>

      <div className="deposit-form-container">
        {showDemoMessage && (
          <div className="demo-alert">
            <AlertTriangle size={16} />
            <div>
              <b>Demo Version</b>
              <p>This is a demo version - no real payment will be processed. Balance will be updated for testing purposes.</p>
            </div>
          </div>
        )}

        <form className="deposit-form" onSubmit={handleSubmit}>
          {selectedMethod === "card" && (
            <>
              <label>
                Card Number
                <input
                  placeholder="1234 5678 9012 3456"
                  type="text"
                  value={formData.cardNumber || ""}
                  onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                />
              </label>
              <div className="form-row">
                <label>
                  Expiry Date
                  <input
                    placeholder="MM/YY"
                    type="text"
                    value={formData.expiry || ""}
                    onChange={(e) => handleInputChange("expiry", e.target.value)}
                  />
                </label>
                <label>
                  CVV
                  <input
                    placeholder="123"
                    type="text"
                    value={formData.cvv || ""}
                    onChange={(e) => handleInputChange("cvv", e.target.value)}
                  />
                </label>
              </div>
              <label>
                Cardholder Name
                <input
                  placeholder="John Doe"
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </label>
            </>
          )}

          {selectedMethod === "crypto" && (
            <>
              <label>
                Wallet Address
                <input
                  placeholder="0x1234...5678"
                  type="text"
                  value={formData.wallet || ""}
                  onChange={(e) => handleInputChange("wallet", e.target.value)}
                />
              </label>
              <label>
                Amount (USD)
                <input
                  placeholder="100"
                  type="number"
                  value={formData.amount || ""}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                />
              </label>
            </>
          )}

          {selectedMethod === "paypal" && (
            <>
              <label>
                PayPal Email
                <input
                  placeholder="you@example.com"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </label>
              <label>
                Amount (USD)
                <input
                  placeholder="100"
                  type="number"
                  value={formData.amount || ""}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                />
              </label>
            </>
          )}

          {selectedMethod === "bank" && (
            <>
              <label>
                Bank Name
                <input
                  placeholder="Your Bank"
                  type="text"
                  value={formData.bank || ""}
                  onChange={(e) => handleInputChange("bank", e.target.value)}
                />
              </label>
              <label>
                Account Number
                <input
                  placeholder="1234567890"
                  type="text"
                  value={formData.account || ""}
                  onChange={(e) => handleInputChange("account", e.target.value)}
                />
              </label>
              <label>
                Amount (USD)
                <input
                  placeholder="100"
                  type="number"
                  value={formData.amount || ""}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                />
              </label>
            </>
          )}

          <button className="primary-action wide" disabled={!isFormValid() || showDemoMessage} type="submit">
            <CircleDollarSign size={16} />
            {showDemoMessage ? "Processing demo deposit..." : "Deposit Funds"}
          </button>
        </form>
      </div>
    </section>
  );
}

function BottomNav({ activeView, balance, onChange }) {
  const items = [
    { id: "vault", label: "Vault", icon: Vault },
    { id: "cases", label: "Cases", icon: PackageOpen },
    { id: "upgrade", label: "Upgrade", icon: Swords },
    { id: "inventory", label: "Inventory", icon: ShoppingBag },
    { id: "profile", label: "Profile", icon: User },
    { id: "deposit", label: "Deposit", icon: CircleDollarSign },
    { id: "auth", label: "Auth", icon: KeyRound },
  ];

  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            aria-label={item.label}
            className={activeView === item.id ? "active" : ""}
            key={item.id}
            onClick={() => onChange(item.id)}
            type="button"
          >
            <Icon size={15} />
            <span>{item.label}</span>
          </button>
        );
      })}
      <div className="nav-balance">
        <small>balance</small>
        <b>{balance} cr</b>
      </div>
    </nav>
  );
}

function MetricCard({ icon: Icon, label, value }) {
  return (
    <div className="metric-card">
      <Icon size={16} />
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

function EmptyState({ icon: Icon, title, text }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon size={26} />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function PanelTitle({ icon: Icon, title }) {
  return (
    <div className="panel-title">
      <Icon size={15} />
      <span>{title}</span>
    </div>
  );
}

function ItemShowcase({ item, large = false }) {
  return (
    <div className={large ? "item-showcase large" : "item-showcase"}>
      <WeaponMark item={item} />
      <div>
        <span>{rarityMeta[item.rarity].label}</span>
        <h3>{item.name}</h3>
        <p>{item.wear}</p>
        <b>{item.price} cr</b>
      </div>
    </div>
  );
}

function WeaponMark({ compact = false, item, rarity, weapon }) {
  const safeRarity = item?.rarity || rarity || "milspec";
  const safeWeapon = item?.weapon || weapon || getWeaponName(item?.name || "");
  const image = skinImages[item?.name];

  return (
    <div
      className={image ? "weapon-mark has-image" : "weapon-mark"}
      style={{ "--rarity": rarityMeta[safeRarity].color, "--rarity-glow": rarityMeta[safeRarity].glow }}
    >
      {image ? (
        <img alt={item?.name || safeWeapon} className={compact ? "skin-image compact" : "skin-image"} src={image} />
      ) : (
        <svg className="skin-illustration" viewBox="0 0 180 92" aria-hidden="true">
          <path d="M19 56h73l12-14h35l12 12h15v12h-41l-9 10H80l-8-10H19z" />
          <path d="M91 37h30l6-16h20l-5 16h18v10H98z" />
          <path d="M64 58l-8 24h24l11-24z" />
          <path d="M24 48h38v8H24z" />
        </svg>
      )}
      <span>{safeWeapon.slice(0, 3).toUpperCase()}</span>
      <ChevronRight className="weapon-chevron" size={32} />
    </div>
  );
}

function RarityDot({ rarity }) {
  return <span className="rarity-dot" style={{ "--rarity": rarityMeta[rarity].color }} />;
}

createRoot(document.getElementById("root")).render(<App />);
