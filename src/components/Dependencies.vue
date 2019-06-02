<template>
  <div>
    <h1 class="text-3xl mb-2">Libraries:</h1>
    <div v-for="(item, index) in items" :key="index">
      <a class="underline" :href="item.source" target="_blank">{{item.name}}</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "dependencies",
  data() {
    return {
      items: [
        {
          name: "Tailwind CSS",
          source: "https://github.com/tailwindcss/tailwindcss"
        },
        {
          name: "github-markdown-css",
          source: "https://github.com/sindresorhus/github-markdown-css"
        },
        {
          name: "Marked",
          source: "https://github.com/markedjs/marked"
        },
        {
          name: "marked-plaintext",
          source: "https://github.com/etler/marked-plaintext"
        },
        {
          name: "Mousetrap",
          source: "https://github.com/ccampbell/mousetrap"
        },
        {
          name: "nedb",
          source: "https://github.com/louischatriot/nedb"
        },
        {
          name: "nedb-promises",
          source: "https://github.com/bajankristof/nedb-promises"
        },
        {
          name: "Random Color",
          source: "https://github.com/davidmerfield/randomColor"
        },
        {
          name: "underscore",
          source: "https://github.com/jashkenas/underscore"
        },
        {
          name: "Vue.js",
          source: "https://github.com/vuejs/vue"
        },
        {
          name: "vue-router",
          source: "https://github.com/vuejs/vue-router"
        },
        {
          name: "Vuex",
          source: "https://github.com/vuejs/vuex"
        },
        {
          name: "loading.io css spinner ( https://loading.io/css/ )",
          source: "https://loading.io/css/"
        },
        {
          name: "EasyMDE - Markdown Editor",
          source: "https://github.com/Ionaru/easy-markdown-editor"
        },
        {
          name: "Fuse.js",
          source: "https://github.com/krisk/fuse"
        },
        {
          name: "Icons by Bryn Taylor",
          source:
            "https://dribbble.com/shots/1934932-77-Essential-Icons-Free-Download"
        },
        {
          name: "FileSaver.js",
          source: "https://github.com/eligrey/FileSaver.js"
        },
        {
          name: "he (HTML entity encoder/decoder)",
          source: "https://github.com/mathiasbynens/he"
        }
      ]
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>