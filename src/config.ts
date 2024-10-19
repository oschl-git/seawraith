import { name } from "../package.json";
import fs from "fs";
import os from "os";
import path from "path";
import yaml from "yaml";
import InvalidConfigError from "./errors/invalidConfigError";

const DEFAULT_CONFIG_PATH = path.join(process.cwd(), "default-config.yaml");
const USER_CONFIG_PATH = path.join(
  os.homedir(),
  ".config",
  String(name),
  "config.yaml",
);

interface Configuration {
  port: number;
  https: {
    use: boolean;
    keyPath: string;
    certificatePath: string;
  };
  forceHostname?: string;
  forceUsername?: string;
  forcePort?: number;
  forcePath?: string;
}

function loadConfiguration(): Configuration {
  const defaultConfig = loadConfigFile(DEFAULT_CONFIG_PATH);

  let userConfig = {};
  if (fs.existsSync(USER_CONFIG_PATH)) {
    userConfig = loadConfigFile(USER_CONFIG_PATH);
  }

  const finalConfig = {
    ...defaultConfig,
    ...userConfig,
  };

  if (typeof finalConfig.port !== "number") {
    throw new InvalidConfigError("Invalid SSL key path in configuration");
  }

  if (!finalConfig.https.use) {
    finalConfig.https.use = false;
  }

  if (finalConfig.https.use === true) {
    if (typeof finalConfig.https.keyPath !== "string") {
      throw new InvalidConfigError(
        "A valid SSL key path must be defined if using HTTPS",
      );
    }
    if (typeof finalConfig.https.certificatePath !== "string") {
      throw new InvalidConfigError(
        "A valid SSL certificate path must be defined if using HTTPS",
      );
    }
  }

  return finalConfig;
}

function loadConfigFile(path: string): Configuration {
  const fileContents = fs.readFileSync(path, "utf-8");

  return yaml.parse(fileContents) as Configuration;
}

export default loadConfiguration();
