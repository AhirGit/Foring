import type { CartItem } from "../types/Product";

type CartProps = {
    cart: CartItem[];
    increaseQuantity: (productId: number) => void;
    decreaseQuantity: (productId: number) => void;
    removeFromCart: (productId: number) => void;
};

function Cart({
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart
}: CartProps) {

    const totalPrice = cart.reduce(
        (total, product) => total + product.price * product.quantity,
        0
    );

    return (
        <section className="px-4 py-12 md:px-16 md:py-16">

            <h2 className="mb-8 text-center text-3xl font-bold text-text">
                Your Cart
            </h2>

            {cart.length === 0 ? (
                <p className="text-center text-gray-500">
                    Your cart is empty.
                </p>
            ) : (
                <div className="mx-auto max-w-3xl">

                    {cart.map((product, index) => (
                        <div
                            key={index}
                            className="mb-4 flex items-center justify-between rounded-xl bg-white p-4 shadow-sm"
                        >
                            <div className="flex items-center gap-4">

                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-20 w-20 rounded-lg object-cover"
                                />

                                <div>
                                    <h3 className="font-semibold text-text">
                                        {product.name}
                                    </h3>

                                    <p className="text-primary">
                                        ${product.price.toFixed(2)}
                                    </p>

                                    <div className="mt-2 flex items-center gap-3">

                                        <button
                                            onClick={() => decreaseQuantity(product.id)}
                                            className="h-8 w-8 rounded-md bg-secondary font-bold text-text hover:bg-primary hover:text-white"
                                        >
                                            -
                                        </button>

                                        <span className="font-semibold text-text">
                                            {product.quantity}
                                        </span>

                                        <button
                                            onClick={() => increaseQuantity(product.id)}
                                            className="h-8 w-8 rounded-md bg-secondary font-bold text-text hover:bg-primary hover:text-white"
                                        >
                                            +
                                        </button>

                                    </div>

                                </div>

                            </div>

                            <button
                                onClick={() => removeFromCart(product.id)}
                                className="text-sm font-semibold text-red-500 hover:text-red-700"
                            >
                                Remove
                            </button>

                        </div>
                    ))}

                    <div className="mt-8 flex items-center justify-between border-t border-gray-300 pt-6">

                        <p className="text-xl font-semibold text-text">

                            Total

                        </p>

                        <p className="text-2xl font-bold text-primary">

                            ${totalPrice.toFixed(2)}

                        </p>

                    </div>

                </div>
            )}

        </section>
    );
}

export default Cart;