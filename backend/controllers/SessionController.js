const User = require('../models/User');
//index (retorna uma listagem de algo)
//show (retorna uma unica sessão)
//store(criar uma unica sessao)
//update(alterar uma sessao)
//destroy(remover uma sessao)
module.exports = {
	async store(req, res) {
		const { email } = req.body;
		let user = await User.findOne({ email });

		if (!user) {
			user = await User.create({ email });
		}

		return res.json(user);
	}
};
