"""Deterministic backend sandbox execution engines for FinSight AI, PayMatch AI, and FinSim."""

from collections import defaultdict
from difflib import SequenceMatcher
import time


DEFAULT_FINSIGHT_PAYLOAD = {
    "monthly_income": 75000,
    "current_balance": 120000,
    "transactions": [
        {"date": "2026-10-02", "merchant": "Rent Transfer", "amount": 18000, "category": "Housing"},
        {"date": "2026-10-04", "merchant": "Cloud Hosting VPS", "amount": 1499, "category": "Subscriptions"},
        {"date": "2026-10-05", "merchant": "AI Dev Tools Pro", "amount": 1650, "category": "Subscriptions"},
        {"date": "2026-10-08", "merchant": "Swiggy Instamart", "amount": 4200, "category": "Food"},
        {"date": "2026-10-12", "merchant": "Streaming Bundle", "amount": 799, "category": "Subscriptions"},
        {"date": "2026-10-15", "merchant": "Metro & Fuel", "amount": 3600, "category": "Transport"},
        {"date": "2026-10-19", "merchant": "Cloud Hosting VPS", "amount": 1499, "category": "Subscriptions"},
        {"date": "2026-10-22", "merchant": "Dining & Coffee", "amount": 5400, "category": "Food"},
        {"date": "2026-10-27", "merchant": "Electricity & Fiber", "amount": 2850, "category": "Utilities"},
    ],
}

DEFAULT_PAYMATCH_PAYLOAD = {
    "fee_tolerance": 2.0,
    "gateway_records": [
        {"id": "GW-901", "ref": "ORD-2026-8812", "gross": 4500.0, "fee": 90.0, "net": 4410.0, "status": "settled"},
        {"id": "GW-902", "ref": "ORD-2026-8813", "gross": 12000.0, "fee": 360.0, "net": 11640.0, "status": "settled"},
        {"id": "GW-903", "ref": "ORD-2026-8814-RETRY", "gross": 3200.0, "fee": 64.0, "net": 3136.0, "status": "settled"},
        {"id": "GW-904", "ref": "ORD-2026-8815", "gross": 7800.0, "fee": 156.0, "net": 7644.0, "status": "pending"},
        {"id": "GW-905", "ref": "ORD-2026-8816", "gross": 2500.0, "fee": 50.0, "net": 2450.0, "status": "settled"},
    ],
    "ledger_records": [
        {"id": "LD-101", "ref": "ORD-2026-8812", "expected_net": 4410.0, "recorded_fee": 90.0},
        {"id": "LD-102", "ref": "ORD-2026-8813", "expected_net": 11760.0, "recorded_fee": 240.0},
        {"id": "LD-103", "ref": "ORD-2026-8814", "expected_net": 3136.0, "recorded_fee": 64.0},
        {"id": "LD-104", "ref": "ORD-2026-8815", "expected_net": 7644.0, "recorded_fee": 156.0},
    ],
}

DEFAULT_FINSIM_PAYLOAD = {
    "liquid_savings": 240000,
    "monthly_income": 75000,
    "monthly_expenses": 46000,
    "inflation_pct": 9.0,
    "income_drop_pct": 35.0,
    "emergency_shock": 60000,
    "horizon_months": 12,
}


def _safe_float(val, default=0.0):
    try:
        return float(val)
    except (TypeError, ValueError):
        return float(default)


