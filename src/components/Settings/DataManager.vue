<template>
  <div class>
    <div>
      <button :class="buttonClasses" @click="clearTags">Clear Tags</button>
    </div>
    <div>
      <button :class="buttonClasses" @click="clearNotes">Clear Notes</button>
    </div>
  </div>
</template>

<script>
import tagsApi from "../../api/tags";
import notesApi from "../../api/notes";

export default {
  name: "tag-manager",
  data() {
    return {
      buttonClasses:
        "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-2"
    };
  },

  methods: {
    clearTags() {
      if (
        confirm(
          "This will delete all of your tags. Are you sure you want to proceed?"
        )
      ) {
        tagsApi.clearStorage();
      }
    },

    clearNotes() {
      if (
        confirm(
          "This will delete all of your notes. Are you sure you want to proceed?"
        )
      ) {
        notesApi.clearStorage();
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
