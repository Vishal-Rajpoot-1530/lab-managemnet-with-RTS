import { Router } from "express";

interface InputTypeOption {
  value: string;
  label: string;
}

const r = Router();

const data: InputTypeOption[] = [
  { value: "single_line", label: "Single Line" },
  { value: "numeric", label: "Numeric" },
  { value: "paragraph", label: "Paragraph" },
];

r.get("/", (req, res) => {
  res.json({ success: true, data, requestId: req.requestId });
});

export default r;
