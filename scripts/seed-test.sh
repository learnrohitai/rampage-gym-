#!/usr/bin/env bash
# Seeds 10 mock registrations for local testing. Safe to delete afterwards.
set -u
BASE="${BASE:-http://localhost:3000}"
RECEIPT="./data/mock-receipt.png"
mkdir -p ./data
printf 'mock-payment-receipt-bytes' > "$RECEIPT"

# heightClass values must contain both ' and " to match lib/categories.ts
PH=$'{"heightClass":"Above 5\'9\\"","height":"6.1"}'
PL=$'{"heightClass":"Below 5\'9\\"","height":"5.7"}'

seed() {
  local out
  out=$(curl -s -X POST "$BASE/api/register" \
    --form-string "name=$1" \
    --form-string "phone=$2" \
    --form-string "email=$3" \
    --form-string "dob=$4" \
    --form-string "gender=$5" \
    --form-string "city=$6" \
    --form-string "gym=$7" \
    --form-string "category=$8" \
    --form-string "categoryMeta=$9" \
    --form-string "paymentRef=${10}" \
    --form-string "notes=${11}" \
    --form "receipt=@$RECEIPT;type=image/png" \
    --write-out "|HTTP:%{http_code}")
  printf '%-22s %s\n' "$1" "$out"
}

# --- Bodybuilding (4) ---
seed "Aarav Sharma"   "9876543201" "aarav@example.com"  "1996-03-14" "male" "Mumbai"   "Iron Works"    "bodybuilding" '{"weightClass":"Below 60 kg","competitiveExperience":"Beginner (first show)"}'        "UTR4001230001" "First show, excited!"
seed "Vihaan Singh"   "9876543202" "vihaan@example.com" "1994-07-22" "male" "Delhi"     "Steel Forge"   "bodybuilding" '{"weightClass":"60 - 65 kg","competitiveExperience":"Intermediate (1-3 shows)"}'     "UTR4001230002" ""
seed "Aditya Verma"   "9876543203" "aditya@example.com" "1992-11-02" "male" "Pune"      "Titan Gym"     "bodybuilding" '{"weightClass":"70 - 75 kg","competitiveExperience":"Advanced (4+ shows)"}'          "UTR4001230003" "Paid for two categories earlier"
seed "Rohit Nair"     "9876543204" "rohit@example.com"  "1990-01-30" "male" "Kerala"    "Peak Performance" "bodybuilding" '{"weightClass":"Above 85 kg","competitiveExperience":"Intermediate (1-3 shows)"}'   "UTR4001230004" ""

# --- Masters 35+ (3) ---
seed "Sanjay Kulkarni" "9876543205" "sanjay@example.com" "1984-05-19" "male" "Nagpur"   "Iron Works"    "masters"      '{"age":"42","yearsTraining":"15"}'   "UTR4001230005" ""
seed "Mahesh Iyer"     "9876543206" "mahesh@example.com" "1988-09-08" "male" "Chennai"  "Gym Bros"      "masters"      '{"age":"38","yearsTraining":"12"}'   "UTR4001230006" "Masters division"
seed "Prakash Rao"     "9876543207" "prakash@example.com" "1975-12-01" "male" "Hyderabad" "Steel Forge"  "masters"      '{"age":"51","yearsTraining":"20"}'   "UTR4001230007" ""

# --- Men's Physique (3) ---
seed "Karan Mehta"     "9876543208" "karan@example.com"  "1997-06-11" "male" "Mumbai"   "Peak Performance" "physique"   "$PH"                               "UTR4001230008" ""
seed "Ananya Raj"      "9876543209" "ananya@example.com" "1999-02-27" "female" "Pune"    "Iron Works"    "physique"     "$PL"                               "UTR4001230009" "My first competition"
seed "Nikhil Joshi"    "9876543210" "nikhil@example.com" "1995-08-16" "male" "Ahmedabad" "Titan Gym"    "physique"     '{"heightClass":"Above 5'"'"'9\"","height":"5.10"}' "UTR4001230010" ""
