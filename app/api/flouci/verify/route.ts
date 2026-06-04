import { NextRequest, NextResponse } from "next/server";

const FLOUCI_BASE = "https://developers.flouci.com/api/v2";
const BOT_API_URL = "https://lgpt.eur.tn/api/v1";
const BOT_URL = "https://lgpt.eur.tn";
const WORKSPACE = "germany-write-in-german";
const SHOP_URL = process.env.NEXT_PUBLIC_BASE_URL!;

/**
 * GET /api/flouci/verify?payment_id=xxx
 *
 * Flouci appends ?payment_id=<ID> to BOTH success_link and fail_link.
 * We ALWAYS verify the real status via the API — never trust the redirect path.
 *
 * Flouci verify_payment response shape (from docs):
 * {
 *   "success": true,          ← top-level boolean
 *   "result": {
 *     "type": "wallet",
 *     "amount": 1250,
 *     "status": "SUCCESS",    ← "SUCCESS" | "PENDING" | "EXPIRED" | "FAILURE"
 *     "details": { ... },
 *     "developer_tracking_id": "..."
 *   },
 *   "status_code": 200,
 *   "name": "developers",
 *   "code": 0,
 *   "version": "2.0.0"
 * }
 *
 * A payment is confirmed only when BOTH:
 *   verifyData.success === true  AND  verifyData.result.status === "SUCCESS"
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const paymentId = searchParams.get("payment_id");

  if (!paymentId) {
    console.error("Flouci verify: no payment_id in query string");
    return NextResponse.redirect(`${SHOP_URL}/?flouci=error`);
  }

  try {
    // 1. Verify real payment status from Flouci
    const verifyRes = await fetch(
      `${FLOUCI_BASE}/verify_payment/${paymentId}`,
      {
        method: "GET",
        headers: {
          // Docs: Bearer <APP_PUBLIC>:<APP_SECRET>
          Authorization: `Bearer ${process.env.FLOUCI_PUBLIC_KEY}:${process.env.FLOUCI_SECRET_KEY}`,
        },
        cache: "no-store",
      }
    );

    const verifyData = await verifyRes.json();
    console.log(`Flouci verify [${paymentId}]:`, JSON.stringify(verifyData));

    // Docs: check top-level "success" FIRST, then "result.status"
    if (verifyData.success !== true) {
      console.warn("Flouci verify: success=false", verifyData);
      return NextResponse.redirect(`${SHOP_URL}/?flouci=failed`);
    }

    const status = verifyData.result?.status;

    if (status !== "SUCCESS") {
      console.warn(`Flouci verify: status=${status}`);
      // PENDING / EXPIRED → treat as cancelled (user backed out or timed out)
      // FAILURE → hard payment failure
      if (status === "FAILURE") {
        return NextResponse.redirect(`${SHOP_URL}/?flouci=failed`);
      }
      return NextResponse.redirect(`${SHOP_URL}/?flouci=cancelled`);
    }

    // 2. Payment confirmed — provision bot user
    const rand = Math.random().toString(36).slice(2, 10);
    const username = `p${rand}`; // 9 chars, well under 15 char limit
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
      console.error("Bot user creation failed:", userData);
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
    console.error("Flouci verify route error:", err);
    return NextResponse.redirect(`${SHOP_URL}/?flouci=error`);
  }
}
