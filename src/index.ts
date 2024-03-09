import './scss/styles.scss';
import { cloneTemplate, ensureElement } from './utils/utils';
import { larekAPI } from './components/LarekAPI';
import {
	API_URL,
	CDN_URL,
	Events,
	ButtonText,
	PaymentMethod,
} from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppState, Item } from './components/AppData';
import { Page } from './components/Page';
import { Card } from './components/Card';
import { Modal } from './components/common/Modal';
import { OrderAddress, OrderContacts } from './components/Order';
import { Success } from './components/common/Success';
import { IOrderForm } from './types';
import { Basket } from './components/common/Basket';

const events = new EventEmitter();
const api = new larekAPI(CDN_URL, API_URL);

events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const appData = new AppState({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new OrderAddress(cloneTemplate(orderTemplate), events);
const contacts = new OrderContacts(cloneTemplate(contactsTemplate), events);

events.on(Events.ITEMS_CHANGED, () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit(Events.CARD_SELECT, item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			category: item.category,
			price: item.price,
		});
	});
});

events.on(Events.CONTACTS_SUBMIT, () => {
	appData.order.total = appData.getTotal();
	api
		.orderItems(appData.order)
		.then((result) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			modal.render({
				content: success.render({ total: appData.order.total }),
			});
			appData.clearBasket();
			page.counter = 0;
		})
		.catch((err) => {
			console.error(err);
		});
});

events.on(Events.ORDER_SUBMIT, () => {
	let email = '';
	if (appData.order.email) {
		email = appData.order.email;
	}
	let phone = '';
	if (appData.order.phone) {
		phone = appData.order.phone;
	}
	modal.render({
		content: contacts.render({
			email: email,
			phone: phone,
			valid: false,
			errors: [],
		}),
	});
	if (email && phone) {
		appData.validateOrder();
	}
});

events.on(Events.FORM_ERRORS_CHANGE, (errors: Partial<IOrderForm>) => {
	const { address, payment } = errors;
	order.valid = !address && !payment;
	order.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on(Events.ORDER_CASH, () => {
	appData.order.payment = PaymentMethod.CASH;
	order.payment = PaymentMethod.CASH;
	appData.validateOrder();
});

events.on(Events.ORDER_CARD, () => {
	appData.order.payment = PaymentMethod.CARD;
	order.payment = PaymentMethod.CARD;
	appData.validateOrder();
});

events.on(Events.ORDER_OPEN, () => {
	let payment = '';
	if (appData.order.payment) {
		payment = appData.order.payment;
	}
	let address = '';
	if (appData.order.address) {
		address = appData.order.address;
	}
	modal.render({
		content: order.render({
			payment: payment,
			address: address,
			valid: false,
			errors: [],
		}),
	});
	if (payment && address) {
		appData.validateOrder();
	}
});

events.on(Events.ITEM_REMOVE, (item: Item) => {
	appData.toggleOrderedLot(item.id, false);
	events.emit(Events.BASKET_OPEN);
	page.counter = appData.order.items.length;
});

events.on(Events.BASKET_OPEN, () => {
	const basketItems = appData.catalog.filter((item) =>
		appData.order.items.includes(item.id)
	);
	basket.items = basketItems.map((item) => {
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit(Events.ITEM_REMOVE, item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			count: basketItems.indexOf(item) + 1,
		});
	});
	modal.render({
		content: basket.render({
			total: appData.getTotal(),
		}),
	});
});

events.on(Events.CARD_SELECT, (item: Item) => {
	appData.setPreview(item);
});

events.on(Events.ITEM_ADD, (item: Item) => {
	appData.toggleOrderedLot(item.id, true);
	page.counter = appData.order.items.length;
	modal.close();
});

events.on(Events.PREVIEW_CHANGED, (item: Item) => {
	const showItem = (item: Item) => {
		const card = new Card(cloneTemplate(cardPreviewTemplate), {
			onClick: () => {
				if (appData.order.items.includes(item.id)) {
					events.emit(Events.BASKET_OPEN);
				} else {
					events.emit(Events.ITEM_ADD, item);
				}
			},
		});
		let buttonStatus = ButtonText.BUY;
		if (appData.order.items.includes(item.id)) {
			buttonStatus = ButtonText.ADDED;
		}

		modal.render({
			content: card.render({
				title: item.title,
				image: item.image,
				description: item.description,
				price: item.price,
				category: item.category,
				button: buttonStatus,
			}),
		});
	};
	showItem(item);
});

events.on(Events.MODAL_OPEN, () => {
	page.locked = true;
});

events.on(Events.MODAL_CLOSE, () => {
	page.locked = false;
});

api
	.getItemList()
	.then(appData.setCatalog.bind(appData))

	.catch((err) => {
		console.error(err);
	});
