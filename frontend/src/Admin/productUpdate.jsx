import React, { useState, useEffect } from "react";
import withRoleAccess from "../Security/withRoleAccess";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { UploadCloud } from "lucide-react";
import {
  removeErrors,
  removeSuccess,
  updateAdminProduct,
} from "../features/Admin/adminSlice";
import { toast } from "sonner";
import { getProductdetails } from "../features/products/productSlice";
import PageTitle from "../components/PageTitle";

const ProductUpdate = () => {
  const { id } = useParams();
  const [products, setProducts] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  const categories = [
    "Garments",
    "Laptops",
    "Mobiles",
    "Shoes",
    "TV & Appliances",
    "Watches",
  ];

  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imageReview, setImageReview] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success, error } = useSelector((state) => state.admin);

  const { product } = useSelector((state) => state.product);
  console.log("update page product details", product);

  // Simulate fetching products data by ID (replace with actual API later)

  const handleChange = (e) => {
    setProducts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    setImageReview([]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImageReview((prev) => [...prev, reader.result]);
          setImages((prev) => [...prev, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!images.length) {
        toast.error("Please upload at least one product image");
        setIsLoading(false);
        return;
      }

      const myForm = new FormData();
      myForm.set("name", products.name);
      myForm.set("price", products.price);
      myForm.set("stock", products.stock);
      myForm.set("category", products.category);
      myForm.set("description", products.description);

      images.forEach((img) => {
        myForm.append("image", img);
      });

      dispatch(updateAdminProduct({ id, productData: myForm }));
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    dispatch(getProductdetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      setProducts({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        category: product.category || "",
        stock: product.stock || "",
      });

      if (product && Array.isArray(product.image)) {
        setOldImages(product.image);
      } else {
        setOldImages([]);
      }
    }
  }, [product]);

  useEffect(() => {
    if (success?.update) {
      toast.success("Product update successfully");
      dispatch(removeSuccess("update"));
      navigate("/admin/products");
      setProducts({
        name: "",
        price: "",
        stock: "",
        category: "",
        description: "",
      });
      setImages([]);
      setImageReview([]);
    }
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
  }, [success, dispatch, error, navigate]);

  return (
    <>
      <PageTitle title={`Update Product page`} />
      <div className="min-h-[80vh] bg-zinc-950 text-white flex justify-center mt-15 px-4 py-12">
        <div className="w-full max-w-4xl bg-zinc-900 p-8 rounded-xl shadow-2xl">
          <h1 className="text-3xl font-bold text-indigo-400 mb-6 border-b pb-2">
            Update products
          </h1>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            encType="multipart/form-data"
          >
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-zinc-400">Name</label>
                <input
                  type="text"
                  name="name"
                  value={products.name}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-sm text-zinc-400">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={products.price}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-sm text-zinc-400">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={products.stock}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-sm text-zinc-400">Category</label>
                <select
                  name="category"
                  value={products.category}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {categories.map((category, i) => (
                    <option key={i} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col justify-between gap-4">
              <div>
                <label className="text-sm text-zinc-400">Description</label>
                <textarea
                  name="description"
                  value={products.description}
                  onChange={handleChange}
                  rows="6"
                  className="w-full mt-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>
              <div className="flex flex-col h-[500px] gap-2">
                <div className="image-input rounded-2xl w-full h-1/5 flex items-center pt-3 justify-center ">
                  <label className="text-sm  w-full cursor-pointer sm:w-60 items-center justify-center flex h-full text-zinc-500">
                    <div className="text-center ">
                      <UploadCloud size={28} className="mx-auto mb-1" />
                      <p className="text-sm">Click to upload</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                <span className="mb-3 text-zinc-600">New image Preview</span>
                <div className="Image-review mt-5 flex flex-wrap overflow-hidden">
                  {imageReview.map((image, i) => (
                    <img
                      key={i}
                      src={image}
                      alt={`products Preview -${i}`}
                      className="w-25 h-25 object-cover rounded-lg border border-zinc-700"
                    />
                  ))}
                </div>
                <span className="mb-3 text-zinc-600">old image Preview</span>
                <div className="Image-review mt-5 flex flex-wrap overflow-hidden">
                  {Array.isArray(oldImages) &&
                    oldImages.map((image, i) => (
                      <img
                        key={i}
                        src={image.url}
                        alt={`products Preview -${i}`}
                        className="w-25 h-25 object-cover rounded-lg border border-zinc-700"
                      />
                    ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end">
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white px-6 py-2 rounded-lg font-semibold shadow"
              >
                {loading || isLoading ? "updating...." : "Update products"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

const ProtectedAdminProductUpdate = withRoleAccess(ProductUpdate);

export default ProtectedAdminProductUpdate;
