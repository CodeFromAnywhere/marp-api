import { useEffect } from "react";
/**
 * To create a horizontal draggable div, put a div into your code in between two other divs like this:
 *


`<Div className="w-1 bg-green-600" id="horizontalDraggable"></Div>`


Inspired by https://htmldom.dev/create-resizable-split-views/
\*/
export const useHorizontalDraggableDiv = (isEnabled?: boolean) =>
useEffect(() => {
if (!isEnabled) {
return;
}
// Query the element
const resizer = document.getElementById(
"horizontalDraggable"
) as HTMLDivElement | null;
if (!resizer) {
return;
}

    const leftSide = resizer.previousElementSibling as HTMLDivElement | null;
    const rightSide = resizer.nextElementSibling as HTMLDivElement | null;
    if (!leftSide || !rightSide) {
      return;
    }

    // The current position of mouse
    let x = 0;
    let y = 0;

    // Width of left side
    let leftWidth = 0;

    const mouseMoveHandler = function (e: MouseEvent) {
      // How far the mouse has been moved
      const dx = e.clientX - x;
      const dy = e.clientY - y;

      leftSide.style.userSelect = "none";
      leftSide.style.pointerEvents = "none";

      rightSide.style.userSelect = "none";
      rightSide.style.pointerEvents = "none";

      if (!resizer.parentNode) {
        return;
      }

      const newLeftWidth =
        ((leftWidth + dx) * 100) /
        (resizer.parentNode as Element).getBoundingClientRect().width;
      leftSide.style.width = `${newLeftWidth}%`;
    };

    const mouseUpHandler = function () {
      leftSide.style.removeProperty("user-select");
      leftSide.style.removeProperty("pointer-events");

      rightSide.style.removeProperty("user-select");
      rightSide.style.removeProperty("pointer-events");

      // Remove the handlers of `mousemove` and `mouseup`
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
    };
    // Handle the mousedown event
    // that's triggered when user drags the resizer
    const mouseDownHandler = function (e: MouseEvent) {
      // Get the current mouse position
      x = e.clientX;
      y = e.clientY;
      leftWidth = leftSide.getBoundingClientRect().width;

      // Attach the listeners to `document`
      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
    };

    // Attach the handler
    resizer.addEventListener("mouseenter", () => {
      document.body.style.cursor = "col-resize";
    });
    resizer.addEventListener("mouseleave", () => {
      document.body.style.removeProperty("cursor");
    });

    resizer.addEventListener("mousedown", mouseDownHandler);

}, [isEnabled]);