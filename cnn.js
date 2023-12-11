const express = require('express');
const bodyParse = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const port = process.env.PORT || 4000;
const { client } = require('./database');
const app = express();
const { response } = require('express');
const moment = require('moment-timezone');

app.use(bodyParse.urlencoded({ extended: false }));
app.use(bodyParse.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("Hola mundo");
}
);

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
      return res.status(401).json({ error: 'Acceso no autorizado. Debe proporcionar un token.' });
  }

  // Verifica si el token comienza con "Bearer"
  if (!token.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Formato de token inválido. Debe comenzar con "Bearer".' });
  }

  // Extrae el token sin la parte "Bearer"
  const tokenWithoutBearer = token.slice(7);

  jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET || 'defaultSecretKey', (err, decoded) => {
      if (err) {
          if (err.name === 'TokenExpiredError') {
              return res.status(401).json({ error: 'Token ha expirado.' });
          } else {
              return res.status(403).json({ error: 'Token incorrecto o vencido.' });
          }
      } else {
          req.user = decoded;
          next();
      }
  });
};


app.post('/login', async (req, res) => {
  const { codigo_usuario, contrasenia_usuario} = req.body;

   try {
      // Realiza una consulta SQL para obtener el usuario con el nombre proporcionado
      const query = 'SELECT * FROM usuarios WHERE codigo_usuario = $1';
      const result = await client.query(query, [codigo_usuario]);

      // Verifica si se encontró un usuario con ese nombre
      if (result.rows.length === 0) {
          return res.status(401).json({ error: 'Credenciales incorrectas.' });
      }

      // Compara la contraseña proporcionada con la almacenada en la base de datos
      const hashedPassword = result.rows[0].contrasenia_usuario;  // Ajusta el nombre del campo
      const passwordMatch = await bcrypt.compare(contrasenia_usuario, hashedPassword);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Contraseña incorrecta.', details: 'La comparación de contraseñas no coincidió.' });
    }

      // Si las credenciales son válidas, emite un token JWT
      const token = jwt.sign({ codigo_usuario }, process.env.JWT_SECRET || 'defaultSecretKey', { expiresIn: '24h' });
      res.json({ token });

  } catch (error) {
      console.error('Error al realizar la autenticación', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

app.post('/registroUsuarios', async (req, res) => {
  const { nombres_usuario, apellidos_usuario, codigo_usuario, contrasenia_usuario, rol_id, estado_usuario } = req.body;

  try {
      // Verifica si el usuario ya existe en la base de datos
      const existingUserQuery = 'SELECT * FROM usuarios WHERE codigo_usuario = $1';
      const existingUserResult = await client.query(existingUserQuery, [codigo_usuario]);

      if (existingUserResult.rows.length > 0) {
          return res.status(400).json({ error: 'El usuario ya existe.' });
      }

      // Encripta la contraseña antes de almacenarla en la base de datos
      const hashedPassword = await bcrypt.hash(contrasenia_usuario, 10);

      // Inserta el nuevo usuario en la base de datos con la contraseña encriptada
      const insertUserQuery = `INSERT INTO usuarios (nombres_usuario, apellidos_usuario, codigo_usuario, 
                                  contrasenia_usuario, rol_id, estado_usuario) VALUES ($1, $2, $3, $4, $5, $6)`;
      await client.query(insertUserQuery, [nombres_usuario, apellidos_usuario, codigo_usuario, hashedPassword, rol_id, estado_usuario]);

      // Devuelve una respuesta exitosa
      res.status(201).json({ message: 'Usuario registrado con éxito.' });

  } catch (error) {
      console.error('Error al registrar el usuario', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// para obtener todos los productos
app.get('/usuarios', authenticateToken,  async (req, res) => {
    
  const query = 'SELECT * FROM usuarios ORDER BY id_usuario';

  try {
      const result = await client.query(query);
      res.status(200).json(result.rows);
  } catch (error) {
      console.error('Error al obtener los usuarios'. error);
      res.status(400).json({ error: 'Error al obtener los usuarios' });
  }      
});

app.get('/usuarios/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  const query = `SELECT * FROM usuarios WHERE id_usuario = '${id}'`;

     try {
      const result = await client.query(query);
      res.status(200).json(result.rows);
     } catch(error) {
          console.log('Error al obtener un usuario', error);
          res.status(400).json({ error: 'Error al obtener el usuario' }); 
      }
});

app.put('/cambiar_estadoUsuario/:id', authenticateToken, async (req, res) =>{
  const { id } = req.params;
  const { estado_usuario } = req.body;

  const query = `UPDATE usuarios SET estado_usuario = $1 WHERE id_usuario = '${id}'`;
  const values = [estado_usuario];

  try {
      await client.query(query, values);
      res.status(200).json({ message: 'Estado del usuario actualizado exitosamente' });
  } catch (error) {
      console.log('Error al actualizar el estado del usuario', error);
      res.status(400).json({ error: 'Error al actualizar el estado del usuario' });
  }
});

// para obtener todos los productos
app.get('/productos', authenticateToken, async (req, res) => {
    
    const query = 'SELECT * FROM productos ORDER BY id_producto';

    try {
        const result = await client.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener los clientes'. error);
        res.status(400).json({ error: 'Error al obtener los productos' });
    }      
});

// para obtener un producto
app.get('/productos/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;   

    const query = `SELECT * FROM productos WHERE id_producto = '${id}'`;

       try {
        const result = await client.query(query);
        res.status(200).json(result.rows);
       } catch(error) {
            console.log('Error al obtener un producto', error);
            res.status(400).json({ error: 'Error al obtener el producto' }); 
        }
});

// para insertar un producto
app.post('/productos', authenticateToken, async (req, res) => {
    const {nombre_producto, descripcion_producto, precio_unitario, precio_venta, stock_producto,
            presentacion_producto, categoria_id, marca_id, iva} = req.body;

    const query = `INSERT INTO productos (nombre_producto, descripcion_producto, precio_unitario, precio_venta, 
                    stock_producto, presentacion_producto, categoria_id, marca_id, iva) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
    const values = [nombre_producto, descripcion_producto, precio_unitario, precio_venta, stock_producto, 
                        presentacion_producto, categoria_id, marca_id, iva];
    
    try {
        const result = await client.query(query, values);
        res.status(200).json({message: 'Producto creado con éxito'});
    } catch(error) {
        console.log('Error al insertar un producto', error);
        res.status(400).json({ error: 'Error al insertar el producto' });
    } 
});

// para actualizar un producto
app.put('/productos/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { nombre_producto, descripcion_producto, precio_unitario, presentacion_producto, categoria_id, 
                    marca_id, iva, precio_venta } = req.body;

    const query = `UPDATE productos SET nombre_producto = $1, descripcion_producto = $2,
                    precio_unitario = $3, presentacion_producto = $4, categoria_id = $5,
                    marca_id = $6, iva = $7, precio_venta = $8 WHERE id_producto = '${id}'`;
    const values = [nombre_producto, descripcion_producto, precio_unitario, presentacion_producto,
                    categoria_id, marca_id, iva, precio_venta];

    try {
        await client.query(query, values);
        res.status(200).json({ message: 'Producto actualizado exitosamente' });
    } catch (error) {
        console.log('Error al actualizar un producto', error);
        res.status(400).json({ error: 'Error al actualizar el producto' });
    }
});

// para eliminar un producto
app.delete('/productos/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM productos WHERE id_producto = '${id}'`;

    try {
        await client.query(query);
        res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.log('Error al eliminar un producto', error);
        res.status(400).json({ error: 'Error al eliminar el producto' });
    }    
});

app.get('/buscarProducto/:termino', authenticateToken, async (req, res) => {
    const { termino } = req.params;

    const query = `SELECT * FROM productos 
                  WHERE nombre_producto ILIKE $1 
                  OR descripcion_producto ILIKE $1
                  OR categoria_id::text ILIKE $1
                  OR marca_id::text ILIKE $1
                  OR presentacion_producto ILIKE $1
                  OR precio_unitario::text ILIKE $1
                  OR stock_producto::text ILIKE $1
                  OR id_producto ILIKE $1`;

    try {
        const result = await client.query(query, [`%${termino}%`]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al buscar productos', error);
        res.status(400).json({ error: 'Error al buscar productos' });
    }
});

// Obtener todas las categorías
app.get('/categorias', authenticateToken, async (req, res) => {
    const query = 'SELECT * FROM categorias ORDER BY id_cat';
  
    try {
      const result = await client.query(query);
      res.status(200).json(result.rows);
    } catch (error) {
      console.log('Ocurrió un error al obtener las categorías', error);
      res.status(400).json({ error: 'Error al obtener las categorías' });
    }
  });
  
  // Obtener una categoría por su ID
  app.get('/categorias/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
  
    const query = 'SELECT * FROM categorias WHERE id_cat = $1';
    const values = [id];
  
    try {
      const result = await client.query(query, values);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error al obtener una categoría', error);
      res.status(400).json({ error: 'Error al obtener la categoría' });
    }
  });
  
  // Insertar una nueva categoría
  app.post('/categorias', authenticateToken, async (req, res) => {
    const { nombre_cat } = req.body;
  
    const query = 'INSERT INTO categorias (nombre_cat) VALUES ($1)';
    const values = [nombre_cat];
  
    try {
      const result = await client.query(query, values);
      res.status(201).json({ message: 'Categoría agregada' });
    } catch (error) {
      console.error('Error al agregar una categoría', error);
      res.status(400).json({ error: 'Error al agregar la categoría' });
    }
  });
  
  // Actualizar una categoría por su ID
  app.put('/categorias/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { nombre_cat } = req.body;
  
    const query = 'UPDATE categorias SET nombre_cat = $1 WHERE id_cat = $2';
    const values = [nombre_cat, id];
  
    try {
      const result = await client.query(query, values);
      res.status(200).json({ message: `Categoría con ID ${id} actualizada` });
    } catch (error) {
      console.error('Error al actualizar una categoría', error);
      res.status(400).json({ error: 'Error al actualizar la categoría' });
    }
  });
  
  // Eliminar una categoría por su ID
  app.delete('/categorias/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
  
    const query = 'DELETE FROM categorias WHERE id_cat = $1';
    const values = [id];
  
    try {
      const result = await client.query(query, values);
      res.status(200).json({ message: 'Categoría eliminada' });
    } catch (error) {
      console.error('Error al eliminar una categoría', error);
      res.status(400).json({ error: 'Error al eliminar la categoría' });
    }
  });
  
  // Buscar categorías por nombre
  app.get('/buscarCategoria/:nombre', authenticateToken, async (req, res) => {
    const { nombre } = req.params;
  
    const query = 'SELECT * FROM categorias WHERE nombre_cat ILIKE $1';
    const values = [`%${nombre}%`];
  
    try {
      const result = await client.query(query, values);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error al buscar categorías', error);
      res.status(400).json({ error: 'Error al buscar categorías' });
    }
  });
  

//marcas
//obtener listado de marcas
app.get('/marcas', authenticateToken,  async (req, res) => {
    
    const query = 'SELECT * FROM marcas ORDER BY id_marca';

    try {
        const result = await client.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.log('Ocurrio un error al obtener las marcas', error);
        res.status(400).json({ error: 'Error al obtener las marcas' });
    }
});

// Obtener una marca por su ID
app.get('/marcas/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
  
    const query = 'SELECT * FROM marcas WHERE id_marca = $1';
    const values = [id];
  
    try {
      const result = await client.query(query, values);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error al obtener una marca', error);
      res.status(400).json({ error: 'Error al obtener la marca' });
    }
  });

// Insertar una nueva marca
app.post('/marcas', authenticateToken, async (req, res) => {
    const { nombre_marca } = req.body;
  
    const query = 'INSERT INTO marcas (nombre_marca) VALUES ($1)';
    const values = [nombre_marca];
  
    try {
      const result = await client.query(query, values);
      res.status(200).json({ message: 'Marca agregada' });
    } catch (error) {
      console.error('Error al agregar una marca', error);
      res.status(400).json({ error: 'Error al agregar la marca' });
    }
  });

// Actualizar una marca por su ID
app.put('/marcas/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { nombre_marca } = req.body;
  
    const query = 'UPDATE marcas SET nombre_marca = $1 WHERE id_marca = $2';
    const values = [nombre_marca, id];
  
    try {
      const result = await client.query(query, values);
      res.status(200).json({ message: `Marca con ID ${id} actualizada` });
    } catch (error) {
      console.error('Error al actualizar una marca', error);
      res.status(400).json({ error: 'Error al actualizar la marca' });
    }
});

// Eliminar una marca por su ID
app.delete('/marcas/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
  
    const query = 'DELETE FROM marcas WHERE id_marca = $1';
    const values = [id];
  
    try {
      const result = await client.query(query, values);
      res.status(200).json({ message: 'Marca eliminada' });
    } catch (error) {
      console.error('Error al eliminar una marca', error);
      res.status(400).json({ error: 'Error al eliminar la marca' });
    }
});

