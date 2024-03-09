import _ from 'lodash';
import { Model } from './base/Model';
import { FormErrors, IItem, IOrder, IOrderForm, IAppState } from '../types';
import { ErrorMessage, Events } from '../utils/constants';

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
		this.catalog = items.map((item) => new Item(item, this.events));
		this.emitChanges(Events.ITEMS_CHANGED, { catalog: this.catalog });
	}

	setPreview(item: Item) {
		this.emitChanges(Events.PREVIEW_CHANGED, item);
	}

	toggleOrderedLot(id: string, isIncluded: boolean) {
		if (isIncluded) {
			this.order.items = _.uniq([...this.order.items, id]);
		} else {
			this.order.items = _.without(this.order.items, id);
		}
	}

	getTotal() {
		return this.order.items.reduce(
			(total, currentId) =>
				total + this.catalog.find((item) => item.id === currentId).price,
			0
		);
	}

	getBasketItems() {
		return this.order.items;
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		if (this.validateOrder()) {
			this.events.emit(Events.ORDER_READY, this.order);
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.payment) {
			errors.payment = ErrorMessage.PAYMENT;
		}
		if (!this.order.email) {
			errors.email = ErrorMessage.EMAIL;
		}
		if (!this.order.phone) {
			errors.phone = ErrorMessage.PHONE;
		}
		if (!this.order.address) {
			errors.address = ErrorMessage.ADDRESS;
		}
		this.formErrors = errors;
		this.events.emit(Events.FORM_ERRORS_CHANGE, this.formErrors);
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
