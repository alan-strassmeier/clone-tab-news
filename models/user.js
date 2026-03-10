import database from "infra/database";
import password from "models/password.js";
import { ValidationError, NotFoundError } from "infra/erros.js";

async function findOneByUsername(username) {
  const userFound = await runSelectQuery(username);

  return userFound;
  async function runSelectQuery(username) {
    const result = await database.query({
      text: `
    SELECT
      *
    FROM
      users
    WHERE
      LOWER(username) = LOWER($1)
      LIMIT
      1
    ;`,
      values: [username],
    });
    if (result.rowCount === 0) {
      throw new NotFoundError({
        message: "Usuario nao encontrado",
        action: "Verifique o username e tente novamente",
        statusCode: 404,
      });
    }
    return result.rows[0];
  }
}

async function create(userInputValue) {
  await validadeUniqueEmail(userInputValue.email);
  await validadeUniqueUsername(userInputValue.username);
  await hashPasswordInObject(userInputValue);

  const newUser = await runInsertQuery(userInputValue);
  return newUser;

  async function validadeUniqueEmail(email) {
    const result = await database.query({
      text: `
    SELECT
      *
    FROM
      users
    WHERE
      LOWER(email) = LOWER($1)
    ;`,
      values: [email],
    });
    if (result.rowCount > 0) {
      throw new ValidationError({
        message: "Email ja cadastrado",
        action: "Tente outro email",
      });
    }
  }

  async function validadeUniqueUsername(username) {
    const result = await database.query({
      text: `
    SELECT
      *
    FROM
      users
    WHERE
      LOWER(username) = LOWER($1)
    ;`,
      values: [username],
    });
    if (result.rowCount > 0) {
      throw new ValidationError({
        message: "Username ja cadastrado",
        action: "Tente outro username",
      });
    }
  }

  async function hashPasswordInObject(userInputValue) {
    const hashedPassword = await password.hash(userInputValue.password_hash);
    userInputValue.password_hash = hashedPassword;
  }

  async function runInsertQuery(userInputValue) {
    const result = await database.query({
      text: `
    INSERT INTO
      users (username, email,password_hash)
     VALUES
      ($1, $2, $3)
    RETURNING
     *
      ;`,
      values: [
        userInputValue.username,
        userInputValue.email,
        userInputValue.password_hash,
      ],
    });
    return result.rows[0];
  }
}

const user = {
  create,
  findOneByUsername,
};

export default user;
