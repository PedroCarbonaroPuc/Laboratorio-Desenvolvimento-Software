#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:8080/api}"
TMP_DIR="$(mktemp -d)"

PASSED=0
FAILED=0

cleanup() {
  rm -rf "$TMP_DIR"
}

trap cleanup EXIT

print_result() {
  local status="$1"
  local description="$2"

  if [[ "$status" == "PASS" ]]; then
    PASSED=$((PASSED + 1))
    printf '[PASS] %s\n' "$description"
  else
    FAILED=$((FAILED + 1))
    printf '[FAIL] %s\n' "$description"
  fi
}

extract_json_string() {
  local field="$1"
  local file="$2"
  sed -n "s/.*\"$field\":\"\\([^\"]*\\)\".*/\\1/p" "$file" | head -n 1
}

run_test() {
  local name="$1"
  local expected_status="$2"
  local expected_regex="$3"
  local method="$4"
  local endpoint="$5"
  local body="$6"
  local token="$7"
  local out_file="$TMP_DIR/${name// /_}.json"
  local http_code

  if [[ -n "$token" ]]; then
    if [[ -n "$body" ]]; then
      http_code="$(curl -sS -o "$out_file" -w '%{http_code}' -X "$method" "$BASE_URL$endpoint" -H 'Accept: application/json' -H 'Content-Type: application/json' -H "Authorization: Bearer $token" -d "$body")"
    else
      http_code="$(curl -sS -o "$out_file" -w '%{http_code}' -X "$method" "$BASE_URL$endpoint" -H 'Accept: application/json' -H "Authorization: Bearer $token")"
    fi
  else
    if [[ -n "$body" ]]; then
      http_code="$(curl -sS -o "$out_file" -w '%{http_code}' -X "$method" "$BASE_URL$endpoint" -H 'Accept: application/json' -H 'Content-Type: application/json' -d "$body")"
    else
      http_code="$(curl -sS -o "$out_file" -w '%{http_code}' -X "$method" "$BASE_URL$endpoint" -H 'Accept: application/json')"
    fi
  fi

  if [[ "$http_code" != "$expected_status" ]]; then
    print_result "FAIL" "$name (status esperado: $expected_status, recebido: $http_code)"
    cat "$out_file"
    printf '\n'
    return
  fi

  if [[ -n "$expected_regex" ]] && ! grep -Eq "$expected_regex" "$out_file"; then
    print_result "FAIL" "$name (payload nao contem: $expected_regex)"
    cat "$out_file"
    printf '\n'
    return
  fi

  print_result "PASS" "$name"
}

printf '[INFO] Aguardando API em %s...\n' "$BASE_URL"
curl -sS --retry 30 --retry-delay 1 --retry-connrefused --retry-all-errors "$BASE_URL/institutions" > /dev/null

run_test "institutions_public_list" "200" 'PUC Minas|UFMG|CEFET-MG' "GET" "/institutions" "" ""

run_test "login_professor_ok" "200" '"token":"' "POST" "/auth/login" '{"login":"ana.ribeiro@instituicao.edu","password":"Professor@123","role":"PROFESSOR"}' ""
PROF_FILE="$TMP_DIR/login_professor_ok.json"
PROF_TOKEN="$(extract_json_string token "$PROF_FILE")"

run_test "login_student_ok" "200" '"token":"' "POST" "/auth/login" '{"login":"joao.martins@aluno.edu","password":"Aluno@123","role":"STUDENT"}' ""
STUDENT_FILE="$TMP_DIR/login_student_ok.json"
STUDENT_TOKEN="$(extract_json_string token "$STUDENT_FILE")"
STUDENT_ID="$(extract_json_string userId "$STUDENT_FILE")"

run_test "login_partner_ok" "200" '"token":"' "POST" "/auth/login" '{"login":"nimbus@parceiro.com","password":"Parceiro@123","role":"PARTNER"}' ""
PARTNER_FILE="$TMP_DIR/login_partner_ok.json"
PARTNER_TOKEN="$(extract_json_string token "$PARTNER_FILE")"

run_test "login_student_wrong_password" "400" 'Credenciais invalidas' "POST" "/auth/login" '{"login":"joao.martins@aluno.edu","password":"SenhaErrada","role":"STUDENT"}' ""
run_test "students_me_without_token" "401" 'Autenticacao necessaria' "GET" "/students/me" "" ""
run_test "student_forbidden_create_benefit" "403" 'Permissao insuficiente' "POST" "/benefits" '{"title":"Teste indevido","description":"Sem permissao","imageUrl":"https://example.com/a.png","costCoins":10}' "$STUDENT_TOKEN"

run_test "professor_transfer_invalid_amount" "400" 'Quantidade deve ser maior que zero' "POST" "/professors/me/transfer" "{\"studentId\":\"$STUDENT_ID\",\"amount\":0,\"message\":\"Teste de validacao\"}" "$PROF_TOKEN"
run_test "professor_transfer_success" "201" '' "POST" "/professors/me/transfer" "{\"studentId\":\"$STUDENT_ID\",\"amount\":10,\"message\":\"Ajuste final de merito\"}" "$PROF_TOKEN"

run_test "partner_create_expensive_benefit" "201" '"id":"' "POST" "/benefits" '{"title":"GPU Lab Elite","description":"Voucher para laboratorio premium","imageUrl":"https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80","costCoins":5000}' "$PARTNER_TOKEN"
EXPENSIVE_FILE="$TMP_DIR/partner_create_expensive_benefit.json"
EXPENSIVE_BENEFIT_ID="$(extract_json_string id "$EXPENSIVE_FILE")"

run_test "student_redeem_insufficient_balance" "400" 'Saldo insuficiente' "POST" "/redemptions" "{\"benefitId\":\"$EXPENSIVE_BENEFIT_ID\"}" "$STUDENT_TOKEN"
run_test "student_redeem_missing_benefit" "404" 'Vantagem nao encontrada' "POST" "/redemptions" '{"benefitId":"beneficio-inexistente"}' "$STUDENT_TOKEN"

run_test "benefits_public_list" "200" '"id":"' "GET" "/benefits" "" ""
BENEFITS_FILE="$TMP_DIR/benefits_public_list.json"
FIRST_BENEFIT_ID="$(sed -n 's/.*"id":"\([^"]*\)".*"partnerId".*/\1/p' "$BENEFITS_FILE" | head -n 1)"

if [[ -z "$FIRST_BENEFIT_ID" ]]; then
  print_result "FAIL" "extract_first_benefit_id"
else
  run_test "student_redeem_success" "201" '"couponCode":"' "POST" "/redemptions" "{\"benefitId\":\"$FIRST_BENEFIT_ID\"}" "$STUDENT_TOKEN"
fi

run_test "student_dashboard_summary" "200" '"role":"STUDENT"' "GET" "/dashboard/summary" "" "$STUDENT_TOKEN"
run_test "partner_dashboard_summary" "200" '"role":"PARTNER"' "GET" "/dashboard/summary" "" "$PARTNER_TOKEN"

printf '\n[RESULTADO] testes passados: %d | falhas: %d\n' "$PASSED" "$FAILED"

if [[ "$FAILED" -gt 0 ]]; then
  exit 1
fi
