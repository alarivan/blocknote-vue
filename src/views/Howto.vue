<template>
  <div class="container mx-auto relative px-2">
    <h1 class="text-center text-3xl my-2">How To</h1>
    <div :class="blockClasses">
      <div class="wista-wrapper" :class="videoClasses">
        <wistia :vid="basics"/>
      </div>

      <div :class="descClasses">
        <h2 class="text-xl mb-2">Basics</h2>
        <ul class="list-disc px-4">
          <li>Press "shift+n" to create a new note.</li>
          <li>
            Markdown editor has its own
            <a
              target="_blank"
              class="underline"
              href="https://github.com/Ionaru/easy-markdown-editor#keyboard-shortcuts"
            >shortcuts</a> so you will need to press "esc" or click outside of the editor for app shortcuts to work.
          </li>
          <li>When focused in editor pressing "alt+enter" will move focus to tags.</li>
          <li>When focused in tags or not focused on any input pressing "alt+enter" will save the note.</li>
          <li>Press "/" to focus on search input.</li>
          <li>Search input searches notes by content and tags.</li>
          <li>Pressing "r r" will clear search input, tags input and selected tags</li>
          <li>Press "t /" to focus on tags input.</li>
          <li>Tags input allows to only search notes with selected tags.</li>
          <li>Pressing "enter" when there is a tag suggestion will select the first tag. You can also click on suggestons to select them.</li>
          <li>Clicking on a selected tag will remove it.</li>
        </ul>
      </div>
    </div>
    <div :class="blockClasses" class="flex-col-reverse sm:flex-row">
      <div :class="descClasses">
        <h2 class="text-xl mb-2">Select Mode</h2>
        <ul class="list-disc px-4">
          <li>Press "s s" to enter Select Mode.</li>
          <li>Use arrows to move around.</li>
          <li>Press "e" to edit selected note.</li>
          <li>Press "c" to copy note content.</li>
          <li>Press "d d" to delete selected note.</li>
        </ul>
      </div>
      <div class="wista-wrapper" :class="videoClasses">
        <wistia :vid="select"/>
      </div>
    </div>
    <div :class="blockClasses">
      <div class="wista-wrapper" :class="videoClasses">
        <wistia :vid="copy"/>
      </div>
      <div :class="descClasses">
        <h2 class="text-xl mb-2">Copy Block</h2>
        <ul class="list-disc px-4">
          <li>You can wrap a part of your note in "^c" and "c^".</li>
          <li>When you click copy button or press "c" in select mode only the part between "^c" and "c^" will be copied.</li>
          <li>Notes without copy block will copy the whole note content without markdown.</li>
        </ul>
      </div>
    </div>
  </div>
</template>


<script
    src="https://fast.wistia.com/embed/medias/b6xsepwrmk.jsonp"
    async
  ></script>
<script src="https://fast.wistia.com/embed/medias/mgcqbd1jon.jsonp" async></script>
<script src="https://fast.wistia.com/embed/medias/e66i0k8ez0.jsonp" async></script>
<script>
import Wistia from "../components/Howto/Wistia";

export default {
  name: "about",
  components: { Wistia },
  data() {
    return {
      basics: "edp5n44kcs",
      select: "k9jr9i4ien",
      copy: "k1dgmbvsuo",
      blockClasses: "flex flex-wrap how-to-block my-20",
      videoClasses: "w-full sm:w-1/2",
      descClasses: "sm:w-1/2 px-4 py-4 sm:py-0"
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.how-to-block {
  .wista-wrapper {
    max-height: 355px;
    overflow: hidden;
  }

  li {
    margin-bottom: 0.5em;
  }
}
</style>