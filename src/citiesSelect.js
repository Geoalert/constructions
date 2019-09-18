export function createCitiesSelect(cities) {
  const select = d3
    .select("#city-select")
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
