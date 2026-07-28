// // import React, { useState, useEffect } from "react";
// // import { useAuth } from "../../context/AuthContext";
// // import api from "../../config/api.config.js";
// // import toast from "react-hot-toast";
// // import { MdAdd, MdClose, MdSearch, MdFastfood } from "react-icons/md";
// // import { LuPencilLine, LuTrash2, LuEye, LuChevronDown } from "react-icons/lu";

// // const RestaurantMenu = () => {
// //   const [menuItems, setMenuItems] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [isAdding, setIsAdding] = useState(false);
// //   const [search, setSearch] = useState("");
// //   const [formData, setFormData] = useState({
// //     itemName: "",
// //     description: "",
// //     price: "",
// //     category: "",
// //   });

// //   useEffect(() => {
// //     fetchMenuItems();
// //   }, [user?._id]);

// //   const fetchMenuItems = async () => {
// //     if (!user?._id) return;
// //     try {
// //       setLoading(true);
// //       const response = await api.get(`/menu/${user._id}`);
// //       if (response.data.success) setMenuItems(response.data.data);
// //     } catch (error) {
// //       toast.error("Failed to load menu items");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   const handleAddItem = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const response = await api.post("/menu/create", {
// //         ...formData,
// //         restaurantId: user._id,
// //       });
// //       if (response.data.success) {
// //         toast.success("Menu item added");
// //         setMenuItems([...menuItems, response.data.data]);
// //         setFormData({
// //           itemName: "",
// //           description: "",
// //           price: "",
// //           category: "",
// //         });
// //         setIsAdding(false);
// //       }
// //     } catch (error) {
// //       toast.error(error.response?.data?.message || "Failed to add item");
// //     }
// //   };

// //   const filteredItems = menuItems.filter((item) =>
// //     item.itemName.toLowerCase().includes(search.toLowerCase())
// //   );
// //   if (loading) {
// //   return (
// //     <div className="flex items-center justify-center h-full py-20">
// //       <div className="text-center">
// //         <div className="w-12 h-12 border-4 border-(--color-primary) border-t-transparent rounded-full animate-spin mx-auto"></div>
// //         <p className="mt-4 text-(--color-neutral)">Loading Menu...</p>
// //       </div>
// //     </div>
// //   );
// // }

// // return (
// //   <div className="overflow-y-auto h-full">
// //     <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
// //       <div>
// //         <h2 className="text-2xl font-bold">Menu Management</h2>
// //         <p className="text-sm text-(--color-neutral)">
// //           {filteredItems.length} Items Available
// //         </p>
// //       </div>

// //       <div className="flex gap-3 flex-wrap">
// //         <div className="relative">
// //           <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-neutral)" />
// //           <input
// //             type="text"
// //             placeholder="Search menu..."
// //             value={search}
// //             onChange={(e) => setSearch(e.target.value)}
// //             className="pl-10 pr-4 py-2 w-64 rounded-xl border border-(--color-secondary) bg-(--color-base-100) focus:outline-none focus:border-(--color-primary)"
// //           />
// //         </div>

// //         <button
// //           onClick={() => setIsAdding(!isAdding)}
// //           className="flex items-center gap-2 px-5 py-2 rounded-xl bg-(--color-primary) text-white font-semibold hover:opacity-90 transition"
// //         >
// //           {isAdding ? (
// //             <>
// //               <MdClose size={20} />
// //               Cancel
// //             </>
// //           ) : (
// //             <>
// //               <MdAdd size={20} />
// //               Add Item
// //             </>
// //           )}
// //         </button>
// //       </div>
// //     </div>

// //     {isAdding && (
// //       <div className="bg-(--color-base-200) rounded-2xl p-6 mb-6 shadow-sm border border-(--color-secondary)">
// //         <h3 className="text-xl font-semibold mb-5">Add New Menu Item</h3>

// //         <form onSubmit={handleAddItem}>
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
// //             <div>
// //               <label className="text-sm font-medium">Item Name</label>
// //               <input
// //                 type="text"
// //                 name="itemName"
// //                 value={formData.itemName}
// //                 onChange={handleChange}
// //                 required
// //                 placeholder="Burger"
// //                 className="w-full mt-2 px-4 py-3 rounded-xl border border-(--color-secondary) bg-transparent focus:outline-none focus:border-(--color-primary)"
// //               />
// //             </div>

