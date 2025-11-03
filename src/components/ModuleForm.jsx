import { useState } from "react";
import { generateHTML } from "../utils/generateHTML";

export default function ModuleForm() {
  const [form, setForm] = useState({
    module_title: "",
    week_number: "",
    intro_text: "",
    part1_title: "",
    part1_video: "",
    part1_transcript: "",
    summary_notes: [""],
  });
  const [output, setOutput] = useState("");

  const updateField = (key, value) => setForm({ ...form, [key]: value });

  async function handleGenerate() {
    const templateUrl = `${import.meta.env.BASE_URL}templates/moduleTemplate.html`;
    const res = await fetch(templateUrl);
    const template = await res.text();
    setOutput(generateHTML(form, template));
  }

  const updateSummaryNote = (index, value) => {
    const newNotes = [...form.summary_notes];
    newNotes[index] = value;
    setForm({ ...form, summary_notes: newNotes });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
        <p className="text-blue-700">
          <strong>Instructions:</strong> 1️⃣ Fill in details → 2️⃣ Click “Generate” →
          3️⃣ Copy or Download the HTML → 4️⃣ Paste into Canvas (HTML View)
        </p>
      </div>

      <h1 className="text-2xl font-semibold text-blue-700">Canvas Page Generator</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="border p-2"
          placeholder="Module Title"
          value={form.module_title}
          onChange={(event) => updateField("module_title", event.target.value)}
        />
        <input
          className="border p-2"
          placeholder="Week Number"
          value={form.week_number}
          onChange={(event) => updateField("week_number", event.target.value)}
        />
      </div>

      <textarea
        className="border p-2 w-full h-24"
        placeholder="Intro Text"
        value={form.intro_text}
        onChange={(event) => updateField("intro_text", event.target.value)}
      />

      <h2 className="text-xl font-semibold text-gray-700 mt-4">Part 1</h2>
      <input
        className="border p-2 w-full"
        placeholder="Part 1 Title"
        value={form.part1_title}
        onChange={(event) => updateField("part1_title", event.target.value)}
      />
      <input
        className="border p-2 w-full"
        placeholder="Video URL"
        value={form.part1_video}
        onChange={(event) => updateField("part1_video", event.target.value)}
      />
      <textarea
        className="border p-2 w-full h-24"
        placeholder="Transcript Text"
        value={form.part1_transcript}
        onChange={(event) => updateField("part1_transcript", event.target.value)}
      />

      <h2 className="text-xl font-semibold text-gray-700 mt-4">Summary Notes</h2>
      {form.summary_notes.map((note, index) => (
        <input
          key={index}
          className="border p-2 w-full mb-2"
          value={note}
          placeholder={`Note ${index + 1}`}
          onChange={(event) => updateSummaryNote(index, event.target.value)}
        />
      ))}
      <button
        onClick={() =>
          setForm({ ...form, summary_notes: [...form.summary_notes, ""] })
        }
        className="bg-gray-200 px-3 py-1 rounded"
      >
        Add Note
      </button>

      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-4 py-2 rounded block mt-4"
      >
        Generate Canvas Page
      </button>

      {output && (
        <div className="mt-6">
          <div className="flex flex-col md:flex-row gap-3 mb-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(output);
                alert("Copied HTML to clipboard!");
              }}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Copy HTML
            </button>

            <button
              onClick={() => {
                const blob = new Blob([output], { type: "text/html" });
                const url = URL.createObjectURL(blob);
                const anchor = document.createElement("a");
                anchor.href = url;
                anchor.download = `canvas_module_week${form.week_number || ""}.html`;
                anchor.click();
                URL.revokeObjectURL(url);
              }}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Download HTML
            </button>
          </div>

          <textarea
            readOnly
            value={output}
            className="border p-2 w-full h-96 font-mono"
          />

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
            <div
              className="border rounded p-4 bg-white shadow-sm"
              dangerouslySetInnerHTML={{ __html: output }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
