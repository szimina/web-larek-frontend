# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss— корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

Код приложения разделен на слои данных, отображения и коммуникации. Взаимодействие отображения и данных между собой находится в корневом файле index.ts и реализуется через брокер событий - объект класса EventEmitter, реализующий паттер "Наблюдатель". 

## Компоненты слоя данных (Model) 

1. **Абстрактный дженерик класс Model<T>**
Является базовым компонентом и отвечает за то, чтобы можно было отличить ее от простых объектов с данными. Конструктор класса принимает данные и события интерфейса IEvents. 
Имеет метод **emitChanges**, сообщающий, что модель поменялась.

2. **Класс  Item**
Является расширением базового абстрактного класса Model.  
Содержит информацию о товаре, получаемую через api и включает в себя следующие свойства:
- **id**: string; // идентификатор товара, используется при открытии карточки товара, добавлении или удалении товара из корзины
- **description**: string; // текст описания товара, используемый в карточке товара
- **image**: string; // иконка-изобращение товара
- **title**: string; // название товара
- **category**: string; //категория товара
- **price**: number; // цена товара

Данный класс не содержит методов.

3. **Класс AppState**
Является расширением базового абстрактного класса Model. Содержит информацию о товарах и заказе:
```
catalog: Item[]; // список-каталог всех объектов класса Item, полученных по api
order: IOrder = { // информацию о самом заказе пользователя
    email: string; // мейл пользователя
    phone: string; // контактный телефон пользователя
    address: string; // адрес доставки
    payment: string; // выбранный способ оплаты
    items: string[]; //список id товаров, который пользователь добавил в корзину
    total: number; // итоговую стоимость заказа
  };
  formErrors: FormErrors //информацию об ошибках воода информации в форму заказа
```

Методы класса:
- **setCatalog** // отвечает за добавление товаров в каталог после получения их по api
- **setPreview** // отвечает за установку события 'preview:changed' на выбранную пользователем карточку товара и дальнейшее открыте модального окна с подробным описанием данного товара
- **toggleOrderedLot** // отвечает за добавление или исключение товаров из корзины
- **getTotal** // возвращает итоговую стоимость всех товаров, добавленных в корзину
- **getBasketItems** // возвращает список всех товаров, добавленных пользователем в корзину
- **setOrderField** // отвечает за сохранение данных, введенных в поля заказа пользователем
- **validateOrder** // отвечает за валидацию полей формы: 
- **clearBasket** // отвечает за очищение данных заказа из свойства order после успешной отправки заказа


## Компоненты слоя отображения (View) 

1. **Абстрактный дженерик класс Component<T>**
Является базовым компонентом и отвечает за создание HTML обертки копонентов классов, его наследующих. Конструктор класса принимает HTML контейнер.

Методы класса:
- **toggleClass** // отвечает за переключение классов
- **setText** // отвечает за установку текстового содержимого
- **setDisabled**// переключает статус блокировки
- **setHidden** // скрывает содержимое
- **setVisible** // отображает содержимое
- **setImage** // устанавливает изображение и альтернативный текст для него
- **render** // возвращает корневой DOM элемент

2. **Класс Page**
Используется для отображения главной страницы.Является расширением базового абстрактного класса Component. 
Конструктор класса принимает HTML контейнер и список событий.
 
Методы класса:
- **set counter**// отвечает за актуальное отображение количество товаров в корзине
- **set catalog** // отвечает за отображение каталога товаров
- **set locked** // отвечает за блокировку прокрутки страницы при открытии модального окна и разблокировку прокрутки в случае закрытя модального окна. 

3. **Класс Card**
Используется для отображения единицы товара на главной странице, в модальном окне карточки товара и в модальном окне-корзине. Является расширением базового абстрактного класса Component.
Конструктор класса принимает HTML контейнер и список действий.

Включает в себя свойства, аналогичные свойствам класса Item. В дополнение к этому в класс добавлено свойство count, хранящий порядковый номер товара, если он добавлен в корзину пользователем. 

Методы класса:
- **set id** // устанавливает ID товара
- **get id** // возвращает id товара
- **set category** // установливает категорию товара и добавляет класс, влияющий на цвет категории
- **get category** // возвращает категорию товара
- **set price** // устанавливает цену товара, в случае нулевой стоимости выводит текст "Бесценно" и делает кнопку покупки неактивной, в случае, если стоимость товара выше 9999, форматирует стоимость товара, добавляя разделитель разрядов в виде пробела
- **get price** // возвращает стоимость товара
- **set image** // устанавливает картинку и src картинки
- **set title** // устанавливает название товара
- **get title** // возвращает название товара
- **set description** // устанавливает описание товара
- **set button** // устанавливает текст кнопки товара
- **set count** // устанавливает нумерацию товара в корзине

4. **Класс Modal**
Является универсальным классом отображения всех модальных окон проекта и отвечает за их открытие (метод **open**), отображение (метод **render**) и закрытие (метод **close**). Является расширением базового абстрактного класса Component. Конструктор класса принимает HTML контейнер и события интерфейса IEvents. 

5. **Класс Basket**
Используется для отображение элементов корзины. Является расширением базового абстрактного класса Component. Конструктор класса принимает HTML контейнер и список событий. 

Методы класса:
- **items** //сеттер, отвечающий за отображение списка всех добавленных пользователем в корзину товаров или фразы "Корзина пуста" в случае отсутствия добавленных товаров
- **total** //сеттер, отвечающий за отображение итоговой стоимости товаров в корзине и активацию кнопки модального окна в случае, если итоговая стоимость составляет более нуля. Нулевой стоимость может быть в том случае, если в корзину не добавлен ни один товар, либо добавлен бесплатный товар, покупка которого невозможна без дополнительной покупки платных товаров.  Согласно макету метод форматирует значение стоимости товара, добавляя разделитель разрядов в виде пробела, в случае,если его стоимость составляет более 9999 синапсов