// //             <div>
// //               <label className="text-sm font-medium">Category</label>
// //               <input
// //                 type="text"
// //                 name="category"
// //                 value={formData.category}
// //                 onChange={handleChange}
// //                 required
// //                 placeholder="Fast Food"
// //                 className="w-full mt-2 px-4 py-3 rounded-xl border border-(--color-secondary) bg-transparent focus:outline-none focus:border-(--color-primary)"
// //               />
// //             </div>

// //             <div>
// //               <label className="text-sm font-medium">Price</label>
// //               <input
// //                 type="number"
// //                 name="price"
// //                 value={formData.price}
// //                 onChange={handleChange}
// //                 required
// //                 placeholder="199"
// //                 className="w-full mt-2 px-4 py-3 rounded-xl border border-(--color-secondary) bg-transparent focus:outline-none focus:border-(--color-primary)"
// //               />
// //             </div>

// //             <div>
// //               <label className="text-sm font-medium">Description</label>
// //               <textarea
// //                 rows="3"
// //                 name="description"
// //                 value={formData.description}
// //                 onChange={handleChange}
// //                 required
// //                 placeholder="Write item description..."
// //                 className="w-full mt-2 px-4 py-3 rounded-xl border border-(--color-secondary) bg-transparent resize-none focus:outline-none focus:border-(--color-primary)"
// //               />
// //             </div>
// //           </div>

// //           <div className="flex justify-end gap-3 mt-6">
// //             <button
// //               type="button"
// //               onClick={() => setIsAdding(false)}
// //               className="px-5 py-2 rounded-xl border border-(--color-primary) text-(--color-primary)"
// //             >
// //               Cancel
// //             </button>

// //             <button
// //               type="submit"
// //               className="px-6 py-2 rounded-xl bg-(--color-primary) text-white font-semibold"
// //             >
// //               Save Item
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     )}
// //         <div className="bg-(--color-base-200) rounded-2xl border border-(--color-secondary) overflow-hidden">
// //       {filteredItems.length === 0 ? (
// //         <div className="flex flex-col items-center justify-center py-20 text-(--color-neutral)">
// //           <MdFastfood size={60} className="text-(--color-primary) mb-4" />
// //           <h3 className="text-xl font-semibold">No Menu Items Found</h3>
// //           <p className="text-sm mt-1">
// //             Start by adding your first delicious item.
// //           </p>
// //         </div>
// //       ) : (
// //         <>
// //           <div className="grid grid-cols-12 gap-4 px-6 py-4 font-semibold text-(--color-primary) border-b border-(--color-secondary)">
// //             <div className="col-span-5">Item</div>
// //             <div className="col-span-2 text-center">Price</div>
// //             <div className="col-span-2">Category</div>
// //             <div className="col-span-2">Status</div>
// //             <div className="col-span-1 text-center">Actions</div>
// //           </div>

// //           <div className="max-h-[60vh] overflow-y-auto">
// //             {filteredItems.map((item) => (
// //               <div
// //                 key={item._id}
// //                 className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-(--color-secondary) hover:bg-(--color-base-100) transition"
// //               >
// //                 <div className="col-span-5 flex items-center gap-4">
// //                   <div className="w-16 h-16 rounded-xl overflow-hidden bg-(--color-base-100) border border-(--color-secondary) flex items-center justify-center">
// //                     {item.image?.url ? (
// //                       <img
// //                         src={item.image.url}
// //                         alt={item.itemName}
// //                         className="w-full h-full object-cover"
// //                       />
// //                     ) : (
// //                       <MdFastfood
// //                         size={28}
// //                         className="text-(--color-primary)"
// //                       />
// //                     )}
// //                   </div>

// //                   <div>
// //                     <h4 className="font-semibold">{item.itemName}</h4>
// //                     <p className="text-xs text-(--color-neutral) line-clamp-2">
// //                       {item.description}
// //                     </p>
// //                   </div>
// //                 </div>

// //                 <div className="col-span-2 text-center font-bold text-(--color-primary)">
// //                   ₹ {Number(item.price).toFixed(2)}
// //                 </div>

// //                 <div className="col-span-2">
// //                   <span className="px-3 py-1 rounded-full bg-orange-100 text-(--color-primary) text-xs font-semibold">
// //                     {item.category}
// //                   </span>
// //                 </div>

