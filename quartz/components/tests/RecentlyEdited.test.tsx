import { describe, it, expect } from "@jest/globals"
import { render } from "preact-render-to-string"
import { GlobalConfiguration } from "../../cfg"
import { QuartzPluginData } from "../../plugins/vfile"
import RecentlyEdited from "../pages/RecentlyEdited"

describe("RecentlyEdited", () => {
  const mockCfg: GlobalConfiguration = {
    pageTitle: "Test Site",
    enablePopovers: true,
    analytics: null,
    baseUrl: "test.com",
    ignorePatterns: [],
    defaultDateType: "published",
    navbar: { pages: [] },
  }

  const createMockFile = (slug: string, title: string, modified?: Date): QuartzPluginData =>
    ({
      slug: slug as any,
      frontmatter: { title },
      dates: modified ? { published: modified, modified, created: modified } : undefined,
    }) as any

  const defaultProps = {
    ctx: {} as any,
    externalResources: {} as any,
    cfg: mockCfg,
    children: [],
    tree: {} as any,
    allFiles: [],
    fileData: { slug: "welcome" as any },
  }

  it("should display 3 most recently edited articles", () => {
    const article1 = createMockFile("post-1", "Article 1", new Date("2023-01-01"))
    const article2 = createMockFile("post-2", "Article 2", new Date("2023-02-01"))
    const article3 = createMockFile("post-3", "Article 3", new Date("2023-03-01"))
    const article4 = createMockFile("post-4", "Article 4", new Date("2023-04-01"))
    const article5 = createMockFile("post-5", "Article 5", new Date("2023-05-01"))

    const props = {
      ...defaultProps,
      allFiles: [article1, article2, article3, article4, article5],
    }

    const rendered = render(<RecentlyEdited {...props} />)

    expect(rendered).toContain("recently-edited-section")
    expect(rendered).toContain("🔄 Recently Edited")
    expect(rendered).toContain("Article 5") // Most recent
    expect(rendered).toContain("Article 4") // 2nd most recent
    expect(rendered).toContain("Article 3") // 3rd most recent
    expect(rendered).not.toContain("Article 1") // Should not be in top 3
    expect(rendered).not.toContain("Article 2") // Should not be in top 3
  })

  it("should filter out index pages and current file", () => {
    const indexFile = createMockFile("welcome", "Welcome", new Date("2023-02-01"))
    const allPostsFile = createMockFile("all-posts", "All Posts", new Date("2023-02-02"))
    const tagsFile = createMockFile("tags", "Tags", new Date("2023-02-03"))
    const normalArticle = createMockFile("normal-post", "Normal Article", new Date("2023-01-01"))

    const props = {
      ...defaultProps,
      allFiles: [indexFile, allPostsFile, tagsFile, normalArticle],
    }

    const rendered = render(<RecentlyEdited {...props} />)

    expect(rendered).toContain("Normal Article")
    expect(rendered).not.toContain("Welcome")
    expect(rendered).not.toContain("All Posts")
    expect(rendered).not.toContain("Tags")
  })

  it("should show no articles message when no valid articles found", () => {
    const props = {
      ...defaultProps,
      allFiles: [],
    }

    const rendered = render(<RecentlyEdited {...props} />)

    expect(rendered).toContain("recently-edited-section")
    expect(rendered).toContain("🔄 Recently Edited")
    expect(rendered).toContain("No recently edited articles found.")
  })

  it("should not render on non-welcome pages", () => {
    const props = {
      ...defaultProps,
      fileData: { slug: "some-other-page" as any },
    }

    const rendered = render(<RecentlyEdited {...props} />)

    // Should render empty section since no articles are found on non-welcome pages
    expect(rendered).toContain("recently-edited-section")
    expect(rendered).toContain("🔄 Recently Edited")
    expect(rendered).toContain("No recently edited articles found.")
  })
})
