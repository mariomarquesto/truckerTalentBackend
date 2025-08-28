module.exports = function normalizeEmail(email) {
  if (typeof email !== "string") throw new Error("Email inválido");
  return email.trim().toLowerCase();
};
