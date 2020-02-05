const models = require("../database/models");


module.exports = {
    async postComment(req, res) {
        const {parentCommentId, text, titleId, isSpoiler} = req.body;


        // todo: text check
        const comment = await models.comment.create({
            titleId,
            authorId: req.userModel.id,
            text,
            parentCommentId,
            isSpoiler,
            likeCount: 0
        });

        return res.status(200).send('200');
    },
    async editComment(req, res) {
        const {text} = req.body;
        const {commentId} = req.params;
        try {
            await models.comment.update({text}, {where: {id: commentId}});
            return res.status(200).send('edited');

        } catch (e) {
            return res.status(500).send(e.message);
        }
    },
    async deleteComment(req, res) {
        const {commentId} = req.params;
        try {
            await models.comment.destroy({
                where: {
                    id: commentId //this will be your id that you want to delete
                }
            });
            return res.status(200).send('deleteComment');
        } catch (e) {
            return res.status(500).send(e.message);
        }


    },
    async likeComment(req, res) {
        const {commentId} = req.params;
        const {isLiked} = req.body;
        if (isLiked === undefined) return res.status(500).send('isLiked undefined');

        try {
            await req.userModel[(isLiked ? 'add' : 'remove') + 'Comment'](commentId);
            await models.comment.increment('likeCount', {by: isLiked ? 1 : -1, where: {id: commentId}});
            return res.status(200).send('okk))');
        } catch (e) {
            console.error(e);
            return res.status(500).send(e.message);
        }
    },
    async getComments(req, res) {
        const {offset, limit, titleId} = req.query;
        if (!titleId) return res.status(404);

        let ap2 = [];
        let ap = [];
        if (req.userModel) {// why copy not working????
            ap = [
                {
                    model: models.user,
                    as: 'liker',
                    attributes: ['id'],
                    where: {id: req.userModel.id},
                    required: false
                }
            ];
            ap2 = [
                {
                    model: models.user,
                    as: 'liker',
                    attributes: ['id'],
                    where: {id: req.userModel.id},
                    required: false
                }
            ];
        }


        try {

            const options = {
                //attributes: ['id', 'name', 'db', 'category'],
                where: {titleId, parentCommentId: null},
                offset: offset || 0,
                limit: Math.min(limit || 100, 100),
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: models.comment,
                        as: "childComments",
                        order: [
                            [{model: models.comment}, 'createdAt', 'ASC']
                        ],
                        include: [
                            {
                                model: models.user,
                                as: 'author',
                                attributes: ['name']
                            },
                            ...ap
                        ]
                    },
                    {
                        model: models.user,
                        as: 'author',
                        attributes: ['name']
                    },
                    ...ap2
                ]
            };
            console.log(JSON.stringify(options))


            const comments = await models.comment.findAll(options);
            // все
            return res.status(200).json({comments});
        } catch (e) {
            console.error(e)
            return res.status(500).send(e.message);
        }


    },

};
