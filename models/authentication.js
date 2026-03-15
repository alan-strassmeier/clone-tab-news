import user from "models/user.js";
import password from "models/password.js";
import { UnautorizedError, NotFoundError } from "infra/erros.js";

async function proof(providedEmail, providedPasswordHash) {
  try {
    const storedUser = await findUserByEmail(providedEmail);
    await validatePassword(providedPasswordHash, storedUser.password_hash);
    return storedUser;
  } catch (error) {
    if (error instanceof UnautorizedError) {
      throw new UnautorizedError({
        message: "Email ou senha incorretos",
        action: "Verifique suas credenciais e tente novamente.",
      });
    }
    throw error;
  }

  async function findUserByEmail(providedEmail) {
    let storedUser;

    try {
      storedUser = await user.findOneByEmail(providedEmail);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new UnautorizedError({
          message: "Email ou senha incorretos",
          action: "Verifique suas credenciais e tente novamente.",
        });
      }
      throw error;
    }

    return storedUser;
  }

  async function validatePassword(providedPasswordHash, storedPassword) {
    const isPasswordValid = await password.compare(
      providedPasswordHash,
      storedPassword,
    );
    if (!isPasswordValid) {
      throw new UnautorizedError({
        message: "Email ou senha incorretos",
        action: "Verifique suas credenciais e tente novamente.",
      });
    }
  }
}

const authentication = {
  proof,
};

export default authentication;
