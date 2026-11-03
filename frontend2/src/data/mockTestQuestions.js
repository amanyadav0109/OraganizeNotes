
const mockTestQuestions = {
  maths: [
    {
      id: 1,
      question: {
        English: "What is the value of 15 × 4?",
        Hindi: "15 × 4 का मान कितना है?"
      },
      options: {
        English: ["45", "50", "60", "65"],
        Hindi: ["45", "50", "60", "65"]
      },
      answer: 2,
      explanation: {
        English: "15 multiplied by 4 equals 60.",
        Hindi: "15 को 4 से गुणा करने पर 60 मिलता है।"
      }
    },
    {
      id: 2,
      question: {
        English: "What is the square of 12?",
        Hindi: "12 का वर्ग कितना है?"
      },
      options: {
        English: ["124", "144", "132", "154"],
        Hindi: ["124", "144", "132", "154"]
      },
      answer: 1,
      explanation: {
        English: "12 × 12 = 144.",
        Hindi: "12 × 12 = 144।"
      }
    },
    {
      id: 3,
      question: {
        English: "What is 25% of 200?",
        Hindi: "200 का 25% कितना है?",
      },
      options: {
        English: ["25", "40", "50", "75"],
        Hindi: ["25", "40", "50", "75"]
      },
      answer: 2,
      explanation: {
        English: "25% of 200 is 50.",
        Hindi: "200 का 25% = 50 होता है।"
      }
    },
    {
      id: 4,
      question: {
        English: "What is the value of 8²?",
        Hindi: "8² का मान कितना है?"
      },
      options: {
        English: ["16", "32", "64", "81"],
        Hindi: ["16", "32", "64", "81"]
      },
      answer: 2,
      explanation: {
        English: "8 × 8 = 64.",
        Hindi: "8 × 8 = 64।"
      }
    },
    {
      id: 5,
      question: {
        English: "What is the average of 10, 20 and 30?",
        Hindi: "10, 20 और 30 का औसत कितना है?"
      },
      options: {
        English: ["15", "20", "25", "30"],
        Hindi: ["15", "20", "25", "30"]
      },
      answer: 1,
      explanation: {
        English: "(10 + 20 + 30) / 3 = 20.",
        Hindi: "(10 + 20 + 30) / 3 = 20।"
      }
    }
  ]
};

export default mockTestQuestions;
