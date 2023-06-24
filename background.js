// event to run content-script.js content when extension's button is clicked
chrome.action.onClicked.addListener(execScript);

async function execScript() {
  const tabId = await getTabId();
  chrome.scripting.executeScript({
    target: {tabId: tabId},
    files: ['content-script.js']
  })
}

async function getTabId() {
  const tabs = await chrome.tabs.query({active: true, currentWindow: true});
  return (tabs.length > 0) ? tabs[0].id : null;
}

chrome.runtime.onMessage.addListener(
    function(request, sender, responseCallback) {
      console.log('got message');
      if (request.contentScriptQuery === 'queryTicker') {
        console.log('got queryTicker message')
        getTickerData(request.ticker, responseCallback);
        return true;
        //sendResponse({hello:'world'});
      }
    });


function getTickerData(ticker, responseCallback) {
  console.log("ticker", ticker);
  const modules = ["defaultKeyStatistics", "summaryDetail", "financialData", "balanceSheetHistory", "summaryProfile"];
  const modulesParam = modules.join("%2C");

  const url = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${ticker.toLowerCase()}?modules=${modulesParam}`
  //https://query2.finance.yahoo.com/v10/finance/quoteSummary/%s?modules=%s
  // https://github.com/gadicc/node-yahoo-finance2/blob/devel/docs/modules/quoteSummary.md#assetProfile
  fetch(url)
      .then(response => response.json())
      .then(response => parseYahooFinanceQuote(response))
      .then(data => responseCallback(data));
      // .then(data => console.log(data));
      // .catch(error => ...)
}

function parseYahooFinanceQuote(response) {
    const data = response?.quoteSummary?.result?.[0];
    const grossProfits = data.financialData.grossProfits.raw;
    const ev = data.defaultKeyStatistics.enterpriseValue.raw;
    const evGp = getRatio(ev, grossProfits);
    const industry = data.summaryProfile.industry;
    // const earningsPerShare = data.defaultKeyStatistics.trailingEps.raw;
    // const stockPrice = data.price.regularMarketPrice.raw;

    let earningsYield = "N/A";
    const pe = data.summaryDetail.trailingPE;
    if(pe) {
        let peRaw = pe.raw;
        earningsYield = getRatio(1, peRaw);
    }

    let roc = "N/A";
    const balanceSheetData = data.balanceSheetHistory.balanceSheetStatements[0];
    const totalAssets = balanceSheetData.totalAssets?.raw;
    const totalLiabilities = balanceSheetData.totalLiab?.raw;
    const ebitda = data.financialData.ebitda.raw;
    if(totalAssets && totalLiabilities){
        const tangibleCapitalEmployed = totalAssets - totalLiabilities;
        roc = getRatio(ebitda, tangibleCapitalEmployed);
    }

    return {
        "pe": data.summaryDetail.trailingPE,
        "ey": earningsYield,
        "fpe": data.summaryDetail.forwardPE,
        "roc": roc,
        "evGp": evGp,
        "industry" : industry
    };
}

function getRatio(numerator, denominator) {
    let res = "N/A";
    if(denominator && denominator > 0) {
        res = numerator / denominator;
        res = res.toFixed(2);
    }
    return res;
}

/*
var url = 'https://another-site.com/price-query?itemId=' +
    encodeURIComponent(request.itemId);
fetch(url)
    .then(response => response.text())
    .then(text => parsePrice(text))
    .then(price => sendResponse(price))
    .catch(error => ...)
return true;  // Will respond asynchronously.*/


/*

//// background.js ////
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content-script.js']
  });
});*/
