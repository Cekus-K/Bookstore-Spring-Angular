import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from '../common/book';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private baseUrl = 'http://localhost:8080/api/v1/books';

  constructor(private httpClient: HttpClient) { }

  getBooks(catId: number): Observable<Book[]> {
    const searchUrl = `${this.baseUrl}/search/categoryid?id=${catId}`;
    return this.httpClient.get<GetResponseBooks>(searchUrl).pipe(
      map(response => response._embedded.books)
    );
  }
}

interface GetResponseBooks {
  _embedded: {
    books: Book[];
  };
}
