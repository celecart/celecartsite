import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarRail,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Users, ShieldCheck, FileText, Settings, Moon, Sun, Tags, ArrowLeft, Activity, Clock, User, Eye, LogIn, UserPlus, Filter, Star, CreditCard, Tag } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import UserActivityFeed from "@/components/UserActivityFeed";
import { Package } from "lucide-react";

interface User {
  id: number;
  username: string;
  email?: string;
  displayName?: string;
  profilePicture?: string;
  role?: "admin" | "user";
}

interface UserActivity {
  id: number;
  userId: number;
  activityType: string;
  entityType: string | null;
  entityId: number | null;
  entityName: string | null;
  metadata: string | null;
  timestamp: string;
}

export default function AdminUserActivities() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const userId = parseInt(params.id || "0");
  
  const [user, setUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<UserActivity[]>([]);
  const [activityFilter, setActivityFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/auth/user', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data.user);
          if (data.user?.role !== 'admin') {
            setLocation('/');
            return;
          }
        } else {
          setLocation('/login');
          return;
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setLocation('/login');
        return;
      }
      setLoading(false);
    };

    checkAuth();
  }, [setLocation]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId || loading) return;
      
      try {
        // Fetch user details
        const userResponse = await fetch(`/api/users/${userId}`, { credentials: 'include' });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        }

        // Fetch user activities
        const activitiesResponse = await fetch(`/api/users/${userId}/activities?limit=100`, { credentials: 'include' });
        if (activitiesResponse.ok) {
          const activitiesData = await activitiesResponse.json();
          setActivities(activitiesData);
          setFilteredActivities(activitiesData);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, [userId, loading]);

  useEffect(() => {
    let filtered = activities;

    // Filter by activity type
    if (activityFilter !== "all") {
      filtered = filtered.filter(activity => activity.activityType === activityFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(activity => 
        activity.activityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (activity.entityName && activity.entityName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (activity.metadata && activity.metadata.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredActivities(filtered);
  }, [activities, activityFilter, searchTerm]);

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'login':
        return <LogIn className="h-4 w-4" />;
      case 'signup':
        return <UserPlus className="h-4 w-4" />;
      case 'view':
        return <Eye className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (activityType: string) => {
    switch (activityType) {
      case 'login':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'signup':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'view':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatActivityDescription = (activity: UserActivity) => {
    const { activityType, entityType, entityName } = activity;
    
    switch (activityType) {
      case 'login':
        const metadata = activity.metadata ? JSON.parse(activity.metadata) : {};
        const method = metadata.loginMethod === 'google' ? 'Google' : 'Email';
        return `Logged in via ${method}`;
      case 'signup':
        return 'Created account';
      case 'view':
        if (entityType === 'celebrity' && entityName) {
          return `Viewed ${entityName}'s profile`;
        }
        return 'Viewed content';
      default:
        return `Performed ${activityType} action`;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <SidebarProvider className="bg-background text-white">
      <Sidebar variant="inset" collapsible="icon" className="border-r">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2">
            <div className="text-lg font-bold">Cele Admin</div>
          </div>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin')} tooltip="Dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin/users')} tooltip="Users">
                  <Users />
                  <span>Users</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin/roles')} tooltip="Roles & Permissions">
                  <ShieldCheck />
                  <span>Roles & Permissions</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin/categories')} tooltip="Categories">
                  <Tags />
                  <span>Categories</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin/brands')} tooltip="Brands">
                  <Tag />
                  <span>Brands</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin/celebrities')} tooltip="Celebrities">
                  <Star />
                  <span>Celebrities</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setLocation('/admin/products')} tooltip="Products">
                  <Package />
                  <span>Products</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={true} onClick={() => setLocation('/admin')} tooltip="Content">
                  <FileText />
                  <span>Content</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin/plans')} tooltip="Plans">
                  <CreditCard />
                  <span>Plans</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin')} tooltip="Settings">
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="px-2 flex items-center justify-between gap-2">
            <div className="text-xs text-muted-foreground">
              Signed in as {currentUser?.displayName || currentUser?.username}
            </div>
            <ThemeToggle />
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <div className="flex h-14 items-center gap-3 px-4 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger />
          <div className="font-bold text-lg">Cele Admin</div>
          <div className="ml-auto flex items-center gap-3">
            <Button variant="outline" size="icon" aria-label="Toggle theme">
              {isDark ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button variant="outline" onClick={() => setLocation('/')}>Go to Site</Button>
            <Button variant="ghost" onClick={() => setLocation('/login')}>Sign out</Button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={() => setLocation('/admin/users')} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Users
            </Button>
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                User Activities
              </h1>
              <p className="text-sm text-muted-foreground">
                {user ? `Activities for ${user.displayName || user.username} (ID: ${user.id})` : `Activities for User ${userId}`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Activity Type</label>
                    <Select value={activityFilter} onValueChange={setActivityFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All activities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Activities</SelectItem>
                        <SelectItem value="login">Login</SelectItem>
                        <SelectItem value="signup">Signup</SelectItem>
                        <SelectItem value="view">View</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Search</label>
                    <Input 
                      placeholder="Search activities..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Showing {filteredActivities.length} of {activities.length} activities
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Activity Timeline
                    <Badge variant="secondary" className="ml-auto">
                      {filteredActivities.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredActivities.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No activities found</p>
                      <p className="text-sm">Try adjusting your filters</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {filteredActivities.map((activity, index) => (
                        <div key={activity.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className={`p-2 rounded-full ${getActivityColor(activity.activityType)}`}>
                            {getActivityIcon(activity.activityType)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-medium text-gray-900">
                                {formatActivityDescription(activity)}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {activity.activityType}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTimestamp(activity.timestamp)}
                              </div>
                              {activity.entityType && (
                                <div className="flex items-center gap-1">
                                  <span>Entity:</span>
                                  <span className="font-medium">{activity.entityType}</span>
                                  {activity.entityName && (
                                    <span>({activity.entityName})</span>
                                  )}
                                </div>
                              )}
                            </div>
                            {activity.metadata && (
                              <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                                <strong>Metadata:</strong> {activity.metadata}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}