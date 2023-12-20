import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Metadata info about our API
const options = {
    definition: {
        openapi: "3.0.0",
        info: { title: 'UTN Backend', version: "1.0.0", description: 'API for UTN Backend' },
    },
    apis: ['routes/users.js', 'routes/modules.js', 'routes/roles.js', 'routes/assignments_modules.js',
            'routes/events.js' , 'routes/assignments_events.js', 'routes/classroom.js', 
            'routes/assignments_class.js', 'routes/class_score.js', 'routes/auditing.js', 'database.js'],
};

const swaggerSpecs = swaggerJSDoc(options);

const swaggerDocs = (app, port) => {
    app.use('/utnbackend/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
    app.get('/utnbackend/v1/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpecs);
    });
    console.log(`Swagger Docs running at http://localhost:${port}/utnbackend/v1/docs`);
};

export { swaggerDocs };

