import { Injectable }from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Hero }        from './hero';
import { HeroService } from './hero.service';

const cudOptions = { headers: new Headers({ 'Content-Type': 'application/json' })};

@Injectable()
export class HttpHeroService extends HeroService {

  constructor (private http: Http) {
    super();
  }

  getHeroes (): Observable<Hero[]> {
    return this.http.get(this.heroesUrl)
      .map(this.extractData)
   // .do(data => console.log(data)) // eyeball results in the console
      .catch(this.handleError);
  }

  // This get-by-id will 404 when id not found
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get(url)
      .map((r: Response) => r.json().data as Hero)
      .catch(this.handleError);
  }

  // This get-by-id does not 404; returns undefined when id not found
  // getHero(id: number) {
  //   const url = `${this._heroesUrl}/?id=${id}`;
  //   return this.http
  //     .get(url)
  //     .map((r: Response) => r.json().data[0] as Hero);
  //     .catch(this.handleError);
  // }

  addHero (name: string): Observable<Hero> {
    const hero = { name };

    return this.http.post(this.heroesUrl, hero, cudOptions)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteHero (hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete(url, cudOptions)
      .catch(this.handleError);
  }

  updateHero (hero: Hero): Observable<Hero> {
    return this.http.put(this.heroesUrl, hero, cudOptions)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    const body = res.json();
    return (body && body.data) || { };
  }

  private handleError (error: any) {
    // In a real world app, we might send the error to remote logging infrastructure
    // and reformat for user consumption
    console.error(error); // log to console instead
    return Observable.throw(error);
  }
}
