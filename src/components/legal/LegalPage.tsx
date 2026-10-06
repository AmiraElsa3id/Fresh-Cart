/**
 * Stand-in for the legal documents the design footer and the signup terms
 * checkbox link to (24:5290 onward, 24:5172).
 *
 * This is deliberately a summary, not legal copy. Nothing here has been through
 * a lawyer and it must not be presented as binding terms — replace `SECTIONS`
 * with reviewed text before this ships anywhere real.
 */

interface LegalSection {
  heading: string;
  body: string;
}

const SECTIONS: Record<string, { title: string; intro: string; sections: LegalSection[] }> = {
  terms: {
    title: "Terms of Service",
    intro: "A summary of the ground rules for using FreshCart.",
    sections: [
      {
        heading: "Using this site",
        body: "FreshCart is a demonstration storefront built on a public e-commerce API. You can browse the catalogue, create an account and place test orders, but no real goods change hands and no payment is ever taken.",
      },
      {
        heading: "Your account",
        body: "You are responsible for the credentials you choose and for activity under your account. Tell us if you think someone else has access to it.",
      },
      {
        heading: "Orders and pricing",
        body: "Prices, stock levels and product details come from the upstream API and can change without notice. We may cancel an order if an item turns out to be unavailable or a price was published in error.",
      },
      {
        heading: "Liability",
        body: "The service is provided as-is for demonstration. To the extent permitted by law we are not liable for indirect or consequential loss arising from its use.",
      },
    ],
  },
  // Keyed by the route segment, not the document name: `legalRoute("privacy")`
  // passes `doc="privacy"`, and a key of "privacy-policy" made `SECTIONS[doc]`
  // undefined, which threw on `content.title` and took the whole page down.
  privacy: {
    title: "Privacy Policy",
    intro: "What this demo stores about you, and for how long.",
    sections: [
      {
        heading: "What is collected",
        body: "An email address and password when you register, your name and phone number if you fill them in, and the contents of your cart, wishlist and order history.",
      },
      {
        heading: "Where it lives",
        body: "Your account and orders are held by the upstream e-commerce API. Your bearer token is kept in this browser's local storage so you stay signed in, and a pending password-reset email address is kept in session storage until the reset finishes.",
      },
      {
        heading: "Cookies and analytics",
        body: "This site sets no cookies and runs no analytics or third-party tracking scripts.",
      },
      {
        heading: "Your choices",
        body: "You can clear your local data at any time from your browser settings, which signs you out and discards the token held on this device.",
      },
    ],
  },
  cookies: {
    title: "Cookie Policy",
    intro: "What this site stores in your browser.",
    sections: [
      {
        heading: "No cookies",
        body: "This site sets no cookies of its own. Nothing here is used to track you between visits.",
      },
      {
        heading: "Browser storage",
        body: "Two things are kept locally so the app can work: your session token in local storage, which keeps you signed in across visits, and a pending password-reset email address in session storage, which is cleared the moment the reset finishes or the tab closes.",
      },
      {
        heading: "Third parties",
        body: "Product, category and brand data is fetched from the upstream e-commerce API, which will set its own connection state. Fonts are served by Google Fonts, which sees the request. Neither is used to build a profile of you.",
      },
    ],
  },
};

export function LegalPage({ doc }: { doc: keyof typeof SECTIONS }) {
  const content = SECTIONS[doc];

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-ink">{content.title}</h1>
      <p className="mt-2 text-lg text-[#4A5565]">{content.intro}</p>

      <div className="mt-8 space-y-6 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/5">
        {content.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-semibold text-ink">{section.heading}</h2>
            <p className="mt-1.5 leading-relaxed text-[#4A5565]">{section.body}</p>
          </section>
        ))}
      </div>

      <p className="mt-6 text-sm text-slate-500">
        This is placeholder content for a portfolio project, not reviewed legal text.
      </p>
    </div>
  );
}
