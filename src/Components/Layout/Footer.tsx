import { Newsletter } from "@/components/home/Newsletter";
import { siteConfig } from "@/config/site";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Facebook,
  Youtube,
  Instagram,
  Twitter,
  Download,
  Shield,
  Truck,
  RotateCcw,
  Headphones,
} from "lucide-react";

const features = [
  { icon: Shield, title: "Secure Payment", desc: "100% secure payment" },
  { icon: Truck, title: "Fast Delivery", desc: "Free shipping over EGP 200" },
  { icon: RotateCcw, title: "Easy Returns", desc: "30-day return policy" },
  { icon: Headphones, title: "24/7 Support", desc: "Dedicated support team" },
];

const paymentIcons = [
  { name: "Visa", icon: <span className="text-blue-700 font-bold text-xl">Visa</span> },
  { name: "Mastercard", icon: <span className="text-orange-500 font-bold text-xl">Mastercard</span> },
  { name: "PayPal", icon: <span className="text-blue-500 font-bold text-xl">PayPal</span> },
  { name: "Apple Pay", icon: <span className="text-ink font-bold text-xl">Apple Pay</span> },
];

const socialLinks = [
  { href: "https://facebook.com", label: "Facebook", icon: Facebook },
  { href: "https://twitter.com", label: "Twitter", icon: Twitter },
  { href: "https://instagram.com", label: "Instagram", icon: Instagram },
  { href: "https://youtube.com", label: "YouTube", icon: Youtube },
];

export function Footer() {
  return (
    <footer className="bg-surface-2 text-ink" role="contentinfo">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary mb-4">
              <span className="text-3xl">🛒</span>
              <span>FreshCart</span>
            </Link>
            <p className="text-slate-500 mb-6 max-w-sm">
              Fresh groceries delivered to your door. Quality products, great prices, lightning-fast delivery.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <nav aria-label="Company links">
              <ul className="space-y-3">
                {siteConfig.footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-slate-500 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <nav aria-label="Support links">
              <ul className="space-y-3">
                {siteConfig.footerLinks.support.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-slate-500 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <nav aria-label="Legal links">
              <ul className="space-y-3">
                {siteConfig.footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-slate-500 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-semibold text-lg mb-4">Payment Methods</h3>
            <div className="flex flex-wrap gap-4">
              {paymentIcons.map((payment) => (
                <span key={payment.name} className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center gap-2 text-sm">
                  {payment.icon}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Why Choose FreshCart?</h3>
            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature.title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{feature.title}</p>
                    <p className="text-xs text-slate-500">{feature.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Newsletter variant="footer" />
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} FreshCart. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              <span>Get the App</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}