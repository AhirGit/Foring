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
        <section className="px-16">

            <h2 className="mb-10 text-center text-3xl font-bold text-text">
                Shop by Category
            </h2>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">

                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="overflow-hidden rounded-2xl bg-white shadow-sm transition-transform hover:-translate-y-1 hover:scale-105"
                    >
                        <img
                            src={category.image}
                            alt={category.name}
                            className="h-48 w-full object-cover"
                        />

                        <div className="p-4 text-center">
                            <h3 className="text-xl font-semibold text-text">
                                {category.name}
                            </h3>
                        </div>
                    </div>
                ))}

            </div>

        </section>
    );
}

export default Categories;