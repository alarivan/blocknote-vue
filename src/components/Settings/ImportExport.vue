<template>
  <div class>
    <h2>Import/Export are not yet available.</h2>
    <div class="mb-4">
      <button :class="buttonClasses" @click="exportNotes">Export Notes</button>
      <p class="my-2">Notes are exported in plain JSON in the following format:</p>
      <div class="markdown-body">
        <pre>
        [
          {
            "_id": "generated_id",
            "body": "Note content (Markdown)",
            "tags": ["work", "play"]
          }
        ]</pre>
      </div>
    </div>
    <div>
      <label class="inline-block" :class="buttonClasses" for="import-notes">Import Notes</label>
      <input class="hidden" @change="importNotes" ref="import" id="import-notes" type="file">
      <p class="my-2">Imported JSON objects has to have "body". "_id" and "tags" are optional.</p>
    </div>
  </div>
</template>

<script>
import notesApi from "../../api/notes";

export default {
  name: "import-export",
  data() {
    return {
      buttonClasses:
        "bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
    };
  },

  methods: {
    exportNotes() {
      notesApi.export();
    },

    importNotes() {
      var file = this.$refs.import.files[0];
      if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function(evt) {
          notesApi.import(JSON.parse(evt.target.result));
        };
        reader.onerror = function(evt) {
          console.error("error reading file");
        };
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