// //                 <div className="col-span-2">
// //                   <div className="relative inline-block">
// //                     <select
// //                       value={item.isAvailable ? "available" : "unavailable"}
// //                       className={`appearance-none rounded-lg pl-3 pr-8 py-2 text-sm border focus:outline-none ${
// //                         item.isAvailable
// //                           ? "bg-green-100 text-green-700 border-green-300"
// //                           : "bg-red-100 text-red-700 border-red-300"
// //                       }`}
// //                     >
// //                       <option value="available">Available</option>
// //                       <option value="unavailable">Unavailable</option>
// //                     </select>

// //                     <LuChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
// //                   </div>
// //                 </div>

// //                 <div className="col-span-1 flex justify-center gap-2">
// //                   <button className="w-9 h-9 rounded-lg border border-(--color-primary) text-(--color-primary) hover:bg-(--color-primary) hover:text-white transition">
// //                     <LuPencilLine />
// //                   </button>

// //                   <button className="w-9 h-9 rounded-lg border border-(--color-primary) text-(--color-primary) hover:bg-(--color-primary) hover:text-white transition">
// //                     <LuEye />
// //                   </button>

// //                   <button className="w-9 h-9 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition">
// //                     <LuTrash2 />
// //                   </button>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </>
// //       )}
// //     </div>
// //   </div>
// // );
// // };

// // export default RestaurantMenu;



// import React, { useState, useEffect } from "react";
// import { useAuth } from "../../context/AuthContext";
// import api from "../../config/api.config.js";
// import toast from "react-hot-toast";

// import {
//   MdAdd,
//   MdClose,
//   MdSearch,
//   MdFastfood,
// } from "react-icons/md";

// import {
//   LuPencilLine,
//   LuTrash2,
//   LuEye,
//   LuChevronDown,
// } from "react-icons/lu";

// import { FaAward } from "react-icons/fa";
// import { AiTwotoneLike } from "react-icons/ai";

// import ConfirmModal from "./menuItems/ConfirmModal";
// import AddNewItemModal from "./menuItems/AddNewItemModal";

// const statusChipStyles = {
//   available:
//     "bg-green-100 text-green-700 border border-green-300",
//   unavailable:
//     "bg-amber-100 text-amber-700 border border-amber-300",
//   discontinued:
//     "bg-red-100 text-red-700 border border-red-300",
// };

// const statusLabels = {
//   available: "Available",
//   unavailable: "Unavailable",
//   discontinued: "Discontinued",
// };

// const RestaurantMenu = () => {
//   const { user } = useAuth();

//   const [loading, setLoading] = useState(true);

//   const [menuItems, setMenuItems] = useState([]);
//   const [filteredItems, setFilteredItems] = useState([]);

//   const [search, setSearch] = useState("");

//   // Existing Add Form
//   const [isAdding, setIsAdding] = useState(false);

//   const [formData, setFormData] = useState({
//     itemName: "",
//     description: "",
//     price: "",
//     category: "",
//     foodType: "Vegetarian",
//     image: null,
//   });

//   // New Modals
//   const [isAddNewItemModalOpen, setIsAddNewItemModalOpen] =
//     useState(false);

//   const [isEditViewItemModalOpen, setIsEditViewItemModalOpen] =
//     useState(false);

//   const [isControlsModalOpen, setIsControlsModalOpen] =
//     useState(false);

//   const [selectedItem, setSelectedItem] = useState(null);

//   const [modalMode, setModalMode] = useState("");

//   // ==========================================
//   // Fetch Menu
//   // ==========================================

//   useEffect(() => {
//     fetchMenuItems();
//   }, [user?._id]);

//   const fetchMenuItems = async () => {
//     if (!user?._id) return;

//     try {
//       setLoading(true);

//       const response = await api.get(`/menu/${user._id}`);

//       if (response.data.success) {
//         setMenuItems(response.data.data);
//         setFilteredItems(response.data.data);
//       }
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           "Failed to load menu items."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==========================================
//   // Search
//   // ==========================================

//   useEffect(() => {
//     if (!search.trim()) {
//       setFilteredItems(menuItems);
//       return;
//     }

//     const value = search.toLowerCase();

//     setFilteredItems(
//       menuItems.filter(
//         (item) =>
//           item.itemName.toLowerCase().includes(value) ||
//           item.category.toLowerCase().includes(value) ||
//           item.description.toLowerCase().includes(value)
//       )
//     );
//   }, [search, menuItems]);

