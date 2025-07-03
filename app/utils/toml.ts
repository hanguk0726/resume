import fs from "fs/promises";
import TOML from  "toml";

export async function loadTomlData(filePath: string) {
  const tomlText = await fs.readFile(filePath, "utf-8");
  return TOML.parse(tomlText);
}
