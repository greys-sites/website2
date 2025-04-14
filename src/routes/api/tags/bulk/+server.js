import { error, json } from '@sveltejs/kit';
import Tags from '$lib/data/tags.js';

export async function POST({ request, locals, url }) {
	if(!locals.user) return error(401);
	var data = await request.json();
	console.log(data);

	var tags = [];
	var errs = [];

	for(var i = 0; i < data.length; i++) {
		var { name, description } = data[i];
		name = name?.toLowerCase().trim();
		if(!name?.length) {
			errs.push("Tag names must not be empty.");
			continue;
		}
		
		description = description?.trim() ?? "";

		var tag = await Tags.create({
			name,
			description
		});
		tags.push(tag)
	}

	if(errs.length) return json({ tags, errs })
	else return json({ tags });
}