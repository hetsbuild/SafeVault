import { useEffect, useState } from "react";
import { Loader2, Activity } from "lucide-react";
import ActivityCard from "./ActivityCard";

interface Activity {
  _id: string;
  log: string;
  type: "create" | "update" | "delete" | "login" | "logout" | "verification";
  createdAt: string;
}

export default function Page() {
  const [data, setData] = useState<Activity[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const apiUrl = import.meta.env.VITE_BACKEND_URL;
    fetch(`${apiUrl}/getactivity`, { credentials: "include" })
      .then((res) => res.json())
      .then((d) => setData(d.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Activity Log</h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-indigo-600" size={32} />
        </div>
      ) : data && data.length > 0 ? (
        <div className="space-y-3 max-w-2xl">
          {data.map((d) => (
            <ActivityCard key={d._id} log={d.log} type={d.type} createdAt={d.createdAt} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <Activity size={40} className="mx-auto mb-3" />
          <p className="text-lg font-medium">No activity yet</p>
        </div>
      )}
    </div>
  );
}