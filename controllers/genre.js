const models = require("../database/models");


module.exports = {
    addNewGenre: async (req, res) => {
        try {
            const genre = await models.genre.create(req.body);
            return res.status(201).json({
                genre
            });
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    },


    getAllGenres: async (req, res) => {
        try {
            const genres = await models.genre.findAll(req.params);
            return res.status(201).json({genres});
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    },
    deleteGenre: async (req, res) => {
        const {genreId} = req.params;
        try {
            const genre = await models.genre.findByPk(genreId);

            if (genre) {
                const deleted = await genre.destroy()
                return res.status(204).send("genre deleted");
            }
            throw new Error("genre not found");
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }
};
