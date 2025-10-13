import Header from "@/components/Header";
import UserActivityFeed from "@/components/UserActivityFeed";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { User } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/auth/user', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Your Profile</h1>
                <p className="text-white/60 text-sm">View your account details</p>
              </div>

              {loading ? (
                <div className="text-white/70">Loading...</div>
              ) : !user ? (
                <div className="text-white/80">
                  <p className="mb-4">You are not signed in.</p>
                  <Link href="/login">
                    <Button className="bg-amber-500 hover:bg-amber-600 text-black rounded-full">Sign In</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.imageUrl || user.picture || user.avatarUrl} alt={user.name || user.email} />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-white/50">Name</div>
                        <div className="text-white font-medium">{user.displayName || user.name || user.username || '—'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-white/50">Email</div>
                        <div className="text-white font-medium">{user.email || '—'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-white/50">Username</div>
                        <div className="text-white font-medium">{user.username || '—'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-white/50">Role</div>
                        <div className="text-white font-medium">{user.role || 'user'}</div>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <Link href="/">
                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full">Home</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-1">
            {user && (
              <UserActivityFeed 
                userId={user.id} 
                limit={15}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl [&_.bg-white]:bg-white/10 [&_.text-gray-900]:text-white [&_.text-gray-500]:text-white/60 [&_.text-gray-400]:text-white/40 [&_.border-gray-200]:border-white/20"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}