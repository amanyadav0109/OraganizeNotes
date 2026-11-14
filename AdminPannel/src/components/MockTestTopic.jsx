import { useState } from "react";

function MockTestTopic({ subjects = [], onSubmit }) {
  const [form, setForm] = useState({
    subject_id: "",
    name: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ subject_id: "", name: "", description: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-5 space-y-4">
      <h2 className="text-lg font-semibold">Create Topic</h2>

      <select
        className="w-full rounded-lg border p-3"
        value={form.subject_id}
        onChange={(e) => setForm({ ...form, subject_id: e.target.value })}
        required
      >
        <option value="">Select Subject</option>
        {subjects.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>

      <input
        className="w-full rounded-lg border p-3"
        placeholder="Topic name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />

      <textarea
        className="w-full rounded-lg border p-3"
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <button className="rounded-lg bg-blue-600 px-5 py-2 text-white">
        Add Topic
      </button>
    </form>
  );
}

export default MockTestTopic;