import { useState, type FC } from "react";
import { useParams } from "react-router-dom";
import { Share2, Edit3 } from "lucide-react";
import type { UserProfileSummary, GraphSuggestionUser } from "../types/domain";
import type { ProfileTabId } from "../components/profile/ProfileHeaderCard";
import { useAuth } from "../hooks/useAuth";
import { ThreeColumnLayout, AppNavbar, SidebarNav } from "../components/layout";
import { UserSummaryCard, GraphSuggestionsCard } from "../components/social";
import { ProfileHeaderCard, PostGridItem } from "../components/profile";
import { Button } from "../components/ui/Button";

interface PostGalleryItem {
  readonly id: string;
  readonly imageUrl: string;
  readonly title: string;
  readonly likesCount: number;
  readonly repliesCount: number;
}

const GALLERY_POSTS: readonly PostGalleryItem[] = [
  {
    id: "gal-1",
    imageUrl:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&auto=format&fit=crop&q=80",
    title: "Night deploys hit different...",
    likesCount: 412,
    repliesCount: 38,
  },
  {
    id: "gal-2",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&auto=format&fit=crop&q=80",
    title: "Relay v2 benchmarks live",
    likesCount: 1100,
    repliesCount: 204,
  },
  {
    id: "gal-3",
    imageUrl:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&auto=format&fit=crop&q=80",
    title: "Offline weekend in forest",
    likesCount: 689,
    repliesCount: 51,
  },
];

const SUGGESTIONS: readonly GraphSuggestionUser[] = [
  {
    id: "user-alice",
    username: "alice",
    fullName: "Alice Chen",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    mutualConnectionSnippet: "Mutual followers: 4",
    isFollowing: false,
  },
];

export const ProfilePage: FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTabId>("posts");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [suggestions, setSuggestions] =
    useState<readonly GraphSuggestionUser[]>(SUGGESTIONS);

  const profileUser: UserProfileSummary = {
    id: user?.id || "user-maya",
    username: username || user?.username || "maya",
    fullName: user?.fullName || "Maya Krishnan",
    avatarUrl:
      user?.avatarUrl ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    isVerified: true,
    instanceUrl: "relaymesh.io",
    bio: "Distributed systems engineer. Building open relays & photography enthusiast. Previously @planet-scale. Posts federate everywhere.",
    location: "Bengaluru, IN",
    website: "maya.build",
    joinedDate: "March 2023",
    homeRelay: "ap-south-1",
    stats: {
      followersCount: 12400,
      followingCount: 890,
      postsCount: 3100,
    },
  };

  const handleFollowToggle = (userId: string) => {
    setSuggestions((prev) =>
      prev.map((s) =>
        s.id === userId ? { ...s, isFollowing: !s.isFollowing } : s,
      ),
    );
  };

  return (
    <ThreeColumnLayout
      navbar={
        <AppNavbar
          backTo="/feed"
          backLabel="Back to feed"
          showSearch={false}
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Share2 className="w-3.5 h-3.5" />}
              >
                Share
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Edit3 className="w-3.5 h-3.5" />}
              >
                Edit Profile
              </Button>
            </div>
          }
        />
      }
      leftSidebar={
        <>
          <UserSummaryCard user={profileUser} />
          <SidebarNav />
        </>
      }
      rightSidebar={
        <GraphSuggestionsCard
          suggestions={suggestions}
          onFollowToggle={handleFollowToggle}
        />
      }
    >
      <ProfileHeaderCard
        user={profileUser}
        coverUrl="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80"
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isSubscribed={isSubscribed}
        onSubscribeToggle={() => setIsSubscribed(!isSubscribed)}
      />

      {activeTab === "posts" && (
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          data-testid="profile-posts-grid"
        >
          {GALLERY_POSTS.map((item) => (
            <PostGridItem
              key={item.id}
              id={item.id}
              imageUrl={item.imageUrl}
              title={item.title}
              likesCount={item.likesCount}
              repliesCount={item.repliesCount}
            />
          ))}
        </div>
      )}

      {activeTab !== "posts" && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-sm text-slate-500">
          Showing {activeTab} for @{profileUser.username}
        </div>
      )}
    </ThreeColumnLayout>
  );
};
