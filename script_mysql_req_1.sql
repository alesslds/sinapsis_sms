-- 1. Crear la base de datos
CREATE DATABASE IF NOT EXISTS sinapsis_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE sinapsis_db;

-- 2. Tabla: cliente
CREATE TABLE IF NOT EXISTS cliente (
  idCliente INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  estado TINYINT(1) NOT NULL DEFAULT 1,  -- 0 = Inactivo, 1 = Activo
  CONSTRAINT ck_cliente_estado CHECK (estado IN (0,1))
) ENGINE=InnoDB;

-- 3. Tabla: usuario
CREATE TABLE IF NOT EXISTS usuario (
  idUsuario INT AUTO_INCREMENT PRIMARY KEY,
  idCliente INT NOT NULL,
  usuario VARCHAR(30) NOT NULL,
  estado TINYINT(1) NOT NULL DEFAULT 1,  -- 0 = Inactivo, 1 = Activo
  CONSTRAINT ck_usuario_estado CHECK (estado IN (0,1)),
  CONSTRAINT fk_usuario_cliente
    FOREIGN KEY (idCliente)
    REFERENCES cliente (idCliente)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 4. Tabla: campania
CREATE TABLE IF NOT EXISTS campania (
  idCampania INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  idUsuario INT NOT NULL,
  fechaHoraProgramacion DATETIME NOT NULL,
  estado TINYINT(1) NOT NULL DEFAULT 1,  -- 0 = Inactivo, 1 = Activo
  CONSTRAINT ck_campania_estado CHECK (estado IN (0,1)),
  CONSTRAINT fk_campania_usuario
    FOREIGN KEY (idUsuario)
    REFERENCES usuario (idUsuario)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 5. Tabla: mensaje
CREATE TABLE IF NOT EXISTS mensaje (
  idMensaje INT AUTO_INCREMENT PRIMARY KEY,
  idCampania INT NOT NULL,
  estadoEnvio INT NOT NULL,    -- 1 = Pendiente, 2 = Enviado, 3 = Error
  fechaHoraEnvio DATETIME,
  mensaje VARCHAR(160) NOT NULL,
  estado TINYINT(1) NOT NULL DEFAULT 1,  -- 0 = Inactivo, 1 = Activo
  CONSTRAINT ck_mensaje_estado CHECK (estado IN (0,1)),
  CONSTRAINT ck_mensaje_estadoEnvio CHECK (estadoEnvio IN (1,2,3)),
  CONSTRAINT fk_mensaje_campania
    FOREIGN KEY (idCampania)
    REFERENCES campania (idCampania)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;


-- Indice para optimizar filtrado en endpoint de reportes
CREATE INDEX idx_estado_fecha ON mensaje (estado, fechaHoraEnvio);
CREATE INDEX idx_usuario_estado ON campania(idUsuario, estado);



