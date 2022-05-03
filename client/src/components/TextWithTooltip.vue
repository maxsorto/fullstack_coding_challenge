<template>
  <div
    class="relative inline-block cursor-pointer"
    @mouseenter="tooltip = !tooltip"
    @mouseleave="tooltip = !tooltip"
  >
    <slot />

    <div
      v-if="tooltip"
      class="absolute z-10 border-white border-2 bg-slate-100 p-5 rounded-2xl bottom-full overflow-hidden w-max max-w-xs"
    >
      <slot name="tooltip" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tooltip: false,
    };
  },
};
</script>
