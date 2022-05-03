<template>
  <dashboard-layout class="px-20">
    <!-- Intro and Loading -->
    <div
      v-if="collection.length < 1 && !isLoading"
      class="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >
      <div v-if="!errorMessage">
        <p class="text-xl font-bold pb-2">Code Challenge for SZNS.io</p>
        <p>
          Submission by Max Sorto (
          <a
            class="underline text-orange-600"
            href="#"
            @click="goToAddress('sorto.eth')"
            >sorto.eth</a
          >
          )
        </p>
        <p class="pt-5">
          Search for an ENS or wallet address in the search bar above and hit
          enter on your keyboard to display and like NFTs owned by this wallet.
        </p>
        <p class="pt-5">
          If an NFT is transferred to another wallet, the like count remains
          associated with that token.
        </p>
      </div>

      <div
        v-if="errorMessage"
        class="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 w-50"
        role="alert"
      >
        <p class="font-bold">Oh oh!</p>
        <p>{{ errorMessage }}</p>
      </div>
    </div>

    <!-- Search Bar -->
    <search-bar />

    <!-- Loading -->
    <div
      v-if="isLoading"
      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >
      <div class="relative flex justify-center items-center h-20">
        <div
          class="rounded animate-spin ease duration-300 w-5 h-5 border-2 border-black"
        ></div>
      </div>
    </div>

    <div v-else>
      <!-- Header -->
      <div
        v-show="collection.length > 0"
        class="flex justify-between items-center mb-8 mt-10"
      >
        <h1 v-if="walletAddress" class="text-slate-600 font-bold text-3xl">
          NFT Collection ({{ collection.length }} items total)
        </h1>
        <div class="relative">
          <input
            v-model="filter"
            type="text"
            placeholder="Filter"
            class="rounded-xl pl-4 pr-7 py-2 focus:outline-none border ring-orange-500 ring-opacity-25 focus:border-orange-500 focus:ring-4 appearance-none placeholder-slate-400 text-slate-500"
            :class="{
              'ring-4 border-orange-500': filter !== '',
            }"
          />
          <a
            v-show="filter !== ''"
            class="absolute right-0 top-0 h-full flex items-center pl-2 pr-3 text-slate-500 hover:text-orange-500 cursor-pointer"
            @click="filter = ''"
          >
            <font-awesome-icon icon="close" />
          </a>
        </div>
      </div>

      <!-- Gallery -->
      <div class="grid grid-cols-4 gap-20">
        <div
          v-for="nft in filteredCollection"
          :key="nft.id"
          class="max-w-sm rounded-lg shadow-md shadow-lg bg-slate-200"
        >
          <div
            v-if="
              !nft.metadata.animation_url ||
              getUrlData(nft.metadata).includes('gif')
            "
            class="max-h-full"
          >
            <section class="hero container max-h-screen-lg mx-auto pb-1 flex">
              <img
                class="object-cover w-full h-48"
                :src="getUrlData(nft.metadata)"
                :alt="nft.title"
              />
            </section>
          </div>
          <div v-else>
            <video
              ref="videoPlayer"
              :poster="getUrlData(nft.metadata)"
              class="object-cover w-full h-48"
            >
              <source
                :src="getUrlData(nft.metadata)"
                type="video/mp4"
                autoplay
              />
              Your browser does not support the video tag.
            </video>
          </div>
          <div class="px-6 py-4 w-50">
            <p class="font-bold overflow-hidden truncate w-50">
              {{ nft.title }}
            </p>
            <text-with-tooltip class="ml-1 underline">
              <div class="text-xs mb-2">more info</div>
              <template #tooltip>
                <p>{{ nft.description || 'N/A' }}</p>
              </template>
            </text-with-tooltip>
          </div>
          <div class="px-6 py-1">
            <button
              class="h-10 px-5 mb-4 text-indigo-100 transition-colors duration-150 bg-orange-600 rounded-lg focus:shadow-outline hover:bg-indigo-500"
              @click="likeNFT(nft)"
            >
              <span class="mr-2">Like</span>
              <span
                class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-black bg-white rounded-full"
                >{{ nft.likes || 0 }}</span
              >
            </button>
          </div>
        </div>
      </div>
    </div>
  </dashboard-layout>
</template>

