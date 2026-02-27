export class InternalServerError extends Error {
  constructor({ cause, statusCode }) {
    super("Um erro interno não esperado ocorreu.");
    this.name = "InternalServerError";
    this.action =
      "Tente novamente mais tarde. Se o erro persistir, entre em contato com o suporte.";
    this.statusCode = statusCode || 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_Code: this.statusCode,
    };
  }
}

export class ServiceError extends Error {
  constructor({ cause, message }) {
    super(message || "Um erro interno não esperado ocorreu.");
    this.name = "ServiceError";
    this.action = "Verifique se o serviço está disponível..";
    this.statusCode = 503;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_Code: this.statusCode,
    };
  }
}

export class MethodNotAllowedError extends Error {
  constructor() {
    super("Metodo não permitido para esse endpoint");
    this.name = "Method Not Allowed";
    this.action =
      "Verifique se o metodo HTTP utilizado é permitido para esse endpoint";
    this.details = "Apenas metodo GET é permitido para esse endpoint";
    this.statusCode = 405;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      details: this.details,
      status_Code: this.statusCode,
    };
  }
}
