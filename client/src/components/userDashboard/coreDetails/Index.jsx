import React, { useEffect, useState } from "react";
import { MdEdit, MdOutlineAddLocationAlt, MdDeleteOutline } from "react-icons/md";
import { IoLocationOutline, IoHomeOutline, IoBriefcaseOutline, IoCheckmarkCircle } from "react-icons/io5";
import { RiLoader4Fill } from "react-icons/ri";
import api from "../../../config/api.config.js";
import toast from "react-hot-toast";

const emptyForm = {
  name: "",
  address: "",
  city: "",
  state: "",
  pinCode: "",
  country: "",
  addressType: "home",
  isDefault: false,
  geoLat: "",
  geoLon: "",
};

const Index = () => {
  const [addressBook, setAddressBook] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchAddressBook = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/customer/address-book");
      setAddressBook(res.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load address book");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddressBook();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setFormData((prev) => ({ ...prev, geoLat: coords.latitude, geoLon: coords.longitude }));
        setIsFetchingLocation(false);
        toast.success("GPS Coordinates retrieved!");
      },
      () => {
        setIsFetchingLocation(false);
        toast.error("Unable to retrieve location");
      }
    );
  };

  const handleStartAdd = () => {
    setFormData(emptyForm);
    setEditingId("add");
  };

  const handleStartEdit = (addr) => {
    setFormData({
      name: addr.name || "",
      address: addr.address || "",
      city: addr.city || "",
      state: addr.state || "",
      pinCode: addr.pinCode || "",
      country: addr.country || "",
      addressType: addr.addressType || "home",
      isDefault: addr.isDefault || false,
      geoLat: addr.geoLocation?.lat || "",
      geoLon: addr.geoLocation?.lon || "",
    });
    setEditingId(addr._id);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleSave = async () => {
    if (!formData.address || !formData.city || !formData.state || !formData.pinCode) {
      toast.error("Please fill in all address details");
      return;
    }

    try {
      setIsSaving(true);
      let res;
      if (editingId === "add") {
        res = await api.post("/customer/address-book", formData);
      } else {
        res = await api.put(`/customer/address-book/${editingId}`, formData);
      }
      setAddressBook(res.data.data || []);
      toast.success(res.data.message || "Address saved successfully");
      setEditingId(null);
      setFormData(emptyForm);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save address");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (addressId) => {
    try {
      const res = await api.delete(`/customer/address-book/${addressId}`);
      setAddressBook(res.data.data || []);
      toast.success(res.data.message || "Address deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete address");
    }
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-heading text-lg font-black text-slate-900">
            Saved Delivery Addresses
          </h3>
          <p className="text-xs font-semibold text-slate-400">
            Manage your campus delivery locations and dorm spots
          </p>
        </div>

        {editingId === null && (
          <button
            onClick={handleStartAdd}
            className="flex items-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2 text-xs font-black text-white hover:bg-orange-500 transition shadow-xs"
          >
            <MdOutlineAddLocationAlt size={16} />
            <span>Add New Address</span>
          </button>
        )}
      </div>

      {/* Add / Edit Form Modal / Panel */}
      {editingId !== null && (
        <div className="p-5 rounded-2xl bg-orange-50/60 border border-orange-100 space-y-4">
          <h4 className="font-heading text-sm font-black text-slate-900">
            {editingId === "add" ? "Add Delivery Address" : "Edit Address"}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Label / Place Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Dorm Room 302, Library Block"
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 focus:border-orange-500 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Street / Building Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Block B, 2nd Floor, Campus Hostel"
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 focus:border-orange-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Campus City"
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 focus:border-orange-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 focus:border-orange-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                PIN Code
              </label>
              <input
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                placeholder="PIN Code"
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 focus:border-orange-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={isFetchingLocation}
              className="flex items-center gap-1 text-xs font-bold text-orange-600 hover:underline"
            >
              {isFetchingLocation ? <RiLoader4Fill className="animate-spin" /> : <IoLocationOutline />}
              <span>{isFetchingLocation ? "Locating..." : "Use Current GPS Location"}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-xl bg-orange-600 px-5 py-2 text-xs font-black text-white shadow-xs hover:bg-orange-500 transition"
              >
                {isSaving ? "Saving..." : "Save Address"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address Cards Grid */}
      {addressBook.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addressBook.map((addr) => (
            <div
              key={addr._id}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                    <IoHomeOutline size={16} />
                  </div>
                  <div>
                    <h5 className="font-heading text-sm font-black text-slate-900">
                      {addr.name || "Delivery Address"}
                    </h5>
                    {addr.isDefault && (
                      <span className="text-[9px] font-black uppercase text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                        Default
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartEdit(addr)}
                    className="p-1 text-slate-500 hover:text-orange-600 transition"
                    title="Edit"
                  >
                    <MdEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(addr._id)}
                    className="p-1 text-slate-500 hover:text-red-600 transition"
                    title="Delete"
                  >
                    <MdDeleteOutline size={16} />
                  </button>
                </div>
              </div>

              <p className="text-xs font-medium text-slate-600 leading-relaxed">
                {[addr.address, addr.city, addr.state, addr.pinCode].filter(Boolean).join(", ")}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-slate-400">
          <p className="text-xs font-semibold">No saved addresses yet</p>
        </div>
      )}
    </div>
  );
};

export default Index;