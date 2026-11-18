
import { useState } from "react";
import {
  FaChevronDown,
  FaQuestionCircle,
  FaBookOpen,
} from "react-icons/fa";

function FAQ() {
  
const faqs = [
  {
    question: "What is OrganizeNotes and what can I do with it?",
    answer:
      "OrganizeNotes is an all-in-one learning platform where students can organize study notes, manage subjects, practice questions, attempt mock tests, track performance and use AI-powered study tools.",
  },
  {
    question: "What features does the AI Assistant provide?",
    answer:
      "The AI Assistant helps you generate notes summaries, interview questions and multiple-choice questions (MCQs), making revision and exam preparation easier.",
  },
  {
    question: "What is the Notes Marketplace?",
    answer:
      "The Notes Marketplace allows students to discover, preview and purchase study materials shared by other students. You can also upload your own notes and make them available for other learners to purchase.",
  },
  {
    question: "How much can I earn by selling my notes?",
    answer:
      "Your earnings depend on the selling price of your notes and the number of successful purchases. The amount credited to you will be calculated according to the platform's applicable commission and payment policies.",
  },
  {
    question: "When and how will I receive money from my note sales?",
    answer:
      "Earnings from successful note sales are subject to payment verification, applicable platform charges and payout processing. Please check the Marketplace payout policy for the minimum withdrawal amount, payment schedule and available withdrawal methods.",
  },
  {
    question: "Is OrganizeNotes free and can I use it on my phone?",
    answer:
      "OrganizeNotes offers a free plan with access to essential learning features, along with a Premium plan for additional benefits. The platform is responsive and can be accessed from desktops, tablets and mobile devices.",
  },
];


  const [open, setOpen] = useState(0);

  return (
    <section
      id="faq"
      className="relative overflow-hidden py-20 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
    >
  
      <div className="absolute top-10 left-0 w-72 h-72 bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-5xl mx-auto px-5 sm:px-6">

        
        <div className="text-center mb-14">

          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-semibold">
            <FaQuestionCircle />
            Frequently Asked Questions
          </span>

          <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            Got Questions?
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              We've Got Answers
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-8">
            Find answers to common questions and learn how OrganizeNotes
            can make your study experience smarter and more organized.
          </p>

        </div>

        
        <div className="space-y-4">

          {faqs.map((faq, index) => {
            const isOpen = open === index;

            return (
              <div
                key={index}
                className={`group rounded-2xl border overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? "bg-white dark:bg-slate-900 border-blue-300 dark:border-blue-700 shadow-lg shadow-blue-500/5"
                    : "bg-white/80 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 hover:border-blue-200 dark:hover:border-slate-700"
                }`}
              >

                
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  className="w-full flex items-center justify-between gap-5 text-left p-5 sm:p-6"
                >

                  <div className="flex items-center gap-4">

                    <div
                      className={`hidden sm:flex w-10 h-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        isOpen
                          ? "bg-blue-600 text-white"
                          : "bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      <FaBookOpen />
                    </div>

                    <span className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white">
                      {faq.question}
                    </span>

                  </div>

                  <div
                    className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen
                        ? "bg-blue-600 text-white rotate-180"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <FaChevronDown className="text-sm" />
                  </div>

                </button>

                
                <div
                  id={`faq-answer-${index}`}
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">

                    <div className="px-5 sm:px-6 pb-6 sm:pl-20 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-7">
                      {faq.answer}
                    </div>

                  </div>
                </div>

              </div>
            );
          })}

        </div>

        
        <div className="mt-12 text-center">

          <p className="text-slate-600 dark:text-slate-400">
            Still have questions?
          </p>

          <p className="mt-2 text-blue-600 dark:text-blue-400 font-semibold">
            Start exploring OrganizeNotes and make learning easier.
          </p>

        </div>

      </div>
    </section>
  );
}

export default FAQ;
