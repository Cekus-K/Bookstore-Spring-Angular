import {Component, OnInit, Injectable} from '@angular/core';
import {Book} from 'src/app/common/book';
import {BookService} from 'src/app/services/book.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-grid.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {

  books: Book[];
  currentCatId: number;

  constructor(
    private bookService: BookService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(() => {
      this.listBooks();
    });
  }

  listBooks() {
    const hasCatId: boolean = this.activatedRoute.snapshot.paramMap.has('id');

    if (hasCatId) {
      this.currentCatId = +this.activatedRoute.snapshot.paramMap.get('id');
    } else {
      this.currentCatId = 1;
    }

    this.bookService.getBooks(this.currentCatId).subscribe(
      data => this.books = data
    );
  }

}