//   // ==========================================
//   // Form Change
//   // ==========================================

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     if (files) {
//       setFormData({
//         ...formData,
//         [name]: files[0],
//       });

//       return;
//     }

//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   // ==========================================
//   // Add Item
//   // ==========================================

//   const handleAddItem = async (e) => {
//     e.preventDefault();

//     try {
//       const data = new FormData();

//       Object.keys(formData).forEach((key) => {
//         data.append(key, formData[key]);
//       });

//       data.append("restaurantId", user._id);

//       const response = await api.post(
//         "/menu/create",
//         data,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.data.success) {
//         toast.success("Menu Item Added");

//         fetchMenuItems();

//         setFormData({
//           itemName: "",
//           description: "",
//           price: "",
//           category: "",
//           foodType: "Vegetarian",
//           image: null,
//         });

//         setIsAdding(false);
//         setIsAddNewItemModalOpen(false);
//       }
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           "Failed to add menu item."
//       );
//     }
//   };

//   // ==========================================
//   // Update Status
//   // ==========================================

//   const handleStatusChange = async (id, status) => {
//     try {
//       const response = await api.put(
//         `/menu/status/${id}`,
//         {
//           status,
//         }
//       );

//       if (response.data.success) {
//         toast.success("Status Updated");
//         fetchMenuItems();
//       }
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           "Failed to update status."
//       );
//     }
//   };

//   // ==========================================
//   // Open Modals
//   // ==========================================

//   const openEdit = (item) => {
//     setSelectedItem(item);
//     setModalMode("edit");
//     setIsEditViewItemModalOpen(true);
//   };

//   const openView = (item) => {
//     setSelectedItem(item);
//     setModalMode("view");
//     setIsEditViewItemModalOpen(true);
//   };

//   const openDelete = (item) => {
//     setSelectedItem(item);
//     setModalMode("delete");
//     setIsControlsModalOpen(true);
//   };

//   const openTopRated = (item) => {
//     setSelectedItem(item);
//     setModalMode("topRated");
//     setIsControlsModalOpen(true);
//   };

//   const openRecommended = (item) => {
//     setSelectedItem(item);
//     setModalMode("recommended");
//     setIsControlsModalOpen(true);
//   };

//   const openNewItem = (item) => {
//     setSelectedItem(item);
//     setModalMode("new");
//     setIsControlsModalOpen(true);
//   };
//   if (loading) {
//   return (
//     <div className="flex items-center justify-center h-full py-20">
//       <div className="text-center">
//         <div className="w-12 h-12 border-4 border-(--color-primary) border-t-transparent rounded-full animate-spin mx-auto"></div>
//         <p className="mt-4 text-(--color-neutral)">
//           Loading Menu...
//         </p>
//       </div>
//     </div>
//   );
// }

// return (
//   <>
//     <div className="overflow-y-auto h-full">

//       {/* Header */}

//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

//         <div>
//           <h2 className="text-2xl font-bold">
//             Menu Management
//           </h2>

//           <p className="text-sm text-(--color-neutral)">
//             {filteredItems.length} Items Available
//           </p>
//         </div>

//         <div className="flex gap-3 flex-wrap">

//           <div className="relative">

//             <MdSearch
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-neutral)"
//             />

//             <input
//               type="text"
//               placeholder="Search menu..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="pl-10 pr-4 py-2 w-64 rounded-xl border border-(--color-secondary) bg-(--color-base-100) focus:outline-none focus:border-(--color-primary)"
//             />

//           </div>

//           <button
//             onClick={() => setIsAddNewItemModalOpen(true)}
//             className="flex items-center gap-2 px-5 py-2 rounded-xl bg-(--color-primary) text-white font-semibold hover:opacity-90 transition"
//           >
//             <MdAdd size={20} />
//             Add Item
//           </button>

//         </div>

//       </div>

//       {/* Table */}

//       <div className="bg-(--color-base-200) rounded-2xl border border-(--color-secondary) overflow-hidden">

//         {filteredItems.length === 0 ? (

//           <div className="flex flex-col items-center justify-center py-20 text-(--color-neutral)">

//             <MdFastfood
//               size={60}
//               className="text-(--color-primary) mb-4"
//             />

