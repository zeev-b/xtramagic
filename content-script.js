// this file will be loaded when the extension's button is clicked
(function() {
  console.log('content-script.js executed');
  if (alreadyRunning()) {
      return;
  }
  const tableformDiv = document.getElementById("tableform");
  if (tableformDiv !== null) {
    console.log('tableformDiv',tableformDiv);

    // make the table wider
    const div1 = document.querySelector("#content > div:nth-child(1) > div:nth-child(2)")
    if (div1) { div1.style.width = "85%"; }
    const div2 = document.querySelector("#content > div:nth-child(1) > div:nth-child(1)")
    if (div2) { div2.style.width = "15%"; }


    addHeader("P/E");
    addHeader("EY");
    addHeader("ROC");
    addHeader("Ev/Gp");
    addHeader("Industry");

    const tableEl = tableformDiv?.getElementsByTagName("table")?.[0];
    const tbodyEl = tableEl?.getElementsByTagName("tbody")?.[0];
    //let trElements = tbodyEl?.getElementsByTagName("tr");
    const queryPromises = [];
    tbodyEl.querySelectorAll("tr")
        .forEach((trEl) => {
            //console.log(trEl);
            const tdElements = trEl?.getElementsByTagName("td");
            const ticker = tdElements?.[1]?.innerHTML;
            const queryPromise = new Promise((r, j) => {
                chrome.runtime.sendMessage(
                    {contentScriptQuery: 'queryTicker', ticker: ticker},
                    (res) => {
                        console.log('res', res);
                        trEl.append(newTd(res?.pe?.fmt));
                        trEl.append(newTd(res?.ey));
                        trEl.append(newTd(res?.roc));
                        trEl.append(newTd(res?.evGp));
                        trEl.append(newTd(res?.industry));

                        r(1);
                    });
            });
            queryPromises.push(queryPromise);
        });
    // after all values received, create the CSV button/link
    Promise.all(queryPromises).then(value => {
        const tableArr = convertTableToArray(tableEl);
        const aEl = getCSVLinkElement(tableArr);
        const button = document.createElement("button");
        button.appendChild(aEl);

        const reportDiv = document.getElementById("report");
        const reportH1 = reportDiv.getElementsByTagName("h1")?.[0];

        // // Add CSS styles to the button
        button.style.animation = "myAnimation 5s";
        button.style.borderRadius = "5px";
        button.style.backgroundColor = "lightblue";
        button.style.borderWidth = "thin";



        // Create a style tag for the animation
        const style = document.createElement("style");
        style.innerHTML = `
              @keyframes myAnimation {
                0% { transform: scale(1); }
                25% { transform: scale(1.1); }
                50% { transform: scale(1); }
                75% { transform: scale(1.1); }
                100% { transform: scale(1); }
              }
            `;

        // Append the style and button to the document
        document.head.appendChild(style);
        reportH1.after(button);
    });
  } else {
    console.log('tableformDiv is null');
  }
})();

function alreadyRunning() {
    const markerId = "magic_marker";
    if (document.getElementById(markerId)) {
        return true;
    }
    const reportDiv = document.getElementById("report");
    const markerSpanEl = document.createElement("span");
    markerSpanEl.setAttribute("id",markerId);
    reportDiv.appendChild(markerSpanEl);
    return false;
}

function newTd(text) {
    const tdEl = document.createElement("td")
    tdEl.setAttribute("align","center");
    tdEl.innerHTML = text === undefined ? "N/A" : text;
    return tdEl;
}

function addHeader(text) {
    const tableDiv = document.getElementById("tableform");
    if(tableDiv) {
      const tableEl = tableDiv?.getElementsByTagName("table")?.[0];
      const theadEl = tableEl?.getElementsByTagName('thead')?.[0];
      const trEl = theadEl?.getElementsByTagName('tr')?.[0];
      const thEl = document.createElement("th");
      const h2El = document.createElement("h2");
      h2El.innerHTML = text;
      thEl.append(h2El);
      trEl.append(thEl);
    }
}

function convertTableToArray(tableEl) {
    const tableArray = [];

    const header = [];
    const theadEl = tableEl?.getElementsByTagName('thead')?.[0];
    theadEl.querySelectorAll("tr th h2").forEach((h2El) => header.push(h2El.textContent) );

    tableArray.push(header);

    const tbodyEl = tableEl?.getElementsByTagName("tbody")?.[0];
    tbodyEl.querySelectorAll("tr")
        .forEach((trEl) => {
            const row = [];
            const tdCollection = trEl.querySelectorAll("td");
            tdCollection.forEach((tdEl) => {
                const value = tdEl.textContent;
                row.push(value.includes(',') ? `"${value}"`: value)
            });
            tableArray.push(row);
        });
    return tableArray;
}

function getCSVLinkElement(arr){
    const link = document.createElement("a");
    link.textContent = "CSV export";
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().replace(/[-:]/g, "").replace(/[TZ.]/g, "");
    link.download = "magic"+formattedDate+".csv";
    const csv = arr.map(function(v){return v.join(',')}).join('\n');
    link.href = encodeURI("data:text/csv,"+csv);
    return link;
}

//var el = getCSVLinkElement([['num','sq'],[2,4],[3,9]]);
//document.body.appendChild(el);

function appendButton(elementId, text) {
  let buttonEl = document.createElement("button");
  buttonEl.innerHTML = text;
  document.getElementById(elementId).prepend(buttonEl);
  buttonEl.addEventListener('click', function () {
    chrome.runtime.sendMessage(
        {contentScriptQuery: 'queryTicker', ticker: 'aso'},
        (res) => {
          console.log('res ---> ', res);
        });
  });
}
//#content > div:nth-child(1) > div:nth-child(1) ---> width:15%
//#content > div:nth-child(1) > div:nth-child(2) ---> width:85%



