# Security Policy

## Reporting a vulnerability

Please do not open a public issue for a security problem.

Report it privately through GitHub's
[private vulnerability reporting](https://github.com/videogpt-dev/videogpt-ui/security/advisories/new),
or email **security@kinoforge.dev**.

Include enough to reproduce: the affected version or commit, steps, and the impact you saw.
We'll acknowledge within a few days and keep you posted while we work on a fix.

## Scope

This is a browser UI library. It holds no secrets and makes no requests of its own; the host
app loads and saves everything and must check every request on its server.

In scope: a component that runs markup or script from the data it shows (cross-site scripting),
opens unsafe links, or leaks one user's data into another's view.

Out of scope: checks a host skipped on its own server. The canvas's link and setting checks
only help people while they edit; they are not a security boundary.
