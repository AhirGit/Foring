import { Link } from "react-router-dom";

function Categories() {

    const categories = [
        {
            id: 1,
            name: "Handmade Clothes",
            image: `${import.meta.env.BASE_URL}categories/handmade.jpg`
        },
        {
            id: 2,
            name: "China Imported Clothes",
            image: `${import.meta.env.BASE_URL}categories/imported.jpg`
        },
        {
            id: 3,
            name: "Toys",
            image: `${import.meta.env.BASE_URL}categories/toys.jpg`
        }
    ];

    return (
        <section className="px-4 py-8 md:px-16">

            <h2 className="mb-6 text-center text-2xl font-bold text-text md:mb-10 md:text-3xl">
                Shop by Category
            </h2>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-6">

                {categories.map((category) => (

                    <Link
                        key={category.id}
                        to={`/shop?category=${encodeURIComponent(category.name)}`}
                        className="flex items-center overflow-hidden rounded-2xl bg-white shadow-sm transition-transform active:scale-95 sm:block sm:hover:-translate-y-1 sm:hover:scale-105"
                    >

                        <img
                            src={category.image}
                            alt={category.name}
                            className="h-24 w-28 shrink-0 object-cover sm:h-48 sm:w-full"
                        />

                        <div className="p-4 text-left sm:text-center">

                            <h3 className="text-base font-semibold text-text sm:text-xl">
                                {category.name}
                            </h3>

                            {/* Mobile arrow */}
                            <p className="mt-1 text-sm text-primary sm:hidden">
                                Shop now →
                            </p>

                        </div>

                    </Link>

                ))}

            </div>

        </section>
    );
}

export default Categories;