import marked from "marked";

const renderer = new marked.Renderer();

renderer.link = function(href, title, text) {
  return `<a href="${href}" target="_blank" title="${text}">${text}</a>`;
};

export default renderer;
