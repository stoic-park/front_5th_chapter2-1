export interface Product {
    id: string;
    name: string;
    price: number;
    quantity: number;
    discountRate: number;
}

export interface CartItem {
    product: Product;
    quantity: number;
}
