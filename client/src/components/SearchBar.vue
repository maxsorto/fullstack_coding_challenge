<template>
  <div
    class="fixed z-10 left-0 top-0 w-full flex items-center justify-center py-3"
  >
    <div
      class="bg-gradient-to-b relative from-white to-slate-100 shadow-widget text-slate-400 border-2 border-white p-3 rounded-2xl flex items-center space-x-3 w-full max-w-lg"
    >
      <input
        v-model="input"
        type="text"
        placeholder="Enter wallet address or ENS..."
        class="w-full rounded-xl pl-4 pr-7 py-2 focus:outline-none border ring-orange-500 ring-opacity-25 focus:border-orange-500 focus:ring-4 appearance-none placeholder-slate-400 text-slate-500"
        :class="{
          'ring-4 border-orange-500': input !== '',
        }"
        @keyup.enter="triggerSearch"
      />
      <a
        v-show="input !== ''"
        class="absolute right-3 top-0 h-full flex items-center pl-2 pr-3 text-slate-500 hover:text-orange-500 cursor-pointer"
        @click="clearCollection"
      >
        <font-awesome-icon icon="close" />
      </a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: '',
    };
  },
  created() {
    this.emitter.on('goto-address', (input) => {
      this.input = input;
    });
  },

  methods: {
    triggerSearch() {
      this.emitter.emit('begin-search', this.input);
    },
    clearCollection() {
      this.input = '';
      this.emitter.emit('clear-collection');
    },
  },
};
</script>
