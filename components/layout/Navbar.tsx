"use client";

import { Search, /*Bell,*/ Menu, Brain, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const userName = session?.user?.name || session?.user?.email || "User";
  const initials = getInitials(userName);

  const [showProfile, setShowProfile] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    if (!showProfile) return;
    // fetch profile when modal opens
    let mounted = true;
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setProfileName(data.name || "");
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [showProfile]);

  return (
    <header className="h-16 flex items-center gap-4 px-6 border-b border-white/[0.06] bg-[#16161E]/80 backdrop-blur-sm sticky top-0 z-30">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-white/50 hover:text-white transition-colors"
        aria-label="Open navigation"
      >
        <Menu size={22} />
      </button>

      <div className="flex items-center gap-2 lg:hidden">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] flex items-center justify-center">
          <Brain size={13} className="text-white" />
        </div>
        <span className="font-bold gradient-text text-sm">CampusIQ</span>
      </div>

      <div
        className={`flex-1 max-w-lg relative transition-all duration-300 ${
          searchFocused ? "max-w-xl" : ""
        }`}
      >
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search campus resources..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="w-full pl-9 pr-4 py-2 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#7C3AED]/60 focus:bg-white/[0.07] transition-all duration-300"
        />
      </div>

      <div className="flex-1" />


      <div className="hidden sm:block text-right">
        <p className="text-xs font-semibold text-white/75">{userName}</p>
        <p className="text-[10px] text-white/30">Signed in</p>
      </div>

      <button
        onClick={() => setShowProfile(true)}
        aria-label="Edit profile"
        className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] flex items-center justify-center flex-shrink-0"
      >
        <span className="text-xs font-bold">{initials}</span>
      </button>

      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowProfile(false)} />
          <div className="relative w-full max-w-md bg-[#0D0D12] rounded p-6 shadow-lg">
            <h2 className="text-lg font-bold mb-3">Edit profile</h2>
            <label className="block text-sm mb-1">Name</label>
            <input
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full px-3 py-2 mb-4 rounded border bg-white/[0.03]"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowProfile(false)}
                className="px-3 py-2 rounded bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setLoadingProfile(true);
                  try {
                    const res = await fetch("/api/user/profile", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ name: profileName }),
                    });
                    if (!res.ok) throw new Error("Update failed");
                    setShowProfile(false);
                    // optionally refresh
                    router.refresh();
                  } catch (e) {
                    // eslint-disable-next-line no-console
                    console.error(e);
                    alert("Failed to update profile");
                  } finally {
                    setLoadingProfile(false);
                  }
                }}
                disabled={loadingProfile}
                className="px-3 py-2 rounded bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white"
              >
                {loadingProfile ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => signOut({ callbackUrl: "/auth/signin" })}
        className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-all duration-200"
        aria-label="Sign out"
      >
        <LogOut size={16} className="text-white/60" />
      </button>
    </header>
  );
}

function getInitials(value: string) {
  const parts = value.split(/[ @.]+/).filter(Boolean);
  return (
    parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U"
  );
}
