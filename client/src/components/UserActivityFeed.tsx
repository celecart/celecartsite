import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Clock, User, Eye, LogIn, UserPlus, Activity } from 'lucide-react';

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

interface UserActivityFeedProps {
  userId?: number;
  limit?: number;
  showAllUsers?: boolean;
  className?: string;
  compact?: boolean;
  showUserInfo?: boolean;
}

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

const formatTimeAgo = (timestamp: string) => {
  const now = new Date();
  const activityTime = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - activityTime.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};

export const UserActivityFeed: React.FC<UserActivityFeedProps> = ({
  userId,
  limit = 20,
  showAllUsers = false,
  className = '',
  compact = false,
  showUserInfo = false
}) => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let url: string;
        if (showAllUsers) {
          url = `/api/activities/recent?limit=${limit}`;
        } else if (userId) {
          url = `/api/users/${userId}/activities?limit=${limit}`;
        } else {
          setError('No user ID provided');
          return;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        
        const data = await response.json();
        setActivities(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [userId, limit, showAllUsers]);

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Failed to load activities</p>
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recent activity</p>
            <p className="text-sm">Activities will appear here as you use the app</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {!compact && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
            <Badge variant="secondary" className="ml-auto">
              {activities.length}
            </Badge>
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={compact ? "p-3" : ""}>
        <ScrollArea className={compact ? "h-48" : "h-96"}>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id}>
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full ${getActivityColor(activity.activityType)}`}>
                    {getActivityIcon(activity.activityType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`font-medium text-gray-900 ${compact ? 'text-xs' : 'text-sm'}`}>
                        {formatActivityDescription(activity)}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {activity.activityType}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <p className="text-xs text-gray-500">
                        {formatTimeAgo(activity.timestamp)}
                      </p>
                      {(showAllUsers || showUserInfo) && (
                        <>
                          <Separator orientation="vertical" className="h-3" />
                          <User className="h-3 w-3 text-gray-400" />
                          <p className="text-xs text-gray-500">
                            User {activity.userId}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {index < activities.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default UserActivityFeed;