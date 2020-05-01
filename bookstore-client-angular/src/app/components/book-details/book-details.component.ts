import {Component, OnInit} from '@angular/core';
import {Book} from '../../common/book';
import {ActivatedRoute} from '@angular/router';
import {BookService} from '../../services/book.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {

  book: Book = new Book();

  constructor(
    private activatedRoute: ActivatedRoute,
    private bookService: BookService) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(
      () => {
        this.getBookInfo();
      }
    );
  }

  getBookInfo() {
    const id: number = +this.activatedRoute.snapshot.paramMap.get('id');
    this.bookService.get(id).subscribe(
      data => this.book = data
    );
  }

}
