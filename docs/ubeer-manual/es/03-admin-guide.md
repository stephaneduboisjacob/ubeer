# Guía del administrador

## Acceso y seguridad de la cuenta

Abra https://ubeer.example.com/admin. Inicie sesión con el correo y la contraseña de administrador provisionados para esta instalación e introduzca el código actual de seis dígitos de la aplicación autenticadora. TOTP es obligatorio para administradores. Las credenciales iniciales se guardan por separado en el servidor: no las copie en este manual, tickets ni chats. Si todavía no se ha inscrito el autenticador, siga las instrucciones protegidas de inicialización. La aplicación no dispone de recuperación autónoma de contraseña o TOTP; limite la recuperación en el servidor a operadores de confianza y rote los secretos expuestos.

Para esta instalación, el archivo temporal de credenciales iniciales es the protected path configured with `ADMIN_CREDENTIALS_PATH` y solo lo puede leer el administrador del servidor. Pida al operador autorizado que le facilite el acceso de forma segura, configure el autenticador y elimine después el archivo. No incluya la contraseña ni el secreto TOTP en correos, tickets o esta documentación.

Use una contraseña exclusiva, proteja los dispositivos y cierre la sesión en equipos compartidos. Los cambios de administración generan registros de auditoría; revise el registro tras cambios importantes.

## Panel y gestión de pedidos

El resumen muestra pedidos del día, ingresos pagados en USD, repartidores aprobados conectados y pagos fallidos. En Pedidos puede revisar los pedidos recientes y filtrar por estado: pending_payment, paid, accepted, preparing, out_for_delivery, delivered, cancelled, refunded o failed.

Use «Cambiar estado» solo para corregir una situación operativa excepcional y describa el motivo y las pruebas en la nota de auditoría. Un cambio forzado no revierte un pago BTCPay, no emite un reembolso, no avisa necesariamente a todas las partes ni garantiza el ajuste del inventario. «Nota de reembolso» registra la decisión y cambia el estado en uBeer, pero no envía un reembolso BTCPay ni en cadena. Procese cualquier devolución real por separado según el proveedor y la política local, y registre el resultado.

## Regiones y configuración de mercado

Cada región define el límite de reparto que impone el servidor, idioma inicial, estado activo, mínimo de compra, tarifa de entrega y edad mostrada. La API aplica el control de ubicación y pago. Desactivar una región impide aceptar nuevos pedidos en ella. La aplicación actual solo permite edades de 19 o 21 años y la moneda de pago está fijada en USD.

**Limitación actual de la interfaz:** la página de regiones muestra la geometría existente, pero el control de dibujo no está conectado. No suponga que puede crear un polígono haciendo clic en el mapa. La API acepta GeoJSON, pero crear o modificar límites requiere actualmente un proceso revisado de ingeniería/operaciones. Compruebe las coordenadas frente a los límites legales y operativos reales antes de activar la región. La búsqueda está limitada a Canadá y a una zona de Montreal; añadir un polígono extranjero no habilitará por sí solo la búsqueda internacional.

La región activa de la isla de Montreal es de prototipo y debe conservarse solo para pruebas. Antes de una salida comercial, configure los límites, idioma, tarifas, mínimo, edad legal, moneda, geocodificador, productos, avisos y operaciones locales.

## Catálogo

La pantalla de administración permite crear productos con nombre, descripción, precio en USD, existencias, regiones y una marca de prueba. La interfaz permite pausar o reactivar un producto; la edición detallada y el archivado también están disponibles a través de la API. Antes de activar un producto, verifique su legalidad, proveedor, derechos de imagen y etiquetado, existencias, impuestos y precio final. El Heineken sembrado es un producto de prueba, no una oferta comercial.

## Repartidores, clientes y pagos

En Repartidores → Solicitudes, revise los datos y el documento de identidad con el acceso exclusivo de administración. Apruebe, rechace o suspenda con una nota adecuada. La aprobación genera una contraseña temporal que se muestra una sola vez; envíela privadamente al solicitante verificado. Proteja los documentos descargados y elimínelos según la política de conservación.

Usuarios permite bloquear o desbloquear cuentas de clientes. Los pagos a repartidores son registros manuales: seleccione un conductor, introduzca importe y nota, y márquelo como pagado solo después de verificar una transferencia real. Las ganancias y registros no realizan transferencias bancarias ni cripto automáticamente.

## Ajustes y auditoría

Ajustes muestra el porcentaje de comisión y el estado enmascarado de BTCPay. El porcentaje puede cambiarse allí. El ID de tienda, clave API y secreto webhook de BTCPay, credenciales de base de datos y claves de firma deben permanecer en la configuración protegida del servidor, nunca en el navegador, el repositorio o este manual. El panel no revela los valores secretos.

Revise a diario el panel y la auditoría. Concilie pedidos pagados, facturas fallidas, disponibilidad de repartidores, reembolsos manuales y pagos. Consulte la [guía de lanzamiento y operaciones](05-launch-and-operations.md) para la configuración de pagos, copias de seguridad, incidentes y aprobación de mercados.

---

Contact: Stephane Jacob <jacobstephane@outlook.com>
