import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Product } from "../types/Product";

type ShopProps = {
    addToCart: (product: Product) => void;
};

function Shop({ addToCart }: ShopProps) {

    const categories = [
        "All",
        "Handmade Clothes",
        "China Imported Clothes",
        "Toys"
    ];

    const [searchParams, setSearchParams] = useSearchParams();

    const categoryFromUrl = searchParams.get("category");

    const [selectedCategory, setSelectedCategory] = useState(
        categoryFromUrl && categories.includes(categoryFromUrl)
            ? categoryFromUrl
            : "All"
    );

    const [products, setProducts] = useState<Product[]>([]);

    const filteredProducts =
        selectedCategory === "All"
            ? products
            : products.filter(
                (product) => product.category === selectedCategory
            );

    useEffect(() => {

        async function getProducts() {

            const { data, error } = await supabase
                .from("products")
                .select("*");

            if (error) {
                console.log("Error loading products:", error);
                return;
            }

            console.log("Products from Supabase:", data);
            setProducts(data);
        }

        getProducts();

    }, []);

    return (
        <section className="px-4 py-12 md:px-16 md:py-16">

            <h1 className="mb-3 text-center text-4xl font-bold text-text">
                Shop
            </h1>

            <p className="mb-10 text-center text-gray-600">
                Browse our collection for your little one.
            </p>

            <div className="mb-10 flex flex-wrap justify-center gap-3">

                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => {

                            setSelectedCategory(category);

                            if (category === "All") {
                                setSearchParams({});
                            } else {
                                setSearchParams({
                                    category: category
                                });
                            }

                        }}
                        
                        className={`rounded-full px-5 py-2 ${
                            selectedCategory === category
                                ? "bg-primary text-white"
                                : "bg-secondary text-text hover:bg-primary hover:text-white"
                        }`}
                    >
                        {category}
                    </button>
                ))}

            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

                {filteredProducts.map((product) => (
                    <div
                        key={product.id}
                        className="overflow-hidden rounded-2xl bg-white shadow-sm"
                    >
                        <img
                            src={product.image_url ?? ""}
                            alt={product.name}
                            className="h-64 w-full object-cover"
                        />

                        <div className="p-5">

                            <p className="mb-1 text-sm text-primary">
                                {product.category}
                            </p>

                            <h2 className="mb-2 text-lg font-semibold text-text">
                                {product.name}
                            </h2>

                            <p className="mb-4 font-bold text-text">
                                ${product.price.toFixed(2)}
                            </p>

                            {product.available ? (
                                <button
                                    onClick={() => addToCart(product)}
                                    className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-hover"
                                >
                                    Add to Cart
                                </button>
                            ) : (
                                <button
                                    disabled
                                    className="w-full cursor-not-allowed rounded-lg bg-gray-300 px-4 py-2 font-semibold text-gray-500"
                                >
                                    Out of Stock
                                </button>
                            )}

                        </div>
                    </div>
                ))}

            </div>

        </section>
    );
}

export default Shop;