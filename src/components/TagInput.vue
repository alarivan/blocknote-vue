<template>
  <div class="flex flex-wrap items-center mb-2 mx-1 sm:mx-0">
    <div class="w-full flex-auto border-b border-b-2 border-teal-500 py-2 mb-2">
      <input
        ref="tagsearchinput"
        class="mousetrap w-full appearance-none bg-transparent border-none text-gray-700 py-1 px-2 leading-tight focus:outline-none"
        type="text"
        :placeholder="placeholder"
        :aria-label="label"
        v-model="model"
      >
    </div>
    <div class>
      <div
        @click="add(tag)"
        class="tag text-xs font-bold text-gray-800 cursor-pointer"
        v-for="(tag, index) in filtered"
        :key="index"
      >{{tag.name}}</div>
    </div>
    <div class="border-l-2 border-white">
      <button
        v-for="(tag, index) in selected"
        :key="index"
        @click="remove(tag)"
        class="relative tag text-xs font-bold text-gray-800"
        :style="{ backgroundColor: tag.color }"
      >{{tag.name}}</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "tag-input",
  data() {
    return {
      model: ""
    };
  },

  props: {
    selected: { type: Array },
    placeholder: { type: String },
    label: { type: String }
  },

  methods: {
    add(tag) {
      this.$emit("add", tag);
      this.model = "";
    },

    remove(tag) {
      this.$emit("remove", tag);
    },

    clear() {
      this.$emit("clear");
      this.model = "";
    },

    focus() {
      this.$refs.tagsearchinput.focus();
    },

    addFirstFiltered() {
      if (this.filtered.length) {
        this.add(this.filtered[0]);
      }
    }
  },

  computed: {
    tags() {
      return this.$store.state.tags;
    },

    filtered() {
      if (this.model !== "") {
        return this.tags.filter(t => {
          return (
            t.name.includes(this.model.toLowerCase()) &&
            !this.selected.includes(t)
          );
        });
      }

      return [];
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
