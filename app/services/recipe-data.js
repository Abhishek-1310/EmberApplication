import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class RecipeDataService extends Service {
  @service store;

  async loadRecipes() {
    let response = await fetch('/apis/rescipes.json');
    let data = await response.json();
    let storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];

    const addRecipeToStore = (recipe) => {
      let existRecipe = this.store.peekRecord('recipe', recipe.id);

      if (!existRecipe) {
        return this.store.createRecord('recipe', {
          id: recipe.id,
          title: recipe.title,
          description: recipe.description,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
        });
      }
      // return existRecipe;
    };

    storedRecipes.forEach(addRecipeToStore);
    return data.recipes.map(addRecipeToStore);
  }

  async saveRecipe(recipe) {
    let storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    storedRecipes.push(recipe);
    localStorage.setItem('recipes', JSON.stringify(storedRecipes));
  }

  async deleteRecipe(recipeId) {
    // console.log('deleting id', recipeId);
    const recipe = await this.store.findRecord('recipe', recipeId, {
      backgroundReload: false,
    });
    console.log(recipe);
    await recipe.destroyRecord();
    //
    // const recipe = await this.store.findRecord('recipe', recipeId, {
    //   backgroundReload: false,
    // });
    //
    // await this.store.unloadRecord(recipe);
    // await localStorage.removeItem(recipe);
    //
    // let storedRecipes1 = JSON.parse(localStorage.getItem('recipes')) || [];
    // storedRecipes1.removeItem(recipeId);
    // localStorage.setItem('recipes', JSON.stringify(storedRecipes1));
  }

  generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
  getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
  }

  isFavorite(recipeId) {
    let favorites = this.getFavorites();
    return favorites.includes(recipeId);
  }
  toggleFavorite(recipeId, isFavorite) {
    let favorites = this.getFavorites();
    if (isFavorite) {
      if (!favorites.includes(recipeId)) {
        favorites.push(recipeId);
      }
    } else {
      favorites = favorites.filter((id) => id !== recipeId);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
}
