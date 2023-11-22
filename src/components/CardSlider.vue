<script setup>
import { onMounted, computed, ref } from 'vue'
import lazyLoading from '../assets/iconmonstr-github-1.svg'
import arrowRight from '../assets/iconmonstr-arrow-63.svg'
import arrowLeft from '../assets/iconmonstr-arrow-64.svg'


const props = defineProps({
  language: {
    type: String,
    required: true
  },
  results: {
    type: Array,
    required: true
  },
  bookmarkMode: {
    type: Boolean,
    required: false
  }
})

const emits = defineEmits(['select', 'bookmarkSelection'])

const isLoading = ref(true)
const sortOptions = [
  { name: 'Sort by stars', id: 'stars' },
  { name: 'Sort by forks', id: 'forks' },
  { name: 'Sort by help wanted issues', id: 'help-wanted-issues' },
  { name: 'Sort by updated', id: 'updated' }
]
const menuOpen = ref(false)

const openNewTab = (item) => {
  window.open(item.html_url, '_blank')
}

const openMenu = () => {
  menuOpen.value = !menuOpen.value
}

const clickOutside = () => {
  menuOpen.value = false
}

const bookmarkSelection = (item) => {
  emits('bookmarkSelection', item)
}

const repositoryImage = (ownerId) => {
  return `https://opengraph.githubassets.com/${ownerId}/facebook/react`
}

const selectedOption = (item) => {
  emits('select', item, props.language)
}

const returnItems = computed(() => {
  const mock = [1, 2, 3, 4, 5, 6]
  if (!props.bookmarkMode) {
    return props.results.length > 0 ? props.results : mock
  }
  return props.results
})

onMounted(() => {
  if (props.bookmarkMode) {
    isLoading.value = false
  }
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})
</script>

<template>
  <div class="mt-3 title-container">
    <div v-if="!bookmarkMode" class="d-flex">
      <h2>Top {{ props.language }}</h2>

      <v-btn v-click-outside="clickOutside" @click="openMenu" class="ml-2" flat
        ><img style="transform: rotate(-90deg)" :src="arrowLeft" />
      </v-btn>

      <v-card v-if="menuOpen" class="sub-menu" max-width="300">
        <v-list
          @click:select="selectedOption"
          :items="sortOptions"
          item-title="name"
          item-value="id"
        ></v-list>
      </v-card>
    </div>
    <div v-else class="d-flex">
      <h2>My Bookmarks</h2>
    </div>

    <v-slide-group class="pa-4" selected-class="bg-success" show-arrows>
      <template v-slot:next>
        <img :src="arrowRight" />
      </template>
      <template v-slot:prev>
        <img :src="arrowLeft" />
      </template>

      <v-slide-group-item v-for="item in returnItems" :key="item.id">
        <v-card
          v-if="!isLoading && props.results.length > 0"
          color="white"
          class="ma-4 card-hover"
          height="200"
          width="200"
          @click="openNewTab(item)"
          :ripple="false"
        >
          <div class="d-flex align-center justify-center">
            <v-img
              :width="200"
              :height="200"
              aspect-ratio="4/5"
              :lazy-src="lazyLoading"
              cover
              :src="repositoryImage(item.owner.id)"
              class="bookmark-position"
            >
            <v-card-subtitle>{{item.name}}</v-card-subtitle>
              <v-btn @click.stop="bookmarkSelection(item)" flat icon :ripple="false">
                <slot name="icon" :item="item"></slot>
              </v-btn>
            </v-img>
          </div>
        </v-card>

        <v-skeleton-loader
          v-else
          type="image"
          :height="200"
          :width="200"
          class="mr-10"
        ></v-skeleton-loader>
      </v-slide-group-item>
    </v-slide-group>
    <div class="no-match-found" v-if="props.bookmarkMode && props.results.length === 0">
      <span>Add Bookmarks</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card-hover {
  transition: all 0.2s ease-in-out;
  &:hover {
    transform: scale(1.1);
  }
}
.sub-menu {
  position: absolute;
  z-index: 1000;
  left: 13.125rem;
  top: 1.875rem;
}
.title-container {
  position: relative;
}
.no-match-found {
  width: 100%;
  height: 11.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    font-size: 1.5rem;
    font-weight: 500;
    color: #000;
  }
}

.bookmark-position {
  position: relative;
  button {
    position: absolute;
    top: 0rem;
    right: 0.3125rem;
    background: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    z-index: 1000;
  }
}
</style>
