import { cachedFetchJson } from "./cachedFetch";
import { fetchJson } from "./fetch";
import { ghRegex } from "./ghRegex";

/**
 * Retrieves the cover image URL for a GitHub repository.
 *
 * @param url - The URL of the GitHub repository.
 * @returns The URL of the cover image or null if not found.
 */
export async function getQmodCoverUrl(url: string) {
  const match = ghRegex.exec(url);

  if (match) {
    try {
      const repoJson: any = await cachedFetchJson(`https://api.github.com/repos/${match[1]}/${match[2]}`);

      const defaultBranch = repoJson["default_branch"] as string;
      let coverFilename = "cover.png";

      try {
        var result = await fetchJson<any>(
          `https://raw.githubusercontent.com/${match[1]}/${match[2]}/${defaultBranch}/mod.template.json?${new Date().getTime()}`,
        );

        if (result.data) {
          coverFilename = result.data.coverImage || coverFilename;
        }
      } catch (err) { }

      const coverResponse = await fetch(`https://raw.githubusercontent.com/${match[1]}/${match[2]}/${defaultBranch}/${coverFilename}?${new Date().getTime()}`, {
        method: "HEAD",
      });

      if (coverResponse.ok) {
        return `https://raw.githubusercontent.com/${match[1]}/${match[2]}/${defaultBranch}/${coverFilename}`;
      }
    } catch (err) { }
  }

  return null;
}