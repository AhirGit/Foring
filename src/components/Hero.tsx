import heroImage from "../assets/hero.png";

function Hero() {
    return (
        <section className="px-16 pt-10">

            <div className="grid grid-cols-2 items-center gap-12">
                <div>
                    <p className="mb-3 text-sm font-semibold uppercase text-primary">
                        Made for little ones
                    </p>

                    <h1 className="mb-6 text-5xl font-bold text-text">
                        Little things for
                        <br />
                        your little one.
                    </h1>

                    <p className="mb-8 max-w-lg text-lg text-gray-600">
                        Discover adorable clothing, toys, and everyday essentials
                        carefully selected for your baby.
                    </p>

                    <button className="rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-hover">
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