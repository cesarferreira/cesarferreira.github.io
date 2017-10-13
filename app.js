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

app.engine('html', require('engine-handlebars'));

// create a template collection 
app.create('pages');

// add a template to the collection 
app.page(OUTPUT_FILE_PATH, {
	content: readFromFile(LAYOUT_FILE_PATH)
});

const renderObj = {
	blog: getObjFromFile('data/blog.json'),
	education: getObjFromFile('data/education.json'),
	libraries: getObjFromFile('data/libraries.json'),
	misc: getObjFromFile('data/misc.json'),
	tools: getObjFromFile('data/tools.json'),
	contacts: getObjFromFile('data/contacts.json')
}

// render it 
app.render(OUTPUT_FILE_PATH, renderObj,
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
