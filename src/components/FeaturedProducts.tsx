import type { Product } from "../types/Product";

type FeaturedProductsProps = {
    addToCart: (product: Product) => void;
};

function FeaturedProducts({ addToCart }: FeaturedProductsProps) {

    const products: Product[] = [
        {
            id: 1,
            name: "Baby Romper",
            price: 24.99,
            image: `${import.meta.env.BASE_URL}products/romper.jpg`,
            category: "Clothing"
        },
        {
            id: 2,
            name: "Baby Dress",
            price: 29.99,
            image: `${import.meta.env.BASE_URL}products/dress.jpg`,
            category: "Clothing"
        },
        {
            id: 3,
            name: "Baby Pajama Set",
            price: 21.99,
            image: `${import.meta.env.BASE_URL}products/pajama.jpg`,
            category: "Clothing"
        },
        {
            id: 4,
            name: "Baby T-Shirt Set",
            price: 18.99,
            image: `${import.meta.env.BASE_URL}products/tshirt.jpg`,
            category: "Clothing"
        }
    ];

    return (
        <section className="px-4 py-12 md:px-16 md:py-16">

            <h2 className="mb-10 text-center text-3xl font-bold text-text">
                Featured Products
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

                {products.map((product) => (
                    <div
                        key={product.id}
                        className="overflow-hidden rounded-2xl bg-white shadow-sm"
                    >
                        <img
                            src={product.image}
                            alt={product.name}
                            className="h-64 w-full object-cover"
                        />

                        <div className="p-5">

                            <p className="mb-1 text-sm text-primary">
                                {product.category}
                            </p>

                            <h3 className="mb-2 text-lg font-semibold text-text">
                                {product.name}
                            </h3>

                            <p className="mb-4 font-bold text-text">
                                ${product.price.toFixed(2)}
                            </p>

                            <button
                                onClick={() => addToCart(product)}
                                className="w-full rounded-lg bg-primary py-2 font-semibold text-white transition-transform active:scale-95 hover:bg-hover"
                            >
                                Add to Cart
                            </button>

                        </div>
                    </div>
                ))}

            </div>

        </section>
    );
}

export default FeaturedProducts;