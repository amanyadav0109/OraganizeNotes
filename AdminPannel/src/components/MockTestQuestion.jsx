import { useState } from "react";

function MockTestQuestion({ testSets = [], onSubmit }) {
  const initialForm = {
    test_set_id: "",
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "A",
    explanation: "",
    marks: 1,
  };

  const [form, setForm] = useState(initialForm);

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...form,
      marks: Number(form.marks),
    });

    setForm(initialForm);
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-5 space-y-4">
      <h2 className="text-lg font-semibold">Add MCQ Question</h2>

      <select
        className="w-full rounded-lg border p-3"
        value={form.test_set_id}
        onChange={(e) => updateField("test_set_id", e.target.value)}
        required
      >
        <option value="">Select Test Set</option>
        {testSets.map((item) => (
          <option key={item.id} value={item.id}>
            {item.title}
          </option>
        ))}
      </select>

      <textarea
        className="w-full rounded-lg border p-3"
        placeholder="Enter your question"
        rows="3"
        value={form.question}
        onChange={(e) => updateField("question", e.target.value)}
        required
      />

      {["a", "b", "c", "d"].map((option) => (
        <input
          key={option}
          className="w-full rounded-lg border p-3"
          placeholder={`Option ${option.toUpperCase()}`}
          value={form[`option_${option}`]}
          onChange={(e) => updateField(`option_${option}`, e.target.value)}
          required
        />
      ))}

      <div>
        <label className="mb-2 block text-sm font-medium">
          Correct Answer
        </label>

        <select
          className="w-full rounded-lg border p-3"
          value={form.correct_answer}
          onChange={(e) => updateField("correct_answer", e.target.value)}
        >
          <option value="A">Option A</option>
          <option value="B">Option B</option>
          <option value="C">Option C</option>
          <option value="D">Option D</option>
        </select>
      </div>

      <textarea
        className="w-full rounded-lg border p-3"
        placeholder="Explanation (optional)"
        rows="3"
        value={form.explanation}
        onChange={(e) => updateField("explanation", e.target.value)}
      />

      <input
        type="number"
        min="1"
        className="w-full rounded-lg border p-3"
        placeholder="Marks"
        value={form.marks}
        onChange={(e) => updateField("marks", e.target.value)}
        required
      />

      <button className="rounded-lg bg-blue-600 px-5 py-2 text-white">
        Add Question
      </button>
    </form>
  );
}

export default MockTestQuestion;