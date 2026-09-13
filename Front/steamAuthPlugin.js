import crypto from "node:crypto";

const SESSION_COOKIE = "carbon_steam_session";
const STEAM_OPENID_URL = "https://steamcommunity.com/openid/login";
const STEAM_IDENTIFIER = "http://specs.openid.net/auth/2.0/identifier_select";
const sessions = new Map();

function parseCookies(cookieHeader = "") {
  return Object.fromEntries(
    cookieHeader
      .split(";")
      .map((part) => part.trim().split("="))
      .filter(([key, value]) => key && value)
      .map(([key, value]) => [key, decodeURIComponent(value)])
  );
}

function getOrigin(req) {
  if (process.env.STEAM_AUTH_ORIGIN) return process.env.STEAM_AUTH_ORIGIN.replace(/\/$/, "");

  const host = req.headers.host || "127.0.0.1:5173";
  const proto = req.headers["x-forwarded-proto"] || "http";

  return `${proto}://${host}`;
}

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function redirect(res, location) {
  res.statusCode = 302;
  res.setHeader("Location", location);
  res.end();
}

function getSession(req) {
  const cookies = parseCookies(req.headers.cookie);
  const sessionId = cookies[SESSION_COOKIE];

  return sessionId ? sessions.get(sessionId) : null;
}

function setSession(res, profile) {
  const sessionId = crypto.randomBytes(24).toString("hex");

  sessions.set(sessionId, {
    ...profile,
    connectedAt: new Date().toISOString(),
  });

  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=${encodeURIComponent(sessionId)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800`
  );
}

function clearSession(req, res) {
  const cookies = parseCookies(req.headers.cookie);

  if (cookies[SESSION_COOKIE]) {
    sessions.delete(cookies[SESSION_COOKIE]);
  }

  res.setHeader("Set-Cookie", `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function extractSteamId(params) {
  const claimedId = params.get("openid.claimed_id") || "";
  const match = claimedId.match(/^https?:\/\/steamcommunity\.com\/openid\/id\/(\d+)$/);

  return match?.[1] || "";
}

async function verifySteamOpenId(callbackUrl) {
  const params = new URL(callbackUrl).searchParams;
  const steamId = extractSteamId(params);
  console.log("[steam-auth] Verifying OpenID, mode:", params.get("openid.mode"), "steamId:", steamId);

  if (!steamId || params.get("openid.mode") !== "id_res") {
    console.log("[steam-auth] Invalid OpenID response");
    return "";
  }

  const verification = new URLSearchParams(params);
  verification.set("openid.mode", "check_authentication");

  console.log("[steam-auth] Sending verification to Steam");
  const response = await fetch(STEAM_OPENID_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: verification.toString(),
  });
  const text = await response.text();
  console.log("[steam-auth] Verification response:", text);

  return text.includes("is_valid:true") ? steamId : "";
}

function pickXmlValue(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, "i"));
  const value = match?.[1]?.trim() || "";
  console.log(`[steam-auth] XML value for ${tag}:`, value);
  return value;
}

async function fetchSteamProfile(steamId) {
  const apiKey = process.env.STEAM_API_KEY;

  if (apiKey) {
    const url = new URL("https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/");
    url.searchParams.set("key", apiKey);
    url.searchParams.set("steamids", steamId);

    const response = await fetch(url);
    const data = await response.json();
    const player = data?.response?.players?.[0];

    if (player) {
      return {
        steamId,
        nickname: player.personaname || `Steam ${steamId}`,
        personaState: player.personastate ? "Online" : "Offline",
        avatar: player.avatarfull || player.avatarmedium || player.avatar,
        profileUrl: player.profileurl || `https://steamcommunity.com/profiles/${steamId}`,
      };
    }
  }

  const response = await fetch(`https://steamcommunity.com/profiles/${steamId}?xml=1`);
  const xml = await response.text();

  return {
    steamId,
    nickname: pickXmlValue(xml, "steamID") || `Steam ${steamId}`,
    personaState: pickXmlValue(xml, "onlineState") || "Unknown",
    avatar: pickXmlValue(xml, "avatarFull") || pickXmlValue(xml, "avatarMedium") || pickXmlValue(xml, "avatarIcon"),
    profileUrl: pickXmlValue(xml, "steamID64")
      ? `https://steamcommunity.com/profiles/${steamId}`
      : `https://steamcommunity.com/profiles/${steamId}`,
  };
}

export function steamAuthPlugin() {
  return {
    name: "carbon-vault-steam-auth",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url || "/", getOrigin(req));

        try {
          if (url.pathname === "/api/auth/me") {
            sendJson(res, 200, { profile: getSession(req) });
            return;
          }

          if (url.pathname === "/api/auth/logout") {
            await readBody(req);
            clearSession(req, res);
            sendJson(res, 200, { ok: true });
            return;
          }

          if (url.pathname === "/api/auth/steam") {
            const origin = getOrigin(req);
            const returnTo = `${origin}/api/auth/steam/callback`;
            console.log("[steam-auth] Origin:", origin);
            console.log("[steam-auth] Return to:", returnTo);
            const params = new URLSearchParams({
              "openid.ns": "http://specs.openid.net/auth/2.0",
              "openid.mode": "checkid_setup",
              "openid.return_to": returnTo,
              "openid.realm": `${origin}/`,
              "openid.identity": STEAM_IDENTIFIER,
              "openid.claimed_id": STEAM_IDENTIFIER,
            });

            const steamUrl = `${STEAM_OPENID_URL}?${params}`;
            console.log("[steam-auth] Redirecting to:", steamUrl);
            redirect(res, steamUrl);
            return;
          }

          if (url.pathname === "/api/auth/steam/callback") {
            console.log("[steam-auth] Callback received:", url.toString());
            const steamId = await verifySteamOpenId(url.toString());
            console.log("[steam-auth] Steam ID extracted:", steamId);

            if (!steamId) {
              console.log("[steam-auth] Steam ID verification failed");
              redirect(res, "/?steam=failed");
              return;
            }

            try {
              const profile = await fetchSteamProfile(steamId);
              console.log("[steam-auth] Profile fetched:", profile);
              setSession(res, profile);
              redirect(res, "/?steam=connected");
            } catch (profileError) {
              console.error("[steam-auth] Profile fetch error:", profileError);
              redirect(res, "/?steam=failed");
            }
            return;
          }
        } catch (error) {
          console.error("[steam-auth]", error);
          sendJson(res, 500, { error: "Steam auth failed" });
          return;
        }

        next();
      });
    },
  };
}
