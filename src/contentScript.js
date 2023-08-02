// contentScript.js
const paragraphs = Array.from(document.getElementsByTagName("p"));
const texts = paragraphs.map((p) => p.innerText);

chrome.storage.local.set({ allComments: texts }, function() {
  console.log("All comments are stored.");
});

const headers = Array.from(document.getElementsByTagName("h1"));
const headersText = headers.map((header) => header.innerText);
const threadTitle = headersText[0];

chrome.storage.local.set({ title: threadTitle }, function() {
  console.log("Saved thread title");
});