// Buscar marcas por nombre
app.get('/buscarMarcas/:nombre', authenticateToken, async (req, res) => {
    const { nombre } = req.params;
  
    const query = 'SELECT * FROM marcas WHERE nombre_marca ILIKE $1';
    const values = [`%${nombre}%`];
  
    try {
      const result = await client.query(query, values);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error al buscar marcas', error);
      res.status(400).json({ error: 'Error al buscar marcas' });
    }
});

//
/** Clientes */
// Obtener todos los clientes
app.get('/clientes', authenticateToken, async (req, res) => {
    const query = 'SELECT * FROM clientes ORDER BY apellidos_cliente';
  
    try {
      const result = await client.query(query);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error al obtener los clientes', error);
      res.status(400).json({ error: 'Error al obtener los clientes' });
    }
});
  
// Obtener un cliente por su cédula
app.get('/clientes/:cedula', authenticateToken, async (req, res) => {
    const { cedula } = req.params;
  
    const query = 'SELECT * FROM clientes WHERE cedula_cliente = $1';
    const values = [cedula];
  
    try {
      const result = await client.query(query, values);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error al obtener un cliente', error);
      res.status(400).json({ error: 'Error al obtener el cliente' });
    }
});

// Insertar un nuevo cliente
app.post('/clientes', authenticateToken, async (req, res) => {
    const { cedula_cliente, nombres_cliente, apellidos_cliente, direccion, telefono } = req.body;
  
    const query = `INSERT INTO clientes (cedula_cliente, nombres_cliente, apellidos_cliente, direccion, 
                        telefono) VALUES ($1, $2, $3, $4, $5)`;
    const values = [cedula_cliente, nombres_cliente, apellidos_cliente, direccion, telefono];
  
    try {
      const result = await client.query(query, values);
      res.status(201).json({ message: 'Cliente agregado' });
    } catch (error) {
      console.error('Error al agregar un cliente', error);
      res.status(400).json({ error: 'Error al agregar el cliente' });
    }
  });

