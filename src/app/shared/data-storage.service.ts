import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './../auth/auth.service';
import { Recipe } from './../recipes/recipe.model';
import { RecipeService } from './../recipes/recipe.service';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';


@Injectable()
export class DataStorageService {
    constructor(private httpClient: HttpClient, private recipeService: RecipeService, private authService: AuthService) { }

    getRecipes() {
        const token = this.authService.getToken()
        // this.httpClient.get<Recipe[]>('https://ng-recipe-book-33bed.firebaseio.com/recipes.json')
        this.httpClient.get<Recipe[]>('https://ng-recipe-book-33bed.firebaseio.com/recipes.json', {
            observe: 'body',
            responseType: 'json',
            params: new HttpParams().set('auth', token)
        })
            .pipe(map((recipes) => {
                for (let recipe of recipes) {
                    if (!recipe.ingredients) {
                        console.log(recipe)
                        recipe.ingredients = [];
                    }
                }
                return recipes;
            }))
            .subscribe((recipes: Recipe[]) => {

                this.recipeService.setRecipes(recipes);
            });
    }

    storeRecipes() {
        const token = this.authService.getToken()
        return this.httpClient.put('https://ng-recipe-book-33bed.firebaseio.com/recipes.json',
            this.recipeService.getRecipes(), {
                observe: 'body',
                params: new HttpParams().set('auth', token)
            });
    }
}
