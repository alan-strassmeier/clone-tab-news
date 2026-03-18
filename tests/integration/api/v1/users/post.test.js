import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";
import user from "models/user.js";
import password from "models/password";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unic and valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "john_doe",
          email: "john.doe@example.com",
          password_hash: "hashed_password",
        }),
      });
      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "john_doe",
        email: "john.doe@example.com",
        password_hash: responseBody.password_hash,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const userInDatabase = await user.findOneByUsername("john_doe");

      const isPasswordValid = await password.compare(
        "hashed_password",
        userInDatabase.password_hash,
      );
      const incorrectPasswordMatch = await password.compare(
        "incorrect_password",
        userInDatabase.password_hash,
      );

      expect(isPasswordValid).toBe(true);
      expect(incorrectPasswordMatch).toBe(false);
    });

    test("With duplicated email", async () => {
      const responseEmail = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "john_duped_email",
          email: "john.duped.email@example.com",
          password_hash: "hashed_password",
        }),
      });
      expect(responseEmail.status).toBe(201);

      const responseEmail2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "john_duped_email2",
          email: "john.Duped.email@example.com",
          password_hash: "hashed_password",
        }),
      });
      expect(responseEmail2.status).toBe(400);
      const responseEmailBody = await responseEmail2.json();
      expect(responseEmailBody).toEqual({
        name: "ValidationError",
        message: "Email ja cadastrado",
        action: "Tente outro email",
        status_code: 400,
      });
    });

    test("With duplicated username", async () => {
      const responseUsername = await fetch(
        "http://localhost:3000/api/v1/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "john_duped_username",
            email: "john.duped.username@example.com",
            password_hash: "hashed_password",
          }),
        },
      );
      expect(responseUsername.status).toBe(201);

      const responseUsername2 = await fetch(
        "http://localhost:3000/api/v1/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "john_duped_username",
            email: "john.duplicado.username@example.com",
            password_hash: "hashed_password",
          }),
        },
      );
      expect(responseUsername2.status).toBe(400);
      const responseUsernameBody = await responseUsername2.json();
      expect(responseUsernameBody).toEqual({
        name: "ValidationError",
        message: "Username ja cadastrado",
        action: "Tente outro username",
        status_code: 400,
      });
    });
  });
});
