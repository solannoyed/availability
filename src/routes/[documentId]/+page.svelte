<script lang="ts">
	import {
		endOfWeek,
		startOfWeek,
		type Interval,
		eachMinuteOfInterval,
		eachDayOfInterval,
		endOfDay,
		addDays,
		addMinutes,
		addHours,
		getDay,
		areIntervalsOverlapping,
		addWeeks,
		differenceInCalendarWeeks
	} from 'date-fns';

	let duration = 30;

	const dayFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'long' });
	const timeFormatter = new Intl.DateTimeFormat(undefined, { timeStyle: 'short' });

	const now = new Date();
	const week: Interval = {
		start: startOfWeek(now),
		end: endOfWeek(now)
	};
	const day: Interval = {
		start: week.start,
		end: endOfDay(week.start)
	};

	type Availability = {
		interval: Interval;
		availability: number; // 0 (unavailable) / 1 (invonvenient) / 2 (preferred) / 3 (ideal)
	};
	const events: Availability[] = [
		{
			interval: {
				start: new Date(Date.UTC(2024, 0, 27, 1, 15)),
				end: new Date(Date.UTC(2024, 0, 28, 9, 30))
			},
			availability: 1
		},
		{
			interval: {
				start: new Date(Date.UTC(2024, 0, 18, 0, 45)),
				end: new Date(Date.UTC(2024, 0, 19, 1, 45))
			},
			availability: 2
		}
	];

	for (const event of events) {
		event.interval.start = addWeeks(
			event.interval.start,
			differenceInCalendarWeeks(now, event.interval.start)
		);
		event.interval.end = addWeeks(
			event.interval.end,
			differenceInCalendarWeeks(now, event.interval.end)
		);
		if (getDay(event.interval.start) <= getDay(event.interval.end)) continue;
		events.push({
			interval: {
				start: week.start,
				end: event.interval.end
			},
			availability: event.availability
		});
		event.interval.end = week.end as Date;
	}

	function getAvailability(day: number, hour: number, minute: number): string {
		const date = addMinutes(addHours(addDays(week.start as Date, day), hour), minute);
		const interval: Interval = {
			start: date,
			end: addMinutes(date, duration)
		};
		for (const event of events) {
			if (areIntervalsOverlapping(interval, event.interval)) return `${event.availability}`;
		}
		return '';
	}
</script>

<!-- <select bind:value={duration}>
	{#each [15, 30] as duration}
		<option>{duration}</option>
	{/each}
</select> -->

<table>
	<thead>
		<th></th>
		{#each eachDayOfInterval(week) as day}
			<th>{dayFormatter.format(day)}</th>
		{/each}
	</thead>
	<tbody>
		{#each eachMinuteOfInterval(day, { step: duration }) as time}
			<tr>
				<th>{timeFormatter.format(time)}</th>
				{#each eachDayOfInterval(week) as day}
					<td>{getAvailability(day.getDay(), time.getHours(), time.getMinutes())}</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
