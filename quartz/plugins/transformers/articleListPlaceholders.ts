import { type Element, type Root } from "hast"
import { h } from "hastscript"
import { visit } from "unist-util-visit"
import { VFile } from "vfile"

import { type QuartzTransformerPlugin } from "../types"

/**
 * Transforms special syntax like [[newest-article]] and [[recently-edited]]
 * into placeholder divs that will be populated by the ArticleListRenderer component
 */
function articleListTransform(tree: Root, _file: VFile) {
  visit(tree, "element", (node: Element) => {
    if (node.tagName === "p") {
      const textContent = node.children
        .filter((child) => child.type === "text")
        .map((child) => (child as any).value)
        .join("")

      // Check for [[newest-article]] syntax
      if (textContent.includes("[[newest-article]]")) {
        const placeholder = h("div", {
          id: "newest-article-placeholder",
          className: "article-list-placeholder",
        })
        // Replace the entire paragraph with the placeholder
        Object.assign(node, placeholder)
        return false // Stop traversing this branch
      }

      // Check for [[recently-edited]] syntax
      if (textContent.includes("[[recently-edited]]")) {
        const placeholder = h("div", {
          id: "recently-edited-placeholder",
          className: "article-list-placeholder",
        })
        // Replace the entire paragraph with the placeholder
        Object.assign(node, placeholder)
        return false // Stop traversing this branch
      }
    }
    return true
  })
}

// skipcq: JS-D1001
export const ArticleListPlaceholders: QuartzTransformerPlugin = () => {
  return {
    name: "ArticleListPlaceholdersTransformer",
    htmlPlugins: () => [() => articleListTransform],
  }
}
