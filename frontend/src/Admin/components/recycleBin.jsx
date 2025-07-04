import moment from "moment";
import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import {
  getAdminProducts,
  getAdminSoftDeleted,
  parmanentDeleteAdminProduct,
  removeSuccess,
  restoreDeletedProduct,
} from "../../features/Admin/adminSlice";
import { toast } from "sonner";
import Loader from "../../components/Loader";
const RecycleBin = () => {
  const { softDeleted, deleteLoading, deleting } = useSelector(
    (state) => state.admin
  );
  console.log("softdeleted data", softDeleted);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAdminSoftDeleted());
  }, [dispatch]);

  const handleRestore = (id) => {
    dispatch(restoreDeletedProduct(id)).then((action) => {
      if (
        action.meta.requestStatus === "fulfilled" &&
        action.payload?.success
      ) {
        toast.success("Product restored successfully");
        dispatch(getAdminSoftDeleted()); // refresh recycle bin
        dispatch(getAdminProducts()); // refresh main list
      } else {
        toast.error(action.payload?.message || "Failed to restore product");
      }
    });
  };

  const handleDelete = (id) => {
    dispatch(parmanentDeleteAdminProduct(id)).then((action) => {
      if (
        action.meta.requestStatus === "fulfilled" &&
        action.payload?.success
      ) {
        toast.success("Product deleted successfully");
        dispatch(removeSuccess("delete"));
        dispatch(getAdminSoftDeleted());
      } else {
        toast.error(action.payload?.message || "Failed to delete product");
      }
    });
  };

  return (
    <div className="flex justify-end mb-4">
      <Dialog>
        <DialogTrigger className="inline-flex cursor-pointer items-center px-4 py-2 bg-zinc-900 hover:bg-amber-500 text-white text-sm font-medium rounded-md shadow">
          ♻️ Recycle Bin
        </DialogTrigger>
        <DialogContent className="bg-zinc-900 text-white border border-zinc-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg text-white">
              Soft Deleted Products
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {/* Replace this mock data with real soft-deleted products */}
            {deleteLoading ? (
              <p>Loading deleted products...</p>
            ) : (
              softDeleted.length > 0 &&
              softDeleted.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center gap-4 p-3 border border-zinc-700 rounded-md bg-zinc-800"
                >
                  <img
                    src={product.image[0].url}
                    alt={product.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex flex-col flex-grow">
                    <span className="font-semibold">{product.name}</span>
                    <span className="text-xs text-zinc-400">
                      Deleted at:{" "}
                      {moment(product.deletedAt).format("MMMM Do YYYY, h:mm A")}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRestore(product._id)}
                    className="px-3 py-1.5 cursor-pointer bg-green-600 hover:bg-green-700 text-white text-xs rounded"
                  >
                    Restore
                  </button>
                  <button
                    disabled={deleting[product._id]}
                    onClick={() => handleDelete(product._id)}
                    className="px-3 py-1.5 cursor-pointer bg-red-500 hover:bg-red-600 text-white text-xs rounded"
                  >
                    {deleting[product._id] ? "Deleting....." : "Delete"}
                  </button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecycleBin;
