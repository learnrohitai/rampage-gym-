#!/usr/bin/env bash
# Verifies the seeded 10 mock registrations end-to-end.
set -u
BASE=http://localhost:3000
JAR=./.test-cookies.txt
PASS=0; FAIL=0

ok()   { PASS=$((PASS+1)); printf '  \033[32mPASS\033[0m  %s\n' "$1"; }
bad()  { FAIL=$((FAIL+1)); printf '  \033[31mFAIL\033[0m  %s\n' "$1"; }
check(){ if [ "$2" = "$3" ]; then ok "$1 ($2)"; else bad "$1 — expected [$3] got [$2]"; fi; }

rm -f "$JAR"
curl -s -c "$JAR" -X POST "$BASE/api/admin/login" -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"MrIndia@2026"}' -o /dev/null

echo "--- admin session ---"
check "login" "$(curl -s -o /dev/null -w '%{http_code}' -c "$JAR" -X POST "$BASE/api/admin/login" -H 'Content-Type: application/json' -d '{"username":"admin","password":"MrIndia@2026"}')" "200"

echo "--- list / stats ---"
LIST=$(curl -s -b "$JAR" "$BASE/api/admin/registrations")
echo "$LIST" > ./.test-list.json
node -e '
const r=JSON.parse(require("fs").readFileSync("./.test-list.json","utf8")).registrations;
const c=k=>r.reduce((m,x)=>(m[x[k]]=(m[x[k]]||0)+1,m),{});
console.log("total="+r.length);
console.log("category="+JSON.stringify(c("category")));
console.log("gender="+JSON.stringify(c("gender")));
console.log("paymentStatus="+JSON.stringify(c("paymentStatus")));
console.log("allHaveMeta="+r.every(x=>x.categoryMeta&&Object.keys(x.categoryMeta).length>0));
console.log("allHaveReceipt="+r.every(x=>!!x.receiptFile));
console.log("mastersAgeOk="+r.filter(x=>x.category==="masters").every(x=>+x.categoryMeta.age>=35));
console.log("phonesUnique="+(new Set(r.map(x=>x.phone)).size===r.length));
console.log("emailsUnique="+(new Set(r.map(x=>x.email)).size===r.length));
console.log("regIdsUnique="+(new Set(r.map(x=>x.regId)).size===r.length));
' | tee ./.test-stats.txt
grep -q '^total=10$' ./.test-stats.txt && ok "10 registrations stored" || bad "expected 10 registrations"
if grep -q '"bodybuilding":4' ./.test-stats.txt && grep -q '"masters":3' ./.test-stats.txt && grep -q '"physique":3' ./.test-stats.txt; then ok "category split 4/3/3"; else bad "category split wrong"; fi
grep -q 'paymentStatus={"unverified":10}' ./.test-stats.txt && ok "all start unverified" || bad "paymentStatus wrong"
grep -q 'allHaveMeta=true' ./.test-stats.txt && ok "every record has categoryMeta" || bad "categoryMeta missing"
grep -q 'allHaveReceipt=true' ./.test-stats.txt && ok "every record has a receipt" || bad "receipt missing"
grep -q 'mastersAgeOk=true' ./.test-stats.txt && ok "all masters are 35+" || bad "masters age check failed"
grep -q 'phonesUnique=true' ./.test-stats.txt && ok "phones unique" || bad "duplicate phones"
grep -q 'regIdsUnique=true' ./.test-stats.txt && ok "regIds unique" || bad "duplicate regIds"

echo "--- CSV export ---"
curl -s -b "$JAR" "$BASE/api/admin/registrations?format=csv" > ./.test-regs.csv
check "CSV rows (header + 10)" "$(grep -c '' ./.test-regs.csv)" "11"
grep -q 'weightClass' ./.test-regs.csv && ok "CSV has weightClass column" || bad "CSV weightClass column missing"
grep -q 'competitiveExperience' ./.test-regs.csv && ok "CSV has competitiveExperience column" || bad "CSV competitiveExperience column missing"
grep -q 'yearsTraining' ./.test-regs.csv && ok "CSV has masters columns (age/yearsTraining)" || bad "CSV masters columns missing"
grep -q 'heightClass' ./.test-regs.csv && ok "CSV has heightClass column" || bad "CSV heightClass column missing"
grep -q 'paymentStatus' ./.test-regs.csv && ok "CSV has paymentStatus column" || bad "CSV paymentStatus column missing"
grep -q 'Below 60 kg' ./.test-regs.csv && ok "CSV has weight-class value" || bad "weight class value missing"
grep -q '"yearsTraining"\|,15,' ./.test-regs.csv && ok "CSV has masters values" || bad "masters values missing"
grep -q '5.10' ./.test-regs.csv && ok "CSV has physique values" || bad "physique values missing"

