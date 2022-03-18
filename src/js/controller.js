// import 'core-js/stable';
// import 'regenerator-runtime/runtime.js';

import * as model from './model.js';
import receipeView from './views/receipeView.js';
import resultView from './views/resultView.js';
import searchView from './views/searchView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addReceipeView from './views/addReceipeView.js';
import { MODEL_CLOSE_SEC } from './config.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// npm i --save-dev parcel
//  npm i core-js regenerator-runtime for polyfilling all and regenrator for async await to run in all browsers.

const controlRecipes = async function () {
  try {
    const hashedId = window.location.hash.slice(1); // gets the url's hashed Id
    if (!hashedId) return;
    receipeView.renderSpinner();

    //0. search results active class add
    resultView.update(model.getPagePerResults());
    bookmarkView.update(model.state.bookmarks);

    // 1. Fetching Recipe From API
    await model.loadRecipe(hashedId);

    // 2. Rendering Receipe in the UI
    receipeView.render(model.state.recipe);
  } catch (error) {
    receipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    // get search query
    const query = searchView.getQuery();
    if (!query) return;
    resultView.renderSpinner();
    // load query
    await model.loadSearch(query);

    // render result
    resultView.render(model.getPagePerResults());
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function (gotTopage) {
  resultView.render(model.getPagePerResults(gotTopage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  // receipeView.render(model.state.recipe);
  // not making dom reload so using another function instead of render
  receipeView.update(model.state.recipe);
};

const controlAddbookmark = function () {
  // add and remove the bookmark in details container button and data object of model
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  // without reRendering DOM display result
  receipeView.update(model.state.recipe);

  // show bookmark in bookmark navigation
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmark = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addReceipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    receipeView.render(model.state.recipe);

    // Success message
    addReceipeView.renderMessage();

    // Render bookmark view
    bookmarkView.render(model.state.bookmarks);

    // change url without reload
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(() => {
      addReceipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error(error);
    addReceipeView.renderError(error.message);
  }
};

const init = function () {
  receipeView.addHandlerRender(controlRecipes);
  receipeView.addHandlerUpdateServings(controlServings);
  receipeView.addHandlerAddBookmark(controlAddbookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandleClickPagination(controlPagination);
  bookmarkView.addHandlerRender(controlBookmark);
  addReceipeView.addHandlerUpload(controlAddRecipe);
};

init();
