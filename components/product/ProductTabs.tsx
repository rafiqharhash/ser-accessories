"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface ProductTabsProps {
  description: string;
  materials?: string[];
}

export function ProductTabs({ description, materials }: ProductTabsProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const sections = [
    {
      id: "description",
      title: "Description",
      content: (
        <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
          <p>{description}</p>
        </div>
      )
    },
    {
      id: "details",
      title: "Materials & Care",
      content: (
        <div className="text-sm text-muted-foreground">
          {materials && materials.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2 mb-6">
              {materials.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
          ) : (
            <p className="mb-6">Made from premium imported fabrics.</p>
          )}
          <h4 className="font-semibold text-foreground mb-2">Care Instructions</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>Dry clean only.</li>
            <li>Do not bleach.</li>
            <li>Iron at low temperature if necessary.</li>
          </ul>
        </div>
      )
    },
    {
      id: "shipping",
      title: "Shipping & Returns",
      content: (
        <div className="text-sm text-muted-foreground space-y-4">
          <div>
            <h4 className="font-semibold text-foreground mb-1">Express Delivery</h4>
            <p>Delivered within 2-3 business days. Complimentary on orders over EGP 2,000.</p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">Standard Delivery</h4>
            <p>Delivered within 4-5 business days.</p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">Returns</h4>
            <p>We accept returns within 14 days of delivery. Items must be unworn, with all tags attached.</p>
          </div>
        </div>
      )
    }
  ];

  if (isDesktop) {
    return (
      <Tabs defaultValue="description" className="w-full mt-16 border-t border-border pt-12">
        <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none h-auto p-0 flex space-x-8">
          {sections.map(section => (
            <TabsTrigger 
              key={section.id} 
              value={section.id}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-4 px-0 text-base font-playfair uppercase tracking-widest bg-transparent"
            >
              {section.title}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="py-8">
          {sections.map(section => (
            <TabsContent key={section.id} value={section.id} className="mt-0 outline-none animate-in fade-in-50 duration-500">
              {section.content}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    );
  }

  // Mobile layout uses Accordion
  return (
    <div className="mt-12 border-t border-border pt-6">
      {/* @ts-expect-error Radix UI types mismatch in shadcn */}
      <Accordion type="single" collapsible className="w-full">
        {sections.map(section => (
          <AccordionItem key={section.id} value={section.id}>
            <AccordionTrigger className="font-playfair text-lg hover:no-underline py-4">
              {section.title}
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              {section.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
