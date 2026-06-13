#!/usr/bin/env bash
#
# docker-clean-stop.sh
# Pausa e derruba a stack Docker da aplicação.
# Por padrão, preserva cache (imagens e volumes) para subir mais rápido no próximo deploy.
#
# Para limpeza total (sem cache), use --deep-clean.
#
# Uso:
#   ./docker/docker-clean-stop.sh              # limpeza leve (preserva cache)
#   ./docker/docker-clean-stop.sh --deep-clean # remove imagens + volumes + hash de cache
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
# Diretórios
# ----------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
COMPOSE_FILE="${ROOT_DIR}/docker-compose.yml"
CACHE_DIR="${SCRIPT_DIR}/.cache"
DEPLOY_HASH_FILE="${CACHE_DIR}/deploy-inputs.sha256"

DEEP_CLEAN=false
for arg in "$@"; do
  case "$arg" in
    --deep-clean)
      DEEP_CLEAN=true
      ;;
    *)
      warn "Argumento desconhecido ignorado: $arg"
      ;;
  esac
done

# Recursos conhecidos da aplicação (fallback de limpeza)
APP_CONTAINERS=(moeda-frontend moeda-backend moeda-mailhog moeda-rabbitmq moeda-mongo)
APP_IMAGES=(lab04-backend lab04-frontend moeda-estudantil-backend moeda-estudantil-frontend)

# ----------------------------------------------------------------------------
# Pré-requisitos
# ----------------------------------------------------------------------------
if ! command -v docker >/dev/null 2>&1; then
  err "Docker não encontrado."
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  err "O daemon do Docker não está em execução. Abra o Docker Desktop e tente novamente."
  exit 1
fi

if docker compose version >/dev/null 2>&1; then
  COMPOSE=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE=(docker-compose)
else
  COMPOSE=()
fi

echo ""
echo -e "${BOLD}${BLUE}╔══════════════════════════════════════════════════════════════╗${RESET}"
echo -e "${BOLD}${BLUE}║      Moeda Estudantil · Parar e limpar ambiente (Docker)     ║${RESET}"
echo -e "${BOLD}${BLUE}╚══════════════════════════════════════════════════════════════╝${RESET}"
echo ""

# ----------------------------------------------------------------------------
# 1) Derruba a stack via compose (rota principal)
# ----------------------------------------------------------------------------
DOWN_FLAGS=(--remove-orphans)
if [[ "${DEEP_CLEAN}" == true ]]; then
  DOWN_FLAGS+=(--volumes --rmi local)
fi

if [[ ${#COMPOSE[@]} -gt 0 && -f "${COMPOSE_FILE}" ]]; then
  cd "${ROOT_DIR}"
  if [[ "${DEEP_CLEAN}" == true ]]; then
    log "Parando stack com limpeza profunda (--deep-clean)..."
  else
    log "Parando stack com limpeza leve (preservando cache de imagens/volumes)..."
  fi
  "${COMPOSE[@]}" -f "${COMPOSE_FILE}" down "${DOWN_FLAGS[@]}" || warn "compose down retornou aviso (seguindo com a limpeza)."
  ok "Stack derrubada via compose."
else
  warn "Compose indisponível ou arquivo ausente — usando apenas limpeza por nome."
fi

echo ""

# ----------------------------------------------------------------------------
# 2) Fallback: remove containers remanescentes por nome
# ----------------------------------------------------------------------------
log "Verificando containers remanescentes..."
removed_any=false
for c in "${APP_CONTAINERS[@]}"; do
  if docker ps -a --format '{{.Names}}' | grep -qx "${c}"; then
    docker rm -f "${c}" >/dev/null 2>&1 && { ok "Container removido: ${c}"; removed_any=true; }
  fi
done
[[ "${removed_any}" == false ]] && echo -e "  ${DIM}nenhum container remanescente.${RESET}"

echo ""

# ----------------------------------------------------------------------------
# 3) Fallback: remove imagens da aplicação
# ----------------------------------------------------------------------------
if [[ "${DEEP_CLEAN}" == true ]]; then
  log "Removendo imagens construídas pela aplicação..."
  removed_any=false
  for img in "${APP_IMAGES[@]}"; do
    if docker image inspect "${img}" >/dev/null 2>&1; then
      docker rmi -f "${img}" >/dev/null 2>&1 && { ok "Imagem removida: ${img}"; removed_any=true; }
    fi
  done
  [[ "${removed_any}" == false ]] && echo -e "  ${DIM}nenhuma imagem da aplicação encontrada.${RESET}"
else
  log "Preservando imagens da aplicação para acelerar o próximo deploy."
fi

echo ""

# ----------------------------------------------------------------------------
# 4) Fallback: remove volume de dados (apenas deep clean)
# ----------------------------------------------------------------------------
if [[ "${DEEP_CLEAN}" == true ]]; then
  log "Removendo volumes de dados da aplicação..."
  removed_any=false
  for vol in lab04_mongo_data moeda-estudantil_mongo_data; do
    if docker volume inspect "${vol}" >/dev/null 2>&1; then
      docker volume rm "${vol}" >/dev/null 2>&1 && { ok "Volume removido: ${vol}"; removed_any=true; }
    fi
  done
  [[ "${removed_any}" == false ]] && echo -e "  ${DIM}nenhum volume da aplicação encontrado.${RESET}"
  echo ""
fi

# ----------------------------------------------------------------------------
# 5) Rede do projeto (se sobrar)
# ----------------------------------------------------------------------------
for net in lab04_default moeda-estudantil_default; do
  if docker network inspect "${net}" >/dev/null 2>&1; then
    docker network rm "${net}" >/dev/null 2>&1 && ok "Rede removida: ${net}"
  fi
done

if [[ "${DEEP_CLEAN}" == true && -f "${DEPLOY_HASH_FILE}" ]]; then
  rm -f "${DEPLOY_HASH_FILE}"
  ok "Cache de hash do deploy removido (próximo deploy fará rebuild)."
fi

echo ""
echo -e "${BOLD}${GREEN}╔══════════════════════════════════════════════════════════════╗${RESET}"
echo -e "${BOLD}${GREEN}║         Ambiente parado e limpo com sucesso!                 ║${RESET}"
echo -e "${BOLD}${GREEN}╚══════════════════════════════════════════════════════════════╝${RESET}"
echo ""
if [[ "${DEEP_CLEAN}" == true ]]; then
  echo -e "  ${DIM}Limpeza profunda aplicada: dados, imagens e cache removidos.${RESET}"
else
  echo -e "  ${DIM}Limpeza leve aplicada: cache preservado para subir mais rápido.${RESET}"
fi
echo -e "  ${DIM}Para subir novamente:${RESET} ${BOLD}./docker/docker-deploy.sh${RESET}"
echo -e "  ${DIM}Para limpeza profunda:${RESET} ${BOLD}./docker/docker-clean-stop.sh --deep-clean${RESET}"
echo ""
