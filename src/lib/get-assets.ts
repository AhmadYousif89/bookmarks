import path from "path";
import fs from "fs/promises";

const FAVICON_PREFIX = "favicon-";
const DIR = path.join(process.cwd(), "public", "assets", "images");
const ALLOWED_EXTENSIONS = [".png", ".ico", ".svg", ".webp", ".jpg", ".jpeg"];

/**
 * Retrieves a list of favicon files from the favicons directory.
 * @returns List of favicon objects with name and URL
 */
export async function getFavicons(): Promise<{ name: string; url: string }[]> {
  try {
    const files = await fs.readdir(DIR);
    return files
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return file.startsWith(FAVICON_PREFIX) && ALLOWED_EXTENSIONS.includes(ext);
      })
      .map((file) => ({
        name: file,
        url: `/assets/images/${file}`,
      }));
  } catch (error) {
    console.error("Error reading favicons directory:", error);
    return [];
  }
}
