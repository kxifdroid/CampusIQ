"use client";

import { Search, /*Bell,*/ Menu, Brain, LogOut, Sun, Moon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
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
    <header className="h-16 flex items-center gap-4 px-6 border-b border-[#E4E2F0] dark:border-white/[0.08] bg-white dark:bg-[#16161E] sticky top-0 z-30">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-[#6B6B8A] hover:text-[#7C6FF7] transition-colors"
        aria-label="Open navigation"
      >
        <Menu size={22} />
      </button>

      <div className="flex items-center gap-2 lg:hidden">
        <div className="w-7 h-7 rounded-lg bg-[#7C6FF7] flex items-center justify-center">
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
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B8A] pointer-events-none z-10"
        />
        <TextBoxComponent
          placeholder="Search campus resources..."
          focus={() => setSearchFocused(true)}
          blur={() => setSearchFocused(false)}
          cssClass="e-outline w-full pl-9 bg-white dark:bg-[#16161E] rounded-lg text-sm placeholder:text-[#6B6B8A] text-[#1A1A2E]"
        />
      </div>

      <div className="flex-1" />

      <div className="hidden sm:block text-right">
        <p className="text-xs font-semibold text-[#1A1A2E]">{userName}</p>
        <p className="text-[10px] text-[#6B6B8A]">Signed in</p>
      </div>

      <button
        onClick={() => setShowProfile(true)}
        aria-label="Edit profile"
        className="w-8 h-8 rounded-full bg-[#E8E6FF] text-[#7C6FF7] hover:bg-[#DDD9FF] flex items-center justify-center flex-shrink-0 transition-colors"
      >
        <span className="text-xs font-semibold">{initials}</span>
      </button>

      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1A1A2E]/40 backdrop-blur-none" onClick={() => setShowProfile(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-[#16161E] border border-[#E4E2F0] dark:border-white/[0.08] rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-[#1A1A2E] dark:text-white mb-4">Edit profile</h2>
            <label className="block text-xs font-medium text-[#6B6B8A] mb-1">Name</label>
            <TextBoxComponent
              value={profileName}
              change={(e: any) => setProfileName(e.value || "")}
              cssClass="e-outline w-full mb-4 bg-white dark:bg-[#16161E] text-[#1A1A2E] dark:text-white"
            />
            <div className="flex gap-3 justify-end">
              <ButtonComponent
                onClick={() => setShowProfile(false)}
                cssClass="e-flat bg-[#E8E6FF] text-[#7C6FF7] rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#DDD9FF] transition-colors"
              >
                Cancel
              </ButtonComponent>
              <ButtonComponent
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
                    router.refresh();
                  } catch (e) {
                    console.error(e);
                    alert("Failed to update profile");
                  } finally {
                    setLoadingProfile(false);
                  }
                }}
                disabled={loadingProfile}
                cssClass="e-primary bg-[#7C6FF7] text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#6A5EE0] transition-colors disabled:opacity-50"
              >
                {loadingProfile ? "Saving..." : "Save"}
              </ButtonComponent>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg text-[#6B6B8A] hover:bg-[#F0EEFF] border border-[#E4E2F0] transition-colors"
        aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      >
        {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
      </button>

      <button
        onClick={() => signOut({ callbackUrl: "/auth/signin" })}
        className="p-2 rounded-lg text-[#6B6B8A] hover:bg-[#F0EEFF] border border-[#E4E2F0] transition-colors"
        aria-label="Sign out"
      >
        <LogOut size={16} />
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
