const path = require("path");
const util = require("util");

console.log("Starting...");
const request = require("request");
const cheerio = require("cheerio");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const csvPath = path.join(
	__dirname,
	"data",
	"csv",
	`temp-${Math.floor(new Date() / 1000)}.csv`
);
const csvRecords = [];
const csvWriter = createCsvWriter({
	path: csvPath,
	header: [
		{ id: "image", title: "image" },
		{ id: "title", title: "title" },
		{ id: "description", title: "description" },
		{ id: "price", title: "price" }
	]
});

const requestPromise = util.promisify(request);
requestPromise("https://webscraper.io/test-sites/e-commerce/allinone")
	.then(response => {
		if (response.statusCode == 200) {
			const html = response.body;
			const $ = cheerio.load(html);
			$(".thumbnail").each((index, element) => {
				const image = $(element)
					.find(".img-responsive")
					.attr("src");
				console.log(image);

				const title = $(element)
					.find(".title")
					.attr("title");

				const description = $(element)
					.find(".description")
					.text();

				const price = $(element)
					.find(".price")
					.text();

				console.log(image, title, description, price);
				csvRecords.push({
					image: image,
					title: title,
					description: description,
					price: price
				});
			});
			console.log(csvPath);
			console.log(csvRecords);
			csvWriter.writeRecords(csvRecords).then(() => {
				console.log("...Done");
			});
		} else console.log("Request failed!");
	})
	.catch(err => {
		console.log("Error", err);
	});
