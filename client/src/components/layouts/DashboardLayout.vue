<template>
  <div class="bg-slate-50 min-h-screen">
    <div class="lg:pl-20 lg:pr-20">
      <app-container>
        <div class="py-20 mt-2">
          <slot />
        </div>
      </app-container>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      links: [],
    };
  },
};
</script>

<style scoped>
.disabled {
  pointer-events: none;
}
</style>
