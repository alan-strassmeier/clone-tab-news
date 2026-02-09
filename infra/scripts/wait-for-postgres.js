const { exec } = require("node:child_process");

const MAX_TENTATIVAS = 30;

let tentativasRealizadas = 0;

function checkPostgresConnection() {
  tentativasRealizadas++;

  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout, stderr) {
    if (error && error.code === 127) {
      console.error("❌ Erro: Docker ou container 'postgres' não encontrado");
      console.error(error.message);
      process.exit(1);
    }
    if (stdout && /accepting connections/i.test(stdout)) {
      console.log("✅ Postgres está aceitando conexões!");
      process.exit(0);
      return;
    }
    if (tentativasRealizadas >= MAX_TENTATIVAS) {
      console.error(
        `❌ Timeout: Postgres não ficou disponível após ${MAX_TENTATIVAS} tentativas`,
      );
      console.error("Última resposta:", stdout || stderr || "sem resposta");
      process.exit(1);
      return;
    }
    console.log(
      `⏳ Aguardando Postgres ficar disponível... (tentativa ${tentativasRealizadas}/${MAX_TENTATIVAS})`,
    );
    setTimeout(checkPostgresConnection, 2000);
  }
}

checkPostgresConnection();
