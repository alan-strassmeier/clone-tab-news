function status(req, res) {
  res.status(200).json({ status: 'mensagem de teste ç mais longa' });
}

export default status;