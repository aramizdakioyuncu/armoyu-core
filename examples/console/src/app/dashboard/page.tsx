'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Shield, Users, MessageSquare, Newspaper,
  ShoppingBag, Scale, LifeBuoy, Zap,
  Terminal, Globe, Info, Trash2, CheckCircle2, AlertCircle,
  Lock, Send, RefreshCw, LayoutGrid, Trophy, Radio, Award, Ban,
  Camera, MapPin, UserCheck, CreditCard
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { ArmoyuApi } from '@armoyu/core';

// --- Local Components ---
import { Navbar } from '../../components/Navbar';
import { Sidebar } from '../../components/Sidebar';
import { Footer } from '../../components/Footer';

// --- Utils ---
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Enums ---
enum LogType {
  REQUEST = 'req',
  RESPONSE = 'res',
  ERROR = 'err',
  INFO = 'info'
}

// --- Icons Mapping ---
const SERVICE_ICONS: Record<string, any> = {
  auth: Shield,
  users: Users,
  social: MessageSquare,
  blog: Newspaper,
  shop: ShoppingBag,
  rules: Scale,
  support: LifeBuoy,
  search: Terminal,
  events: Globe,
  siteInfo: Info,
  groups: Users,
  management: Shield,
  projects: LayoutGrid,
  teams: Trophy,
  stations: Radio,
  business: Award,
  chat: MessageSquare,
  blocks: Ban,
  stories: Camera,
  locations: MapPin,
  staff: UserCheck,
  payments: CreditCard,
};

