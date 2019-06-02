import he from "he";

export default function clipboard(text) {
  const decoded = he.decode(text);
  const textarea = document.createElement("textarea");
  textarea.value = decoded;
  textarea.setAttribute("readonly", "");
  textarea.style = { position: "absolute", left: "-9999px" };
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}
