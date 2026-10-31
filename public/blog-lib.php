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
