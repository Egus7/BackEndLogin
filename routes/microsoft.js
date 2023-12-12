import { Router } from "express";
import passport from "passport";

const loginRouter = Router();

loginRouter.get(
    "/microsoft", 
    passport.authenticate("auth-microsoft", {
        prompt: "select_account",
        session: false,
    })
);

loginRouter.get(
    "/microsoft/callback",
    passport.authenticate("auth-microsoft", {
        failureRedirect: "/auth/microsoft",
        session: false,
    }),
    (req, res) => {
        res.json(req.user);
    }
);

export { loginRouter };