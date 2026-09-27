import type { Root, Element as HastElement } from "hast"

import { describe, expect, beforeEach, it } from "@jest/globals"
import { h } from "hastscript"

import { BuildCtx } from "../../../util/ctx"
import { ArticleListPlaceholders } from "../articleListPlaceholders"

describe("ArticleListPlaceholders", () => {
  it("should return a plugin with correct name and htmlPlugins", () => {
    const plugin = ArticleListPlaceholders()
    expect(plugin.name).toBe("ArticleListPlaceholdersTransformer")
    expect(plugin.htmlPlugins).toBeInstanceOf(Function)
    const mockBuildCtx: BuildCtx = {} as BuildCtx
    expect(plugin.htmlPlugins?.(mockBuildCtx)).toHaveLength(1)
    expect(plugin.htmlPlugins?.(mockBuildCtx)[0]).toBeInstanceOf(Function)
  })

  it("should create a transformer function that modifies tree", () => {
    const plugin = ArticleListPlaceholders()
    const mockBuildCtx: BuildCtx = {} as BuildCtx
    const htmlPlugins = plugin.htmlPlugins?.(mockBuildCtx)

    expect(htmlPlugins).toHaveLength(1)
    expect(typeof htmlPlugins?.[0]).toBe("function")

    // Call plugin function to get actual transformer
    const transformerFactory = htmlPlugins?.[0] as () => (tree: Root, file: any) => void
    const transformer = transformerFactory()
    expect(typeof transformer).toBe("function")

    // Test transformer function
    const tree: Root = {
      type: "root",
      children: [h("p", "[[newest-article]]")],
    } as Root

    transformer(tree, {} as any)

    // Verify that placeholder was added
    expect(tree.children[0]).toEqual({
      type: "element",
      tagName: "div",
      properties: {
        id: "newest-article-placeholder",
        className: ["article-list-placeholder"],
      },
      children: [],
    })
  })

  it("should replace [[recently-edited]] placeholder", () => {
    const plugin = ArticleListPlaceholders()
    const mockBuildCtx: BuildCtx = {} as BuildCtx
    const htmlPlugins = plugin.htmlPlugins?.(mockBuildCtx)
    const transformerFactory = htmlPlugins?.[0] as () => (tree: Root, file: any) => void
    const transformer = transformerFactory()

    const tree: Root = {
      type: "root",
      children: [h("p", "[[recently-edited]]")],
    } as Root

    transformer(tree, {} as any)

    expect(tree.children[0]).toEqual({
      type: "element",
      tagName: "div",
      properties: {
        id: "recently-edited-placeholder",
        className: ["article-list-placeholder"],
      },
      children: [],
    })
  })

  it("should not modify paragraphs without placeholders", () => {
    const plugin = ArticleListPlaceholders()
    const mockBuildCtx: BuildCtx = {} as BuildCtx
    const htmlPlugins = plugin.htmlPlugins?.(mockBuildCtx)
    const transformerFactory = htmlPlugins?.[0] as () => (tree: Root, file: any) => void
    const transformer = transformerFactory()

    const originalTree: Root = {
      type: "root",
      children: [h("p", "This is a normal paragraph")],
    } as Root

    transformer(originalTree, {} as any)

    expect(originalTree.children[0]).toEqual({
      type: "element",
      tagName: "p",
      properties: {},
      children: [{ type: "text", value: "This is a normal paragraph" }],
    })
  })
})
