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
      <svg class="svg-icon fill-current text-gray-900" viewBox="0 0 20 20">
        <path
          d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"
        ></path>
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

      .view-action {
        display: none;
      }
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