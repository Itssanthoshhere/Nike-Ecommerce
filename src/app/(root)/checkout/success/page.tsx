import { stripe } from "@/lib/stripe/client";
import { getOrder } from "@/lib/actions/orders";

type Params = { searchParams: Promise<{ session_id?: string }> };

export default async function SuccessPage({ searchParams }: Params) {
  const { session_id } = await searchParams;
  if (!session_id) {
    return <main className="mx-auto max-w-3xl p-8">Missing session.</main>;
  }
  const session = await stripe.checkout.sessions.retrieve(session_id);
  // In a real app, you'd look up the order by transactionId; demo keeps it simple
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-semibold">Thank you!</h1>
      <p className="mt-2">Your payment was successful.</p>
      <p className="mt-2 text-sm text-dark-700">Stripe Session: {session.id}</p>
    </main>
  );
}


