import heroImage from "../assets/hero.png";

function Hero() {

    function scrollToFeaturedProducts() {
        document
            .getElementById("featured-products")
            ?.scrollIntoView({
                behavior: "smooth"
            });
    }

    return (
        <section className="px-4 py-8 md:px-16 md:py-15">

            {/* Mobile layout */}
            <div className="md:hidden">

                {/* Text + image */}
                <div className="grid grid-cols-2 items-center gap-4">

                    <div>

                        <p className="mb-2 text-xs font-semibold uppercase text-primary">
                            Made for little ones
                        </p>

                        <h1 className="text-2xl font-bold leading-tight text-text">
                            Little things for your little one.
                        </h1>

                    </div>

                    <img
                        src={heroImage}
                        alt="Foring Baby's Online Shop"
                        className="w-full rounded-2xl"
                    />

                </div>

                {/* Description underneath */}
                <p className="mt-5 text-sm leading-6 text-gray-600">
                    Discover adorable clothing, toys, and everyday essentials
                    carefully selected for your baby.
                </p>

                {/* Wide button */}
                <button
                    onClick={scrollToFeaturedProducts}
                    className="mt-5 w-full rounded-lg bg-primary py-3 font-semibold text-white transition-colors hover:bg-hover"
                >
                    Shop Now
                </button>

            </div>


            {/* Desktop layout */}
            <div className="hidden grid-cols-2 items-center gap-5 md:grid">

                <div>

                    <p className="mb-3 text-sm font-semibold uppercase text-primary">
                        Made for little ones
                    </p>

                    <h1 className="mb-6 text-4xl font-bold text-text">
                        Little things for
                        <br />
                        your little one.
                    </h1>

                    <p className="mb-8 max-w-lg text-lg text-gray-600">
                        Discover adorable clothing, toys, and everyday essentials
                        carefully selected for your baby.
                    </p>

                    <button
                        onClick={scrollToFeaturedProducts}
                        className="rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-hover"
                    >
                        Shop Now
                    </button>

                </div>

                <div className="flex justify-center">

                    <img
                        src={heroImage}
                        alt="Foring Baby's Online Shop"
                        className="w-full max-w-lg rounded-3xl"
                    />

                </div>

            </div>

        </section>
    );
}

export default Hero;