import {Form} from "./common/Form";
import {IOrderForm} from "../types";
import {IEvents} from "./base/events";


export class OrderAddress extends Form<IOrderForm> {
    protected _cash: HTMLButtonElement;
    protected _card: HTMLButtonElement;
    protected _address: HTMLInputElement;
    protected _button: HTMLButtonElement;
    
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._cash = container.querySelector('[name="cash"]')
        this._card = container.querySelector('[name="card"]')
        this._button = container.querySelector(".button"); //посмотреть, нужен ли этот параметр, т.к. подтягивается из родителя
        this._address = container.querySelector('[name="address"]')
        
        this._cash.addEventListener('click', () => {
            events.emit('order:cash');
        });

        this._card.addEventListener('click', () => {
            events.emit('order:card');
        });
    }

    set address (value: string) {
      (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
      
    }
 
    set payment (value:string) {
        if (value==="cash") {
            (this.container.elements.namedItem("cash") as HTMLButtonElement).classList.add("button_alt-active");
            (this.container.elements.namedItem("card") as HTMLButtonElement).classList.remove("button_alt-active")
        } else if (value==="card") {
            (this.container.elements.namedItem("card") as HTMLButtonElement).classList.add("button_alt-active");
            (this.container.elements.namedItem("cash") as HTMLButtonElement).classList.remove("button_alt-active")
        } else if (value==='') {
            (this.container.elements.namedItem("card") as HTMLButtonElement).classList.remove("button_alt-active");
            (this.container.elements.namedItem("cash") as HTMLButtonElement).classList.remove("button_alt-active")
        }
    }
}

export class OrderContacts extends Form<IOrderForm> {
    protected _email: HTMLInputElement;
    protected _phone: HTMLInputElement;
    protected _button: HTMLButtonElement;
    

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._button = container.querySelector(".button"); //посмотреть, нужен ли этот параметр, т.к. подтягивается из родителя
        this._email = container.querySelector('[name="email"]')
        this._phone = container.querySelector('[name="phone"]')
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }

}