// Actualizar un cliente por su cédula
app.put('/clientes/:cedula', authenticateToken, async (req, res) => {
    const { cedula } = req.params;
    const { nombres_cliente, apellidos_cliente, direccion, telefono } = req.body;
  
    const query = `UPDATE clientes SET nombres_cliente = $1, apellidos_cliente = $2, direccion = $3, 
                        telefono = $4 WHERE cedula_cliente = $5`;
    const values = [nombres_cliente, apellidos_cliente, direccion, telefono, cedula];
  
    try {
      const result = await client.query(query, values);
      res.status(200).json({ message: `Cliente con cédula ${cedula} actualizado` });
    } catch (error) {
      console.error('Error al actualizar un cliente', error);
      res.status(400).json({ error: 'Error al actualizar el cliente' });
    }
});

// Eliminar un cliente por su cédula
app.delete('/clientes/:cedula', authenticateToken, async (req, res) => {
    const { cedula } = req.params;
  
    const query = 'DELETE FROM clientes WHERE cedula_cliente = $1';
    const values = [cedula];
  
    try {
      const result = await client.query(query, values);
      res.status(200).json({ message: 'Cliente eliminado' });
    } catch (error) {
      console.error('Error al eliminar un cliente', error);
      res.status(400).json({ error: 'Error al eliminar el cliente' });
    }
});

