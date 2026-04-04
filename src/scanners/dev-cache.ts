import { BaseScanner } from './base-scanner.js';
import { CATEGORIES, type ScanResult, type ScannerOptions, type CleanableItem } from '../types.js';
import { PATHS, exists, getSize, getDirectoryItems } from '../utils/index.js';
import { stat } from 'fs/promises';

export class DevCacheScanner extends BaseScanner {
  category = CATEGORIES['dev-cache'];

  async scan(_options?: ScannerOptions): Promise<ScanResult> {
    const items: CleanableItem[] = [];

    // ─── Core Package Manager Caches ─────────────
    const corePaths = [
      { name: 'npm cache', path: PATHS.npmCache },
      { name: 'Yarn cache', path: PATHS.yarnCache },
      { name: 'pnpm store', path: PATHS.pnpmCache },
      { name: 'Bun cache', path: PATHS.bunCache },
      { name: 'pip cache', path: PATHS.pipCache },
      { name: 'CocoaPods cache', path: PATHS.cocoapodsCache },
      { name: 'Gradle cache', path: PATHS.gradleCache },
      { name: 'Cargo cache', path: PATHS.cargoCache },
      { name: 'Go build cache', path: PATHS.goCache },
      { name: 'Go module cache', path: PATHS.goModCache },
      { name: 'Composer cache', path: PATHS.composerCache },
      { name: 'NuGet packages', path: PATHS.nugetCache },
      { name: 'Deno cache', path: PATHS.denoCache },
      { name: 'Bazel cache', path: PATHS.bazelCache },
    ];

    // ─── IDE / Editor Caches ─────────────────────
    const idePaths = [
      { name: 'VS Code cache', path: PATHS.vscodeCache },
      { name: 'VS Code cached data', path: PATHS.vscodeCachedData },
      { name: 'VS Code GPU cache', path: PATHS.vscodeGPUCache },
      { name: 'VS Code extensions cache', path: PATHS.vscodeExtCache },
      { name: 'VS Code Service Worker', path: PATHS.vscodeServiceWorker },
      { name: 'Cursor cache', path: PATHS.cursorCache },
      { name: 'Cursor cached data', path: PATHS.cursorCachedData },
      { name: 'Cursor GPU cache', path: PATHS.cursorGPUCache },
      { name: 'Cursor extensions cache', path: PATHS.cursorExtCache },
      { name: 'Zed cache', path: PATHS.zedCache },
      { name: 'JetBrains cache', path: PATHS.jetbrainsCache },
    ];

    // ─── Electron App Caches ─────────────────────
    const electronPaths = [
      { name: 'Claude cache', path: PATHS.claudeCache },
      { name: 'Claude GPU cache', path: PATHS.claudeGPUCache },
      { name: 'Antigravity cache', path: PATHS.antigravityCache },
      { name: 'Antigravity code cache', path: PATHS.antigravityCodeCache },
      { name: 'Antigravity GPU cache', path: PATHS.antigravityGPUCache },
    ];

    // ─── API / Database Tool Caches ──────────────
    const toolPaths = [
      { name: 'Postman cache', path: PATHS.postmanCache },
      { name: 'Insomnia cache', path: PATHS.insomniaCache },
      { name: 'TablePlus cache', path: PATHS.tablePlusCache },
      { name: 'DBeaver cache', path: PATHS.dbeaverCache },
      { name: 'Sequel Ace cache', path: PATHS.sequelAceCache },
      { name: 'Figma cache', path: PATHS.figmaCache },
      { name: 'GitHub Desktop cache', path: PATHS.githubDesktopCache },
    ];

    // ─── CI/CD & DevOps ──────────────────────────
    const cicdPaths = [
      { name: 'Terraform cache', path: PATHS.terraformCache },
      { name: 'SonarQube cache', path: PATHS.sonarCache },
      { name: 'pre-commit cache', path: PATHS.preCommitCache },
    ];

    // ─── Shell & Misc ────────────────────────────
    const miscPaths = [
      { name: 'Oh My Zsh cache', path: PATHS.ohmyzshCache },
      { name: 'Spotify cache', path: PATHS.spotifyCache },
      { name: 'Sentry crash reports', path: PATHS.sentryCrash },
      { name: 'KSCrash reports', path: PATHS.ksCrash },
      { name: 'Crash reports', path: PATHS.crashReports },
    ];

    // ─── Scan all paths ──────────────────────────
    const allPaths = [...corePaths, ...idePaths, ...electronPaths, ...toolPaths, ...cicdPaths, ...miscPaths];

    for (const dev of allPaths) {
      if (await exists(dev.path)) {
        try {
          const size = await getSize(dev.path);
          if (size > 0) {
            const stats = await stat(dev.path);
            items.push({
              path: dev.path,
              size,
              name: dev.name,
              isDirectory: true,
              modifiedAt: stats.mtime,
            });
          }
        } catch {
          continue;
        }
      }
    }

    // ─── Xcode DerivedData (per-project) ─────────
    if (await exists(PATHS.xcodeDerivedData)) {
      const xcodeItems = await getDirectoryItems(PATHS.xcodeDerivedData);
      for (const item of xcodeItems) {
        items.push({
          ...item,
          name: `Xcode: ${item.name}`,
        });
      }
    }

    // ─── Xcode Archives ──────────────────────────
    if (await exists(PATHS.xcodeArchives)) {
      try {
        const size = await getSize(PATHS.xcodeArchives);
        if (size > 0) {
          const stats = await stat(PATHS.xcodeArchives);
          items.push({
            path: PATHS.xcodeArchives,
            size,
            name: 'Xcode Archives',
            isDirectory: true,
            modifiedAt: stats.mtime,
          });
        }
      } catch {
        // Ignore
      }
    }

    // ─── Xcode Simulators ────────────────────────
    if (await exists(PATHS.xcodeSimulators)) {
      try {
        const size = await getSize(PATHS.xcodeSimulators);
        if (size > 0) {
          const stats = await stat(PATHS.xcodeSimulators);
          items.push({
            path: PATHS.xcodeSimulators,
            size,
            name: 'Xcode Simulators',
            isDirectory: true,
            modifiedAt: stats.mtime,
          });
        }
      } catch {
        // Ignore
      }
    }

    return this.createResult(items);
  }
}
