const TUTORIAL_NOTES = [
  {
    body:
      "### 1: Welcome\n\nPlease read all the notes with a **tutorial** tag to learn how to make the most out of your experience.\n\nBlockNote.xyz is a simple note taking application, but it has many features that are not obvious at first. I would like to make them more intuitive, but I haven't found a way to do that yet. In the meantime, you have these tutorial notes and about page to help you.",
    tags: ["tutorial"],
    position: 1
  },
  {
    body:
      "### 2: Tutorial Notes\n\nTutorial notes are just like regular notes you can edit and delete them.\n\nWhen you no longer need them you can clear Tutorial Notes on Settings page.\nIf you would like to review Tutorial Notes again, you can Reset Tutorial Notes on Settings page.",
    tags: ["tutorial"],
    position: 2
  },
  {
    body:
      "### 3: Markdown\nBlockNote.xyz uses markdown editor for your notes. If you are not familiar with it click the link below to learn about it.\n\n[Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)",
    tags: ["tutorial"],
    position: 3
  },
  {
    body:
      "### 4: Search\n\n`/` will focus on Search\n\nWhen you are typing in search you will see tag suggestions.\n`enter` or `,` will select first suggested tag.\n`backspace` in empty Search will remove last selected tag.",
    tags: ["tutorial"],
    position: 4
  },
  {
    body:
      "### 5: Editing Notes\n\n`alt+enter` shortcut has different actions based on where the focus is:\n\n* When you are focused in the main editor, pressing `alt+enter` will move focus to tags.\n* When you are focused in tags pressing `alt+enter` will save the note.\n* When the editor is open, but not focused anywhere pressing `alt+enter` will save the note.\n\n`esc` will close the editor. Don't forget to save your note.",
    tags: ["tutorial"],
    position: 5
  },
  {
    body:
      "### 6: General Shortcuts\n\n`shift+n` - create new note\n`/` - focus on search\n`r r` - clear search\n`v` - open first note\n`e` - edit first note\n`c` - copy first note\n`d d` - delete first note",
    tags: ["tutorial"],
    position: 6
  },
  {
    body:
      '### 7: Copy Block\n\nBlockNote.xyz has a special markdown block that allows you to only copy part of the note.\nYou can use it by clicking "c^" button in editor toolbar or\nby surrounding text that you want to copy with opening symbol "`^c`" and closing symbol "`c^`"\n\n^c Only this part will be copied c^\n\nClick on a copy button and paste contents somewhere to see how it works.',
    tags: ["tutorial"],
    position: 7
  },
  {
    body:
      "### 8: Select Mode\n\nPress `s s` to enter Select Mode.\nPress `s s` or `esc` to exit Select Mode.\n\nYou can move in select mode use:\n\n* `j` or `arrow down` to move down\n* `k` or `arrow up` to move up\n* `h` or `arrow left` to move left\n* `l` or `arrow right` to move right\n\n###### Actions\n\n* `v` to open active note\n* `e` to edit active note\n* `c` to copy active note\n* `d d` to delete active note",
    tags: ["tutorial"],
    position: 8
  }
];

export default TUTORIAL_NOTES;