// Buscar clientes por nombre
app.get('/buscarClientes/:nombre', authenticateToken, async (req, res) => {
    const { nombre } = req.params;
  
    const query = `SELECT * FROM clientes WHERE cedula_cliente ILIKE $1 OR nombres_cliente ILIKE $1 OR 
                    apellidos_cliente ILIKE $1 OR direccion ILIKE $1 OR telefono ILIKE $1`;
    const values = [`%${nombre}%`];
  
    try {
      const result = await client.query(query, values);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error al buscar clientes', error);
      res.status(400).json({ error: 'Error al buscar clientes' });
    }
});

/** Proveedores */
// Obtener todos los proveedores
  app.get('/proveedores', authenticateToken, async (req, res) => {
    const query = 'SELECT * FROM proveedores ORDER BY id_proveedor';
  
    try {
      const result = await client.query(query);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error al obtener los proveedores', error);
      res.status(400).json({ error: 'Error al obtener los proveedores' });
    }
  });
  
  // Obtener un proveedor por su ID
  app.get('/proveedores/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
  
    const query = 'SELECT * FROM proveedores WHERE id_proveedor = $1';
    const values = [id];
  
    try {
      const result = await client.query(query, values);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error al obtener un proveedor', error);
      res.status(400).json({ error: 'Error al obtener el proveedor' });
    }
  });
  
  // Insertar un nuevo proveedor
  app.post('/proveedores', authenticateToken, async (req, res) => {
    const { ruc_proveedor, nombre_proveedor, direccion_proveedor, telefono_proveedor, email_proveedor } = req.body;
  
    const query = `INSERT INTO proveedores (ruc_proveedor, nombre_proveedor, direccion_proveedor, 
                        telefono_proveedor, email_proveedor) VALUES ($1, $2, $3, $4, $5)`;
    const values = [ruc_proveedor, nombre_proveedor, direccion_proveedor, telefono_proveedor, email_proveedor];
  
    try {
      const result = await client.query(query, values);
      res.status(201).json({ message: 'Proveedor agregado' });
    } catch (error) {
      console.error('Error al agregar un proveedor', error);
      res.status(400).json({ error: 'Error al agregar el proveedor' });
    }
  });
  
  // Actualizar un proveedor por su ID
  app.put('/proveedores/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { ruc_proveedor, nombre_proveedor, direccion_proveedor, telefono_proveedor, email_proveedor } = req.body;
  
    const query = `UPDATE proveedores SET ruc_proveedor = $1, nombre_proveedor = $2, direccion_proveedor = $3, 
                        telefono_proveedor = $4, email_proveedor = $5 WHERE id_proveedor = $6`;
    const values = [ruc_proveedor, nombre_proveedor, direccion_proveedor, telefono_proveedor, 
                            email_proveedor, id];
  
    try {
      const result = await client.query(query, values);
      res.status(200).json({ message: `Proveedor con ID ${id} actualizado` });
    } catch (error) {
      console.error('Error al actualizar un proveedor', error);
      res.status(400).json({ error: 'Error al actualizar el proveedor' });
    }
  });
  
  // Eliminar un proveedor por su ID
  app.delete('/proveedores/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
  
    const query = 'DELETE FROM proveedores WHERE id_proveedor = $1';
    const values = [id];
  
    try {
      const result = await client.query(query, values);
      res.status(200).json({ message: 'Proveedor eliminado' });
    } catch (error) {
      console.error('Error al eliminar un proveedor', error);
      res.status(400).json({ error: 'Error al eliminar el proveedor' });
    }
  });
  
 // Obtener todas las compras
 app.get('/compras', authenticateToken, async (req, res) => {
    const query = 'SELECT * FROM compras ORDER BY id_compra';
  
    try {
      const result = await client.query(query);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error al obtener las compras', error);
      res.status(400).json({ error: 'Error al obtener las compras' });
    }
  });

  // Obtener una compra por su ID
  app.get('/compras/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
  
    const query = 'SELECT * FROM compras WHERE id_compra = $1';
    const values = [id];
  
    try {
      const result = await client.query(query, values);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error al obtener una compra', error);
      res.status(400).json({ error: 'Error al obtener la compra' });
    }
  });

