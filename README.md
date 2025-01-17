# Sinapsis-SMS

## Descripción
Este proyecto es una API Serverless basada en AWS Lambda para gestionar mensajes SMS y campañas de manera eficiente. La configuración está diseñada para funcionar con variables de entorno para distintos entornos y con soporte offline para desarrollo local.

---

## Requisitos Previos

- **Node.js**: Recomendado v16.x o superior.
- **Serverless Framework**: Instalado globalmente:
  ```bash
  npm install -g serverless
  ```
- **AWS CLI**: Configurado con credenciales.
- **Plugins necesarios:**
  - `serverless-offline`
  - `serverless-dotenv-plugin`

---

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/alesslds/sinapsis_sms.git
   cd sinapsis-sms
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea los archivos `.env` para cada entorno. Por ejemplo:
   ```plaintext
   # Archivo .env.dev
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=root
   DB_NAME=sinapsis_db
   ```

---

## Documentación y Base de Datos

### Especificación OpenAPI
En la carpeta `docs` se encuentra el archivo `openapi.yaml`, que puede ser visualizado utilizando Swagger. Puedes usar la herramienta en línea [Swagger Editor](https://editor.swagger.io/) para cargar y visualizar el archivo.

### Script de Base de Datos
En la misma carpeta `docs`, se encuentra el archivo `mysql_req_1.sql`, que contiene el script necesario para crear la base de datos requerida por la aplicación.

---

## Uso

### Desarrollo local

Para ejecutar el entorno local con Serverless Offline:
```bash
serverless offline start
```

### Despliegue a AWS

Para desplegar el proyecto en AWS:
```bash
serverless deploy
```

### Ejemplo de endpoint con actual version desplegada

Reporte de mensajes para Febrero 2024:
```
https://xnbashnubf.execute-api.us-east-1.amazonaws.com/dev/reportes/mensajes?mes=2&anio=2024
```


### Endpoints disponibles

- **GET /reportes/mensajes**: Lista los mensajes activos.
- **POST /campanias**: Crea una nueva campaña.

---

## Plugins Utilizados

### Serverless Offline
Permite ejecutar y probar la API localmente:
```bash
npm install serverless-offline
```

### Serverless Dotenv Plugin
Carga las variables de entorno desde un archivo `.env`:
```bash
npm install serverless-dotenv-plugin --legacy-peer-deps
```

---

## Solución de Problemas

### Error: `serverless-dotenv-plugin` no encontrado
1. Asegúrate de que está instalado:
   ```bash
   npm install serverless-dotenv-plugin --legacy-peer-deps
   ```
2. Verifica que esté incluido en el archivo `serverless.yml` bajo la sección `plugins`.

### Error: Dependencias incompatibles
Usa el flag `--legacy-peer-deps` o `--force` al instalar dependencias.

---

## Contacto

- **Autor:** Joel Litano
- **Email:** joel.litanoliza@gmail.com
- **Repositorio:** [https://github.com/alesslds/sinapsis_sms.git](#)



