export interface Product {
    id: number;
    name: string;
    serial_number: string;
    price: number;
    description: string;
    category: string;
    in_stock: number;
    image_url: string;
    quantity?: number;
}
