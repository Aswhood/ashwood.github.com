import { type Parent, type Text, type Element } from "hast"
import { renderToString } from "katex"
import { titleCase } from "title-case"

import { applyTextTransforms } from "../plugins/transformers/formatting_improvement_html"
import { replaceSCInNode } from "../plugins/transformers/tagSmallcaps"
import { type GlobalConfiguration } from "../cfg"
import { type QuartzPluginData } from "../plugins/vfile"
import { locale } from "./constants"

export const sessionStoragePondVideoKey = "pond-video-timestamp"
export const pondVideoId = "pond-video"

export function formatTitle(title: string): string {
  // Replace single quotes with double quotes for consistency
  title = title.replace(/( |^)'/g, '$1"').replace(/'([ ?!.]|$)/g, '"$1')
  title = applyTextTransforms(title)

  // Convert title to title case
  title = titleCase(title, { locale })
  return title
}

/**
 * Processes small caps in the given text and adds it to the parent node.
 * @param text - The text to process.
 * @param parent - The parent node to add the processed text to.
 */
export function processSmallCaps(text: string, parent: Parent): void {
  const textNode = { type: "text", value: text } as Text
  parent.children.push(textNode)
  replaceSCInNode(textNode, [parent])
}

/**
 * Renders inline code as a code block.
 * @param text - The text to process.
 * @param parent - The parent node to add the processed text to.
 */
export function processInlineCode(text: string, parent: Parent): void {
  const codeBlock = {
    type: "element",
    tagName: "code",
    properties: { className: ["inline-code"] },
    children: [{ type: "text", value: text }],
  } as Element
  parent.children.push(codeBlock)
}

/**
 * Processes LaTeX content and adds it to the parent node as a KaTeX-rendered span.
 * @param latex - The LaTeX content to process.
 * @param parent - The parent node to add the processed LaTeX to.
 */
export function processKatex(latex: string, parent: Parent): void {
  const html = renderToString(latex, { throwOnError: false })
  const katexNode: Element = {
    type: "element",
    tagName: "span",
    properties: { className: ["katex-toc"] },
    children: [{ type: "raw", value: html }],
  } as Element
  parent.children.push(katexNode)
}

/**
 * Wraps text in a span for arrows.
 * @param text The text to process (assumed to be an arrow).
 * @param parent The parent node to add the processed text to.
 */
export function processTextWithArrows(text: string, parent: Parent): void {
  const arrowSpan: Element = {
    type: "element",
    tagName: "span",
    properties: { className: ["monospace-arrow"] },
    children: [{ type: "text", value: text }],
  }
  parent.children.push(arrowSpan)
}

/**
 * Comparison function for sorting files by published date (newest first)
 *
 * @param cfg - Global configuration object containing locale settings
 * @returns A comparison function that sorts by published date in descending order
 */
export function byPublishedDate(
  cfg: GlobalConfiguration,
): (f1: QuartzPluginData, f2: QuartzPluginData) => number {
  return (f1, f2) => {
    if (f1.dates && f2.dates) {
      const date1 = f1.dates.published
      const date2 = f2.dates.published
      if (!date1 || !date2) {
        // If either date is missing, sort by title
        const f1Title = f1.frontmatter?.title?.toLowerCase() ?? ""
        const f2Title = f2.frontmatter?.title?.toLowerCase() ?? ""
        return f1Title.localeCompare(f2Title, locale)
      }
      const timeDiff = date2.getTime() - date1.getTime()
      if (timeDiff !== 0) {
        return timeDiff
      }
      // If dates are equal, sort by title
      const f1Title = f1.frontmatter?.title?.toLowerCase() ?? ""
      const f2Title = f2.frontmatter?.title?.toLowerCase() ?? ""
      return f1Title.localeCompare(f2Title, locale)
    } else if (f1.dates && !f2.dates) {
      return -1
    } else if (!f1.dates && f2.dates) {
      return 1
    }

    // If no published dates, sort lexographically by title
    const f1Title = f1.frontmatter?.title?.toLowerCase() ?? ""
    const f2Title = f2.frontmatter?.title?.toLowerCase() ?? ""
    return f1Title.localeCompare(f2Title, locale)
  }
}

/**
 * Comparison function for sorting files by modified date (newest first)
 *
 * @param cfg - Global configuration object containing locale settings
 * @returns A comparison function that sorts by modified date in descending order
 */
export function byModifiedDate(
  cfg: GlobalConfiguration,
): (f1: QuartzPluginData, f2: QuartzPluginData) => number {
  return (f1, f2) => {
    if (f1.dates && f2.dates) {
      const date1 = f1.dates.modified
      const date2 = f2.dates.modified
      if (!date1 || !date2) {
        // If either date is missing, sort by title
        const f1Title = f1.frontmatter?.title?.toLowerCase() ?? ""
        const f2Title = f2.frontmatter?.title?.toLowerCase() ?? ""
        return f1Title.localeCompare(f2Title, locale)
      }
      const timeDiff = date2.getTime() - date1.getTime()
      if (timeDiff !== 0) {
        return timeDiff
      }
      // If dates are equal, sort by title
      const f1Title = f1.frontmatter?.title?.toLowerCase() ?? ""
      const f2Title = f2.frontmatter?.title?.toLowerCase() ?? ""
      return f1Title.localeCompare(f2Title, locale)
    } else if (f1.dates && !f2.dates) {
      return -1
    } else if (!f1.dates && f2.dates) {
      return 1
    }

    // If no modified dates, sort lexographically by title
    const f1Title = f1.frontmatter?.title?.toLowerCase() ?? ""
    const f2Title = f2.frontmatter?.title?.toLowerCase() ?? ""
    return f1Title.localeCompare(f2Title, locale)
  }
}
