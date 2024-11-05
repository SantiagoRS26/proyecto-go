export const parseLocalDate = (dateString: string): Date => {
	const [year, month, day] = dateString.split("-").map(Number);
	return new Date(year, month - 1, day);
};

export const areSameUTCDate = (date1: Date, date2: Date): boolean => {
	return (
		date1.getUTCFullYear() === date2.getUTCFullYear() &&
		date1.getUTCMonth() === date2.getUTCMonth() &&
		date1.getUTCDate() === date2.getUTCDate()
	);
};
