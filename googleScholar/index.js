const puppeteer = require("puppeteer");
const fs = require("fs");

async function getGoogleScholarArticles() {
  const SEARCH_STRING = `intitle:(bdd OR "behavior driven development" OR "behavior-driven development") AND intitle:(agile OR scrum OR kanban OR "extreme programming" OR xp) AND intitle:(implementation OR adoption OR impact OR benefits OR challenges OR engagements) ext:pdf`;

  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  await page.goto(
    `https://scholar.google.com/scholar?as_vis=1&q=${encodeURIComponent(
      SEARCH_STRING
    )}&hl=en&as_sdt=0,5&as_ylo=2018&as_yhi=2023`
  );

  const searchResultSelector = ".gs_rt";
  await page.waitForSelector(searchResultSelector);

  const articles = [];

  const articlesRecovered = await getArticlesFromAPage(page);
  articles.push(...articlesRecovered);

  await autoScroll(page);

  const FINAL_PAGE = 12;
  for (let i = 1; i <= FINAL_PAGE; i++) {
    await autoScroll(page);

    i !== 13 &&
      (await page.click('button[type="button"][aria-label="Next"].gs_btnPR'));
    await wait(2000);

    const articlesRecoveredFromNextPage = await getArticlesFromAPage(page);
    articles.push(...articlesRecoveredFromNextPage);
  }

  const csv = generateCSV(articles);

  fs.writeFile("googleScholar/googleScholarArticles.csv", csv, (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });

  await browser.close();
}

async function getArticlesFromAPage(page) {
  await page.waitForSelector(".gs_rt");

  return await page.evaluate(() =>
    Array.from(document.querySelectorAll(".gs_rt"), (element) => {
      const contentIndex = element.children.length - 1;

      const articleTitle = element.children[contentIndex].innerHTML;
      const articleLink = element.children[contentIndex].getAttribute("href");

      return {
        articleTitle,
        articleLink,
      };
    })
  );
}
function generateCSV(articlesParams = []) {
  const articles = [
    { articleTitle: "articleTitle", articleLink: "articleLink" },
    ...articlesParams,
  ];

  const newArticles = articles.map((element) => Object.values(element));

  let csvContent = "";

  newArticles.forEach(function (rowArray) {
    let row = rowArray.join(",");
    csvContent += row + "\n";
  });

  return csvContent;
}

const wait = (ms) => new Promise((res) => setTimeout(res, ms));
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve(null);
        }
      }, 100);
    });
  });
}
function generateCSV(articlesParams = []) {
  const articles = [
    { articleTitle: "articleTitle", articleLink: "articleLink" },
    ...articlesParams,
  ];

  const newArticles = articles.map((element) => Object.values(element));

  let csvContent = "";

  newArticles.forEach(function (rowArray) {
    let row = rowArray.join(";");
    csvContent += row + "\n";
  });

  return csvContent;
}

module.exports = { getGoogleScholarArticles };
