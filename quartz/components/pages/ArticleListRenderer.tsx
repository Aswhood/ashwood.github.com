import type { QuartzComponent, QuartzComponentProps } from "../types"
import NewestArticle from "./NewestArticle"
import RecentlyEdited from "./RecentlyEdited"

/**
 * Component that renders article lists for the index page
 * This component is designed to be included in the page layout for the welcome page
 */
export const ArticleListRenderer: QuartzComponent = (props: QuartzComponentProps) => {
  const { fileData } = props

  // Only render on the index (welcome) page
  if (fileData.slug !== "welcome") {
    return null
  }

  return (
    <>
      <div id="newest-article-placeholder">
        <NewestArticle {...props} />
      </div>
      <div id="recently-edited-placeholder">
        <RecentlyEdited {...props} />
      </div>
    </>
  )
}

export default ArticleListRenderer
