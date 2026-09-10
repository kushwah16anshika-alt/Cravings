import React, { useEffect, useState, useCallback } from "react";
import api from "../../config/api.config.js";
import toast from "react-hot-toast";
import Loader from "../Loader";
import {
  IoStar,
  IoChatbubblesOutline,
  IoHelpCircleOutline,
} from "react-icons/io5";
import { MdRefresh } from "react-icons/md";

const AdminFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("feedbacks");

  const fetchFeedbackData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/admin/feedbacks");
      if (res.data?.success) {
        setFeedbacks(res.data.data?.feedbacks || []);
        setContacts(res.data.data?.contacts || []);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load feedback inquiries"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedbackData();
  }, [fetchFeedbackData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-900">
            Student Feedback & Support Desk
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Review customer satisfaction ratings, canteen suggestions, and support tickets
          </p>
        </div>

        <button
          onClick={fetchFeedbackData}
          className="flex items-center gap-1.5 self-start sm:self-auto rounded-2xl bg-white border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition"
        >
          <MdRefresh size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Tab Selector */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("feedbacks")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-extrabold rounded-xl transition ${
            activeTab === "feedbacks"
              ? "bg-orange-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <IoChatbubblesOutline size={16} />
          <span>Customer Feedbacks ({feedbacks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("contacts")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-extrabold rounded-xl transition ${
            activeTab === "contacts"
              ? "bg-orange-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <IoHelpCircleOutline size={16} />
          <span>Support Inquiries ({contacts.length})</span>
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="p-12 bg-white rounded-3xl border border-slate-200 shadow-xs">
          <Loader
            height="250px"
            width="100%"
            text="Loading feedback and support logs..."
          />
        </div>
      ) : activeTab === "feedbacks" ? (
        feedbacks.length === 0 ? (
          <div className="py-16 bg-white rounded-3xl border border-slate-200 text-center text-slate-400 space-y-2">
            <span className="text-4xl">💬</span>
            <p className="text-sm font-bold text-slate-700">No feedback submissions yet</p>
            <p className="text-xs text-slate-400">
              When students rate their experience, submissions will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedbacks.map((f) => (
              <div
                key={f._id}
                className="rounded-3xl bg-white border border-slate-200/80 p-5 shadow-xs space-y-3 hover:border-orange-200 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-heading text-sm font-black text-slate-900">
                      {f.fullName}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium">
                      {f.email}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200/60 text-amber-700 text-xs font-black">
                    <IoStar className="text-amber-500" />
                    <span>{f.rating} / 5</span>
                  </div>
                </div>

                <span className="inline-block rounded-lg bg-orange-50 px-2.5 py-0.5 text-[10px] font-extrabold text-orange-700">
                  {f.category}
                </span>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  "{f.message}"
                </p>

                <div className="text-[10px] text-slate-400 pt-1">
                  Submitted on {new Date(f.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )
      ) : contacts.length === 0 ? (
        <div className="py-16 bg-white rounded-3xl border border-slate-200 text-center text-slate-400 space-y-2">
          <span className="text-4xl">📩</span>
          <p className="text-sm font-bold text-slate-700">No support tickets</p>
          <p className="text-xs text-slate-400">
            All customer inquiries have been resolved.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map((c) => (
            <div
              key={c._id}
              className="rounded-3xl bg-white border border-slate-200/80 p-5 shadow-xs space-y-3 hover:border-orange-200 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-heading text-sm font-black text-slate-900">
                    {c.fullName}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>{c.email}</span>
                    {c.phone && <span>• Tel: {c.phone}</span>}
                  </div>
                </div>

                <span className="inline-block rounded-lg bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 text-[10px] font-black uppercase">
                  Inquiry
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-800">
                  Subject: {c.subject}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  {c.message}
                </p>
              </div>

              <div className="text-[10px] text-slate-400 pt-1">
                Received on {new Date(c.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFeedbacks;
