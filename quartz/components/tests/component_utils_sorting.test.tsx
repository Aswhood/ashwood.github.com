import { describe, it, expect } from "@jest/globals"
import { GlobalConfiguration } from "../../cfg"
import { byPublishedDate, byModifiedDate } from "../component_utils"
import { QuartzPluginData } from "../../plugins/vfile"

describe("component_utils sorting functions", () => {
  const mockCfg: GlobalConfiguration = {
    pageTitle: "Test Site",
    enablePopovers: true,
    analytics: null,
    baseUrl: "test.com",
    ignorePatterns: [],
    defaultDateType: "published",
    navbar: { pages: [] },
  }

  const createMockFile = (title: string, published?: Date, modified?: Date): QuartzPluginData =>
    ({
      slug: `test-${title.toLowerCase().replace(/\s+/g, "-")}` as any,
      frontmatter: { title },
      dates: published || modified ? { published, modified, created: new Date() } : undefined,
    }) as any

  describe("byPublishedDate", () => {
    it("should sort files by published date in descending order", () => {
      const file1 = createMockFile("First", new Date("2023-01-01"))
      const file2 = createMockFile("Second", new Date("2023-02-01"))
      const file3 = createMockFile("Third", new Date("2023-03-01"))

      const sorted = [file1, file2, file3].sort(byPublishedDate(mockCfg))

      expect(sorted[0].frontmatter?.title).toBe("Third")
      expect(sorted[1].frontmatter?.title).toBe("Second")
      expect(sorted[2].frontmatter?.title).toBe("First")
    })

    it("should prioritize files with published dates over files without", () => {
      const fileWithDate = createMockFile("With Date", new Date("2023-01-01"))
      const fileWithoutDate = createMockFile("Without Date")

      const sorted = [fileWithoutDate, fileWithDate].sort(byPublishedDate(mockCfg))

      expect(sorted[0].frontmatter?.title).toBe("With Date")
      expect(sorted[1].frontmatter?.title).toBe("Without Date")
    })

    it("should sort alphabetically when published dates are equal", () => {
      const sameDate = new Date("2023-01-01")
      const fileA = createMockFile("Alpha", sameDate)
      const fileB = createMockFile("Beta", sameDate)

      const sorted = [fileB, fileA].sort(byPublishedDate(mockCfg))

      expect(sorted[0].frontmatter?.title).toBe("Alpha")
      expect(sorted[1].frontmatter?.title).toBe("Beta")
    })
  })

  describe("byModifiedDate", () => {
    it("should sort files by modified date in descending order", () => {
      const file1 = createMockFile("First", undefined, new Date("2023-01-01"))
      const file2 = createMockFile("Second", undefined, new Date("2023-02-01"))
      const file3 = createMockFile("Third", undefined, new Date("2023-03-01"))

      const sorted = [file1, file2, file3].sort(byModifiedDate(mockCfg))

      expect(sorted[0].frontmatter?.title).toBe("Third")
      expect(sorted[1].frontmatter?.title).toBe("Second")
      expect(sorted[2].frontmatter?.title).toBe("First")
    })

    it("should prioritize files with modified dates over files without", () => {
      const fileWithDate = createMockFile("With Date", undefined, new Date("2023-01-01"))
      const fileWithoutDate = createMockFile("Without Date")

      const sorted = [fileWithoutDate, fileWithDate].sort(byModifiedDate(mockCfg))

      expect(sorted[0].frontmatter?.title).toBe("With Date")
      expect(sorted[1].frontmatter?.title).toBe("Without Date")
    })

    it("should sort alphabetically when modified dates are equal", () => {
      const sameDate = new Date("2023-01-01")
      const fileA = createMockFile("Alpha", undefined, sameDate)
      const fileB = createMockFile("Beta", undefined, sameDate)

      const sorted = [fileB, fileA].sort(byModifiedDate(mockCfg))

      expect(sorted[0].frontmatter?.title).toBe("Alpha")
      expect(sorted[1].frontmatter?.title).toBe("Beta")
    })
  })
})
