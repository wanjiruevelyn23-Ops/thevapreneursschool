import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, ShieldCheck } from "lucide-react";
import { Eyebrow } from "@/components/brand/Section";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [{ title: "Secure Checkout | The VApreneurs School" }],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  return (
    <>
      <header className="bg-gradient-navy text-primary-foreground">
        <div className="mx-auto max-w-6xl px-5 py-12 text-center">
          <Eyebrow className="text-accent">Secure Gateway</Eyebrow>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold">Complete Your Enrollment</h1>
          <p className="mt-2 text-sm text-primary-foreground/75 flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-accent" /> Powered by Pesapal (M-Pesa Natively Supported)
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-5 py-12">
        <div className="surface-card p-2 sm:p-6 border border-gray-100 shadow-xl rounded-2xl bg-white overflow-hidden">
          {/* 🇰🇪 EMBEDDED NATIVE PESAPAL IFRAME CONTAINER */}
          <iframe 
            src="https://pesapal.com" 
            className="w-full h-[650px] border-0 rounded-xl"
            title="M-Pesa Secure Checkout Portal"
            scrolling="no"
          />
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
          <CreditCard className="h-3.5 w-3.5" /> Secure 256-bit SSL encrypted mobile checkout stream.
        </div>
      </section>
    </>
  );
}
