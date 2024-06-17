const initializeTabs = (root, firstView = 1) => {
  if (!root) return;

  const tablist = root.querySelector('[role="tablist"]');
  const tabs = root.querySelectorAll('[role="tab"]');
  const tabpanels = root.querySelectorAll('[role="tabpanel"]');

  if (!tablist || tabs.length === 0 || tabpanels.length === 0) return;

  const currentIndex = Math.max(0, firstView - 1);

  setTabAttributes(tabs, tabpanels);
  activateTab(tabs, tabpanels, currentIndex);

  tabs.forEach((tab, index) => {
    tab.addEventListener(
      "click",
      (event) => handleClick(event, tabs, tabpanels, index),
      false
    );
    tab.addEventListener(
      "keyup",
      (event) => handleKeyNavigation(event, tabs, tabpanels, index, tablist),
      false
    );
  });

  tabpanels.forEach((panel) => {
    panel.addEventListener(
      "beforematch",
      (event) => handleBeforeMatch(event, tabs, tabpanels),
      true
    );
  });
};

// タブとタブパネルに必要な属性を設定する関数
const setTabAttributes = (
  tabs,
  tabpanels
) => {
  tabs.forEach((tab, index) => {
    tab.setAttribute("aria-selected", "false");
    tab.setAttribute("aria-controls", tabpanels[index].id);
    tab.setAttribute("tabindex", "-1");
  });
};

// アクティブなタブを切り替える関数
const activateTab = (
  tabs,
  tabpanels,
  index
) => {
  tabs.forEach((tab, i) => {
    const isSelected = i === index;
    tab.setAttribute("aria-selected", String(isSelected));
    tab.setAttribute("tabindex", isSelected ? "0" : "-1");
  });

  tabpanels.forEach((tabpanel, i) => {
    if (i !== index) {
      tabpanel.setAttribute("hidden", "until-found");
      tabpanel.removeAttribute("tabindex");
    } else {
      tabpanel.removeAttribute("hidden");
      tabpanel.setAttribute("tabindex", "0");
    }
  });
};

// クリックイベントを扱う関数
const handleClick = (
  event,
  tabs,
  tabpanels,
  index
) => {
  event.preventDefault();
  activateTab(tabs, tabpanels, index);
};

// キーボードナビゲーションを扱う関数
const handleKeyNavigation = (
  event,
  tabs,
  tabpanels,
  currentIndex,
  tablist
) => {
  const orientation = tablist.getAttribute("aria-orientation") || "horizontal";

  const keyActions = {
    [orientation === "vertical" ? "ArrowUp" : "ArrowLeft"]: () =>
      currentIndex - 1 >= 0 ? currentIndex - 1 : tabs.length - 1,
    [orientation === "vertical" ? "ArrowDown" : "ArrowRight"]: () =>
      (currentIndex + 1) % tabs.length,
    Home: () => 0,
    End: () => tabs.length - 1
  };

  const action = keyActions[event.key];

  if (action) {
    event.preventDefault();
    const newIndex = action();
    tabs[newIndex].focus();
    activateTab(tabs, tabpanels, newIndex);
  }
};

// beforematchイベントを扱う関数
const handleBeforeMatch = (
  event,
  tabs,
  tabpanels
) => {
  const panel = event.currentTarget;
  const tabIndex = [...tabpanels].indexOf(panel);

  if (tabIndex !== -1) {
    activateTab(tabs, tabpanels, tabIndex);
  }
};

const target = document.getElementById("js-tabs");

initializeTabs(target);
