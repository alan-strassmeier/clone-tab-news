import { up } from "infra/migrations/1769815459110_test-migration";
import { use } from "react";
import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 5000,
  });

  return (
    <>
      <h1>Status</h1>
      <UpdatedAt isLoading={isLoading} data={data} />
      <DatabaseInfo isLoading={isLoading} data={data} />
    </>
  );
}

function UpdatedAt({ isLoading, data }) {
  let updateAtText = "Carregando...";
  if (!isLoading && data) {
    updateAtText = new Date(data.updated_at).toLocaleString("pt-BR", {
      timeZone: "UTC",
    });
  }
  return <div>Ultima atualização: {updateAtText}</div>;
}

function DatabaseInfo({ isLoading, data }) {
  if (isLoading) return <div>Carregando banco de dados...</div>;

  const db = data?.dependencies?.database;

  return (
    <div>
      <h2>Banco de dados</h2>
      <p>Versão do Postgres: {db?.version}</p>
      <p>Conexões máximas: {db?.max_connections}</p>
      <p>Conexões abertas: {db?.opened_connections}</p>
    </div>
  );
}
