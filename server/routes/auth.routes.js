const router = require("express").Router();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const JWT_SECRET = require("../config/jwt");
const moment = require("moment");

router.post("/", async(req, res, next) => {
    const body = req.body;
    try {
        const user = await User.findOne({ email: body.email }, "-__v", {}).exec();
        if (!user) {
            return res.status(400).json(["user doesn't exist"]);
        }
        const match = await bcrypt.compare(body.password, user.password);
        if (!match) {
            return res.status(400).json(["password doesn't match"]);
        }
        const jwtToken = jsonwebtoken.sign({
                sub: user._id.toString()
            },
            JWT_SECRET, {
                algorithm: "HS256",
                expiresIn: "15min"
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

router.get("/refresh-token", async(req, res) => {
    // Nous récupérons le Bearer + token JWT depuis le header Authorization
    const auth = req.headers.authorization;
    if (auth) {
        // Nous récupérons seulement le token JWT
        const token = auth.split(" ")[1];
        // Nous vérifions si le token est valide, mais pas s'il est expiré car nous
        // avons notre logique propre de rafraîchissement
        const decodedToken = jsonwebtoken.verify(token, JWT_SECRET, {
            ignoreExpiration: true
        });
        // Si le token est expiré depuis moins de 7 jours + 15 minutes :
        if (moment(decodedToken.exp * 1000) > moment().subtract(7, "d")) {
            // Nous récupérons l'utilisateur du <code ngNonBindable >backend</code> en utilisant sub
            // qui contient l'id du token
            const user = await User.findById(decodedToken.sub).exec();
            // Nous créons un nouveau token JWT
            const jwtToken = jsonwebtoken.sign({
                    sub: user._id.toString()
                },
                JWT_SECRET, {
                    algorithm: "HS256",
                    expiresIn: "15min"
                }
            );
            // Nous retournons l'utilisateur et le token JWT :
            return res.status(200).json({
                user,
                jwtToken
            });
        } else {
            // Le token JWT est expiré depuis plus de 7 jours + 15 min
            // Nous retournons une erreur et l'utilisateur devra se reconnecter :
            return res.status(403).json("token too old");
        }
    } else {
        return res.status(403).json("no token");
    }
});

module.exports = router;