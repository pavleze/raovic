#!/usr/bin/env bash
#
# Pokreće RAOVIC sajt lokalno (dev server).
# Pokretanje:  ./run-site.sh
# Zaustavljanje: Ctrl + C
#
set -e

# Pozicioniraj se u folder gde se skripta nalazi (radi i ako je pokreneš iz drugog foldera).
cd "$(dirname "$0")"

# Instaliraj zavisnosti samo ako fali node_modules.
if [ ! -d "node_modules" ]; then
  echo "📦  Instaliram zavisnosti (samo prvi put)..."
  npm install
fi

echo ""
echo "🚀  Pokrećem sajt..."
echo "    Otvori u browseru:  http://localhost:3000"
echo "    (ako je 3000 zauzet, Vite će ispisati drugi port ispod)"
echo "    Za zaustavljanje pritisni Ctrl + C"
echo ""

npm run dev
