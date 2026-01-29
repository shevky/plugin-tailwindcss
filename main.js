import { io, exec, plugin } from "@shevky/base";

const PLUGIN_ROOT = import.meta.dirname ?? process.cwd();

/** @type {import("@shevky/base").PluginHooks} */
const hooks = {
  [plugin.hooks.ASSETS_COPY]: async function (ctx) {
    const configPath = io.path.resolve(ctx.paths.root, "tailwind.config.js");
    const sourePath = io.path.resolve(ctx.paths.src, "css", "app.css");
    const distPath = io.path.resolve(ctx.paths.dist, "output.css");

    if (!(await ctx.file.exists(configPath))) {
      ctx.log.err(
        `Skipping CSS pipeline because Tailwind config is missing at ${configPath}.`,
      );
      return;
    }

    if (!(await ctx.file.exists(sourePath))) {
      ctx.log.err(
        `Skipping CSS pipeline because the source file is missing at ${sourePath}.`,
      );
      return;
    }

    const isWindows = process.platform === "win32";
    const tailwindBin = io.path.resolve(
      PLUGIN_ROOT,
      "node_modules",
      ".bin",
      isWindows ? "tailwindcss.cmd" : "tailwindcss",
    );

    if (!(await ctx.file.exists(tailwindBin))) {
      ctx.log.err(
        `Skipping CSS pipeline because Tailwind CLI is missing at ${tailwindBin}.`,
      );
      return;
    }

    const args = ["-c", configPath, "--input", sourePath, "--output", distPath];

    if (ctx.config.build.minify) {
      args.push("--minify");
    }

    await exec.execute(tailwindBin, args, ctx.paths.root);
    ctx.log.debug("TailwindCSS has been compiled.");
  },
};

const PLUGIN = {
  name: "shevky-tailwindcss",
  version: "0.0.1",
  hooks,
};

export default PLUGIN;
