'use server'

import { redirect } from 'next/navigation'

const BOT_API_URL = "https://lgpt.eur.tn/api/v1";
const BOT_URL = "https://lgpt.eur.tn";
const WORKSPACE = "germany-write-in-german";
const FLOUCI_BASE = "https://developers.flouci.com/api/v2";

function shortId() {
  // 8 random alphanumeric chars — total username will be "f_xxxxxxxx" = 10 chars
  return Math.random().toString(36).slice(2, 10);
}

// ─── FREE USER (10-message limit) ────────────────────────────────────────────

export async function handleFreeStart() {
  const API_KEY = process.env.BOTAPI;
  const username = `f_${shortId()}`; // e.g. "f_k3m9za1p" = 10 chars

  try {
    const userRes = await fetch(`${BOT_API_URL}/admin/users/new`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password: "TempPassword123!", role: "default" })
    });

    const userData = await userRes.json();
    const userId = userData.user?.id;
    if (!userId) throw new Error(`User creation failed: ${JSON.stringify(userData)}`);

    await fetch(`${BOT_API_URL}/admin/workspaces/${WORKSPACE}/manage-users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userIds: [userId], reset: false })
    });

    const tokenRes = await fetch(`${BOT_API_URL}/users/${userId}/issue-auth-token`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });

    const { token } = await tokenRes.json();
    redirect(`${BOT_URL}/sso/simple?token=${token}&redirectTo=/workspace/${WORKSPACE}`);
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error;
    console.error("Free SSO flow failed:", error);
    redirect(BOT_URL);
  }
}

// ─── PAID USER (Flouci) ───────────────────────────────────────────────────────

export async function handleFlouciStart() {
  const shopUrl = process.env.NEXT_PUBLIC_BASE_URL!;

  try {
    const res = await fetch(`${FLOUCI_BASE}/generate_payment`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FLOUCI_PUBLIC_KEY}:${process.env.FLOUCI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Flouci amounts are in millimes (1 TND = 1000 millimes)
        // Adjust this value to your actual price in millimes
        amount: "20000",                        // e.g. 20 TND = 20000 millimes
        accept_card: true,
        success_link: `${shopUrl}/api/flouci/verify`,
        fail_link: `${shopUrl}/?flouci=cancelled`,
        developer_tracking_id: `order_${shortId()}`,
        // Optional: shown on the Flouci payment page
        // client_id: "Euro Legal GPT",
      }),
      cache: "no-store",
    });

    const data = await res.json();

    if (!data.result?.success || !data.result?.link) {
      throw new Error(`Flouci generate_payment failed: ${JSON.stringify(data)}`);
    }

    redirect(data.result.link);
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error;
    console.error("Flouci redirect failed:", error);
    redirect(BOT_URL);
  }
}
