import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function StripeTest() {
  const [name, setName] = useState("Dummy Product");
  const [amount, setAmount] = useState(1999); // cents
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("status");
    setStatus(s);
    document.title = "Stripe Test";
  }, []);

  return (
    <div className="min-h-screen bg-darkgray text-white">
      <Header />
      <main className="pt-28 md:pt-32 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold mb-4">Stripe Test Checkout</h1>
        {status === "success" && (
          <div className="mb-4 text-green-400">Payment completed successfully.</div>
        )}
        {status === "cancel" && (
          <div className="mb-4 text-red-400">Payment canceled.</div>
        )}
        {error && (
          <div className="mb-4 text-red-400">{error}</div>
        )}

        <Card className="bg-midgray border-dark">
          <CardContent className="p-4 space-y-4">
            <div>
              <label className="text-sm block mb-1">Product name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm block mb-1">Amount (USD cents)</label>
              <Input type="number" value={amount} onChange={(e) => setAmount(parseInt(e.target.value || "0", 10))} />
            </div>
            <Button
              className="bg-gold text-dark hover:bg-gold/90"
              onClick={async () => {
                try {
                  setError(null);
                  const res = await fetch('/api/payments/checkout-test', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ name, amountCents: amount }),
                  });
                  const data = await res.json().catch(() => ({}));
                  if (!res.ok) {
                    setError(String((data && (data.message || data.error)) || 'Failed to start Stripe Checkout'));
                    return;
                  }
                  if (data?.url) {
                    window.location.href = String(data.url);
                  } else {
                    setError('Stripe did not return a checkout URL');
                  }
                } catch (e: any) {
                  setError(String(e?.message || 'Unexpected error'));
                }
              }}
            >
              Checkout Test
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
