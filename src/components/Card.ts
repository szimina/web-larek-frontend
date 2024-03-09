import { Component } from './base/Component';
import { formatNumber } from '../utils/utils';
import { categoryTegConfig } from '../utils/constants';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
	image?: string;
	category?: string;
	title: string;
	description?: string;
	price?: number | null;
	button: string;
	count?: number;
}

export class Card<T> extends Component<ICard<T>> {
	protected _image?: HTMLImageElement;
	protected _category?: HTMLElement;
	protected _title: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _description?: HTMLElement;
	protected _price?: HTMLElement;
	protected _count?: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);
		this._image = container.querySelector('.card__image');
		this._category = container.querySelector('.card__category');
		this._title = container.querySelector('.card__title');
		this._button = container.querySelector('.button');
		this._description = container.querySelector('.card__text');
		this._price = container.querySelector('.card__price');
		this._count = container.querySelector('.basket__item-index');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set category(value: string) {
		this.setText(this._category, value);
		this._category.classList.remove('card__category_other');
		this._category.classList.add(`card__category_${categoryTegConfig[value]}`);
	}

	get category(): string {
		return this._category.textContent || '';
	}

	set price(value: string) {
		if (value === null) {
			this.setText(this._price, 'Бесценно');
			this.setDisabled(this._button, true);
		} else if (Number(value) > 9999) {
			this.setText(this._price, `${formatNumber(Number(value), ' ')} синапсов`);
		} else {
			this.setText(this._price, `${value} синапсов`);
		}
	}

	get price(): string {
		return this._price.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set button(value: string) {
		this.setText(this._button, value);
	}

	set count(value: number) {
		this.setText(this._count, value);
	}
}
