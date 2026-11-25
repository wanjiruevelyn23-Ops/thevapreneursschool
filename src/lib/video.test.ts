import { describe, expect, it } from "vitest";
import { safeVideoLink, videoEmbedUrl } from "./video";

describe("videoEmbedUrl", () => {
  it("embeds YouTube watch links", () => {
    expect(videoEmbedUrl("https://www.youtube.com/watch?v=abc123")).toBe(
      "https://www.youtube-nocookie.com/embed/abc123",
    );
  });
  it("embeds Vimeo links", () => {
    expect(videoEmbedUrl("https://vimeo.com/76979871")).toBe("https://player.vimeo.com/video/76979871");
  });
  it("refuses unknown sites", () => {
    expect(videoEmbedUrl("https://evil.example.com/watch?v=abc")).toBeNull();
  });
  it("refuses non-https links", () => {
    expect(videoEmbedUrl("http://youtube.com/watch?v=abc")).toBeNull();
  });
});

describe("safeVideoLink", () => {
  it("allows https external links and blocks unsafe schemes", () => {
    expect(safeVideoLink("https://example.com/video")).toBe("https://example.com/video");
    expect(safeVideoLink("javascript:alert(1)")).toBeNull();
    expect(safeVideoLink("http://example.com/video")).toBeNull();
  });
});
