// middleware/authorize.js
const authorize = (roles, modules) => {
    return (req, res, next) => {

        // Verificar si el usuario está autenticado
        if (!req.isAuthenticated()) {
            return res.status(401).json({ error: 'No autenticado' });
        }

        // Verificar si req.user y req.user.roles están definidos
        if (!req.user || !req.user.roles || !req.user.modules) {
            return res.status(403).json({ error: 'Acceso no autorizado' });
        }

        const userRoles = req.user.roles || [];
        const userModules = req.user.modules || [];

        // Verifica si el usuario tiene al menos uno de los roles requeridos
        const hasRequiredRoles = roles.some(role => userRoles.includes(role));

        // Verifica si el usuario tiene al menos uno de los módulos requeridos
        const hasRequiredModules = modules.some(module => userModules.includes  (module));

        if (hasRequiredRoles && hasRequiredModules) {
            next(); // Usuario autorizado, permite el acceso a la ruta
        } else {
            res.status(403).json({ error: 'Acceso no autorizado' });
        }
    };
};

export { authorize };

  