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

	export let data;
	for (const event of data.availability.events) {
		event.interval.start = addWeeks(
			event.interval.start,
			differenceInCalendarWeeks(now, event.interval.start)
		);
		event.interval.end = addWeeks(
			event.interval.end,
			differenceInCalendarWeeks(now, event.interval.end)
		);
		if (getDay(event.interval.start) <= getDay(event.interval.end)) continue;
		data.availability.events.push({
			interval: {
				start: week.start as Date,
				end: event.interval.end as Date
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
		| 'td-neutral';
	function getAvailability(day: number, hour: number, minute: number): CellColour {
		const date = addMinutes(addHours(addDays(week.start as Date, day), hour), minute);
		const interval: Interval = {
			start: date,
			end: addMinutes(date, duration)
		};
		for (const event of data.availability.events) {
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
				default:
					break;
			}
		}
		return 'td-neutral';
	}

	function isPast(day: number, hour: number, minute: number) {
		if (day < now.getDay()) return true;
		if (day > now.getDay()) return false;
		if (hour < now.getHours()) return true;
		if (hour > now.getHours()) return false;
		if (minute < now.getMinutes()) return true;
		return false;
	}
</script>

<!-- <select bind:value={duration}>
	{#each [15, 30] as duration}
		<option>{duration}</option>
	{/each}
</select> -->

<!-- {#if data.availability.title}
	<h2>{data.availability.title}</h2>
{/if}
{#if data.availability.description}
	<p>{data.availability.description}</p>
{/if}
{#if data.availability.created}
	<p>{data.availability.created}</p>
{/if}
{#if data.availability.modified}
	<p>{data.availability.modified}</p>
{/if} -->

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
					<td
						class={getAvailability(day.getDay(), time.getHours(), time.getMinutes())}
						class:td-past={isPast(day.getDay(), time.getHours(), time.getMinutes())}
					></td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
