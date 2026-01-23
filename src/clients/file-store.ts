import { writeFile } from "node:fs/promises";

export const store = async (
  fileName: string,
  data: string | object,
  options?: { encoding?: BufferEncoding },
) => {
  const filePath = `./2024-2025/${fileName}`;
  const jsonData = typeof data === "string" ? data : JSON.stringify(data);
  return await writeFile(filePath, jsonData, {
    encoding: options?.encoding || "utf-8",
  });
};