echo "--- JSON export ---"
check "JSON export count" "$(curl -s -b "$JAR" "$BASE/api/admin/registrations?format=json" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>console.log(JSON.parse(d).length))')" "10"

echo "--- payment / status PATCH persistence ---"
PID_=$(node -e "const r=JSON.parse(require('fs').readFileSync('./.test-list.json','utf8')).registrations[5];console.log(r.id)")
getpair() {
  curl -s -b "$JAR" "$BASE/api/admin/registrations" |
    node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{const r=JSON.parse(d).registrations.find(x=>x.id==='$PID_');console.log(r.paymentStatus+','+r.status)})"
}
pat() { curl -s -o /dev/null -w '%{http_code}' -b "$JAR" -X PATCH "$BASE/api/admin/registrations" -H 'Content-Type: application/json' -d "{\"id\":\"$PID_\",\"paymentStatus\":\"$1\"}"; }
pat "verified" > /dev/null
check "paymentStatus=verified persists" "$(getpair | cut -d, -f1)" "verified"
check "also sets status=confirmed" "$(getpair | cut -d, -f2)" "confirmed"
pat "rejected" > /dev/null
check "paymentStatus=rejected persists" "$(getpair | cut -d, -f1)" "rejected"
check "also sets status=rejected" "$(getpair | cut -d, -f2)" "rejected"
check "invalid paymentStatus -> 400" "$(pat 'nonsense')" "400"
pat "unverified" > /dev/null
check "reset back to unverified" "$(getpair | cut -d, -f1)" "unverified"
check "reset status back to pending" "$(getpair | cut -d, -f2)" "pending"

echo "--- details endpoint (admin) ---"
for i in 0 3 6 9; do
  RID=$(node -e "const r=JSON.parse(require('fs').readFileSync('./.test-list.json','utf8')).registrations[$i];console.log(r.regId)")
  PH=$(node -e "const r=JSON.parse(require('fs').readFileSync('./.test-list.json','utf8')).registrations[$i];console.log(r.phone)")
  CODE=$(curl -s -o /dev/null -w '%{http_code}' -b "$JAR" "$BASE/api/admin/details/$RID")
  check "details $RID" "$CODE" "200"

  # athlete pass lookup with correct phone
  PCODE=$(curl -s -o /dev/null -w '%{http_code}' "$BASE/api/pass?regId=$RID&phone=$PH")
  check "pass lookup $RID" "$PCODE" "200"

  # wrong phone must be rejected
  WCODE=$(curl -s -o /dev/null -w '%{http_code}' "$BASE/api/pass?regId=$RID&phone=0000000000")
  check "pass wrong-phone $RID" "$WCODE" "404"

  # receipt download
  RC=$(curl -s -o /dev/null -w '%{http_code}' "$BASE/api/pass/receipt?regId=$RID&phone=$PH")
  check "receipt $RID" "$RC" "200"
done

echo "--- PII must not leak from /api/pass ---"
RID=$(node -e "const r=JSON.parse(require('fs').readFileSync('./.test-list.json','utf8')).registrations[0];console.log(r.regId)")
PH=$(node -e "const r=JSON.parse(require('fs').readFileSync('./.test-list.json','utf8')).registrations[0];console.log(r.phone)")
echo "  (checking $RID)"
BODY=$(curl -s "$BASE/api/pass?regId=$RID&phone=$PH")
for f in phone email dob city gym notes receiptOriginalName; do
  echo "$BODY" | grep -q "\"$f\"" && bad "/api/pass leaks '$f'" || ok "/api/pass does not expose $f"
done

echo "--- unauth admin access ---"
check "details without session" "$(curl -s -o /dev/null -w '%{http_code}' "$BASE/api/admin/details/$RID")" "401"
check "list without session" "$(curl -s -o /dev/null -w '%{http_code}' "$BASE/api/admin/registrations")" "401"

echo
echo "=============================="
echo "  PASS: $PASS   FAIL: $FAIL"
echo "=============================="
echo
rm -f ./.test-list.json ./.test-stats.txt ./.test-regs.csv ./.test-cookies.txt
[ "$FAIL" -eq 0 ]
