<?php
// Prima upit sa kontakt forme i salje ga mejlom ordinaciji.
// Vite ovaj fajl kopira u dist/, pa na hostingu stoji pored index.html.

const TO_EMAIL = 'ordinacijaraovic@gmail.com';

header('Content-Type: application/json; charset=utf-8');

function respond($status, $ok, $error = null) {
    http_response_code($status);
    echo json_encode($error ? ['ok' => $ok, 'error' => $error] : ['ok' => $ok]);
    exit;
}

// Uklanja prelome reda i kontrolne znakove (zastita od ubacivanja mejl zaglavlja).
function clean_line($value, $max) {
    $value = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', (string) $value);
    return mb_substr(trim($value), 0, $max);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, false, 'Metod nije dozvoljen.');
}

// Skriveno polje koje ljudi ne vide; ako je popunjeno, salje bot. Glumimo uspeh.
if (!empty($_POST['website'])) {
    respond(200, true);
}

$ime = clean_line($_POST['ime'] ?? '', 80);
$prezime = clean_line($_POST['prezime'] ?? '', 80);
$telefon = clean_line($_POST['telefon'] ?? '', 40);
$poruka = mb_substr(trim(str_replace("\r", '', (string) ($_POST['poruka'] ?? ''))), 0, 3000);

if ($ime === '' || $prezime === '' || $telefon === '') {
    respond(400, false, 'Ime, prezime i telefon su obavezni.');
}
if (!preg_match('/^[0-9 +\/().-]{6,40}$/', $telefon)) {
    respond(400, false, 'Broj telefona nije ispravan.');
}

// Posiljalac mora biti adresa na domenu sajta, inace Gmail cesto odbaci poruku.
$domain = preg_replace('/^www\./', '', strtolower($_SERVER['SERVER_NAME'] ?? 'localhost'));
$domain = preg_replace('/[^a-z0-9.-]/', '', $domain);
$from = 'sajt@' . $domain;

$subject = 'Upit sa sajta: ' . $ime . ' ' . $prezime;
$body = "Novi upit sa kontakt forme na sajtu.\n\n"
    . "Ime i prezime: $ime $prezime\n"
    . "Telefon: $telefon\n\n"
    . "Poruka:\n" . ($poruka !== '' ? $poruka : '(bez poruke)') . "\n";

$headers = [
    'From' => "Sajt Raovic <$from>",
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/plain; charset=UTF-8',
    'Content-Transfer-Encoding' => '8bit',
];

$sent = mail(TO_EMAIL, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers, '-f' . $from);

if (!$sent) {
    respond(500, false, 'Slanje nije uspelo.');
}
respond(200, true);
