

interface Activity {
    log: string,
    type:"create" | "update" | "delete" | "login" | "logout" | "verification",
    createdAt: string
}
export default function ActivityCard({ log, type, createdAt }: Activity) {

    const date = new Date(createdAt);
    const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
    });
    const iconMap = {
        create: "fa-solid fa-plus",
        update: "fa-solid fa-pen-to-square",
        delete: "fa-solid fa-trash",
        login: "fa-solid fa-right-to-bracket",
        logout: "fa-solid fa-right-from-bracket",
        verification: "fa-solid fa-user-check",
    };

    return (
        <div className="bg-gray-300 rounded-md p-4">
            <p className="text-sm mb-2">{formattedDate}</p>
            <div className="flex items-center gap-4">
                <span className="flex items-center justify-center size-8 rounded-full bg-gray-200">
                    <i className={iconMap[type]}></i>
                </span>
                <div className="flex-1">
                    <p className="text-gray-800 text-sm font-medium">{type}</p>
                    <p className="text-gray-800 text-sm">{log}</p>
                    <p className="text-gray-500 text-xs">{formattedTime}</p>
                </div>
            </div>
        </div>
    )
}
