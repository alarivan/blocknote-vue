<template>
  <on-click-outside :do="handleClickOutside">
    <div class="relative">
      <button
        @click="open = !open"
        type="button"
        class="block text-gray-700 hover:text-gray-900 font-bold py-0 px-2 focus:outline-0"
      >
        <svg class="h-10 w-8 fill-current" viewBox="0 0 20 20">
          <path
            d="M10,1.445c-4.726,0-8.555,3.829-8.555,8.555c0,4.725,3.829,8.555,8.555,8.555c4.725,0,8.555-3.83,8.555-8.555C18.555,5.274,14.725,1.445,10,1.445 M10,17.654c-4.221,0-7.654-3.434-7.654-7.654c0-4.221,3.433-7.654,7.654-7.654c4.222,0,7.654,3.433,7.654,7.654C17.654,14.221,14.222,17.654,10,17.654 M14.39,10c0,0.248-0.203,0.45-0.45,0.45H6.06c-0.248,0-0.45-0.203-0.45-0.45s0.203-0.45,0.45-0.45h7.879C14.187,9.55,14.39,9.752,14.39,10 M14.39,12.702c0,0.247-0.203,0.449-0.45,0.449H6.06c-0.248,0-0.45-0.202-0.45-0.449c0-0.248,0.203-0.451,0.45-0.451h7.879C14.187,12.251,14.39,12.454,14.39,12.702 M14.39,7.298c0,0.248-0.203,0.45-0.45,0.45H6.06c-0.248,0-0.45-0.203-0.45-0.45s0.203-0.45,0.45-0.45h7.879C14.187,6.848,14.39,7.051,14.39,7.298"
          ></path>
        </svg>
      </button>
      <ul
        @click="open = false"
        v-show="open"
        class="dropdown-content w-32 mt-px text-sm text-grey-darker leading-normal bg-white border absolute z-20"
      >
        <slot></slot>
      </ul>
    </div>
  </on-click-outside>
</template>

<script>
import OnClickOutside from "./OnClickOutside";

export default {
  name: "dropdown",
  components: {
    OnClickOutside
  },
  data() {
    return {
      open: false
    };
  },
  methods: {
    handleClickOutside() {
      if (this.open) {
        this.open = false;
      }
    }
  }
};
</script>

<style lang="scss">
.dropdown-content {
  right: 8px;

  li {
    &:not(:last-child) {
      border-bottom: 1px solid #e2e8f0;
    }
  }
}
</style>