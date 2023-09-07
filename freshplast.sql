-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-09-2023 a las 00:53:40
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `freshplast`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id` int(11) NOT NULL,
  `razonsocial` text NOT NULL,
  `cuit` bigint(14) NOT NULL,
  `situacion` text NOT NULL,
  `ingresosbrutos` int(11) NOT NULL,
  `telefono` int(11) NOT NULL,
  `email` text NOT NULL,
  `calle` text NOT NULL,
  `numero` int(11) NOT NULL,
  `piso` int(11) NOT NULL,
  `provincia` text NOT NULL,
  `localidad` text NOT NULL,
  `codigopostal` int(11) NOT NULL,
  `comentario` text NOT NULL,
  `vendedor` int(11) NOT NULL,
  `credito` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id`, `razonsocial`, `cuit`, `situacion`, `ingresosbrutos`, `telefono`, `email`, `calle`, `numero`, `piso`, `provincia`, `localidad`, `codigopostal`, `comentario`, `vendedor`, `credito`) VALUES
(1, 'BANANA CODE', 30123412341, 'monotributista', 2147483647, 1122529738, 'nicolas.piersanti@gmail.com', 'LIBERTAD', 2589, 1, 'New York', 'New York', 50238, '                          \n                        ', 10, 1000000),
(2, 'Lom Packaging', 20359603224, 'responsableinscripto', 2147483647, 1122275054, 'mariio.ferrari@gmail.com', 'Gorriti', 1165, 0, 'Buenos Aires', 'Lomas de Zamora', 1832, 'Porton Gris                          \n                        ', 9, 0),
(3, 'Nardone Santiago David', 20400211710, 'responsableinscripto', 2147483647, 1160599214, 'Nardonesantiago@gmail.com', 'Alvar NuÃ±ez', 571, 0, 'Buenos Aires', 'Hurlingham', 1686, '\n                        ', 3, 0),
(4, 'Francisco Moya SA', 30708113081, 'responsableinscripto', 2147483647, 2147483647, 'panchi@franciscomoya.com.ar', 'Espejo ', 256, 0, 'Mendoza', 'Coronel Dorrego', 5519, '                          \n                        ', 3, 0),
(5, 'Distribuidora Walter', 27288818334, 'responsableinscripto', 2147483647, 1131186244, 'luchocorrugados@hotmail.com', 'Av del Sesquicentenario', 872, 0, 'Buenos AIres', 'Los Polvorines', 1613, '                          \n                        ', 3, 0),
(6, 'Papelera Envamax', 30716093758, 'responsableinscripto', 2147483647, 1165853596, 'compras@papeleraenvamax.com.ar', 'Av Calchaqui', 312, 0, 'Berazategui', 'Buenos Aires', 1884, '                        ', 5, 0),
(7, 'Christian Cuevas', 20325414678, 'responsableinscripto', 2147483647, 2147483647, 'cuevas.christian@hotmail.com', 'Mariano Fraguiero', 3656, 0, 'Cordoba', 'Cordoba', 5001, ' ', 5, 0),
(8, 'Distribuidora Ejc', 30717928365, 'responsableinscripto', 2147483647, 1133417148, 'Distribuidoraejcenvases@gmail.com', 'Sargento Palma ', 1150, 0, 'Buenos Aires', 'Villa Bosch ', 1681, '                          \n                        ', 5, 0),
(9, 'Papelera Central SRL', 30709524301, 'responsableinscripto', 2147483647, 2147483647, 'pcentralrosario@gmail.com', 'SAN NICOLAS ', 2854, 0, 'SANTA FE', 'ROSARIO ', 2000, '                          \n                        ', 5, 0),
(10, 'Sur Pack MARTIN', 23316402399, 'responsableinscripto', 123456, 1136363279, 'surstretch@gmail.com', 'Buenos Aires', 137, 0, 'Buenos Aires', 'Banfield', 1828, '                          \n                        ', 9, 123987),
(11, 'GAMPACK SRL', 30714558680, 'responsableinscripto', 2147483647, 2147483647, 'mariano@gampack.com.ar', 'AVENIDA SABATTINI ', 2366, 0, 'CORDOBA', 'RIO CUARTO', 5800, '                          Transporte MANENTI \nEstaciÃ³n de carga serena S.R.L.\nDomicilio: Dr. Pedro BaliÃ±a 4060 (parque Patricios)\nTel: 4912-2164\nHorario: 9:00 a 17:00                        ', 5, 0),
(12, 'Papelera Papelmar SRL', 30708730404, 'responsableinscripto', 2147483647, 1153014104, 'info@papelmar.com.ar', 'RECONQUISTA ', 1747, 0, 'BUENOS AIRES', 'CIUDADELA', 1702, 'DIA DE ENTREGA: LUNES A VIERNES\nHORARIO: DE 7:00 A 13:00\n                        ', 5, 0),
(13, 'MARCELO MONSALVO', 23214413299, 'responsableinscripto', 2147483647, 1162195045, 'gabrielalaindependiente@gmail.com', 'tres sarmiento', 1840, 0, 'BUENOS AIRES', 'GERLI', 1869, '                          \n                        ', 9, 0),
(14, 'Sebalen srl', 30708574097, 'responsableinscripto', 2147483647, 1005, 'xrizzo@sebalen.com.ar', 'MARIO BRAVO', 972, 0, 'BUENOS AIRES', 'AVELLANEDA', 1870, '    Direccion de entrega MARIO BRAVO 972/78 AVELLANEDA\nL A J 8 A 15 Y V 8 A 11                      \n                        ', 5, 0),
(15, 'Sur Pack PABLO', 30716006413, 'responsableinscripto', 2147483647, 1136363279, 'surstretch@gmail.com', 'corrientes ', 905, 0, 'chaco', 'chaco', 906, 'IGUAL CARMONA                          \n                        ', 9, 1234),
(16, 'Aluex sa ', 30655837600, 'responsableinscripto', 2147483647, 1136814222, 'ablaquier@gmail.com', 'stephenson ', 3197, 0, 'BUENOS AIRES', 'TORTUGUITAS', 1234, '                   DIRECCION DE ENTREGA: DORREGO 1556 CABA\nLUNES A VIERNES DE 8 A 12 Y DE 13.30 A 16.00       \n                        ', 3, 1234),
(17, 'MASPACK SRL', 30716618842, 'responsableinscripto', 2147483647, 1132027722, 'Distribuidoracya@yahoo.com.ar', 'moreno ', 1948, 0, 'BUENOS AIRES', 'boulogne', 0, '                          DIRECCION DE ENTREGA : MAZZA 2312 BOULOGNE \nLUNES A VIERNES 8 A 13 Y 14 A 17\n                        ', 5, 1234),
(18, 'El mundo del embalaje srl', 30651767918, 'responsableinscripto', 2147483647, 1131512340, 'Carlos@mundoembalaje.com.ar', 'de la siembra y de la semilla ', 0, 0, 'BUENOS AIRES', 'mercado central ', 1771, '                     DIRECCION DE ENTREGA: AUT RICCHIERI SIN NUMERO  \nTAPIALES      MERCADO CENTRAL \nLUNES A VIERNES DE 7  A 15 \n                        ', 5, 1234),
(19, 'Neopel SRL', 30645555593, 'responsableinscripto', 2147483647, 47541121, 'compras@neopel.com.ar', 'CALLE 23 ', 2175, 0, 'BUENOS AIRES', 'VILLA MAIPU', 1650, '                          DIRECCCION DE ENTREGA: CALLE 23 2175 VILLA MAIPU\nLUNES A VIERNES : 8 a 13 y  14 a 16 \n                        ', 5, 1234),
(20, 'FIRST PACKING SRL', 33672234889, 'responsableinscripto', 2147483647, 2147483647, 'horacioravotti1@gmail.com', 'GODOY CRUZ ', 2819, 0, 'MENDOZA', 'GUAYMALLEN', 5521, '      DIRECCIÃ“N DE ENTREGA:    Transporte Amicci\nBeron de Astrada 2774 \nNueva Pompeya                  \n                        ', 3, 1234),
(21, 'Food packaging SRL', 30715152319, 'responsableinscripto', 2147483647, 1169089169, 'Gerencia@foodpackaging.com.ar', 'recuero', 3330, 0, 'BUENOS AIRES', 'capital federal', 1234, '                          DIRECCIÃ“N DE ENTREGA: CHASCOMÃšS  6066 MATEDEROS \nLUNES A VIERNES  9 A 16\n                        ', 3, 1234),
(22, 'VASA DESCARTABLES SRL', 30715518275, 'responsableinscripto', 2147483647, 2147483647, 'COMPRAS@VASADESCARTABLES.COM', 'BULNES ', 2116, 0, 'CORDOBA', 'CORDOBA', 5013, 'DIRECCION DE ENTREGA : TTE HIPPO CARGO  DR PEDRO BALIÃ‘A 3975 POMPEYA\n                        ', 3, 1234),
(23, 'Polibol srl', 30614510419, 'responsableinscripto', 2147483647, 1100000000, 'pedidos@polibol.com.ar', '44 n', 369, 0, 'BUENOS AIRES', 'LA PLATA', 1900, 'DIRECCION DE ENTREGA. 3 NÂº 570 LA PLATA COD POSTAL 1900                          \n                        ', 5, 1234),
(24, 'MARTINEZ JUAN ALBERTO BENJAMIN MARDELPLATA', 20299741428, 'responsableinscripto', 2147483647, 2147483647, 'JUANMARTINEZBACA@GMAIL.COM', 'GASCON ', 55, 1, 'BUENOS AIRES', 'MAR DEL PLATA', 7600, '                          DIRECCION DE ENTREGA: TTE TARRES \n                        ', 3, 1234),
(25, 'PACKING EXPRESS SRL', 33697231469, 'responsableinscripto', 2147483647, 2147483647, 'MONICA@PACKINGENVASES.COM.AR', 'CRISOSTOMO ALVEAR ', 1699, 0, 'TUCUMAN', 'TUCUMAN', 1699, '       DIRECCION DE ENTREGA: TTE LEO RIO CUARTO 3931 ENTRE IGUAZU Y BONAVENA , POMPEYA                  \n                        ', 5, 123456),
(26, 'LADRÃ“N DE GUEVARA MARTÃN ', 20182336972, 'responsableinscripto', 2147483647, 2147483647, 'compras@papelerasanjavier.com.ar', 'Gracia MartÃ­nez ', 148, 0, 'Cordoba ', 'Cordoba ', 5003, '                          DIRECCIÃ“N DE TRANSPORTE; BALBASTRO 3109 flores caba\n                        ', 3, 1234),
(27, 'DISTRIBUIDORA MAYORISTA DE EMBALAJE SRL', 30716674564, 'responsableinscripto', 2147483647, 2147483647, 'COMPRASPLASTIMAC@GMAIL.COM', 'DR FERNANDO  RUIZ ', 3311, 0, 'SANTA FE', 'ROSARIO', 2000, '                          DIRECCION DE ENTREGA: TTE SAN JOSE , LAS CASAS 3553 CABA TEL 4922-1672\n                        ', 5, 123456),
(28, 'LUCIANO URSI', 20394862755, 'responsableinscripto', 2147483647, 112273259, 'Lucianoursi196@gmail.com', 'PARODI ', 2706, 0, 'BUENOS AIRES', 'MORENO', 1644, '                          \n                        DIRECCION DE ENTREGA: AV NESTOR KIRCHNER 2808 MORENO LUNES A VIERNES : 8 A 16 ', 5, 1234),
(29, 'VAN PUBLICIDAD SA', 30656586539, 'responsableinscripto', 2147483647, 1111111111, 'PAPELERACENTRAL@GMAIL.COM', 'JOSE HERNANDEZ', 1856, 0, 'SANTA FE', 'GRANADERO BAIGORRIA', 2152, '      PAPELERA CENTRAL                     \n                        ', 5, 1234),
(30, 'BERTOLINI HNOS SRL', 30707729909, 'responsableinscripto', 2147483647, 2147483647, 'PAPELERABERTOLINI@HOTMAIL.COM', 'LAVALLE ', 1269, 0, 'SANTA FE', 'CAÃ‘ADA DE GOMEZ', 2500, 'EXPRESO CAÃ‘ADA DE GOMEZ      :S :\nSAN JUAN BAUTISTA DE LASALLE 1926...PARQUE AVELLANEDA                    \n                        ', 5, 12345),
(31, 'PAPELERA BARCHIESI SRL', 30709657549, 'responsableinscripto', 2147483647, 2147483647, 'silvia@papelerabarchiesi.com.ar', 'PJE FLORENCIA C', 4558, 0, 'SANTA FE', 'ROSARIO', 2000, '                          \n                        ', 5, 312313),
(32, 'COUSTE MARILINA RUTH', 27249248385, 'responsableinscripto', 2147483647, 2147483647, 'AGUSTINA.PIERSANTI@FRESHPLAS.COM.AR', 'tucuman ', 786, 0, 'BUENOS AIRES', 'BAHIA  BLANCA', 8000, '               DIRECCION DE ENTREGA:  EXPRESO CHAVEZ  PERGAMINO 3751 NAVE B MOD 51 SOLDATI         \n                        ', 5, 123456),
(33, 'BACA LOGISTICA CUYO SAS', 30716898322, 'responsableinscripto', 2147483647, 2147483647, 'JUANMARTINEZBACA@GMAIL.COM', 'MAZA NORTE ', 742, 0, 'MENDOZA', 'MAIPU', 1406, 'DIRECCION DE ENTREGA FERRE 2499 ESQ PEDERNERA (HAMSA) SOLDATI HORARIO L A V 8 A 16                           \n                        ', 3, 162533),
(34, 'JUAN JOSE MERCADE', 20340149719, 'responsableinscripto', 2147483647, 2147483647, 'ENVASESDESCARTABLESTSM@HOTMAIL.COM', 'CHURRUARIN ', 284, 0, 'ENTRE RIOS', 'PARANA', 3100, '                TRANSPORTE A CONVENIR            \n                        ', 3, 1234),
(35, 'LUIS F NARDELLI HNOS SRL', 30585900326, 'responsableinscripto', 2147483647, -147055, 'rcompras@nardellihnos.com.ar', 'MITRE ', 1101, 0, 'SANTA FE', 'RECONQUISTA', 3560, '            DIRECCION DE ENTREGA: EXPRESO SARITA , MATURIN 2854 CABA              \n                        ', 5, 123456),
(36, 'HORNAL SRL', 30715759639, 'responsableinscripto', 2147483647, 1153027702, 'carlosrobertocarralero@yahoo.com.ar', 'OLIDEN', 1636, 0, 'BUENOS AIRES', 'CABA', 1440, '                  DIRECCION DE ENTREGA: OLIDEN 1636 CABA        \n                        ', 5, 12345),
(37, 'Varela Elvio Ruben', 20146865365, 'responsableinscripto', 0, 1122491090, 'info@chairo.com.ar', 'general pintos', 353, 1, 'buenos aires', 'villa madero ', 1768, '            el cliente se llama chairo \n                        ', 3, 0),
(38, 'PAPELERA EL VASQUITO SRL', 30679407011, 'responsableinscripto', 0, -15034, 'administracion@el-vasquito.com.ar', 'AV LA PLATA     ', 1932, 1, 'BUENOS AIRES', 'QUILMES', 1879, '                          NUEVO CLIENTE\n                        ', 3, 0),
(39, 'GLASIK ROBERTO JAVIER', 20233567184, 'responsableinscripto', 0, 2147483647, 'JONATHAN.GLASIK@GMAIL.COM', 'AV LAS HERAS', 865, 1, 'MISIONES', 'LEANDRO N ALEM', 3315, '                        TRANSPORTE: FERNANDEZ DE LA CRUZ 193 VILLA SOLDATI  \n                       HORARIO: DE 9 A 15HS\n                        ', 3, 0),
(40, 'NOVO DESCARTABLES SRL (GRUPO NAVIDAD))', 30712367543, 'responsableinscripto', 2147483647, 2147483647, 'compras@navidadsrl.com.ar', 'FRANCISCO ALBAREZ', 3150, 0, 'MENDOZA', 'MENDOZA', 5519, '    DIRECCION DE ENTREGA : TRANSPORTE A CHARLAR                      \n                        ', 5, 123456),
(41, 'AES PATAGONIA  SRL (CUEVAS FACTURACION)', 30717387089, 'responsableinscripto', 2147483647, 0, 'cuevas.christian@hotmail.com', 'GENERAL MANUEL BELGRANO', 750, 0, 'NEUQUEN ', 'NEUQUEN ', 0, 'CUIT PARA FACTURAR CUEVAS                          \n                        ', 5, 1234),
(42, 'INSUMOS SAN JUAN SRL (CUEVAS FACTURACION)', 30708990309, 'responsableinscripto', 2147483647, 0, 'cuevas.christian@hotmail.com', 'ALEM NORTE ', 654, 0, 'SAN JUAN ', 'SAN JUAN ', 0, '                          CUIT PARA FACTURAR CUEVAS\n                        ', 5, 1234),
(43, 'LEO FILM SRL (DISTRIBUIDORA EJC)', 33709185719, 'responsableinscripto', 2147483647, 1133417148, 'Distribuidoraejcenvases@gmail.com', 'RUTA 16 Y ACCESO A LARROQUE ', 2854, 0, 'ENTRE RIOS', 'ENTRE RIOS', 0, 'CUIT PARA FACTURAR EJC                          \n                        ', 5, 1234),
(44, 'BERMUDEZ NORA BEATRIZ(DISTRIBUIDORA EJC)', 27124384740, 'responsableinscripto', 2147483647, 1133417148, 'Distribuidoraejcenvases@gmail.com', 'SARGENTO PALMA', 1150, 0, 'VILLA BOSCH', 'VILLA BOSCH', 1682, '                          CUIT PARA FACTURAR EJC\n                        ', 5, 1234),
(45, 'POLYFILM SRL', 30601399446, 'responsableinscripto', 2147483647, 1157318872, 'compras@polyfilm.com.ar', 'ROLDAN ', 2499, 0, 'BUENOS AIRES', 'MORENO LA REJA', 0, '                          DIRECCIO DE ENTREGA: ROLDAN 2499 LA REJA, MORENO\n                        ', 5, 12345),
(46, 'BATER SRL ', 30714896632, 'responsableinscripto', 2147483647, 0, 'COMPRASPLASTIMAC@GMAIL.COM', 'MENDOZA', 326, 0, 'ROSARIO', 'SANTA FE', 2000, '                          \n                        ', 5, 1234),
(47, 'LUXORMIX SA (MARCELO KOPEC)', 30716893657, 'responsableinscripto', 2147483647, 2147483647, 'KOPECMARCELO@YAHOO.COM', '3 DE FEBRERO ', 674, 0, 'SANTA FE', 'ROSARIO', 2000, '                          TRASNPORTE: TTE RICHARD ALGARROBO 1080 BARRACAS\n                        ', 9, 12345),
(48, 'POLIETILENOS SRL (SALTAPLAST)', 30644685906, 'responsableinscripto', 2147483647, 2147483647, 'GERADM@SALTAPLAST.COM.AR', 'AV CHILE ', 1502, 0, 'SALTA', 'SALTA', 4000, '                TRANSPORTE GONZALEZ           \n                        ', 3, 1234),
(49, 'POLIPACK', 30717474534, 'responsableinscripto', 2147483647, 2147483647, 'POLIPACKCOLON@GMAIL.COM', 'MAIPU', 160, 0, 'ENTRE RIOS', 'COLON', 3240, 'TRANSPORTE ELISERO                          \n                        ', 9, 1234),
(50, 'PAPELERA SALTA SRL ', 30714018597, 'responsableinscripto', 2147483647, 1131174422, 'PAPELERASALTA@HOTMAIL.COM', 'SALTA', 1777, 0, 'BUENOS AIRES', 'GERLI', 1870, '        ANTES DE ENTREGAR CONSUNTAL A QUE DEPOSITO                   \n                        ', 5, 1234);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estados`
--

CREATE TABLE `estados` (
  `estado` int(11) NOT NULL,
  `descripcion` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estados`
