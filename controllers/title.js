const models = require("../database/models");

module.exports = {
    postTitle: async (req, res) => {
        try {
            const title = await models.title.create(req.body);

            if (req.body.tags !== undefined) {
                await title.setTags((await Promise.all(
                    // создает теги и затем присваивает их юзеру
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
        const {offset, limit, category} = req.query;
        if (!category) return res.status(404);

        console.log(req.query);

        try {
            const titles = await models.title.findAll({
                attributes: ['id', 'name', 'db', 'category'],
                include: [{
                    model: models.tag,
                    as: "tags",
                    attributes: ['id', 'name'],
                    through: {attributes: []}
                }],
                offset: offset || 0,
                limit: Math.min(limit || 100, 100),
                where: {category}
            });
            return res.status(200).json({titles});
        } catch (error) {
            return res.status(500).send(error.message);
        }
    },


    async getTitleById(req, res){

        try {
            const {titleId} = req.params;

            //if(req.userModel) history.include = [{model: models.user, where:{id:req.userModel.id}}];

            const title = await models.title.findOne({
                where: {id: titleId},
                include: [
                    {
                        model: models.tag,
                        as: "tags"
                    },
                    {
                        model: models.chapter,
                        attributes: ['id', 'name', 'pagesCount', 'db'],
                        as: "chapters"
                    }
                ]
            });

            if (req.userModel) {
                const history = await req.userModel.getChapters({
                    attributes: ['id'],
                    where: {titleId: title.id}
                });

                title.dataValues.favorite = await req.userModel.hasTitle(title);

                title.chapters = title.chapters.forEach(c => {
                    const hist = history.find(hc => hc.dataValues.id === c.dataValues.id);
                    c.dataValues.history = hist ? hist.history : { pageNum: 0};
                })
            }

            if (title) {
                return res.status(200).json({title});
            }
            return res.status(404).send("Title with the specified ID does not exists");
        } catch (e) {
            console.error(e);
            return res.status(500).send(e.message);
        }
    },
    changeFavorite: async (req, res) => {
        const {titleId, isFavorite = false} = req.body;
        if(titleId === undefined) return res.status(500).send('not selected title');
        try{
            const result = await req.userModel[(isFavorite ? 'add' : 'remove') + 'Title'](titleId);
            return res.status(200).json(result);
        }
        catch (e) {
            console.error(e);
            return res.status(500).send(e.message);
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