// detalle de compras
app.get('/detalle_compras', authenticateToken,  async (req, res) => {

    const query = 'SELECT * FROM detalle_compras ORDER BY id_detalle_compra';

    try {
        const result = await client.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener el detalle compras', error);
        res.status(400).json({error: 'Error al obtener el detalle compras'});
    }
});

// para obtener un detalle de compra
app.get('/detalle_compras/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    const query = `SELECT * FROM detalle_compras WHERE id_detalle_compra = ${id}`;

    try {
        const result = await client.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener un detalle compra', error);
        res.status(400).json({ error: 'Error al obtener el detalle compra' });
    }        
});

//que sea vea el detalle de la compra con el id de la compra
app.get('/detallecompras/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    const query = `SELECT * FROM detalle_compras WHERE compra_id = ${id}`;

    try {
        const result = await client.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener una compra con detalles', error);
        res.status(400).json({ error: 'Error al obtener la compra con detalle' });
    } 
}); 

app.post('/registrarcompras', authenticateToken, async (req, res) => {
    const { fecha_compra, proveedor_id, total, detalles } = req.body;
  
    try {
      // Empezamos una transacción para insertar los datos de la compra y sus detalles en forma atómica
      await client.query('BEGIN');
  
      // Insertamos los datos de la compra
      const compraInsertQuery = `INSERT INTO compras (fecha_compra, proveedor_id, total) 
                                    VALUES ($1, $2, $3) RETURNING id_compra`;
      const compraInsertValues = [fecha_compra, proveedor_id, total];
      const compraResult = await client.query(compraInsertQuery, compraInsertValues);
      const idCompra = compraResult.rows[0].id_compra;
  
      // Insertamos los detalles de la compra
      const detalleInsertPromises = detalles.map(detalle => {
        const { producto_id, cantidad, precio_unitario, iva } = detalle;
        const detalleQuery = `INSERT INTO detalle_compras(compra_id, producto_id, cantidad, 
                                precio_unitario, iva) VALUES ($1, $2, $3, $4, $5)`;
        const detalleValues = [idCompra, producto_id, cantidad, precio_unitario, iva];
        return client.query(detalleQuery, detalleValues);
      });
  
      await Promise.all(detalleInsertPromises);
  
      // Si todo salió bien, hacemos commit
      await client.query('COMMIT');
  
      // Actualizamos el stock de los productos
      const updateStockPromises = detalles.map(detalle => {
        const { producto_id, cantidad } = detalle;
        const updateStockQuery = `UPDATE productos SET stock_producto = stock_producto + $1 
                                    WHERE id_producto = $2`;
        const updateStockValues = [cantidad, producto_id];
        return client.query(updateStockQuery, updateStockValues);
      });
  
      await Promise.all(updateStockPromises);
  
      // Obtener la fecha y hora actual con zona horaria de Ecuador
      const fechaInventario = moment().tz('America/Guayaquil').format('YYYY-MM-DD HH:mm:ss');
      const operacion = 'INGRESOS';
  
      // Registramos el movimiento en el inventario
      const insertInventarioPromises = detalles.map(detalle => {
        const { producto_id, cantidad } = detalle;
        const insertInventarioQuery = `INSERT INTO inventario (producto_id, cantidad, operacion, 
                                            fecha_inventario) VALUES ($1, $2, $3, $4)`;
        const insertInventarioValues = [producto_id, cantidad, operacion, fechaInventario];
        return client.query(insertInventarioQuery, insertInventarioValues);
      });
  
      await Promise.all(insertInventarioPromises);
  
      res.status(201).json({ message: 'Compra registrada correctamente' });
    } catch (error) {
      // Si algo salió mal, hacemos rollback
      await client.query('ROLLBACK');
      console.error(error);
      res.status(400).json({ error: 'Error al registrar compra' });
    }
  });

  // Obtener listado de inventario
  app.get('/inventario', authenticateToken, async (req, res) => {
    try {
        const query = 'SELECT * FROM inventario ORDER BY fecha_inventario DESC';
        const response = await client.query(query);
        res.json(response.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener el inventario' });
    }
  });

  // Obtener listado de inventario por ID
  app.get('/inventario/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM inventario WHERE id_inventario = $1';
        const response = await client.query(query, [id]);
        if (response.rows.length === 0) {
            res.status(404).json({ error: 'No se encontró el registro de inventario con el ID proporcionado' });
        } else {
            res.json(response.rows);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener el registro de inventario' });
    }
  });

  // Obtener todas las ventas
  app.get('/ventas', authenticateToken, async (req, res) => {
    const query = 'SELECT * FROM ventas ORDER BY id_venta';

    try {
      const result = await client.query(query);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error al obtener las ventas', error);
      res.status(400).json({ error: 'Error al obtener las ventas' });
    }
  });

  // Obtener una venta por su ID
  app.get('/ventas/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    const query = 'SELECT * FROM ventas WHERE id_venta = $1';
    const values = [id];

    try {
      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'No se encontró la venta con el ID proporcionado' });
      } else {
        res.status(200).json(result.rows);
      }
    } catch (error) {
      console.error('Error al obtener una venta', error);
      res.status(400).json({ error: 'Error al obtener la venta' });
    }
  });

  //detalle ventas
  app.get('/detalle_ventas', authenticateToken, async (req, res) => {
    try {
        const query = 'SELECT * FROM detalle_ventas ORDER BY id_detalle_venta';
        const result = await client.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener los detalles de ventas', error);
        res.status(400).json({ error: 'Error al obtener los detalles de ventas' });
    }
  });

  // detalle ventas por id
  app.get('/detalle_ventas/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
      const query = 'SELECT * FROM detalle_ventas WHERE id_detalle_venta = $1';
      const values = [id];
      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'No se encontró el detalle de venta con el ID proporcionado' });
      } else {
        res.status(200).json(result.rows);
      } 
    } catch (error) {
      console.error('Error al obtener un detalle de venta', error);
      res.status(400).json({ error: 'Error al obtener el detalle de venta' });
    }
  });

  //que sea vea el detalle de la venta con el id de la venta
  app.get('/detalleventas/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
      const query = 'SELECT * FROM detalle_ventas WHERE venta_id = $1';
      const values = [id];
      const result = await client.query(query, values);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error al obtener los detalles de venta para una venta específica', error);
      res.status(400).json({ error: 'Error al obtener los detalles de venta' });
    }
  });

  // registrar venta
  app.post('/registrarventas', authenticateToken, async (req, res) => {
    const { fecha_venta, total, forma_pago, cliente_id, detalles } = req.body;

    try {
      // Iniciamos una transacción para insertar los datos de la venta y sus detalles de forma atómica
      await client.query('BEGIN');

      // Registramos la venta
      const insertVentaQuery = `INSERT INTO ventas (fecha_venta, total, forma_pago, cliente_id)
                              VALUES ($1, $2, $3, $4) RETURNING id_venta`;
      const values = [fecha_venta, total, forma_pago, cliente_id];
      const ventaResult = await client.query(insertVentaQuery, values);
      const idVenta = ventaResult.rows[0].id_venta;

      // Registramos los detalles de la venta
      const insertDetalleVentaPromises = detalles.map(detalle => {
        const { producto_id, cantidad, precio_unitario, iva } = detalle;
        const detalleQuery = `INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, 
                                precio_unitario, iva) VALUES ($1, $2, $3, $4, $5)`;
        const detalleValues = [idVenta, producto_id, cantidad, precio_unitario, iva];
        return client.query(detalleQuery, detalleValues);
      });

      await Promise.all(insertDetalleVentaPromises);

      // Si todo salió bien, hacemos commit
      await client.query('COMMIT');

      // Actualizamos el inventario
      const updateStockPromises = detalles.map(detalle => {
        const { producto_id, cantidad } = detalle;
        const updateStockQuery = `UPDATE productos SET stock_producto = stock_producto - $1 
                                      WHERE id_producto = $2`;
        const updateStockValues = [cantidad, producto_id];
        return client.query(updateStockQuery, updateStockValues);
      });

      await Promise.all(updateStockPromises);

      // Obtener la fecha y hora actual con zona horaria de Ecuador
      const fechaInventario = moment().tz('America/Guayaquil').format('YYYY-MM-DD HH:mm:ss');
      const operacion = 'EGRESOS';

      // Registramos el movimiento en el inventario
      const insertInventarioPromises = detalles.map(detalle => {
        const { producto_id, cantidad } = detalle;
        const insertInventarioQuery = `INSERT INTO inventario (producto_id, cantidad, operacion, 
                                        fecha_inventario) VALUES ($1, $2, $3, $4)`;
        const insertInventarioValues = [producto_id, cantidad, operacion, fechaInventario];
        return client.query(insertInventarioQuery, insertInventarioValues);
      });

      await Promise.all(insertInventarioPromises);

      res.status(201).json({message: 'Venta registrada correctamente'});
    } catch (error) {
      // Si algo salió mal, hacemos rollback
      await client.query('ROLLBACK');
      console.error(error);
      res.status(400).json({error: 'Error al registrar la venta'});
    }
  });

  // Obtener todas las facturas
  app.get('/facturas', authenticateToken, async (req, res) => {
    try {
        const query = 'SELECT * FROM facturas ORDER BY fecha_emision';
        const result = await client.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener las facturas', error);
        res.status(400).json({ error: 'Error al obtener las facturas' });
    }
  });

  // Obtener una factura por su ID
  app.get('/facturas/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'SELECT * FROM facturas WHERE id_factura = $1';
        const values = [id];
        const result = await client.query(query, values);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener una factura', error);
        res.status(400).json({ error: 'Error al obtener la factura' });
    }
  });

  // Obtener el detalle de la factura con el ID de la factura
  app.get('/detallefacturas/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'SELECT * FROM detalle_facturas WHERE factura_id = $1';
        const values = [id];
        const result = await client.query(query, values);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener el detalle de la factura', error);
        res.status(400).json({ error: 'Error al obtener el detalle de la factura' });
    }
  });

  // Ver la factura con su detalle de facturas
  app.get('/facturas/:id/detalle', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const facturaQuery = 'SELECT * FROM facturas WHERE id_factura = $1';
        const detalleQuery = 'SELECT * FROM detalle_facturas WHERE factura_id = $1';

        const facturaValues = [id];
        const detalleValues = [id];

        const facturaResult = await client.query(facturaQuery, facturaValues);
        const detalleResult = await client.query(detalleQuery, detalleValues);

        const factura = facturaResult.rows[0];
        const detalleFacturas = detalleResult.rows;

        res.status(200).json({ factura, detalleFacturas });
    } catch (error) {
        console.error('Error al obtener la factura con su detalle de facturas', error);
        res.status(400).json({ error: 'Error al obtener la factura con su detalle de facturas' });
    }
  });

  //registrar facturas
  app.post('/registrarfacturas', authenticateToken, async (req, res) => {
    const { total, forma_pago, cliente_id, detalles } = req.body;

    try {
        // Iniciamos la transacción
        await client.query('BEGIN');

        const fechaEmision = moment().tz('America/Guayaquil').format('YYYY-MM-DD HH:mm:ss');

        // Registramos la factura
        const insertFacturaQuery = `INSERT INTO facturas (fecha_emision, total, forma_pago, cliente_id)
                                    VALUES ($1, $2, $3, $4) RETURNING id_factura`;
        const facturaValues = [fechaEmision, total, forma_pago, cliente_id];

        const facturaResult = await client.query(insertFacturaQuery, facturaValues);
        const idFactura = facturaResult.rows[0].id_factura;

        // Registramos los detalles de la factura
        const insertDetalleFacturaPromises = detalles.map(detalle => {
            const { producto_id, cantidad, precio_unitario, iva } = detalle;
            const detalleQuery = `INSERT INTO detalle_facturas (factura_id, producto_id, cantidad, 
                                    precio_unitario, iva) VALUES ($1, $2, $3, $4, $5)`;
            const detalleValues = [idFactura, producto_id, cantidad, precio_unitario, iva];
            return client.query(detalleQuery, detalleValues);
        });

        await Promise.all(insertDetalleFacturaPromises);

        // Si todo salió bien, hacemos commit
        await client.query('COMMIT');
        res.status(201).json({message: 'Factura registrada correctamente'});
    } catch (error) {
        // Si algo salió mal, hacemos rollback
        await client.query('ROLLBACK');
        console.error(error);
        res.status(400).json({error: 'Error al registrar la factura'});
    }
  });

  app.listen(port, () => {
      console.log(`Escuchando en el puerto: http://localhost:${port}`);
  });
