
//интерфейс получаемого товара
export interface IItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
  }


//интерфейс состояния приложения
export interface IAppState {
    catalog: IItem[];
    order: IOrder | null;
}

export interface IOrderForm {
    email: string;
    phone: string;
    address: string;
    payment: string;
}

export interface IOrder extends IOrderForm {
    items: string[];
    total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;


export interface IOrderResult {
    id: string;
}