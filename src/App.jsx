import React, { useEffect, useState } from "react";

function App() {
  const [selectedText, setSelectedText] = useState("");

  useEffect(() => {
    chrome.storage.local.get(["selectedText"], function(result) {
      setSelectedText(result.selectedText || "");
    });
  }, []);

  return (
    <div>
      <p>Selected text: {selectedText}</p>
      {/* rest of your component */}
    </div>
  );
}

export default App;
