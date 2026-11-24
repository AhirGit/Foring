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
            className="px-4 py-12 md:px-16 md:py-16"
        >

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
                            src={product.image_url ?? ""}
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
                                ${Number(product.price).toFixed(2)}
                            </p>

                            {product.available ? (
                                <button
                                    onClick={() => addToCart(product)}
                                    className="w-full rounded-lg bg-primary py-2 font-semibold text-white transition-transform hover:bg-hover active:scale-95"
                                >
                                    Add to Cart
                                </button>
                            ) : (
                                <button
                                    disabled
                                    className="w-full cursor-not-allowed rounded-lg bg-gray-300 py-2 font-semibold text-gray-500"
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