import database from "infra/database";
import password from "models/password.js";
import { ValidationError, NotFoundError } from "infra/erros.js";

async function findOneById(id) {
  const userFound = await runSelectQuery(id);

  return userFound;
  async function runSelectQuery(id) {
    const result = await database.query({
      text: `
    SELECT
      *
    FROM
      users
    WHERE
     id = $1
     LIMIT
      1
    ;`,
      values: [id],
    });
    if (result.rowCount === 0) {
      throw new NotFoundError({
        message: "Id nao encontrado",
        action: "Verifique o id e tente novamente",
        statusCode: 404,
      });
    }
    return result.rows[0];
  }
}

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

async function findOneByEmail(email) {
  const userFound = await runSelectQuery(email);

  return userFound;
  async function runSelectQuery(email) {
    const result = await database.query({
      text: `
    SELECT
      *
    FROM
      users
    WHERE
      LOWER(email) = LOWER($1)
      LIMIT
      1
    ;`,
      values: [email],
    });
    if (result.rowCount === 0) {
      throw new NotFoundError({
        message: "Email nao encontrado",
        action: "Verifique o email e tente novamente",
        statusCode: 404,
      });
    }
    return result.rows[0];
  }
}
async function create(userInputValue) {
  await validadeUniqueUsername(userInputValue.username);
  await validadeUniqueEmail(userInputValue.email);
  await hashPasswordInObject(userInputValue);

  const newUser = await runInsertQuery(userInputValue);
  return newUser;

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

async function update(username, userInputValue) {
  const currentUser = await findOneByUsername(username);
  if ("username" in userInputValue) {
    await validadeUniqueUsername(userInputValue.username);
  }
  if ("email" in userInputValue) {
    await validadeUniqueEmail(userInputValue.email);
  }
  if ("password_hash" in userInputValue) {
    await hashPasswordInObject(userInputValue);
  }

  const userNewValues = { ...currentUser, ...userInputValue };

  const updatedUser = await runUpdateQuery(userNewValues);
  return updatedUser;

  async function runUpdateQuery(userNewValues) {
    const result = await database.query({
      text: `
    UPDATE
      users
    SET
      username = $2,
      email = $3,
      password_hash = $4,
      updated_at = timezone('UTC', now())
      WHERE
        id = $1
    RETURNING
     *
      ;
      `,
      values: [
        userNewValues.id,
        userNewValues.username,
        userNewValues.email,
        userNewValues.password_hash,
      ],
    });
    return result.rows[0];
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

async function hashPasswordInObject(userInputValue) {
  const hashedPassword = await password.hash(userInputValue.password_hash);
  userInputValue.password_hash = hashedPassword;
}

const user = {
  create,
  findOneById,
  findOneByUsername,
  findOneByEmail,
  update,
};

export default user;
