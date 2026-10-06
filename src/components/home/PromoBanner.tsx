import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface PromoCardProps {
  title: string;
  description: string;
  gradient: string;
  ctaText: string;
  ctaHref: string;
  icon?: React.ReactNode;
}

function PromoCard({ title, description, gradient, ctaText, ctaHref, icon }: PromoCardProps) {
  return (
    <Link to={ctaHref}>
      <Card
        className="relative overflow-hidden h-full min-h-[200px] text-white"
        style={{ background: gradient }}
      >
        <CardContent className="relative z-10 p-8 flex flex-col justify-between h-full">
          <div>
            {icon && <div className="mb-4 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">{icon}</div>}
            <h3 className="text-2xl font-bold mb-2">{title}</h3>
            <p className="text-white/90">{description}</p>
          </div>
          <Button
            variant="outline"
            className="w-fit border-white text-white hover:bg-white/10"
            render={<a href={ctaHref} className="flex items-center gap-2" />}
          >
            {ctaText}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}

export function PromoBanner() {
  const promos = [
    {
      title: "Fresh Deals Daily",
      description: "Up to 50% off on fresh groceries every week. Quality guaranteed.",
      gradient: "linear-gradient(170deg, #00BC7D 0%, #007A55 100%)",
      ctaText: "Shop Deals",
      ctaHref: "/products",
    },
    {
      title: "Lightning Fast Delivery",
      description: "Same-day delivery on all orders over EGP 200. Track your order in real-time.",
      gradient: "linear-gradient(170deg, #FF8904 0%, #FF2056 100%)",
      ctaText: "Learn More",
      ctaHref: "/category",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-6 md:py-10">
      <div className="grid gap-6 md:grid-cols-2">
        {promos.map((promo, index) => (
          <PromoCard key={index} {...promo} />
        ))}
      </div>
    </section>
  );
}