const models = require("../database/models");

module.exports = {
	postTitle: async (req, res) => {
		try {
			const title = await models.title.create(req.body);

			if (req.body.tags !== undefined) {
				await title.setTags((await Promise.all(
					req.body.tags.map(tag => models.tag.findOrCreate({
							where: {name: tag}
						})
					)
				)).map(tag => tag[0]));
			}

			return res.status(201).json({
				title
			});
		} catch (error) {
			return res.status(500).json({error: error.message});
		}
	},


	getTitles: async (req, res) => {
		try {
			const titles = await models.title.findAll({
				include: [{
					model: models.tag,
					as: "tags",
					attributes: ['id', 'name'],
					through: {attributes: []}
				}],
				offset: req.body.offset || 0,
				limit: Math.min(req.body.limit || 100, 100)
			});
			return res.status(200).json({titles});
		} catch (error) {
			return res.status(500).send(error.message);
		}
	},
	getTitleById: async (req, res) => {
		try {
			const {titleId} = req.params;
			const title = await models.title.findOne({
				where: {id: titleId},
				include: [
					{
						model: models.tag,
						as: "tags"
					}
				]
			});
			if (title) {
				return res.status(200).json({title});
			}
			return res.status(404).send("Title with the specified ID does not exists");
		} catch (error) {
			return res.status(500).send(error.message);
		}
	},

	updateTitle: async (req, res) => {
		try {
			const {titleId} = req.params;
			const [updated] = await models.title.update(req.body, {
				where: {id: titleId}
			});
			if (updated) {
				const updated = await models.title.findOne({where: {id: titleId}});

				if (req.body.tags !== undefined) {
					await updated.setTags((await Promise.all(
						req.body.tags.map(tag => models.tag.findOrCreate({
								where: {name: tag}
							})
						)
					)).map(tag => tag[0]));
				}
				return res.status(200).json({title: updated});
			}
			throw new Error("title not found");
		} catch (error) {
			return res.status(404);
		}
	},
	deleteTitle: async (req, res) => {
		try {
			const {titleId} = req.params;
			const deleted = await models.title.destroy({
				where: {id: titleId}
			});
			if (deleted) {
				return res.status(204).send("title deleted");
			}
			throw new Error("title not found");
		} catch (error) {
			return res.status(500).send(error.message);
		}
	}
};
