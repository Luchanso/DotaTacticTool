var isDotaBuff = /dotabuff.com/.test(location.origin);
var isHeroesPage = location.pathname == '/heroes';

var heroes = [];

if (!isDotaBuff || !isHeroesPage) {
	throw('This script work only on dotabuff.com/heroes');
}

var urlLib_jquery = 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js';

function loadScript(url, callback)
{
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;

	script.onreadystatechange = callback;
	script.onload = callback;

	head.appendChild(script);
}

loadScript(urlLib_jquery, main);

function main() {
	var heroDiv = $('.hero-grid a');

	for (var i = 0; i < heroDiv.length; i++) {
		var link = location.origin + heroDiv.eq(i).attr('href') + '/matchups';
		var name = heroDiv.eq(i).children().children('.name').text();

		heroes.push({
			link: link,
			name: name,
		});
	}

	parse(heroes);
}

function parse(heroes) {
	var complete = 0;

	//for (var hero in heroes) {
	for (var i = 0; i < heroes.length / 10; i++) {
		var link = heroes[i].link;
		var name = heroes[i].name;

		$.ajax({
			url: link,
			context: i
		}).done(function(html) {
			console.log(this);
				var enemies = getEnemies(html);
				heroes[i].enemies = enemies;
				console.log(i);
				console.log(heroes[i]);

				console.log("Complete: " + Math.round(((++complete) / heroes.length) * 100) + " %");
		});
		//return;
	}
}

/**
 * Возращает таблицу с играми героя против других героев
 * @param  {[type]} link [description]
 * @return {[type]}      [description]
 */
function getEnemies(html) {
		html = $.parseHTML(html);

		var table = $(html).find('tbody');
		var rows = table.children();
		var enemies = [];

		for (var i = 0; i < rows.length; i++) {
			var item = rows.eq(i).children();
			var enemie = {};

			enemie.icon = item.eq(0).find('img').attr('src');
			enemie.name = item.eq(1).text();
			enemie.win = parseFloat(item.eq(2).text().replace(/%/, '')) / 100;
			enemie.games = parseInt(item.eq(3).text());

			enemies.push(enemie);
		}

		return enemies;
}