6. **Класс Form**
Является универсальным классом отображения всех форм проекта и отвечает за их валидацию (метод **set valid**), отображение текста ошибки валидации (метод **set errors**), объявление события изменение ввода (метод **OnInputChange**), отображение (метод **render**). Является расширением базового абстрактного класса Component. Конструктор класса принимает HTML контейнер и список событий.

7. **Классы OrderAddress и OrderContacts**
Используются для отображение форм заказа (форма с вводом адреса и форма с вводом контактов). Являеются расширением  класса Form. Конструкторы класса принимают HTML контейнер и события. Имеют методы, отображающие информацию в полях ввода, если до этого пользователь уже вводил информацию (адрес, телефон, e-mail) или выбирал способ оплаты, а затем закрыл форму заказа, не завершив покупку.

8. **Класс Success**
Используется для отображения окна успешного совершения заказа.  Является расширением базового абстрактного класса Component. Конструктор класса принимает HTML контейнер и события. Единственным методом класса является **set total**, устанавлиающий отображение итоговой стоимости заказа. 


## Компоненты слоя коммуникации (Communication)

1. **Класс Api**
Является базовым компонентом и отвечает за api запросы на сервер. Конструктор класса получает базовый URL и опции интерфейса RequestInit. 

Методы класса:
- **get** // отправка GET запроса
- **post** // отправка POST запроса
- **handleResponse** // отвечает за проверку ответа на ошибку

2. **Класс larekAPI**
Являеся расширением класса Api. Отвечает за обмен информацией о товаре и заказах с сервером посредством api. Имплементирует интерфейс ILarekAPI. Конструктор класса получает CDN URL и API URL, сохраненные в переменных, и список опций интерфейса RequestInit. 

Методы класса:
- **getItem** // позволяет получить описание конкретной единицы товара, принимая id товара в качестве аргумента
- **getItemList** //позволяет получить список товаров с сервера
- **orderItems** // передает на сервер информацию о заказе

3. **EventEmitter**
Базовый класс проекта, реализующий паттерн «Наблюдатель» и позволяющий подписываться на события и уведомлять подписчиков о наступлении события. Имплементирует иинтерфейс IEvents. 
Класс имеет методы **on**, **off**, **emit**  — для подписки на событие, отписки от события и уведомления подписчиков о наступлении события соответственно. Дополнительно реализованы методы  **onAll** и  **offAll**  — для подписки на все события и сброса всех подписчиков. Интересным дополнением является метод  **trigger** , генерирующий заданное событие с заданными аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти классы будут генерировать события, не будучи при этом напрямую зависимыми от класса  EventEmitter.

4. **Взаимодействия через события между классами**
Код, описывающий взаимодействие отображения и данных между собой находится в корневом файле index.ts. Взаимодействие реализуется через брокера событий - экземпляр класса EventEmitter.

Список событий:
- **BASKET_OPEN**  // отвечает за открытие корзины и генерацию карточек товара, которые были ранее добавлены пользователем в корзину, и за выведение итоговой стоимости всех товаров, добавленных в корзину
- **CARD_SELECT**  // отвечает за подготовку карточки к открытию
- **CONTACTS_SUBMIT**  // отвечает за отправку заказа по api и обнуление данных заказа в корзине
- **FORM_ERRORS_CHANGE**  // отвечает за изменение состояния валидации формы 
- **ITEM_ADD**  // отвечает за добавление товара в корзину, изменение цифры на счетчике корзины и закрытие модального окна сразу же при добавлении товара в корзину
- **ITEM_REMOVE**  //отвечает за удаление товара из корзины и заказа и обновление счетчика количества товаров в корзине
- **ITEMS_CHANGED**  // отчвечает за отображенеи всех карточек товара на главной странице
- **MODAL_CLOSE**   // отвечает за разблокировку  прокрутки основной страницы при закрытии модального окна
- **MODAL_OPEN**  //отвечает за блокировку прокрутки основной страницы при открытии модального окна
- **ORDER_CARD** // отвечает за выбор метода оплаты - картой: устанавливает это значение в заказ и производит валидацию формы
- **ORDER_CASH**  // отвечает за выбор метода оплаты - наличными: устанавливает это значение в заказ и производит валидацию формы
- **ORDER_OPEN**  // отвечает за отображение формы заказа. Если ранее пользователь уже выбирал метод оплаты и вводил адрес доставки, подставляет значения в поля и производит валидацию
- **ORDER_READY**  // сообщает о том, что все поля формы прошли валидацию
- **ORDER_SUBMIT**  //  отвечает за отображение формы контактов. Если ранее пользователь уже выбирал метод оплаты и вводил адрес доставки, подставляет значения в поля и производит валидацию
- **PREVIEW_CHANGED**  // отвечает за открытие модального окна с описанием карточки  товара, вешает слушатель на кнопку модального окна. Если товар ранее был добавлен в корзину, на кнопку вешается слушатель BASKET_OPEN а текст на кнопке отоборажается как "В корзине", в противном случае вешается слушатель ITEM_ADD и на кнопке отображается текст "Купить"
- **/^order\..*:change/ и /^contacts\..*:change/**  // отвечает за сохранение введенных даных в одноименные поля ввода в форму заказа и в форму контактов соответсвтенно
