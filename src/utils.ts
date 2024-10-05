import path from "path";
import os from "os";

export function configDir(name?: string) {
  const home = os.homedir();
  let configDir = "config";

  switch (process.platform) {
    case "win32":
      configDir = path.join(
        process.env.APPDATA || home,
        "safe",
        name ? name : "",
      );
      break;

    case "darwin":
      configDir = path.join(
        home,
        "Library",
        "Application Support",
        "safe",
        name ? name : "",
      );
      break;

    case "linux":
      configDir = path.join(home, ".config", "safe", name ? name : "");
  }
  return configDir;
}

export function splitBuffer(buffer: Buffer, delimiter: Buffer): Buffer[] {
  const result: Buffer[] = [];
  let start = 0;
  let index: number;

  while ((index = buffer.indexOf(delimiter, start)) !== -1) {
    result.push(buffer.subarray(start, index));
    start = index + delimiter.length;
  }

  result.push(buffer.subarray(start));
  return result;
}
