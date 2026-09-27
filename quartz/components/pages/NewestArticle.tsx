import type { QuartzComponent, QuartzComponentProps } from "../types"
import { byPublishedDate } from "../component_utils"
import { createPageListHast } from "../PageList"
import { toJsxRuntime, type Options } from "hast-util-to-jsx-runtime"
import { Fragment, jsx, jsxs } from "preact/jsx-runtime"
import style from "../styles/listPage.scss"

/**
 * Component that displays the newest (most recently published) article
 */
export const NewestArticle: QuartzComponent = (props: QuartzComponentProps) => {
  const { cfg, fileData, allFiles } = props

  // Filter out index pages and sort by published date
  const articles = allFiles.filter((file) => {
    // Skip index-like pages and the current file
    const slug = file.slug
    if (
      !slug ||
      slug === "welcome" ||
      slug === "all-posts" ||
      slug === "tags" ||
      slug === fileData.slug
    ) {
      return false
    }

    // Only include files with valid published dates
    return file.dates?.published && file.frontmatter?.title
  })

  // Sort by published date (newest first) and take only the first one
  const sortedArticles = articles.sort(byPublishedDate(cfg))
  const newestArticle = sortedArticles[0]

  if (!newestArticle) {
    return (
      <div className="popover-hint newest-article-section">
        <article>
          <h3>📰 Newest Article</h3>
          <p>No articles found.</p>
        </article>
      </div>
    )
  }

  // Create a page list with just the newest article
  const pageListHast = createPageListHast(cfg, fileData, [newestArticle], 1)
  const renderedPageList = toJsxRuntime(pageListHast, {
    Fragment,
    jsx,
    jsxs,
  } as Options)

  return (
    <div className="popover-hint newest-article-section">
      <article>
        <h3>📰 Newest Article</h3>
        {renderedPageList}
      </article>
    </div>
  )
}

NewestArticle.css = style
export default NewestArticle
