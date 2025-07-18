import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import withRoleAccess from "../Security/withRoleAccess";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import PageTitle from "../components/PageTitle";
import moment from "moment";
import { toast } from "sonner";

import {
  deleteAdminProduct,
  getAdminProducts,
  getAdminSoftDeleted,
  removeErrors,
  removeSuccess,
} from "../features/Admin/adminSlice";
import RecycleBin from "./components/recycleBin";
const ProductList = () => {
  // Dummy data — replace with real API data
  const { products, loading, error } = useSelector((state) => state.admin);
  const { softDeleted } = useSelector((state) => state.admin);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getAdminProducts());
    dispatch(getAdminSoftDeleted());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  const handelNavigate = (id) => {
    navigate(`/list/${id}`);
  };

  const handleDelete = (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (isConfirmed) {
      dispatch(deleteAdminProduct(id)).then((action) => {
        if (action.type === "admin/deleteAdminProduct/fulfilled") {
          toast.success("product deleted successfully");
          dispatch(removeSuccess("delete"));
          dispatch(getAdminSoftDeleted());
        }
      });
    }
  };
  return (
    <>
      <PageTitle title={`Admin All products`} />
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-zinc-950 px-6 pt-24 pb-10 text-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-zinc-500 to-pink-500 text-transparent bg-clip-text mb-8">
              All Products
            </h1>

            {/* Search */}
            {/* <div className="mb-6">
              <form onSubmit={(e) => handleSubmit(e)}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full sm:w-96 px-4 py-2 rounded-md bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </form>
            </div> */}

            {/* Recycle Bin Button and Modal */}
            {softDeleted.length > 0 && <RecycleBin />}

            {/* Product Table */}
            <div className="overflow-x-auto rounded-lg border border-zinc-700 shadow-lg">
              <table className="min-w-full text-sm">
                <thead className="bg-zinc-900 border-b border-zinc-700 text-zinc-400 uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Product Image</th>
                    <th className="px-4 py-3 text-left">Product Name</th>
                    <th className="px-4 py-3 text-left">Price</th>
                    <th className="px-4 py-3 text-left">Rating</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Stock</th>
                    <th className="px-4 py-3 text-left">Created At</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-zinc-800/60 backdrop-blur-sm">
                  {products &&
                    products
                      .filter((product) => product.is_deleted === false)
                      .map((product) => (
                        <tr
                          key={product._id}
                          className="border-b border-zinc-700 hover:bg-zinc-700/30 transition-all duration-200"
                        >
                          <td className="px-4 py-3">
                            <img
                              onClick={() => handelNavigate(product._id)}
                              src={product?.image?.[0]?.url}
                              alt={product.name}
                              className="w-15 h-15 object-cover rounded-md cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-3 max-w-[350px]">
                            {product.name}
                          </td>
                          <td className="px-4 py-3">₹{product.price}</td>
                          <td className="px-4 py-3">{product.ratings}</td>
                          <td className="px-4 py-3">{product.category}</td>
                          <td className="px-4 py-3">
                            {product.stock > 0 ? (
                              <span className="text-green-400">
                                {product.stock}
                              </span>
                            ) : (
                              <span className="text-rose-400">
                                Out of Stock
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {moment(product.createdAt).format(
                              "MMMM Do YYYY, h:mm A"
                            )}
                          </td>
                          <td className="px-4 py-3 space-x-2">
                            <Link
                              to={`/admin/products/edit/${product._id}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-800 text-white rounded-md text-xs"
                            >
                              <Pencil className="w-4 h-4" />
                              Edit
                            </Link>
                            <button
                              className="inline-flex cursor-pointer items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-xs"
                              onClick={() => {
                                handleDelete(product._id);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  {products.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-6 text-zinc-400"
                      >
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ProtectedAdminDashboardProductList = withRoleAccess(ProductList);

export default ProtectedAdminDashboardProductList;
