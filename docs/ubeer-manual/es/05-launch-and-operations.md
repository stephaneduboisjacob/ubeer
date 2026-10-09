# Guía de lanzamiento y operaciones

## Requisitos para lanzar en otro país

El entorno de producción actual es un prototipo de Montreal, no un mercado preparado para operar en el extranjero. La región activa es la isla de Montreal; el único producto inicial es un paquete de seis marcado TEST LISTING a 30,00 USD; la búsqueda de direcciones está fijada a Canadá y a una zona de Montreal; la facturación está en USD; y los umbrales de edad se limitan a 19 o 21. El control para dibujar regiones del panel no está conectado. No acepte pedidos de otro país hasta resolver, implementar y revisar estos límites.

Para cada país y ciudad, consulte a profesionales locales cualificados y a las autoridades sobre los requisitos de vendedores, mercados, alcohol, reparto, publicidad, trabajadores, impuestos, consumidores, privacidad, pagos e identidad. Defina quién vende y entrega legalmente cada producto, cómo verificar documentos y gestionar entregas rechazadas, horarios autorizados, conservación de registros, impuestos y reembolsos, idioma de atención y escalamiento de emergencias. Los requisitos varían por mercado; esta lista no es asesoría legal.

Después configure y verifique la búsqueda de direcciones del país; una región precisa impuesta por el servidor; la edad local y su verificación; productos, existencias, moneda, impuestos y tarifas; repartidores y horarios; textos y avisos legales traducidos; conservación de datos; activos y webhook de BTCPay; soporte; y procedimientos de conciliación e incidentes. Realice pedidos de prueba con cada método de pago y pruebe todos los estados de entrega antes de anunciar el lanzamiento.

## Pagos y soporte

uBeer dirige el pago a BTCPay Server, verifica webhooks firmados y programa una tarea de conciliación. Registre este webhook:

https://ubeer.example.com/api/webhooks/btcpay

Suscríbase a InvoiceCreated, InvoiceReceivedPayment, InvoiceProcessing, InvoiceSettled, InvoiceExpired e InvoiceInvalid. Introduzca BTCPAY_STORE_ID, BTCPAY_API_KEY y BTCPAY_WEBHOOK_SECRET en el archivo .env protegido del servidor. No copie sus valores en este documento, chats ni repositorios. El checkout crea facturas en USD. Los métodos visibles dependen de la configuración de BTCPay.

El asistente de IA usa un servicio Ollama local. Responde preguntas generales, pero no consulta pedidos ni realiza acciones. No pida secretos al cliente. El correo usa transporte de consola de forma predeterminada hasta que se configure SMTP; no prometa recibir correos sin una prueba integral.

## Lista operativa

Antes de cada turno, compruebe API, base de datos, Redis, Nginx y Ollama; confirme las regiones y productos activos y la cobertura de repartidores. Después concilie las facturas de BTCPay con los pedidos uBeer, investigue pagos fallidos o pendientes y revise reembolsos manuales, pagos a conductores y auditoría. No cambie un estado solo para corregir el panel; registre el motivo y concilie aparte el pago y el inventario.

Los comandos del servidor corresponden a operadores autorizados:

- Reiniciar API: sudo systemctl restart ubeer-api
- Ver registros API: sudo journalctl -u ubeer-api -f
- Validar Nginx: sudo nginx -t
- Servicios Compose: cd /opt/ubeer && sudo docker compose ps
- Publicar versión: desde /opt/ubeer ejecute npm ci, npm run build y npm run db:migrate; copie apps/web/dist a /var/www/ubeer/web y reinicie ubeer-api.

Haga copias periódicas de PostgreSQL con pg_dump y guárdelas fuera del servidor con acceso restringido. Incluya /var/lib/ubeer/uploads: contiene documentos de solicitudes de repartidores. Pruebe restauraciones. Guarde una copia cifrada de la clave de firma de Android; las futuras actualizaciones deben usar la misma clave. RUNBOOK.md contiene comandos completos y rotación de claves BTCPay.

## Respuestas de soporte

**Mi dirección no está cubierta.** Solo se aceptan regiones activas. Este despliegue tiene únicamente la isla de Montreal y búsqueda limitada a Canadá. La lista de espera no reserva un envío.

**El pago sigue pendiente.** Compruebe la factura BTCPay y conserve el recibo. Soporte debe conciliarla antes de pedir otro pago.

**La factura venció o falló.** No dé por hecho que se devolvieron los fondos ni vuelva a pagar a ciegas. Soporte revisa BTCPay y aplica la política de reembolso regional.

**¿La IA puede ver o cambiar mi pedido?** No. El chat solo ofrece orientación general. Use el canal publicado con la referencia del pedido, nunca el código de entrega ni credenciales de pago.

**¿Cómo funcionan los reembolsos y los pagos a repartidores?** El panel registra notas y pagos, pero no emite reembolsos BTCPay ni transfiere fondos automáticamente. El operador procesa y verifica por separado la transacción real.

## Gestión de incidentes

Si se expone un secreto, rótelo en su origen, actualice la configuración protegida, reinicie la API, verifique la integración y revoque la credencial anterior. Si dejan de llegar pagos, revise API, Redis, errores de firma, facturas BTCPay y conciliación. Si se exponen documentos personales, limite el acceso, preserve los hechos, avise al responsable de privacidad y cumpla las obligaciones locales de notificación. No elimine registros necesarios para investigar legalmente el incidente.

---

Contact: Stephane Jacob <jacobstephane@outlook.com>
