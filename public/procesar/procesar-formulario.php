<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Clave secreta de Google reCAPTCHA
    $secretKey = "6Lc1VBsTAAAAAADwdisnT8GFZWEgcdi058LhJuFm";
    $captcha = $_POST['g-recaptcha-response'];

    // Verificar si el reCAPTCHA se completó
    if (!$captcha) {
        die("<div class='error'>Por favor, verifica el reCAPTCHA.</div>");
    }

    // Validar el reCAPTCHA con Google
    $url = "https://www.google.com/recaptcha/api/siteverify";
    $data = [
        'secret' => $secretKey,
        'response' => $captcha,
        'remoteip' => $_SERVER['REMOTE_ADDR']
    ];

    $options = [
        'http' => [
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'method' => 'POST',
            'content' => http_build_query($data)
        ]
    ];

    $context = stream_context_create($options);
    $response = file_get_contents($url, false, $context);
    $result = json_decode($response, true);

    if (!$result['success']) {
        die("<div class='error'>Error de reCAPTCHA. Inténtalo de nuevo.</div>");
    }

    // ---- Continuar con el procesamiento del formulario ----
    $nombre = htmlspecialchars(trim($_POST['nombre']));
    $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
    $fono = htmlspecialchars(trim($_POST['fono']));
    $desde = htmlspecialchars(trim($_POST['desde']));
    $presupuesto = htmlspecialchars(trim($_POST['presupuesto']));
    $mensaje = htmlspecialchars(trim($_POST['textarea']));

    if (!$email) {
        die("<div class='error'>Email no válido.</div>");
    }

    $to = "codigoraul@gmail.com";
    $subject = "Formulario de Contacto";
    $message = "Nombre: $nombre\nEmail: $email\nFono: $fono\nDesde: $desde\nPresupuesto: $presupuesto\nMensaje: $mensaje";
    $headers = "From: diseñopaginas.cl\r\nReply-To: $email";

    if (mail($to, $subject, $message, $headers)) {
        echo "<div class='success'>¡Mensaje enviado correctamente! Te contactaremos pronto.</div>";
    } else {
        echo "<div class='error'>Hubo un error al enviar el mensaje.</div>";
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Estado del Mensaje</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            text-align: center;
            padding: 50px;
        }
        .container {
            background: white;
            padding: 20px;
            max-width: 400px;
            margin: auto;
            border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        }
        .success {
            color: #155724;
            background-color: #d4edda;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
            font-weight: bold;
        }
        .error {
            color: #721c24;
            background-color: #f8d7da;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
            font-weight: bold;
        }
        .btn {
            display: inline-block;
            padding: 10px 15px;
            margin-top: 20px;
            text-decoration: none;
            background-color: #007BFF;
            color: white;
            border-radius: 5px;
            font-size: 16px;
        }
        .btn:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Estado del Mensaje</h2>
        <?= isset($response) ? $response : '' ?>
        <a href="/" class="btn">Volver al Inicio</a>
    </div>
</body>
</html>
