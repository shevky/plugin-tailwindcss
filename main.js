import { io, exec, plugin } from "@shevky/base";

const PLUGIN_NAME = "shevky-tailwindcss";
const PLUGIN_VERSION = "0.0.5";
const PLUGIN_ROOT = import.meta.dirname ?? process.cwd();

/** @type {import("@shevky/base").PluginHooks} */
const hooks = {
  [plugin.hooks.ASSETS_COPY]: async function (ctx) {
    const configPath = io.path.resolve(ctx.paths.root, "tailwind.config.js");
    const sourePath = io.path.resolve(ctx.paths.src, "css", "app.css");
    const distPath = io.path.resolve(ctx.paths.dist, "output.css");

    if (!(await ctx.file.exists(configPath))) {
      ctx.log.warn(
        `[${PLUGIN_NAME}] Skipping CSS pipeline because Tailwind config is missing at ${configPath}.`,
      );
      return;
    }

    if (!(await ctx.file.exists(sourePath))) {
      ctx.log.warn(
        `[${PLUGIN_NAME}] Skipping CSS pipeline because the source file is missing at ${sourePath}.`,
      );
      return;
    }

    const isWindows = process.platform === "win32";
    const tailwindBinName = isWindows ? "tailwindcss.cmd" : "tailwindcss";
    const rootBin = io.path.resolve(
      ctx.paths.root,
      "node_modules",
      ".bin",
      tailwindBinName,
    );
    const pluginBin = io.path.resolve(
      PLUGIN_ROOT,
      "node_modules",
      ".bin",
      tailwindBinName,
    );
    const tailwindBin = (await ctx.file.exists(rootBin)) ? rootBin : pluginBin;

    if (!(await ctx.file.exists(tailwindBin))) {
      ctx.log.err(
        `[${PLUGIN_NAME}] Skipping CSS pipeline because Tailwind CLI is missing at ${tailwindBin}.`,
      );
      return;
    }

    const args = ["-c", configPath, "--input", sourePath, "--output", distPath];

    if (ctx.config.build.minify) {
      args.push("--minify");
    }

    await exec.execute(tailwindBin, args, ctx.paths.root);
    ctx.log.debug(`[${PLUGIN_NAME}] TailwindCSS has been compiled.`);
  },
};

const PLUGIN = { name: PLUGIN_NAME, version: PLUGIN_VERSION, hooks };
export default PLUGIN;
