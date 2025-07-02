import React, { useState } from "react";
import withRoleAccess from "../Security/withRoleAccess";
import { UploadCloud } from "lucide-react";
import { Button } from "../components/ui/button";

const ProductCreate = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, image: file }));

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Creating Product:", formData);
    // TODO: Add backend dispatch/API call
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-zinc-950 mt-20 to-zinc-900 text-white flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl space-y-8 bg-zinc-900/80 p-8 rounded-xl shadow-xl border border-zinc-800"
      >
        <h1 className="text-3xl font-bold text-indigo-400 border-b pb-3">
          Add New Product
        </h1>

        {/* Product Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-zinc-400">Product Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Apple iPhone 15"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 rounded-md bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 rounded-md bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a category</option>
              <option value="Mobiles">Mobiles</option>
              <option value="Shoes">Shoes</option>
              <option value="Watches">Watches</option>
              <option value="Appliances">Appliances</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-zinc-400">Price (₹)</label>
            <input
              type="number"
              name="price"
              placeholder="e.g., 79999"
              value={formData.price}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 rounded-md bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400">Stock Quantity</label>
            <input
              type="number"
              name="stock"
              placeholder="e.g., 25"
              value={formData.stock}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 rounded-md bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm text-zinc-400">Description</label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product details..."
            className="w-full mt-1 px-4 py-2 rounded-md bg-zinc-800 border border-zinc-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Image Upload */}
        <div className="flex flex-col items-center">
          <label className="text-sm text-zinc-400 mb-2">Product Image</label>
          <label className="w-full sm:w-80 flex items-center justify-center h-40 border border-dashed border-indigo-500 bg-zinc-800 hover:bg-zinc-700 transition cursor-pointer rounded-md">
            <div className="text-center text-indigo-400">
              <UploadCloud size={28} className="mx-auto mb-1" />
              <p className="text-sm">Click to upload</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              multiple
            />
          </label>
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-4 w-28 h-28 object-cover rounded-lg border border-zinc-600"
            />
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg text-white font-medium shadow"
          >
            Create Product
          </Button>
        </div>
      </form>
    </div>
  );
};

const ProtectedAdminProductCreate = withRoleAccess(ProductCreate);
export default ProtectedAdminProductCreate;
