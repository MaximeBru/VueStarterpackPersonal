const router = require("express").Router();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const JWT_SECRET = require("../config/jwt");
const moment = require("moment");

router.post("/", async(req, res, next) => {
    const body = req.body;
    try {
        // récupération de l'utilisateur avec son email, nous effectuons une projection pour retirer 
        // le champ __v qui ne sert pas dans l'application Vue.
        // utilisation de exec() pour transformer la requête en promesse pour pouvoir utiliser
        // await.
        const user = await User.findOne({ email: body.email }, "-__v", {}).exec();
        if (!user) {
            // Nous retournons une erreur car aucun utilisateur ne correspond à l'email renseigné
            return res.status(400).json(["user doesn't exist"]);
        }
        // Nous comparons les hashs du mot de passe en base de données avec le hash du 
        // mot de passe envoyé.
        const match = await bcrypt.compare(body.password, user.password);
        if (!match) {
            // Les hashs des mots de passe ne correspondent il est retourné une erreur.
            return res.status(400).json(["password doesn't match"]);
        }
        // création d'un token JWT signé avec le secret.
        // sub contient l'id de l'utilisatuer
        // algorithme utilisé pour la signature, HS256.
        const jwtToken = jsonwebtoken.sign({
                sub: user._id.toString()
            },
            JWT_SECRET, {
                algorithm: "HS256",
            }
        );
        if (!jwtToken) {
            throw "error while creating token";
        }
        res.status(200).json({
            user,
            jwtToken
        });
    } catch (e) {
        next(e);
    }
});

module.exports = router;