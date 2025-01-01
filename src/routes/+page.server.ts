import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const location = data.get('location')
		throw redirect(303, `/?q=${location}`);

	}
} satisfies Actions;