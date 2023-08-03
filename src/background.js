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

chrome.webNavigation.onCompleted.addListener(
  function (details) {
    // Perform extraction only for the main frame (ignoring iframes)
    const url = new URL(window.location.href);
    const parts = url.pathname.split("/");
    const threadTitle = parts[parts.length - 1];

    chrome.storage.local.set({ title: threadTitle }, function () {
      console.log("Saved thread title");
    });

    if (details.frameId === 0) {
      chrome.scripting
        .executeScript({
          target: { tabId: details.tabId },
          files: ["src/contentScript.js"],
        })
        .then(() => {
          chrome.tabs.reload(details.tabId);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
  { url: [{ urlMatches: "https://www.reddit.com/r/*" }] }
); // replace this URL match pattern to the website domain you are scraping
