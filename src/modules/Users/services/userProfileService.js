const { hash } = require("bcrypt");
const db = require("../../../config/DBconnection");
const { fieldExists } = require("./utils");

const show = async (id) => {
  const query = {
    text: "SELECT id, nome, email FROM usuarios WHERE id = $1",
    values: [id],
  };
  const { rows: loggedUser } = await db.query(query);

  return loggedUser;
};

const update = async (nome, email, senha, id) => {
  try {
    const {
      rows: [user],
    } = await db.query("SELECT * from usuarios WHERE id = $1", [id]);
    if (!user) {
      return "Usuário não encontrado!";
    }

    if (email !== user.email) {
      const emailExists = await fieldExists("email", email);
      if (emailExists) {
        return "O email já existe!";
      }
    }

    const hashedPassword = await hash(senha, 10);
    const query = {
      text: "UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4",
      values: [nome, email, hashedPassword, id],
    };

    const { rows: updatedUser } = await db.query(query);

    return updatedUser;
  } catch (err) {
    return `Falha ao atualizar o usuário: ${err.message}`;
  }
};

module.exports = { show, update };