--

INSERT INTO `estados` (`estado`, `descripcion`) VALUES
(-1, 'ELIMINADO'),
(1, 'PRODUCCION'),
(2, 'ESTACIONADO'),
(3, 'ENBALAJE'),
(4, 'EXPEDICION'),
(5, 'FACTURADO'),
(6, 'REVISADO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `sku` int(11) NOT NULL,
  `nombre` text NOT NULL,
  `alto` float NOT NULL,
  `ancho` float NOT NULL,
  `peso` float NOT NULL,
  `descripcion` text NOT NULL,
  `precio` float NOT NULL,
  `atencion1` int(11) NOT NULL,
  `atencion2` int(11) NOT NULL,
  `atencion3` int(11) NOT NULL,
  `atencion4` int(11) NOT NULL,
  `asociados` varchar(20) NOT NULL,
  `baja` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `sku`, `nombre`, `alto`, `ancho`, `peso`, `descripcion`, `precio`, `atencion1`, `atencion2`, `atencion3`, `atencion4`, `asociados`, `baja`) VALUES
(18, 3870, '38X60X10', 60, 380, 271, 'ULTRA FILM REPUESTO 38CM (10 UNIDADES)', 21.6, 0, 0, 0, 0, '22.5.24.33', 0),
(11, 3880, '38x90x10', 90, 380, 339, 'ResiFilm Repuesto PRO (10 Unidades)', 30, 0, 0, 0, 0, '22.5.26.34', 0),
(13, 5030, '30X5000', 5000, 305, 19530, 'MASTER ROLL 305X5000X9', 85, 0, 0, 0, 0, '7.22', 0),
(12, 5038, '38X5000', 5000, 385, 21483, 'MASTER ROLL 385X5000X9', 107.76, 0, 0, 0, 0, '22.8', 0),
(14, 5045, '45X5000', 5000, 455, 25389, 'MASTER ROLL 455X5000X9', 127.51, 0, 0, 0, 0, '22.9', 0),
(25, 9999, '30X10X50', 10, 30, 1680, 'ULTRA FILM HOGAR X 50 UNID.', 21.5, 0, 0, 0, 0, '', 0),
(9, 30200, '30X200X8', 200, 300, 10714, 'RESIFILM REPUESTO 30X200 (8 UNIDADES)', 30.33, 0, 0, 0, 0, '4.16.27.22', 0),
(20, 30400, '30X400', 400, 300, 1339, 'ULTRA FILM COMERCIAL 30X500', 8.34, 0, 0, 0, 0, '1.19.22', 0),
(16, 30508, '30X500 GRANEL', 500, 300, 10044, 'RESIFILM GRANEL 30X500 (6 UNIDADES)', 53.04, 0, 0, 0, 0, '22.4.30.35', 0),
(5, 30550, '30X500', 500, 300, 1674, 'RESIFILM 30X500', 9.83, 0, 0, 0, 0, '1.13.22', 0),
(22, 30875, '30X875', 875, 300, 2930, 'ULTRA FILM COMERCIAL 30X1000', 14.91, 0, 0, 0, 0, '22.1.19', 0),
(8, 38200, '38X180X8', 200, 380, 848, 'RESIFILM REPUESTO MAX (8 UNIDADES)', 37.2, 0, 0, 0, 0, '22.5.17.28', 0),
(19, 38400, '38X400', 400, 380, 1696, 'ULTRA FILM COMERCIAL 38X500', 9.93, 0, 0, 0, 0, '2.20', 0),
(15, 38508, '38X500 GRANEL', 500, 380, 2120, 'RESIFILM GRANEL 38X500 (6 UNIDADES)', 66.36, 0, 0, 0, 0, '22.5.31.36', 0),
(6, 38550, '38X500', 500, 380, 2120, 'RESIFILM JR. 38X500', 12.27, 0, 0, 0, 0, '22.2.14', 0),
(23, 38875, '38X875', 875, 380, 3711, 'ULTRA FILM COMERCIAL 38X875', 18.66, 0, 0, 0, 0, '22.2.20', 0),
(10, 45200, '45X200X8', 200, 450, 1004, 'RESIFILM REPUESTO 45X200 (8 UNIDADES)', 44.31, 0, 0, 0, 0, '22.6.18.29', 0),
(21, 45400, '45X400', 400, 450, 2009, 'ULTRA FILM COMERCIAL 45X500', 12.12, 0, 0, 0, 0, '22.3.21', 0),
(17, 45508, '45X500 GRANEL', 500, 450, 2511, 'RESIFILM GRANEL 45X500 (6 UNIDADES)', 78.24, 0, 0, 0, 0, '22.6.32.37', 0),
(7, 45550, '45X500', 500, 450, 2511, 'RESIFILM 45X500', 14.32, 0, 0, 0, 0, '22.3.15', 0),
(24, 45875, '45X875', 875, 450, 4394, 'ULTRA FILM COMERCIAL 45X1000', 21.98, 0, 0, 0, 0, '22.3.21', 0),
(3, 301000, '30X1000', 1000, 300, 3348, 'RESIFILM 30X1000', 18.38, 0, 0, 0, 0, '1.10.22', 0),
(2, 381000, '38X1000', 1000, 380, 4241, 'RESIFILM 38X1000', 22.73, 0, 0, 0, 0, '22.2.11', 0),
(4, 451000, '45X1000', 1000, 450, 5022, 'RESIFILM 45X1000', 26.78, 0, 0, 0, 0, '22.3.12', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tareas`
--

CREATE TABLE `tareas` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ordenadopor` int(11) NOT NULL,
  `acumplirpor` int(11) NOT NULL,
  `fechadecreacion` datetime NOT NULL,
  `fechadecumplimiento` datetime NOT NULL,
  `estado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tareas`
--

INSERT INTO `tareas` (`id`, `ordenadopor`, `acumplirpor`, `fechadecreacion`, `fechadecumplimiento`, `estado`) VALUES
(45, 0, 1, '2023-09-07 18:42:11', '0000-00-00 00:00:00', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tareas_detalles`
--

CREATE TABLE `tareas_detalles` (
  `id` int(11) NOT NULL,
  `idtarea` int(11) NOT NULL,
  `producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `estado` int(11) NOT NULL,
  `fechadecreacion` datetime NOT NULL,
  `fechadecumplimiento` datetime NOT NULL,
  `idoperario` int(11) NOT NULL,
  `kilogramoscumplidos` float NOT NULL,
  `idcliente` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tareas_detalles`
--

INSERT INTO `tareas_detalles` (`id`, `idtarea`, `producto`, `cantidad`, `estado`, `fechadecreacion`, `fechadecumplimiento`, `idoperario`, `kilogramoscumplidos`, `idcliente`) VALUES
(1, 1, 2, 2, -1, '2023-09-05 18:21:08', '2023-09-05 18:21:08', 1, 0, 3),
(2, 2, 3, 10, 1, '2023-09-05 18:21:08', '2023-09-05 18:21:08', 1, 0, 4),
(3, 1, 4, 20, -1, '2023-09-05 18:22:02', '2023-09-05 18:22:02', 1, 0, 2),
(4, 1, 11, 20, -1, '2023-09-05 18:22:20', '2023-09-05 18:22:20', 1, 0, 1),
(10, 3, 18, 1, -1, '2023-09-05 21:53:44', '2023-09-05 21:53:44', 1, 0, 1),
(11, 3, 12, 1, -1, '2023-09-05 21:53:48', '2023-09-05 21:53:48', 1, 0, 1),
(12, 3, 9, 1, -1, '2023-09-05 21:53:50', '2023-09-05 21:53:50', 1, 0, 1),
(13, 3, 9, 1, 1, '2023-09-05 21:53:52', '2023-09-05 21:53:52', 1, 0, 5),
(14, 3, 9, 1, 1, '2023-09-05 21:53:54', '2023-09-05 21:53:54', 1, 0, 11),
(15, 1, 3, 100, -1, '2023-09-05 21:54:27', '2023-09-05 21:54:27', 1, 0, 43),
(16, 1, 18, 1, -1, '2023-09-05 22:26:39', '2023-09-05 22:26:39', 1, 0, 1),
(17, 1, 18, 1, 1, '2023-09-05 22:26:43', '2023-09-05 22:26:43', 1, 0, 37),
(18, 1, 18, 1111, -1, '2023-09-05 22:33:21', '2023-09-05 22:33:21', 1, 0, 1),
(19, 1, 5, 100, -1, '2023-09-05 23:05:17', '2023-09-05 23:05:17', 1, 0, 40),
(20, 1, 5, 100, -1, '2023-09-05 23:05:22', '2023-09-05 23:05:22', 1, 0, 24),
(21, 3, 5, 178, -1, '2023-09-06 22:53:19', '2023-09-06 22:53:19', 1, 0, 36),
(22, 3, 5, 169, -1, '2023-09-06 22:53:26', '2023-09-06 22:53:26', 1, 0, 19),
(23, 1, 5, 90, -1, '2023-09-06 22:59:03', '2023-09-06 22:59:03', 1, 0, 38),
(24, 1, 11, 111, -1, '2023-09-06 22:59:56', '2023-09-06 22:59:56', 1, 0, 1),
(25, 1, 11, 111, -1, '2023-09-06 22:59:58', '2023-09-06 22:59:58', 1, 0, 6),
(26, 1, 11, 1, -1, '2023-09-06 23:00:29', '2023-09-06 23:00:29', 1, 0, 2),
(27, 3, 5, 178, 1, '2023-09-06 23:15:10', '2023-09-06 23:15:10', 1, 0, 43),
(28, 3, 5, 90, 1, '2023-09-06 23:15:21', '2023-09-06 23:15:21', 1, 0, 36),
(29, 7, 18, 11, 1, '2023-09-07 16:32:43', '2023-09-07 16:32:43', 1, 0, 1),
(30, 7, 18, 1, 1, '2023-09-07 16:33:13', '2023-09-07 16:33:13', 1, 0, 1),
(31, 7, 18, 1, 1, '2023-09-07 16:33:16', '2023-09-07 16:33:16', 1, 0, 6),
(32, 7, 18, 1, 1, '2023-09-07 16:33:18', '2023-09-07 16:33:18', 1, 0, 15),
(33, 9, 11, 11, -1, '2023-09-07 16:49:15', '2023-09-07 16:49:15', 1, 0, 1),
(34, 9, 11, 11, -1, '2023-09-07 16:49:17', '2023-09-07 16:49:17', 1, 0, 7),
(35, 9, 11, 11, -1, '2023-09-07 16:49:18', '2023-09-07 16:49:18', 1, 0, 12),
(36, 9, 12, 1, -1, '2023-09-07 16:49:58', '2023-09-07 16:49:58', 1, 0, 4),
(37, 9, 18, 1, -1, '2023-09-07 17:24:29', '2023-09-07 17:24:29', 1, 0, 1),
(38, 9, 18, 1, -1, '2023-09-07 17:24:30', '2023-09-07 17:24:30', 1, 0, 1),
(39, 9, 11, 1, 1, '2023-09-07 17:24:45', '2023-09-07 17:24:45', 1, 0, 2),
(40, 17, 18, 1, 1, '2023-09-07 17:38:22', '2023-09-07 17:38:22', 1, 0, 2),
(41, 18, 11, 1, 1, '2023-09-07 17:38:37', '2023-09-07 17:38:37', 1, 0, 8),
(42, 23, 13, 1, 1, '2023-09-07 17:50:41', '2023-09-07 17:50:41', 1, 0, 1),
(43, 30, 11, 1, 1, '2023-09-07 18:05:50', '2023-09-07 18:05:50', 1, 0, 2),
(44, 34, 11, 1, 1, '2023-09-07 18:11:34', '2023-09-07 18:11:34', 1, 0, 2),
(45, 35, 14, 1, -1, '2023-09-07 18:12:25', '2023-09-07 18:12:25', 1, 0, 3),
(46, 35, 14, 1, 1, '2023-09-07 18:12:26', '2023-09-07 18:12:26', 1, 0, 3),
(47, 35, 14, 1, -1, '2023-09-07 18:12:27', '2023-09-07 18:12:27', 1, 0, 6),
(48, 35, 14, 1, 1, '2023-09-07 18:12:29', '2023-09-07 18:12:29', 1, 0, 41),
(49, 40, 11, 11, 1, '2023-09-07 18:34:32', '2023-09-07 18:34:32', 1, 0, 3),
(50, 40, 11, 11, 1, '2023-09-07 18:34:32', '2023-09-07 18:34:32', 1, 0, 3),
(51, 45, 18, 1, 1, '2023-09-07 18:42:21', '2023-09-07 18:42:21', 1, 0, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` text NOT NULL,
  `apellido` text NOT NULL,
  `usuario` int(11) NOT NULL,
  `password` text NOT NULL,
  `baja` int(11) NOT NULL,
  `grupo` int(11) NOT NULL,
  `permisos` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `apellido`, `usuario`, `password`, `baja`, `grupo`, `permisos`) VALUES
(1, 'TURNO', 'MAÑANA', 1, '1', 0, 1, '1,2,3,4');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `estados`
--
ALTER TABLE `estados`
  ADD PRIMARY KEY (`estado`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD UNIQUE KEY `sku` (`sku`);

--
-- Indices de la tabla `tareas`
--
ALTER TABLE `tareas`
  ADD UNIQUE KEY `id` (`id`);

--
-- Indices de la tabla `tareas_detalles`
--
ALTER TABLE `tareas_detalles`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT de la tabla `estados`
--
ALTER TABLE `estados`
  MODIFY `estado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `tareas`
--
ALTER TABLE `tareas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT de la tabla `tareas_detalles`
--
ALTER TABLE `tareas_detalles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
