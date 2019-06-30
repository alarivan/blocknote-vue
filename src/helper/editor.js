import $ from "jquery";
import { CommandManager } from "tui-editor";

function tuiButton(name, command, tooltip, innerHTML) {
  return {
    type: "button",
    options: {
      $el: $('<button class="tui-toolbar-custom">' + innerHTML + "</div>"),
      name: name,
      command: command,
      tooltip: tooltip
    }
  };
}

export const EDITOR_BUTTONS = [
  {
    type: "button",
    options: {
      $el: $(
        '<button class="tui-heading tui-toolbar-custom"><div class="icon-text tui-heading"><div class="icon-text-value">H</div></div></div>"'
      ),
      name: "heading",
      event: "openHeadingSelect",
      tooltip: "Heading"
    }
  },
  tuiButton(
    "bold",
    "Bold",
    "Bold",
    "<svg class='icon'><use xlink:href='#icon-bold'></use></svg>"
  ),
  tuiButton(
    "italic",
    "Italic",
    "Italic",
    "<svg class='icon'><use xlink:href='#icon-italic'></use></svg>"
  ),
  tuiButton(
    "strike",
    "Strike",
    "Strike",
    "<svg class='icon'><use xlink:href='#icon-strikethrough'></use></svg>"
  ),
  tuiButton(
    "blockquote",
    "Blockquote",
    "Blockquote",
    "<svg class='icon'><use xlink:href='#icon-quotes-left'></use></svg>"
  ),
  tuiButton(
    "ul",
    "UL",
    "Unordered List",
    "<svg class='icon'><use xlink:href='#icon-list2'></use></svg>"
  ),
  tuiButton(
    "ol",
    "OL",
    "Numbered List",
    "<svg class='icon'><use xlink:href='#icon-list-numbered'></use></svg>"
  ),
  tuiButton(
    "link",
    "Link",
    "Link",
    "<svg class='icon'><use xlink:href='#icon-link'></use></svg>"
  ),
  tuiButton(
    "code",
    "Code",
    "Inline Code",
    "<svg class='icon'><use xlink:href='#icon-embed'></use></svg>"
  ),
  tuiButton(
    "codeBlock",
    "CodeBlock",
    "Code Block",
    "<svg class='icon'><use xlink:href='#icon-embed2'></use></svg>"
  )
];

export function editorButtons(items = []) {
  return EDITOR_BUTTONS.concat(items);
}

export function createTuiButtonEvent(
  editor,
  eventName,
  eventFunc,
  name,
  className,
  tooltip,
  innerHTML
) {
  var toolbar = editor.getUI().getToolbar();

  editor.eventManager.addEventType(eventName);
  editor.eventManager.listen(eventName, eventFunc);

  className += " tui-toolbar-custom";

  toolbar.addButton({
    name: name,
    className: className,
    event: eventName,
    tooltip: tooltip,
    $el: $('<button class="' + className + '">' + innerHTML + "</div>")
  });
}

export function createTuiButtonCommand(
  editor,
  name,
  className,
  tooltip,
  command,
  innerHTML
) {
  var toolbar = editor.getUI().getToolbar();

  className += " tui-toolbar-custom";

  toolbar.addButton({
    name: name,
    className: className,
    command: command,
    tooltip: tooltip,
    $el: $('<button class="' + className + '">' + innerHTML + "</div>")
  });
}

export function afterLoad(editor) {
  const copy = CommandManager.command("markdown", {
    name: "CopyBlock",
    keyMap: ["CTRL+P", "META+P"],

    exec(mde) {
      const cm = mde.getEditor();
      const doc = cm.getDoc();

      let selection = doc.getSelection();
      doc.replaceSelection("^c " + selection + " c^");

      if (!selection) {
        const cursorPos = doc.getCursor();
        doc.setCursor(cursorPos.line, cursorPos.ch - 3);
      }

      cm.focus();
    }
  });
  editor.commandManager.addCommand(copy);

  createTuiButtonCommand(
    editor,
    "copyBlock",
    "copy-block",
    "Copy Block (CTRL+P)",
    "<div class='icon-text'><div class='icon-text-value'>c^</div></div>",
    20
  );
}
