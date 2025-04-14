export function formatDate(dt) {
	if(typeof dt == "string") dt = new Date(dt);
	return (
		("00" + (dt.getMonth() + 1)).slice(-2) + "." +
		("00" + dt.getDate()).slice(-2) + "." +
		dt.getFullYear()
	)
}