// --- Helper Components ---
const ResultTree = ({ data, label, initialOpen = false }: { data: any, label?: string, initialOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const isObject = data && typeof data === 'object';
  const isEmpty = isObject && Object.keys(data).length === 0;

  if (!isObject) {
    return (
      <div className="flex items-center gap-2 py-0.5 text-[11px]">
        {label && <span className="text-gray-500 font-bold">{label}:</span>}
        <span className={cn(
          "font-mono",
          typeof data === 'string' ? 'text-emerald-400' : 'text-amber-400'
        )}>
          {JSON.stringify(data)}
        </span>
      </div>
    );
  }

  return (
    <div className="ml-2 border-l border-white/5 pl-3 py-0.5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-white/5 rounded px-1 -ml-1 transition-all group"
      >
        <div className={cn("w-3 h-3 flex items-center justify-center text-[8px] transition-transform", isOpen ? "rotate-90" : "rotate-0")}>

        </div>
        {label && <span className="text-gray-400 font-bold text-[11px]">{label}:</span>}
        <span className="text-[10px] text-gray-600 font-mono">
          {Array.isArray(data) ? `Array[${data.length}]` : `Object{${Object.keys(data).length}}`}
        </span>
      </button>

      {isOpen && !isEmpty && (
        <div className="mt-1 space-y-1">
          {Object.entries(data).map(([key, value]) => (
            <ResultTree key={key} data={value} label={key} />
          ))}
        </div>
      )}
    </div>
  );
};

// --- Config ---
const CONFIG = {
  auth: {
    title: "AuthService",
    actions: [
      { id: "login", name: "Login", method: "POST", endpoint: "/0/0/0", inputs: ["username", "password"], desc: "Bot-based authentication flow", auth: false },
      { id: "register", name: "Register", method: "POST", endpoint: "/kayit-ol/0/0/0/0/", inputs: ["username", "firstName", "lastName", "email", "password"], desc: "Create a new account", auth: false },
      { id: "forgotPassword", name: "Forgot Password", method: "POST", endpoint: "/sifremi-unuttum/0/0/0/0/", inputs: ["username", "email", "birthday", "preference"], desc: "Recover account access", auth: false },
      { id: "verifyPasswordReset", name: "Verify Reset", method: "POST", endpoint: "/sifremi-unuttum-dogrula/0/0/0/0/", inputs: ["username", "email", "birthday", "code", "newPassword"], desc: "Complete password recovery", auth: false },
      { id: "me", name: "Get Me", method: "GET", endpoint: "/me", inputs: [], desc: "Fetch current user profile", auth: true }
    ]
  },
  rules: {
    title: "RuleService",
    actions: [
      { id: "getRules", name: "Get Rules", method: "POST", endpoint: "/kurallar/0", inputs: [], desc: "Fetch community rules", auth: false },
      { id: "createRule", name: "Create Rule", method: "POST", endpoint: "/kurallar/0/ekle", inputs: ["text", "penalty"], desc: "Add a new rule", auth: true }
    ]
  },
  users: {
    title: "UserService",
    actions: [
      { id: "getUser", name: "Get Profile", method: "POST", endpoint: "/0/0/0/", inputs: ["oyuncubakusername"], desc: "Fetch public profile by username", auth: false },
      { id: "addFriend", name: "Add Friend", method: "POST", endpoint: "/0/0/arkadas-ol/0/0/", inputs: ["oyuncubakid"], desc: "Send friend request", auth: true },
      { id: "removeFriend", name: "Remove Friend", method: "POST", endpoint: "/0/0/arkadas-cikar/0/0/", inputs: ["oyuncubakid"], desc: "Remove friend connection", auth: true },
      { id: "respondToFriendRequest", name: "Respond to Friend", method: "POST", endpoint: "/0/0/arkadas-cevap/0/0/", inputs: ["oyuncubakid", "cevap"], desc: "Accept (1) or Decline (0) request", auth: true },
      { id: "updatePrivatePersonalInfo", name: "Update Private Info", method: "POST", endpoint: "/0/0/profil/ozelbilgiler/0/", inputs: ["firstName", "lastName", "email", "birthday", "phoneNumber", "countryID", "provinceID", "passwordControl"], desc: "Update sensitive profile data", auth: true },
      { id: "getUserSchools", name: "Get Schools", method: "POST", endpoint: "/0/0/okullarim/0/0/", inputs: ["oyuncubakid"], desc: "Fetch education history", auth: true },
      { id: "getSchoolDetail", name: "School Detail", method: "POST", endpoint: "/0/0/okullar/detay/0/", inputs: ["okulID"], desc: "Fetch specific school info", auth: true },
      { id: "getFriendsList", name: "Get Friends List", method: "POST", endpoint: "/0/0/arkadaslarim/0/0/", inputs: ["oyuncubakid", "page", "limit"], desc: "Fetch friends for a player", auth: true },
      { id: "getInvitationsList", name: "Get Invitations", method: "POST", endpoint: "/0/0/davetliste/0/", inputs: ["page"], desc: "Fetch pending requests", auth: true },
      { id: "refreshInviteCode", name: "Refresh Invite Code", method: "POST", endpoint: "/0/0/davetkodyenile/0/", inputs: [], desc: "Regenerate your invite code", auth: true },
      { id: "requestEmailVerificationUrl", name: "Request Email Verification", method: "POST", endpoint: "/0/0/profil/maildogrulamaURL/", inputs: ["userID"], desc: "Trigger verification email", auth: true },
      { id: "pokeFriend", name: "Poke Friend", method: "POST", endpoint: "/0/0/arkadas-durt/0/0/", inputs: ["oyuncubakid"], desc: "Nudge a friend", auth: true },
      { id: "setFavoriteTeam", name: "Set Favorite Team", method: "POST", endpoint: "/0/0/profil/favoritakimsec/0/", inputs: ["favoritakimID"], desc: "Update team preference", auth: true },
      { id: "getUserMedia", name: "Get Media", method: "POST", endpoint: "/0/0/medya/0/0/", inputs: ["oyuncubakid", "limit", "page", "kategori"], desc: "Fetch player photos/videos", auth: true },
      { id: "getSocialProfile", name: "Social Profile", method: "POST", endpoint: "/0/0/sosyal/profil/0/", inputs: ["oyuncubakid"], desc: "Fetch social profile data", auth: true },
      { id: "getNotifications", name: "Get Notifications", method: "POST", endpoint: "/0/0/bildirim/0/0/", inputs: [], desc: "Fetch latest alerts", auth: true },
      { id: "getNotificationsHistory", name: "Notifications History", method: "POST", endpoint: "/0/0/bildirimler/0/0/", inputs: ["page", "limit", "kategori", "kategoridetay"], desc: "Fetch filtered alert history", auth: true },
      { id: "updateAvatar", name: "Update Avatar", method: "POST", endpoint: "/0/0/avatar-guncelle/0/0/", inputs: ["resim"], desc: "Upload new profile picture", auth: true },
      { id: "resetAvatar", name: "Reset Avatar", method: "POST", endpoint: "/0/0/avatar-varsayilan/0/0/", inputs: [], desc: "Revert to default avatar", auth: true },
      { id: "resetBanner", name: "Reset Banner", method: "POST", endpoint: "/0/0/banner-varsayilan/0/0/", inputs: [], desc: "Revert to default banner", auth: true },
      { id: "updateBackground", name: "Update Background", method: "POST", endpoint: "/0/0/arkaplan-guncelle/0/0/", inputs: ["resim"], desc: "Upload new profile background", auth: true },
      { id: "rotateMedia", name: "Rotate Media", method: "POST", endpoint: "/0/0/medya/donder/0/", inputs: ["fotografID", "derece"], desc: "Rotate a photo by degree", auth: true },
      { id: "deleteMedia", name: "Delete Media", method: "POST", endpoint: "/0/0/medya/sil/0/", inputs: ["medyaID"], desc: "Remove a gallery item", auth: true },
      { id: "uploadMedia", name: "Upload Media", method: "POST", endpoint: "/0/0/medya/yukle/0/", inputs: ["media[]", "category"], desc: "Upload photos/videos to gallery", auth: true },
      { id: "getNotificationSettings", name: "Get Notification Settings", method: "POST", endpoint: "/0/0/bildirimler/ayarlar/liste/", inputs: [], desc: "Fetch alert preferences", auth: true },
      { id: "updateNotificationSettings", name: "Update Notification Settings", method: "POST", endpoint: "/deneme/deneme/bildirimler/ayarlar/0/", inputs: ["notificationSettings"], desc: "Update alerts (e.g. key=value)", auth: true },
      { id: "getXpRankings", name: "XP Rankings", method: "POST", endpoint: "/0/0/xpsiralama/0/0/", inputs: ["sayfa"], desc: "View experience leaderboard", auth: true },
      { id: "getPopRankings", name: "Popularity Rankings", method: "POST", endpoint: "/0/0/popsiralama/0/0/", inputs: ["sayfa"], desc: "View popularity leaderboard", auth: true }
    ]
  },
  projects: {
    title: "ProjectService",
    actions: [
      { id: "getScoreList", name: "Get Score List", method: "POST", endpoint: "/0/0/projeler/icerik-liste/0/", inputs: ["sayfa"], desc: "Fetch project leaderboards", auth: false },
      { id: "saveScore", name: "Save Score", method: "POST", endpoint: "/0/0/projeler/icerik-kaydet/0/", inputs: ["projeID", "skor"], desc: "Save player score", auth: true }
    ]
  },
  teams: {
    title: "TeamService",
    actions: [
      { id: "getTeams", name: "List Teams", method: "POST", endpoint: "/0/0/takimlar/liste/0/", inputs: ["favoritakimID", "sayfa"], desc: "Fetch platform teams", auth: false }
    ]
  },
  stations: {
    title: "StationService",
    actions: [
      { id: "getStations", name: "List Stations", method: "POST", endpoint: "/0/0/istasyonlar/liste/0/", inputs: ["kategori", "sayfa"], desc: "Fetch platform stations", auth: false },
      { id: "getStationEquipment", name: "Station Equipment", method: "POST", endpoint: "/0/0/istasyonlar/ekipmanlar/0/", inputs: ["istasyonID"], desc: "Fetch available equipment", auth: false }
    ]
  },
  social: {
    title: "SocialService",
    actions: [
      { id: "getPosts", name: "List Posts", method: "POST", endpoint: "/0/0/sosyal/liste/0/", inputs: ["sayfa", "postID", "category", "categorydetail"], desc: "Fetch social feed or specific post", auth: true },
      { id: "createPost", name: "Create Post", method: "POST", endpoint: "/0/0/sosyal/olustur/0/", inputs: ["sosyalicerik", "paylasimfoto[]"], desc: "Create new post with media IDs", auth: true },
      { id: "deletePost", name: "Delete Post", method: "POST", endpoint: "/0/0/sosyal/sil/0/", inputs: ["postID"], desc: "Remove a post", auth: true },
      { id: "getLikers", name: "List Likers", method: "POST", endpoint: "/0/0/sosyal/begenenler/0/", inputs: ["postID", "yorumID"], desc: "See who liked a post or comment", auth: true },
      { id: "removeLike", name: "Remove Like", method: "POST", endpoint: "/0/0/sosyal/begeni-sil/0/", inputs: ["postID", "yorumID", "kategori"], desc: "Undo a like", auth: true },
      { id: "addLike", name: "Add Like", method: "POST", endpoint: "/0/0/sosyal/begen/0/", inputs: ["postID", "kategori"], desc: "Express interest", auth: true },
      { id: "getComments", name: "List Comments", method: "POST", endpoint: "/0/0/sosyal/yorumlar/0/", inputs: ["postID"], desc: "Fetch comments for a post", auth: true },
      { id: "createComment", name: "Create Comment", method: "POST", endpoint: "/0/0/sosyal/yorum-olustur/0/", inputs: ["postID", "yorumicerik", "kategori", "kimeyanit"], desc: "Post a new comment", auth: true },
      { id: "deleteComment", name: "Delete Comment", method: "POST", endpoint: "/0/0/sosyal/yorum-sil/0/", inputs: ["yorumID"], desc: "Remove a comment", auth: true },
      { id: "getSocialNotifications", name: "Post Notifications", method: "POST", endpoint: "/0/0/sosyal/bildirim/0/", inputs: ["postID", "bildirikategori"], desc: "Fetch social alerts for a post", auth: true }
    ]
  },
  blog: {
    title: "BlogService",
    actions: [
      { id: "getNews", name: "Get News", method: "POST", endpoint: "/0/0/haberler/0/0/", inputs: ["sayfa", "limit"], desc: "Fetch platform news", auth: false }
    ]
  },
  search: {
    title: "SearchService",
    actions: [
      { id: "globalSearch", name: "Global Search", method: "POST", endpoint: "/0/0/arama/0/0/", inputs: ["query"], desc: "Search across the entire platform", auth: false }
    ]
  },
  events: {
    title: "EventService",
    actions: [
      { id: "getEvents", name: "List Events", method: "POST", endpoint: "/0/0/etkinlikler/liste/0/", inputs: ["oyunID", "etkinlikdurum", "sayfa", "limit"], desc: "Fetch platform events with filters", auth: false },
      { id: "getEventDetail", name: "Event Detail", method: "POST", endpoint: "/0/0/etkinlikler/detay/", inputs: ["eventID"], desc: "Get detailed event info", auth: false },
      { id: "joinEvent", name: "Join Event", method: "POST", endpoint: "/0/0/etkinlikler/katilim/0/", inputs: ["eventId"], desc: "Toggle event participation", auth: true },
      { id: "respondToEvent", name: "Respond to Event", method: "POST", endpoint: "/0/0/etkinlikler/katilma/0/", inputs: ["eventId", "cevap"], desc: "Respond yes/no to event", auth: true },
      { id: "getEventTeams", name: "List Event Teams", method: "POST", endpoint: "/0/0/etkinlikler/takimlar/0/", inputs: ["eventId"], desc: "Fetch teams in an event", auth: false }
    ]
  },
  siteInfo: {
    title: "SiteInformationService",
    actions: [
      { id: "getAboutContent", name: "About Content", method: "POST", endpoint: "/0/0/hakkimizda/0/0/", inputs: ["category"], desc: "Fetch site information (About Us, etc.)", auth: false },
      { id: "getPrivacyPolicy", name: "Privacy Policy", method: "POST", endpoint: "/0/0/gizlilik-sozlesmesi/0/0/", inputs: ["category"], desc: "Fetch privacy policy content", auth: false },
      { id: "getTermsOfService", name: "Terms of Service", method: "POST", endpoint: "/0/0/hizmetsartlari-kullanicipolitikalari/0/0/", inputs: ["category"], desc: "Fetch terms and policies", auth: false },
      { id: "getStatistics", name: "Statistics", method: "POST", endpoint: "/0/0/istatistik/0/0/", inputs: ["category"], desc: "Fetch platform metrics", auth: false },
      { id: "getSessionLogs", name: "Session Logs", method: "POST", endpoint: "/0/0/istatistik/0/0/", inputs: [], desc: "Fetch user login history", auth: true },
      { id: "getSiteMessages", name: "Site Messages", method: "POST", endpoint: "/0/0/sitemesaji/0/0/", inputs: ["oyuncubakid"], desc: "Fetch player messages", auth: true },
      { id: "searchTags", name: "Search Tags", method: "POST", endpoint: "/0/0/etiketler/0/0/", inputs: ["etiket", "page", "limit"], desc: "Find content by keyword", auth: true },
      { id: "search", name: "General Search", method: "POST", endpoint: "/0/0/arama/0/0/", inputs: ["oyuncuadi", "kategori", "kategoridetay", "page", "limit"], desc: "Search players, groups, etc.", auth: true },
      { id: "getSiteMessageDetail", name: "Site Message Detail", method: "POST", endpoint: "/0/0/sitemesajidetay/0/0/", inputs: [], desc: "Fetch detailed message content", auth: true }
    ]
  },
  groups: {
    title: "GroupService",
    actions: [
      { id: "getUserGroups", name: "Get Groups", method: "POST", endpoint: "/0/0/gruplarim/0/0/", inputs: ["oyuncubakid"], desc: "Fetch groups for a player", auth: true },
      { id: "getGroups", name: "List All Groups", method: "POST", endpoint: "/0/0/gruplar/liste/0/", inputs: ["kategori", "sayfa"], desc: "Discover clans and social groups", auth: true },
      { id: "getGroupDetail", name: "Group Detail", method: "POST", endpoint: "/0/0/gruplar/0/0/", inputs: ["grupID", "groupname"], desc: "Fetch specific group information", auth: true },
      { id: "inviteToGroup", name: "Invite to Group", method: "POST", endpoint: "/0/0/gruplar/davetet/0/", inputs: ["grupID", "users[]"], desc: "Invite members by ID", auth: true },
      { id: "updateGroupMedia", name: "Update Group Media", method: "POST", endpoint: "/0/0/gruplar/medya/0/", inputs: ["groupID", "category", "media"], desc: "Upload group logo or banner", auth: true },
      { id: "leaveGroup", name: "Leave Group", method: "POST", endpoint: "/0/0/gruplar/ayril/0/", inputs: ["grupID"], desc: "Exit a group or clan", auth: true },
      { id: "getGroupMembers", name: "List Group Members", method: "POST", endpoint: "/0/0/gruplar/uyeler/0/", inputs: ["groupname"], desc: "View group member roster", auth: true },
      { id: "kickFromGroup", name: "Kick Member", method: "POST", endpoint: "/0/0/gruplar/gruptanat/0/", inputs: ["grupID", "userID"], desc: "Remove a user from the group", auth: true },
      { id: "updateGroupSettings", name: "Update Settings", method: "POST", endpoint: "/0/0/gruplar/ayarlar/0/", inputs: ["grupID", "baslik", "grupetiket", "aciklama", "discordlink", "website", "alimdurum"], desc: "Modify group profile and status", auth: true },
      { id: "respondToInvitation", name: "Respond to Invitation", method: "POST", endpoint: "/0/0/gruplar-davetcevap/0/0/", inputs: ["grupID", "cevap"], desc: "Accept (1) or Decline (0) invitation", auth: true }
    ]
  },
  business: {
    title: "BusinessService",
    actions: [
      { id: "getUserSchools", name: "Get Schools", method: "POST", endpoint: "/0/0/okullarim/0/0/", inputs: ["oyuncubakid"], desc: "Fetch schools for a player", auth: true },
      { id: "getUserStations", name: "Get Stations", method: "POST", endpoint: "/0/0/istasyonlarim/0/0/", inputs: ["oyuncubakid"], desc: "Fetch locations/stations for a player", auth: true }
    ]
  },
  chat: {
    title: "ChatService",
    actions: [
      { id: "sendMessage", name: "Send Message", method: "POST", endpoint: "/0/0/sohbetgonder/0/0/", inputs: ["userId", "content", "type"], desc: "Send private/group message", auth: true },
      { id: "getChatHistory", name: "Chat History", method: "POST", endpoint: "/0/0/sohbet/0/0/", inputs: ["userId", "page", "limit"], desc: "Fetch messages with a user", auth: true },
      { id: "getFriendsChat", name: "Friends Chat", method: "POST", endpoint: "/0/0/sohbet/arkadaslarim/0/", inputs: ["page", "limit"], desc: "Fetch recent chat list", auth: true },
      { id: "getChatDetail", name: "Chat Detail", method: "POST", endpoint: "/0/0/sohbetdetay/0/0/", inputs: ["chatId", "type"], desc: "Fetch detailed messages", auth: true }
    ]
  },
  blocks: {
    title: "BlockService",
    actions: [
      { id: "getBlockedUsers", name: "List Blocked", method: "POST", endpoint: "/0/0/engel/0/0/", inputs: ["page", "limit"], desc: "Fetch your block list", auth: true },
      { id: "blockUser", name: "Block User", method: "POST", endpoint: "/0/0/engel/ekle/0/", inputs: ["userID"], desc: "Add user to blacklist", auth: true },
      { id: "unblockUser", name: "Unblock User", method: "POST", endpoint: "/0/0/engel/sil/0/", inputs: ["userID"], desc: "Remove user from blacklist", auth: true }
    ]
  },
  management: {
    title: "ManagementService",
    actions: [
      { id: "getManagementContent", name: "Management Panel", method: "POST", endpoint: "/0/0/yonetim-paneli/0/0/", inputs: ["category"], desc: "Fetch admin panel metrics", auth: true },
      { id: "getMeetings", name: "List Meetings", method: "POST", endpoint: "/0/0/yonetim-paneli/0/0/", inputs: [], desc: "Fetch meeting records", auth: true }
    ]
  },
  stories: {
    title: "StoryService",
    actions: [
      { id: "getStories", name: "Get Stories", method: "POST", endpoint: "/0/0/hikaye/0/0/", inputs: ["page", "limit"], desc: "Fetch recent stories", auth: true },
      { id: "getStoryViewers", name: "Story Viewers", method: "POST", endpoint: "/0/0/hikaye/goruntuleyenler/0/", inputs: ["storyId", "page"], desc: "Fetch story viewers", auth: true },
      { id: "getStoryLikers", name: "Story Likers", method: "POST", endpoint: "/0/0/hikaye/begenenler/0/", inputs: ["storyId", "page"], desc: "Fetch story likers", auth: true }
    ]
  },
  locations: {
    title: "LocationService",
    actions: [
      { id: "getCountries", name: "Get Countries", method: "POST", endpoint: "/0/0/ulkeler/0/0/", inputs: ["page", "limit"], desc: "Fetch country list", auth: false },
      { id: "getProvinces", name: "Get Provinces", method: "POST", endpoint: "/0/0/iller/0/0/", inputs: ["countryId", "page", "limit"], desc: "Fetch province list", auth: false }
    ]
  },
  staff: {
    title: "StaffService",
    actions: [
      { id: "getStaff", name: "Official Team", method: "POST", endpoint: "/0/0/ekibimiz/0/0/", inputs: ["page", "category", "limit"], desc: "Fetch team members", auth: false },
      { id: "getApplications", name: "Applications", method: "POST", endpoint: "/0/0/ekibimiz/basvurular/0/", inputs: ["page", "limit"], desc: "Fetch staff join requests", auth: true }
    ]
  },
  payments: {
    title: "PaymentService",
    actions: [
      { id: "getInvoices", name: "Get Invoices", method: "POST", endpoint: "/0/0/odemeler/faturalar/0/", inputs: ["page"], desc: "Fetch your billing list", auth: true }
    ]
  }
};


export default function Dashboard() {
  const router = useRouter();
  const [activeService, setActiveService] = useState<string>('auth');
  const [apiKey, setApiKey] = useState('');
  const [testToken, setTestToken] = useState('');
  const [logs, setLogs] = useState<any[]>([]);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, File | File[]>>({});
  const [actionResults, setActionResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const [portalUser, setPortalUser] = useState<any>(null); // Who is using the portal
  const [testUser, setTestUser] = useState<any>(null);     // Who the API is currently testing

  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Library instance
  const apiRef = useRef<ArmoyuApi | null>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('armoyu_api_key');
    const savedToken = localStorage.getItem('armoyu_test_token');
    const savedPortalUser = localStorage.getItem('armoyu_portal_user');
    const savedTestUser = localStorage.getItem('armoyu_test_user');

    if (savedPortalUser && savedPortalUser !== 'undefined') setPortalUser(JSON.parse(savedPortalUser));
    if (savedKey) {
      setApiKey(savedKey);
    } else if (process.env.NEXT_PUBLIC_ARMOYU_API_KEY) {
      setApiKey(process.env.NEXT_PUBLIC_ARMOYU_API_KEY);
    }

    if (savedToken) {
      setTestToken(savedToken);
    } else if (process.env.NEXT_PUBLIC_ARMOYU_TOKEN) {
      setTestToken(process.env.NEXT_PUBLIC_ARMOYU_TOKEN);
    }
    if (savedTestUser && savedTestUser !== 'undefined') setTestUser(JSON.parse(savedTestUser));
  }, []);

  useEffect(() => {
    // Only persist API Key and Test Token here
    localStorage.setItem('armoyu_api_key', apiKey);
    localStorage.setItem('armoyu_test_token', testToken);

    if (apiKey) {
      // Create a custom logger that bridges library logs to the UI console
      const customLogger = {
        info: (msg: string, ...args: any[]) => addLog(LogType.INFO, msg, args.length ? args : null),
        warn: (msg: string, ...args: any[]) => addLog(LogType.INFO, msg, args.length ? args : null),
        error: (msg: string, ...args: any[]) => addLog(LogType.ERROR, msg, args.length ? args : null),
        debug: (msg: string, ...args: any[]) => console.debug(`[SDK-DEBUG] ${msg}`, ...args)
      };

      apiRef.current = new ArmoyuApi(apiKey, {
        baseUrl: `/api/proxy`,
        token: testToken,
        logger: customLogger
      });
    }
  }, [apiKey, testToken]);

  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const logCounterRef = useRef(0);

  const addLog = (type: LogType, title: string, data: any, meta?: any) => {
    const id = `${Date.now()}-${logCounterRef.current++}`;
    setLogs(prev => [...prev, { id, type, title, data, meta, time: new Date().toLocaleTimeString() }]);
  };

  const handleExecute = async (action: any) => {
    if (!apiRef.current) {
      addLog(LogType.ERROR, "Initialization Error", { message: "System failed to initialize. Try re-entering the API Key." });
      return;
    }

    setLoading(action.id);
    addLog(LogType.REQUEST, `Executing ${action.name}`, { id: action.id, endpoint: action.endpoint, inputs });

    try {
      let result: any;
      const api = apiRef.current;

      if (activeService === 'auth') {
        if (action.id === 'login') {
          const authResult = await api.auth.login(inputs.username, inputs.password);
          result = authResult;

          const newToken = authResult.icerik?.token;
          if (newToken) {
            setTestToken(newToken);
            localStorage.setItem('armoyu_test_token', newToken);
          }

          setTestUser(authResult.icerik?.user);
          if (authResult.icerik?.user) {
            localStorage.setItem('armoyu_test_user', JSON.stringify(authResult.icerik.user));
          }
        } else if (action.id === 'register') {
          result = await api.auth.register({
            username: inputs.username,
            firstName: inputs.firstName,
            lastName: inputs.lastName,
            email: inputs.email,
            password: inputs.password
          });
        } else if (action.id === 'forgotPassword') {
          result = await api.auth.forgotPassword({
            username: inputs.username,
            email: inputs.email,
            birthday: inputs.birthday,
            preference: inputs.preference
          });
        } else if (action.id === 'verifyPasswordReset') {
          result = await api.auth.verifyPasswordReset({
            username: inputs.username,
            email: inputs.email,
            birthday: inputs.birthday,
            code: inputs.code,
            newPassword: inputs.newPassword
          });
        } else if (action.id === 'me') {
          const profile = await api.auth.me();
          result = profile;
          setTestUser(profile.icerik);
          if (profile.icerik) localStorage.setItem('armoyu_test_user', JSON.stringify(profile.icerik));
        }
      } else if (activeService === 'users') {
        if (action.id === 'getUser') {
          result = await api.users.getUserByUsername(inputs.oyuncubakusername);
        } else if (action.id === 'addFriend') {
          result = await api.users.addFriend(Number(inputs.oyuncubakid));
        } else if (action.id === 'removeFriend') {
          result = await api.users.removeFriend(Number(inputs.oyuncubakid));
        } else if (action.id === 'respondToFriendRequest') {
          result = await api.users.respondToFriendRequest(Number(inputs.oyuncubakid), Number(inputs.cevap));
        } else if (action.id === 'updatePrivatePersonalInfo') {
          result = await api.users.updatePrivatePersonalInfo({
            firstName: inputs.firstName,
            lastName: inputs.lastName,
            email: inputs.email,
            birthday: inputs.birthday,
            phoneNumber: inputs.phoneNumber,
            countryID: inputs.countryID ? Number(inputs.countryID) : undefined,
            provinceID: inputs.provinceID ? Number(inputs.provinceID) : undefined,
            passwordControl: inputs.passwordControl || ''
          });
        } else if (action.id === 'getUserSchools') {
          result = await api.users.getUserSchools(inputs.oyuncubakid ? Number(inputs.oyuncubakid) : undefined);
        } else if (action.id === 'getSchoolDetail') {
          result = await api.users.getSchoolDetail(Number(inputs.okulID));
        } else if (action.id === 'getFriendsList') {
          result = await api.users.getFriendsList(inputs.page ? Number(inputs.page) : 1, {
            userId: inputs.oyuncubakid ? Number(inputs.oyuncubakid) : undefined,
            limit: inputs.limit ? Number(inputs.limit) : undefined
          });
        } else if (action.id === 'getInvitationsList') {
          result = await api.users.getInvitationsList(inputs.page ? Number(inputs.page) : 1);
        } else if (action.id === 'refreshInviteCode') {
          result = await api.users.refreshInviteCode();
        } else if (action.id === 'requestEmailVerificationUrl') {
          result = await api.users.requestEmailVerificationUrl(inputs.userID ? Number(inputs.userID) : undefined);
        } else if (action.id === 'pokeFriend') {
          result = await api.users.pokeFriend(Number(inputs.oyuncubakid));
        } else if (action.id === 'setFavoriteTeam') {
          result = await api.users.setFavoriteTeam(Number(inputs.favoritakimID));
        } else if (action.id === 'getUserMedia') {
          result = await api.users.getUserMedia(inputs.page ? Number(inputs.page) : 1, {
            userId: inputs.oyuncubakid ? Number(inputs.oyuncubakid) : undefined,
            limit: inputs.limit ? Number(inputs.limit) : 50,
            category: inputs.kategori || 'all'
          });
        } else if (action.id === 'getSocialProfile') {
          result = await api.users.getSocialProfile(inputs.oyuncubakid ? Number(inputs.oyuncubakid) : undefined);
        } else if (action.id === 'getNotifications') {
          result = await api.users.getNotifications();
        } else if (action.id === 'getNotificationsHistory') {
          result = await api.users.getNotificationsHistory(
            inputs.page ? Number(inputs.page) : 1,
            inputs.limit ? Number(inputs.limit) : 20,
            inputs.kategori,
            inputs.kategoridetay
          );
        } else if (action.id === 'updateAvatar') {
          const file = files.resim;
          if (!file) throw new Error("Please select an image file first");
          result = await api.users.updateAvatar(file);
        } else if (action.id === 'resetAvatar') {
          result = await api.users.resetAvatar();
        } else if (action.id === 'resetBanner') {
          result = await api.users.resetBanner();
        } else if (action.id === 'updateBackground') {
          const file = files.resim;
          if (!file) throw new Error("Please select an image file first");
          result = await api.users.updateBackground(file);
        } else if (action.id === 'rotateMedia') {
          result = await api.users.rotateMedia(Number(inputs.fotografID), Number(inputs.derece));
        } else if (action.id === 'deleteMedia') {
          result = await api.users.deleteMedia(Number(inputs.medyaID));
        } else if (action.id === 'uploadMedia') {
          const mediaFiles = files['media[]'];
          if (!mediaFiles) throw new Error("Please select at least one media file");
          result = await api.users.uploadMedia(Array.isArray(mediaFiles) ? mediaFiles : [mediaFiles], inputs.category);
        } else if (action.id === 'getNotificationSettings') {
          result = await api.users.getNotificationSettings();
        } else if (action.id === 'updateNotificationSettings') {
          // Parse "key=value,key2=value2" or just "key=value"
          const settings: Record<string, number> = {};
          const pairs = inputs.notificationSettings.split(',').map(p => p.trim());
          pairs.forEach(pair => {
            const [key, value] = pair.split('=');
            if (key && value !== undefined) settings[key] = Number(value);
          });
          result = await api.users.updateNotificationSettings(settings);
        } else if (action.id === 'getXpRankings') {
          result = await api.users.getXpRankings(inputs.sayfa ? Number(inputs.sayfa) : 1);
        } else if (action.id === 'getPopRankings') {
          result = await api.users.getPopRankings(inputs.sayfa ? Number(inputs.sayfa) : 1);
        }
      } else if (activeService === 'rules') {
        if (action.id === 'getRules') {
          result = await api.rules.getRules();
        } else if (action.id === 'createRule') {
          result = await api.rules.createRule(inputs.text, inputs.penalty);
        }
      } else if (activeService === 'blog') {
        if (action.id === 'getNews') {
          result = await api.blog.getNewsLegacy(
            inputs.sayfa ? Number(inputs.sayfa) : 1,
            inputs.limit ? Number(inputs.limit) : undefined
          );
        }
      } else if (activeService === 'social') {
        if (action.id === 'getPosts') {
          result = await api.social.getPosts(
            inputs.sayfa ? Number(inputs.sayfa) : 1,
            {
              postId: inputs.postID ? Number(inputs.postID) : undefined,
              category: inputs.category,
              categoryDetail: inputs.categorydetail
            }
          );
        } else if (action.id === 'createPost') {
          const mediaIds = inputs['paylasimfoto[]'] ? inputs['paylasimfoto[]'].split(',').map(id => Number(id.trim())).filter(id => !isNaN(id)) : undefined;
          result = await api.social.createPost(inputs.sosyalicerik, mediaIds);
        } else if (action.id === 'deletePost') {
          result = await api.social.deletePost(inputs.postID);
        } else if (action.id === 'getLikers') {
          result = await api.social.getLikers({
            postId: inputs.postID,
            commentId: inputs.yorumID
          });
        } else if (action.id === 'removeLike') {
          result = await api.social.removeLike({
            postId: inputs.postID,
            commentId: inputs.yorumID,
            category: inputs.kategori
          });
        } else if (action.id === 'addLike') {
          result = await api.social.addLike({
            postId: inputs.postID,
            category: inputs.kategori
          });
        } else if (action.id === 'getComments') {
          result = await api.social.getComments(inputs.postID);
        } else if (action.id === 'createComment') {
          result = await api.social.createComment({
            postId: inputs.postID,
            content: inputs.yorumicerik,
            category: inputs.kategori,
            replyTo: inputs.kimeyanit
          });
        } else if (action.id === 'deleteComment') {
          result = await api.social.deleteComment(inputs.yorumID);
        } else if (action.id === 'getSocialNotifications') {
          result = await api.social.getSocialNotifications({
            postId: inputs.postID,
            category: inputs.bildirikategori
          });
        }
      } else if (activeService === 'search') {
        if (action.id === 'globalSearch') {
          result = await api.search.globalSearch(inputs.query);
        }
      } else if (activeService === 'events') {
        if (action.id === 'getEvents') {
          result = await api.events.getEvents(inputs.sayfa ? Number(inputs.sayfa) : 1, {
            gameId: inputs.oyunID ? Number(inputs.oyunID) : undefined,
            status: inputs.etkinlikdurum,
            limit: inputs.limit ? Number(inputs.limit) : undefined
          });
        } else if (action.id === 'getEventDetail') {
          result = await api.events.getEventDetail({
            eventId: inputs.eventID ? Number(inputs.eventID) : undefined
          });
        } else if (action.id === 'joinEvent') {
          result = await api.events.joinEvent(Number(inputs.eventId));
        } else if (action.id === 'respondToEvent') {
          result = await api.events.respondToEvent(Number(inputs.eventId), inputs.cevap as any);
        } else if (action.id === 'getEventTeams') {
          result = await api.events.getEventTeams(Number(inputs.eventId));
        }
      } else if (activeService === 'siteInfo') {
        if (action.id === 'getAboutContent') {
          result = await api.siteInfo.getAboutContent(inputs.category || 'home');
        } else if (action.id === 'getPrivacyPolicy') {
          result = await api.siteInfo.getPrivacyPolicy(inputs.category || 'home');
        } else if (action.id === 'getTermsOfService') {
          result = await api.siteInfo.getTermsOfService(inputs.category || 'home');
        } else if (action.id === 'getStatistics') {
          result = await api.siteInfo.getStatistics(inputs.category || 'aktifoyuncu');
        } else if (action.id === 'getSessionLogs') {
          result = await api.siteInfo.getSessionLogs();
        } else if (action.id === 'getSiteMessages') {
          result = await api.siteInfo.getSiteMessages(inputs.oyuncubakid ? Number(inputs.oyuncubakid) : undefined);
        } else if (action.id === 'searchTags') {
          result = await api.siteInfo.searchTags(inputs.page ? Number(inputs.page) : 1, {
            tag: inputs.etiket,
            limit: inputs.limit ? Number(inputs.limit) : undefined
          });
        } else if (action.id === 'getSiteMessageDetail') {
          result = await api.siteInfo.getSiteMessageDetail(inputs.oyuncubakid ? Number(inputs.oyuncubakid) : undefined);
        }
      } else if (activeService === 'groups') {
        if (action.id === 'getUserGroups') {
          result = await api.groups.getUserGroups(inputs.oyuncubakid ? Number(inputs.oyuncubakid) : undefined);
        } else if (action.id === 'getGroups') {
          result = await api.groups.getGroups(inputs.sayfa ? Number(inputs.sayfa) : 1, {
            category: inputs.kategori
          });
        } else if (action.id === 'getGroupDetail') {
          result = await api.groups.getGroupDetail({
            groupId: inputs.grupID ? Number(inputs.grupID) : undefined,
            groupName: inputs.groupname
          });
        } else if (action.id === 'inviteToGroup') {
          const userIds = inputs['users[]'].split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
          result = await api.groups.inviteToGroup(Number(inputs.grupID), userIds);
        } else if (action.id === 'updateGroupMedia') {
          const file = files.media;
          if (!file) throw new Error("Please select a media file first");
          result = await api.groups.updateGroupMedia(Number(inputs.groupID), inputs.category, Array.isArray(file) ? file[0] : file);
        } else if (action.id === 'leaveGroup') {
          result = await api.groups.leaveGroup(Number(inputs.grupID));
        } else if (action.id === 'getGroupMembers') {
          result = await api.groups.getGroupMembers(inputs.groupname);
        } else if (action.id === 'kickFromGroup') {
          result = await api.groups.kickFromGroup(Number(inputs.grupID), Number(inputs.userID));
        } else if (action.id === 'updateGroupSettings') {
          result = await api.groups.updateGroupSettings({
            groupId: Number(inputs.grupID),
            title: inputs.baslik,
            tag: inputs.grupetiket,
            description: inputs.aciklama,
            discord: inputs.discordlink,
            website: inputs.website,
            recruitmentStatus: inputs.alimdurum
          });
        } else if (action.id === 'respondToInvitation') {
          result = await api.groups.respondToInvitation(Number(inputs.grupID), Number(inputs.cevap));
        }
      } else if (activeService === 'business') {
        if (action.id === 'getUserSchools') {
          result = await api.business.getUserSchools(
            inputs.sayfa ? Number(inputs.sayfa) : 1,
            inputs.limit ? Number(inputs.limit) : undefined,
            inputs.oyuncubakid ? Number(inputs.oyuncubakid) : undefined
          );
        } else if (action.id === 'getUserStations') {
          result = await api.business.getUserStations(
            inputs.sayfa ? Number(inputs.sayfa) : 1,
            inputs.limit ? Number(inputs.limit) : undefined,
            inputs.oyuncubakid ? Number(inputs.oyuncubakid) : undefined
          );
        }
      } else if (activeService === 'chat') {
        if (action.id === 'sendMessage') {
          result = await api.chat.sendMessage({
            userId: Number(inputs.userId),
            content: inputs.content,
            type: inputs.type
          });
        } else if (action.id === 'getChatHistory') {
          result = await api.chat.getChatHistory(
            inputs.page ? Number(inputs.page) : 1,
            {
              userId: Number(inputs.userId),
              limit: inputs.limit ? Number(inputs.limit) : undefined
            }
          );
        } else if (action.id === 'getFriendsChat') {
          result = await api.chat.getFriendsChat(
            inputs.page ? Number(inputs.page) : 1,
            {
              limit: inputs.limit ? Number(inputs.limit) : undefined
            }
          );
        } else if (action.id === 'getChatDetail') {
          result = await api.chat.getChatDetail({
            chatId: Number(inputs.chatId),
            type: inputs.type
          });
        }
      } else if (activeService === 'blocks') {
        if (action.id === 'getBlockedUsers') {
          result = await api.blocks.getBlockedUsers(
            inputs.page ? Number(inputs.page) : 1,
            inputs.limit ? Number(inputs.limit) : undefined
          );
        } else if (action.id === 'blockUser') {
          result = await api.blocks.blockUser(inputs.userID);
        } else if (action.id === 'unblockUser') {
          result = await api.blocks.unblockUser(inputs.userID);
        }
      } else if (activeService === 'management') {
        if (action.id === 'getManagementContent') {
          result = await api.management.getManagementContent(inputs.category || 'home');
        } else if (action.id === 'getMeetings') {
          result = await api.management.getMeetings();
        }
      } else if (activeService === 'stories') {
        if (action.id === 'getStories') {
          result = await api.stories.getStories(
            inputs.page ? Number(inputs.page) : 1,
            inputs.limit ? Number(inputs.limit) : undefined
          );
        } else if (action.id === 'getStoryViewers') {
          result = await api.stories.getStoryViewers(
            inputs.page ? Number(inputs.page) : 1,
            inputs.storyId
          );
        } else if (action.id === 'getStoryLikers') {
          result = await api.stories.getStoryLikers(
            inputs.page ? Number(inputs.page) : 1,
            inputs.storyId
          );
        }
      } else if (activeService === 'locations') {
        if (action.id === 'getCountries') {
          result = await api.locations.getCountries(
            inputs.page ? Number(inputs.page) : 1,
            inputs.limit ? Number(inputs.limit) : undefined
          );
        } else if (action.id === 'getProvinces') {
          result = await api.locations.getProvinces(
            inputs.page ? Number(inputs.page) : 1,
            inputs.countryId,
            inputs.limit ? Number(inputs.limit) : undefined
          );
        }
      } else if (activeService === 'staff') {
        if (action.id === 'getStaff') {
          result = await api.staff.getStaff(
            inputs.page ? Number(inputs.page) : 1,
            inputs.category,
            inputs.limit ? Number(inputs.limit) : undefined
          );
        } else if (action.id === 'getApplications') {
          result = await api.staff.getApplications(
            inputs.page ? Number(inputs.page) : 1,
            inputs.limit ? Number(inputs.limit) : undefined
          );
        }
      } else if (activeService === 'payments') {
        if (action.id === 'getInvoices') {
          result = await api.payments.getInvoices(
            inputs.page ? Number(inputs.page) : 1
          );
        }
      } else if (activeService === 'search') {
        if (action.id === 'getScoreList') {
          result = await api.projects.getScoreList(inputs.sayfa ? Number(inputs.sayfa) : 1);
        } else if (action.id === 'saveScore') {
          result = await api.projects.saveScore(inputs.projeID, inputs.skor);
        }
      } else if (activeService === 'projects') {
        if (action.id === 'getScoreList') {
          result = await api.projects.getScoreList(inputs.sayfa ? Number(inputs.sayfa) : 1);
        } else if (action.id === 'saveScore') {
          result = await api.projects.saveScore(inputs.projeID, inputs.skor);
        }
      } else if (activeService === 'teams') {
        if (action.id === 'getTeams') {
          result = await api.teams.getTeams(inputs.sayfa ? Number(inputs.sayfa) : 1, inputs.favoritakimID);
        }
      } else if (activeService === 'stations') {
        if (action.id === 'getStations') {
          result = await api.stations.getStations(inputs.sayfa ? Number(inputs.sayfa) : 1, inputs.kategori);
        } else if (action.id === 'getStationEquipment') {
          result = await api.stations.getStationEquipment(inputs.istasyonID);
        }
      }

      const rawResponse = apiRef.current?.last || result;

      // Store both raw and mapped result per action
      setActionResults(prev => ({
        ...prev,
        [action.id + activeService]: {
          raw: rawResponse,
          mapped: result,
          view: 'mapped' // Default to class view to show the result of "giydirme"
        }
      }));

      addLog(LogType.RESPONSE, `Success: ${action.name}`, null, {
        status: 1,
        aciklama: rawResponse?.aciklama || "lem Baarl",
        endpoint: action.endpoint
      });
    } catch (err: any) {
      const rawError = apiRef.current?.last || { message: err.message, data: err.data };
      addLog(LogType.ERROR, `Error: ${action.name}`, rawError, {
        status: 0,
        aciklama: err.message,
        endpoint: action.endpoint
      });
    } finally {
      setLoading(null);
    }
  };

  const handleTestLogout = async () => {
    if (apiRef.current) {
      await apiRef.current.auth.logout();
    }
    // Clear only Test session
    localStorage.removeItem('armoyu_test_token');
    localStorage.removeItem('armoyu_test_user');

    setTestUser(null);
    setTestToken('');

    addLog(LogType.INFO, 'Test Session Ended', { message: 'The test user session has been cleared. You are still in the dashboard.' });
  };

  const handlePortalLogout = async () => {
    // Clear Portal session
    document.cookie = "armoyu_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    localStorage.removeItem('armoyu_token');
    localStorage.removeItem('armoyu_portal_user');

    // Clear everything else too
    localStorage.removeItem('armoyu_test_token');
    localStorage.removeItem('armoyu_test_user');

    setPortalUser(null);
    setTestUser(null);
    setTestToken('');

    // Force full reload to / to ensure all state is cleared and middleware is triggered
    window.location.href = '/';
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar
        activeService={activeService}
        setActiveService={setActiveService}
        apiKey={apiKey}
        setApiKey={setApiKey}
        token={testToken}
        setToken={setTestToken}
        user={testUser}
        onLogout={handleTestLogout}
        config={CONFIG}
        serviceIcons={SERVICE_ICONS}
      />

      <main className="flex-1 flex flex-col overflow-hidden bg-[var(--background)]">
        <Navbar
          user={portalUser}
          apiKey={apiKey}
          onLogout={handlePortalLogout}
          onNavigateAuth={() => setActiveService('auth')}
          activeServiceTitle={(CONFIG as any)[activeService].title}
          icon={SERVICE_ICONS[activeService] || Zap}
        />

        <div className="flex-1 overflow-hidden flex">
          <section className="flex-1 overflow-y-auto p-8 space-y-6">
            {(CONFIG as any)[activeService].actions.map((action: any) => (
              <div key={action.id} className="glass rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className={cn(
                        "text-[10px] font-black px-2 py-0.5 rounded border",
                        action.method === 'POST' ? 'text-amber-400 border-amber-400/20 bg-amber-400/5' : 'text-cyan-400 border-cyan-400/20 bg-cyan-400/5'
                      )}>
                        {action.method}
                      </span>
                      <h3 className="text-lg font-bold text-gray-200">{action.name}</h3>
                      {action.auth && (
                        testToken ? (
                          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-500 tracking-widest ml-1">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            AUTHORIZED
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-[9px] font-black text-red-500 tracking-widest ml-1">
                            <Lock className="w-2.5 h-2.5" />
                            AUTH REQUIRED
                          </div>
                        )
                      )}
                    </div>
                    <p className="text-sm text-gray-500 max-w-xl">{action.desc}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="text-[10px] font-mono text-gray-600 bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
                      {action.endpoint}
                    </div>
                    <div className="text-[9px] font-mono text-cyan-500/50 group-hover:text-cyan-500 transition-colors bg-white/5 px-2 py-1 rounded">
                      https://api.armoyu.com/botlar/{apiKey || 'YOUR_KEY'}{action.endpoint}
                    </div>
                  </div>
                </div>

                {action.inputs.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {action.inputs.map((input: string) => (
                      <div key={input} className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">{input}</label>
                        {input === 'resim' || input === 'media[]' || input === 'media' ? (
                          <input
                            type="file"
                            multiple={input === 'media[]'}
                            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-cyan-500/30 outline-none transition-all text-white"
                            onChange={(e) => {
                              if (input === 'media[]') {
                                const filesArray = Array.from(e.target.files || []);
                                if (filesArray.length > 0) setFiles(prev => ({ ...prev, [input]: filesArray }));
                              } else {
                                const file = e.target.files?.[0];
                                if (file) setFiles(prev => ({ ...prev, [input]: file }));
                              }
                            }}
                          />
                        ) : (
                          <input
                            type={input === 'password' ? 'password' : 'text'}
                            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-cyan-500/30 outline-none transition-all text-white"
                            placeholder={`Enter ${input}...`}
                            value={inputs[input] || ''}
                            onChange={(e) => setInputs(prev => ({ ...prev, [input]: e.target.value }))}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => handleExecute(action)}
                  disabled={!!loading || (action.auth && !testToken)}
                  className={cn(
                    "w-full py-4 rounded-xl text-sm font-bold tracking-widest transition-all flex items-center justify-center gap-3 border",
                    loading === action.id
                      ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                      : (action.auth && !testToken)
                        ? "bg-red-500/5 border-red-500/10 text-red-500/50 cursor-not-allowed"
                        : "bg-white/5 hover:bg-cyan-500/10 border-white/5 hover:border-cyan-500/30 text-gray-300 hover:text-cyan-400"
                  )}
                >
                  {loading === action.id ? <RefreshCw className="w-5 h-5 animate-spin" /> : (action.auth && !testToken) ? <Lock className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                  {loading === action.id
                    ? 'EXECUTING...'
                    : (action.auth && !testToken)
                      ? 'LOCKED - LOGIN REQUIRED'
                      : `EXECUTE ${action.name.toUpperCase()}`}
                </button>

                {actionResults[action.id + activeService] && (
                  <div className="mt-6 p-4 rounded-xl bg-black/40 border border-white/5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Result Explorer</span>
                        <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/5">
                          <button
                            onClick={() => setActionResults(prev => ({
                              ...prev,
                              [action.id + activeService]: { ...prev[action.id + activeService], view: 'raw' }
                            }))}
                            className={cn(
                              "px-2 py-1 text-[9px] font-bold rounded-md transition-all",
                              actionResults[action.id + activeService].view === 'raw' ? "bg-cyan-500 text-black" : "text-gray-500 hover:text-gray-300"
                            )}
                          >
                            RAW JSON
                          </button>
                          <button
                            onClick={() => setActionResults(prev => ({
                              ...prev,
                              [action.id + activeService]: { ...prev[action.id + activeService], view: 'mapped' }
                            }))}
                            className={cn(
                              "px-2 py-1 text-[9px] font-bold rounded-md transition-all",
                              actionResults[action.id + activeService].view === 'mapped' ? "bg-cyan-500 text-black" : "text-gray-500 hover:text-gray-300"
                            )}
                          >
                            MAPPED CLASS
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => setActionResults(prev => {
                          const next = { ...prev };
                          delete next[action.id + activeService];
                          return next;
                        })}
                        className="text-[9px] font-bold text-red-500/50 hover:text-red-500 transition-colors"
                      >
                        CLEAR
                      </button>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                      <ResultTree
                        data={
                          actionResults[action.id + activeService].view === 'mapped'
                            ? JSON.parse(JSON.stringify(actionResults[action.id + activeService].mapped))
                            : actionResults[action.id + activeService].raw
                        }
                        initialOpen={true}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </section>

          <section className="w-[500px] border-l glass flex flex-col">
            <div className="h-14 border-b flex items-center justify-between px-6 bg-black/20">
              <div className="flex items-center gap-2.5">
                <Terminal className="w-4 h-4 text-cyan-500" />
                <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Live Console Output</span>
              </div>
              <button
                onClick={() => setLogs([])}
                className="p-1.5 rounded-lg hover:bg-white/5 text-gray-600 hover:text-red-400 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 font-mono text-[11px] space-y-4">
              {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20 pointer-events-none">
                  <Terminal className="w-12 h-12 mb-4" />
                  <p className="text-center text-sm font-bold tracking-tight">System Ready.<br />Await command execution...</p>
                </div>
              ) : (
                logs.map(log => (
                  <div key={log.id} className={cn(
                    "p-4 rounded-xl border leading-relaxed",
                    log.type === LogType.REQUEST ? "bg-white/5 border-white/10" :
                      log.type === LogType.RESPONSE ? "bg-emerald-500/5 border-emerald-500/20" :
                        log.type === LogType.INFO ? "bg-blue-500/5 border-blue-500/20" : "bg-red-500/5 border-red-500/20"
                  )}>
                    <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2">
                        {log.type === LogType.REQUEST ? <Globe className="w-3.5 h-3.5 text-gray-400" /> :
                          log.type === LogType.RESPONSE ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> :
                            log.type === LogType.INFO ? <Zap className="w-3.5 h-3.5 text-blue-500" /> :
                              <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
                        <span className={cn(
                          "font-black uppercase tracking-tighter",
                          log.type === LogType.REQUEST ? "text-gray-300" :
                            log.type === LogType.RESPONSE ? "text-emerald-500" :
                              log.type === LogType.INFO ? "text-blue-500" : "text-red-500"
                        )}>
                          {log.type}
                        </span>
                        <span className="text-gray-600 opacity-50"></span>
                        <span className="text-gray-400 font-bold">{log.title}</span>
                      </div>
                      <span className="text-[9px] text-gray-600 font-bold">{log.time}</span>
                    </div>

                    {log.data && (
                      <pre className="overflow-x-auto text-gray-300 scrollbar-hide mb-3 max-h-[150px]">
                        {JSON.stringify(log.data, null, 2)}
                      </pre>
                    )}

                    {log.meta && (
                      <div className="pt-2 border-t border-white/5 flex flex-wrap gap-2">
                        {log.meta.aciklama && (
                          <div className={cn(
                            "w-full text-[10px] font-bold py-1 mb-1",
                            log.type === 'res' ? 'text-emerald-400/80' : 'text-red-400/80'
                          )}>
                            {log.meta.aciklama}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {log.meta.status !== undefined && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/40 text-gray-500 uppercase tracking-widest border border-white/5">
                              Status: {log.meta.status}
                            </span>
                          )}
                          {log.meta.endpoint && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/40 text-gray-500 border border-white/5">
                              {log.meta.endpoint}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={consoleEndRef} />
            </div>
          </section>
        </div>
        <Footer />
      </main>
    </div>
  );
}
