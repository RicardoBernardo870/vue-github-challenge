import { defineStore } from "pinia";

const useGitHubStore = defineStore({
  id: "github",

  state: () => ({
    languageResults: {},
  }),

  actions: {
    async searchRepositories(language, sort = "stars") {
      const languageSort = `${language}-${sort}`;
      
      if (this.languageResults[languageSort]) {
        return this.languageResults[languageSort];
      }

      const apiUrl = "https://api.github.com/search/repositories";
      const accessToken = "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";

      const perPage = 10;
      const page = 1;

      const url = `${apiUrl}?q=language:${language}&per_page=${perPage}&page=${page}&sort=${sort}`;

      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        this.languageResults[languageSort] = data.items;

        return data.items;
      } catch (error) {
        console.error("Error:", error.message);
      }
    },

    clearState() {
      this.languageResults = {};
    },
  },
});

export default useGitHubStore;
