import React from "react";
import withRoleAccess from "../Security/withRoleAccess";
import { Button } from "../components/ui/button";
import { Search } from "lucide-react";
import { useSelector } from "react-redux";

const AllOrders = () => {
  const { orders, loading, success, error } = useSelector(
    (state) => state.admin
  );
  console.log("all orders", orders);
  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 mt-20">
        <h1 className="text-3xl font-bold text-indigo-400">All Orders</h1>
        {/* <div className="flex items-center bg-zinc-900 border border-indigo-600 px-4 py-2 rounded-lg">
          <Search className="text-indigo-400 mr-2" size={18} />
          <input
            type="text"
            placeholder="Search by Order ID / User..."
            className="bg-transparent outline-none text-white"
          />
        </div> */}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow border border-indigo-800">
        <table className="min-w-full text-sm text-left bg-zinc-900">
          <thead className="text-xs uppercase bg-zinc-800 text-indigo-300 border-b border-indigo-700">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Payment</th>
              <th className="px-6 py-3">Delivery</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-zinc-300">
            {orders.map((_, i) => (
              <tr
                key={i}
                className="border-b border-zinc-800 hover:bg-zinc-800 transition"
              >
                <td className="px-6 py-4 font-medium">{i + 1}</td>
                <td className="px-6 py-4">ORD1234{i}</td>
                <td className="px-6 py-4">User{i + 1}</td>
                <td className="px-6 py-4">2025-07-01</td>
                <td className="px-6 py-4">₹{(i + 1) * 1500}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      i % 2 === 0
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {i % 2 === 0 ? "Paid" : "Pending"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      i % 3 === 0
                        ? "bg-rose-500/20 text-rose-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {i % 3 === 0 ? "Not Delivered" : "Delivered"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Button className="text-xs bg-blue-600 hover:bg-blue-700">
                    View
                  </Button>
                  <Button className="text-xs bg-green-600 hover:bg-green-700">
                    Deliver
                  </Button>
                  <Button className="text-xs bg-rose-600 hover:bg-rose-700">
                    Cancel
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

const ProtectedAllOrders = withRoleAccess(AllOrders);
export default ProtectedAllOrders;
