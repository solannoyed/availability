export type AvailabilityEvent = {
	// 0 (unavailable) / 1 (invonvenient) / 2 (available) / 3 (preferred)
	availability: number; // 0 | 1 | 2 | 3;
	interval: { end: Date; start: Date };
};

export type Availability = {
	created: Date;
	description: string;
	events: AvailabilityEvent[];
	modified: Date;
	title: string;
};
