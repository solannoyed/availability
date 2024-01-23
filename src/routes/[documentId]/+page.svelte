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
		availability: 0 | 1 | 2 | 3; // 0 (unavailable) / 1 (invonvenient) / 2 (available) / 3 (preferred)
	};
	const events: Availability[] = [
		{
			interval: {
				start: new Date(Date.UTC(2024, 0, 1, 1, 15)),
				end: new Date(Date.UTC(2024, 0, 1, 9, 30))
			},
			availability: 0
		},
		{
			interval: {
				start: new Date(Date.UTC(2024, 0, 2, 0, 45)),
				end: new Date(Date.UTC(2024, 0, 2, 1, 45))
			},
			availability: 1
		},
		{
			interval: {
				start: new Date(Date.UTC(2024, 0, 3, 0, 45)),
				end: new Date(Date.UTC(2024, 0, 3, 1, 45))
			},
			availability: 2
		},
		{
			interval: {
				start: new Date(Date.UTC(2024, 0, 4, 0, 45)),
				end: new Date(Date.UTC(2024, 0, 4, 1, 45))
			},
			availability: 3
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

	type CellColour =
		| 'td-unavailable'
		| 'td-inconvenient'
		| 'td-available'
		| 'td-available'
		| 'td-preferred'
		| 'td-past'
		| '';
	function getAvailability(day: number, hour: number, minute: number): CellColour {
		const date = addMinutes(addHours(addDays(week.start as Date, day), hour), minute);
		const interval: Interval = {
			start: date,
			end: addMinutes(date, duration)
		};
		for (const event of events) {
			if (!areIntervalsOverlapping(interval, event.interval)) continue;
			switch (event.availability) {
				case 0:
					return 'td-unavailable';
				case 1:
					return 'td-inconvenient';
				case 2:
					return 'td-available';
				case 3:
					return 'td-preferred';
			}
		}
		return date < now ? 'td-past' : '';
	}
</script>

<!-- <select bind:value={duration}>
	{#each [15, 30] as duration}
		<option>{duration}</option>
	{/each}
</select> -->

<table class="table table-xs">
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
					<td class={getAvailability(day.getDay(), time.getHours(), time.getMinutes())}></td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
