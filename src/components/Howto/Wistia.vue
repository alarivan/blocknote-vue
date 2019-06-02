<template>
  <div class="wistia_responsive_padding" style="padding:56.25% 0 0 0;position:relative;">
    <div
      class="wistia_responsive_wrapper"
      style="height:100%;left:0;position:absolute;top:0;width:100%;"
    >
      <div
        :class="`wistia_async_${vid}`"
        class="wistia_embed videoFoam=true"
        style="height:100%;position:relative;width:100%"
      >
        <div
          class="wistia_swatch"
          style="height:100%;left:0;opacity:0;overflow:hidden;position:absolute;top:0;transition:opacity 200ms;width:100%;"
        >
          <img
            :src="`https://fast.wistia.com/embed/medias/${vid}/swatch`"
            style="filter:blur(5px);height:100%;object-fit:contain;width:100%;"
            alt
            onload="this.parentNode.style.opacity=1;"
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "wista",
  data() {
    return {};
  },

  props: {
    vid: { type: String }
  },

  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
