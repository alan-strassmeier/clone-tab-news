import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});
describe("POST api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retriving current service status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status", {
        method: "POST",
      });
      expect(response.status).toBe(405);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "Method Not Allowed",
        message: "Metodo não permitido para esse endpoint",
        action: "Verifique se o metodo HTTP utilizado é permitido para esse endpoint",
        details: "Apenas metodo GET é permitido para esse endpoint",
        status_Code: 405,
      })

    });
  });
});
