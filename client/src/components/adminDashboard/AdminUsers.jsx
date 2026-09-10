import React, { useEffect, useState, useMemo, useCallback } from "react";
import api from "../../config/api.config.js";
import toast from "react-hot-toast";
import Loader from "../Loader";
import {
  IoSearch,
  IoPersonOutline,
  IoBicycleOutline,
  IoStorefrontOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { MdRefresh } from "react-icons/md";

const USER_ROLES = [
  { value: "all", label: "All Community", icon: <IoPersonOutline /> },
  { value: "customer", label: "Students", icon: <IoPersonOutline /> },
  { value: "rider", label: "Delivery Riders", icon: <IoBicycleOutline /> },
  { value: "restaurant", label: "Kitchen Managers", icon: <IoStorefrontOutline /> },
  { value: "admin", label: "Admins", icon: <IoShieldCheckmarkOutline /> },
];

const roleBadge = (role) => {
  switch (role) {
    case "admin":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "restaurant":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "rider":
      return "bg-blue-100 text-blue-700 border-blue-200";
    default:
      return "bg-orange-100 text-orange-700 border-orange-200";
  }
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/admin/users?role=${selectedRole}`);
      if (res.data?.success) {
        setUsers(res.data.data || []);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load platform users"
      );
    } finally {
      setIsLoading(false);
    }
  }, [selectedRole]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase().trim();
    return users.filter(
      (u) =>
        u.fullname?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.includes(q) ||
        u.userType?.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-900">
            Platform Users & Delivery Partners
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Directory of registered campus students, delivery riders, and canteen partners
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="flex items-center gap-1.5 self-start sm:self-auto rounded-2xl bg-white border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition"
        >
          <MdRefresh size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="relative">
          <IoSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-600 text-base" />
          <input
            type="text"
            placeholder="Search by student name, email, phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-2xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition"
          />
        </div>

        {/* Role Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {USER_ROLES.map((role) => {
            const active = selectedRole === role.value;
            return (
              <button
                key={role.value}
                onClick={() => setSelectedRole(role.value)}
                className={`flex items-center gap-1.5 shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 ${
                  active
                    ? "bg-orange-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                <span>{role.icon}</span>
                <span>{role.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Users Table Card */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12">
            <Loader
              height="200px"
              width="100%"
              text="Loading community directory..."
            />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <span className="text-4xl">👥</span>
            <p className="text-sm font-bold text-slate-700">No users found</p>
            <p className="text-xs text-slate-400">
              Try adjusting your role filter or search keyword.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 pl-6">Member</th>
                  <th className="py-3.5">Role</th>
                  <th className="py-3.5">Email</th>
                  <th className="py-3.5">Phone</th>
                  <th className="py-3.5">Gender / DOB</th>
                  <th className="py-3.5 pr-6">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredUsers.map((u) => {
                  const avatar =
                    u.photo?.url ||
                    `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
                      u.fullname || "User"
                    )}`;

                  return (
                    <tr key={u._id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 pl-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={avatar}
                            alt={u.fullname}
                            className="h-9 w-9 rounded-xl object-cover bg-slate-100 border border-slate-100"
                          />
                          <div>
                            <div className="font-bold text-slate-900">
                              {u.fullname}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              ID: {u._id.slice(-6).toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${roleBadge(
                            u.userType
                          )}`}
                        >
                          {u.userType === "user" ? "Student" : u.userType}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-600 font-medium truncate max-w-[180px]">
                        {u.email}
                      </td>
                      <td className="py-3.5 text-slate-600 font-medium">
                        {u.phone || "—"}
                      </td>
                      <td className="py-3.5 text-slate-500 capitalize">
                        {u.gender || "—"} {u.dob ? `(${u.dob})` : ""}
                      </td>
                      <td className="py-3.5 pr-6 text-slate-500">
                        {new Date(u.createdAt).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
