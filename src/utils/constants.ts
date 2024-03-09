export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {};

export const categoryTegConfig: Record<string, string> = {
	'софт-скил': 'soft',
	'хард-скил': 'hard',
	другое: 'other',
	кнопка: 'button',
	дополнительное: 'additional',
};

export enum ErrorMessage {
	PAYMENT = 'Необходимо выбрать способ оплаты',
	EMAIL = 'Необходимо указать email',
	PHONE = 'Необходимо указать телефон',
	ADDRESS = 'Необходимо указать адрес',
}

export enum Events {
	BASKET_OPEN = 'basket:open',
	CARD_SELECT = 'card:select',
	CONTACTS_SUBMIT = 'contacts:submit',
	FORM_ERRORS_CHANGE = 'formErrors:change',
	ITEM_ADD = 'item:add',
	ITEM_REMOVE = 'item:remove',
	ITEMS_CHANGED = 'items:changed',
	MODAL_CLOSE = 'modal:close',
	MODAL_OPEN = 'modal:open',
	ORDER_CARD = 'order:card',
	ORDER_CASH = 'order:cash',
	ORDER_OPEN = 'order:open',
	ORDER_READY = 'order:ready',
	ORDER_SUBMIT = 'order:submit',
	PREVIEW_CHANGED = 'preview:changed',
}

export enum ButtonText {
	BUY = 'Купить',
	ADDED = 'В корзине',
}

export enum PaymentMethod {
	CASH = 'cash',
	CARD = 'card',
}
