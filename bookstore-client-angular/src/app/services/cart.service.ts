import {Injectable} from '@angular/core';
import {CartItem} from '../common/cart-item';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() {
  }
  // check whether book/item is already in the cart
  addToCart(theCartItem: CartItem) {
    let alreadyExistInCart = false;
    let existingCartItem: CartItem;

    if (this.cartItems.length > 0) {
      // find the book/item in the cart based on id
      existingCartItem = this.cartItems.find(tempCarItem => tempCarItem.id === theCartItem.id);
      alreadyExistInCart = (existingCartItem !== undefined);
    }

    if (alreadyExistInCart) {
      // increment the quantity
      existingCartItem.quantity++;
    } else {
      // add to the cart item array
      this.cartItems.push(theCartItem);
    }

    this.calculateTotalPriceAndQuantity();
  }

  calculateTotalPriceAndQuantity() {
    let totalPriceValue = 0;
    let totalQuantityValue = 0;

    // calculate total price and total quantity
    for (const currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    console.log(`total price: ${totalPriceValue}, total quantity: ${totalQuantityValue}`);

    // publish the events
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
  }
}
