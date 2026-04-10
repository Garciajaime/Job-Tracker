"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("Applied");

  async function fetchJobs() {
    const res = await fetch("/api/jobs");
    const data = await res.json();
    setJobs(data);
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  async function addJob(e: any) {
    e.preventDefault();

    await fetch("/api/jobs", {
      method: "POST",
      body: JSON.stringify({
        company,
        title,
        status,
        notes,
      }),
    });

    setCompany("");
    setTitle("");
    setNotes("");
    setStatus("Applied");

    fetchJobs();
  }

  async function deleteJob(id: number) {
    await fetch("/api/jobs", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
  
    fetchJobs();
  }

const total = jobs.length;
const interviews = jobs.filter((j: any) => j.status === "Interview").length;
const offers = jobs.filter((j: any) => j.status === "Offer").length;
const rejected = jobs.filter((j: any) => j.status === "Rejected").length;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Job Tracker</h1>
      <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="border p-3">Total: {total}</div>
      <div className="border p-3">Interviews: {interviews}</div>
      <div className="border p-3">Offers: {offers}</div>
      <div className="border p-3">Rejected: {rejected}</div>
      </div>
      <form onSubmit={addJob} className="space-y-2 mb-6">
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
          Add Job
        </button>
      </form>

    <div className="space-y-2">
      {jobs.map((job: any) => (
        <div key={job.id} className="border p-3 flex justify-between">
            <div>
            <div className="font-semibold">{job.company}</div>
      <div>{job.title}</div>
      <div className="text-sm mt-1">{job.notes}</div>
      <div className="text-sm text-gray-500">{job.status}</div>
    </div>

    <button
      onClick={() => deleteJob(job.id)}
      className="text-red-500"
    >
      Delete
    </button>
  </div>
))}
      </div>
    </div>
  );
}