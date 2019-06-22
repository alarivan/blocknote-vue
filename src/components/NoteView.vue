<template>
  <a-modal
    v-model="active"
    wrapClassName="view-modal"
    :footer="null"
    :title="null"
    width="80%"
    :closable="true"
  >
    <note v-if="note" :note="note" :index="1000" :selected="false"></note>
  </a-modal>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
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
    ...mapActions(["setNoteView"])
  },

  computed: {
    note() {
      return this.$store.state.noteView;
    }
  },

  watch: {
    note(n) {
      this.active = !!n;
    },

    active(n) {
      if (!n) {
        this.setNoteView(false);
      }
    }
  }
};
</script>

<style lang="scss">
.view-modal {
  .ant-modal {
    top: 0;
    max-height: 100vh;

    // margin: 0;

    .ant-modal-content {
      max-height: 100vh;
      height: 100vh;
      border-radius: 0;
      background: transparent;

      .ant-modal-body {
        height: 100%;

        @screen sm {
          @apply p-2;
        }

        > div {
          width: 100%;
          height: 100%;
          max-height: none;
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
    }
  }

  @media (max-width: 767px) {
    .ant-modal {
      margin: 0;
      .ant-modal-body {
        padding: 0;
      }
    }
  }
}
</style>