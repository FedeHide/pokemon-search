const searchInput = document.getElementById('search-input') as HTMLInputElement;
const dropdown = document.getElementById('dropdown') as HTMLDivElement;
const dataContainer = document.getElementById('data-container') as HTMLDivElement;
const suggestionsList = document.getElementById('suggestionsList') as HTMLUListElement;
const searchBtn = document.getElementById('search-button') as HTMLButtonElement;
const sprite = document.getElementById('sprite') as HTMLDivElement;
const pokeNameId = document.getElementById('pokemon-name-id') as HTMLHeadingElement;
const pokeTypes = document.getElementById('types') as HTMLParagraphElement;
const pokeWeight = document.getElementById('weight') as HTMLParagraphElement;
const pokeHeight = document.getElementById('height') as HTMLParagraphElement;
const pokeHp = document.getElementById('hp') as HTMLTableCellElement;
const pokeAttack = document.getElementById('attack') as HTMLTableCellElement;
const pokeDefense = document.getElementById('defense') as HTMLTableCellElement;
const pokeSpecialAttack = document.getElementById('special-attack') as HTMLTableCellElement;
const pokeSpecialDefense = document.getElementById('special-defense') as HTMLTableCellElement;
const pokeSpeed = document.getElementById('speed') as HTMLTableCellElement;
const pokeTotalStats = document.getElementById('total') as HTMLTableCellElement;
const statBars = document.querySelectorAll('.stats__barchart-bar') as NodeListOf<HTMLDivElement>;

interface pokeType {
	type: { name: string; url: string };
}

interface pokeStats {
	base_stat: number;
}

interface pokemonDb {
	name: string;
}

// filter dropdown
searchInput.addEventListener('input', async () => {
	const pokeNameOrId: string = searchInput.value.trim().toLocaleLowerCase();
	const dbRes: Response = await fetch(`https://pokeapi-proxy.freecodecamp.rocks/api/pokemon`);
	const dbData = await dbRes.json();
	let suggestionsCount = 0;
	suggestionsList.innerHTML = '';

	if (pokeNameOrId.length > 0) {
		dbData.results.forEach((pokemon: pokemonDb) => {
			if (suggestionsCount < 3 && pokemon.name.startsWith(pokeNameOrId)) {
				const suggestionItem = document.createElement('li');
				suggestionItem.textContent = pokemon.name;
				suggestionItem.classList.add('suggestion');
				suggestionsCount++;

				suggestionItem.addEventListener('click', () => {
					searchInput.value = pokemon.name;
					suggestionsList.innerHTML = '';
					getPokemon();
				});
				suggestionsList.appendChild(suggestionItem);
			}
		});
		dropdown.style.display = 'block';
		dataContainer.style.marginTop = '2rem';
	} else {
		dropdown.style.display = 'none';
		dataContainer.style.marginTop = '5rem';
	}

	let suggestionsLi = document.querySelectorAll(
		'.suggestions-list li',
	) as NodeListOf<HTMLLIElement>;
	// navigate suggestions
	let index = 0;
	document.addEventListener('keydown', (event) => {
		switch (event.key) {
			case 'ArrowDown':
				if (index === 0 && suggestionsLi.length > 0) {
					suggestionsLi[index].classList.add('highlight');
					let selectedValue = suggestionsLi[index].innerText;
					searchInput.value = selectedValue;
					index++;
				} else if (index > 0 && index < suggestionsLi.length) {
					suggestionsLi[index - 1].classList.remove('highlight');
					suggestionsLi[index].classList.add('highlight');
					let selectedValue = suggestionsLi[index].innerText;
					searchInput.value = selectedValue;
					index++;
				}
				break;
			case 'ArrowUp':
				if (index > 1 && index <= suggestionsLi.length) {
					suggestionsLi[index - 1].classList.remove('highlight');
					index--;
					let selectedValue = suggestionsLi[index - 1].innerText;
					searchInput.value = selectedValue;
					suggestionsLi[index - 1].classList.add('highlight');
				} else if (index === 1) {
					suggestionsLi[index - 1].classList.remove('highlight');
					index--;
				}
				break;
			case 'Enter':
				index = 0;
				break;
		}
	});
	index = 0;
	suggestionsLi = document.querySelectorAll('.suggestions-list li') as NodeListOf<HTMLLIElement>;
});

