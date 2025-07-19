import React from "react";
import Footer from "../components/Footer";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../components/ui/button";
import { useSelector } from "react-redux";
import CheckoutPath from "../features/shipping_page/components/CheckoutPath";
import PageTitle from "../components/PageTitle";
import { useNavigate } from "react-router-dom";
import withAuthProtection from "../Security/withAuthProtection";
const OrderConfirmPage = () => {
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const subTotal = cartItems.reduce(
    (asc, item) => asc + item.price * item.quantity,
    0
  );
  const shipping = subTotal > 500 ? 0 : 500;
  const tax = subTotal * 0.18;
  const total = subTotal + tax + shipping;
  const navigate = useNavigate();
  const ProceedToPayment = () => {
    const data = {
      subTotal,
      tax,
      shipping,
      total,
    };
    sessionStorage.setItem("orderItem", JSON.stringify(data));
    navigate("/process/payment");
  };
  return (
    <>
      <PageTitle title="Confirm Order" />
      <div className="bg-zinc-950 min-h-screen flex flex-col justify-center items-center px-2 sm:px-2 md:px-4">
        <div className="flex items-center mb-6 sm:mb-4 md:mb-8 lg:mt-15 w-full max-w-[1600px] justify-center">
          <CheckoutPath activePath={1} />
        </div>
        <div className="bg-zinc-900 w-full max-w-full sm:max-w-[95vw] md:max-w-[98vw] lg:max-w-[1400px] md:h-auto lg:mb-7 md:pb-7 lg:h-auto sm:h-auto xl:h-auto rounded-2xl shadow-lg p-2 sm:p-3 md:p-6 flex flex-col">
          <div className="pb-3 sm:pb-3 md:pb-4 text-center">
            <h1 className="text-white text-lg sm:text-xl md:text-4xl font-semibold">
              Order Confirmation
            </h1>
          </div>
          <div className="flex w-full flex-col pt-4 sm:pt-6 md:pt-6 lg:pt-8 px-0 sm:px-2 md:px-4">
            {/* 1st Table */}
            <div className="w-full mb-4 sm:mb-5 md:mb-6 overflow-x-auto">
              <div className="min-w-[400px] sm:min-w-0">
                <Table className="caption-top min-w-[400px] sm:min-w-0 md:h-[100px] lg:h-[120px]">
                  <TableCaption className="text-left text-white text-base sm:text-lg md:text-xl lg:text-2xl font-semibold tracking-wide mt-0 mb-2 sm:mb-4">
                    Shipping Details
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="bg-zinc-800 border border-zinc-700 text-white font-semibold text-xs sm:text-sm md:text-base">
                        Name
                      </TableHead>
                      <TableHead className="bg-zinc-800 border border-zinc-700 text-white font-semibold text-xs sm:text-sm md:text-base">
                        Phone
                      </TableHead>
                      <TableHead className="bg-zinc-800 border border-zinc-700 text-white font-semibold text-xs sm:text-sm md:text-base">
                        Address
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-white border border-zinc-700 text-xs sm:text-sm md:text-base">
                        {user.name}
                      </TableCell>
                      <TableCell className="text-white border border-zinc-700 text-xs sm:text-sm md:text-base">
                        {shippingInfo.phoneNumber}
                      </TableCell>
                      <TableCell className="text-white border border-zinc-700 text-xs sm:text-sm md:text-base">
                        {shippingInfo.address}, {shippingInfo.city},{" "}
                        {shippingInfo.state},{shippingInfo.country}-
                        {shippingInfo.pincode}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* 2nd table */}
            <div className="w-full mb-4 sm:mb-5 md:mb-6 overflow-x-auto">
              <div className="min-w-[500px] sm:min-w-0">
                <Table className="caption-top min-w-[500px] sm:min-w-0 md:h-[100px] lg:h-[120px]">
                  <TableCaption className="text-left text-white text-base sm:text-lg md:text-xl lg:text-2xl font-semibold tracking-wide mt-0 mb-2 sm:mb-4">
                    Billing Details
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="bg-zinc-800 border border-zinc-700 text-white font-semibold text-xs sm:text-sm md:text-base">
                        Image
                      </TableHead>
                      <TableHead className="bg-zinc-800 border border-zinc-700 text-white font-semibold text-xs sm:text-sm md:text-base">
                        ProductName
                      </TableHead>
                      <TableHead className="bg-zinc-800 border border-zinc-700 text-white font-semibold text-xs sm:text-sm md:text-base">
                        price
                      </TableHead>
                      <TableHead className="bg-zinc-800 border border-zinc-700 text-white font-semibold text-xs sm:text-sm md:text-base">
                        Quantity
                      </TableHead>
                      <TableHead className="bg-zinc-800 border border-zinc-700 text-white font-semibold text-xs sm:text-sm md:text-base">
                        Total price
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item.product}>
                        <TableCell className="text-white text-center border border-zinc-700">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] md:w-[70px] md:h-[70px] mx-auto"
                          />
                        </TableCell>
                        <TableCell className="text-white border border-zinc-700 text-xs sm:text-sm md:text-base">
                          {item.name}
                        </TableCell>
                        <TableCell className="text-white border border-zinc-700 text-xs sm:text-sm md:text-base">
                          {item.price}
                        </TableCell>
                        <TableCell className="text-white border border-zinc-700 text-xs sm:text-sm md:text-base">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-white border border-zinc-700 text-xs sm:text-sm md:text-base">
                          {item.quantity * item.price}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* 3rd table */}
            <div className="w-full mb-4 sm:mb-5 md:mb-6 overflow-x-auto">
              <div className="min-w-[400px] sm:min-w-0">
                <Table className="caption-top min-w-[400px] sm:min-w-0 md:h-[100px] lg:h-[120px]">
                  <TableCaption className="text-left text-white text-base sm:text-lg md:text-xl lg:text-2xl font-semibold tracking-wide mt-0 mb-2 sm:mb-4">
                    Orber Summary
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="bg-zinc-800 border border-zinc-700 text-white font-semibold text-xs sm:text-sm md:text-base">
                        SubTotal
                      </TableHead>
                      <TableHead className="bg-zinc-800 border border-zinc-700 text-white font-semibold text-xs sm:text-sm md:text-base">
                        Shipping Charges
                      </TableHead>
                      <TableHead className="bg-zinc-800 border border-zinc-700 text-white font-semibold text-xs sm:text-sm md:text-base">
                        GST
                      </TableHead>
                      <TableHead className="bg-zinc-800 border border-zinc-700 text-white font-semibold text-xs sm:text-sm md:text-base">
                        Total
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-white border border-zinc-700 text-xs sm:text-sm md:text-base">
                        {subTotal}
                      </TableCell>
                      <TableCell className="text-white border border-zinc-700 text-xs sm:text-sm md:text-base">
                        {subTotal > 500 ? "Free" : 500}
                      </TableCell>
                      <TableCell className="text-white border border-zinc-700 text-xs sm:text-sm md:text-base">
                        {tax}
                      </TableCell>
                      <TableCell className="text-white border border-zinc-700 text-xs sm:text-sm md:text-base">
                        {total}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center mt-2 sm:mt-4">
            <Button
              onClick={ProceedToPayment}
              className={`w-full sm:w-2/3 md:w-1/2 lg:w-1/4 xl:w-1/5 text-base sm:text-lg border-1 border-zinc-700 justify-center hover:bg-zinc-900 cursor-pointer items-center text-white bg-zinc-800 py-4 sm:py-6`}
            >
              Proceed to Payment
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const ProtectedOrderConfirmPage = withAuthProtection(OrderConfirmPage);
export default ProtectedOrderConfirmPage;
