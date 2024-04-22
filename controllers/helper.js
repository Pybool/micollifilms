function generateUniqueCode(prefix) {
  const timestamp = Date.now(); // Get current timestamp
  const randomNumber = Math.floor(Math.random() * 10000); // Generate a random number
  return prefix + "-" + timestamp + "-" + randomNumber;
}

const requiredFields = [
  "name",
  "email",
  "eventDate",
  "eventCountry",
  "phone",
];

const validateBookingForm = (formData) => {
  let errors = [];
  let trimmedValue;

  for (let field of Object.keys(formData)) {
    if (requiredFields.includes(field)) {
      console.log(formData , field)
      trimmedValue = formData[field]?.trim().toLowerCase();
      if (requiredFields.includes(field) && !trimmedValue) {
        errors.push(`${field} is required.`);
      }
    }

    if (trimmedValue.includes("email") && !isValidEmail(formData[field])) {
      errors.push(`${field} is invalid.`);
    }
  }
  return errors;
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


module.exports = { generateUniqueCode, validateBookingForm };
