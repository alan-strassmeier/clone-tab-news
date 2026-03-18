export class InternalServerError extends Error {
  constructor({ cause, statusCode }) {
    super("Um erro interno não esperado ocorreu.", { cause });
    this.name = "InternalServerError";
    this.action =
      "Tente novamente mais tarde. Se o erro persistir, entre em contato com o suporte.";
    this.status_code = statusCode || 500;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.status_code,
    };
  }
}

export class ServiceError extends Error {
  constructor({ cause, message }) {
    super(message || "Um erro interno não esperado ocorreu.");
    this.name = "ServiceError";
    this.action = "Verifique se o serviço está disponível.";
    this.status_code = 503;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.status_code,
    };
  }
}

export class ValidationError extends Error {
  constructor({ cause, message, action }) {
    super(message || "Um erro de validação ocorreu.", { cause });
    this.name = "ValidationError";
    this.action = action || "Ajuste seus dados e tente novamente.";
    this.status_code = 400;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.status_code,
    };
  }
}

export class NotFoundError extends Error {
  constructor({ cause, message, action }) {
    super(message || "Não foi possível encontrar o recurso.", { cause });
    this.name = "NotFoundError";
    this.action = action || "Verifique o username e tente novamente";
    this.status_code = 404;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.status_code,
    };
  }
}

export class UnauthorizedError extends Error {
  constructor({ cause, message, action }) {
    super(message || "Usuario nao autenticado.", { cause });
    this.name = "UnauthorizedError";
    this.action = action || "Verifique as credenciais e tente novamente.";
    this.status_code = 401;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.status_code,
    };
  }
}

export class MethodNotAllowedError extends Error {
  constructor() {
    super("Metodo não permitido para esse endpoint");
    this.name = "MethodNotAllowedError";
    this.action =
      "Verifique se o metodo HTTP utilizado é permitido para esse endpoint";
    this.details = "Apenas metodo GET é permitido para esse endpoint";
    this.status_code = 405;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      details: this.details,
      status_code: this.status_code,
    };
  }
}
