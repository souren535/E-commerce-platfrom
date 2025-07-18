import React, { useEffect, useState } from "react";
import withRoleAccess from "../Security/withRoleAccess";
import { AwardIcon, UploadCloud } from "lucide-react";
import { Button } from "../components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import Lottie from "lottie-react";
import CircleSignupLoading from "../assets/animations/Loading_Circle_signUp.json";
import {
  productCreate,
  removeErrors,
  removeSuccess,
} from "../features/Admin/adminSlice";
import { toast } from "sonner";
import PageTitle from "../components/PageTitle";
import { useNavigate } from "react-router-dom";
const ProductCreate = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
  });

  const categories = [
    "Garments",
    "Laptops",
    "Mobiles",
    "Shoes",
    "TV & Appliances",
    "Watches",
    "Tablet",
  ];

  const [image, setImage] = useState([]);
  const [preview, setPreview] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { loading, success, error } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImage([]);
    setPreview([]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setPreview((prev) => [...prev, reader.result]);
          setImage((prev) => [...prev, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!image.length) {
        toast.error("Please upload at least one product image");
        setIsLoading(false);
        return;
      }

      const myForm = new FormData();
      myForm.set("name", formData.name);
      myForm.set("price", formData.price);
      myForm.set("stock", formData.stock);
      myForm.set("category", formData.category);
      myForm.set("description", formData.description);
      image.forEach((img) => {
        myForm.append("image", img);
      });

      dispatch(productCreate(myForm));
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (success?.create) {
      toast.success("Product created successfully");
      dispatch(removeSuccess("create"));
      navigate("/admin/dashboard");
      setFormData({
        name: "",
        price: "",
        stock: "",
        category: "",
        description: "",
      });
      setImage([]);
      setPreview([]);
    }
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
  }, [success, dispatch, error, navigate]);

  return (
    <>
      <PageTitle title={`Product create page`} />
      <div className="min-h-screen px-4 py-10 bg-zinc-950 mt-20 text-white flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl space-y-8 bg-zinc-900 p-8 rounded-xl shadow-xl border border-zinc-800"
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
                required
                placeholder="product name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 rounded-md bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400">Category</label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 rounded-md bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a category</option>
                {categories.map((category, i) => (
                  <option key={i} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-zinc-400">Price (₹)</label>
              <input
                type="number"
                name="price"
                required
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
                required
                placeholder="e.g., 25"
                value={formData.stock}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 rounded-md bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-zinc-400">Product Description</label>
            <textarea
              name="description"
              rows="4"
              required
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
                required
                onChange={handleImageChange}
                className="hidden"
                multiple
              />
            </label>
            {preview.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 overflow-hidden">
                {preview.map((preview, i) => (
                  <img
                    key={i}
                    src={preview}
                    alt={`preview-${i}`}
                    className="mt-4 w-28 h-28 object-cover rounded-lg border border-zinc-600"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading || loading}
              className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 px-6 py-2 rounded-lg text-white font-medium shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || isLoading ? (
                <span className="flex items-center gap-2">
                  Creating.....
                  <span className="w-6 h-6">
                    <Lottie animationData={CircleSignupLoading} loop={true} />
                  </span>
                </span>
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

const ProtectedAdminProductCreate = withRoleAccess(ProductCreate);
export default ProtectedAdminProductCreate;
