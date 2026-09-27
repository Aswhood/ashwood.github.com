import { useEffect, useRef } from "preact/hooks";
import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "./types";

const Giscus: QuartzComponent = (props: QuartzComponentProps) => {
  const { fileData } = props;
  const ref = useRef<HTMLDivElement>(null);

  // Don't show comments on certain pages
  const shouldShowComments = () => {
    const slug = fileData.slug;
    const filePath = fileData.filePath;

    // Exclude index, about, projects, and other non-blog pages
    const excludedPages = ["index", "about", "projects", "posts", "tags"];
    const isExcluded = excludedPages.some((page) => slug?.includes(page));

    // Only show on actual content pages (not list pages)
    const isContentPage =
      filePath?.includes(".md") && !filePath?.includes("index.md");

    // Check frontmatter for explicit comments control
    const frontmatterComments = fileData.frontmatter?.comments;
    const commentsEnabled = frontmatterComments !== false; // Default to true unless explicitly false

    return !isExcluded && isContentPage && commentsEnabled;
  };

  useEffect(() => {
    // Only run on client-side
    if (typeof window === "undefined") return;
    if (!shouldShowComments() || !ref.current) return;

    console.log("Giscus: Loading comments for:", fileData.slug);

    // Clear any existing giscus elements
    const existingScripts = document.querySelectorAll("script[src*='giscus']");
    existingScripts.forEach((script) => script.remove());

    // Clear container
    ref.current.innerHTML = "";

    // Create giscus script
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";

    // Set data attributes
    script.setAttribute("data-repo", "BillyBobCox/billybobcox.github.com");
    script.setAttribute("data-repo-id", "R_kgDOQXx6ZQ");
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "DIC_kwDOQXx6Zc4CyBFP");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", "preferred_color_scheme");
    script.setAttribute("data-lang", "en");
    script.setAttribute("data-loading", "lazy");

    script.onerror = () => {
      console.error("Giscus: Failed to load script");
      if (ref.current) {
        ref.current.innerHTML = `
          <div style="padding: 20px; border: 1px solid #ccc; background-color: #f8f8f8; border-radius:4px; text-align: center;">
            <p>💬 Comments powered by GitHub Discussions</p>
            <p style="font-size: 0.9em; color: #666;">
              Unable to load comments. 
              <a href="https://github.com/BillyBobCox/billybobcox.github.com/discussions" target="_blank" rel="noopener noreferrer">
                View discussions on GitHub
              </a>
            </p>
          </div>
        `;
      }
    };

    script.onload = () => {
      console.log("Giscus: Script loaded successfully");
    };

    // Add script to body instead of head
    document.body.appendChild(script);
  }, [fileData.slug]);

  return (
    <div className="giscus-container">
      <div ref={ref} className="giscus" />
    </div>
  );
};

export default (() => Giscus) satisfies QuartzComponentConstructor;
