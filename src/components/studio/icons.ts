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
import { createElement, type SVGProps } from "react";

import type { IconRegistry, UiIcon } from "./types";

export class Icons {
  static readonly defaults: IconRegistry = {
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

  static resolve(name: string, icons: IconRegistry = Icons.defaults): UiIcon {
    return icons[name] ?? PanelsTopLeft;
  }

  static render(name: string, props: SVGProps<SVGSVGElement>, icons?: IconRegistry) {
    return createElement(Icons.resolve(name, icons), { "aria-hidden": true, ...props });
  }
}
