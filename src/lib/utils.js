export function formatDate(dt, type) {
	if(typeof dt == "string") dt = new Date(dt);
	switch(type) {
		case 'MM.DD':
			return (
				("00" + (dt.getMonth() + 1)).slice(-2) + "." +
				("00" + dt.getDate()).slice(-2) + "." +
				dt.getFullYear()
			)
			break;
		case 'DD.MM':
			return (
				("00" + dt.getDate()).slice(-2) + "." +
				("00" + (dt.getMonth() + 1)).slice(-2) + "." +
				dt.getFullYear()
			)
			break;
	}
}