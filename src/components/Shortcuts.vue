<template>
  <div>
    <h1 class="text-3xl mb-2">Shortcuts:</h1>
    <div v-for="(mode, index) in modes" :key="index" class="mb-2">
      <h4 class="text-xl mb-1">{{mode.name}}:</h4>
      <div v-for="(item, index) in mode.items" :key="index" class="shortcut flex pl-2">
        <div class="w-1/2">{{item.keys}}</div>
        <div class="w-1/2">{{item.description}}</div>
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
              keys: "shift+n",
              description: "new note (enter edit mode)"
            },
            {
              keys: "/",
              description: "focus on search"
            },
            {
              keys: "c+l",
              description: "clear search"
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