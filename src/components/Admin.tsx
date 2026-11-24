import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Product } from "../types/Product";

function Admin() {

    const [products, setProducts] = useState<Product[]>([]);

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploadMessage, setUploadMessage] = useState("");

    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [editImageFile, setEditImageFile] = useState<File | null>(null);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Handmade Clothes");
    const [available, setAvailable] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [featured, setFeatured] = useState(false);

    useEffect(() => {

        async function checkAdmin() {

            const {
                data: { user }
            } = await supabase.auth.getUser();

            if (!user) {
                navigate("/admin/login");
                return;
            }

            const { data: admin, error } = await supabase
                .from("admins")
                .select("user_id")
                .eq("user_id", user.id)
                .maybeSingle();

            if (error || !admin) {
                await supabase.auth.signOut();
                navigate("/admin/login");
                return;
            }

            await loadProducts();
            setLoading(false);
        }

        checkAdmin();

    }, [navigate]);

    async function handleLogout() {
        await supabase.auth.signOut();
        navigate("/admin/login");
    }

    if (loading) {
        return (
            <p className="p-10 text-center text-text">
                Loading...
            </p>
        );
    }

    async function loadProducts() {
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.log("Error loading products:", error);
            return;
        }

        setProducts(data);
    }

    async function toggleAvailability(product: Product) {

        const { error } = await supabase
            .from("products")
            .update({
                available: !product.available
            })
            .eq("id", product.id);

        if (error) {
            console.log("Error updating availability:", error);
            return;
        }

        await loadProducts();
    }

    async function toggleFeatured(product: Product) {

        const { error } = await supabase
            .from("products")
            .update({
                featured: !product.featured
            })
            .eq("id", product.id);

        if (error) {
            console.log("Error updating featured status:", error);
            return;
        }

        await loadProducts();
    }

    async function handleAddProduct(event: React.SubmitEvent<HTMLFormElement>) {

        event.preventDefault();

        if (!imageFile) {
            setUploadMessage("Please choose a product image.");
            return;
        }

        setSubmitting(true);
        setUploadMessage("");

        // Create a unique filename
        const fileName = `${Date.now()}-${imageFile.name}`;

        // Upload image to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from("product-images")
            .upload(fileName, imageFile);

        if (uploadError) {
            console.log("Image upload error:", uploadError);
            setUploadMessage("Image upload failed.");
            setSubmitting(false);
            return;
        }

        // Get the public URL of the uploaded image
        const { data: publicUrlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(fileName);

        const imageUrl = publicUrlData.publicUrl;

        // Insert product into PostgreSQL
        const { error: productError } = await supabase
            .from("products")
            .insert({
                name: name,
                price: Number(price),
                description: description,
                category: category,
                image_url: imageUrl,
                available: available,
                featured: featured
            });

        if (productError) {
            console.log("Product insert error:", productError);
            setUploadMessage("Product could not be added.");
            setSubmitting(false);
            return;
        }

        setUploadMessage("Product added successfully!");

        await loadProducts();

        // Clear the form
        setName("");
        setPrice("");
        setDescription("");
        setCategory("Handmade Clothes");
        setAvailable(true);
        setFeatured(false);
        setImageFile(null);

        setSubmitting(false);
    }

    async function handleUpdateProduct(
        event: React.SubmitEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!editingProduct) {
            return;
        }

        let imageUrl = editingProduct.image_url;
        const oldImageUrl = editingProduct.image_url;

        // Only upload an image if the admin selected a new one
        if (editImageFile) {

            const fileName = `${Date.now()}-${editImageFile.name}`;

            const { error: uploadError } = await supabase.storage
                .from("product-images")
                .upload(fileName, editImageFile);

            if (uploadError) {
                console.log("Image upload error:", uploadError);
                return;
            }

            const { data: publicUrlData } = supabase.storage
                .from("product-images")
                .getPublicUrl(fileName);

            imageUrl = publicUrlData.publicUrl;
        }

        const { error } = await supabase
            .from("products")
            .update({
                name: editingProduct.name,
                price: Number(editingProduct.price),
                description: editingProduct.description,
                category: editingProduct.category,
                image_url: imageUrl
            })
            .eq("id", editingProduct.id);

        if (error) {
            console.log("Error updating product:", error);
            return;
        }

        // If a new image was uploaded, delete the old image
        if (editImageFile && oldImageUrl) {

            const marker = "/storage/v1/object/public/product-images/";
            const markerPosition = oldImageUrl.indexOf(marker);

            if (markerPosition !== -1) {

                const oldImagePath = decodeURIComponent(
                    oldImageUrl.substring(
                        markerPosition + marker.length
                    )
                );

                console.log("Deleting old image:", oldImagePath);

                const { data: deleteData, error: deleteImageError } =
                    await supabase.storage
                        .from("product-images")
                        .remove([oldImagePath]);

                if (deleteImageError) {
                    console.log(
                        "Old image deletion error:",
                        deleteImageError
                    );
                } else {
                    console.log(
                        "Old image deleted successfully:",
                        deleteData
                    );
                }

            } else {
                console.log(
                    "Could not find Storage path in:",
                    oldImageUrl
                );
            }
        }

        await loadProducts();

        setEditingProduct(null);
        setEditImageFile(null);
    }

    async function deleteProduct(product: Product) {

        const confirmed = window.confirm(
            `Are you sure you want to delete "${product.name}"?`
        );

        if (!confirmed) {
            return;
        }

        // Delete product from database
        const { error: productError } = await supabase
            .from("products")
            .delete()
            .eq("id", product.id);

        if (productError) {
            console.log("Error deleting product:", productError);
            return;
        }

        // Delete image from Storage
        if (product.image_url) {

            const imagePath = product.image_url.split(
                "/product-images/"
            )[1];

            if (imagePath) {

                const { error: imageError } = await supabase.storage
                    .from("product-images")
                    .remove([imagePath]);

                if (imageError) {
                    console.log(
                        "Product deleted, but image deletion failed:",
                        imageError
                    );
                }
            }
        }

        await loadProducts();
    }

    return (
        <section className="px-4 py-12 md:px-16">

            <div className="mx-auto max-w-5xl">

                <div className="mb-10 flex items-center justify-between">

                    <div>
                        <h1 className="text-4xl font-bold text-text">
                            Admin Dashboard
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Manage Foring products.
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="rounded-lg bg-secondary px-5 py-2 font-semibold text-text hover:bg-primary hover:text-white"
                    >
                        Logout
                    </button>

                </div>

                <div className="max-w-xl rounded-2xl bg-white p-6 shadow-sm">

                    <h2 className="mb-6 text-2xl font-bold text-text">
                        Add Product
                    </h2>

                    <form
                        onSubmit={handleAddProduct}
                        className="flex flex-col gap-5"
                    >

                        <div>
                            <label className="mb-2 block font-semibold text-text">
                                Product Name
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block font-semibold text-text">
                                Price
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={price}
                                onChange={(event) => setPrice(event.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block font-semibold text-text">
                                Description
                            </label>

                            <textarea
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary"
                                rows={4}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block font-semibold text-text">
                                Category
                            </label>

                            <select
                                value={category}
                                onChange={(event) => setCategory(event.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary"
                            >
                                <option value="Handmade Clothes">
                                    Handmade Clothes
                                </option>

                                <option value="China Imported Clothes">
                                    China Imported Clothes
                                </option>

                                <option value="Toys">
                                    Toys
                                </option>
                            </select>
                        </div>

                        <div>
                            <label className="flex items-center gap-3 font-semibold text-text">

                                <input
                                    type="checkbox"
                                    checked={available}
                                    onChange={(event) =>
                                        setAvailable(event.target.checked)
                                    }
                                />

                                Available

                            </label>
                        </div>

                        <div>
                            <label className="flex items-center gap-3 font-semibold text-text">

                                <input
                                    type="checkbox"
                                    checked={featured}
                                    onChange={(event) =>
                                        setFeatured(event.target.checked)
                                    }
                                />

                                Featured on Homepage

                            </label>
                        </div>

                        <div>
                            <label className="mb-2 block font-semibold text-text">
                                Product Image
                            </label>

                            <label className="block cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center hover:border-primary">

                                <span className="font-semibold text-text">
                                    Choose Product Image
                                </span>

                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(event) => {
                                        const file = event.target.files?.[0];

                                        if (file) {
                                            setImageFile(file);
                                            setUploadMessage("");
                                        }
                                    }}
                                />

                            </label>

                            {imageFile && (
                                <p className="mt-2 text-sm text-gray-500">
                                    Selected: {imageFile.name}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-lg bg-primary py-3 font-semibold text-white hover:bg-hover disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {submitting ? "Adding Product..." : "Add Product"}
                        </button>

                        {uploadMessage && (
                            <p className="text-sm text-text">
                                {uploadMessage}
                            </p>
                        )}

                    </form>

                    {editingProduct && (

                        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6">

                            <div className="mb-6 flex items-center justify-between">

                                <h2 className="text-2xl font-bold text-text">
                                    Edit Product
                                </h2>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingProduct(null);
                                        setEditImageFile(null);
                                    }}
                                    className="text-sm font-semibold text-gray-500 hover:text-text"
                                >
                                    Cancel
                                </button>

                            </div>

                            <form
                                onSubmit={handleUpdateProduct}
                                className="flex flex-col gap-5"
                            >

                                <div>
                                    <label className="mb-2 block font-semibold text-text">
                                        Product Name
                                    </label>

                                    <input
                                        type="text"
                                        value={editingProduct.name}
                                        onChange={(event) =>
                                            setEditingProduct({
                                                ...editingProduct,
                                                name: event.target.value
                                            })
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block font-semibold text-text">
                                        Price
                                    </label>

                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={editingProduct.price}
                                        onChange={(event) =>
                                            setEditingProduct({
                                                ...editingProduct,
                                                price: Number(event.target.value)
                                            })
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block font-semibold text-text">
                                        Description
                                    </label>

                                    <textarea
                                        value={editingProduct.description ?? ""}
                                        onChange={(event) =>
                                            setEditingProduct({
                                                ...editingProduct,
                                                description: event.target.value
                                            })
                                        }
                                        rows={4}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block font-semibold text-text">
                                        Category
                                    </label>

                                    <select
                                        value={editingProduct.category}
                                        onChange={(event) =>
                                            setEditingProduct({
                                                ...editingProduct,
                                                category: event.target.value
                                            })
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary"
                                    >
                                        <option value="Handmade Clothes">
                                            Handmade Clothes
                                        </option>

                                        <option value="China Imported Clothes">
                                            China Imported Clothes
                                        </option>

                                        <option value="Toys">
                                            Toys
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block font-semibold text-text">
                                        Product Image
                                    </label>

                                    {editingProduct.image_url && (
                                        <img
                                            src={editingProduct.image_url}
                                            alt={editingProduct.name}
                                            className="mb-4 h-32 w-32 rounded-xl object-cover"
                                        />
                                    )}

                                    <label className="block cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-primary">

                                        <span className="font-semibold text-text">
                                            Choose New Image
                                        </span>

                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(event) => {
                                                const file = event.target.files?.[0];

                                                if (file) {
                                                    setEditImageFile(file);
                                                }
                                            }}
                                        />

                                    </label>

                                    {editImageFile && (
                                        <p className="mt-2 text-sm text-gray-500">
                                            New image: {editImageFile.name}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="rounded-lg bg-primary py-3 font-semibold text-white hover:bg-hover"
                                >
                                    Save Changes
                                </button>

                            </form>

                        </div>

                    )}

                    <div className="mt-12">

                        <h2 className="mb-6 text-2xl font-bold text-text">
                            Products
                        </h2>

                        <div className="grid gap-5">

                            {products.map((product) => (

                                <div
                                    key={product.id}
                                    className="flex items-center gap-5 rounded-2xl bg-white p-4 shadow-sm"
                                >

                                    <img
                                        src={product.image_url ?? ""}
                                        alt={product.name}
                                        className="h-24 w-24 rounded-xl object-cover"
                                    />

                                    <div className="flex-1">

                                        <h3 className="text-lg font-bold text-text">
                                            {product.name}
                                        </h3>

                                        <p className="text-gray-500">
                                            {product.category}
                                        </p>

                                        <p className="font-semibold text-text">
                                            ${Number(product.price).toFixed(2)}
                                        </p>

                                    </div>

                                    <div className="flex flex-col items-end gap-3">

                                        {product.available ? (
                                            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                                                Available
                                            </span>
                                        ) : (
                                            <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-600">
                                                Unavailable
                                            </span>
                                        )}

                                        <button
                                            onClick={() => toggleAvailability(product)}
                                            className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-text hover:bg-primary hover:text-white"
                                        >
                                            {product.available
                                                ? "Mark Unavailable"
                                                : "Mark Available"}
                                        </button>

                                        <button
                                            onClick={() => toggleFeatured(product)}
                                            className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-text hover:bg-primary hover:text-white"
                                        >
                                            {product.featured
                                                ? "Remove from Featured"
                                                : "Add to Featured"}
                                        </button>

                                        <button
                                            onClick={() => {
                                                setEditingProduct(product);
                                                setEditImageFile(null);
                                            }}
                                            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-hover"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => deleteProduct(product)}
                                            className="rounded-lg bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-600 hover:text-white"
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default Admin;