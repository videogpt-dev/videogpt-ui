import {
  AudioLines,
  Captions,
  ChartNoAxesColumnIncreasing,
  Clapperboard,
  ContactRound,
  Film,
  GitBranch,
  LayoutList,
  ListVideo,
  NotebookTabs,
  PanelsTopLeft,
  PenLine,
  PlaySquare,
  ScanSearch,
  Scissors,
  Users,
  WandSparkles,
} from "lucide-react";

import type { IconRegistry, UiIcon } from "./types";

export const defaultIcons: IconRegistry = {
  "audio-lines": AudioLines,
  captions: Captions,
  "chart-no-axes-column-increasing": ChartNoAxesColumnIncreasing,
  clapperboard: Clapperboard,
  "contact-round": ContactRound,
  film: Film,
  "git-branch": GitBranch,
  "layout-list": LayoutList,
  "list-video": ListVideo,
  "notebook-tabs": NotebookTabs,
  "panels-top-left": PanelsTopLeft,
  "pen-line": PenLine,
  "play-square": PlaySquare,
  "scan-search": ScanSearch,
  scissors: Scissors,
  users: Users,
  "wand-sparkles": WandSparkles,
};

export function resolveIcon(name: string, icons: IconRegistry = defaultIcons): UiIcon {
  return icons[name] ?? PanelsTopLeft;
}
