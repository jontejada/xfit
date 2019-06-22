import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DOMPurify from 'dompurify';
import './style.css';

class App extends Component {
	constructor(props) {
		super(props);

		this.dayNames = ['mon', 'tues', 'wed', 'thurs', 'fri', 'sat 🌞', 'sun'];

		const today = new Date();
		this.days = [];
		for (let i = 0; i < 7; i++) {
			const nextDay = new Date();
			nextDay.setDate(today.getDate() + i);
			this.days.push(nextDay);
		}

		this.state = {
			0: [],
			1: [],
			2: [],
			3: [],
			4: [],
			5: [],
			6: [],
		};
	}

	componentDidMount() {
		this.getWorkouts();
	}

	getWorkouts() {
		const CONDITIONING = 'conditioning';
		const STRENGTH = 'strength';
		const PEAK = 'peak';

		const classDays = [
			[ CONDITIONING, PEAK, STRENGTH ], // mon
			[ CONDITIONING, PEAK, STRENGTH ], // tues
			[ CONDITIONING, PEAK, STRENGTH ], // wed
			[ CONDITIONING, PEAK, STRENGTH ], // thurs
			[ PEAK ], // fri
			[ CONDITIONING, PEAK ], // sat
			[ CONDITIONING, PEAK ], // sun
		];

		this.days.forEach((day) => {
			classDays[day.getDay()].forEach((workout) => {
				this.getAWorkout(day, workout);
			})
		});
	}
	async getAWorkout(day, workout) {
		const urlFragment0 = 'https://app.wodify.com/API/WODs_v1.aspx?apiKey=274jjw066romuea8bxp0a0rew&date=';
		const urlFragment1 = '&type=json&location=Flagship+Upper+Market&program=';
		const progQuery = {
			conditioning: '+Conditioning',
			strength: 'Strength',
			peak: '+Peak'
		};

		const fullUrl = urlFragment0 +
						day.getFullYear() +
						'-' +
						(+day.getMonth() + 1) +
						'-' +
						day.getDate() +
						urlFragment1 +
						progQuery[workout];
		const response = await fetch(fullUrl);
		if (!response.ok) {
			return;
		}
		const json = await response.json();
		if (!json.APIError && json.RecordList && json.RecordList.APIWod) {
			this.setState({
				[day.getDay()]: this.state[day.getDay()].concat({
					cleanHtml: DOMPurify.sanitize(json.RecordList.APIWod.FormattedWOD),
					label: workout,
				})
			});
		}
	}

	render() {
		return (
			<div className="App">
				{this.days.map((day) => {
					const dayIndex = day.getDay();
					const dayName = this.dayNames[dayIndex];
					const daysWorkouts = this.state[dayIndex];
					return (!!daysWorkouts.length &&
						<div key={dayIndex}>
							<h1>{dayName}</h1>
							<ol>
								{this.state[dayIndex].map((workout, i) => {
									return (
										<span key={workout.label + i}>
											<h2>{workout.label}</h2>
											<span dangerouslySetInnerHTML={{ __html: workout.cleanHtml }}></span>
										</span>
									);
								})}
							</ol>
						</div>
					);
				})}
			</div>
		);
	}
}

ReactDOM.render(
	<App/>,
	document.getElementById('app')
	);
