import React, { createContext, useState, useEffect, useContext } from "react";

const CartContext = createContext();

const CART_KEY = "cravings_cart";
const emptyCart = { restaurantId: null, restaurantName: "", items: [] };

// Generate a deterministic or unique ID for a customized item
const generateCartItemId = (itemId, customization) => {
  if (!customization || !customization.isCustomized) {
    return String(itemId);
  }
  const size = customization.size || "";
  const base = customization.baseOrCrust || "";
  const spice = customization.spiceLevel || "";
  const addOns = (customization.selectedAddOns || [])
    .map((a) => a.name)
    .sort()
    .join(",");
  const sauces = (customization.selectedSauces || [])
    .map((s) => s.name)
    .sort()
    .join(",");
  const notes = (customization.specialInstructions || "").trim().toLowerCase();

  return `${itemId}__${size}__${base}__${spice}__${addOns}__${sauces}__${notes}`;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(CART_KEY));
      if (!saved || !Array.isArray(saved.items)) return emptyCart;
      
      // Ensure all items have cartItemId
      const migratedItems = saved.items.map((i) => ({
        ...i,
        cartItemId: i.cartItemId || generateCartItemId(i._id, i.customization),
      }));
      return { ...saved, items: migratedItems };
    } catch {
      return emptyCart;
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const totalItems = cart.items.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);
  const totalPrice = cart.items.reduce(
    (sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 0),
    0
  );

  // Total quantity for a base item ID (across all its customized variants)
  const getItemQuantity = (itemId) => {
    return cart.items
      .filter((i) => i._id === itemId || i.itemId === itemId)
      .reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);
  };

  // Specific quantity for a given cartItemId
  const getCustomItemQuantity = (cartItemId) => {
    const found = cart.items.find((i) => i.cartItemId === cartItemId);
    return found ? found.quantity : 0;
  };

  // Get all customized variants of an item currently in cart
  const getItemVariants = (itemId) => {
    return cart.items.filter((i) => i._id === itemId || i.itemId === itemId);
  };

  // Add Item to cart (with optional customization and initial quantity)
  const addItem = (item, restaurantId, restaurantName, customization = null, initialQty = 1) => {
    if (cart.restaurantId && cart.restaurantId !== restaurantId) {
      return "different_restaurant";
    }

    const isCustomized = !!(customization && (customization.isCustomized || customization.customizationPrice > 0 || customization.size || customization.specialInstructions));
    const cartItemId = generateCartItemId(item._id, isCustomized ? customization : null);
    const basePrice = Number(item.price) || 0;
    const extraPrice = isCustomized ? Number(customization?.customizationPrice || 0) : 0;
    const finalUnitPrice = basePrice + extraPrice;

    setCart((prev) => {
      const exists = prev.items.find((i) => i.cartItemId === cartItemId);
      const updatedItems = exists
        ? prev.items.map((i) =>
            i.cartItemId === cartItemId
              ? { ...i, quantity: i.quantity + initialQty }
              : i
          )
        : [
            ...prev.items,
            {
              _id: item._id,
              itemId: item._id,
              cartItemId,
              itemName: item.itemName,
              basePrice,
              price: finalUnitPrice,
              image: item.image,
              category: item.category,
              foodType: item.foodType,
              isCustomMealStudio: !!item.isCustomMealStudio,
              quantity: initialQty,
              customization: isCustomized
                ? {
                    isCustomized: true,
                    size: customization.size || "",
                    sizeExtra: customization.sizeExtra || 0,
                    baseOrCrust: customization.baseOrCrust || "",
                    baseExtra: customization.baseExtra || 0,
                    spiceLevel: customization.spiceLevel || "",
                    selectedAddOns: customization.selectedAddOns || [],
                    selectedSauces: customization.selectedSauces || [],
                    specialInstructions: customization.specialInstructions || "",
                    customizationPrice: extraPrice,
                  }
                : null,
            },
          ];

      return { restaurantId, restaurantName, items: updatedItems };
    });

    return "added";
  };

  const increaseItem = (cartItemId) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        (i.cartItemId === cartItemId || i._id === cartItemId)
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ),
    }));
  };

  const decreaseItem = (cartItemId) => {
    setCart((prev) => {
      const updatedItems = prev.items
        .map((i) =>
          (i.cartItemId === cartItemId || i._id === cartItemId)
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0);

      return {
        ...prev,
        items: updatedItems,
        restaurantId: updatedItems.length ? prev.restaurantId : null,
        restaurantName: updatedItems.length ? prev.restaurantName : "",
      };
    });
  };

  const removeItem = (cartItemId) => {
    setCart((prev) => {
      const updatedItems = prev.items.filter(
        (i) => i.cartItemId !== cartItemId && i._id !== cartItemId
      );

      return {
        ...prev,
        items: updatedItems,
        restaurantId: updatedItems.length ? prev.restaurantId : null,
        restaurantName: updatedItems.length ? prev.restaurantName : "",
      };
    });
  };

  const clearCart = () => setCart(emptyCart);

  // Clears cart and replaces with new restaurant's item
  const replaceCart = (item, restaurantId, restaurantName, customization = null, initialQty = 1) => {
    const isCustomized = !!(customization && (customization.isCustomized || customization.customizationPrice > 0 || customization.size));
    const cartItemId = generateCartItemId(item._id, isCustomized ? customization : null);
    const basePrice = Number(item.price) || 0;
    const extraPrice = isCustomized ? Number(customization?.customizationPrice || 0) : 0;
    const finalUnitPrice = basePrice + extraPrice;

    setCart({
      restaurantId,
      restaurantName,
      items: [
        {
          _id: item._id,
          itemId: item._id,
          cartItemId,
          itemName: item.itemName,
          basePrice,
          price: finalUnitPrice,
          image: item.image,
          category: item.category,
          foodType: item.foodType,
          isCustomMealStudio: !!item.isCustomMealStudio,
          quantity: initialQty,
          customization: isCustomized
            ? {
                isCustomized: true,
                size: customization.size || "",
                sizeExtra: customization.sizeExtra || 0,
                baseOrCrust: customization.baseOrCrust || "",
                baseExtra: customization.baseExtra || 0,
                spiceLevel: customization.spiceLevel || "",
                selectedAddOns: customization.selectedAddOns || [],
                selectedSauces: customization.selectedSauces || [],
                specialInstructions: customization.specialInstructions || "",
                customizationPrice: extraPrice,
              }
            : null,
        },
      ],
    });
  };

  const value = {
    cart,
    totalItems,
    totalPrice,
    getItemQuantity,
    getCustomItemQuantity,
    getItemVariants,
    addItem,
    increaseItem,
    decreaseItem,
    removeItem,
    clearCart,
    replaceCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);