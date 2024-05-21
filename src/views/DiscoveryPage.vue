<script setup>
  import HeaderComponent from "../components/HeaderComponent.vue";
  import Cardslider from "../components/CardSlider.vue";
  import useGitHubStore from "../store/github";
  import useFireBaseStore from "../store/firestore";
  import { ref, watch, onMounted } from "vue";
  import favourites from "../assets/favourites.svg";
  import favouritesSelected from "../assets/favourites-selected.svg";
  import InlineSvg from "vue-inline-svg";

  const gitHubStore = useGitHubStore();
  const firebaseStore = useFireBaseStore();

  const filterOptions = ref([
    "Javascript",
    "Vue",
    "Typescript",
    "Go",
    "CSS",
    "Node",
  ]);
  const filterSelection = ref([]);
  const bookmarks = ref([]);
  const loading = ref(false);

  const languageResults = ref({});

  const selectedSort = async (item, language) => {
    languageResults.value[language] = [];
    await requestRepos(language, item.id, "onAdd");
  };

  const requestRepos = async (language, sort, state) => {
    try {
      if (state === "onAdd") {
        await firebaseStore.addStorageItems(language, sort);
      }

      const data = await gitHubStore.searchRepositories(language, sort);

      languageResults.value[language] = data;
    } catch (error) {
      console.error(error);
    }
  };

  const bookmarkSelection = async (bookmark) => {
    if (!bookmarks.value.find((item) => item.id === bookmark.id)) {
      bookmarks.value.push(bookmark);

      await firebaseStore.addBookMarks(bookmark);
    } else {

      bookmarks.value = bookmarks.value.filter(
        (item) => item.id !== bookmark.id
      );

      await firebaseStore.removeBookMarks(bookmark);
    }
  };

  const filterResults = (language) => {
    return languageResults.value[language] || [];
  };

  const fetchFirebaseData = async () => {
    try {
      loading.value = true;

      await firebaseStore.fetchItems();

      const { repos, bookmarks } = firebaseStore;

      populateRepos(repos);
      populateBookmarks(bookmarks);

      loading.value = false;
    } catch (err) {
      console.error(err);
    }
  };

  const populateRepos = (repos) => {
    if (repos.length > 0) {
      repos.forEach((item) => {
        requestRepos(item.language, item.sort, null);
        filterSelection.value.push(item.language);
      });
    }
  };

  const populateBookmarks = (bookmarkList) => {
    if (bookmarkList.length > 0) {
      bookmarks.value = bookmarkList;
    }
  };

  watch(
    () => filterSelection.value,
    async (newSelection, oldSelection) => {
      const newlySelectedLanguage = newSelection.find(
        (language) => !oldSelection.includes(language)
      );

      oldSelection.forEach(async (prevItem) => {

        if (!newSelection.includes(prevItem)) {
          await firebaseStore.removeStorageItems(prevItem);

          delete languageResults.value[prevItem];
        }
      });

      if (newlySelectedLanguage) {
        await requestRepos(newlySelectedLanguage, undefined, "onAdd");
      }
    }
  );

  onMounted(async () => {
    await fetchFirebaseData();
  });
</script>

<template>
  <div>
    <HeaderComponent/>

    <div class="pa-5">
      <Cardslider
        v-if="!loading"
        :language="selected"
        :results="bookmarks"
        :bookmarkMode="true"
        @bookmarkSelection="bookmarkSelection"
      >
        <template #icon="{ item }">
          <inline-svg
            v-if="bookmarks.includes(item)"
            :src="favourites"
            fill="#FFE900"
            aria-label="My image"
          />
          <inline-svg
            v-else
            :src="favouritesSelected"
            fill="black"
            aria-label="My image"
          />
        </template>
      </Cardslider>

      <div v-if="!loading">
        <h4>Toggle topics to show</h4>~
        
        <v-chip-group v-model="filterSelection" multiple>
          <v-chip v-for="option in filterOptions" :key="option" :value="option">
            {{ option }}
          </v-chip>
        </v-chip-group>
      </div>

      <div v-if="!loading">
        <Cardslider
          v-for="selected in filterSelection"
          :key="selected"
          :language="selected"
          :results="filterResults(selected)"
          @select="selectedSort"
          @bookmarkSelection="bookmarkSelection"
        >
          <template #icon="{ item }">
            <inline-svg
              v-if="bookmarks.some((bookmark) => bookmark.id === item.id)"
              :src="favourites"
              fill="#FFE900"
            />
            <inline-svg v-else :src="favouritesSelected" fill="black" />
          </template>
        </Cardslider>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
