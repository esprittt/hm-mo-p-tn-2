import { NextRequest, NextResponse } from "next/server";

const FLOUCI_BASE = "https://developers.flouci.com/api/v2";
const BOT_API_URL = "https://lgpt.eur.tn/api/v1";
const BOT_URL = "https://lgpt.eur.tn";
const WORKSPACE = "germany-write-in-german";
const SHOP_URL = process.env.NEXT_PUBLIC_BASE_URL!;

/**
 * GET /api/flouci/verify?payment_id=xxx
 *
 * Flouci redirects to:
 *   success_link?payment_id=<PAYMENT_ID>   on success
 *   fail_link?payment_id=<PAYMENT_ID>      on failure
 *
 * We verify the payment with Flouci, then provision the bot user exactly
 * like the old PayPal capture route did.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const paymentId = searchParams.get("payment_id");

  if (!paymentId) {
    return NextResponse.redirect(`${SHOP_URL}/?flouci=error`);
  }

  try {
    // 1. Verify payment with Flouci
    const verifyRes = await fetch(
      `${FLOUCI_BASE}/verify_payment/${paymentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.FLOUCI_PUBLIC_KEY}:${process.env.FLOUCI_SECRET_KEY}`,
        },
        cache: "no-store",
      }
    );

    const verifyData = await verifyRes.json();

    // Must have success:true AND status:"SUCCESS"
    if (!verifyData.success || verifyData.result?.status !== "SUCCESS") {
      console.error("Flouci verify failed:", verifyData);
      return NextResponse.redirect(`${SHOP_URL}/?flouci=failed`);
    }

    // 2. Build username — strictly max 15 chars: "p" + 8 random alphanumeric
    const rand = Math.random().toString(36).slice(2, 10); // 8 chars
    const username = `p${rand}`; // 9 chars total, always unique

    const API_KEY = process.env.BOTAPI;

    const userRes = await fetch(`${BOT_API_URL}/admin/users/new`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password: `Pp${Math.random().toString(36).slice(2, 10)}!`,
        role: "default",
      }),
    });

    const userData = await userRes.json();
    const userId = userData.user?.id;

    if (!userId) {
      console.error("User creation failed:", userData);
      return NextResponse.redirect(`${SHOP_URL}/?flouci=usererror`);
    }

    // 3. Add to workspace
    await fetch(
      `${BOT_API_URL}/admin/workspaces/${WORKSPACE}/manage-users`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userIds: [userId], reset: false }),
      }
    );

    // 4. Issue SSO token → redirect to bot
    const tokenRes = await fetch(
      `${BOT_API_URL}/users/${userId}/issue-auth-token`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${API_KEY}` },
      }
    );

    const { token: ssoToken } = await tokenRes.json();

    return NextResponse.redirect(
      `${BOT_URL}/sso/simple?token=${ssoToken}&redirectTo=/workspace/${WORKSPACE}`
    );
  } catch (err) {
    console.error("Flouci verify error:", err);
    return NextResponse.redirect(`${SHOP_URL}/?flouci=error`);
  }
}
