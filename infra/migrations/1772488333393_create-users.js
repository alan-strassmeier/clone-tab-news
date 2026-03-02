exports.up = pgm => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    username: {
      type: "varchar(30)",
      notNull: true,
      unique: true,
    },
    email: {
      type: "varchar(255)",
      notNull: true,
      unique: true,
    },
    // bcrypt hashes are 60 characters long, but we need to reserve some space for the algorithm prefix and the salt
    // so we use 72 characters to be safe
    password_hash: {
      type: "varchar(72)",
      notNull: true,
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });
};

exports.down = false
