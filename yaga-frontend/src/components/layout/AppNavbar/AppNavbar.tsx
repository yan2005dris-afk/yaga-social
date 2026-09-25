import type { FC, FormEvent } from "react";
import { Link } from "react-router-dom";
import { Share2, Search, Bell, ArrowLeft } from "lucide-react";
import type { AppNavbarProps } from "./AppNavbar.types";
import { Avatar } from "../../ui/Avatar";
import { Badge } from "../../ui/Badge";
import { Input } from "../../ui/Input";
import { IconButton } from "../../ui/Button";
import styles from "./AppNavbar.module.css";

export const AppNavbar: FC<AppNavbarProps> = ({
  currentUser,
  showSearch = true,
  searchQuery = "",
  onSearchChange,
  onSearchSubmit,
  statusVariant = "federated",
  statusText,
  unreadNotificationsCount = 0,
  onNotificationsClick,
  isNotificationsOpen = false,
  notificationsSlot,
  backTo,
  backLabel = "Back",
  actions,
  className = "",
}) => {
  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(searchQuery);
    }
  };

  const getStatusBadge = () => {
    if (statusVariant === "federated") {
      return (
        <Badge variant="federated" ping={true}>
          {statusText || "Federated • Live"}
        </Badge>
      );
    }
    if (statusVariant === "websocket") {
      return (
        <Badge variant="websocket" ping={true}>
          {statusText || "WebSocket • Connected"}
        </Badge>
      );
    }
    return null;
  };

  return (
    <header
      className={`${styles.header} ${className}`}
      data-testid="app-navbar"
    >
      <div className={styles.inner}>
        {/* Left: Brand or Back Button */}
        <div className={styles.leftSection}>
          {backTo ? (
            <Link
              to={backTo}
              className={styles.backButton}
              data-testid="navbar-back-link"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{backLabel}</span>
            </Link>
          ) : (
            <Link
              to="/feed"
              className={styles.brandLink}
              data-testid="navbar-brand-link"
            >
              <div className={styles.brandIcon}>
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <span className={styles.brandText}>Relaymesh</span>
                <span className={styles.brandSubtext}>Distributed Social</span>
              </div>
            </Link>
          )}
        </div>

        {/* Center: Search Omnibox */}
        {showSearch && (
          <div className={styles.centerSection}>
            <form onSubmit={handleSearchSubmit}>
              <Input
                variant="pill"
                placeholder="Search people, relays, hashtags..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                leftIcon={<Search className="w-3.5 h-3.5 text-slate-400" />}
                data-testid="navbar-search-input"
              />
            </form>
          </div>
        )}

        {/* Right: Status badge, Notification Popover trigger, Actions, Avatar */}
        <div className={styles.rightSection}>
          {getStatusBadge()}

          {actions}

          <div className={styles.notificationsContainer}>
            <IconButton
              icon={<Bell className="w-4 h-4" />}
              ariaLabel="Notifications"
              variant={isNotificationsOpen ? "secondary" : "ghost"}
              badgeCount={unreadNotificationsCount}
              onClick={onNotificationsClick}
              data-testid="navbar-notifications-btn"
            />

            {isNotificationsOpen && notificationsSlot && (
              <div
                className={styles.popoverDropdown}
                data-testid="navbar-notifications-popover"
              >
                {notificationsSlot}
              </div>
            )}
          </div>

          <Link
            to={currentUser ? `/profile/${currentUser.username}` : "/login"}
            data-testid="navbar-profile-link"
          >
            <Avatar
              src={currentUser?.avatarUrl}
              alt={currentUser?.fullName || currentUser?.username || "Guest"}
              size="sm"
              showRing={true}
              ringColor="indigo"
            />
          </Link>
        </div>
      </div>
    </header>
  );
};
