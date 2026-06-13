#!/usr/bin/env bash
#
# docker-deploy.sh
# Sobe TODA a aplicação Moeda Estudantil integrada (MongoDB, RabbitMQ, MailHog,
# Backend Spring Boot e Frontend React/Nginx) via Docker Compose e, ao final,
# imprime os caminhos de acesso a cada serviço.
#
# Uso:
#   ./docker/docker-deploy.sh               # build inteligente (usa cache)
#   ./docker/docker-deploy.sh --force-build # força rebuild
#   ./docker/docker-deploy.sh --no-build    # nunca faz rebuild
#
set -euo pipefail

# ----------------------------------------------------------------------------
# Cores
# ----------------------------------------------------------------------------
if [[ -t 1 ]]; then
  BOLD="\033[1m"; DIM="\033[2m"; RESET="\033[0m"
  GREEN="\033[32m"; CYAN="\033[36m"; YELLOW="\033[33m"; RED="\033[31m"; BLUE="\033[34m"
else
  BOLD=""; DIM=""; RESET=""; GREEN=""; CYAN=""; YELLOW=""; RED=""; BLUE=""
fi

log()  { echo -e "${CYAN}▸${RESET} $*"; }
ok()   { echo -e "${GREEN}✓${RESET} $*"; }
warn() { echo -e "${YELLOW}!${RESET} $*"; }
err()  { echo -e "${RED}✗${RESET} $*" >&2; }

# ----------------------------------------------------------------------------
# Diretórios (script vive em <raiz>/docker, compose fica na raiz)
# ----------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
COMPOSE_FILE="${ROOT_DIR}/docker-compose.yml"
CACHE_DIR="${SCRIPT_DIR}/.cache"
DEPLOY_HASH_FILE="${CACHE_DIR}/deploy-inputs.sha256"

NO_BUILD=false
FORCE_BUILD=false

for arg in "$@"; do
  case "$arg" in
    --no-build)
      NO_BUILD=true
      ;;
    --force-build|--rebuild)
      FORCE_BUILD=true
      ;;
    *)
      warn "Argumento desconhecido ignorado: $arg"
      ;;
  esac
done

# ----------------------------------------------------------------------------
# Pré-requisitos
# ----------------------------------------------------------------------------
if ! command -v docker >/dev/null 2>&1; then
  err "Docker não encontrado. Instale o Docker Desktop e tente novamente."
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  err "O daemon do Docker não está em execução. Abra o Docker Desktop e tente novamente."
  exit 1
fi

# Detecta 'docker compose' (v2) ou 'docker-compose' (v1)
if docker compose version >/dev/null 2>&1; then
  COMPOSE=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE=(docker-compose)
else
  err "Docker Compose não encontrado (nem 'docker compose' nem 'docker-compose')."
  exit 1
fi

if [[ ! -f "${COMPOSE_FILE}" ]]; then
  err "docker-compose.yml não encontrado em ${COMPOSE_FILE}"
  exit 1
fi

cd "${ROOT_DIR}"

mkdir -p "${CACHE_DIR}"

collect_inputs() {
  local rel

  for rel in docker-compose.yml backend/pom.xml backend/Dockerfile frontend/Dockerfile frontend/nginx.conf; do
    if [[ -f "${ROOT_DIR}/${rel}" ]]; then
      echo "${rel}"
    fi
  done

  for rel in frontend/package.json frontend/package-lock.json backend/mvnw backend/mvnw.cmd; do
    if [[ -f "${ROOT_DIR}/${rel}" ]]; then
      echo "${rel}"
    fi
  done

  if [[ -d "${ROOT_DIR}/backend/src" ]]; then
    find "${ROOT_DIR}/backend/src" -type f | sed "s#^${ROOT_DIR}/##"
  fi
  if [[ -d "${ROOT_DIR}/frontend/src" ]]; then
    find "${ROOT_DIR}/frontend/src" -type f | sed "s#^${ROOT_DIR}/##"
  fi
}

calculate_inputs_hash() {
  local tmp_file
  tmp_file="$(mktemp)"

  collect_inputs | sort -u > "${tmp_file}"
  if [[ ! -s "${tmp_file}" ]]; then
    rm -f "${tmp_file}"
    echo ""
    return 0
  fi

  while IFS= read -r rel; do
    shasum -a 256 "${ROOT_DIR}/${rel}" | awk -v r="${rel}" '{print $1 "  " r}'
  done < "${tmp_file}" | shasum -a 256 | awk '{print $1}'

  rm -f "${tmp_file}"
}

CURRENT_HASH="$(calculate_inputs_hash || true)"
PREVIOUS_HASH=""
if [[ -f "${DEPLOY_HASH_FILE}" ]]; then
  PREVIOUS_HASH="$(cat "${DEPLOY_HASH_FILE}" 2>/dev/null || true)"
fi

USE_BUILD=true
BUILD_REASON=""
if [[ "${NO_BUILD}" == true ]]; then
  USE_BUILD=false
  BUILD_REASON="rebuild desativado por --no-build"
elif [[ "${FORCE_BUILD}" == true ]]; then
  USE_BUILD=true
  BUILD_REASON="rebuild forçado por --force-build"
elif [[ -z "${CURRENT_HASH}" ]]; then
  USE_BUILD=true
  BUILD_REASON="não foi possível calcular hash dos arquivos (fallback seguro)"
elif [[ -z "${PREVIOUS_HASH}" ]]; then
  USE_BUILD=true
  BUILD_REASON="primeiro deploy com cache inteligente"
elif [[ "${CURRENT_HASH}" != "${PREVIOUS_HASH}" ]]; then
  USE_BUILD=true
  BUILD_REASON="código/configuração alterados desde o último deploy"
