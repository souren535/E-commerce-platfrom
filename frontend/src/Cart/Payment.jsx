import React from "react";
import PageTitle from "../components/PageTitle";
import CheckoutPath from "../features/shipping_page/components/CheckoutPath";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import withAuthProtection from "../Security/withAuthProtection";

const Payment = () => {
  const orderItem = JSON.parse(sessionStorage.getItem("orderItem"));
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { shippinginfo } = useSelector((state) => state.cart);
  const completePayment = async (amount) => {
    try {
      const { data: keyData } = await axios.get("/api/payment/getKey");
      const { key } = keyData;
      const { data: orderData } = await axios.post("/api/payment/process", {
        amount,
      });
      const { order } = orderData;

      const options = {
        key,
        amount,
        currency: "INR",
        name: "ShopEasy",
        description: "Ecommerce Website Payment Transaction",
        order_id: order.id,
        handler: async (response) => {
          const { data } = await axios.post(
            "/api/payment/paymentVerification",
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }
          );
          if (data.success) {
            navigate(`/paymentSuccess?reference=${data.reference}`, {
              replace: true,
            });
          } else {
            alert("Payment Verification Failed");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: shippinginfo?.phoneNumber || "",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <PageTitle title="Payment Processing" />

      {/* Full page wrapper */}
      <div className="bg-zinc-950 min-h-screen w-full flex flex-col px-4 py-6">
        {/* Checkout path at top */}
        <div className="w-full max-w-6xl mx-auto mb-6 mt-10">
          <CheckoutPath activePath={2} />
        </div>

        {/* Centered payment box in remaining space */}
        <div className="flex-grow flex justify-center items-center">
          <div className="bg-zinc-900 w-full max-w-4xl rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-lg">
            {/* Total Amount */}
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center gap-4 bg-zinc-800 p-6">
              <span className="text-lg font-semibold text-white text-center">
                Total Amount
              </span>
              <h1 className="text-5xl md:text-6xl text-white font-bold">
                ₹{orderItem?.total}
              </h1>
            </div>

            {/* Summary + Button */}
            <div className="w-full md:w-1/2 text-white bg-zinc-900 p-6 flex flex-col">
              <div className="text-center text-2xl font-semibold mb-4">
                Payment Page
              </div>

              <span className="text-lg font-medium mb-2">Summary</span>
              <div className="flex-grow overflow-y-auto space-y-4 max-h-64">
                {cartItems.map((cart, i) => (
                  <div
                    key={i}
                    className="border-b border-zinc-700 pb-2 text-sm md:text-base"
                  >
                    <div className="flex justify-between">
                      <span>{cart.name}</span>
                      <span>₹{(cart.price * cart.quantity).toFixed(2)}</span>
                    </div>
                    <span className="block">Quantity: {cart.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={() => completePayment(orderItem.total)}
                  className="py-2 px-6 w-full md:w-2/3 bg-zinc-700 rounded-xl hover:bg-zinc-600 transition-all cursor-pointer"
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ProtectedPayment = withAuthProtection(Payment);

export default ProtectedPayment;
