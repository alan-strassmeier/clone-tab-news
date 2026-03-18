import user from "models/user.js";
import password from "models/password.js";
import { UnauthorizedError, NotFoundError } from "infra/erros.js";

async function proof(providedEmail, providedPasswordHash) {
  try {
    const storedUser = await findUserByEmail(providedEmail);
    await validatePassword(providedPasswordHash, storedUser.password_hash);
    return storedUser;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Usuário não possui sessão ativa.",
        action: "Verifique se este usuário está logado e tente novamente.",
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
        throw new UnauthorizedError({
          message: "Usuário não possui sessão ativa.",
          action: "Verifique se este usuário está logado e tente novamente.",
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
      throw new UnauthorizedError({
        message: "Usuário não possui sessão ativa.",
        action: "Verifique se este usuário está logado e tente novamente.",
      });
    }
  }
}

const authentication = {
  proof,
};

export default authentication;
