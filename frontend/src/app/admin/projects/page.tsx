"use client";
import { useEffect,useState } from "react";
import AppShell from "@/components/AppShell";
import { apiFetch } from "@/lib/api";
type P={id:number;name:string;description:string|null;owner_id:number;created_at:string};
export default function AdminProjects(){const [data,setData]=useState<P[]>([]);const [error,setError]=useState("");useEffect(()=>{apiFetch<P[]>("/api/admin/projects").then(setData).catch(e=>setError(e.message))},[]);return <AppShell title="Admin Projects" subtitle="All projects in the workspace."><div className="card rounded-[28px] overflow-x-auto p-5">{error&&<p className="text-red-800 text-xs">{error}</p>}<table className="w-full min-w-[650px] text-left text-sm"><thead><tr className="text-xs text-[#806d60]"><th className="p-3">ID</th><th className="p-3">Project</th><th className="p-3">Owner ID</th><th className="p-3">Created</th></tr></thead><tbody>{data.map(p=><tr key={p.id} className="table-row"><td className="p-3">{p.id}</td><td className="p-3 font-semibold">{p.name}</td><td className="p-3">{p.owner_id}</td><td className="p-3 text-[#806d60]">{new Date(p.created_at).toLocaleString()}</td></tr>)}</tbody></table></div></AppShell>}
