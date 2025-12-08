# SurtiMovil – Proyecto Final de Bases de Datos Avanzadas  
### MongoDB + Node.js (Express) + React.js  
### README Oficial del Repositorio

---

## Estructura del Repositorio

/server → Backend con Node.js + Express + MongoDB
/client → Frontend con React.js
seed.json → Datos de prueba para poblar la base de datos
.env.example → Variables de entorno requeridas

---

# 1️ Instalación del Proyecto (Backend + Frontend)

## 1. Clonar el repositorio

```bash
git clone https://github.com/TU_REPO/SurtiMovil.git
cd SurtiMovil
```
# 2 Instalación del Proyecto (Backend + Frontend)
```bash
cd server
```
## 1. Instalar dependencias
```bash
npm install
```
## 2. Crear archivo .env
```bash
cp .env.example .env
```
Editar valores:
```bash
MONGO_URI=mongodb+srv://...
JWT_SECRET=tu_clave_segura
PORT=3000

```
## 3. Ejecutar servidor
Modo desarrollo
```bash
npm run dev
```
Modo produccion
```bash
npm start
```
El backend correra en:
```bash
http://localhost:3000/api
```
## 3 Frontend - React.js
```bash
cd client
npm install
npm start

```
## 4 Poblar base de datos
Dentro de /server.
```bash
node seed.js
```
## 5 Descripción Técnica de la Arquitectura
Arquitectura MVC

/models → Modelos Mongoose

/controllers → Lógica de negocio

/routes → Endpoints REST

/middlewares → JWT, roles, validación

/config → Conexión a MongoDB
## 6 Modelado de Datos (MongoDB)
Colecciones principales
# User
name, email, password hash

role (user, admin)

índice por email

# Product

id lógico numérico

name, price, category

validación con required, min, trim

# Order

referencia a User

items como documentos embebidos

total

orderNumber incremental

qrCode

timestamps

# Patrones utilizados

Documentos embebidos (Order.items)

Referencias (Order.user, Product.category)
## 7 Validación de Datos
required

enum

min

Validadores custom

Manejo centralizado de errores

## 8 API REST – Endpoints Principales

Autenticación
```bash
POST /api/auth/login
POST /api/auth/register
```
Productos
```bash
GET    /api/products
POST   /api/products        (admin)
PUT    /api/products/:id    (admin)
DELETE /api/products/:id    (admin)
```
Categorias
```bash
GET  /api/categories
POST /api/categories        (admin)
```
Pedidos
```bash
POST   /api/orders
GET    /api/orders/my
GET    /api/orders              (admin)
PATCH  /api/orders/:id/status   (admin)
POST   /api/orders/:id/generate-qr (admin)
POST   /api/orders/scan-qr
```
Formato de respuesta:
```bash
{
  "success": true,
  "message": "OK",
  "data": {}
}
```
## 9 Aggregations Avanzadas en MongoDB
```bash
Order.aggregate([
  { $unwind: "$items" },
  {
    $lookup: {
      from: "products",
      localField: "items.productId",
      foreignField: "id",
      as: "product"
    }
  },
  { $unwind: "$product" },
  {
    $group: {
      _id: "$product.category",
      totalSales: { $sum: "$items.subtotal" },
      totalQuantity: { $sum: "$items.quantity" }
    }
  },
  { $sort: { totalSales: -1 } }
]);
```
## 10 Indices implementados
Order: { user: 1, createdAt: -1 }

Product: índice por id

Búsqueda por texto opcional
## 11 Frontend React – Integración con API
# Estados UI

Loading

Error

Success

# Componentización

ProductCard

CategorySelector

CartDrawer

OrderHistory

# Comunicación con backend

JWT almacenado en SessionManager

Axios / Fetch

Rutas protegidas

## 12 Como levantar todo el sistema
1. Backend

cd server

npm run dev

2. Frontend

cd client

npm start

3. Abrir navegador

http://localhost:5173

## 13 Variables de entorno
```bash
MONGO_URI=
JWT_SECRET=
PORT=3000
```
## Integrantes
- Luis Ángel Hernández Corrales

- Alejandro Carrasco Maldonado

- Manuel Vito Sáenz Montes