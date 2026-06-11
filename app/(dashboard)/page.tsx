import { getServerSession } from "next-auth";
import LibraryWidget from "@/components/widgets/LibraryWidget";
import CafeteriaWidget from "@/components/widgets/CafeteriaWidget";
import EventsWidget from "@/components/widgets/EventsWidget";
import AcademicsWidget from "@/components/widgets/AcademicsWidget";
import ChatPanel from "@/components/chat/ChatPanel";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const firstName = session?.user?.name?.split(" ")[0] || session?.user?.email?.split("@")[0] || "there";

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Good {getGreeting()}, <span className="gradient-text">{firstName}</span>
        </h1>
        <p className="text-sm text-white/40 mt-1">Here&apos;s what&apos;s happening on campus today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <LibraryWidget />
        <CafeteriaWidget />
        <EventsWidget />
        <AcademicsWidget />
      </div>

      <ChatPanel />
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Morning";
  if (h < 17) return "Afternoon";
  return "Evening";
}
