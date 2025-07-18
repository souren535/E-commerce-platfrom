import React, { useEffect, useState } from "react";
import withRoleAccess from "../Security/withRoleAccess";
import { Star, Eye, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { useDispatch, useSelector } from "react-redux";

import {
  adminDeleteReviews,
  fetchAllReviews,
  getAdminProducts,
  removeSuccess,
} from "../features/Admin/adminSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const AllReviews = () => {
  const { products, loading, error, reviews, message, success } = useSelector(
    (state) => state.admin
  );

  console.log("Allreviews page reviews", reviews);
  const dispatch = useDispatch();
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(getAdminProducts());
  }, [dispatch]);

  const handleViewReviews = (product) => {
    setSelectedProduct(product);
    dispatch(fetchAllReviews(product._id));
  };

  const handleDeleteReview = (productId, reviewId) => {
    dispatch(adminDeleteReviews({ productId, reviewId }));
    console.log("Deleting review:", { productId, reviewId });
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }

    if (success?.delete) {
      toast.success(message || "Review deleted successfully");
      dispatch(removeSuccess("delete"));
    }
  }, [error, success, message, dispatch]);

  return (
    <>
      <div className="min-h-screen bg-zinc-950 text-white px-6 py-10">
        <div className="flex ml-[10rem] mr-[10rem] items-center justify-between mt-20 mb-6">
          <h1 className="text-3xl font-bold text-indigo-400">
            All Product Reviews
          </h1>
        </div>

        <div className="overflow-x-auto ml-[10rem] mr-[10rem] rounded-lg shadow border border-indigo-800">
          <table className="min-w-full text-sm text-left bg-zinc-900">
            <thead className="text-xs uppercase bg-zinc-800 text-indigo-300 border-b border-indigo-700">
              <tr>
                <th className="px-3 py-4">#</th>
                <th className="px-3 py-4">Product</th>
                <th className="px-3 py-4">Product Image</th>
                <th className="px-3 py-4">Number of Reviews</th>
                <th className="px-3 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              {products.map((product, i) => (
                <tr
                  key={product._id}
                  className="border-b border-zinc-800 hover:bg-zinc-800 transition"
                >
                  <td className="px-3 py-4 font-medium">{i + 1}</td>
                  <td className="px-3 py-4">{product.name}</td>
                  <td className="px-3 py-4">
                    <img
                      src={product.image[0].url}
                      alt={product.name}
                      className="w-15 h-15 object-cover rounded"
                    />
                  </td>
                  <td className="px-3 py-4">{product.reviews?.length || 0}</td>
                  <td className="px-3 py-4 text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="text-xs bg-blue-600 cursor-pointer hover:bg-blue-700"
                          onClick={() => handleViewReviews(product)}
                        >
                          <Eye size={14} className="mr-1" /> View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-zinc-900 border border-indigo-700 text-white">
                        <DialogHeader>
                          <DialogTitle className="text-indigo-400">
                            Reviews for {selectedProduct?.name}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto">
                          {reviews && reviews.length > 0 ? (
                            reviews.map((review) => (
                              <div
                                key={review._id}
                                className="p-4 border border-zinc-700 rounded-lg bg-zinc-800"
                              >
                                <p>
                                  <strong>User:</strong> {review.name}
                                </p>
                                <p>
                                  <strong>Rating:</strong> {review.rating}{" "}
                                  <Star
                                    className="inline text-yellow-400 ml-1"
                                    size={16}
                                  />
                                </p>
                                <p>
                                  <strong>Comment:</strong> {review.comment}
                                </p>
                                <Button
                                  onClick={() =>
                                    handleDeleteReview(
                                      selectedProduct?._id,
                                      review._id
                                    )
                                  }
                                  className="mt-2 text-xs cursor-pointer bg-rose-600 hover:bg-rose-700"
                                >
                                  <Trash2 size={14} className="mr-1" />{" "}
                                  {loading ? "Deleting..." : "Delete Review"}
                                </Button>
                              </div>
                            ))
                          ) : (
                            <p className="text-center text-zinc-400">
                              No reviews found.
                            </p>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const ProtectedAllReviews = withRoleAccess(AllReviews);
export default ProtectedAllReviews;
