function Categories() {

    const categories = [
        {
            id: 1,
            name: "Clothing",
            image: `${import.meta.env.BASE_URL}categories/clothing.jpg`

        },
        {
            id: 2,
            name: "Toys",
            image: `${import.meta.env.BASE_URL}categories/toys.jpg`

        },
        {
            id: 3,
            name: "Feeding",
            image: `${import.meta.env.BASE_URL}categories/feeding.jpg`
        },
        {
            id: 4,
            name: "Accessories",
            image: `${import.meta.env.BASE_URL}categories/accessories.jpg`
        }
    ];

    return (
        <section className="px-16">

            <h2 className="mb-10 text-center text-3xl font-bold text-text">
                Shop by Category
            </h2>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">

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