import React from "react"

import notFoundStyle from "../styles/404.scss"
import { QuartzComponent, QuartzComponentConstructor } from "../types"

const NotFound: QuartzComponent = () => {
  return (
    <article className="popover-hint">
      <div id="not-found-div">
        <div>
          <h1>404</h1>
          <p>
            That page doesn’t exist. <br />
          </p>
        </div>

        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRdQcPi9MjHtZVejjQudWlRcaahiha4jbh4A&s"
          id="trout-reading"
          className="no-select"
          alt="An empty tomb"
        />
      </div>
    </article>
  )
}
NotFound.css = notFoundStyle

export default (() => NotFound) satisfies QuartzComponentConstructor
