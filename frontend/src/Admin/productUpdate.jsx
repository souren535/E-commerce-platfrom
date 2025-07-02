import React, { useState, useEffect } from "react";
import withRoleAccess from "../Security/withRoleAccess";
import { useParams } from "react-router-dom";
import { Button } from "../components/ui/button";

const ProductUpdate = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
  });

  // Simulate fetching product data by ID (replace with actual API later)
  useEffect(() => {
    // Fake fetch logic
    setProduct({
      name: "Sample Product",
      description: "High-quality headphones with noise cancellation.",
      price: "2999",
      category: "Electronics",
      stock: "50",
      image:
        "https://m.media-amazon.com/images/I/31mXC+OVHDL._AC_UF1000,1000_QL80_.jpg",
    });
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updating product:", product);
    // Dispatch update product action here
  };

  return (
    <div className="min-h-[80vh] bg-zinc-950 text-white flex justify-center mt-15 px-4 py-12">
      <div className="w-full max-w-4xl bg-zinc-900 p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-indigo-400 mb-6 border-b pb-2">
          Update Product
        </h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-zinc-400">Name</label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400">Stock</label>
              <input
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400">Category</label>
              <select
                name="category"
                value={product.category}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-4">
            <div>
              <label className="text-sm text-zinc-400">Description</label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                rows="6"
                className="w-full mt-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-400">Image Preview</label>
              <img
                src={product.image}
                alt="Product Preview"
                className="w-32 h-32 object-cover rounded-lg border border-zinc-700"
              />
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold shadow"
            >
              Update Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProtectedAdminProductUpdate = withRoleAccess(ProductUpdate);

export default ProtectedAdminProductUpdate;
