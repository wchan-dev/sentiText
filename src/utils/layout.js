export function populateLayout(
  textColor,
  bgColor,
  plotTitle,
  xAxisTitle,
  yAxisTitle
) {
  const layout = {
    autosize: true,
    showlegend: true,
    plot_bgcolor: bgColor,
    paper_bgcolor: bgColor,
    barmode: "stack",
    font: {
      family: "Inter, sans-serif",
      size: 12,
      color: textColor,
      bold: true,
    },
    title: {
      text: plotTitle,
      font: {
        size: 14, // Increased font size
        color: textColor,
        family: "Arial, sans-serif",
        bold: true, // Made text bold
      },
      // x: 0.5,
      y: 0.88, // Moved title further from plot
      // xanchor: "center",
      // yanchor: "top",
    },
    xaxis: {
      title: xAxisTitle,
      showgrid: false,
      zeroline: true,
      autorange: true,
      showticklabels: false,
    },
    yaxis: {
      title: yAxisTitle,
      font: {
        bold: true,
      },
      showline: false,
    },
    startangle: 180,
  };

  return layout;
}
