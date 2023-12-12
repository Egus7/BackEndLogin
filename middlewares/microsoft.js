import passport from "passport";
import { Strategy as MicrosoftStrategy } from "passport-microsoft";
import { config } from "dotenv";
import { client } from "../database.js";

config()

passport.use(
    "auth-microsoft", 
    new MicrosoftStrategy({
        clientID: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/microsoft/callback",
        scope: ["user.read", "calendars.read", "mail.read", "offline_access"],
        authorizationURL: 'https://login.microsoftonline.com/8dbe1469-c79c-4e21-9d43-ca65d9e9c475/oauth2/v2.0/authorize',
        tokenURL: 'https://login.microsoftonline.com/8dbe1469-c79c-4e21-9d43-ca65d9e9c475/oauth2/v2.0/token',
    }, async function (accessToken, refreshToken, profile, done) {
        try {
            const userData = {
                id: profile.id,
                nombres_completos: profile.displayName,
                nombres: profile.name.givenName,
                apellidos: profile.name.familyName,
                email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : "",
                telefono: profile._json.mobilePhone || "",
                cargo: profile._json.jobTitle || "Cargo predeterminado"
            };

            // Guardar el usuario en la base de datos
            const result = await client.query(`
                INSERT INTO usuarios (id, nombres_completos, nombres, apellidos, email, telefono, cargo)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (id) DO NOTHING
            `, [
                userData.id,
                userData.nombres_completos,
                userData.nombres,
                userData.apellidos,
                userData.email,
                userData.telefono,
                userData.cargo
            ]);

            if (result.rowCount > 0) {
                // Usuario registrado con éxito
                console.log("Usuario registrado con éxito");
                done(null, profile);
            } else {
                // El usuario ya existe en la base de datos
                console.log("El usuario ya está registrado");
                done(null, profile);
            }
        } catch (error) {
            console.error("Error al guardar el usuario en la base de datos", error);
            done(error, null);
        }
    }
));

