import type { QuartzComponent, QuartzComponentProps } from "../types"
import { byModifiedDate } from "../component_utils"
import { createPageListHast } from "../PageList"
import { toJsxRuntime, type Options } from "hast-util-to-jsx-runtime"
import { Fragment, jsx, jsxs } from "preact/jsx-runtime"
import style from "../styles/listPage.scss"

/**
 * Component that displays the 3 most recently edited articles
 */
export const RecentlyEdited: QuartzComponent = (props: QuartzComponentProps) => {
  const { cfg, fileData, allFiles } = props

  // Filter out index pages and the current file
  const articles = allFiles.filter((file) => {
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

    // Only include files with valid modified dates and titles
    return file.dates?.modified && file.frontmatter?.title
  })

  // Sort by modified date (newest first) and take the top 3
  const sortedArticles = articles.sort(byModifiedDate(cfg)).slice(0, 3)

  if (sortedArticles.length === 0) {
    return (
      <div className="popover-hint recently-edited-section">
        <article>
          <h3>🔄 Recently Edited</h3>
          <p>No recently edited articles found.</p>
        </article>
      </div>
    )
  }

  // Create a page list with the recently edited articles
  const pageListHast = createPageListHast(cfg, fileData, sortedArticles, 3)
  const renderedPageList = toJsxRuntime(pageListHast, {
    Fragment,
    jsx,
    jsxs,
  } as Options)

  return (
    <div className="popover-hint recently-edited-section">
      <article>
        <h3>🔄 Recently Edited</h3>
        {renderedPageList}
      </article>
    </div>
  )
}

RecentlyEdited.css = style
export default RecentlyEdited
