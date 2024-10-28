export const formatCurrency = (amount: number | string) => {
	return parseFloat(amount as string).toLocaleString('en-NG', {
		style: 'currency',
		currency: 'NGN',
		minimumFractionDigits: 2,
	});
};
