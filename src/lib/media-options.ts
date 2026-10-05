import type { SelectOption } from "@/components/forms/types";

export type RenderEngine = "storyboard" | "video";

export class MediaOptions {
  static readonly aspects: readonly SelectOption[] = [
    { value: "9:16", label: "9:16 (Short-form)" },
    { value: "16:9", label: "16:9 (Landscape)" },
  ];

  static readonly engines: readonly SelectOption[] = [
    { value: "storyboard", label: "Storyboard (stills)" },
    { value: "video", label: "Video (AI motion)" },
  ];

  static readonly languages: readonly SelectOption[] = [
    { value: "", label: "Auto" },
    { value: "en", label: "English" },
    { value: "hi", label: "Hindi" },
    { value: "pa", label: "Punjabi" },
    { value: "it", label: "Italian" },
    { value: "de", label: "German" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "pt", label: "Portuguese" },
  ];
}
