import 'regenerator-runtime/runtime.js';
import { API_URL, KEY, RES_PER_PAGE } from './config.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    // short Curcutitng
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (hashedId) {
  try {
    const data = await AJAX(`${API_URL}${hashedId}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    state.bookmarks.some((bookmark) => bookmark.id === hashedId)
      ? (state.recipe.bookmarked = true)
      : (state.recipe.bookmarked = false);
  } catch (error) {
    throw error;
  }
};

export const loadSearch = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        image: rec.image_url,
        publisher: rec.publisher,
        title: rec.title,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (error) {
    // throw error;
    console.log(error);
  }
};

export const getPagePerResults = function (page = state.search.page) {
  state.search.page = page;
  const first = (page - 1) * state.search.resultsPerPage;
  const last = state.search.resultsPerPage * page;
  return state.search.results.slice(first, last);
};

export const updateServings = function (newServings) {
  console.log(state.recipe.ingredients);
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const addBookmarkLocalStorageAPI = function () {
  localStorage.setItem('bookmark', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  addBookmarkLocalStorageAPI();
};

export const removeBookmark = function (id) {
  const index = state.bookmarks.findIndex((el) => (el.id = id));
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  addBookmarkLocalStorageAPI();
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map((ing) => {
        const ingArr = ing[1].split(',').map((el) => el.trim());
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient fromat! Please use the correct format :)'
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};

const init = function () {
  const storageData = localStorage.getItem('bookmark');
  if (storageData) state.bookmarks = JSON.parse(storageData);
};

init();

//
