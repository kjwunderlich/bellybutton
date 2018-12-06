function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var url = `/metadata/${sample}`;
    d3.json(url).then(function(sample) {
      var sample_metadata = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    sample_metadata.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
  Object.entries(sample).forEach(function ([key, value]) {
    var row = sample_metadata.append("p");
    row.text(`${key}: ${value} \n`);
  });
    });
  }
function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then(function(data){
    var labels = [];
    var values = [];
    var hovers = [];

    for(i = 0; i < 10; i++) {

      var label = data.otu_ids[i];
      labels.push(label);

      var value = data.sample_values[i];
      values.push(value);

      var hover = data[label - 1];
      hovers.push(hover);
      
    };

    var trace = {

      values: values,
      type: "pie",
      text: data.otu_labels,
      hoverinfo: "label+text+value+percent",
      textinfo: "percent"
    };
    var data = [trace];
    var layout = {

      margin: {
        left: 20,
        right: 50, 
        bottom: 100, 
        pad: 4
      },

    };
    Plotly.newPlot("pie", data, layout);      

  });
    // @TODO: Build a Bubble Chart using the sample data
  var url2 = `/samples/${sample}`;
  d3.json(url2).then(function(data) {

    var otuIDs = data.otu_ids;
    var samplevalues = data.sample_values;

    var trace2 = {
      x: data.otu_ids,
      y: data.sample_values,
      mode: 'markers',
      type: 'scatter',
      text: data.otu_labels,
      marker: {
        size: data.sample_values,
        symbol: "circle",
        color: otuIDs, 
        colorscale: "Rainbow"  
      },
    };

    var data2 = [trace2];
    Plotly.newPlot('bubble', data2);
    });
    
    }
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();