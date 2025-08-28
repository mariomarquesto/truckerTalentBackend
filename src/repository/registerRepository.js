const { AppDataSource } = require("../config/data-source");
const User = require("../entities/UserEntity");
const userRepo = AppDataSource.getRepository(User);

const registerWithGoogle = async ({ name, surname, email, password, photo }) => {
    const user = userRepo.create({ name, surname, email, password, photo });
    return await userRepo.save(user);
};

const registerWithEmailPassword = async ({ name, surname, email, password, email_verified }) => {
    const user = userRepo.create({ name, surname, email, password, email_verified });
    return await userRepo.save(user);
};

const updateFirstStep = async ({ city, state, zipCode, email }) => {
    console.log("Searching user with email in FirstStep Repository:", email);
    const user = await userRepo.findOneBy({ email });

    if (!user) return null;
    Object.assign(user, { city, state, zipCode });
    return await userRepo.save(user);
};

const updateSecondStep = async ({ salary, pay_met, position, email }) => {
    const user = await userRepo.findOneBy({ email });
    if (!user) return null;
    Object.assign(user, { salary, pay_met, position });
    return await userRepo.save(user);
};

module.exports = {
    registerWithGoogle,
    registerWithEmailPassword,
    updateFirstStep,
    updateSecondStep
};