def run_finsight_sandbox(payload: dict) -> dict:
    """Analyze cash-flow transactions, detect duplicate/recurring leaks, and forecast 3 months."""
    started = time.perf_counter()
    data = {**DEFAULT_FINSIGHT_PAYLOAD, **(payload or {})}
    income = max(0.0, _safe_float(data.get("monthly_income"), 75000))
    balance = _safe_float(data.get("current_balance"), 120000)
    txs = data.get("transactions") or DEFAULT_FINSIGHT_PAYLOAD["transactions"]

    by_category = defaultdict(float)
    merchant_counts = defaultdict(list)
    total_spend = 0.0

    for tx in txs:
        amount = max(0.0, _safe_float(tx.get("amount"), 0))
        category = str(tx.get("category") or "Other").strip() or "Other"
        merchant = str(tx.get("merchant") or "Unknown").strip()
        total_spend += amount
        by_category[category] += amount
        merchant_counts[merchant.lower()].append({"merchant": merchant, "amount": amount, "date": tx.get("date", "")})

    leaks = []
    for key, entries in merchant_counts.items():
        if len(entries) >= 2:
            total_dup = sum(e["amount"] for e in entries)
            leaks.append({
                "merchant": entries[0]["merchant"],
                "occurrences": len(entries),
                "total_impact": round(total_dup, 2),
                "reason": "Duplicate or multi-cycle charge detected in same billing window",
            })
        elif any(tag in key for tag in ("subscription", "streaming", "bundle", "cloud", "pro")):
            leaks.append({
                "merchant": entries[0]["merchant"],
                "occurrences": 1,
                "total_impact": round(entries[0]["amount"], 2),
                "reason": "Recurring discretionary SaaS/subscription commitment",
            })

    net_monthly = income - total_spend
    savings_rate = round((net_monthly / income) * 100, 1) if income > 0 else 0.0

    forecast = []
    running = balance
    for month_idx in range(1, 4):
        running += net_monthly
        forecast.append({
            "month": f"Month +{month_idx}",
            "projected_balance": round(running, 2),
            "net_delta": round(net_monthly, 2),
        })

    category_breakdown = [
        {"category": cat, "amount": round(amt, 2), "share_pct": round((amt / total_spend) * 100, 1) if total_spend else 0.0}
        for cat, amt in sorted(by_category.items(), key=lambda x: x[1], reverse=True)
    ]

    return {
        "engine": "Django Python Deterministic Cash-Flow Engine",
        "execution_ms": round((time.perf_counter() - started) * 1000, 2),
        "summary": {
            "monthly_income": round(income, 2),
            "total_spend": round(total_spend, 2),
            "net_monthly_cashflow": round(net_monthly, 2),
            "savings_rate_pct": savings_rate,
            "risk_level": "LOW" if savings_rate >= 25 else "MODERATE" if savings_rate >= 5 else "HIGH",
        },
        "leaks": leaks,
        "category_breakdown": category_breakdown,
        "forecast_3m": forecast,
    }


def run_paymatch_sandbox(payload: dict) -> dict:
    """Reconcile gateway settlements against internal ledger records using exact + fuzzy rules."""
    started = time.perf_counter()
    data = {**DEFAULT_PAYMATCH_PAYLOAD, **(payload or {})}
    tolerance = max(0.0, _safe_float(data.get("fee_tolerance"), 2.0))
    gateway = data.get("gateway_records") or DEFAULT_PAYMATCH_PAYLOAD["gateway_records"]
    ledger = data.get("ledger_records") or DEFAULT_PAYMATCH_PAYLOAD["ledger_records"]

    ledger_by_ref = {str(r.get("ref", "")).strip(): r for r in ledger}
    used_ledger_ids = set()
    results = []
    counts = {"MATCHED": 0, "FEE_ANOMALY": 0, "FUZZY_MATCHED": 0, "DELAYED_SETTLEMENT": 0, "MISSING_IN_LEDGER": 0}
    discrepancy_amount = 0.0

    for gw in gateway:
        gw_ref = str(gw.get("ref", "")).strip()
        gw_net = _safe_float(gw.get("net"))
        gw_fee = _safe_float(gw.get("fee"))
        gw_status = str(gw.get("status", "settled")).lower()

        matched_ledger = ledger_by_ref.get(gw_ref)
        match_method = "exact_ref"
        similarity = 1.0

        if not matched_ledger:
            best_score = 0.0
            best_item = None
            for ld in ledger:
                if ld.get("id") in used_ledger_ids:
                    continue
                score = SequenceMatcher(None, gw_ref, str(ld.get("ref", "")).strip()).ratio()
                if score > best_score and score >= 0.72:
                    best_score = score
                    best_item = ld
            if best_item:
                matched_ledger = best_item
                match_method = "fuzzy_ref"
                similarity = round(best_score, 2)

        if not matched_ledger:
            counts["MISSING_IN_LEDGER"] += 1
            discrepancy_amount += gw_net
            results.append({
                "gateway_id": gw.get("id"),
                "ref": gw_ref,
                "status": "MISSING_IN_LEDGER",
                "match_method": "none",
                "delta": round(gw_net, 2),
                "note": "Settled at gateway but absent from internal ledger.",
            })
            continue

        used_ledger_ids.add(matched_ledger.get("id"))
        expected_net = _safe_float(matched_ledger.get("expected_net"))
        recorded_fee = _safe_float(matched_ledger.get("recorded_fee"))
        net_delta = round(gw_net - expected_net, 2)
        fee_delta = round(gw_fee - recorded_fee, 2)

        if gw_status != "settled":
            status = "DELAYED_SETTLEMENT"
            note = f"Ledger expects {expected_net}, gateway settlement still '{gw_status}'."
        elif abs(net_delta) > tolerance or abs(fee_delta) > tolerance:
            status = "FEE_ANOMALY"
            discrepancy_amount += abs(net_delta)
            note = f"Fee mismatch of {fee_delta:+.2f} (Gateway fee {gw_fee} vs Ledger {recorded_fee})."
        elif match_method == "fuzzy_ref":
            status = "FUZZY_MATCHED"
            note = f"Matched retry reference '{gw_ref}' -> '{matched_ledger.get('ref')}' ({int(similarity * 100)}% similarity)."
        else:
            status = "MATCHED"
            note = "Exact reference & net settlement verified."

        counts[status] += 1
        results.append({
            "gateway_id": gw.get("id"),
            "ledger_id": matched_ledger.get("id"),
            "ref": gw_ref,
            "status": status,
            "match_method": match_method,
            "similarity": similarity,
            "delta": net_delta,
            "note": note,
        })

    return {
        "engine": "Django Python Multi-Pass Reconciliation Engine",
        "execution_ms": round((time.perf_counter() - started) * 1000, 2),
        "counts": counts,
        "total_discrepancy_amount": round(discrepancy_amount, 2),
        "records": results,
    }


