const log = console.log;
const templates = require('templates');
const chalk = require('chalk');
const app = templates();
const fs = require('fs');

const LAYOUT_FILE_PATH = './templates/layout.hbs';
const OUTPUT_FILE_PATH = 'index.html';

function readFromFile(fileName) {
	return fs.readFileSync(fileName, 'utf8')
}

function getObjFromFile(fileName) {
	return JSON.parse(readFromFile(fileName));
}

function writeToFile(fileName, content) {
	fs.writeFileSync(fileName, content, 'utf8');
}

function stylizeCategories(data) {
	data.categories.forEach((category, i) => {
		category.style = i % 2 === 0 ? 'is-gray' : 'is-bold';
	});

	return data;
}

app.engine('html', require('engine-handlebars'));

// create a template collection 
app.create('pages');

// add a template to the collection 
app.page(OUTPUT_FILE_PATH, {
	content: readFromFile(LAYOUT_FILE_PATH)
});

let templateData = {
	categories: [
		getObjFromFile('data/tools.json'),
		getObjFromFile('data/blog.json'),
		getObjFromFile('data/libraries.json'),
		// getObjFromFile('data/misc.json'),
		getObjFromFile('data/contacts.json')
	]
};

templateData = stylizeCategories(templateData);
// render it 
app.render(OUTPUT_FILE_PATH, templateData,
	(err, view) => {
		if (err !== null) {
			log(err)
			process.exit(2)
		}
		if (fs.existsSync(OUTPUT_FILE_PATH)) {			
			fs.unlinkSync(OUTPUT_FILE_PATH);
		}
		writeToFile(OUTPUT_FILE_PATH, view.content);
		log(chalk.green(`File ${chalk.bold.white(OUTPUT_FILE_PATH)} generated...`));
	}
);
