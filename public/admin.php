<?php
// Admin za stranicu Blog: dodavanje, izmena, brisanje i redosled Instagram objava.
// Otvara se na /admin. Lozinka se postavlja jednom, preko cPanel File Manager-a (vidi uputstvo na stranici).
require __DIR__ . '/blog-lib.php';

const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_LOCK_SECONDS = 900;     // 15 min posle 5 pogresnih lozinki
const SESSION_IDLE_SECONDS = 28800; // 8 h bez aktivnosti -> ponovna prijava

header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');
header('Referrer-Policy: same-origin');

$https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
session_name('raovic_admin');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => $https,
    'httponly' => true,
    'samesite' => 'Strict',
]);
session_start();

function h($value) {
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function redirect_self($query = '') {
    header('Location: /admin' . ($query !== '' ? '?' . $query : ''), true, 303);
    exit;
}

function flash($message, $type = 'ok') {
    $_SESSION['flash'] = ['message' => $message, 'type' => $type];
}

// ── Lozinka ──────────────────────────────────────────────

function config_file() {
    return blog_data_dir() . '/admin.json';
}

function password_hash_stored() {
    $file = config_file();
    if (is_file($file)) {
        $config = json_decode((string) file_get_contents($file), true);
        if (!empty($config['password_hash'])) return $config['password_hash'];
    }
    // Prvo postavljanje: lozinka upisana u lozinka.txt se hesira, a tekstualni fajl brise.
    $plainFile = blog_data_dir() . '/lozinka.txt';
    if (is_file($plainFile)) {
        $plain = trim((string) file_get_contents($plainFile));
        if (mb_strlen($plain) >= 10) {
            $hash = password_hash($plain, PASSWORD_DEFAULT);
            if (file_put_contents($file, json_encode(['password_hash' => $hash]), LOCK_EX) !== false) {
                @chmod($file, 0640);
                @unlink($plainFile);
                return $hash;
            }
        }
    }
    return null;
}

// ── Zastita od pogadjanja lozinke ────────────────────────

function attempts_file() {
    return blog_data_dir() . '/login-attempts.json';
}

function client_key() {
    return hash('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown');
}

function read_attempts() {
    $data = is_file(attempts_file()) ? json_decode((string) file_get_contents(attempts_file()), true) : [];
    $now = time();
    // Zaboravi stare pokusaje.
    return array_filter(is_array($data) ? $data : [], function ($a) use ($now) {
        return isset($a['first']) && $now - $a['first'] < LOGIN_LOCK_SECONDS;
    });
}

function is_locked_out() {
    $attempts = read_attempts();
    $entry = $attempts[client_key()] ?? null;
    return $entry && $entry['count'] >= LOGIN_MAX_ATTEMPTS;
}

function record_failed_login() {
    $attempts = read_attempts();
    $key = client_key();
    if (!isset($attempts[$key])) $attempts[$key] = ['count' => 0, 'first' => time()];
    $attempts[$key]['count']++;
    file_put_contents(attempts_file(), json_encode($attempts), LOCK_EX);
}

function clear_failed_logins() {
    $attempts = read_attempts();
    unset($attempts[client_key()]);
    file_put_contents(attempts_file(), json_encode($attempts), LOCK_EX);
}

// ── Sesija i CSRF ────────────────────────────────────────

function is_logged_in() {
    if (empty($_SESSION['admin'])) return false;
    if (time() - ($_SESSION['last_seen'] ?? 0) > SESSION_IDLE_SECONDS) {
        $_SESSION = [];
        return false;
    }
    $_SESSION['last_seen'] = time();
    return true;
}

function csrf_token() {
    if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
    return $_SESSION['csrf'];
}

function csrf_field() {
    return '<input type="hidden" name="csrf" value="' . h(csrf_token()) . '">';
}

function csrf_valid() {
    return isset($_POST['csrf']) && is_string($_POST['csrf']) && hash_equals(csrf_token(), $_POST['csrf']);
}

// ── Objave ───────────────────────────────────────────────

function find_post_index(array $posts, $id) {
    foreach ($posts as $i => $post) {
        if (($post['id'] ?? '') === $id) return $i;
    }
    return null;
}

// Proverava polja forme; vraca [objava, greska].
function post_from_form() {
    $title = blog_clean_text($_POST['title'] ?? '', BLOG_TITLE_MAX);
    $description = blog_clean_text($_POST['description'] ?? '', BLOG_DESCRIPTION_MAX, true);
    $url = blog_normalize_instagram_url($_POST['url'] ?? '');
    if ($title === '') return [null, 'Unesite naslov.'];
    if ($url === null) return [null, 'Link mora biti link ka objavi na Instagramu, npr. https://www.instagram.com/reel/...'];
    return [['title' => $title, 'description' => $description, 'url' => $url], null];
}

// ── Obrada zahteva ───────────────────────────────────────

$passwordHash = password_hash_stored();
$error = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if (!csrf_valid()) {
        flash('Sesija je istekla. Pokušajte ponovo.', 'error');
        redirect_self();
    }

    if ($action === 'login' && $passwordHash) {
        if (is_locked_out()) {
            flash('Previše pogrešnih pokušaja. Sačekajte 15 minuta.', 'error');
        } elseif (password_verify((string) ($_POST['password'] ?? ''), $passwordHash)) {
            clear_failed_logins();
            session_regenerate_id(true);
            $_SESSION['admin'] = true;
            $_SESSION['last_seen'] = time();
            $_SESSION['csrf'] = bin2hex(random_bytes(32));
        } else {
            record_failed_login();
            flash('Pogrešna lozinka.', 'error');
        }
        redirect_self();
    }

    if (!is_logged_in()) redirect_self();

    // Dugme "Preuzmi opis iz objave": vraca JSON, stranica ostaje otvorena.
    if ($action === 'fetch_caption') {
        list($caption, $captionError) = blog_fetch_instagram_caption($_POST['url'] ?? '');
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($captionError ? ['ok' => false, 'error' => $captionError] : ['ok' => true, 'caption' => $caption], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'logout') {
        $_SESSION = [];
        session_destroy();
        redirect_self();
    }

    $posts = blog_read_posts();
    $id = (string) ($_POST['id'] ?? '');
    $index = $id !== '' ? find_post_index($posts, $id) : null;

    if ($action === 'add' || $action === 'update') {
        list($post, $formError) = post_from_form();
        if ($formError) {
            $_SESSION['form'] = ['title' => $_POST['title'] ?? '', 'description' => $_POST['description'] ?? '', 'url' => $_POST['url'] ?? ''];
            flash($formError, 'error');
            redirect_self($action === 'update' ? 'izmeni=' . rawurlencode($id) : '');
        }
        if ($action === 'add') {
            if (count($posts) >= BLOG_POSTS_MAX) {
                flash('Dostignut je najveći broj objava. Obrišite neku staru.', 'error');
                redirect_self();
            }
            $post['id'] = bin2hex(random_bytes(6));
            array_unshift($posts, $post); // najnovije prvo
            $message = 'Objava je dodata.';
        } else {
            if ($index === null) redirect_self();
            $post['id'] = $id;
            $posts[$index] = $post;
            $message = 'Izmene su sačuvane.';
        }
    } elseif ($action === 'delete' && $index !== null) {
        array_splice($posts, $index, 1);
        $message = 'Objava je obrisana.';
    } elseif (($action === 'up' || $action === 'down') && $index !== null) {
        $target = $action === 'up' ? $index - 1 : $index + 1;
        if ($target >= 0 && $target < count($posts)) {
            $tmp = $posts[$target];
            $posts[$target] = $posts[$index];
            $posts[$index] = $tmp;
        }
        $message = null;
    } else {
        redirect_self();
    }

    if (blog_write_posts($posts)) {
        if ($message) flash($message);
    } else {
        flash('Čuvanje nije uspelo (nema dozvole za upis na hostingu).', 'error');
    }
    redirect_self();
}

$loggedIn = $passwordHash && is_logged_in();
$posts = $loggedIn ? blog_read_posts() : [];
$flash = $_SESSION['flash'] ?? null;
unset($_SESSION['flash']);
$form = $_SESSION['form'] ?? null;
unset($_SESSION['form']);

$editId = $loggedIn ? (string) ($_GET['izmeni'] ?? '') : '';
$editIndex = $editId !== '' ? find_post_index($posts, $editId) : null;
$editing = $editIndex !== null ? $posts[$editIndex] : null;
$values = $form ?: ($editing ?: ['title' => '', 'description' => '', 'url' => '']);
?>
<!doctype html>
<html lang="sr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Admin - Blog | Ordinacija Raović</title>
<style>
  :root { --ink: #1a1d26; --brown: #8f7358; --muted: #6b5e52; --bg: #f7f2ec; --line: rgba(176, 143, 110, 0.25); --danger: #a3204f; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; background: var(--bg); color: var(--ink); line-height: 1.5; }
  .wrap { width: min(860px, calc(100% - 32px)); margin: 0 auto; padding: 32px 0 64px; }
  header { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 24px; }
  h1 { font-family: Georgia, "Times New Roman", serif; font-size: 1.8rem; margin: 0; }
  h2 { font-family: Georgia, "Times New Roman", serif; font-size: 1.25rem; margin: 0 0 16px; }
  .card { background: #fff; border: 1px solid var(--line); border-radius: 18px; padding: 22px 20px; box-shadow: 0 8px 22px rgba(90, 60, 40, 0.06); margin-bottom: 20px; }
  label { display: block; font-weight: 600; font-size: 0.9rem; margin: 14px 0 6px; }
  label small { font-weight: 400; color: var(--muted); }
  input[type=text], input[type=url], input[type=password], textarea { width: 100%; font: inherit; padding: 10px 12px; border: 1px solid var(--line); border-radius: 10px; background: #fff; }
  textarea { min-height: 90px; resize: vertical; }
  input:focus, textarea:focus { outline: 2px solid var(--brown); outline-offset: 1px; }
  .btn { display: inline-flex; align-items: center; gap: 6px; font: inherit; font-weight: 600; border: 0; border-radius: 999px; padding: 10px 20px; cursor: pointer; text-decoration: none; background: var(--brown); color: #fff; }
  .btn--ghost { background: transparent; color: var(--brown); border: 1px solid var(--line); }
  .btn--small { padding: 6px 12px; font-size: 0.85rem; }
  .btn--danger { background: transparent; color: var(--danger); border: 1px solid rgba(163, 32, 79, 0.3); }
  .fetch { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-top: 8px; }
  .fetch__status { font-size: 0.85rem; color: var(--muted); }
  .fetch__status.is-error { color: var(--danger); }
  .actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }
  .msg { padding: 12px 16px; border-radius: 12px; margin-bottom: 20px; }
  .msg--ok { background: #eef6ee; color: #23582b; border: 1px solid #cfe5cf; }
  .msg--error { background: rgba(163, 32, 79, 0.08); color: #7d1840; border: 1px solid rgba(163, 32, 79, 0.25); }
  .post { display: grid; grid-template-columns: 1fr auto; gap: 12px 16px; padding: 16px 0; border-top: 1px solid var(--line); }
  .post:first-of-type { border-top: 0; padding-top: 0; }
  .post h3 { margin: 0 0 4px; font-size: 1.05rem; }
  .post p { margin: 0 0 6px; color: var(--muted); font-size: 0.92rem; white-space: pre-line; }
  .post a.link { color: var(--brown); font-size: 0.85rem; word-break: break-all; }
  .post__buttons { display: flex; flex-wrap: wrap; gap: 6px; align-items: start; justify-content: flex-end; }
  .post__buttons form { margin: 0; }
  .muted { color: var(--muted); }
  code { background: #f1e9df; padding: 2px 6px; border-radius: 6px; word-break: break-all; }
  @media (max-width: 600px) {
    header { flex-direction: column; align-items: flex-start; }
    .post { grid-template-columns: 1fr; }
    .post__buttons { justify-content: flex-start; }
  }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <h1>Blog - objave</h1>
    <?php if ($loggedIn): ?>
      <div class="actions" style="margin:0">
        <a class="btn btn--ghost btn--small" href="/blog" target="_blank" rel="noopener">Pogledaj blog ↗</a>
        <form method="post"><?= csrf_field() ?><button class="btn btn--ghost btn--small" name="action" value="logout">Odjava</button></form>
      </div>
    <?php endif; ?>
  </header>

  <?php if ($flash): ?>
    <div class="msg msg--<?= $flash['type'] === 'error' ? 'error' : 'ok' ?>" role="status"><?= h($flash['message']) ?></div>
  <?php endif; ?>

  <?php if (!$passwordHash): ?>
    <div class="card">
      <h2>Postavljanje lozinke</h2>
      <p>Lozinka za admin još nije postavljena. Postavlja se jednom, preko cPanel-a:</p>
      <ol>
        <li>U cPanel-u otvorite <strong>File Manager</strong> i idite u folder <code><?= h(blog_data_dir()) ?></code>.</li>
        <li>Napravite fajl <code>lozinka.txt</code> i u njega upišite željenu lozinku (najmanje 10 znakova).</li>
        <li>Osvežite ovu stranicu. Lozinka će biti sačuvana šifrovano, a fajl <code>lozinka.txt</code> automatski obrisan.</li>
      </ol>
      <p class="muted">Za promenu lozinke kasnije: obrišite <code>admin.json</code> u istom folderu i ponovite korake.</p>
    </div>

  <?php elseif (!$loggedIn): ?>
    <form class="card" method="post" style="max-width:420px">
      <h2>Prijava</h2>
      <?= csrf_field() ?>
      <label for="password">Lozinka</label>
      <input id="password" type="password" name="password" autocomplete="current-password" required autofocus>
      <div class="actions"><button class="btn" name="action" value="login">Prijavi se</button></div>
    </form>

  <?php else: ?>
    <form class="card" method="post">
      <h2><?= $editing ? 'Izmena objave' : 'Nova objava' ?></h2>
      <?= csrf_field() ?>
      <?php if ($editing): ?><input type="hidden" name="id" value="<?= h($editing['id']) ?>"><?php endif; ?>
      <label for="title">Naslov</label>
      <input id="title" type="text" name="title" maxlength="<?= BLOG_TITLE_MAX ?>" value="<?= h($values['title'] ?? '') ?>" required>
      <label for="url">Link ka objavi na Instagramu</label>
      <input id="url" type="url" name="url" placeholder="https://www.instagram.com/reel/..." value="<?= h($values['url'] ?? '') ?>" required>
      <label for="description">Opis <small>(nije obavezno)</small></label>
      <textarea id="description" name="description" maxlength="<?= BLOG_DESCRIPTION_MAX ?>"><?= h($values['description'] ?? '') ?></textarea>
      <div class="fetch">
        <button type="button" class="btn btn--ghost btn--small" id="fetch-caption">Preuzmi opis iz objave</button>
        <span class="fetch__status" id="fetch-status" role="status"></span>
      </div>
      <div class="actions">
        <button class="btn" name="action" value="<?= $editing ? 'update' : 'add' ?>"><?= $editing ? 'Sačuvaj izmene' : 'Dodaj objavu' ?></button>
        <?php if ($editing): ?><a class="btn btn--ghost" href="/admin">Otkaži</a><?php endif; ?>
      </div>
    </form>

    <div class="card">
      <h2>Objave na blogu (<?= count($posts) ?>)</h2>
      <?php if (!$posts): ?>
        <p class="muted">Još nema objava.</p>
      <?php endif; ?>
      <?php foreach ($posts as $i => $post): ?>
        <div class="post">
          <div>
            <h3><?= h($post['title'] ?? '') ?></h3>
            <?php if (!empty($post['description'])): ?><p><?= h($post['description']) ?></p><?php endif; ?>
            <a class="link" href="<?= h($post['url'] ?? '') ?>" target="_blank" rel="noopener noreferrer"><?= h($post['url'] ?? '') ?></a>
          </div>
          <div class="post__buttons">
            <?php foreach ([['up', '↑', 'Pomeri gore', $i > 0], ['down', '↓', 'Pomeri dole', $i < count($posts) - 1]] as $move): ?>
              <?php if ($move[3]): ?>
                <form method="post"><?= csrf_field() ?><input type="hidden" name="id" value="<?= h($post['id'] ?? '') ?>"><button class="btn btn--ghost btn--small" name="action" value="<?= $move[0] ?>" title="<?= $move[2] ?>" aria-label="<?= $move[2] ?>"><?= $move[1] ?></button></form>
              <?php endif; ?>
            <?php endforeach; ?>
            <a class="btn btn--ghost btn--small" href="/admin?izmeni=<?= h(rawurlencode($post['id'] ?? '')) ?>">Izmeni</a>
            <form method="post" onsubmit="return confirm('Obrisati ovu objavu?')"><?= csrf_field() ?><input type="hidden" name="id" value="<?= h($post['id'] ?? '') ?>"><button class="btn btn--danger btn--small" name="action" value="delete">Obriši</button></form>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  <?php endif; ?>
</div>
<?php if ($loggedIn): ?>
<script>
  // Preuzima opis sa Instagrama za link upisan u formu i upisuje ga u polje Opis.
  (function () {
    var button = document.getElementById('fetch-caption');
    if (!button) return;
    var status = document.getElementById('fetch-status');
    var form = button.closest('form');
    var description = document.getElementById('description');
    var url = document.getElementById('url');

    function show(text, isError) {
      status.textContent = text;
      status.classList.toggle('is-error', !!isError);
    }

    button.addEventListener('click', function () {
      if (!url.value.trim()) { show('Prvo upišite link ka objavi.', true); url.focus(); return; }
      if (description.value.trim() && !confirm('Zameniti postojeći opis tekstom sa Instagrama?')) return;
      var data = new FormData();
      data.append('action', 'fetch_caption');
      data.append('csrf', form.querySelector('input[name=csrf]').value);
      data.append('url', url.value);
      button.disabled = true;
      show('Preuzimam...');
      fetch('/admin', { method: 'POST', body: data, credentials: 'same-origin' })
        .then(function (res) { return res.json(); })
        .then(function (json) {
          if (!json.ok) { show(json.error, true); return; }
          description.value = json.caption;
          show('Opis je preuzet. Pregledajte ga i po potrebi skratite pre čuvanja.');
        })
        .catch(function () { show('Preuzimanje nije uspelo. Osvežite stranicu i pokušajte ponovo.', true); })
        .finally(function () { button.disabled = false; });
    });
  })();
</script>
<?php endif; ?>
</body>
</html>
