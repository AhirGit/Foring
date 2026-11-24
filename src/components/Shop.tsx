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
        <section className="px-4 py-8 md:px-16 md:py-16">

            <h1 className="mb-2 text-center text-3xl font-bold text-text md:text-4xl">
                Shop
            </h1>

            <p className="mb-6 text-center text-sm text-gray-600 md:mb-10 md:text-base">
                Browse our collection for your little one.
            </p>

            <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:mb-10 
                    md:flex-wrap md:justify-center md:gap-3 md:px-0">

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

                        className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm 
                                    transition-colors md:px-5 md:text-base ${
                            selectedCategory === category
                                ? "bg-primary text-white"
                                : "bg-secondary text-text hover:bg-primary hover:text-white"
                        }`}
                    >
                        {category}
                    </button>
                ))}

            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">

                {filteredProducts.map((product) => (
                    <div
                        key={product.id}
                        className="overflow-hidden rounded-2xl bg-white shadow-sm"
                    >
                        <img
                            src={product.image_url ?? ""}
                            alt={product.name}
                            className="h-40 w-full object-cover sm:h-64"
                        />

                        <div className="p-3 sm:p-5">

                            <p className="mb-1 text-xs text-primary sm:text-sm">
                                {product.category}
                            </p>

                            <h2 className="mb-2 text-sm font-semibold text-text sm:text-lg">
                                {product.name}
                            </h2>

                            <p className="mb-3 text-sm font-bold text-text sm:mb-4 sm:text-base">
                                ৳{Number(product.price).toLocaleString("en-BD")}
                            </p>

                            {product.available ? (
                                <button
                                    onClick={() => addToCart(product)}
                                    className="w-full rounded-lg bg-primary px-2 py-2 text-sm font-semibold text-white hover:bg-hover active:scale-95 sm:px-4 sm:text-base"
                                >
                                    Add to Cart
                                </button>
                            ) : (
                                <button
                                    disabled
                                    className="w-full cursor-not-allowed rounded-lg bg-gray-300 px-2 py-2 text-sm font-semibold text-gray-500 sm:px-4 sm:text-base"
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