//             <h3 className="text-xl font-semibold">
//               No Menu Items Found
//             </h3>

//             <p className="text-sm mt-2">
//               Start by adding your first delicious item.
//             </p>

//           </div>

//         ) : (

//           <>
//             {/* Header */}

//             <div className="grid grid-cols-12 gap-4 px-6 py-4 font-semibold text-(--color-primary) border-b border-(--color-secondary)">

//               <div className="col-span-4">
//                 Item
//               </div>

//               <div className="col-span-2 text-center">
//                 Price
//               </div>

//               <div className="col-span-2">
//                 Category
//               </div>

//               <div className="col-span-2">
//                 Status
//               </div>

//               <div className="col-span-1">
//                 Controls
//               </div>

//               <div className="col-span-1 text-center">
//                 Actions
//               </div>

//             </div>

//             {/* Rows */}

//             <div className="max-h-[65vh] overflow-y-auto">

//               {filteredItems.map((item) => (

//                 <div
//                   key={item._id}
//                   className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-(--color-secondary) hover:bg-(--color-base-100) transition"
//                 >

//                   {/* Item */}

//                   <div className="col-span-4 flex items-center gap-4">

//                     <div className="w-16 h-16 rounded-xl overflow-hidden bg-(--color-base-100) border border-(--color-secondary) flex items-center justify-center">

//                       {item.image?.url ? (

//                         <img
//                           src={item.image.url}
//                           alt={item.itemName}
//                           className="w-full h-full object-cover"
//                         />

//                       ) : (

//                         <MdFastfood
//                           size={28}
//                           className="text-(--color-primary)"
//                         />

//                       )}

//                     </div>

//                     <div>

//                       <h4 className="font-semibold">
//                         {item.itemName}
//                       </h4>

//                       <p className="text-xs text-(--color-neutral)">
//                         {item.description}
//                       </p>

//                     </div>

//                   </div>

//                   {/* Price */}

//                   <div className="col-span-2 text-center font-bold text-(--color-primary)">
//                     ₹ {Number(item.price).toFixed(2)}
//                   </div>

//                   {/* Category */}

//                   <div className="col-span-2">

//                     <div className="font-medium">
//                       {item.category}
//                     </div>

//                     <div className="text-xs text-(--color-neutral)">
//                       {item.foodType}
//                     </div>

//                   </div>

//                   {/* Status */}

//                   <div className="col-span-2">

//                     <div className="relative inline-block">

//                       <select
//                         value={item.status}
//                         onChange={(e) =>
//                           handleStatusChange(
//                             item._id,
//                             e.target.value
//                           )
//                         }
//                         className={`appearance-none rounded-lg pl-3 pr-8 py-2 text-sm border focus:outline-none ${
//                           statusChipStyles[item.status]
//                         }`}
//                       >

//                         <option value="available">
//                           {statusLabels.available}
//                         </option>

//                         <option value="unavailable">
//                           {statusLabels.unavailable}
//                         </option>

//                         <option value="discontinued">
//                           {statusLabels.discontinued}
//                         </option>

//                       </select>

//                       <LuChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />

//                     </div>

//                   </div>

//                   {/* Controls */}

//                   <div className="col-span-1 flex gap-2">

//                     <button
//                       onClick={() => openTopRated(item)}
//                       className={`${
//                         item.isTopRated
//                           ? "text-(--color-primary)"
//                           : "text-(--color-secondary)"
//                       }`}
//                     >
//                       <FaAward />
//                     </button>

//                     <button
//                       onClick={() =>
//                         openRecommended(item)
//                       }
//                       className={`${
//                         item.isRecommended
//                           ? "text-(--color-primary)"
//                           : "text-(--color-secondary)"
//                       }`}
//                     >
//                       <AiTwotoneLike />
//                     </button>

//                     <button
//                       onClick={() =>
//                         openNewItem(item)
//                       }
//                       className={`text-xs px-1 rounded border ${
//                         item.isNew
//                           ? "border-(--color-primary) text-(--color-primary)"
//                           : "border-(--color-secondary) text-(--color-secondary)"
//                       }`}
//                     >
//                       New
//                     </button>

//                   </div>

//                   {/* Actions */}

//                   <div className="col-span-1 flex justify-center gap-2">

