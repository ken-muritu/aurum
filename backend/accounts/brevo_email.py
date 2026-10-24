"""Brevo (formerly Sendinblue) transactional email via REST API.
Mirrors the pattern used in sibling projects (Caspahub/Solera): call
https://api.brevo.com/v3/smtp/email with the `api-key` header. No SMTP lib needed.
"""
import urllib.request
import json

BREVO_API = "https://api.brevo.com/v3/smtp/email"


def _parse_sender(raw):
    """'Aurum <hello@example.com>' -> {'name','email'}; else treat whole string as email."""
    import re
    m = re.match(r"^(.+?)\s*<([^>]+)>$", (raw or "").strip())
    if m:
        return {"name": m.group(1).strip(), "email": m.group(2).strip()}
    return {"name": "Aurum", "email": raw or "no-reply@aurum.app"}


def send_brevo_email(to_email, subject, html, text=None):
    """Returns (ok: bool, error: str|None)."""
    import os
    from django.conf import settings
    api_key = getattr(settings, "BREVO_API_KEY", "") or os.environ.get("BREVO_API_KEY", "")
    if not api_key:
        return False, "BREVO_API_KEY not configured"
    sender_raw = (getattr(settings, "BREVO_FROM", "") or
                  os.environ.get("BREVO_FROM") or
                  getattr(settings, "BREVO_SENDER_EMAIL", ""))
    if not sender_raw:
        return False, "BREVO_FROM not configured"
    sender = _parse_sender(sender_raw)
    payload = {
        "sender": sender,
        "to": [{"email": to_email}],
        "subject": subject,
        "htmlContent": html,
        "replyTo": {"email": sender["email"], "name": sender["name"]},
    }
    if text:
        payload["textContent"] = text
    req = urllib.request.Request(
        BREVO_API,
        data=json.dumps(payload).encode("utf-8"),
        headers={"api-key": api_key, "Content-Type": "application/json", "Accept": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            if r.status < 300:
                return True, None
            body = r.read().decode("utf-8", "ignore")
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "ignore")
    except Exception as e:
        return False, str(e)
    try:
        msg = json.loads(body).get("message", body)
    except Exception:
        msg = body
    return False, msg
