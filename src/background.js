chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "1",
    title: 'Analyze "%s"',
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "1") {
    const selectedText = info.selectionText;
    // send the selected text to the React app
    chrome.storage.local.set({ selectedText });
  }
});
