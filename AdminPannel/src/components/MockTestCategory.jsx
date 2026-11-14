import { useState } from "react";

function MockTestCategory({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ name: "", description: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-5 space-y-4">
      <h2 className="text-lg font-semibold">Create Category</h2>

      <input
        className="w-full rounded-lg border p-3"
        placeholder="Category name"
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
        Add Category
      </button>
    </form>
  );
}

export default MockTestCategory;