else
  USE_BUILD=false
  BUILD_REASON="sem mudanças detectadas (usando cache de imagens)"
fi

echo ""
echo -e "${BOLD}${BLUE}╔══════════════════════════════════════════════════════════════╗${RESET}"
echo -e "${BOLD}${BLUE}║         Moeda Estudantil · Deploy completo (Docker)          ║${RESET}"
echo -e "${BOLD}${BLUE}╚══════════════════════════════════════════════════════════════╝${RESET}"
echo ""

# ----------------------------------------------------------------------------
# Sobe a stack
# ----------------------------------------------------------------------------
if [[ "${USE_BUILD}" == true ]]; then
  log "Subindo serviços com rebuild: ${BUILD_REASON}."
  "${COMPOSE[@]}" -f "${COMPOSE_FILE}" up --build -d
else
  log "Subindo serviços sem rebuild: ${BUILD_REASON}."
  "${COMPOSE[@]}" -f "${COMPOSE_FILE}" up -d
fi

if [[ -n "${CURRENT_HASH}" ]]; then
  printf '%s' "${CURRENT_HASH}" > "${DEPLOY_HASH_FILE}"
fi

ok "Containers iniciados. Aguardando os serviços ficarem prontos..."
echo ""

# ----------------------------------------------------------------------------
# Aguarda readiness
# ----------------------------------------------------------------------------
wait_for() {
  local name="$1" url="$2" tries="${3:-60}" i=1
  if ! command -v curl >/dev/null 2>&1; then
    warn "curl indisponível — pulando verificação de ${name}."
    return 0
  fi
  printf "  %s" "$(echo -e "${DIM}aguardando ${name}...${RESET}")"
  while (( i <= tries )); do
    if curl --fail --silent --output /dev/null "${url}" 2>/dev/null; then
      echo -e "\r  ${GREEN}✓${RESET} ${name} pronto.                              "
      return 0
    fi
    printf "."
    sleep 3
    (( i++ ))
  done
  echo -e "\r  ${YELLOW}!${RESET} ${name} ainda não respondeu (siga acompanhando pelos logs).   "
  return 1
}

# Backend: endpoint público que retorna as instituições do seed
wait_for "Backend (API)"   "http://localhost:8080/api/instituicoes" 80 || true
# Frontend: página servida pelo Nginx
wait_for "Frontend (Web)"  "http://localhost:3000"                  40 || true

echo ""
echo -e "${BOLD}Status dos containers:${RESET}"
"${COMPOSE[@]}" -f "${COMPOSE_FILE}" ps
echo ""

# ----------------------------------------------------------------------------
# Resumo dos acessos
# ----------------------------------------------------------------------------
echo -e "${BOLD}${GREEN}╔══════════════════════════════════════════════════════════════╗${RESET}"
echo -e "${BOLD}${GREEN}║                  APLICAÇÃO NO AR · ACESSOS                   ║${RESET}"
echo -e "${BOLD}${GREEN}╚══════════════════════════════════════════════════════════════╝${RESET}"
echo ""
echo -e "  ${BOLD}🎨 Frontend (aplicação)${RESET}     ${CYAN}http://localhost:3000${RESET}"
echo -e "  ${BOLD}🖥️  Backend (API REST)${RESET}      ${CYAN}http://localhost:8080/api${RESET}"
echo -e "  ${BOLD}📧 MailHog (e-mails)${RESET}        ${CYAN}http://localhost:8025${RESET}"
echo -e "  ${BOLD}🐰 RabbitMQ (painel)${RESET}        ${CYAN}http://localhost:15672${RESET}   ${DIM}(guest / guest)${RESET}"
echo -e "  ${BOLD}🍃 MongoDB${RESET}                  ${CYAN}mongodb://localhost:27017/moeda_estudantil${RESET}"
if [[ "${APP_MAIL_PROVIDER:-smtp}" == "resend" ]]; then
  if [[ -n "${APP_MAIL_RESEND_API_KEY:-}" ]]; then
    echo -e "  ${GREEN}Modo e-mail atual:${RESET} Resend API (envio externo ativo)."
  else
    echo -e "  ${YELLOW}Modo e-mail atual:${RESET} Resend sem API key (fallback para SMTP local)."
  fi
elif [[ "${SPRING_MAIL_HOST:-mailhog}" == "mailhog" ]]; then
  echo -e "  ${YELLOW}Modo e-mail atual:${RESET} MailHog local (não envia para caixas reais)."
else
  echo -e "  ${GREEN}Modo e-mail atual:${RESET} SMTP externo em ${BOLD}${SPRING_MAIL_HOST}:${SPRING_MAIL_PORT:-25}${RESET}"
fi
echo ""
echo -e "  ${BOLD}Credenciais de demonstração${RESET} ${DIM}(senha: 123456)${RESET}"
echo -e "    • Professor: ${BOLD}professor${RESET}  ou  ${BOLD}maria${RESET}"
echo -e "    • Empresa:   ${BOLD}empresa${RESET}"
echo -e "    • Aluno:     ${BOLD}aluno${RESET}"
echo ""
echo -e "  ${DIM}Logs em tempo real:${RESET} ${BOLD}docker compose logs -f${RESET}"
echo -e "  ${DIM}Encerrar e limpar:${RESET}  ${BOLD}./docker/docker-clean-stop.sh${RESET}"
echo -e "  ${DIM}Forçar rebuild:${RESET}     ${BOLD}./docker/docker-deploy.sh --force-build${RESET}"
echo -e "  ${DIM}Sem rebuild:${RESET}        ${BOLD}./docker/docker-deploy.sh --no-build${RESET}"
echo ""
