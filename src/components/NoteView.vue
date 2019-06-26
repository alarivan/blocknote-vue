<template>
  <modal
    name="note-view-modal"
    class="view-modal"
    width="100%"
    height="100%"
    :adaptive="true"
    @closed="close"
    @before-open="beforeOpen"
    @before-close="beforeClose"
  >
    <button class="view-modal-close" @click="close">
      <svg class="icon mx-auto">
        <use xlink:href="#icon-cross"></use>
      </svg>
    </button>
    <note v-if="note" :note="note" :index="1000" :selected="false"></note>
  </modal>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import scrollLock from "scroll-lock";
import Note from "../components/Note";

export default {
  name: "note-view",
  components: { Note },

  data() {
    return {
      active: false
    };
  },

  mounted() {},

  methods: {
    close() {
      this.setNoteView(false);
    },

    beforeOpen() {
      scrollLock.disablePageScroll(document.documentElement);
    },

    beforeClose() {
      scrollLock.enablePageScroll(document.documentElement);
    },

    ...mapActions(["setNoteView"])
  },

  computed: {
    note() {
      return this.$store.state.noteView;
    }
  },

  watch: {
    note(n) {
      if (!!n) {
        this.$modal.show("note-view-modal");
      } else {
        this.$modal.hide("note-view-modal");
      }
    }
  }
};
</script>

<style lang="scss">
.view-modal {
  .v--modal-box.v--modal {
    border-radius: 0;
    > div {
      width: 100%;
      height: 100%;
      max-height: none;
      padding: 0;
    }

    .note {
      border: none;
    }

    .markdown-body {
      overflow: auto;
    }
  }

  @screen sm {
    .v--modal-box.v--modal {
      width: 80% !important;
      margin: 0 auto;
    }
  }

  .view-modal-close {
    @apply absolute z-10;
    right: 10px;
    top: 10px;

    .svg-icon {
      width: 1.5rem;
      height: 1.5rem;
    }
  }
}
</style>