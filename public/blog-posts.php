<?php
// Javni spisak objava za stranicu Blog (JSON). Objave se dodaju preko /admin.
require __DIR__ . '/blog-lib.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache');
header('X-Content-Type-Options: nosniff');

$posts = array_map(function ($p) {
    return [
        'url' => $p['url'] ?? '',
        'title' => $p['title'] ?? '',
        'description' => $p['description'] ?? '',
    ];
}, blog_read_posts());

echo json_encode(['posts' => $posts], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
