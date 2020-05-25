import {Component, OnInit, Injectable} from '@angular/core';
import {Book} from 'src/app/common/book';
import {BookService} from 'src/app/services/book.service';
import {ActivatedRoute} from '@angular/router';
import {NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';
import {CartService} from '../../services/cart.service';
import {CartItem} from '../../common/cart-item';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-grid.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {

  books: Book[] = [];
  currentCatId = 1;
  searchMode = false;
  previousCategory = 1;

  // properties for server side paging
  currentPage = 1;
  pageSize = 5;
  totalRecords = 0;

  constructor(
    private bookService: BookService,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService,
    private config: NgbPaginationConfig,
    private spinnerService: NgxSpinnerService
  ) {
    config.maxSize = 3;
    config.boundaryLinks = true;
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(() => {
      this.listBooks();
    });
  }

  listBooks() {
    // starts the loader/spinner
    this.spinnerService.show();
    this.searchMode = this.activatedRoute.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchBooks();
    } else {
      this.handleListBooks();
    }
  }

  handleListBooks() {
    const hasCatId: boolean = this.activatedRoute.snapshot.paramMap.has('id');

    if (hasCatId) {
      this.currentCatId = +this.activatedRoute.snapshot.paramMap.get('id');
    } else {
      this.currentCatId = 1;
    }

    // setting up the current page to 1 if user navigates to other cat.
    if (this.previousCategory !== this.currentCatId) {
      this.currentPage = 1;
    }

    this.previousCategory = this.currentCatId;

    this.bookService.getBooks(this.currentCatId, this.currentPage - 1, this.pageSize).subscribe(
      this.processPaginate()
    );
  }

  handleSearchBooks() {
    const keyword: string = this.activatedRoute.snapshot.paramMap.get('keyword');

    this.bookService.searchBooks(keyword, this.currentPage - 1, this.pageSize).subscribe(
      this.processPaginate()
    );
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.currentPage = 1;
    this.listBooks();
  }

  processPaginate() {
    return data => {
      // stops the spinner/loader
      this.spinnerService.hide();
      this.books = data._embedded.books;
      // page number starts from 1 index
      this.currentPage = data.page.number + 1;
      this.totalRecords = data.page.totalElements;
      this.pageSize = data.page.size;
    };
  }

  addToCart(book: Book) {
    console.log(`book name: ${book.name}, and price: ${book.unitPrice}`);
    const cartItem = new CartItem(book);
    this.cartService.addToCart(cartItem);
  }
}