//                     <button
//                       onClick={() => openEdit(item)}
//                       className="w-9 h-9 rounded-lg border border-(--color-primary) text-(--color-primary) hover:bg-(--color-primary) hover:text-white transition"
//                     >
//                       <LuPencilLine />
//                     </button>

//                     <button
//                       onClick={() => openView(item)}
//                       className="w-9 h-9 rounded-lg border border-(--color-primary) text-(--color-primary) hover:bg-(--color-primary) hover:text-white transition"
//                     >
//                       <LuEye />
//                     </button>

//                     <button
//                       onClick={() => openDelete(item)}
//                       className="w-9 h-9 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
//                     >
//                       <LuTrash2 />
//                     </button>

//                   </div>

//                 </div>

//               ))}

//             </div>

//           </>

//         )}

//       </div>

//     </div>
//           {/* Confirm Modal */}

//       {isControlsModalOpen && (
//         <ConfirmModal
//           isOpen={isControlsModalOpen}
//           onClose={() => {
//             setIsControlsModalOpen(false);
//             setSelectedItem(null);
//             setModalMode("");
//           }}
//           selectedItem={selectedItem}
//           modalMode={modalMode}
//           refreshMenu={fetchMenuItems}
//         />
//       )}

//       {/* Add Item Modal */}

//       {isAddNewItemModalOpen && (
//         <AddNewItemModal
//           isOpen={isAddNewItemModalOpen}
//           onClose={() => {
//             setIsAddNewItemModalOpen(false);
//             fetchMenuItems();
//           }}
//           formData={formData}
//           handleChange={handleChange}
//           handleSubmit={handleAddItem}
//         />
//       )}

//       {/* Edit / View Modal */}

//       {isEditViewItemModalOpen && (
//         <AddNewItemModal
//           isOpen={isEditViewItemModalOpen}
//           onClose={() => {
//             setIsEditViewItemModalOpen(false);
//             setSelectedItem(null);
//             setModalMode("");
//             fetchMenuItems();
//           }}
//           formData={selectedItem}
//           editMode={modalMode === "edit"}
//           viewMode={modalMode === "view"}
//           menuItem={selectedItem}
//           refreshMenu={fetchMenuItems}
//         />
//       )}
//     </>
//   );
// };

// export default RestaurantMenu;




import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/api.config.js";
import toast from "react-hot-toast";

import {
  MdAdd,
  MdSearch,
  MdFastfood,
} from "react-icons/md";

import {
  LuPencilLine,
  LuTrash2,
  LuEye,
  LuChevronDown,
} from "react-icons/lu";

import { FaAward } from "react-icons/fa";
import { AiTwotoneLike } from "react-icons/ai";

import ConfirmModal from "./menuItems/ConfirmModal";
import AddNewItemModal from "./menuItems/AddNewItemModal";

const statusChipStyles = {
  available:
    "bg-green-100 text-green-700 border border-green-300",
  unavailable:
    "bg-amber-100 text-amber-700 border border-amber-300",
  discontinued:
    "bg-red-100 text-red-700 border border-red-300",
};

const statusLabels = {
  available: "Available",
  unavailable: "Unavailable",
  discontinued: "Discontinued",
};

