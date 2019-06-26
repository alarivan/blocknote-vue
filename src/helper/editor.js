export const EDITOR_BUTTONS = [
  {
    hotkey: "Ctrl-B",
    title: "Bold",
    class: "bold",
    label: "<svg class='icon'><use xlink:href='#icon-bold'></use></svg>",
    callback: function(cm) {
      var selection = cm.getSelection();
      cm.replaceSelection("**" + selection + "**");
      if (!selection) {
        var cursorPos = cm.getCursor();
        cm.setCursor(cursorPos.line, cursorPos.ch - 2);
      }
    }
  },
  {
    hotkey: "Ctrl-I",
    title: "Italic",
    class: "italic",
    label: "<svg class='icon'><use xlink:href='#icon-italic'></use></svg>",
    callback: function(cm) {
      var selection = cm.getSelection();
      cm.replaceSelection("*" + selection + "*");
      if (!selection) {
        var cursorPos = cm.getCursor();
        cm.setCursor(cursorPos.line, cursorPos.ch - 1);
      }
    }
  },
  {
    title: "Inline Code",
    class: "inline-code",
    label: "<svg class='icon'><use xlink:href='#icon-embed'></use></svg>",
    callback: function(cm) {
      var selection = cm.getSelection();
      cm.replaceSelection("`" + selection + "`");
      if (!selection) {
        var cursorPos = cm.getCursor();
        cm.setCursor(cursorPos.line, cursorPos.ch - 1);
      }
    }
  },
  {
    title: "Code Block",
    class: "block-code",
    label: "<svg class='icon'><use xlink:href='#icon-embed2'></use></svg>",
    callback: function(cm) {
      var selection = cm.getSelection();
      cm.replaceSelection("```\n" + selection + "\n```\n");
      if (!selection) {
        var cursorPos = cm.getCursor();
        cm.setCursor(cursorPos.line - 2, 0);
      }
    }
  },
  {
    title: "Quote",
    class: "quote",
    label: "<svg class='icon'><use xlink:href='#icon-quotes-left'></use></svg>",
    callback: function(cm) {
      cm.replaceSelection("> " + cm.getSelection());
    }
  },
  {
    title: "Unordered List",
    class: "ul",
    label: "<svg class='icon'><use xlink:href='#icon-list2'></use></svg>",
    callback: function(cm) {
      cm.replaceSelection("- " + cm.getSelection());
    }
  },
  {
    title: "Ordered List",
    class: "ol",
    label:
      "<svg class='icon'><use xlink:href='#icon-list-numbered'></use></svg>",
    callback: function(cm) {
      cm.replaceSelection("1. " + cm.getSelection());
    }
  },
  {
    title: "Link",
    class: "a",
    label: "<svg class='icon'><use xlink:href='#icon-link'></use></svg>",
    callback: function(cm) {
      var selection = cm.getSelection();
      var text = "";
      var link = "";

      if (selection.match(/^https?:\/\//)) {
        link = selection;
      } else {
        text = selection;
      }
      cm.replaceSelection("[" + text + "](" + link + ")");

      var cursorPos = cm.getCursor();
      if (!selection) {
        cm.setCursor(cursorPos.line, cursorPos.ch - 3);
      } else if (link) {
        cm.setCursor(cursorPos.line, cursorPos.ch - (3 + link.length));
      } else {
        cm.setCursor(cursorPos.line, cursorPos.ch - 1);
      }
    }
  },
  {
    hotkey: "Ctrl-P",
    title: "Copy Block",
    class: "copy",
    label: "c^",
    callback: function(cm) {
      var selection = cm.getSelection();
      cm.replaceSelection("^c " + selection + " c^");
      if (!selection) {
        var cursorPos = cm.getCursor();
        cm.setCursor(cursorPos.line, cursorPos.ch - 3);
      }
    }
  }
];

export function editorButtons(items = []) {
  return EDITOR_BUTTONS.concat(items);
}
