
import { useState } from "react";

function FAQ() {

  const faqs = [
    {
      question: "Can I export notes as PDF?",
      answer: "Yes. One click PDF export is available."
    },
    {
      question: "Does AI summarize notes?",
      answer: "Yes. AI Assistant can summarize, explain and improve notes."
    },
    {
      question: "Is OrganizeNotes mobile responsive?",
      answer: "Yes. It works on desktop, tablet and mobile."
    },
    {
      question: "Can I pin important notes?",
      answer: "Yes. Pinned notes have their own dedicated page."
    }
  ];

  const [open, setOpen] = useState(null);

return (
  <section id="faq" className="relative py-24 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">

   

    <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>

    <div className="absolute bottom-0 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>

    <div className="relative max-w-5xl mx-auto px-5 sm:px-6">

     

      <div className="text-center mb-16">

      

        <h2 className="mt-6 text-4xl sm:text-5xl font-bold dark:text-white">
          Got Questions?
          <span className="text-blue-600"> We've Answers</span>
        </h2>

        <p className="mt-5 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Everything you need to know about OrganizeNotes before getting started.
        </p>

      </div>

      {/* FAQ */}

      <div className="space-y-6">

        {faqs.map((faq, index) => (

          <div
            key={index}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-3xl border border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
          >

            <button
              onClick={() => setOpen(open === index ? null : index)}
              className="w-full flex justify-between items-center text-left p-6 sm:p-7"
            >

              <span className="text-lg sm:text-xl font-semibold dark:text-white pr-4">
                {faq.question}
              </span>

              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-300 ${
                  open === index
                    ? "bg-blue-600 rotate-180"
                    : "bg-gray-300 dark:bg-slate-700"
                }`}
              >
                {open === index ? "−" : "+"}
              </div>

            </button>

            <div
              className={`transition-all duration-500 overflow-hidden ${
                open === index
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >

              <div className="px-6 sm:px-7 pb-7 text-gray-600 dark:text-gray-300 leading-8">

                {faq.answer}

              </div>

            </div>

          </div>

        ))}

      </div>

  

     
    </div>

  </section>
);
}

export default FAQ;

