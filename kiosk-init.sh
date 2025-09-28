#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./set-local-ip-and-run.sh
# Env overrides:
#   ENV_FILE=.env                # default: .env.local if exists, else .env
#   CERT_DIR=./certs             # where to store mkcert output (default: .)
#   IFACE=en0                    # force interface on macOS
#   SCHEME=https://              # or http://
#   APP=main:app                 # uvicorn app module
#   HOST=<auto IP>               # override host
#   PORT=8008                    # uvicorn port
#   UVICORN_BIN=uvicorn          # or absolute path; fallback is "python3 -m uvicorn"
#   PY_BIN=python3               # used only if uvicorn CLI not found

ENV_FILE="${ENV_FILE:-}"
if [[ -z "${ENV_FILE}" ]]; then
  if [[ -f .env.local ]]; then ENV_FILE=".env.local"; else ENV_FILE=".env"; fi
fi
CERT_DIR="${CERT_DIR:-.}"
SCHEME="${SCHEME:-https://}"
APP="${APP:-main:app}"
PORT="${PORT:-8008}"

detect_ip() {
  if [[ "$(uname)" == "Darwin" ]]; then
    local iface="${IFACE:-$(route -n get default 2>/dev/null | awk '/interface:/{print $2}')}"
    if [[ -n "${iface}" ]]; then ipconfig getifaddr "${iface}" 2>/dev/null || true; fi
    ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || true
  else
    if command -v ip >/dev/null 2>&1; then
      ip -4 route get 1.1.1.1 2>/dev/null | awk '{for(i=1;i<=NF;i++){if($i=="src"){print $(i+1); exit}}}'
    else
      hostname -I 2>/dev/null | awk '{print $1}'
    fi
  fi
}

IP="$(detect_ip || true)"
if [[ -z "${IP}" ]]; then
  echo "❌ Could not detect local IP. Try: IFACE=en0 ./set-local-ip-and-run.sh" >&2
  exit 1
fi

HOST="${HOST:-$IP}"
VAL="${SCHEME}${IP}"

# 1) Update .env(.local): NEXT_PUBLIC_IP
touch "${ENV_FILE}"
awk -v val="${VAL}" '
  BEGIN{found=0}
  $0 ~ /^[[:space:]]*NEXT_PUBLIC_IP[[:space:]]*=/ { print "NEXT_PUBLIC_IP=" val; found=1; next }
  { print }
  END{ if(!found) print "NEXT_PUBLIC_IP=" val }
' "${ENV_FILE}" > "${ENV_FILE}.tmp" && mv "${ENV_FILE}.tmp" "${ENV_FILE}"
echo "✅ NEXT_PUBLIC_IP=${VAL} written to ${ENV_FILE}"

CERT_FILE=""
KEY_FILE=""

# 2) mkcert (only if https://)
if [[ "${SCHEME}" == https://* ]]; then
  if ! command -v mkcert >/dev/null 2>&1; then
    echo "⚠️  mkcert not found. Install with: brew install mkcert nss && mkcert -install" >&2
  else
    mkdir -p "${CERT_DIR}"
    # already have certs?
    if ls "${CERT_DIR}/${IP}"*.pem >/dev/null 2>&1; then
      echo "✅ Certificates for ${IP} already exist in ${CERT_DIR}"
    else
      echo "🔐 Generating certs in ${CERT_DIR}: mkcert ${IP} localhost 127.0.0.1"
      ( cd "${CERT_DIR}" && mkcert "${IP}" localhost 127.0.0.1 )
      echo "✅ mkcert done."
    fi
    # Pick newest cert/key
    CERT_FILE="$(ls -t "${CERT_DIR}/${IP}"*.pem 2>/dev/null | grep -v -- '-key\.pem$' | head -n1 || true)"
    KEY_FILE="$(ls -t "${CERT_DIR}/${IP}"*-key.pem 2>/dev/null | head -n1 || true)"
  fi
fi

# 3) Run uvicorn
UVICORN_BIN="${UVICORN_BIN:-}"
if [[ -z "${UVICORN_BIN}" ]]; then
  if command -v uvicorn >/dev/null 2>&1; then
    UVICORN_BIN="uvicorn"
  else
    UVICORN_BIN="${PY_BIN:-python3} -m uvicorn"
  fi
fi

set -x
if [[ "${SCHEME}" == https://* ]] && [[ -n "${CERT_FILE}" && -n "${KEY_FILE}" ]]; then
  # HTTPS
  exec ${UVICORN_BIN} "${APP}" --host "${HOST}" --port "${PORT}" \
    --ssl-certfile "${CERT_FILE}" --ssl-keyfile "${KEY_FILE}"
else
  # HTTP fallback (or SCHEME=http://)
  if [[ "${SCHEME}" == https://* ]]; then
    echo "⚠️  HTTPS requested but certs not available — falling back to HTTP." >&2
  fi
  exec ${UVICORN_BIN} "${APP}" --host "${HOST}" --port "${PORT}"
fi
