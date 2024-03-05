import './scss/styles.scss';
import { cloneTemplate, ensureElement } from './utils/utils';
import { larekAPI } from './components/LarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppState, CatalogChangeEvent, Item } from './components/AppData';
import { Page } from './components/Page';
import { Card } from './components/Card';
import { Modal } from './components/common/Modal';
import { OrderAddress, OrderContacts } from './components/Order';
import { Success } from './components/common/Success';
import { IOrderForm } from './types';
import { Basket } from './components/common/Basket';

const events = new EventEmitter();
const api = new larekAPI(CDN_URL, API_URL);


// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Все шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);

const order = new OrderAddress(cloneTemplate(orderTemplate), events)
const contacts = new OrderContacts(cloneTemplate(contactsTemplate), events);


// Отобразили карточки 
events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
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

// // Отправлена форма контактов
events.on('contacts:submit', () => {
	appData.order.total = appData.getTotal()
	console.log(appData.order)
	api
		.orderItems(appData.order)
		.then((result) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
					appData.clearBasket();
					page.counter = 0;
				},
			});

			modal.render({
				content: success.render({total: appData.order.total}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

//перешли со страницы заказа
events.on('order:submit', () => {
	let email = '';
  if (appData.order.email) {
		email = appData.order.email
  }
	let phone = '';
  if (appData.order.phone) {
		phone = appData.order.phone
  }
  modal.render({
		content: contacts.render({
      email: email,
      phone: phone,
			valid: false,
			errors: [],
		}),
	});
})

// Изменилось состояние валидации формы Order
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
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

// Изменилось одно из полей в форме контактов
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Изменилось одно из полей в форме заказа
events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on('order:cash', () => {
    appData.order.payment = "cash"
		order.payment = "cash"
		appData.validateOrder()
});

events.on('order:card', () => {
	appData.order.payment = "card"
	order.payment = "card"
	appData.validateOrder()
});

// Открыть форму заказа и подставить значения, если пользователь задавал их ранее
events.on('order:open', () => {
	let payment = '';
  if (appData.order.payment) {
      payment = appData.order.payment
  }
	
	let address = '';
	if (appData.order.address) {
	address = appData.order.address
	}

	modal.render({
		content: order.render({
      payment: payment,
      address: address,
			valid: false,
			errors: [],
		}),
	});

	if (payment || address){
	appData.validateOrder()}
});

// Меняем счетчик корзины в случае выбора товара
events.on('item:remove', (item: Item) => {
    appData.toggleOrderedLot(item.id, false)
    events.emit('basket:open') 
    page.counter = appData.order.items.length
})

// Открываем корзину
events.on('basket:open', () => {
    const basketItems = appData.catalog.filter(item => appData.order.items.includes(item.id));
    
    basket.items = basketItems.map((item) => {
    
	    const card = new Card(cloneTemplate(cardBasketTemplate), {
		    onClick: () => events.emit('item:remove', item),
		    });
        
		    return card.render({
		    	title: item.title,
		    	price: item.price,
                count: basketItems.indexOf(item)+1,
		    });
	});
    
	modal.render({
		content: basket.render({
      total: appData.getTotal()
    })
	});
});

// Готовим открытие карточки
events.on('card:select', (item: Item) => {
	appData.setPreview(item);   
});

// Меняем кнопку в случае выбора товара
events.on('item:add', (item: Item) => {
    appData.toggleOrderedLot(item.id, true)
    appData.setPreview(item);
    page.counter = appData.order.items.length
})


// Открываем модалку карточки товара
events.on('preview:changed', (item: Item) => {
	const showItem = (item: Item) => {
		const card = new Card(cloneTemplate(cardPreviewTemplate), {
			onClick: () => {
				if (appData.order.items.includes(item.id)) {
          events.emit('basket:open') 
				} else {
					events.emit('item:add', item);
				}
			},
		}); 
		let buttonStatus = 'Купить';
		if (appData.order.items.includes(item.id)) {
			buttonStatus = 'В корзину';
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
    showItem(item)

	//здесь я не уверена, надо ли получать апдейт с сервера, или достаточно ориентироваться на те данные, которые получили изначально в карточки
    // if (item) {
	// 	api
	// 		.getItem(item.id)
	// 		.then((result) => {
	// 			showItem(item);
	// 		})
	// 		.catch((err) => {
	// 			console.error(err);
	// 		});
	// } else {
	// 	modal.close();
	// }
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

//Получаем данные с сервера и загружаем их в каталог
api
	.getItemList()
	.then(appData.setCatalog.bind(appData))

	.catch((err) => {
		console.error(err);
	});

