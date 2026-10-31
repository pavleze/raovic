<?php
// Zajednicki kod za admin.php i blog-posts.php: gde se cuvaju objave i kako se citaju/pisu.
// Vite ovaj fajl kopira u dist/, pa na hostingu stoji pored index.html.

if (basename($_SERVER['SCRIPT_FILENAME'] ?? '') === basename(__FILE__)) {
    http_response_code(404);
    exit;
}

const BLOG_TITLE_MAX = 120;
const BLOG_DESCRIPTION_MAX = 500;
const BLOG_POSTS_MAX = 200;

// Podaci stoje van public_html (u ~/raovic-data), da ih novo postavljanje sajta ne obrise.
// Ako tamo ne moze da se pise, koristi se raovic-data/ pored sajta, zakljucan za posetioce.
function blog_data_dir() {
    static $dir = null;
    if ($dir !== null) return $dir;

    $candidates = [];
    $docRoot = rtrim($_SERVER['DOCUMENT_ROOT'] ?? '', '/');
    if ($docRoot !== '') $candidates[] = dirname($docRoot) . '/raovic-data';
    $candidates[] = __DIR__ . '/raovic-data';

    foreach ($candidates as $candidate) {
        if (!is_dir($candidate)) @mkdir($candidate, 0750, true);
        if (is_dir($candidate) && is_writable($candidate)) {
            $dir = $candidate;
            break;
        }
    }
    if ($dir === null) $dir = end($candidates);

    // Ako je folder unutar sajta, zabrani pristup preko weba.
    $htaccess = $dir . '/.htaccess';
    if (strpos(realpath($dir) ?: $dir, realpath(__DIR__) ?: __DIR__) === 0 && !file_exists($htaccess)) {
        @file_put_contents($htaccess, "Require all denied\n");
    }
    return $dir;
}

function blog_posts_file() {
    return blog_data_dir() . '/blog-posts.json';
}

function blog_read_posts() {
    $file = blog_posts_file();
    // Dok niko nije sacuvao nista preko admina, prikazuju se pocetne objave iz builda.
    if (!is_file($file)) $file = __DIR__ . '/blog-posts-default.json';
    if (!is_file($file)) return [];
    $data = json_decode((string) file_get_contents($file), true);
    return is_array($data) ? array_values($data) : [];
}

function blog_write_posts(array $posts) {
    $file = blog_posts_file();
    $json = json_encode(array_values($posts), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    // Prvo u privremeni fajl pa preimenovanje, da se nikad ne procita napola upisan fajl.
    $tmp = $file . '.' . bin2hex(random_bytes(4)) . '.tmp';
    if (file_put_contents($tmp, $json, LOCK_EX) === false) return false;
    return rename($tmp, $file);
}

// Prihvata samo linkove ka objavama sa Instagrama; vraca ociscen link (bez ?... na kraju) ili null.
function blog_normalize_instagram_url($url) {
    $url = trim((string) $url);
    if (!preg_match('~^https?://(?:www\.)?instagram\.com/(?:[A-Za-z0-9._]+/)?(reel|reels|p|tv)/([A-Za-z0-9_-]{5,40})/?(?:[?#].*)?$~', $url, $m)) {
        return null;
    }
    $type = $m[1] === 'reels' ? 'reel' : $m[1];
    return 'https://www.instagram.com/' . $type . '/' . $m[2] . '/';
}

function blog_clean_text($value, $max, $multiline = false) {
    $value = str_replace("\r", '', (string) $value);
    $value = preg_replace($multiline ? '/[\x00-\x09\x0B-\x1F\x7F]+/u' : '/[\x00-\x1F\x7F]+/u', ' ', $value);
    return mb_substr(trim($value), 0, $max);
}

// Preuzima tekst opisa sa javne "embed" verzije Instagram objave (ista koju koristi ugradjeni prikaz).
// Vraca [tekst, null] ili [null, poruka greske]. Instagram moze da promeni stranicu, pa je ovo pomoc, ne garancija.
function blog_fetch_instagram_caption($url) {
    $url = blog_normalize_instagram_url($url);
    if ($url === null) return [null, 'Prvo unesite ispravan link ka objavi na Instagramu.'];

    $html = blog_http_get($url . 'embed/captioned/');
    if ($html === null) return [null, 'Instagram trenutno ne odgovara. Pokušajte ponovo ili prepišite opis ručno.'];

    if (!preg_match('~<div class="Caption">(.*?)</div>~s', $html, $m)) {
        return [null, 'Objava nema opis ili Instagram nije dozvolio da se pročita.'];
    }
    $caption = preg_replace('~<a class="CaptionUsername".*?</a>~s', '', $m[1]);
    $caption = preg_replace('~<br\s*/?>~i', "\n", $caption);
    $caption = html_entity_decode(strip_tags($caption), ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $caption = trim(preg_replace("/\n{3,}/", "\n\n", $caption));
    if ($caption === '') return [null, 'Objava nema opis.'];

    return [mb_substr($caption, 0, BLOG_DESCRIPTION_MAX), null];
}

function blog_http_get($url) {
    $headers = "User-Agent: Mozilla/5.0 (compatible; RaovicSajt/1.0; +https://www.raovic.rs)\r\nAccept-Language: sr,en;q=0.8\r\n";
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => false,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_HTTPHEADER => array_filter(explode("\r\n", $headers)),
        ]);
        $body = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return ($body !== false && $status === 200) ? $body : null;
    }
    $context = stream_context_create(['http' => ['timeout' => 10, 'header' => $headers, 'follow_location' => 0, 'ignore_errors' => true]]);
    $body = @file_get_contents($url, false, $context);
    $status = isset($http_response_header[0]) && preg_match('~\s200\s~', $http_response_header[0]);
    return ($body !== false && $status) ? $body : null;
}
