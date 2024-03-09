import { Form } from './common/Form';
import { IOrderForm } from '../types';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { Events } from '../utils/constants';

export class OrderAddress extends Form<IOrderForm> {
	protected _cash: HTMLButtonElement;
	protected _card: HTMLButtonElement;
	protected _address: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._cash = ensureElement<HTMLButtonElement>(
			'[name="cash"]',
			this.container
		);
		this._card = ensureElement<HTMLButtonElement>(
			'[name="card"]',
			this.container
		);
		this._address = ensureElement<HTMLInputElement>(
			'[name="address"]',
			this.container
		);

		this._cash.addEventListener('click', () => {
			events.emit(Events.ORDER_CASH);
		});

		this._card.addEventListener('click', () => {
			events.emit(Events.ORDER_CARD);
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	set payment(value: string) {
		if (value === 'cash') {
			(
				this.container.elements.namedItem('cash') as HTMLButtonElement
			).classList.add('button_alt-active');
			(
				this.container.elements.namedItem('card') as HTMLButtonElement
			).classList.remove('button_alt-active');
		} else if (value === 'card') {
			(
				this.container.elements.namedItem('card') as HTMLButtonElement
			).classList.add('button_alt-active');
			(
				this.container.elements.namedItem('cash') as HTMLButtonElement
			).classList.remove('button_alt-active');
		} else if (value === '') {
			(
				this.container.elements.namedItem('card') as HTMLButtonElement
			).classList.remove('button_alt-active');
			(
				this.container.elements.namedItem('cash') as HTMLButtonElement
			).classList.remove('button_alt-active');
		}
	}
}

export class OrderContacts extends Form<IOrderForm> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._email = ensureElement<HTMLInputElement>(
			'[name="email"]',
			this.container
		);
		this._phone = container.querySelector('[name="phone"]');
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}
