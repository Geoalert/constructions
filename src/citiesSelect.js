export function createCitiesSelect(nodeId, cities) {
  console.log("create select");
  const select = d3
    .select(nodeId)
    .append("select")
    .attr("class", "cities-select")
    .attr("name", "cities");

  select
    .selectAll("option")
    .data(cities)
    .enter()
    .append("option")
    .text(d => d.description)
    .attr("value", d => d.name);
  return select;
}
