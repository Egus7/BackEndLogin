import passport from "passport";   
import { Strategy as MicrosoftStrategy } from "passport-microsoft";
import { config } from "dotenv";
import { client } from '../database/database.js';
import { getUserDesByID } from "../controllers/usersController.js" 

config()

passport.serializeUser(function (user, done) {
    if (user && user.id) {
        done(null, user.id);
    } else {
        console.error('Invalid user object:', user);
        done(new Error("Invalid user object"), null);
    }
});

passport.deserializeUser(async function (id, done) {
    try {
      const user = await getUserDesByID(id);

      if (!user) {
        console.error('Usuario no encontrado');
        return done(null, false);
      }
      console.log('usuario es: ', user.user_full_name);

      // Obtener asignaciones de roles y módulos
      const assignmentsQueryResult = 
            await client.query(`
                SELECT am.assignment_id, r.rol_name, u.user_full_name , m.module_name
                FROM assignments_modules AS am
                INNER JOIN roles AS r ON am.rol_id = r.rol_id
                INNER JOIN modules AS m ON am.module_id = m.module_id
                INNER JOIN users AS u ON am.user_id = u.user_id WHERE u.user_id = $1`, [user.user_id]);
      const roles = assignmentsQueryResult.rows.map(row => row.rol_name);
      console.log('roles:', roles);
      const modules = assignmentsQueryResult.rows.map(row => row.module_name);
      console.log('modulos:', modules);
      // Pasar roles y módulos al completar la deserialización
      done(null, { user, roles, modules });
    } catch (error) {
      done(error, null);
    }
});

  

passport.use(
    "auth-microsoft",
    new MicrosoftStrategy({
        clientID: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/microsoft/callback",
        scope: ["user.read", "calendars.read", "mail.read", "offline_access"],
        authorizationURL: 'https://login.microsoftonline.com/8dbe1469-c79c-4e21-9d43-ca65d9e9c475/oauth2/v2.0/authorize',
        tokenURL: 'https://login.microsoftonline.com/8dbe1469-c79c-4e21-9d43-ca65d9e9c475/oauth2/v2.0/token',
    }, async function (req, accessToken, refreshToken, profile, done) {
        try {

            console.log('token:', accessToken);
            // Consultar el usuario por su user_code
            const userQueryResult = await client.query('SELECT * FROM users WHERE user_code = $1', [profile.id]);
            let userFromDB;

            if (userQueryResult.rows.length > 0) {
                // Si el usuario ya existe en la base de datos, obtener el primer resultado
                userFromDB = userQueryResult.rows[0];
                console.log("El usuario ya está registrado");
            } else {
                // Si el usuario no existe, insertarlo en la base de datos
                const userData = {
                    user_code: profile.id,
                    user_full_name: profile.displayName,
                    user_first_name: profile.name.givenName,
                    user_last_name: profile.name.familyName,
                    user_email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : "",
                    user_phone_number: profile._json.mobilePhone || "",
                    user_state: true,
                    user_date_register: new Date(), // Fecha/hora actual            
                };

                const insertResult = await client.query(`
                    INSERT INTO users (user_code, user_full_name, user_first_name, user_last_name, user_email, 
                        user_phone_number, user_state, user_date_register) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    ON CONFLICT (user_code) DO NOTHING
                    RETURNING *;
                `, [
                    userData.user_code, userData.user_full_name, userData.user_first_name, 
                    userData.user_last_name, userData.user_email, userData.user_phone_number,
                    userData.user_state, userData.user_date_register
                ]);

                // Obtener el usuario insertado
                userFromDB = insertResult.rows[0];
                console.log("Usuario registrado con éxito");
            }

            /*if (req.session) {
              console.log('Asignando roles y módulos a req.session');
              req.session.roles = assignmentsQueryResult.rows.map(row => row.rol_id);
              req.session.modules = assignmentsQueryResult.rows.map(row => row.module_id);
            }*/
        
            // Llamar a la función done para indicar que la autenticación fue exitosa
            done(null, profile);

        } catch (error) {
            console.error("Error al autenticar al usuario", error);
            done(error, null);
        }
    }
));

    





  
  



  

