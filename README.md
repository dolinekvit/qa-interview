# QA Automation — practical exercise

This is a stripped-down sandbox of the kind of system you'd be testing: a
multi-tenant ERP for bakeries. Two customers, **Consi** and **Pekárna Novák**,
use the same deployment. Neither may ever see the other's data.

The UI and the seed data are in Czech. You don't need to speak Czech — the
glossary below covers everything you need.

## Running it

```bash
npm install
npx playwright install chromium
npm run dev      # http://localhost:3100
npm test
```

The app runs at `/?token=tok-consi` (Consi) and `/?token=tok-novak`
(Pekárna Novák). The token is sent as the `x-tenant-token` header. There is a
`POST /api/_reset` endpoint that restores the seed data.

## The domain, in one paragraph

A **stock item** (`skladová položka`) is anything the bakery holds: an
ingredient, a packaging material, or a finished product. Items are tracked
either by plain quantity or **by batch** (`šarže`) — a specific delivery with
its own lot code and date. A date is either a **best-before**
(`minimální trvanlivost`, quality) or a **use-by** (`spotřebujte do`, safety —
selling past it is illegal). Every unit that leaves stock does so in exactly one
of three ways: it is **sold/expedited**, **consumed in production**, or
**written off**. Every movement carries a mandatory reason code.

Glossary: `sklad` = warehouse · `šarže` = batch · `příjem` = goods receipt ·
`množství` = quantity · `expedovat` = to dispatch/ship · `naskladněna` = received
into stock · `chyba` = error.

## Your task

**Part 1 — review the existing suite.** It is currently green. It should not
be. Go through `tests/` and tell us what you find. For each problem: what it is,
why it's a problem, and how you'd fix it. Fix the ones you have time for.

**Part 2 — the tests that aren't there.** The suite does not cover everything it
should. Write the tests you think are missing, prioritising by risk. Some of
them will fail. That is the expected outcome — a failing test that describes
real broken behaviour is a good deliverable, and we'd rather see three sharp
ones than fifteen shallow ones.

**Part 3 — write up what you'd tell the team.** A short note, in whatever form
you like: which of your findings blocks a release and which doesn't, and what
you'd change about how this suite is built if you owned it.

## Ground rules

- Timebox it to about three hours. Note what you'd have done with more.
- Don't rewrite the application to make tests pass. If the app is wrong, the
  test should fail and you should say so.
- Use whatever you normally use. If you'd reach for a tool that isn't here,
  say which and why.
- Commit as you go; we're as interested in the sequence as the endpoint.

## Stack notes

Vanilla JS frontend, Express backend, in-memory store. The real system is
TypeScript, React, Prisma and PostgreSQL with row-level security — the sandbox
strips that away so you can start in one command rather than one afternoon.
