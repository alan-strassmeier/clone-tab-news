import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";
import user from "models/user.js";
import password from "models/password";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH api/v1/[username]", () => {
  describe("Anonymous user", () => {
    test("With nonexistent 'username'", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/nonexistent",
        {
          method: "PATCH",
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "Usuario nao encontrado",
        action: "Verifique o username e tente novamente",
        statusCode: 404,
      });
    });

    test("With duplicated 'username'", async () => {
      const responseUser1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user1",
          email: "user1@example.com",
          password_hash: "hashed_password",
        }),
      });
      expect(responseUser1.status).toBe(201);

      const responseUser2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user2",
          email: "user2@example.com",
          password_hash: "hashed_password123",
        }),
      });
      expect(responseUser2.status).toBe(201);

      const response = await fetch("http://localhost:3000/api/v1/users/user2", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user1",
        }),
      });
      expect(response.status).toBe(400);
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Username ja cadastrado",
        action: "Tente outro username",
        status_Code: 400,
      });
    });

    test("With duplicated 'email'", async () => {
      const responseUser1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "email1",
          email: "email1@example.com",
          password_hash: "hashed_password",
        }),
      });
      expect(responseUser1.status).toBe(201);

      const responseUser2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "email2",
          email: "email2@example.com",
          password_hash: "hashed_password123",
        }),
      });
      expect(responseUser2.status).toBe(201);

      const response = await fetch(
        "http://localhost:3000/api/v1/users/email2",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "email1@example.com",
          }),
        },
      );
      expect(response.status).toBe(400);
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Email ja cadastrado",
        action: "Tente outro email",
        status_Code: 400,
      });
    });

    test("With unique 'username'", async () => {
      const responseUser1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "uniqueUser1",
          email: "uniqueUser1@example.com",
          password_hash: "hashed_password",
        }),
      });
      expect(responseUser1.status).toBe(201);

      const responseUser2 = await fetch(
        "http://localhost:3000/api/v1/users/uniqueUser1",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "uniqueUser2",
          }),
        },
      );
      expect(responseUser2.status).toBe(200);

      const responseBody = await responseUser2.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "uniqueUser2",
        email: "uniqueUser1@example.com",
        password_hash: responseBody.password_hash,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });

    test("With unique 'email'", async () => {
      const responseUser1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "uniqueEmail1",
          email: "uniqueEmail1@example.com",
          password_hash: "hashed_password",
        }),
      });
      expect(responseUser1.status).toBe(201);

      const responseUser2 = await fetch(
        "http://localhost:3000/api/v1/users/uniqueEmail1",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "uniqueEmail2@example.com",
          }),
        },
      );
      expect(responseUser2.status).toBe(200);

      const responseBody = await responseUser2.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "uniqueEmail1",
        email: "uniqueEmail2@example.com",
        password_hash: responseBody.password_hash,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });

    test("With new 'password'", async () => {
      const responseUser1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "newPasswordUser",
          email: "password@example.com",
          password_hash: "hashed_password",
        }),
      });
      expect(responseUser1.status).toBe(201);

      const responseUser2 = await fetch(
        "http://localhost:3000/api/v1/users/newPasswordUser",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password_hash: "new_hashed_password",
          }),
        },
      );
      expect(responseUser2.status).toBe(200);

      const responseBody = await responseUser2.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "newPasswordUser",
        email: "password@example.com",
        password_hash: responseBody.password_hash,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
      const userInDatabase = await user.findOneByUsername("newPasswordUser");
      const isPasswordValid = await password.compare(
        "new_hashed_password",
        userInDatabase.password_hash,
      );
      const incorrectPasswordMatch = await password.compare(
        "hashed_password",
        userInDatabase.password_hash,
      );

      expect(isPasswordValid).toBe(true);
      expect(incorrectPasswordMatch).toBe(false);
    });
  });
});
