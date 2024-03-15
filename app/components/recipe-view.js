import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class RecipeViewComponent extends Component {
  @tracked isExpanded = false;
  @tracked isFavorite = false;
  @service recipeData;

  constructor() {
    super(...arguments);
    this.isFavorite = this.checkFavorite();
  }
  checkFavorite() {
    return this.recipeData.isFavorite(this.args.id);
  }

  @action
  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  get isFavorite() {
    return this.checkFavorite();
  }

  @action
  toggleFavorite(event) {
    event.stopPropagation();
    this.isFavorite = !this.isFavorite;
    this.recipeData.toggleFavorite(this.args.id, this.isFavorite);
  }

  @action
  buttonTog(event) {
    event.stopPropagation();
  }
  @action
  async deleteRecipe() {
    console.log('controller', this.args.id);
    await this.recipeData.deleteRecipe(this.args.id);
  }
}
