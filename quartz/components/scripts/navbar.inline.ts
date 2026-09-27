import { setupDarkMode } from "./darkmode"
import { setupHamburgerMenu } from "./hamburgerMenu"
import { setupScrollHandler } from "./scrollHandler"
import { setupSearch } from "./search"

// Initial setup
setupDarkMode()
setupHamburgerMenu()
setupSearch()
setupScrollHandler()

// Re-run setup functions after SPA navigation
document.addEventListener("nav", () => {
  // No video setup needed for GIF
})
