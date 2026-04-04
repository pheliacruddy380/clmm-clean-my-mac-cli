<div align="center">
  <img src="assets/hero.jpeg" alt="CLMM CLI Hero Banner" width="800" style="border-radius: 12px; margin-bottom: 24px; box-shadow: 0 8px 24px rgba(0,0,0,0.2);">
  
  # 🧹 CLMM — Clean My Mac CLI

  <p><b>Personal macOS CLI tool for system cleanup, optimization & disk space management</b></p>

  [![macOS](https://img.shields.io/badge/macOS-000000?style=for-the-badge&logo=apple&logoColor=white)](https://apple.com)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
  [![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

  <p><i>Built from scratch in TypeScript — no GUI, full control.</i></p>
</div>

---

## ✨ Features

### 🩺 `clmm check` — System Health Dashboard
Checks disk space, memory, swap, SMART status, login items, cache sizes, and security settings (SIP, FileVault, Gatekeeper). Produces a **Health Score** (0-100).

```bash
$ clmm check

🩺 System Health Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ Disk Space       39.4 GB free
  ✅ Memory           77% used (12.3 / 16 GB)
  ❌ Swap             8.6 GB
  ✅ Login Items      2 apps
  ✅ Disk Health      SMART Verified
  ⚠️  Cache Size       26.8 GB cleanable
  ✅ SIP              Enabled
  ✅ FileVault        On
  ✅ Gatekeeper       Active
  ✅ macOS Updates    Up to date

  ███████████████░░░░░  75/100 — Good
```

### ⚡ `clmm optimize` — Auto-Fix System Issues
11 optimization tasks: DNS flush, memory purge, font cache rebuild, Launch Services, quarantine cleanup, broken plist repair, orphaned LaunchAgent detection, Dock refresh, Spotlight check, periodic maintenance.

```bash
$ clmm optimize --dry-run

⚡ Optimization Results
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ DNS Cache Flush        Would flush DNS cache
  ✅ Memory Purge           Would purge inactive memory
  ✅ Font Cache Rebuild     Would rebuild font caches
  ✅ Launch Services        Would rebuild database
  ✅ Quarantine Cleanup     Would remove quarantine from 1325 files
  ⏭️  Broken Preferences     All preferences valid
  ✅ Launch Agents          Would remove 1 orphaned agent(s)
  ✅ Periodic Maintenance   Would run daily/weekly/monthly

  📊 8 completed · 3 skipped
```

### 📱 `clmm apps` — Application Manager
Scans all installed apps, reads `Info.plist`, detects "Last Used" dates via Spotlight/filesystem, categorizes as Active/Stale/Unused.

```bash
$ clmm apps

📱 Installed Applications (45 apps)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 1  Docker              28.3 GB   4 months ago   🔴 Unused
 2  Zalo                15.8 GB   Today          ✅ Active
 3  Xcode                4.7 GB   3 months ago   🔴 Unused
 ...
```

### 📊 `clmm analyze [path]` — Disk Usage Analyzer
Visual breakdown with bar charts, top N largest files, directory-level analysis.

```bash
$ clmm analyze ~

💿 Disk Overview
  Total: 460.4 GB  |  Used: 20.9 GB (5%)  |  Available: 40.8 GB

📂 Directory Breakdown: ~
 1. ████████████████████  78.4%  📁 Downloads      18.2 GB
 2. ███                   10.1%  📁 Movies          2.3 GB
```

### 🗃️ `clmm purge` — Build Artifact Cleaner
Scans 45+ artifact patterns (node_modules, .venv, target/, .next, __pycache__, .terraform, Pods, DerivedData...) plus **Docker volume detection** from docker-compose files. Interactive selection with deduplication.

```bash
$ clmm purge

🗃️ Build Artifacts
Project                      Type             Size   Modified
CleanMyMac                   node_modules   243.2 MB  Today
my-api                       docker:data     1.2 GB   2w ago
old-project                  .venv          89.4 MB   3mo ago
```

### 🗑️ `clmm uninstall` — Deep App Uninstaller
Finds and removes application bundles with all related files (preferences, caches, Application Support, containers).

### 🔧 `clmm maintenance` — Maintenance Tasks
DNS cache flush, free purgeable space.

### 🧹 `clmm` (interactive) — Full System Cleanup
Interactive category-based cleanup inherited from mac-cleaner-cli: user caches, system caches, logs, browser caches, dev caches (50+ targets from Mole), application support, etc.

---

## 🚀 Installation

```bash
# 1. Clone the repository
git clone https://github.com/0xAstroAlpha/clmm-clean-my-mac-cli.git
cd clmm-clean-my-mac-cli

# 2. Install dependencies
npm install

# 3. Build and link globally (Makes the 'clmm' command available everywhere)
npm run build
npm link

# 4. Verify installation
clmm --help
```

*(Note: If you plan to modify the CLI source code later, just run `npm run build` again and your global `clmm` command will be automatically updated!)*

### Requirements
- macOS (tested on macOS 15+)
- Node.js >= 20.12.0

---

## 📋 All Commands

| Command | Description |
|---|---|
| `clmm` | Interactive system cleanup (browser caches, dev caches, logs, etc.) |
| `clmm check` | 🩺 System health dashboard (10 checks + health score) |
| `clmm optimize` | ⚡ Auto-fix system issues (11 tasks, supports `--dry-run`) |
| `clmm apps` | 📱 List apps with usage analysis |
| `clmm analyze [path]` | 📊 Disk usage analyzer with visual breakdown |
| `clmm purge` | 🗃️ Clean build artifacts + Docker volumes |
| `clmm uninstall` | 🗑️ Deep app uninstaller |
| `clmm maintenance` | 🔧 DNS flush, purgeable space |
| `clmm categories` | 📋 List cleanup categories |
| `clmm config` | ⚙️ Manage configuration |
| `clmm backup` | 💾 Manage backups |

### Common Options

```bash
--json          # Output as JSON for scripting
--dry-run       # Preview without making changes  
-y, --yes       # Skip confirmation prompts
```

---

## 🔒 Safety

- 🛡️ **Path validation** — all operations validate paths against protected system directories
- 🔍 **Dry-run mode** — preview what would be changed before executing
- ✅ **Confirmation prompts** — destructive operations require explicit approval
- 📋 **No root required** — runs with standard user permissions (some optimize tasks may request sudo)

---

## 🏗️ Architecture

```
src/
├── index.ts              # CLI entry point (commander.js)
├── commands/
│   ├── check.ts          # System health check (10 checks)
│   ├── optimize.ts       # System optimizer (11 tasks)
│   ├── apps.ts           # Application manager
│   ├── analyze.ts        # Disk usage analyzer  
│   ├── purge.ts          # Build artifact cleaner + Docker volumes
│   └── index.ts          # Original commands (uninstall, maintenance)
├── scanners/
│   ├── base-scanner.ts   # Scanner interface
│   ├── dev-cache.ts      # 50+ dev cache targets
│   ├── browser-cache.ts  # Browser caches
│   ├── user-cache.ts     # User Library caches
│   └── ...               # Other category scanners
├── utils/
│   ├── paths.ts          # 90+ cleanup target paths
│   ├── size.ts           # Size formatting
│   ├── fs.ts             # File system safety utilities
│   └── ...
└── types.ts              # Type definitions
```

---

## 📚 Credits & References

This project was built from scratch by combining ideas and patterns from several excellent open-source projects:

### Core Foundation
| Project | Author | License | What We Learned |
|---|---|---|---|
| [mac-cleaner-cli](https://github.com/guhcostan/mac-cleaner-cli) | [@guhcostan](https://github.com/guhcostan) | MIT | Original CLI architecture, scanner pattern, interactive cleanup flow, path safety validation |

### System Optimization & Deep Cleanup
| Project | Author | License | What We Learned |
|---|---|---|---|
| [Mole](https://github.com/tw93/Mole) | [@tw93](https://github.com/tw93) | MIT | System health checks (disk/memory/swap/SMART), 17 optimization tasks (DNS flush, font cache, Launch Services, Spotlight, etc.), 200+ cleanup target paths, orphaned LaunchAgent detection, whitelist system, Apple Silicon cache paths, live TUI monitor architecture |

### Build Artifact Cleaning
| Project | Author | License | What We Learned |
|---|---|---|---|
| [clean-stack](https://github.com/huantt/clean-stack) | [@huantt](https://github.com/huantt) | MIT | Docker volume scanning (docker-compose.yml parsing), path deduplication algorithm for nested artifact directories, artifact categorization patterns |

### Specific Contributions by Source

#### From mac-cleaner-cli
- Commander.js + Inquirer.js CLI architecture
- BaseScanner class pattern
- Category-based cleanup flow
- Path safety validation (`isProtectedPath`, `validatePathSafety`)
- Backup system with rollback support

#### From Mole (tw93/Mole)
- `clmm check` command — inspired by `mo check` (system health dashboard)
- `clmm optimize` command — inspired by `mo optimize` (17 optimization tasks)
- 50+ new cleanup target paths added to `dev-cache.ts` scanner:
  - IDE caches: VS Code, Cursor, Zed, JetBrains
  - Electron app caches: Claude, Antigravity
  - API tool caches: Postman, Insomnia, TablePlus
  - Database tools: DBeaver, Sequel Ace
  - CI/CD: Terraform, SonarQube, pre-commit
  - Apple Silicon: Rosetta 2 caches
  - Shell: Oh My Zsh cache
- Health Score calculation algorithm
- Orphaned LaunchAgent detection logic
- Broken preference plist validation (`plutil -lint`)
- Periodic maintenance trigger (`sudo periodic daily weekly monthly`)

#### From clean-stack (huantt/clean-stack)
- Docker volume data directory scanning
- Path deduplication algorithm (`deduplicateArtifacts`)
- 20+ additional build artifact patterns:
  - `.pytest_cache`, `.mypy_cache`, `.ruff_cache`, `.tox`, `.eggs`
  - `.angular`, `.svelte-kit`, `.astro`, `.docusaurus`
  - `.parcel-cache`, `.turbo`, `.vite`, `.nx`
  - `Carthage`, `.terraform`
  - `coverage`, `.coverage`, `.nyc_output`

---

## 📄 License

MIT — See [LICENSE](./LICENSE)

---

<p align="center">
  <b>clmm</b> — Built with ❤️ for macOS power users
  <br>
  <i>Developed by Lê Huy Đức Anh — <a href="https://facebook.com/lehuyducanh">Facebook.com/lehuyducanh</a></i>
</p>
