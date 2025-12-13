import { Sparkles, Palette, Code, TrendingUp, MapPin, Zap, Users } from 'lucide-react';

export const STATUS_COLORS = {
  active: "bg-green-500",
  idle: "bg-yellow-500",
  offline: "bg-gray-400",
  dnd: "bg-red-500",
};

export const SWAP_STATUS_COLORS = {
  "in-progress": "bg-blue-100 text-blue-800",
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  request: "bg-orange-100 text-orange-800",
};

export const ATTACHMENT_OPTIONS = [
  { type: "image", label: "Photo & Video", icon: "Image" },
  { type: "document", label: "Document", icon: "FileText" },
  { type: "audio", label: "Audio", icon: "Mic" },
  { type: "camera", label: "Use Camera", icon: "Camera" },
  { type: "location", label: "Location", icon: "MapPin" },
];

export const CATEGORIES = [
  { id: "for-you", label: "For You", count: 42, icon: Sparkles },
  { id: "design", label: "Design", count: 28, icon: Palette },
  { id: "development", label: "Development", count: 56, icon: Code },
  { id: "trending", label: "Trending", count: 18, icon: TrendingUp },
  { id: "nearby", label: "Nearby", count: 12, icon: MapPin },
  { id: "new", label: "New Today", count: 8, icon: Zap },
];

export const TRENDING_SKILLS = [
  { name: "React + TypeScript", trend: "up", demand: "high", learners: 1240 },
  { name: "UI/UX Design", trend: "up", demand: "high", learners: 980 },
  { name: "Python Data Science", trend: "steady", demand: "medium", learners: 756 },
  { name: "DevOps & CI/CD", trend: "up", demand: "high", learners: 642 },
  { name: "Next.js 14", trend: "up", demand: "high", learners: 532 },
];
