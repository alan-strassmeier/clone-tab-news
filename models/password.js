import bcryptjs from "bcryptjs";

export async function hash(password) {
  const rounds = getNumberofRounds();
  return bcryptjs.hash(password, rounds);
}

function getNumberofRounds() {
  return process.env.NODE_ENV === "production" ? 12 : 1;
}

export async function compare(password, hash) {
  return bcryptjs.compare(password, hash);
}

const password = {
  hash,
  compare,
};

export default password;
