import { availabilityConverter, firestore } from '$lib/firebase.js';
import { error } from '@sveltejs/kit';
import { doc, getDoc } from 'firebase/firestore/lite';

export async function load({ params }) {
	const docRef = doc(firestore, 'availabilities', params.documentId).withConverter(
		availabilityConverter
	);
	const docSnap = await getDoc(docRef);
	if (!docSnap.exists()) error(404, 'Document Id not found');
	return {
		content: `${params.documentId}`,
		availability: docSnap.data()
	};
}
