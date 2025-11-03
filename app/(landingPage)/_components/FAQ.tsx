"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What makes it ATS-friendly?",
    answer:
      "Our resumes are designed with clean formatting, proper heading hierarchy, and keyword optimization that Applicant Tracking Systems can easily parse. We avoid complex layouts, graphics, and tables that confuse ATS software.",
  },
  {
    question: "Can I download my resume as PDF?",
    answer:
      "Yes! You can download your resume as a high-quality, ATS-compatible PDF. We also offer Word document exports for maximum compatibility with different application systems.",
  },
  {
    question: "Is it free to use?",
    answer:
      "We offer a free tier that includes basic templates and one resume download. Premium plans unlock advanced AI features, unlimited downloads, and access to our full template library.",
  },
  {
    question: "How does the AI enhancer work?",
    answer:
      "Our AI analyzes your content and suggests improvements for clarity, impact, and keyword optimization. It helps you highlight achievements, use action verbs, and tailor your resume to specific job descriptions.",
  },
  {
    question: "Can I edit my resume after downloading?",
    answer:
      "Your resumes are saved to your account and can be edited anytime. You can also create multiple versions for different job applications.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="space-y-10">
      <div className="flex flex-col gap-4 text-center">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3B82F6]">
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
          <AccordionItem
            key={faq.question}
            value={`item-${index}`}
            className=""
          >
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
