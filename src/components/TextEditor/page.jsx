"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import DOMPurify from "dompurify";
import "react-quill-new/dist/quill.snow.css";

// Load Quill dynamically (to avoid SSR issues in Next.js)
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "blockquote",
  "code-block",
  "link",
  "image",
];

export default function TextEditor({ value, onChange }) {
  // Sanitize HTML output
  const sanitized = useMemo(() => {
    if (!value) return "";
    return DOMPurify.sanitize(value);
  }, [value]);

  return (
    <div className="space-y-4">
      {/* Editor */}
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        rows={8}
      />

      {/* Live Preview */}
{value && (
  <div
    className="ql-snow ql-editor border p-3 rounded-lg bg-gray-50"
    dangerouslySetInnerHTML={{ __html: sanitized }}
  />
)}
    </div>
  );
}
