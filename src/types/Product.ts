export type Product = {
    id: number;
    name: string;
    price: number;
    description: string | null;
    category: string;
    image_url: string | null;
    available: boolean;
    featured: boolean;
    created_at: string;
};

export type CartItem = Product & {
    quantity: number;
};