def run_finsim_sandbox(payload: dict) -> dict:
    """Simulate month-by-month macroeconomic shock survival runway."""
    started = time.perf_counter()
    data = {**DEFAULT_FINSIM_PAYLOAD, **(payload or {})}

    savings = max(0.0, _safe_float(data.get("liquid_savings"), 240000))
    income = max(0.0, _safe_float(data.get("monthly_income"), 75000))
    expenses = max(0.0, _safe_float(data.get("monthly_expenses"), 46000))
    inflation_pct = max(0.0, min(50.0, _safe_float(data.get("inflation_pct"), 9.0)))
    income_drop_pct = max(0.0, min(100.0, _safe_float(data.get("income_drop_pct"), 35.0)))
    shock = max(0.0, _safe_float(data.get("emergency_shock"), 60000))
    months = max(3, min(24, int(_safe_float(data.get("horizon_months"), 12))))

    stressed_income = income * (1.0 - income_drop_pct / 100.0)
    monthly_inflation_factor = (1.0 + (inflation_pct / 100.0) / 12.0)

    baseline_bal = savings
    stressed_bal = savings - shock
    first_deficit_month = None
    trajectory = []

    current_exp = expenses
    for m in range(1, months + 1):
        current_exp = current_exp * monthly_inflation_factor
        baseline_bal += income - expenses
        stressed_bal += stressed_income - current_exp
        if stressed_bal < 0 and first_deficit_month is None:
            first_deficit_month = m
        trajectory.append({
            "month": m,
            "baseline_balance": round(baseline_bal, 2),
            "stressed_balance": round(stressed_bal, 2),
            "monthly_expense_inflated": round(current_exp, 2),
        })

    runway_months = first_deficit_month - 1 if first_deficit_month else months
    verdict = (
        "RESILIENT"
        if first_deficit_month is None and stressed_bal > expenses * 2
        else "FRAGILE"
        if first_deficit_month is None
        else f"CRITICAL (Depletes at Month {first_deficit_month})"
    )

    return {
        "engine": "Django Python Deterministic Stress Simulator",
        "execution_ms": round((time.perf_counter() - started) * 1000, 2),
        "summary": {
            "stressed_monthly_income": round(stressed_income, 2),
            "initial_post_shock_reserve": round(savings - shock, 2),
            "ending_stressed_balance": round(trajectory[-1]["stressed_balance"], 2),
            "runway_months": runway_months,
            "verdict": verdict,
        },
        "trajectory": trajectory,
    }


SANDBOX_HANDLERS = {
    "finsight": run_finsight_sandbox,
    "paymatch": run_paymatch_sandbox,
    "finsim": run_finsim_sandbox,
}
