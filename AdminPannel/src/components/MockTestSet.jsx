import { useState } from "react";

function MockTestSet({ topics = [], onSubmit }) {
  const [form, setForm] = useState({
    topic_id: "",
    title: "",
    description: "",
    duration_minutes: 30,
    total_marks: 30,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...form,
      duration_minutes: Number(form.duration_minutes),
      total_marks: Number(form.total_marks),
    });

    setForm({
      topic_id: "",
      title: "",
      description: "",
      duration_minutes: 30,
      total_marks: 30,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-5 space-y-4">
      <h2 className="text-lg font-semibold">Create Test Set</h2>

      <select
        className="w-full rounded-lg border p-3"
        value={form.topic_id}
        onChange={(e) => setForm({ ...form, topic_id: e.target.value })}
        required
      >
        <option value="">Select Topic</option>
        {topics.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>

      <input
        className="w-full rounded-lg border p-3"
        placeholder="Test set title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />

      <textarea
        className="w-full rounded-lg border p-3"
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <div className="grid grid-cols-2 gap-3">
        <input
          type="number"
          min="1"
          className="w-full rounded-lg border p-3"
          placeholder="Duration (minutes)"
          value={form.duration_minutes}
          onChange={(e) =>
            setForm({ ...form, duration_minutes: e.target.value })
          }
          required
        />

        <input
          type="number"
          min="1"
          className="w-full rounded-lg border p-3"
          placeholder="Total marks"
          value={form.total_marks}
          onChange={(e) =>
            setForm({ ...form, total_marks: e.target.value })
          }
          required
        />
      </div>

      <button className="rounded-lg bg-blue-600 px-5 py-2 text-white">
        Create Test Set
      </button>
    </form>
  );
}

export default MockTestSet;