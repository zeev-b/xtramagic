# XtraMagic

## Purpose
This extension adds extra information to the stock table at [Magic Formula Investing Stock Screener 
site](https://www.magicformulainvesting.com/).

## Background
In 2005, Joel Greenblatt published a book that is considered one of the classics of finance literature. In The 
Little Book That Beats the Market – a New York Times bestseller with over 300,000 copies in print – Greenblatt explains 
how investors can systematically apply a formula that seeks out good businesses when they are available at bargain prices.
On the [Magic Formula Investing site](https://www.magicformulainvesting.com), users can access a free and simple stock 
screening tool to select Magic Formula stocks, as described in Joel Greenblatt's book The Little Book That Beats the 
Market.

## What it does
The XtraMagic extension adds more information for each stock that is listed in the [stock screener table](https://www.magicformulainvesting.com/Screening/StockScreening).
The site's table shows the following columns: Company Name, Ticker, Market Cap, Price From and Most Recent Quarter Data.
The extension will add the following columns: EY, ROIC, Ev/Gp and Industry
* EY - [Earnings Yield](https://www.investopedia.com/terms/e/earningsyield.asp)
* ROIC - [Return on Invested Capital](https://www.investopedia.com/terms/r/returnoninvestmentcapital.asp)
* Ev/Gp - [EV/Gross Profit Ratio](https://corporatefinanceinstitute.com/resources/valuation/ev-gross-profit-ratio/)
* Industry - the company's industry

Greenblatt's Magic Formula uses both EY and ROIC to filter stocks. Ev/Gp is used by others to further filter value stocks.
Industry can be used to help diversify the investment.

### Important Notice
This extension utilizes data from the Yahoo Finance free API. Please note that the data provided is subject to the 
terms and limitations set by Yahoo Finance. The availability, accuracy, and timeliness of the data may vary. 
We recommend using this extension for informational purposes only and conducting additional research before making any 
investment decisions. For more information on the data source and its terms of use, please refer to Yahoo Finance's 
documentation. Thank you for using our extension!

### Attribution for boilerplate:
[Fresh Chrome Extension (Manifest V3)](https://github.com/llagerlof/fresh-chrome-extension) was used as a starting point for this extension.
