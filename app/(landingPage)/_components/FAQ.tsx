"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is it free to use?",
    answer:
      "Yes! Reyzume is completely free to use. Create unlimited resumes, customize them fully, and export as PDF anytime.",
  },
  {
    question: "Can I download my resume as PDF?",
    answer:
      "Yes! You can download your resume as a high-quality, print-ready PDF using your browser's native print dialog.",
  },
  {
    question: "Can I edit my resume after downloading?",
    answer:
      "Your resumes are saved to your account and can be edited anytime. You can also create multiple versions for different job applications.",
  },
  {
    question: "What makes it ATS-friendly?",
    answer:
      "Our resumes are designed with clean formatting, proper heading hierarchy, and keyword optimization that Applicant Tracking Systems can easily parse. We avoid complex layouts, graphics, and tables that confuse ATS software.",
  },
  {
    question: "Can I customize fonts and spacing?",
    answer:
      "Yes! You have full control over font family, font size, line height, and margins. Changes apply in real-time so you can see exactly how your resume will look.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="space-y-10">
      <div className="flex flex-col gap-4 text-center">
        <span className="text-lg font-semibold uppercase tracking-[0.2em] text-[#3B82F6]">
          FAQ
        </span>
        <h2 className="text-3xl font-semibold text-[#111827] sm:text-4xl">
          Answers to common questions
        </h2>
      </div>
      <Accordion
        type="single"
        collapsible
        className="space-y-2 w-full"
        defaultValue="item-0"
      >
        {faqs.map((faq, index) => (
          <AccordionItem key={faq.question} value={`item-${index}`}>
            <AccordionTrigger className="cursor-pointer">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
