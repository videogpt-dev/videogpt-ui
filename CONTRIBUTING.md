# Contributing

Thanks for taking the time. This repo is `@videogpt/ui`, the open React design system behind
[videogpt.dev](https://videogpt.dev) and its self-host edition. Bug reports, fixes, new
components and improvements to the flow canvas are all welcome.

## Before you start

- For a bug, open an issue with steps to reproduce, what you expected, and what happened.
- For a new component or a larger change, open an issue first so we can agree on the shape
  before you write code.
- Security issues do **not** go in the tracker. See [SECURITY.md](SECURITY.md).

## Working on it

The package is developed inside a workspace that pins it as a submodule. The simplest one is
the self-host edition:

```sh
git clone --recurse-submodules https://github.com/videogpt-dev/videogpt-ce.git
cd videogpt-ce
pnpm install
cd packages/videogpt-ui
```

Then, from `packages/videogpt-ui`:

```sh
vp test            # unit tests
pnpm typecheck     # TypeScript
pnpm lint          # ESLint
vp pack            # build dist-lib
```

A change here is a pull request against this repo; the workspaces that use it only move the
commit they point at.

## What belongs here

This package is presentation only. Components take data and report what the person did:

- **No transport.** No `fetch`, API paths, auth tokens or cookies. The host app loads, saves,
  uploads and streams, and passes the results in as props.
- **No secrets or internals.** No keys, provider names, prices worked out in the browser, or
  prompt bodies. Lists such as models, art styles and accounts come from the host as data.
- **The server decides.** Checks in here (a link the canvas refuses, a setting out of range)
  are there to help people while they edit. A host must check the same and more on its
  server, because anyone can call its API without this UI.
- **Theme tokens, not colours.** Use the shadcn and `--vui-*` tokens so a host theme restyles
  every component.
- **Plain TypeScript.** Fixed values are `as const` objects with a type of the same name (the
  package compiles with `erasableSyntaxOnly`, so no `enum`). Files are kebab-case.
- **Tests for logic.** Rules, layouts and helpers get a test next to them (`*.test.ts`).

## The flow canvas

`src/components/flow` is the node canvas. `FlowEditor` draws a flow from the node list an engine
describes (Kinoforge's `GET /v1/flows/nodes` shape: ports, settings as JSON schema, groups) and
calls back `onSave`, `onRun`, `onCancel` and `upload`. The host owns those calls and the live run
it passes back as `run`. `FlowRules` and `FlowLinks` hold the canvas's own checks; keep them in
step with the engine's rules, and remember the engine checks again.

## Pull requests

- Keep a PR to one thing. Small and focused gets reviewed fast.
- Match the style of the code around you.
- Describe what changed and why, and how you tested it. Screenshots help for visual changes.
- By opening a PR you agree your contribution is licensed under the repo's [LICENSE](LICENSE).
