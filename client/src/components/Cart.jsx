import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../config/api.config.js";
import toast from "react-hot-toast";
import { foodTypeDot } from "./publicRestaurantDetails/helpers";
import {
  IoTrashOutline,
  IoArrowBack,
  IoStorefrontOutline,
  IoAdd,
  IoRemove,
  IoShieldCheckmarkOutline,
  IoTicketOutline,
  IoSparkles,
  IoFlame,
} from "react-icons/io5";
import { MdOutlineRestaurantMenu, MdArrowForward, MdNotes } from "react-icons/md";
import { TbChefHat } from "react-icons/tb";

const Cart = () => {
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);

  const {
    cart,
    totalItems,
    totalPrice,
    increaseItem,
    decreaseItem,
    removeItem,
    clearCart,
  } = useCart();

  const { isLogin, role, user } = useAuth();
  const navigate = useNavigate();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    if (promoCode.toUpperCase() === "CRAVINGS20" || promoCode.toUpperCase() === "CRAVINGS") {
      setAppliedPromo({ code: promoCode.toUpperCase(), discount: 20 });
      toast.success("Promo code applied! ₹20 discount added.");
    } else {
      toast.error("Invalid promo code. Try 'CRAVINGS20'");
    }
  };

  const handlePlaceOrder = async () => {
    if (!isLogin) {
      toast.error("Please login to place your order");
      navigate("/login");
      return;
    }

    if (role !== "user" && role !== "customer") {
      toast.error("Only student/customer accounts can place food orders");
      return;
    }

    if (!cart?.items?.length) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setIsPlacingOrder(true);

      // 1. Create order in DB with full customization details
      const createOrderRes = await api.post("/order/create", {
        restaurantId: cart.restaurantId,
        paymentMethod: "upi",
        orderItems: cart.items.map((i) => ({
          itemId: i.itemId || i._id,
          itemName: i.itemName,
          price: i.price,
          quantity: i.quantity,
          isCustomMealStudio: !!i.isCustomMealStudio,
          customization: i.customization || null,
        })),
      });
      const appOrderId = createOrderRes?.data?.data?._id;

      // 2. Request backend order creation
      const paymentOrderRes = await api.post("/payment/create-order", {
        orderId: appOrderId,
      });
      const paymentData = paymentOrderRes?.data?.data;

      // In demo mode (when Razorpay credentials are not added to server/.env)
      if (paymentData?.isDemo) {
        await api.post("/payment/verify", {
          orderId: appOrderId,
          razorpay_order_id: paymentData.razorpayOrderId,
          razorpay_payment_id: `pay_demo_${Date.now()}`,
          razorpay_signature: "demo_signature",
        });

        toast.success("🎉 Order placed successfully! Tracking your delivery...");
        clearCart();
        navigate(`/track-order/${appOrderId}`);
        return;
      }

      // 3. Load Razorpay JS SDK
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Payment gateway failed to load. Please check your connection.");
        return;
      }

      // 4. Open Razorpay modal
      const options = {
        key: paymentData.key,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: "Cravings Food Delivery",
        description: `Order from ${cart.restaurantName}`,
        order_id: paymentData.razorpayOrderId,
        handler: async function (response) {
          try {
            await api.post("/payment/verify", {
              orderId: appOrderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast.success("🎉 Payment verified! Tracking your order live...");
            clearCart();
            navigate(`/track-order/${appOrderId}`);
          } catch (err) {
            toast.error(
              err.response?.data?.message || "Payment verification failed"
            );
          }
        },
        prefill: {
          name: user.fullName || user.fullname,
          email: user.email,
        },
        theme: { color: "#ea580c" },
        modal: {
          ondismiss: () => toast.error("Payment cancelled"),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong while placing order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const discount = appliedPromo?.discount || 0;
  const platformFee = 5;
  const deliveryFee = 0;
  const tax = Math.round(totalPrice * 0.05 * 100) / 100;
  const finalTotal = Math.max(0, totalPrice + platformFee + deliveryFee + tax - discount);

  if (!cart?.items?.length) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-4">
          <div className="h-28 w-28 rounded-full bg-orange-100/80 flex items-center justify-center text-5xl shadow-inner animate-float">
            🛒
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 text-white font-black text-sm shadow-md">
            0
          </span>
        </div>

        <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 mb-2">
          Your cart is feeling light
        </h2>
        <p className="text-sm text-slate-500 max-w-sm mb-6">
          Explore the best restaurants, customize dishes to your taste, and satisfy your cravings in minutes.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/order-now"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-orange-600/30 hover:from-orange-500 hover:to-amber-500 active:scale-95 transition"
          >
            <span>Explore Restaurants</span>
            <MdArrowForward size={18} />
          </Link>
          <Link
            to="/customize-meal"
            className="inline-flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-6 py-3.5 text-sm font-extrabold text-slate-800 shadow-xs hover:bg-slate-50 active:scale-95 transition"
          >
            <TbChefHat size={18} className="text-orange-600" />
            <span>Custom Meal Studio</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf7] pb-24 pt-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 active:scale-95 transition"
            >
              <IoArrowBack size={20} />
            </button>
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
                <span>Checkout & Order</span>
              </h1>
              <p className="text-xs sm:text-sm font-bold text-orange-600 flex items-center gap-1.5 mt-0.5">
                <IoStorefrontOutline />
                <span>Ordering from: <strong>{cart.restaurantName}</strong></span>
              </p>
            </div>
          </div>

          <button
            onClick={clearCart}
            className="flex items-center gap-1 text-xs font-extrabold text-red-600 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-xl border border-red-100 transition"
          >
            <IoTrashOutline size={15} />
            <span>Empty Cart</span>
          </button>
        </div>

        {/* 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Cart Items List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-3xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
              <h3 className="font-heading text-base font-black text-slate-900">
                Selected Items ({totalItems})
              </h3>

              <div className="divide-y divide-slate-100">
                {cart.items.map((item) => {
                  const isCustom = item.customization?.isCustomized;
                  const custom = item.customization || {};

                  return (
                    <div
                      key={item.cartItemId || item._id}
                      className="py-4 first:pt-0 last:pb-0 flex flex-col gap-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        {/* Image & Title */}
                        <div className="flex items-start gap-3.5 min-w-0">
                          <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
                            {item.image?.url ? (
                              <img
                                src={item.image.url}
                                alt={item.itemName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-orange-50 text-orange-400">
                                <MdOutlineRestaurantMenu size={24} />
                              </div>
                            )}
                            <span
                              className={`absolute top-1 left-1 w-2.5 h-2.5 rounded-full border border-white ${foodTypeDot(
                                item.foodType
                              )}`}
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="font-heading text-sm font-extrabold text-slate-900">
                                {item.itemName}
                              </h4>
                              {isCustom && (
                                <span className="inline-flex items-center gap-0.5 rounded-md bg-orange-100 px-1.5 py-0.5 text-[9px] font-black text-orange-700">
                                  <IoSparkles size={9} />
                                  <span>Customized</span>
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-bold text-slate-400 mt-0.5">
                              ₹{item.price} each
                            </p>
                          </div>
                        </div>

                        {/* Counter & Price */}
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <div className="flex items-center gap-1.5 rounded-xl bg-orange-50 p-1 border border-orange-100">
                            <button
                              onClick={() => decreaseItem(item.cartItemId || item._id)}
                              className="flex h-6 w-6 items-center justify-center rounded-lg bg-white text-orange-700 shadow-xs hover:bg-orange-600 hover:text-white transition active:scale-90"
                            >
                              <IoRemove size={14} />
                            </button>
                            <span className="font-heading font-black text-xs min-w-4 text-center text-slate-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => increaseItem(item.cartItemId || item._id)}
                              className="flex h-6 w-6 items-center justify-center rounded-lg bg-white text-orange-700 shadow-xs hover:bg-orange-600 hover:text-white transition active:scale-90"
                            >
                              <IoAdd size={14} />
                            </button>
                          </div>

                          <div className="text-right min-w-16">
                            <p className="font-heading text-sm font-black text-slate-900">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>

                          <button
                            onClick={() => removeItem(item.cartItemId || item._id)}
                            className="text-slate-400 hover:text-red-500 p-1 transition"
                            title="Remove"
                          >
                            <IoTrashOutline size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Customization Details Breakdown */}
                      {isCustom && (
                        <div className="ml-0 sm:ml-19.5 bg-slate-50/80 rounded-2xl p-3 border border-slate-200/60 text-[11px] space-y-1.5">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {custom.size && (
                              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-extrabold text-slate-800">
                                Size: {custom.size}
                              </span>
                            )}
                            {custom.baseOrCrust && (
                              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-extrabold text-slate-800">
                                Base: {custom.baseOrCrust}
                              </span>
                            )}
                            {custom.spiceLevel && (
                              <span className="px-2 py-0.5 rounded-md bg-orange-100/60 border border-orange-200 font-extrabold text-orange-800 flex items-center gap-0.5">
                                <IoFlame size={10} />
                                <span>{custom.spiceLevel}</span>
                              </span>
                            )}
                          </div>

                          {/* Add-ons list */}
                          {custom.selectedAddOns?.length > 0 && (
                            <div className="text-slate-600 flex flex-wrap items-center gap-1">
                              <span className="font-bold text-slate-700">Add-ons:</span>
                              {custom.selectedAddOns.map((addon, idx) => (
                                <span
                                  key={idx}
                                  className="bg-amber-50 text-amber-900 border border-amber-200/80 px-1.5 py-0.2 rounded-md font-semibold"
                                >
                                  +{addon.name} (+₹{addon.price})
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Sauces list */}
                          {custom.selectedSauces?.length > 0 && (
                            <div className="text-slate-600 flex flex-wrap items-center gap-1">
                              <span className="font-bold text-slate-700">Sauces:</span>
                              {custom.selectedSauces.map((sauce, idx) => (
                                <span
                                  key={idx}
                                  className="bg-emerald-50 text-emerald-900 border border-emerald-200/80 px-1.5 py-0.2 rounded-md font-semibold"
                                >
                                  +{sauce.name}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Kitchen Note */}
                          {custom.specialInstructions && (
                            <div className="text-orange-950 font-medium flex items-center gap-1 bg-orange-100/50 p-1.5 rounded-lg border border-orange-200/60">
                              <MdNotes className="text-orange-600 flex-shrink-0" />
                              <span>
                                <strong>Note:</strong> "{custom.specialInstructions}"
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add more items link */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-orange-50/70 border border-orange-100 text-xs font-bold text-slate-700 gap-2">
              <span>Want something else from {cart.restaurantName}?</span>
              <div className="flex items-center gap-3">
                <Link
                  to="/customize-meal"
                  className="text-amber-700 hover:underline font-black flex items-center gap-1"
                >
                  <TbChefHat />
                  <span>Build Custom Box</span>
                </Link>
                <Link
                  to={`/restaurant-details/${cart.restaurantId}`}
                  className="text-orange-600 hover:underline font-black flex items-center gap-0.5"
                >
                  <span>Add More Dishes</span>
                  <MdArrowForward />
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Bill Details & Payment */}
          <div className="lg:col-span-5 space-y-4 sticky top-24">
            {/* Promo Code Card */}
            <div className="rounded-3xl bg-white border border-slate-200/80 p-5 shadow-xs">
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <IoTicketOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-600 text-base" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter coupon (e.g. CRAVINGS20)"
                    className="w-full pl-9 pr-3 py-2.5 text-xs font-bold uppercase rounded-2xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-slate-800 active:scale-95 transition"
                >
                  Apply
                </button>
              </form>

              {appliedPromo && (
                <div className="mt-3 flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 p-2.5 rounded-xl font-bold border border-emerald-100">
                  <span>Coupon {appliedPromo.code} Applied</span>
                  <span>-₹{appliedPromo.discount}</span>
                </div>
              )}
            </div>

            {/* Bill Summary */}
            <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h3 className="font-heading text-base font-black text-slate-900 border-b border-slate-100 pb-3">
                Bill Summary
              </h3>

              <div className="space-y-2.5 text-xs font-semibold text-slate-600">
                <div className="flex justify-between">
                  <span>Item Total ({totalItems} items)</span>
                  <span className="font-bold text-slate-900">₹{totalPrice.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Partner Fee</span>
                  <span className="font-extrabold text-emerald-600">FREE</span>
                </div>

                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span className="text-slate-900">₹{platformFee.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Taxes & Restaurant GST (5%)</span>
                  <span className="text-slate-900">₹{tax.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-extrabold">
                    <span>Discount Applied</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t border-dashed border-slate-200 my-2 pt-3 flex justify-between items-center text-slate-900">
                  <div>
                    <span className="font-heading text-base font-black">To Pay</span>
                    <p className="text-[10px] text-slate-400 font-semibold">Inclusive of all taxes</p>
                  </div>
                  <span className="font-heading text-2xl font-black text-orange-600">
                    ₹{finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                disabled={isPlacingOrder}
                onClick={handlePlaceOrder}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-orange-600/30 hover:from-orange-500 hover:to-amber-500 active:scale-95 disabled:opacity-50 transition"
              >
                <IoShieldCheckmarkOutline size={18} />
                <span>{isPlacingOrder ? "Processing Payment..." : `Pay ₹${finalTotal.toFixed(2)} & Order`}</span>
              </button>

              <p className="text-center text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-1">
                <IoShieldCheckmarkOutline className="text-emerald-500" />
                <span>100% Secure Checkout via UPI & Cards</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;