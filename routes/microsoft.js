import { Router } from "express";
import passport from "passport";

const loginRouter = Router();


loginRouter.get(
    "/microsoft", 
    passport.authenticate("auth-microsoft", {
        prompt: "select_account",
        session: true,
    })
);

loginRouter.get(
    "/microsoft/callback",
    passport.authenticate("auth-microsoft", {
        failureRedirect: "/auth/microsoft",
        session: true,
    }),
    (req, res) => {
        
       //res.json(req.user);
       res.redirect('/utnbackend/v1/users')

    }

);


export { loginRouter };