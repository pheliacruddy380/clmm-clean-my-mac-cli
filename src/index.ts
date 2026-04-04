#!/usr/bin/env node

import { Command } from 'commander';
import { ExitPromptError } from '@inquirer/core';
import { interactiveCommand, listCategories, maintenanceCommand, uninstallCommand } from './commands/index.js';
import { initConfig, configExists, listBackups, cleanOldBackups, loadConfig, formatSize } from './utils/index.js';
import { appsCommand } from './commands/apps.js';
import { analyzeCommand } from './commands/analyze.js';
import { purgeCommand } from './commands/purge.js';
import { checkCommand } from './commands/check.js';
import { optimizeCommand } from './commands/optimize.js';

const VERSION = '1.0.0';

function handleCleanExit(error: unknown) {
  if (error instanceof ExitPromptError) {
    console.log("\n");
    process.exit(0);
  }
  throw error;
}

function setupGracefulShutdown(): void {
  const handleExit = (signal: string) => {
    console.log(`\n${signal} received. Exiting...`);
    process.exit(0);
  };

  process.on('SIGINT', () => handleExit('SIGINT'));
  process.on('SIGTERM', () => handleExit('SIGTERM'));
  process.on('SIGQUIT', () => handleExit('SIGQUIT'));
}

setupGracefulShutdown();

const program = new Command();

program
  .name('clmm')
  .description('🧹 Clean My Mac — Personal CLI for macOS cleanup & optimization')
  .version(VERSION)
  .option('-r, --risky', 'Include risky categories (downloads, iOS backups, etc)')
  .option('-f, --file-picker', 'Force file picker for ALL categories')
  .option('-A, --absolute-paths', 'Show absolute paths instead of truncated notations')
  .option('--no-progress', 'Disable progress bar')
  .action(async (options) => {
    try {
      await interactiveCommand({
        includeRisky: options.risky,
        filePicker: options.filePicker,
        absolutePaths: options.absolutePaths,
        noProgress: !options.progress,
      });
    } catch (error) {
      handleCleanExit(error)
    }
  });

// ═══════════════════════════════════════════════════
// 🆕 SYSTEM HEALTH & OPTIMIZE
// ═══════════════════════════════════════════════════

program
  .command('check')
  .description('🩺 System health check — disk, memory, security, and more')
  .option('--json', 'Output as JSON for scripting')
  .action(async (options) => {
    try {
      await checkCommand({ json: options.json });
    } catch (error) {
      handleCleanExit(error);
    }
  });

program
  .command('optimize')
  .description('⚡ Auto-fix system issues (DNS, memory, fonts, LaunchAgents, etc.)')
  .option('--dry-run', 'Preview without making changes')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option('--json', 'Output as JSON for scripting')
  .action(async (options) => {
    try {
      await optimizeCommand({
        dryRun: options.dryRun,
        yes: options.yes,
        json: options.json,
      });
    } catch (error) {
      handleCleanExit(error);
    }
  });

// ═══════════════════════════════════════════════════
// 🆕 APP MANAGEMENT
// ═══════════════════════════════════════════════════

program
  .command('apps')
  .description('📱 List installed apps with usage analysis & cleanup recommendations')
  .option('--cleanup', 'Show cleanup recommendations for unused apps')
  .option('--sort <field>', 'Sort by: size, name, last-used (default: size)', 'size')
  .option('--stale-days <days>', 'Days threshold for stale apps (default: 90)', '90')
  .option('--json', 'Output as JSON for scripting')
  .action(async (options) => {
    try {
      await appsCommand({
        cleanup: options.cleanup,
        sort: options.sort,
        staleDays: parseInt(options.staleDays, 10),
        json: options.json,
      });
    } catch (error) {
      handleCleanExit(error);
    }
  });

// ═══════════════════════════════════════════════════
// 🆕 DISK ANALYZER
// ═══════════════════════════════════════════════════

