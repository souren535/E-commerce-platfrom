import React from "react";
import withRoleAccess from "../Security/withRoleAccess";
import { Star, Search, Trash2, Eye } from "lucide-react";
import { Button } from "../components/ui/button";

const AllReviews = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-indigo-400">
          All Product Reviews
        </h1>
        <div className="flex items-center bg-zinc-900 border border-indigo-600 px-4 py-2 rounded-lg">
          <Search className="text-indigo-400 mr-2" size={18} />
          <input
            type="text"
            placeholder="Search by product/user/comment..."
            className="bg-transparent outline-none text-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow border border-indigo-800">
        <table className="min-w-full text-sm text-left bg-zinc-900">
          <thead className="text-xs uppercase bg-zinc-800 text-indigo-300 border-b border-indigo-700">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Rating</th>
              <th className="px-6 py-3">Comment</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-zinc-300">
            {[...Array(5)].map((_, i) => (
              <tr
                key={i}
                className="border-b border-zinc-800 hover:bg-zinc-800 transition"
              >
                <td className="px-6 py-4 font-medium">{i + 1}</td>
                <td className="px-6 py-4">Product {i + 1}</td>
                <td className="px-6 py-4">User{i + 1}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded-full font-semibold">
                    <Star size={14} /> {Math.floor(Math.random() * 5) + 1}
                  </span>
                </td>
                <td className="px-6 py-4 max-w-xs truncate">
                  Amazing product! Loved the quality and service.
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Button className="text-xs bg-blue-600 hover:bg-blue-700">
                    <Eye size={14} className="mr-1" />
                    View
                  </Button>
                  <Button className="text-xs bg-rose-600 hover:bg-rose-700">
                    <Trash2 size={14} className="mr-1" />
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProtectedAllReviews = withRoleAccess(AllReviews);
export default ProtectedAllReviews;
