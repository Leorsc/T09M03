const yup = require("yup");
const { getCategorieNamedById } = require("../../Users/services/utils");
const listTransactions = require("../services/listTransactionsService");
const updateTransactions = require("../services/updateTransactionService");
const transactionsFieldsValidation = require("../validations/bodyTransactionValidation");

const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { descricao, valor, data, categoria_id, tipo } = req.body;
  const userId = req.userId;

  try {
    const userTransaction = await listTransactions.getOne(id);

    await transactionsFieldsValidation.validate(req.body);

    if (userTransaction[0].usuario_id !== userId) {
      return res.status(401).json({ message: "Usuário não autorizado" });
    }

    const categoria_nome = await getCategorieNamedById(categoria_id);

    const updatedTransaction = await updateTransactions.update(id, {
      descricao,
      valor,
      data,
      categoria_id,
      tipo,
    });

    res.status(200).json({ ...updatedTransaction, categoria_nome });
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      return res.status(400).json({
        message: err.errors[0],
      });
    } else {
      return res.status(500).json({ message: `${err}` });
    }
  }
};
module.exports = {
  updateTransaction,
};
