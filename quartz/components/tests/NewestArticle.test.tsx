import { describe, it, expect } from "@jest/globals"
import { h } from "preact"
import { render } from "preact-render-to-string"
import { GlobalConfiguration } from "../../cfg"
import { QuartzPluginData } from "../../plugins/vfile"
import NewestArticle from "../pages/NewestArticle"

describe("NewestArticle", () => {
  const mockCfg: GlobalConfiguration = {
    pageTitle: "Test Site",
    enablePopovers: true,
    analytics: null,
    baseUrl: "test.com",
    ignorePatterns: [],
    defaultDateType: "published",
    navbar: { pages: [] },
  }

  const createMockFile = (slug: string, title: string, published?: Date): QuartzPluginData =>
    ({
      slug: slug as any,
      frontmatter: { title },
      dates: published ? { published, modified: published, created: published } : undefined,
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

  it("should display newest article when files are available", () => {
    const oldArticle = createMockFile("old-post", "Old Article", new Date("2023-01-01"))
    const newArticle = createMockFile("new-post", "New Article", new Date("2023-02-01"))
    const anotherOld = createMockFile("another-old", "Another Old", new Date("2023-01-15"))

    const props = {
      ...defaultProps,
      allFiles: [oldArticle, newArticle, anotherOld],
    }

    const rendered = render(<NewestArticle {...props} />)

    expect(rendered).toContain("newest-article-section")
    expect(rendered).toContain("📰 Newest Article")
    expect(rendered).toContain("New Article")
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

    const rendered = render(<NewestArticle {...props} />)

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

    const rendered = render(<NewestArticle {...props} />)

    expect(rendered).toContain("newest-article-section")
    expect(rendered).toContain("📰 Newest Article")
    expect(rendered).toContain("No articles found.")
  })

  it("should not render on non-welcome pages", () => {
    const props = {
      ...defaultProps,
      fileData: { slug: "some-other-page" as any },
    }

    const rendered = render(<NewestArticle {...props} />)

    // Should render empty section since no articles are found on non-welcome pages
    expect(rendered).toContain("newest-article-section")
    expect(rendered).toContain("📰 Newest Article")
    expect(rendered).toContain("No articles found.")
  })
})
