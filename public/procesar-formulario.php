<?php
header('Content-Type: application/json');

// Permitir CORS desde tu dominio
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido: Solo se acepta POST']);
    exit;
}

// Verificar reCAPTCHA
$recaptcha_secret = "6Lc1VBsTAAAAAADwdisnT8GFZWEgcdi058LhJuFm";
$recaptcha_response = $_POST['g-recaptcha-response'] ?? '';

if (empty($recaptcha_response)) {
    http_response_code(400);
    echo json_encode(['error' => 'Por favor, completa la verificación de reCAPTCHA']);
    exit;
}

$verify = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$recaptcha_secret}&response={$recaptcha_response}");
$captcha_success = json_decode($verify);

if (!$captcha_success->success) {
    http_response_code(400);
    echo json_encode([
        'error' => 'La verificación de reCAPTCHA falló. Por favor, inténtalo nuevamente.',
        'details' => $captcha_success
    ]);
    exit;
}

// Obtener y validar datos del formulario
$campos_requeridos = [
    'nombre' => 'Nombre',
    'fono' => 'Teléfono',
    'email' => 'Email',
    'presupuesto' => 'Plan seleccionado',
    'mensaje' => 'Mensaje'
];

$datos = [];
$campos_faltantes = [];

foreach ($campos_requeridos as $campo => $nombre) {
    $valor = $_POST[$campo] ?? '';
    if (empty($valor)) {
        $campos_faltantes[] = $nombre;
    }
    $datos[$campo] = $valor;
}

if (!empty($campos_faltantes)) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Campos requeridos faltantes: ' . implode(', ', $campos_faltantes)
    ]);
    exit;
}

// Validar email
if (!filter_var($datos['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'El formato del email no es válido']);
    exit;
}

// Configurar el email
$to = 'codigoraul@gmail.com';
$subject = '[Solicitud de Presupuesto] ' . $datos['presupuesto'] . ' - ' . $datos['nombre'];
$headers = [
    'From' => 'Landing Page <formulario@' . $_SERVER['HTTP_HOST'] . '>',
    'Reply-To' => $datos['nombre'] . ' <' . $datos['email'] . '>',
    'X-Mailer' => 'PHP/' . phpversion(),
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/html; charset=UTF-8'
];

// Crear mensaje HTML con tabla
$message = '
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #79D8DF 0%, #5BC0BE 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .header h2 { margin: 0; font-size: 24px; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        th { background: #79D8DF; color: white; padding: 12px; text-align: left; font-weight: 600; }
        td { padding: 12px; border-bottom: 1px solid #eee; }
        tr:last-child td { border-bottom: none; }
        .label { font-weight: 600; color: #555; width: 150px; }
        .value { color: #333; }
        .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
        .badge { display: inline-block; background: #FF6B6B; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 600; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>📩 Nueva Solicitud de Presupuesto</h2>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Landing Page - diseñopaginas.cl</p>
        </div>
        <div class="content">
            <table>
                <tr>
                    <td class="label">👤 Nombre:</td>
                    <td class="value"><strong>' . htmlspecialchars($datos['nombre']) . '</strong></td>
                </tr>
                <tr>
                    <td class="label">📧 Email:</td>
                    <td class="value"><a href="mailto:' . htmlspecialchars($datos['email']) . '">' . htmlspecialchars($datos['email']) . '</a></td>
                </tr>
                <tr>
                    <td class="label">📱 Teléfono:</td>
                    <td class="value"><a href="tel:' . htmlspecialchars($datos['fono']) . '">' . htmlspecialchars($datos['fono']) . '</a></td>
                </tr>
                <tr>
                    <td class="label">💰 Plan:</td>
                    <td class="value"><span class="badge">' . htmlspecialchars($datos['presupuesto']) . '</span></td>
                </tr>
                <tr>
                    <td class="label">💬 Mensaje:</td>
                    <td class="value">' . nl2br(htmlspecialchars($datos['mensaje'])) . '</td>
                </tr>
                <tr>
                    <td class="label">🕐 Fecha:</td>
                    <td class="value">' . date('d/m/Y H:i:s') . '</td>
                </tr>
                <tr>
                    <td class="label">🌐 IP:</td>
                    <td class="value">' . $_SERVER['REMOTE_ADDR'] . '</td>
                </tr>
            </table>
        </div>
        <div class="footer">
            <p>Este mensaje fue enviado desde el formulario de contacto de diseñopaginas.cl/landing/</p>
        </div>
    </div>
</body>
</html>
';

// Enviar email
$success = mail($to, $subject, $message, $headers);

if ($success) {
    echo json_encode(['success' => true, 'message' => 'Mensaje enviado correctamente']);
} else {
    $error = error_get_last();
    http_response_code(500);
    echo json_encode([
        'error' => 'Error al enviar el email',
        'details' => $error ? $error['message'] : 'Error desconocido en el servidor de correo'
    ]);
}

