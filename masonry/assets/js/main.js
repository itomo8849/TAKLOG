const resizeMasonryItem = (element, itemWrapper) => {
  const item = itemWrapper.firstChild;
  if (!item) return;

  const rowSize = parseInt(getComputedStyle(element).gridAutoRows, 10);
  const gapSize = parseInt(getComputedStyle(element).rowGap, 10);
  const itemSize = isWritingModeVertical(element)
    ? item.getBoundingClientRect().width
    : item.getBoundingClientRect().height;
  const rowSpan = Math.ceil((itemSize + gapSize) / (rowSize + gapSize));

  itemWrapper.style.gridRowEnd = `span ${rowSpan}`;
};

const initializeMasonry = (element) => {
  const items = Array.from(element.children);

  const resizeObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      requestAnimationFrame(() => {
        const target = entry.target;
        resizeMasonryItem(element, target);
      });
    });
  });

  items.forEach((item) => {
    const itemWrapper = document.createElement("div");
    element.insertBefore(itemWrapper, item);
    itemWrapper.appendChild(item);
    resizeObserver.observe(itemWrapper);
  });
};

const isWritingModeVertical = (element) => {
  const { writingMode } = getComputedStyle(element);
  return writingMode.includes("vertical") || writingMode.includes("sideways");
};

document.addEventListener("DOMContentLoaded", () => {
  const target = document.querySelector(".masonry");
  if (target) initializeMasonry(target);
});
