const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')
const writeStream = fs.createWriteStream('covid.csv')

//Write Headers
writeStream.write(`State Affected,No of Cases,No of Active Cases,No of discharged,No of deaths \n`)

const scrapedData = [];

request('https://covid19.ncdc.gov.ng/', (error, response, html) => {
    if(!error && response.statusCode == 200) {
    const $  = cheerio.load(html);
    
    $("#custom3 > tbody > tr").each((index, element) => {
        if (index === 0) return true;
        const tds = $(element).find("td");

        const state_affected = $(tds[0])
        .text()
        .replace(/\s\s+/g, ' ');

        const no_of_cases = $(tds[1])
        .text()
        .replace(/\s\s+/g, ' ');

        const no_of_active_cases = $(tds[2])
        .text()
        .replace(/\s\s+/g, ' ');

        const no_of_discharged = $(tds[3])
        .text()
        .replace(/\s\s+/g, ' ');

        const no_of_deaths = $(tds[4])
        .text()
        .replace(/\s\s+/g, ' ');

        const tableRow = { state_affected,no_of_cases,no_of_active_cases,no_of_discharged,no_of_deaths };
        scrapedData.push(tableRow);

        //Write to CSV
        writeStream.write(`${state_affected},${no_of_cases},${no_of_active_cases},${no_of_discharged},${no_of_deaths} \n`);
    });

    console.log('Scraping done...');
    }
})