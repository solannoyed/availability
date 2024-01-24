import { initializeApp } from 'firebase/app';
import {
	getFirestore,
	type FirestoreDataConverter,
	type QueryDocumentSnapshot,
	Timestamp
} from 'firebase/firestore/lite';
import {
	PUBLIC_FIREBASE_API_KEY,
	PUBLIC_FIREBASE_AUTH_DOMAIN,
	PUBLIC_FIREBASE_PROJECT_ID,
	PUBLIC_FIREBASE_STORAGE_BUCKET,
	PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	PUBLIC_FIREBASE_APP_ID
} from '$env/static/public';
import type { Availability } from './availability';

export const firebaseConfig = {
	apiKey: PUBLIC_FIREBASE_API_KEY,
	authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: PUBLIC_FIREBASE_APP_ID
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firestore = getFirestore(firebaseApp);

export const availabilityConverter: FirestoreDataConverter<Availability, AvailabilityDbModel> = {
	toFirestore(availability: Availability): AvailabilityDbModel {
		return {
			created: Timestamp.fromDate(availability.created),
			description: availability.description,
			events: availability.events.map(({ availability, interval }) => {
				return {
					availability,
					interval: {
						end: Timestamp.fromDate(interval.end),
						start: Timestamp.fromDate(interval.start)
					}
				};
			}),
			modified: Timestamp.fromDate(availability.modified),
			title: availability.title
		};
	},
	fromFirestore(snapshot: QueryDocumentSnapshot<AvailabilityDbModel>): Availability {
		const availability = snapshot.data();
		return {
			created: availability.created.toDate(),
			description: availability.description,
			events: availability.events.map(({ availability, interval }) => {
				return {
					availability,
					interval: {
						end: interval.end.toDate(),
						start: interval.start.toDate()
					}
				};
			}),
			modified: availability.modified.toDate(),
			title: availability.title
		};
	}
};

export type AvailabilityDbModel = {
	created: Timestamp;
	description: string;
	events: { availability: number; interval: { end: Timestamp; start: Timestamp } }[];
	modified: Timestamp;
	title: string;
};
