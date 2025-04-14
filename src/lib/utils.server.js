import axios from 'axios';
import { POST_HOOK } from '$env/static/private';

export async function handleWebhook(data, type) {
	if(!POST_HOOK) return;
	switch(type) {
		case 'post':
			await axios.post(POST_HOOK, {
				embeds: [{
					title: "New blog post!",
					image: {
						url: data.cover_url?.length ? data.cover_url : "https://cdn.greysdawn.com/img/81fa.png"
					},
					timestamp: (new Date).toISOString(),
					color: 0x111111,
					fields: [
						{
							name: data.title,
							value: data.short
						},
						{
							name: "Link",
							value: `https://greysdawn.com/blog/${data.hid}`
						}
					]
				}]
			})
			break;
	}
}