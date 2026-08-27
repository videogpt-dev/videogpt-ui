# VideoGPT UI

Customizable React design system for VideoGPT products.

Built with React 19, shadcn/ui, Radix UI, Lucide, Tailwind CSS 4.3, and Vite+.
Includes shadcn primitives, workflow forms, feedback, and VideoGPT-specific generation surfaces.
Studio components accept Kinoforge `GET /v1/segments` response shapes directly.

Current custom components:

- Controlled clips creation layout and clip workflow fields
- Clips job progress, library, source editor, and per-clip editor layouts
- Controlled clip cards and timeline marker lists
- Segment cards and picker
- Studio shell, segment workspace, and media canvas
- Job progress
- Searchable autocomplete with custom values
- Status messages, spinner, and expandable action toasts

Designed as a public base layer. Products can compose these components and add private extensions
without coupling private logic to this package.

```bash
vp run @videogpt/ui#build
vp run @videogpt/ui#pack
vp run @videogpt/ui#test
```

Add more shadcn primitives from repository root:

```bash
vp dlx shadcn@latest add <component> --cwd packages/videogpt-ui --yes
```

Consumers import library CSS once:

```tsx
import "@videogpt/ui/styles.css";
```

Theme `--vui-*` CSS variables can be overridden at application or component scope.

`ClipCreateLayout` contains presentation only. Consumer owns form transport, routing, validation,
jobs, pricing, and prompt resolution. Override copy and option catalogs through props, style through
`classNames`, replace steps or summary through `slots`, and inject router form through `renderForm`.
No prompt bodies enter UI package.

Clips layouts use controlled props and React slots. Cloud dashboard injects authenticated media,
timeline/player implementations, cost panels, publishing, router navigation, and live job streams.
Self-host runtime can supply different adapters without forking layout code.