async function getPokemon() {
	try {
		const pokeNameOrId: string = searchInput.value.trim().toLocaleLowerCase();
		const res: Response = await fetch(
			`https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${pokeNameOrId}`,
		);
		const data = await res.json();

		sprite.innerHTML = `<img src="${data.sprites.front_default}" alt="${data.name} sprite">`;
		pokeNameId.textContent = `${data.name}  #${data.id}`;
		pokeTypes.textContent = data.types
			.map((el: pokeType) => `${el.type.name.toUpperCase()}`)
			.join(' / ');
		pokeWeight.textContent = `${data.weight / 10}Kg`;
		pokeHeight.textContent = `${data.height / 10}m`;

		//set stats
		pokeHp.textContent = data.stats[0].base_stat;
		pokeAttack.textContent = data.stats[1].base_stat;
		pokeDefense.textContent = data.stats[2].base_stat;
		pokeSpecialAttack.textContent = data.stats[3].base_stat;
		pokeSpecialDefense.textContent = data.stats[4].base_stat;
		pokeSpeed.textContent = data.stats[5].base_stat;
		pokeTotalStats.textContent = data.stats.reduce((acc: number, el: pokeStats) => {
			return acc + el.base_stat;
		}, 0);

		for (let i = 0; i < 6; i++) {
			if (data.stats[i].base_stat >= 1 && data.stats[i].base_stat <= 30) {
				statBars[i].classList.add('rank1');
				statBars[i].style.width = `${data.stats[i].base_stat / 2}%`;
			} else if (data.stats[i].base_stat >= 31 && data.stats[i].base_stat <= 60) {
				statBars[i].classList.add('rank2');
				statBars[i].style.width = `${data.stats[i].base_stat / 2}%`;
			} else if (data.stats[i].base_stat >= 61 && data.stats[i].base_stat <= 90) {
				statBars[i].classList.add('rank3');
				statBars[i].style.width = `${data.stats[i].base_stat / 2}%`;
			} else if (data.stats[i].base_stat >= 91 && data.stats[i].base_stat <= 120) {
				statBars[i].classList.add('rank4');
				statBars[i].style.width = `${data.stats[i].base_stat / 2}%`;
			} else if (data.stats[i].base_stat >= 121 && data.stats[i].base_stat <= 150) {
				statBars[i].classList.add('rank5');
				statBars[i].style.width = `${data.stats[i].base_stat / 2}%`;
			} else if (data.stats[i].base_stat >= 151) {
				statBars[i].classList.add('rank6');
				statBars[i].style.width = `${data.stats[i].base_stat / 2}%`;
			}
		}
	} catch (err) {
		// alert('Pokémon not found');
		// console.log(`Pokémon not found: ${err}`);
	}
}

// close dropdown when clicks out
document.addEventListener('click', (event: MouseEvent) => {
	if (!dropdown.contains(event.target as Node) && event.target !== searchInput) {
		dropdown.style.display = 'none';
		dataContainer.style.marginTop = '5rem';
	}
});

// close dropdown when 'enter'
searchInput.addEventListener('keydown', (e) => {
	if (e.key === 'Enter') {
		dropdown.style.display = 'none';
		dataContainer.style.marginTop = '5rem';
	}
});

// enter and click listeners for input
searchBtn.addEventListener('click', getPokemon);

searchInput.addEventListener('keydown', (e) => {
	if (e.key === 'Enter') {
		getPokemon();
		searchInput.value = '';
	}
});

document.addEventListener('DOMContentLoaded', async () => {
	searchInput.value = 'bulbasaur';
	getPokemon();
	searchInput.value = '';
});

// prevent caret default behavior on key down and up
searchInput.addEventListener('keydown', function (event) {
	if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
		event.preventDefault();
	}
});
