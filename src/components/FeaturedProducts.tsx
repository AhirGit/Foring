import { useEffect, useState } from "react";
import type { Product } from "../types/Product";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

type FeaturedProductsProps = {
    addToCart: (product: Product) => void;
};

function FeaturedProducts({ addToCart }: FeaturedProductsProps) {

    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {

        async function loadFeaturedProducts() {

            const { data, error } = await supabase
                .from("products")
                .select("*")
                .eq("featured", true)
                .order("created_at", { ascending: false });

            if (error) {
                console.log("Error loading featured products:", error);
                return;
            }

            setProducts(data);
        }

        loadFeaturedProducts();

    }, []);

    return (
        <section
            id="featured-products"
            className="scroll-mt-20 px-4 py-8 md:px-16 md:py-16"
        >

            <h2 className="mb-6 text-center text-2xl font-bold text-text md:mb-10 md:text-3xl">
                Featured Products
            </h2>

            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">

                {products.map((product) => (
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

                            <h3 className="mb-2 text-sm font-semibold text-text sm:text-lg">
                                {product.name}
                            </h3>

                            <p className="mb-3 text-sm font-bold text-text sm:mb-4 sm:text-base">
                                ৳{Number(product.price).toLocaleString("en-BD")}
                            </p>

                            {product.available ? (
                                <button
                                    onClick={() => addToCart(product)}
                                    className="w-full rounded-lg bg-primary px-2 py-2 text-sm font-semibold text-white transition-transform hover:bg-hover active:scale-95 sm:text-base"
                                >
                                    Add to Cart
                                </button>
                            ) : (
                                <button
                                    disabled
                                    className="w-full cursor-not-allowed rounded-lg bg-gray-300 px-2 py-2 text-sm font-semibold text-gray-500 sm:text-base"
                                >
                                    Out of Stock
                                </button>
                            )}

                        </div>

                    </div>
                ))}

            </div>

            <div className="mt-10">
                <Link
                    to="/shop"
                    className="block w-full rounded-xl border-2 border-primary px-6 py-3 text-center font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                >
                    Browse All Products
                </Link>
            </div>

        </section>
    );
}

export default FeaturedProducts;