program
  .command('analyze [path]')
  .description('📊 Analyze disk usage with visual breakdown')
  .option('--top <n>', 'Show top N largest items (default: 15)', '15')
  .option('--json', 'Output as JSON for scripting')
  .action(async (path, options) => {
    try {
      await analyzeCommand({
        path: path || process.env.HOME || '~',
        top: parseInt(options.top, 10),
        json: options.json,
      });
    } catch (error) {
      handleCleanExit(error);
    }
  });

// ═══════════════════════════════════════════════════
// 🆕 BUILD ARTIFACT PURGE
// ═══════════════════════════════════════════════════

program
  .command('purge')
  .description('🗃️ Clean build artifacts (node_modules, target/, .venv, etc.)')
  .option('--path <dir>', 'Directory to scan (default: ~/Documents/Code)')
  .option('--dry-run', 'Preview without deleting')
  .option('--older-than <days>', 'Only show artifacts older than N days')
  .option('--auto', 'Auto-delete all matching artifacts (with confirmation)')
  .option('--json', 'Output as JSON for scripting')
  .action(async (options) => {
    try {
      await purgeCommand({
        scanPath: options.path,
        dryRun: options.dryRun,
        json: options.json,
        olderThan: options.olderThan ? parseInt(options.olderThan, 10) : undefined,
        auto: options.auto,
      });
    } catch (error) {
      handleCleanExit(error);
    }
  });

// ═══════════════════════════════════════════════════
// EXISTING: UNINSTALL
// ═══════════════════════════════════════════════════

program
  .command('uninstall')
  .description('🗑️ Uninstall applications and their related files')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option('-d, --dry-run', 'Show what would be uninstalled without actually uninstalling')
  .option('--no-progress', 'Disable progress bar')
  .action(async (options) => {
    try {
      await uninstallCommand({
        yes: options.yes,
        dryRun: options.dryRun,
        noProgress: !options.progress,
      });
    } catch (error) {
      handleCleanExit(error)
    }
  });

// ═══════════════════════════════════════════════════
// EXISTING: MAINTENANCE
// ═══════════════════════════════════════════════════

program
  .command('maintenance')
  .description('🔧 Run maintenance tasks (DNS flush, free purgeable space)')
  .option('--dns', 'Flush DNS cache')
  .option('--purgeable', 'Free purgeable space')
  .action(async (options) => {
    await maintenanceCommand({
      dns: options.dns,
      purgeable: options.purgeable,
    });
  });

program
  .command('categories')
  .description('📋 List all available cleanup categories')
  .action(() => {
    listCategories();
  });

program
  .command('config')
  .description('⚙️ Manage configuration')
  .option('--init', 'Create default configuration file')
  .option('--show', 'Show current configuration')
  .action(async (options) => {
    if (options.init) {
      const exists = await configExists();
      if (exists) {
        console.log('Configuration file already exists.');
        return;
      }
      const path = await initConfig();
      console.log(`Created configuration file at: ${path}`);
      return;
    }

    if (options.show) {
      const cfgExists = await configExists();
      if (!cfgExists) {
        console.log('No configuration file found. Run "clmm config --init" to create one.');
        return;
      }
      const config = await loadConfig();
      console.log(JSON.stringify(config, null, 2));
      return;
    }

    console.log('Use --init to create config or --show to display current config.');
  });

program
  .command('backup')
  .description('💾 Manage backups')
  .option('--list', 'List all backups')
  .option('--clean', 'Clean old backups (older than 7 days)')
  .action(async (options) => {
    if (options.list) {
      const backups = await listBackups();
      if (backups.length === 0) {
        console.log('No backups found.');
        return;
      }
      console.log('\nBackups:');
      for (const backup of backups) {
        console.log(`  ${backup.date.toLocaleDateString()} - ${formatSize(backup.size)}`);
        console.log(`    ${backup.path}`);
      }
      return;
    }

    if (options.clean) {
      const cleaned = await cleanOldBackups();
      console.log(`Cleaned ${cleaned} old backups.`);
      return;
    }

    console.log('Use --list to show backups or --clean to remove old ones.');
  });

program.parse();
