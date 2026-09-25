import { useState, type FC } from "react";
import type { Post, CreatePostPayload, ReactionType } from "../types/feed";
import type { UserProfileSummary, GraphSuggestionUser } from "../types/domain";
import type { SocialNotification } from "../types/notifications";
import { useAuth } from "../hooks/useAuth";
import { ThreeColumnLayout, AppNavbar, SidebarNav } from "../components/layout";
import {
  UserSummaryCard,
  CreatePostCard,
  PostCard,
  GraphSuggestionsCard,
  RelayHealthWidget,
} from "../components/social";
import { Tabs, type TabItem } from "../components/ui/Tabs";
import { NotificationPopover } from "../components/notifications";

type FeedFilter = "for_you" | "latest" | "relays";

const FEED_FILTER_TABS: readonly TabItem<FeedFilter>[] = [
  { id: "for_you", label: "For you (Graph Feed)" },
  { id: "latest", label: "Latest" },
  { id: "relays", label: "Relays near you" },
];

const INITIAL_SUGGESTIONS: readonly GraphSuggestionUser[] = [
  {
    id: "user-alice",
    username: "alice",
    fullName: "Alice Chen",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    mutualConnectionSnippet: "Followed by Jon and 2 others",
    isFollowing: false,
  },
  {
    id: "user-marcus",
    username: "marcus",
    fullName: "Marcus Cole",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    mutualConnectionSnippet: "Followed by Priya and 5 others",
    isFollowing: false,
  },
];

const INITIAL_POSTS: readonly Post[] = [
  {
    id: "post-1",
    author: {
      id: "user-jonas",
      username: "jonas",
      fullName: "Jonas Weber",
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      isVerified: true,
      instanceUrl: "mastodon.social",
      stats: { followersCount: 4200, followingCount: 650, postsCount: 180 },
    },
    content:
      "Just shipped our relay cluster to 99.99% uptime. Decentralized social finally feels instant — no single point of failure. Full write-up + benchmarks inside.",
    createdAt: "12m",
    attachments: [
      {
        id: "att-1",
        url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
        storageProvider: "RUSTFS_S3",
        mimeType: "image/jpeg",
        altText: "Server cluster",
      },
    ],
    reactions: { LIKE: 1200, LOVE: 80, CELEBRATE: 40, RETWEET: 342 },
    commentsCount: 89,
    visibility: "PUBLIC",
  },
  {
    id: "post-2",
    author: {
      id: "user-alice",
      username: "alice",
      fullName: "Alice Chen",
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      isVerified: true,
      instanceUrl: "relaymesh.io",
      stats: { followersCount: 8900, followingCount: 410, postsCount: 310 },
    },
    content:
      "Photo walk through Kyoto this morning. Federation means my photos live on my own RustFS bucket — not a corporate server. Full-res, always mine.",
    createdAt: "48m",
    attachments: [
      {
        id: "att-2",
        url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80",
        storageProvider: "RUSTFS_S3",
        mimeType: "image/jpeg",
        altText: "Kyoto",
      },
    ],
    reactions: { LIKE: 864, LOVE: 120, CELEBRATE: 25, RETWEET: 512 },
    commentsCount: 124,
    visibility: "FEDERATED",
    userReaction: "LIKE",
  },
];

const INITIAL_NOTIFICATIONS: readonly SocialNotification[] = [
  {
    id: "notif-1",
    type: "POST_LIKE",
    actor: {
      id: "user-alice",
      username: "alice",
      fullName: "Alice Chen",
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80",
      isVerified: true,
      instanceUrl: "relaymesh.io",
      stats: { followersCount: 10, followingCount: 5, postsCount: 20 },
    },
    message: "loved your post",
    targetSnippet: "Relay v2 benchmarks are live",
    createdAt: "2m ago",
    isRead: false,
  },
  {
    id: "notif-2",
    type: "POST_BOOST",
    actor: {
      id: "user-jonas",
      username: "jonas",
      fullName: "Jonas Weber",
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80",
      isVerified: true,
      instanceUrl: "mastodon.social",
      stats: { followersCount: 10, followingCount: 5, postsCount: 20 },
    },
    message: "boosted you to 4 relays",
    createdAt: "18m ago",
    isRead: false,
  },
];

export const FeedPage: FC = () => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<FeedFilter>("for_you");
  const [posts, setPosts] = useState<readonly Post[]>(INITIAL_POSTS);
  const [suggestions, setSuggestions] =
    useState<readonly GraphSuggestionUser[]>(INITIAL_SUGGESTIONS);
  const [notifications, setNotifications] = useState<
    readonly SocialNotification[]
  >(INITIAL_NOTIFICATIONS);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const currentUserSummary: UserProfileSummary = {
    id: user?.id || "user-current",
    username: user?.username || "maya",
    fullName: user?.fullName || "Maya Krishnan",
    avatarUrl:
      user?.avatarUrl ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    isVerified: true,
    instanceUrl: "relaymesh.io",
    stats: {
      followersCount: 12400,
      followingCount: 890,
      postsCount: 3100,
    },
  };

  const handlePublishPost = (payload: CreatePostPayload) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: currentUserSummary,
      content: payload.content,
      createdAt: "Just now",
      attachments: [],
      reactions: { LIKE: 0, LOVE: 0, CELEBRATE: 0, RETWEET: 0 },
      commentsCount: 0,
      visibility: payload.visibility,
    };
    setPosts([newPost, ...posts]);
  };

  const handleReaction = (postId: string, reaction: ReactionType) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id !== postId) return p;
        const currentActive = p.userReaction === reaction;
        const diff = currentActive ? -1 : 1;
        return {
          ...p,
          userReaction: currentActive ? undefined : reaction,
          reactions: {
            ...p.reactions,
            [reaction]: Math.max(0, p.reactions[reaction] + diff),
          },
        };
      }),
    );
  };

  const handleFollowToggle = (userId: string) => {
    setSuggestions((prev) =>
      prev.map((s) =>
        s.id === userId ? { ...s, isFollowing: !s.isFollowing } : s,
      ),
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <ThreeColumnLayout
      navbar={
        <AppNavbar
          currentUser={currentUserSummary}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusVariant="federated"
          statusText="Federated • Live"
          unreadNotificationsCount={unreadCount}
          isNotificationsOpen={isNotificationsOpen}
          onNotificationsClick={() =>
            setIsNotificationsOpen(!isNotificationsOpen)
          }
          notificationsSlot={
            <NotificationPopover
              notifications={notifications}
              onMarkAllAsRead={handleMarkAllRead}
            />
          }
        />
      }
      leftSidebar={
        <>
          <UserSummaryCard user={currentUserSummary} />
          <SidebarNav
            unreadMessagesCount={4}
            unreadAlertsCount={unreadCount}
            onNewPostClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </>
      }
      rightSidebar={
        <>
          <GraphSuggestionsCard
            suggestions={suggestions}
            onFollowToggle={handleFollowToggle}
          />
          <RelayHealthWidget />
        </>
      }
    >
      <CreatePostCard
        currentUser={currentUserSummary}
        onPublish={handlePublishPost}
      />

      <div className="py-2">
        <Tabs<FeedFilter>
          items={FEED_FILTER_TABS}
          activeTab={activeFilter}
          onChange={setActiveFilter}
          variant="underline"
        />
      </div>

      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onReaction={handleReaction} />
        ))}
      </div>
    </ThreeColumnLayout>
  );
};
