"use client";

import { useState } from "react";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "How long does shipping take?",
    answer:
      "Domestic shipping within India typically takes 5-7 business days. International shipping takes 10-15 business days depending on your location. All orders are carefully packaged to ensure safe delivery.",
  },
  {
    question: "Are your products handmade?",
    answer:
      "Yes, every piece in our collection is 100% handcrafted by skilled artisans. Each item is unique and may have slight variations, which adds to its charm and authenticity.",
  },
  {
    question: "What materials do you use?",
    answer:
      "We use premium quality materials including Teak Wood, Rosewood, Sheesham, White Kadam Wood, and Antique Teak. All our materials are sustainably sourced and eco-friendly.",
  },
  {
    question: "Do you offer custom orders?",
    answer:
      "Yes! We love bringing your vision to life. Contact us with your requirements, and our artisans will work with you to create a custom piece that perfectly matches your needs.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy for unused items in their original packaging. If you're not satisfied with your purchase, please contact our customer service team to initiate a return.",
  },
];

export function ProfessionalQA() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <span className="mb-2 inline-block text-sm font-medium uppercase tracking-wider text-[var(--color-primary)]">
            Got Questions?
          </span>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-[var(--color-muted)]">
            Find answers to common questions about our products and services.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-[var(--color-border)] transition-all"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-[var(--color-border)]/30"
                aria-expanded={openIndex === index}
              >
                <span className="pr-4 font-semibold">{faq.question}</span>
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/10 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  <svg
                    className="h-4 w-4 text-[var(--color-primary)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <p className="px-6 pb-6 text-[var(--color-muted)]">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="mb-4 text-[var(--color-muted)]">
            Still have questions? We&apos;re here to help!
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-6 py-3 font-medium text-white transition-all hover:bg-[var(--color-primary-dark)]"
          >
            Contact Us
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
