<template>
  <div>
    <h1 class="text-3xl mb-2">Shortcuts:</h1>
    <div v-for="(mode, index) in modes" :key="index" class="mb-2">
      <h4 class="text-xl mb-1">{{mode.name}}:</h4>
      <div v-for="(item, index) in mode.items" :key="index" class="shortcut flex p-2">
        <div class="w-1/2 px-2">{{item.keys}}</div>
        <div class="w-1/2 px-2">{{item.description}}</div>
      </div>
    </div>
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
              keys: "shift+n (enter edit mode)",
              description: "new note"
            },
            {
              keys: "/",
              description: "focus on search"
            },
            {
              keys: "'enter' or ',' (when in search)",
              description:
                "adds a tag to filter (you can click on a tag to remove it)"
            },
            {
              keys: "backspace (when in empty search)",
              description: "removess last added tag"
            },
            {
              keys: "r r",
              description: "clear search, clear selected tags"
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
              keys: "alt+enter (when in content)",
              description: "move focus to tags"
            },
            {
              keys: "alt+enter (when in tags input or not focused on anything)",
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
              keys: "d d",
              description: "delete note"
            },
            {
              keys: "v",
              description: "open note"
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
</style>