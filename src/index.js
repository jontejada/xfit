import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DOMPurify from 'dompurify';
import './style.css';

const DAY = 'day';
const WORKOUT = 'workout';
const CONDITIONING = 'conditioning';
const PERFORMANCE = 'performance';
const STRENGTH = 'strength';
const PEAK = 'peak';

const getWorkouts = () => {
	const urlFragment0 = 'https://app.wodify.com/API/WODs_v1.aspx?apiKey=274jjw066romuea8bxp0a0rew&date=';
	const urlFragment1 = '&type=json&location=Flagship+Upper+Market&program=';

	const prog = {
		[CONDITIONING]: 'F+%7C+Conditioning',
		// [PERFORMANCE]: 'F+%7C+Performance',
		[STRENGTH]: 'F+%7C+Strength+Development',
		[PEAK]: '+Peak'
	}
	const classDays = [
		[ CONDITIONING, PEAK ], // sun
		[ CONDITIONING, PEAK, STRENGTH ], // mon
		[ CONDITIONING, PEAK, STRENGTH ], // tues
		[ CONDITIONING, PEAK, STRENGTH ], // wed
		[ CONDITIONING, PEAK, STRENGTH ], // thurs
		[ PEAK ], // fri
		[ CONDITIONING, PEAK ], // sat
	];

	const today = new Date();
	const week = [];

	for (let i = 0; i < 8; i++) {
		const day = new Date();
		day.setDate(today.getDate() + i)
		week.push(day);
	}

	const promises = [];

	const workoutsForDay = (day) => {
		promises.push({
			type: DAY,
			value: day.getDay()
		});
		const classList = classDays[day.getDay()];
		classList.forEach((classString) => {
			const fetchClass = fetch(`${urlFragment0}${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}${urlFragment1}${prog[classString]}`)
				.then(res => Promise.all([classString, res.json()]));
			promises.push(fetchClass);
		});
	};

	week.forEach((day) => {
		workoutsForDay(day);
	});

	return Promise.all(promises);
};

const cleanWorkoutData = (data) => {
	const cleanedData = [];
	for (let i = 0; i < data.length; i++) {
		const entry = data[i];
		if (entry.type === DAY) {
			cleanedData.push({
				type: entry.type,
				value: ['sun', 'mon', 'tues', 'wed', 'thurs', 'fri', 'sat 🌞'][entry.value] 
			});
		} else {
			if (entry[1].APIError) continue;
			if (entry[1].RecordList && entry[1].RecordList.APIWod) {
				cleanedData.push({
					type: WORKOUT,
					label: entry[0],
					value: DOMPurify.sanitize(entry[1].RecordList.APIWod.FormattedWOD)
				});
			}
		}
	}

	return cleanedData;
};

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [],
		};
	}

	componentDidMount() {
		getWorkouts().then(data => this.setState({ data: cleanWorkoutData(data) }));
		return;
		// sessionStorage for testing w/o blasting the endpoint
		const saved = sessionStorage.getItem('xfit');
		if (saved) {
			this.setState({ data: JSON.parse(saved) });
		} else {
			getWorkouts().then(data => {
				const saveMe = cleanWorkoutData(data);
				sessionStorage.setItem('xfit', JSON.stringify(saveMe));
				this.setState({ data: saveMe });
			});

		}
	}

	render() {
		return (
			<div className="App">
				{this.state.data.map((cleanEntry, i) => {
					let el;
					if (cleanEntry.type === DAY) {
						el = <h1 key={i}>{cleanEntry.value}</h1>;
					} else if (cleanEntry.type === WORKOUT) {
						el = <span key={i}>
							<h2>{cleanEntry.label}</h2>
							<span dangerouslySetInnerHTML={{ __html: cleanEntry.value }}></span>
						</span>;
					}
					return el;
				})}
			</div>
		);
	}
}

ReactDOM.render(
	<App/>,
	document.getElementById('app')
	);
