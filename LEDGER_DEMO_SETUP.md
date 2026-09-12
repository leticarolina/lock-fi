# Ledger Demo Setup — Running Speculos Locally

This is the setup needed for `frontend`'s Ledger DMK integration (`src/lib/dmk.ts`,
`src/LedgerConnect.tsx`) to have something to connect to. Speculos is Ledger's
own device simulator — it emulates real hardware and exposes an HTTP API the
DMK's Speculos transport talks to directly, no physical device required.

This gets you a running Speculos instance emulating a Nano X with the
Ethereum app open, listening on `http://127.0.0.1:5000` — the exact address
the frontend expects by default (`VITE_SPECULOS_URL`, see `.env.example`).

Everything here is one Docker workflow: the same container both builds the
Ethereum app binary and runs Speculos against it.

## Prerequisites

- Docker installed and running.
- ~2GB free for the build image and sources.

## 1. Get the Ethereum app source

Speculos emulates hardware, but it still needs an actual app binary (`.elf`)
to run — in this case, Ledger's own Ethereum app.

```sh
git clone https://github.com/LedgerHQ/app-ethereum.git
cd app-ethereum
git submodule update --init --recursive
```

## 2. Start Ledger's build container

This image (`ledger-app-dev-tools`) bundles both the toolchain to compile the
app and Speculos itself — one container, no separate install.

**Linux:**

```sh
sudo docker run --rm -ti --user "$(id -u):$(id -g)" \
  -v "$(realpath .):/app" -p 5000:5000 \
  ghcr.io/ledgerhq/ledger-app-builder/ledger-app-dev-tools:latest
```

**macOS:**

```sh
docker run --rm -ti --user "$(id -u):$(id -g)" \
  -v "$(pwd -P):/app" -p 5000:5000 \
  ghcr.io/ledgerhq/ledger-app-builder/ledger-app-dev-tools:latest
```

> **Apple Silicon:** if this errors on architecture/platform, add
> `--platform linux/amd64` right after `docker run` — it'll run under
> emulation (slower to build, still works fine for the demo).

`-p 5000:5000` publishes Speculos's REST API port to the host — this is the
port the frontend will talk to. You should now have a shell prompt inside
the container, in `/app` (the mounted `app-ethereum` checkout).

## 3. Build the app, from inside the container

```sh
BOLOS_SDK=$NANOX_SDK make DEBUG=1
```

This produces `build/nanox/bin/app.elf`. (Swap `$NANOX_SDK` for `$NANOSP_SDK`
if you'd rather emulate a Nano S Plus — update `DeviceModelId.NANO_X` in
`frontend/src/lib/dmk.ts` to match if you do.)

## 4. Run Speculos, from inside the same container

```sh
speculos --display headless build/nanox/bin/app.elf
```

- `--display headless` — no GUI needed inside the container.
- No `--api-port` flag needed — 5000 is the default, and it's already
  published to the host from step 2.
- Leave this running for the duration of the demo. Ctrl+C stops it (and
  exiting the shell after tears down the container).

You should see log output indicating the REST API is listening. Confirm
from the host by opening **http://127.0.0.1:5000** in a browser — Speculos
serves a small web UI there showing the emulated device's screen (it should
show the Ethereum app as open).

## 5. Run the frontend against it

No env var changes needed if Speculos is on the default address — `frontend`
falls back to `http://127.0.0.1:5000` automatically (see `.env.example` /
`VITE_SPECULOS_URL` if you're running Speculos somewhere else, e.g. a
different port or a remote host).

```sh
cd frontend
npm run dev
```

Open `http://localhost:5173/app`, find the **Ledger Connection** panel
(currently rendered directly on the page for testing — not wired into any
tab yet), leave the transport selector on **Speculos (Simulator)** (the
default), and click **Connect Ledger**. You should see the status line move
through `Searching for device…` → `Connected. Checking device app…` →
the retrieved Ethereum address.

## Notes / troubleshooting

- **CORS**: Speculos's REST API sends `Access-Control-Allow-Origin: *` on
  every route by default, so the browser can call `http://127.0.0.1:5000`
  directly from `http://localhost:5173` — no proxy needed. If you do hit a
  CORS error, you're likely on an unusually old Speculos build.
- **No on-device button presses needed**: this stage only reads the address
  (no `checkOnDevice` verification requested), so Speculos doesn't need any
  automation/auto-approve setup for it to work.
- **"Wrong app open on device"** in the UI: means Speculos answered but
  reported a running app other than `"Ethereum"` — check the container's
  Speculos process is actually running `build/nanox/bin/app.elf` (step 4),
  not just the container sitting at a shell prompt.
- **Connection refused / times out**: Speculos isn't running yet, the
  container's port 5000 wasn't published (`-p 5000:5000` in step 2), or
  something else is bound to host port 5000 — free it or run Speculos with
  `--api-port <other-port>` and set `VITE_SPECULOS_URL` to match.
- **Submodule/build errors** in step 3: re-run
  `git submodule update --init --recursive` from the host (step 1) before
  entering the container.
