import { Api, ApiListResponse } from './base/api';
import { IItem, IOrder, IOrderResult } from '../types';

export interface ILarekAPI {
	getItemList: () => Promise<IItem[]>;
	getItem: (id: string) => Promise<IItem>;
	orderItems: (order: IOrder) => Promise<IOrderResult>;
}

export class larekAPI extends Api implements ILarekAPI {
	readonly cdn: string;
	// readonly cash: IItem[];

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getItem(id: string): Promise<IItem> {
		return this.get(`/product/${id}`).then((item: IItem) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	getItemList(): Promise<IItem[]> {
		return this.get('/product').then((data: ApiListResponse<IItem>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	orderItems(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
