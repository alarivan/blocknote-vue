<template>
  <div>
    <h1 class="text-3xl mb-2">Shortcuts:</h1>
    <p
      class="italic mb-2"
    >IMPORTANT: When focused in markdown editor you need to press esc or click outside of markdown editor for app shorcuts to work.</p>
    <div v-for="(mode, index) in modes" :key="index" class="mb-2">
      <h4 class="text-xl mb-1">{{mode.name}}:</h4>
      <div v-for="(item, index) in mode.items" :key="index" class="shortcut flex pl-2">
        <div class="w-1/2">{{item.keys}}</div>
        <div class="w-1/2">{{item.description}}</div>
      </div>
    </div>
    <a
      class="mb-2 underline"
      href="https://github.com/Ionaru/easy-markdown-editor#keyboard-shortcuts"
      target="_blank"
    >EasyMDE - Markdown Editor Shortcuts</a>
  </div>
</template>

<script>
export default {
  name: "shortcuts",
  data() {
    return {
      modes: [
        {
          name: "general",
          items: [
            {
              keys: "shift+n",
              description: "new note (enter edit mode)"
            },
            {
              keys: "/",
              description: "focus on search"
            },
            {
              keys: "t /",
              description: "focus on tag search"
            },
            {
              keys: "enter (when in tag search)",
              description:
                "adds a tag to filter (you can click on a tag to remove it)"
            },
            {
              keys: "r r",
              description:
                "clear search, clear tags search, clear selected tags"
            },
            {
              keys: "s s",
              description: "enter select mode"
            }
          ]
        },
        {
          name: "edit mode",
          items: [
            {
              keys: "esc",
              description: "exit edit mode"
            },
            {
              keys: "alt+enter (when in content or tags input)",
              description: "save note"
            }
          ]
        },
        {
          name: "select mode",
          items: [
            {
              keys: "esc, s s",
              description: "exit select mode"
            },
            {
              keys: "c",
              description: "copy selected note"
            },
            {
              keys: "e",
              description: "edit selected note (enter edit mode)"
            },
            {
              keys: "j, down arrow",
              description: "move down"
            },
            {
              keys: "k, up arrow",
              description: "move up"
            },
            {
              keys: "l, right arrow",
              description: "move right"
            },
            {
              keys: "h, left arrow",
              description: "move left"
            }
          ]
        }
      ]
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.shortcut {
  &:nth-child(even) {
    background: #f7fafc;
  }
}
</style>