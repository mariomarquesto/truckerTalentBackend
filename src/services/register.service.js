const registerRepo = require("../repository/registerRepository");
const { encrypt } = require("../util/passSegured");
const { AppDataSource } = require("../config/data-source");
const sendVerificationEmail = require("../util/sendVerificationEmail");

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const registerWithEmail = async ({ name, surname, email, password }) => {
    const hash = await encrypt(password);
    const user = await registerRepo.registerWithEmailPassword({
        name,
        surname,
        email,
        password: hash,
        email_verified: true,
    });

    if (!user) return null;
    // await sendVerificationCode(email);
    return user;
};

const registerWithGoogle = async ({ name, surname, email, photo }) => {
    const user = await registerRepo.registerWithGoogle({
        name,
        surname,
        email,
        photo,
        password: null
    });

    if (!user) return null;
    // await sendVerificationCode(email);
    return user;
};

const completeFirstStep = async ({ city, state, zipCode, email }) => {
    return await registerRepo.updateFirstStep({ city, state, zipCode, email });
};

const completeSecondStep = async ({ salary, paymentPeriod, position, email }) => {
  return await registerRepo.updateSecondStep({
    salary,
    pay_met: paymentPeriod, // Mapeo correcto
    position,
    email,
  });
};

const sendVerificationCode = async (email) => {
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const userRepo = AppDataSource.getRepository("User");
    await userRepo.update(
        { email },
        {
        email_verification_code: code,
        verification_expires_at: expiresAt
        }
    );

    await sendVerificationEmail(email, code);
};

module.exports = {
    registerWithEmail,
    registerWithGoogle,
    completeFirstStep,
    completeSecondStep,
    sendVerificationCode
};
