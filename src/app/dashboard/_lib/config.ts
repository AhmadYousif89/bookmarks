import { AvailableIconNames } from "@/lib/icon.generated";

export type ItemLabel =
  | "Visit"
  | "Copy URL"
  | "Pin"
  | "Unpin"
  | "Edit"
  | "Archive"
  | "Unarchive"
  | "Delete Permanently";

export type Item = {
  label: ItemLabel;
  icon: AvailableIconNames;
};

export const ITEMS: Item[] = [
  { label: "Visit", icon: "visit" },
  { label: "Copy URL", icon: "copy" },
  { label: "Pin", icon: "pin" },
  { label: "Unpin", icon: "unpin" },
  { label: "Edit", icon: "edit" },
  { label: "Archive", icon: "archive" },
  { label: "Unarchive", icon: "unarchive" },
  { label: "Delete Permanently", icon: "delete" },
] as const;

export type ItemLabelKeys = (typeof ITEMS)[number]["label"];

export const TOAST_LABELS = [
  "Bookmark added successfully.",
  "Changes saved.",
  "Link copied to clipboard.",
  "Bookmark pinned to top.",
  "Bookmark archived.",
  "Bookmark restored.",
  "Bookmark deleted.",
] as const;
export type ToastType = "success" | "error" | "info" | "warning";
export type ToastLabel = (typeof TOAST_LABELS)[number] | (string & {}); // allow custom strings
export type ToastAction = { label: ToastLabel; icon?: AvailableIconNames; type?: ToastType };

export const TOAST_ACTIONS: ToastAction[] = [
  { label: "Bookmark added successfully.", icon: "check", type: "success" },
  { label: "Changes saved.", icon: "check", type: "success" },
  { label: "Link copied to clipboard.", icon: "copy", type: "info" },
  { label: "Bookmark pinned to top.", icon: "pin", type: "info" },
  { label: "Bookmark archived.", icon: "archive", type: "info" },
  { label: "Bookmark restored.", icon: "unarchive", type: "info" },
  { label: "Bookmark deleted.", icon: "delete", type: "warning" },
] as const;

type SortByOrder = "asc" | "desc";
type SortByKey = "date" | "last-visit" | "most-visited";
export type SortFormat = `${SortByKey}:${SortByOrder}`;

type SortBy = (typeof sortBy)[number];
export const sortBy = ["Recently added", "Recently visited", "Most visited"] as const;

export const sortMap: { [key in SortBy]: SortFormat } = {
  "Recently added": "date:desc",
  "Recently visited": "last-visit:desc",
  "Most visited": "most-visited:desc",
} as const;

export const PREDEFINED_TAGS = [
  "AI",
  "Automation",
  "Backend",
  "Blockchain",
  "CSS",
  "Cloud",
  "Database",
  "DevOps",
  "Design",
  "Docker",
  "E-commerce",
  "Education",
  "Frontend",
  "Framework",
  "Git",
  "GraphQL",
  "HTML",
  "Hosting",
  "Inspiration",
  "IoT",
  "Java",
  "JavaScript",
  "Kubernetes",
  "Learning",
  "Machine Learning",
  "Mobile",
  "News",
  "Node.js",
  "Open Source",
  "Productivity",
  "Python",
  "React",
  "REST",
  "Security",
  "Serverless",
  "SQL",
  "Testing",
  "Tools",
  "Tutorial",
  "UI/UX",
  "Version Control",
  "Web",
  "XML",
  "YAML",
  "Zero Trust",
] as const;
