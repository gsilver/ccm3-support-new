var calculateDepth = function(subaccountList){
  var depthCalculated = [];
  _.each(subaccountList, function(subaccount){

  });
};

function unquote(value) {
    if (value.charAt(0) == '"' && value.charAt(value.length - 1) == '"') return value.substring(1, value.length - 1);
    return value;
}

// Parse a Link header
function parseLinkHeader(header) {
    var linkexp = /<[^>]*>\s*(\s*;\s*[^\(\)<>@,;:"\/\[\]\?={} \t]+=(([^\(\)<>@,;:"\/\[\]\?={} \t]+)|("[^"]*")))*(,|$)/g;
    var paramexp = /[^\(\)<>@,;:"\/\[\]\?={} \t]+=(([^\(\)<>@,;:"\/\[\]\?={} \t]+)|("[^"]*"))/g;

    var matches = header.match(linkexp);
    var rels = new Object();
    for (i = 0; i < matches.length; i++) {
        var split = matches[i].split('>');
        var href = split[0].substring(1);
        var ps = split[1];
        var link = new Object();
        link.href = href;
        var s = ps.match(paramexp);
        for (j = 0; j < s.length; j++) {
            var p = s[j];
            var paramsplit = p.split('=');
            var name = paramsplit[0];
            link[name] = unquote(paramsplit[1]);
        }

        if (link.rel != undefined) {
            rels[link.rel] = link;
        }
    }
    return rels;
}

function downloadCSVFile(data) {
  // credit: http://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
  var csvContent = "data:text/csv;charset=utf-8,";
  data.forEach(function(infoArray, index) {
    dataString = infoArray.join(",");
    csvContent += index < data.length ? dataString + "\n" : dataString;
  });
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", outputFilename);
  document.body.appendChild(link); // Required for FF
  // delay to give impression of processing file
  setTimeout(function() {
    link.click(); // This will download the data file
    var $outputMessage = $('<div></div>')
      .hide()
      .append('<div><b>Output: </b>' + outputFilename + '</div>')
      .append('<div class="mpathways" style="padding-top: 10px;font-size: 40px;"><a href="https://csprod.dsc.umich.edu/services/faculty/" target="_blank">Upload to Faculty Center <i class="glyphicon glyphicon-upload"></i></a></div>')
      .appendTo($fileInfo)
      .fadeIn();
  }, 800);
}
