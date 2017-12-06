import{Component} from '@angular/core';
import{WikipediaService} from './wiki.service';
import {Observable} from 'rxjs/Observable';
@Component({
    selector: 'ngbd-typeahead-http',
    template: `A typeahead example that gets values from the <code>WikipediaService</code>
    <ul>
      <li>remote data retrieval</li>
      <li><code>debounceTime</code> operator</li>
      <li><code>do</code> operator</li>
      <li><code>distinctUntilChanged</code> operator</li>
      <li><code>switchMap</code> operator</li>
      <li><code>catch</code> operator to display an error message in case of connectivity issue</li>
    </ul>
    
    <div class="form-group">
      <label for="typeahead-http">Search for a wiki page:</label>
      <input id="typeahead-http" type="text" class="form-control" [class.is-invalid]="searchFailed" [(ngModel)]="model" [ngbTypeahead]="search" placeholder="Wikipedia search" />
      <span *ngIf="searching">searching...</span>
      <div class="invalid-feedback" *ngIf="searchFailed">Sorry, suggestions could not be loaded.</div>
    </div>
    
    <hr>
    <pre>Model: {{ model | json }}</pre>`,
    providers: [WikipediaService],
    styles: [`.form-control { width: 300px; display: inline; }`]
  })
  export class NgbdTypeaheadHttp {
    model: any;
    searching = false;
    searchFailed = false;
    hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);
  
    constructor(private _service: WikipediaService) {}
  
    search = (text$: Observable<string>) =>
      text$
        .debounceTime(300)
        .distinctUntilChanged()
        .do(() => this.searching = true)
        .switchMap(term =>
          this._service.search(term)
            .do(() => this.searchFailed = false)
            .catch(() => {
              this.searchFailed = true;
              return Observable.of([]);
            }))
        .do(() => this.searching = false)
        .merge(this.hideSearchingWhenUnsubscribed);
  }