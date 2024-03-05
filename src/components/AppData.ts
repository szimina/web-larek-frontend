import _ from "lodash";
import {Model} from "./base/Model";
import {FormErrors, IItem, IOrder, IOrderForm, IAppState} from "../types";

export type CatalogChangeEvent = {
  catalog: IItem[]
};

export class Item extends Model<IItem> {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}

export class AppState extends Model<IAppState> {
  catalog: Item[];
  order: IOrder = {
    email: '',
    phone: '',
    address: '',
    payment: '',
    items: [],
    total: 0,
  };
  formErrors: FormErrors = {};

  setCatalog(items: IItem[]) {
    this.catalog = items.map(item => new Item(item, this.events));
    this.emitChanges('items:changed', { catalog: this.catalog });
  }

  setPreview(item: Item) {
      this.emitChanges('preview:changed', item);
  }

  toggleOrderedLot(id: string, isIncluded: boolean) {
    if (isIncluded) {
        this.order.items = _.uniq([...this.order.items, id]);
    } else {
        this.order.items = _.without(this.order.items, id);
    }
  }

  getTotal() {
    return this.order.items.reduce((a, c) => a + this.catalog.find(it => it.id === c).price, 0)
  }
  
  getBasketItems(){
    return this.order.items
  }
  
  setOrderField(field: keyof IOrderForm, value: string) {
    this.order[field] = value;
    
    if (this.validateOrder()) {
      this.events.emit('order:ready', this.order);
    }
  }
  
  validateOrder() {
    const errors: typeof this.formErrors = {};
    if (!this.order.payment) {
      errors.payment = 'Необходимо выбрать способ оплаты';
    }    
    if (!this.order.email) {
      errors.email = 'Необходимо указать email';
    }
    if (!this.order.phone) {
      errors.phone = 'Необходимо указать телефон';
    }
    if (!this.order.address) {
      errors.address = 'Необходимо указать адрес';
    }
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  clearBasket() {
    this.order = {
      email: '',
      phone: '',
      address: '',
      payment: '',
      items: [],
      total: 0,
    };
  }
}