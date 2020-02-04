const {Router} = require('express');
const controllers = require('../controllers');
const jwt = require('express-jwt');

const router = Router();

function user(req, res, next) {
    if (req.userModel !== null) next()
    else res.status(401).send('not auth')
}

function admin(req, res, next) {
    if (req.userModel && req.userModel.role === 0) next()
    else res.status(404).send('not auth')
}

router.use(controllers.defUserModel);

router.get('/', (req, res) => res.send('Welcome'));

router.post('/titles', admin, controllers.postTitle); // здесь задаются теги и описание и название
router.get('/titles', controllers.getTitles);
router.get('/titles/:titleId', controllers.getTitleById);
router.put('/titles/:titleId', admin, controllers.updateTitle); // здесь теги могут изменятся
//router.delete('/titles/:titleId', controllers.deleteTitle);

router.post('/titles/:titleId/:langCode/chapters', admin, controllers.postChapter); // задается язык главы, название и имя папки с картинками или текстом(она не добавляется в базу, просто создается путь если его нет)
router.get('/titles/:titleId/:langCode/chapters', controllers.getChapters);
router.get('/titles/:titleId/:langCode/chapters/:chapterNum', controllers.getChapterOfTitleByNum);
router.put('/titles/:titleId/:langCode/chapters/:chapterNum', admin, controllers.updateChapter);
router.delete('/titles/:titleId/:langCode/chapters/:chapterNum', admin, controllers.deleteChapter);

router.post('/tags', admin, controllers.addNewTag); // новый тег в базу, позже его id можно применить в post://titles
router.get('/tags', controllers.getAllTags);
router.delete('/tags/:tagId', admin, controllers.deleteTag);

router.post('/users', controllers.createUser); // Аккаунты пользователей
router.get('/users', admin, controllers.getUsers);
router.get('/users/:userId', controllers.getUserById);
router.put('/users/:userId', user, controllers.updateUser);
//router.delete('/users/:userId', controllers.deleteUser);

router.post('/auth/login', controllers.authLogin);
router.post('/auth/logout', controllers.authLogout);
router.post('/auth/profile',  controllers.authProfile);

router.post('/users/history', user, controllers.changeHistory);
router.post('/users/favorite', user, controllers.changeFavorite);

//router.get('/users/:userId/history', controllers.getUserHistory); // история автоматически формируется при запросах с сервера


module.exports = router;
