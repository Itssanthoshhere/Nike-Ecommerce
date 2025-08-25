import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { createOrder } from "@/lib/actions/orders";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const buf = await req.arrayBuffer();
  const rawBody = Buffer.from(buf);

  try {
    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        await createOrder(session.id);
        break;
      }
      case "payment_intent.payment_failed": {
        console.error("Payment failed", event.id);
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(err);
    return new NextResponse("Webhook Error", { status: 400 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};


