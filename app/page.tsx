"use client";

import { useEffect, useState } from "react";
import { Briefcase } from "lucide-react";

export default function Home() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [appliedDate, setAppliedDate] = useState(new Date().toISOString().split("T")[0]);
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("Applied");
  const statuses = ["Applied", "Interview", "Offer", "Rejected"];
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  async function fetchJobs() {
    const res = await fetch("/api/jobs");
    const data = await res.json();
    setJobs(data);
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (!search) {
      setSuggestions([]);
      return;
    }
  
    const matches = jobs.filter((job: any) =>
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.title.toLowerCase().includes(search.toLowerCase())
    );
  
    setSuggestions(matches.slice(0, 5));
  }, [search, jobs]);

  async function handleSubmit(e: any) {
    e.preventDefault();
  
    if (editingId) {
      // UPDATE
      await fetch("/api/jobs", {
        method: "PUT",
        body: JSON.stringify({
          id: editingId,
          company,
          title,
          status,
          notes,
          appliedDate,
        }),
      });
    } else {
      // CREATE
      await fetch("/api/jobs", {
        method: "POST",
        body: JSON.stringify({
          company,
          title,
          status,
          notes,
          appliedDate,
        }),
      });
    }
  
    // reset form
    setCompany("");
    setTitle("");
    setStatus("Applied");
    setNotes("");
    setAppliedDate("");
    setEditingId(null);
  
    fetchJobs();
  }

  async function deleteJob(id: number) {
    await fetch("/api/jobs", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
  
    fetchJobs();
  }

  function startEdit(job: any) {
    setEditingId(job.id);
    setCompany(job.company);
    setTitle(job.title);
    setStatus(job.status);
    setNotes(job.notes || "");

    // format date for input
    const [year, month, day] = job.appliedDate.split("T")[0].split("-");
    const formatted = `${year}-${month}-${day}`;

    setAppliedDate(formatted);
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "Applied":
        return "bg-gray-200 text-gray-800";
      case "Interview":
        return "bg-blue-200 text-blue-800";
      case "Offer":
        return "bg-green-200 text-green-800";
      case "Rejected":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  }

  function getDaysSince(dateString: string) {
    const [year, month, day] = dateString.split("T")[0].split("-");
  
    const applied = new Date(Number(year), Number(month) - 1, Number(day));
    const today = new Date();
  
    // ✅ normalize both to midnight 
    applied.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
  
    const diffTime = today.getTime() - applied.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
    return diffDays;
  }

const total = jobs.length;
const interviews = jobs.filter((j: any) => j.status === "Interview").length;
const offers = jobs.filter((j: any) => j.status === "Offer").length;
const rejected = jobs.filter((j: any) => j.status === "Rejected").length;
const groupedJobs = statuses.reduce((acc: any, status) => {
  acc[status] = jobs.filter((job: any) => job.status === status);
  return acc;
}, {});

  return (
<div className="h-screen flex">
      {/* ================= LEFT SIDE ================= */}
  <div className="w-1/3 border-r border-gray-800 p-6 overflow-y-auto">
    {/* HEADER */}
    <div className="flex items-center justify-center gap-2 border-b border-gray-800 pb-3">
      <Briefcase className="w-6 h-6 text-blue-400" />
      <h1 className="text-2xl font-bold">Job Tracker</h1>
    </div>
  {/* Dashboard */}
  <div className="grid grid-cols-2 gap-4 mb-6">
  <div className="rounded-xl p-4 bg-gray-900 border border-gray-800">
  <div className="text-sm text-gray-400">Total</div>
  <div className="text-xl font-bold text-white">{total}</div>
  </div>

  <div className="rounded-xl p-4 bg-blue-100">
    <div className="text-sm text-blue-700">Interviews</div>
    <div className="text-xl font-bold text-blue-900">{interviews}</div>
  </div>

  <div className="rounded-xl p-4 bg-green-100">
    <div className="text-sm text-green-700">Offers</div>
    <div className="text-xl font-bold text-green-900">{offers}</div>
  </div>

  <div className="rounded-xl p-4 bg-red-100">
    <div className="text-sm text-red-700">Rejected</div>
    <div className="text-xl font-bold text-red-900">{rejected}</div>
  </div>

  {/* FORM */}
  </div>
      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <input
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="border p-2 w-full"
        />

        <input
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
        />

        <input
          type="date"
          value={appliedDate}
          onChange={(e) => setAppliedDate(e.target.value)}
          className="border p-2 w-full"
        />
        
        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="border p-2 w-full"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 w-full"
        >
          <option>Applied</option>
          <option>Interview</option>
          <option>Rejected</option>
          <option>Offer</option>
        </select>

        <button className="bg-black text-white px-4 py-2">
            {editingId ? "Update Job" : "Add Job"}
        </button>
      </form>
</div>

  {/* ================= RIGHT SIDE ================= */}
  <div className="w-2/3 p-6 overflow-y-auto">

{/* SEARCH */}
<div className="mb-4">
  <input
    placeholder="Search jobs..."
    value={search}
    onChange={(e) => {
      setSearch(e.target.value);
      setShowSuggestions(true);
    }}
    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
    className="border p-2 w-full"
  />

{showSuggestions && suggestions.length > 0 && (
  <div className="absolute bg-white border w-full mt-1 z-10 text-gray-900 shadow">
    {suggestions.map((job, i) => (
      <div
        key={i}
        onClick={() => {
          setSearch(job.company); 
          setShowSuggestions(false);
        }}
        className="p-2 hover:bg-gray-100 cursor-pointer"
      >
        <span className="font-semibold">{job.company}</span>
        <span className="text-gray-500"> — {job.title}</span>
      </div>
    ))}
  </div>
)}
</div>

{/* Job List */}
<div className="space-y-8">
  {(() => {
    // check if ANY jobs exist after filtering
    const hasAnyJobs = statuses.some((status) =>
      groupedJobs[status]?.some((job: any) => {
        const text = `${job.company} ${job.title}`.toLowerCase();
        return text.includes(search.toLowerCase());
      })
    );

    if (!hasAnyJobs) {
      return (
        <div className="text-center text-gray-500 py-10 border border-gray-800 rounded-xl">
          No jobs listed currently
        </div>
      );
    }

    return statuses.map((status) => {
      const filteredJobs = groupedJobs[status].filter((job: any) => {
        const text = `${job.company} ${job.title}`.toLowerCase();
        return text.includes(search.toLowerCase());
      });

      return (
        <div key={status}>
          <h2 className="font-semibold text-lg mb-3">{status}</h2>

          <div className="space-y-3">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job: any) => (
                <div
                  key={job.id}
                  className="border border-gray-800 rounded-xl p-4 flex justify-between items-start hover:bg-gray-900/40 transition"
                >
                  {/* LEFT SIDE */}
                  <div className="space-y-1 max-w-[70%]">
                    <div className="font-semibold text-base">
                      {job.company}
                    </div>

                    <div className="text-sm text-gray-400">
                      {job.title}
                    </div>

                    {job.notes && (
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {job.notes}
                      </div>
                    )}

                    <div
                      className={`inline-block mt-2 px-2 py-1 text-xs rounded-md ${getStatusColor(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </div>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="flex flex-col items-end text-sm gap-1 min-w-[120px]">
                    <div className="text-gray-500">
                      {job.appliedDate.split("T")[0]}
                    </div>

                    <button
                      onClick={() => startEdit(job)}
                      className="text-blue-400 hover:underline block"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteJob(job.id)}
                      className="text-red-400 hover:underline block"
                    >
                      Delete
                    </button>

                    {/* Days since applied component */}
                    {(() => {
                      const days = getDaysSince(job.appliedDate);

                      return (
                        <div
                          className={`text-xs mt-1 ${
                            days > 14
                              ? "text-red-400"
                              : days > 7
                              ? "text-yellow-400"
                              : "text-gray-500"
                          }`}
                        >
                          {days === 0
                            ? "Applied today"
                            : days === 1
                            ? "Applied 1 day ago"
                            : `Applied ${days} days ago`}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 italic">
                No jobs in this section
              </div>
            )}
          </div>
        </div>
      );
    });
  })()}
</div>
    </div>
</div>
  );
}