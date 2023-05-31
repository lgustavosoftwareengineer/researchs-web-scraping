const puppeteer = require("puppeteer");
const fs = require("fs");

async function getResearchGateArticles() {
  const SEARCH_STRING = encodeURIComponent(
    `(bdd OR "behavior driven development") AND (agile OR scrum OR kanban OR "extreme programming" OR xp)`
  );

  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  await page.goto(
    `https://www.researchgate.net/search/publication?q=${SEARCH_STRING}&page=1`
  );

  await page.waitForSelector(
    ".nova-legacy-e-link.nova-legacy-e-link--color-inherit.nova-legacy-e-link--theme-bare"
  );

  const articles = [];

  const articlesRecovered = await getArticlesFromAPage(page);
  articles.push(...articlesRecovered);

  await wait(2000);

  const FINAL_PAGE = 11;
  for (let i = 2; i < FINAL_PAGE; i++) {
    i !== FINAL_PAGE &&
      (await page.goto(
        `https://www.researchgate.net/search/publication?q=${SEARCH_STRING}&page=${i}`
      ));
    await wait(2000);

    const articlesRecoveredFromNextPage = await getArticlesFromAPage(page);
    articles.push(...articlesRecoveredFromNextPage);
  }

  const csv = generateCSV(articles);

  fs.writeFile("researchGate/researchGateArticles.csv", csv, (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });

  await browser.close();
}

async function getArticlesFromAPage(page) {
  await page.waitForSelector(
    ".nova-legacy-e-link.nova-legacy-e-link--color-inherit.nova-legacy-e-link--theme-bare"
  );

  return await page.evaluate(() => {
    const TRASH = [
      "Source",
      "<img ",
      "Terms",
      "Privacy",
      "Copyright",
      "Imprint",
    ];
    const RESEARCH_GATE_URL = "https://www.researchgate.net/";

    return Array.from(
      document.querySelectorAll(
        ".nova-legacy-e-link.nova-legacy-e-link--color-inherit.nova-legacy-e-link--theme-bare"
      ),
      (element) => {
        const articleTitle = element.innerHTML;
        const articleLink = RESEARCH_GATE_URL + element.getAttribute("href");

        if (TRASH.includes(articleTitle) || articleTitle.startsWith("<img ")) {
          return;
        }

        return {
          articleTitle,
          articleLink,
        };
      }
    ).filter(Boolean);
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
    let row = rowArray.join(",");
    csvContent += row + "\n";
  });

  return csvContent;
}

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

function generateCSV(articlesParams = []) {
  const articles = [
    { articleTitle: "articleTitle", articleLink: "articleLink" },
    ...articlesParams,
  ];

  const newArticles = articles.map((element) => Object.values(element));

  let csvContent = "";

  newArticles.forEach(function (rowArray) {
    let row = rowArray.join("!");
    csvContent += row + "\n";
  });

  return csvContent;
}

module.exports = { getResearchGateArticles };
