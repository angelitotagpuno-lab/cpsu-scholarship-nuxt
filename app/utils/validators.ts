export const isRequired = (value: string, field = "Field") => {
	if (!value) return `${field} is required`;
	return true;
};

export const isName = (value: string, field = "Field") => {
	if (!value) return true;
	const regex = /^[A-Za-z\s]+$/;
	return regex.test(value) || `${field} must contain only letters`;
};

export const isNumber = (value: string, field = "Field") => {
	if (!value) return true;
	const regex = /^[0-9]+$/;
	return regex.test(value) || `${field} must contain only numbers`;
};
export const isEmail = (value: string) => {
	if (!value) return true;

	return value.includes("@") && value.includes(".") ? true : "Invalid email format";
};