<script>
export default {
  data() {
    return {
      walletAddress: '',
      collection: [],
      filteredCollection: [],
      filter: '',
      isLoading: false,
      errorMessage: '',
    };
  },
  computed: {},

  watch: {
    filter: function () {
      this.filteredCollection = this.collection.filter((value) => {
        const searchStr = this.filter.toLowerCase();
        const titleMatches = value.title.toLowerCase().includes(searchStr);

        return titleMatches;
      });
    },
  },

  created() {
    this.emitter.on('begin-search', (input) => {
      // Clear existing collection displayed and filter.
      this.collection = [];
      this.filteredCollection = [];

      // If input includes substring .eth, check if it resolves into a wallet address.
      if (input.includes('.eth')) {
        this.resolveENS(input)
          .then((res) => {
            if (res) {
              this.walletAddress = res;
              this.getNFTs()
                .then(() => {})
                .catch((err) => console.error);
            } else {
              this.errorMessage = 'Wallet not found for ENS.';
            }
          })
          .catch((err) => console.error);
      }

      // If input passes regex for 0x eth address, attempt search.
      if (/^0x[a-fA-F0-9]{40}$/.test(input)) {
        this.walletAddress = input;

        this.getNFTs()
          .then(() => {})
          .catch((err) => console.error);
      } else {
        this.errorMessage = 'Please enter a valid wallet address or ENS name.';
      }
    });

    this.emitter.on('clear-collection', (input) => {
      this.errorMessage = '';
      this.collection = [];
      this.filteredCollection = [];
    });
  },

  async mounted() {},

  methods: {
    callAPI(method, endpoint, postBody, headerData) {
      this.isLoading = true;
      return new Promise((resolve, reject) => {
        const API_URL = document.location.href;
        const headers = {
          headers: headerData || {
            'Content-Type': 'application/json; charset=utf-8',
          },
        };

        this.$http[method](
          `${API_URL.split('#')[0]}${endpoint}`,
          postBody,
          headers
        )
          .then((res) => {
            this.$store.state.videos.isLoading = false;
            if (res.status === 200) {
              this.isLoading = false;
              resolve(res);
            } else {
              this.isLoading = false;
              console.log('err 1');
              reject(res);
            }
          })
          .catch((err) => {
            this.isLoading = false;
            this.$store.state.videos.isLoading = false;
            reject(err);
          });
      });
    },
    resolveENS(input) {
      return new Promise((resolve, reject) => {
        this.callAPI('get', `api/resolveENS?wallet=${input}`)
          .then(async (res) => {
            resolve(res.data.address);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getNFTs() {
      return new Promise((resolve, reject) => {
        this.callAPI('get', `api/getNFTs?wallet=${this.walletAddress}`)
          .then(async (res) => {
            // filter out any objects without a title
            this.collection = res.data.ownedNfts.filter((nft) => nft.title);

            if (res.data.ownedNfts.length < 1) {
              this.errorMessage = 'This wallet has no NFTs. Try another one.';
            }

            // apply current search filter
            this.filteredCollection = this.collection.filter((value) => {
              const searchStr = this.filter.toLowerCase();
              const titleMatches = value.title
                .toLowerCase()
                .includes(searchStr);

              return titleMatches;
            });
          })
          .catch((err) => {
            console.log(err.data);
            if (err.message) {
              console.error(err.message);
            }
          });
      });
    },
    getUrlData(data) {
      if (data.image && data.image.includes('ipfs://')) {
        return `https://ipfs.io/ipfs/${data.image.split('ipfs://')[1]}`;
      }

      if (data.image_url) {
        return data.image_url;
      }

      if (data.animation_url && data.animation_url.includes('ipfs://')) {
        return `https://ipfs.io/ipfs/${data.animation_url.split('ipfs://')[1]}`;
      }

      if (!data.image) {
        // we made it here then use a placeholder image.
        return 'https://www.wolflair.com/wp-content/uploads/2017/01/placeholder.jpg';
      }

      return data.image;
    },
    likeNFT(nft) {
      return new Promise((resolve, reject) => {
        this.callAPI('post', 'api/likeNFT', {
          id: nft.id.tokenId + nft.contract.address,
          token: nft.id.tokenId,
          contract: nft.contract.address,
          wallet: this.walletAddress,
        })
          .then(async (res) => {
            nft.likes += 1;
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    goToAddress() {
      this.walletAddress = 'sorto.eth';
      this.emitter.emit('goto-address', this.walletAddress);
      this.emitter.emit('begin-search', this.walletAddress);
    },
  },
};
</script>
