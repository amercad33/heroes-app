import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, debounceTime, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styles: [
  ]
})
export class SearchPageComponent implements OnInit {

  public searchInput = new FormControl('');
  public heroes: Observable<Hero[]> = of([]);
  public selectedHero?: Hero;
  public heroesLength: boolean = false;

  constructor(private heroesService: HeroesService) { }

  ngOnInit(): void {
    this.heroes = this.searchHero();
  }

  searchHero(): Observable<Hero[]> {
    return this.searchInput.valueChanges
      .pipe(
        debounceTime(500),
        switchMap(value => this.heroesService.getSuggestions(value || '')),
        tap(heroes =>
          (heroes.length === 0)
          ? this.heroesLength = true
          : this.heroesLength = false
        )
      );
  }

  onSelectedOption(event: MatAutocompleteSelectedEvent): void {

    if (!event.option.value) {
      this.selectedHero = undefined;
      return;
    }

    const hero: Hero = event.option.value;
    this.searchInput.setValue(hero.superhero);
    this.selectedHero = hero;

  }

}
