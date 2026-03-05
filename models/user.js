import database from "infra/database";
import { ValidationError } from "infra/erros.js";
async function create(userInputValue) {
  await validadeUniqueEmail(userInputValue.email);
  await validadeUniqueUsername(userInputValue.username);

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
};

export default user;
