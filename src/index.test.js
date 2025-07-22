import { unstable_dev } from 'wrangler';
import { describe, expect, it, beforeAll, afterAll } from 'vitest';

describe('Worker', () => {
	let worker;

	beforeAll(async () => {
		worker = await unstable_dev('src/index.js', {
			experimental: {
				disableExperimentalWarning: true
			},
		});
	});

	afterAll(async () => {
		await worker.stop();
	});

	it('should return 200 OK for a POST request', async () => {
		const request = new Request('https://test.com/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				update_id: 123456789,
				message: {
					message_id: 1,
					from: {
						id: 123456789,
						is_bot: false,
						first_name: 'Test',
						last_name: 'User',
						username: 'testuser',
						language_code: 'en',
					},
					chat: {
						id: 123456789,
						first_name: 'Test',
						last_name: 'User',
						username: 'testuser',
						type: 'private',
					},
					date: 1678886400,
					text: '/start',
				},
			}),
		});
		const resp = await worker.fetch(request);
		expect(resp.status).toBe(200);
	});
});
