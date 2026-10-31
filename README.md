# Kinoforge UI

[![Website](https://img.shields.io/badge/website-kinoforge.dev-7c3aed)](https://kinoforge.dev)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Last commit](https://img.shields.io/github/last-commit/videogpt-dev/videogpt-ui)](https://github.com/videogpt-dev/videogpt-ui/commits/main)
![React](https://img.shields.io/badge/react-19-61DAFB?logo=react&logoColor=black)

Customizable React design system for Kinoforge products.

Built with React 19, shadcn/ui, Radix UI, Lucide, Tailwind CSS 4.3, and Vite+.
Includes shadcn primitives, workflow forms, feedback, and Kinoforge-specific generation surfaces.
Studio components accept Kinoforge `GET /v1/segments` response shapes directly.

Current custom components:

- Controlled clips creation layout and clip workflow fields
- Clip studio (review moments, approve, render), job progress, library, source editor, and
  per-clip editor layouts
- Story and series creation, workspace, and library layouts
- Controlled clip cards and timeline marker lists
- Segment cards and picker
- Studio shell, segment workspace, and media canvas
- Option selects and shared media options (aspects, engines, languages)
- Status messages and expandable action toasts
- Flow canvas: a node editor (React Flow) for flows an engine describes, with its node list,
  settings panel, searchable model picker, run outputs, scene blocks and series episodes

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

`ClipCreateLayout` contains presentation only and reads every field value from the `draft` prop.
Consumer owns form transport, routing, validation, jobs, pricing, and prompt resolution. Override
copy and option catalogs (`ClipCatalog`, `MediaOptions`) through props, style through `classNames`,
replace steps or summary through `slots`, and inject router form through `renderForm`.
No prompt bodies enter UI package.

Clips layouts use controlled props and React slots. Cloud dashboard injects authenticated media,
timeline/player implementations, cost panels, publishing, router navigation, and live job streams.
Self-host runtime can supply different adapters without forking layout code.

## Flow canvas

`FlowEditor` draws a flow from an engine's node list (Kinoforge's `GET /v1/flows/nodes` shape)
and leaves every request to the host:

```tsx
<FlowEditor
  title={flow.title}
  graph={flow.graph}
  specs={nodes}
  models={models}
  styles={styles}
  accounts={accounts}
  uploads={uploads}
  run={liveRun}
  saving={saving}
  running={starting}
  saveAnswer={lastSave}
  runAnswer={lastStart}
  onSave={(draft) => save(draft)}
  onRun={(draft, part) => start(draft, part)}
  onCancel={(runId) => cancel(runId)}
  upload={(kind, file) => uploadFile(kind, file)}
/>
```

Its link and setting checks help people while they edit; the host's server must check every
flow again on save and run.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Security reports: [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE).
