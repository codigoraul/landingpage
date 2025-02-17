<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recoger los datos del formulario
    $nombre = $_POST['nombre'];
    $email = $_POST['email'];
    $fono = $_POST['fono'];
    $presupuesto = $_POST['presupuesto'];
    $mensaje = $_POST['textarea'];

    // Validar y procesar los datos, como enviarlos por correo o guardarlos en la base de datos
    // Aquí un ejemplo simple para enviar un correo:
    $to = "codigoraul@gmail.com";
    $subject = "Formulario de Contacto";
    $message = "Nombre: $nombre\nEmail: $email\nFono: $fono\nPresupuesto: $presupuesto\nMensaje: $mensaje";
    $headers = "From: diseñopaginas.cl";

    if (mail($to, $subject, $message, $headers)) {
        echo "Mensaje enviado correctamente!";
    } else {
        echo "Hubo un error al enviar el mensaje.";
    }
}
?>
