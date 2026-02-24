export class InternalServerError extends Error {
  constructor({ cause }) {
    super("Um erro interno não esperado ocorreu.", { cause });
    this.name = "InternalServerError";
    this.action =
      "Tente novamente mais tarde. Se o erro persistir, entre em contato com o suporte.";
    this.statusCode = 500;
  }

  toJason() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_Code: this.statusCode,
    };
  }
}
