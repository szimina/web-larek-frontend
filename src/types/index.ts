export interface IItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IAppState {
	catalog: IItem[];
	order: IOrder;
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
	total: number;
}
