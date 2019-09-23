import { DEBUG } from "./constants";

export default domNodeId => {
  const legendNode = d3.select(`#${domNodeId}`);
  if (DEBUG) console.log("create legend");
  return {
    legendNode,
    update(legend) {
      this.legendNode
        .selectAll("div")
        .data(legend, d => d.name)
        .join(enter => {
          const legendItem = enter.append("div");
          legendItem
            .append("div")
            .classed("swatch-color", true)
            .style("background-color", d => d.color);
          legendItem.append("div").text(d => d.name);
        });
    },
    remove() {
      this.legendNode.selectAll("div").remove();
    }
  };
};
