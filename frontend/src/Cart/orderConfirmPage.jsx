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
      <div className="bg-zinc-950 min-h-screen flex flex-col justify-center items-center px-4">
        <div className="flex items-center mb-8 lg:mt-15 w-full max-w-[1600px] justify-center">
          <CheckoutPath activePath={1} />
        </div>
        <div className="bg-zinc-900 w-full max-w-[1400px] md:h-auto lg:mb-7 md:pb-7 lg:h-auto sm:h-auto xl:h-auto rounded-2xl shadow-lg p-6 flex flex-col">
          <div className="pb-5 md:pb-4 text-center">
            <h1 className="text-white text-xl md:text-4xl font-semibold">
              Order Confirmation
            </h1>
          </div>
          <div className="flex w-full flex-col pt-8 md:pt-6 lg:pt-8 px-4">
            {/* 1st Table */}
            <div className="w-full mb-6">
              <Table className="caption-top md:h-[100px] lg:h-[120px]">
                <TableCaption className="text-left text-white md:text-xl lg:text-2xl font-semibold tracking-wide mt-0 mb-4">
                  Shipping Details
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-zinc-800 border border-zinc-700 text-white font-semibold">
                      Name
                    </TableHead>
                    <TableHead className="bg-zinc-800 border border-zinc-700 text-white font-semibold">
                      Phone
                    </TableHead>
                    <TableHead className="bg-zinc-800 border border-zinc-700 text-white font-semibold">
                      Address
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-white border border-zinc-700">
                      {user.name}
                    </TableCell>
                    <TableCell className="text-white border border-zinc-700">
                      {shippingInfo.phoneNumber}
                    </TableCell>
                    <TableCell className="text-white border border-zinc-700">
                      {shippingInfo.address}, {shippingInfo.city},{" "}
                      {shippingInfo.state},{shippingInfo.country}-
                      {shippingInfo.pincode}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* 2nd table */}
            <div className="w-full mb-6">
              <Table className="caption-top md:h-[100px] lg:h-[120px]">
                <TableCaption className="text-left text-white md:text-xl lg:text-2xl font-semibold tracking-wide mt-0 mb-4">
                  Billing Details
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-zinc-800 border border-zinc-700 text-white font-semibold">
                      Image
                    </TableHead>
                    <TableHead className="bg-zinc-800 border border-zinc-700 text-white font-semibold">
                      ProductName
                    </TableHead>
                    <TableHead className="bg-zinc-800 border border-zinc-700 text-white font-semibold">
                      price
                    </TableHead>
                    <TableHead className="bg-zinc-800 border border-zinc-700 text-white font-semibold">
                      Quantity
                    </TableHead>
                    <TableHead className="bg-zinc-800 border border-zinc-700 text-white font-semibold">
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
                          className="md:w-[70px] md:h-[70px]"
                        />
                      </TableCell>
                      <TableCell className="text-white border border-zinc-700">
                        {item.name}
                      </TableCell>
                      <TableCell className="text-white border border-zinc-700">
                        {item.price}
                      </TableCell>
                      <TableCell className="text-white border border-zinc-700">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-white border border-zinc-700">
                        {item.quantity * item.price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* 3rd table */}
            <div className="w-full mb-6">
              <Table className="caption-top md:h-[100px] lg:h-[120px]">
                <TableCaption className="text-left text-white md:text-xl lg:text-2xl font-semibold tracking-wide mt-0 mb-4">
                  Orber Summary
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-zinc-800 border border-zinc-700 text-white font-semibold">
                      SubTotal
                    </TableHead>
                    <TableHead className="bg-zinc-800 border border-zinc-700 text-white font-semibold">
                      Shipping Charges
                    </TableHead>
                    <TableHead className="bg-zinc-800 border border-zinc-700 text-white font-semibold">
                      GST
                    </TableHead>
                    <TableHead className="bg-zinc-800 border border-zinc-700 text-white font-semibold">
                      Total
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-white border border-zinc-700">
                      {subTotal}
                    </TableCell>
                    <TableCell className="text-white border border-zinc-700">
                      {subTotal > 500 ? "Free" : 500}
                    </TableCell>
                    <TableCell className="text-white border border-zinc-700">
                      {tax}
                    </TableCell>
                    <TableCell className="text-white border border-zinc-700">
                      {total}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="w-full justify-center flex">
            <Button
              onClick={ProceedToPayment}
              className={`md:w-1/4 lg:w-1/5 lg:text-lg border-1 border-zinc-700 justify-center hover:bg-zinc-800 cursor-pointer items-center text-white bg-zinc-800 py-6`}
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
