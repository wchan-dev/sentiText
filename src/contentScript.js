// contentScript.js
//

setTimeout(() => {
  const commentDivs = Array.from(
    document.querySelectorAll('div[data-testid="comment"]')
  );
  const texts = commentDivs.map((div) => {
    const pElement = div.querySelector("p"); // Get the <p> element inside the div
    return pElement ? pElement.innerText : ""; // Return the inner text of the <p> element
  });
  chrome.storage.local.set({ allComments: texts }, function () {
    console.log("All comments are stored.");
  });

  // const headers = Array.from(document.getElementsByTagName("h1"));
  // const headersText = headers.map((header) => header.innerText);
  // const threadTitle = headersText[0];

  const url = new URL(window.location.href);
  const parts = url.pathname.split("/");
  const threadTitle = parts[parts.length - 1];

  chrome.storage.local.set({ title: threadTitle }, function () {
    console.log("Saved thread title");
  });
}, 5500);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "analyzeThread") {
    const commentDivs = Array.from(
      document.querySelectorAll('div[data-testid="comment"]')
    );
    const texts = commentDivs.map((div) => {
      const pElement = div.querySelector("p"); // Get the <p> element inside the div
      return pElement ? pElement.innerText : ""; // Return the inner text of the <p> element
    });
    chrome.storage.local.set({ allComments: texts }, function () {
      console.log("All comments are stored.");
    });

    // const headers = Array.from(document.getElementsByTagName("h1"));
    // const headersText = headers.map((header) => header.innerText);
    // const threadTitle = headersText[0];
    const url = new URL(window.location.href);
    const parts = url.pathname.split("/");
    const threadTitle = parts[parts.length - 1];

    chrome.storage.local.set({ title: threadTitle }, function () {
      console.log("Saved thread title");
    });
  }
});
