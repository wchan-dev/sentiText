import React, { useEffect, useState } from "react";
import * as vader from "vader-sentiment";

function App() {
  const [selectedText, setSelectedText] = useState("");
  const [sentiment, setSentiment] = useState("");

  useEffect(() => {
    chrome.storage.local.get(["selectedText"], function(result) {
      setSelectedText(result.selectedText || "");
      const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(
        result.selectedText
      );
      setSentiment(intensity);
    });
  }, []);

  return (
    <div>
      <p>Selected text: {selectedText}</p>
      <p>Sentiment Results: </p>
      <ul>
        {Object.entries(sentiment).map(([key, value]) => (
          <li key={key}>
            {key}: {value}
          </li>
        ))}
      </ul>
      {/* rest of your component */}
    </div>
  );
}

export default App;