const RestaurantMenu = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);

  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  const [search, setSearch] = useState("");

  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    price: "",
    category: "",
    foodType: "Vegetarian",
    image: null,
  });

  const [isAddNewItemModalOpen, setIsAddNewItemModalOpen] =
    useState(false);

  const [isEditViewItemModalOpen, setIsEditViewItemModalOpen] =
    useState(false);

  const [isControlsModalOpen, setIsControlsModalOpen] =
    useState(false);

  const [selectedItem, setSelectedItem] = useState(null);

  const [modalMode, setModalMode] = useState("");

  // ======================================
  // Fetch Menu
  // ======================================

  useEffect(() => {
    fetchMenuItems();
  }, [user?._id]);

  const fetchMenuItems = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);

      const response = await api.get(`/menu/${user._id}`);

      if (response.data.success) {
        setMenuItems(response.data.data);
        setFilteredItems(response.data.data);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load menu items."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // Search
  // ======================================

  useEffect(() => {
    if (!search.trim()) {
      setFilteredItems(menuItems);
      return;
    }

    const value = search.toLowerCase();

    setFilteredItems(
      menuItems.filter(
        (item) =>
          item.itemName.toLowerCase().includes(value) ||
          item.category.toLowerCase().includes(value) ||
          item.description.toLowerCase().includes(value)
      )
    );
  }, [search, menuItems]);

  // ======================================
  // Form Change
  // ======================================

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ======================================
  // Add Item
  // ======================================

  const handleAddItem = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      data.append("restaurantId", user._id);

      const response = await api.post(
        "/menu/create",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Menu Item Added");

        fetchMenuItems();

        setFormData({
          itemName: "",
          description: "",
          price: "",
          category: "",
          foodType: "Vegetarian",
          image: null,
        });

        setIsAdding(false);
        setIsAddNewItemModalOpen(false);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to add menu item."
      );
    }
  };

  // ======================================
  // Update Status
  // ======================================

  const handleStatusChange = async (id, status) => {
    try {
      const response = await api.put(
        `/menu/status/${id}`,
        {
          status,
        }
      );

      if (response.data.success) {
        toast.success("Status Updated");
        fetchMenuItems();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update status."
      );
    }
  };

  // ======================================
  // Modal Functions
  // ======================================

  const openEdit = (item) => {
    setSelectedItem(item);
    setModalMode("edit");
    setIsEditViewItemModalOpen(true);
  };

  const openView = (item) => {
    setSelectedItem(item);
    setModalMode("view");
    setIsEditViewItemModalOpen(true);
  };

  const openDelete = (item) => {
    setSelectedItem(item);
    setModalMode("delete");
    setIsControlsModalOpen(true);
  };

  const openTopRated = (item) => {
    setSelectedItem(item);
    setModalMode("topRated");
    setIsControlsModalOpen(true);
  };

  const openRecommended = (item) => {
    setSelectedItem(item);
    setModalMode("recommended");
    setIsControlsModalOpen(true);
  };

  const openNewItem = (item) => {
    setSelectedItem(item);
    setModalMode("new");
    setIsControlsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-(--color-primary) border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-(--color-neutral)">
            Loading Menu...
          </p>
        </div>
      </div>
    );
  }
  return (
  <>
    <div className="overflow-y-auto h-full">

      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

        <div>
          <h2 className="text-2xl font-bold">
            Menu Management
          </h2>

          <p className="text-sm text-(--color-neutral)">
            {filteredItems.length} Items Available
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">

          <div className="relative">

            <MdSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-neutral)"
            />

            <input
              type="text"
              placeholder="Search menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 rounded-xl border border-(--color-secondary) bg-(--color-base-100) focus:outline-none focus:border-(--color-primary)"
            />

          </div>

          <button
            onClick={() => setIsAddNewItemModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-(--color-primary) text-white font-semibold hover:opacity-90 transition"
          >
            <MdAdd size={20} />
            Add Item
          </button>

        </div>

      </div>

      {/* Table */}

      <div className="bg-(--color-base-200) rounded-2xl border border-(--color-secondary) overflow-hidden">

        {filteredItems.length === 0 ? (

          <div className="flex flex-col items-center justify-center py-20 text-(--color-neutral)">

            <MdFastfood
              size={60}
              className="text-(--color-primary) mb-4"
            />

            <h3 className="text-xl font-semibold">
              No Menu Items Found
            </h3>

            <p className="text-sm mt-2">
              Start by adding your first delicious item.
            </p>

          </div>

        ) : (

          <>

            {/* Table Header */}

            <div className="grid grid-cols-12 gap-4 px-6 py-4 font-semibold text-(--color-primary) border-b border-(--color-secondary)">

              <div className="col-span-4">
                Item
              </div>

              <div className="col-span-2 text-center">
                Price
              </div>

              <div className="col-span-2">
                Category
              </div>

              <div className="col-span-2">
                Status
              </div>

              <div className="col-span-1">
                Controls
              </div>

              <div className="col-span-1 text-center">
                Actions
              </div>

            </div>

            {/* Menu Items */}

            <div className="max-h-[65vh] overflow-y-auto">

              {filteredItems.map((item) => (

                <div
                  key={item._id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-(--color-secondary) hover:bg-(--color-base-100) transition"
                >

                  {/* Item */}

                  <div className="col-span-4 flex items-center gap-4">

                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-(--color-base-100) border border-(--color-secondary) flex items-center justify-center">

                      {item.image?.url ? (
                        <img
                          src={item.image.url}
                          alt={item.itemName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <MdFastfood
                          size={28}
                          className="text-(--color-primary)"
                        />
                      )}

                    </div>

                    <div>

                      <h4 className="font-semibold">
                        {item.itemName}
                      </h4>

                      <p className="text-xs text-(--color-neutral) line-clamp-2">
                        {item.description}
                      </p>

                    </div>

                  </div>

                  {/* Price */}

                  <div className="col-span-2 text-center font-bold text-(--color-primary)">
                    ₹ {Number(item.price).toFixed(2)}
                  </div>

                  {/* Category */}

                  <div className="col-span-2">

                    <div className="font-medium">
                      {item.category}
                    </div>

                    <div className="text-xs text-(--color-neutral)">
                      {item.foodType}
                    </div>

                  </div>

                  {/* Status */}

                  <div className="col-span-2">

                    <div className="relative inline-block">

                      <select
                        value={item.status}
                        onChange={(e) =>
                          handleStatusChange(
                            item._id,
                            e.target.value
                          )
                        }
                        className={`appearance-none rounded-lg pl-3 pr-8 py-2 text-sm border focus:outline-none ${
                          statusChipStyles[item.status]
                        }`}
                      >

                        <option value="available">
                          {statusLabels.available}
                        </option>

                        <option value="unavailable">
                          {statusLabels.unavailable}
                        </option>

                        <option value="discontinued">
                          {statusLabels.discontinued}
                        </option>

                      </select>

                      <LuChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />

                    </div>

                  </div>

                  {/* Controls */}

                  <div className="col-span-1 flex gap-2">

                    <button
                      onClick={() => openTopRated(item)}
                      className={`${
                        item.isTopRated
                          ? "text-(--color-primary)"
                          : "text-(--color-secondary)"
                      }`}
                    >
                      <FaAward />
                    </button>

                    <button
                      onClick={() => openRecommended(item)}
                      className={`${
                        item.isRecommended
                          ? "text-(--color-primary)"
                          : "text-(--color-secondary)"
                      }`}
                    >
                      <AiTwotoneLike />
                    </button>

                    <button
                      onClick={() => openNewItem(item)}
                      className={`text-xs px-1 rounded border ${
                        item.isNew
                          ? "border-(--color-primary) text-(--color-primary)"
                          : "border-(--color-secondary) text-(--color-secondary)"
                      }`}
                    >
                      New
                    </button>

                  </div>

                  {/* Actions */}

                  <div className="col-span-1 flex justify-center gap-2">

                    <button
                      onClick={() => openEdit(item)}
                      className="w-9 h-9 rounded-lg border border-(--color-primary) text-(--color-primary) hover:bg-(--color-primary) hover:text-white transition"
                    >
                      <LuPencilLine />
                    </button>

                    <button
                      onClick={() => openView(item)}
                      className="w-9 h-9 rounded-lg border border-(--color-primary) text-(--color-primary) hover:bg-(--color-primary) hover:text-white transition"
                    >
                      <LuEye />
                    </button>

                    <button
                      onClick={() => openDelete(item)}
                      className="w-9 h-9 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
                    >
                      <LuTrash2 />
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </>

        )}

      </div>
    </div>

          {/* Confirm Modal */}

      {isControlsModalOpen && (
        <ConfirmModal
          isOpen={isControlsModalOpen}
          onClose={() => {
            setIsControlsModalOpen(false);
            setSelectedItem(null);
            setModalMode("");
          }}
          selectedItem={selectedItem}
          modalMode={modalMode}
          refreshMenu={fetchMenuItems}
        />
      )}

      {/* Add Item Modal */}

      {isAddNewItemModalOpen && (
        <AddNewItemModal
          isOpen={isAddNewItemModalOpen}
          onClose={() => {
            setIsAddNewItemModalOpen(false);
            fetchMenuItems();
          }}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleAddItem}
        />
      )}

      {/* Edit / View Modal */}

      {isEditViewItemModalOpen && (
        <AddNewItemModal
          isOpen={isEditViewItemModalOpen}
          onClose={() => {
            setIsEditViewItemModalOpen(false);
            setSelectedItem(null);
            setModalMode("");
            fetchMenuItems();
          }}
          formData={selectedItem}
          editMode={modalMode === "edit"}
          viewMode={modalMode === "view"}
          menuItem={selectedItem}
          refreshMenu={fetchMenuItems}
        />
      )}
    </>
  );
};

export default RestaurantMenu;