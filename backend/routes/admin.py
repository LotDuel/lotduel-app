"""
Admin webhook routes.
Allows authenticated remote command execution for deployments and maintenance.
Secured with a secret token — never expose this token publicly.
"""

import subprocess
import os
from flask import Blueprint, request, jsonify

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "")

# Predefined safe jobs
JOBS = {
    "deploy": {
        "description": "Pull latest code, install deps, update DB, restart service",
        "commands": [
            "cd /opt/lotduel/lotduel-app && git pull origin main",
            "cd /opt/lotduel/lotduel-app/backend && source venv/bin/activate && pip install -r requirements.txt -q",
            "cd /opt/lotduel/lotduel-app/backend && source venv/bin/activate && python -c \"from app import create_app; from models import db; app = create_app('production'); app.app_context().push(); db.create_all(); print('DB updated')\"",
            "systemctl restart lotduel",
        ],
    },
    "restart": {
        "description": "Restart the LotDuel service",
        "commands": ["systemctl restart lotduel"],
    },
    "status": {
        "description": "Check service status",
        "commands": ["systemctl is-active lotduel && curl -s localhost:5000/api/health"],
    },
    "logs": {
        "description": "Get recent service logs",
        "commands": ["journalctl -u lotduel -n 40 --no-pager"],
    },
    "disk": {
        "description": "Check disk and memory usage",
        "commands": ["df -h / && echo '---' && free -h"],
    },
    "env": {
        "description": "Show non-secret env vars (masks sensitive values)",
        "commands": [
            "cd /opt/lotduel/lotduel-app/backend && cat .env | sed -E 's/(KEY|SECRET|PASSWORD|URL)=.*/\\1=***MASKED***/'",
        ],
    },
    "nginx_reload": {
        "description": "Test and reload nginx config",
        "commands": ["nginx -t && systemctl reload nginx"],
    },
}


def _check_auth():
    """Verify the admin token from query param or header."""
    if not ADMIN_TOKEN:
        return False, "ADMIN_TOKEN not configured on server"

    token = request.args.get("token") or request.headers.get("X-Admin-Token")
    if not token:
        return False, "Missing token"
    if token != ADMIN_TOKEN:
        return False, "Invalid token"
    return True, None


def _run(cmd, timeout=120):
    """Run a shell command and return output."""
    try:
        result = subprocess.run(
            cmd, shell=True, capture_output=True, text=True,
            timeout=timeout, executable="/bin/bash"
        )
        return {
            "command": cmd,
            "exit_code": result.returncode,
            "stdout": result.stdout[-4000:] if result.stdout else "",
            "stderr": result.stderr[-2000:] if result.stderr else "",
        }
    except subprocess.TimeoutExpired:
        return {"command": cmd, "exit_code": -1, "stdout": "", "stderr": "Command timed out"}
    except Exception as e:
        return {"command": cmd, "exit_code": -1, "stdout": "", "stderr": str(e)}


@admin_bp.route("/jobs", methods=["GET"])
def list_jobs():
    """List available predefined jobs (no auth required for listing)."""
    return jsonify({
        "jobs": {k: v["description"] for k, v in JOBS.items()},
        "usage": "GET /api/admin/run?token=YOUR_TOKEN&job=deploy",
    })


@admin_bp.route("/run", methods=["GET", "POST"])
def run_job():
    """Run a predefined job or custom command.

    Query params:
        token: Admin authentication token (required)
        job: Name of predefined job (e.g. deploy, restart, status, logs)
        cmd: Custom command to run (use instead of job)
    """
    ok, err = _check_auth()
    if not ok:
        return jsonify({"error": err}), 401

    job_name = request.args.get("job")
    custom_cmd = request.args.get("cmd")

    # POST body can also contain commands
    if request.is_json:
        data = request.get_json()
        job_name = job_name or data.get("job")
        custom_cmd = custom_cmd or data.get("cmd")

    if job_name:
        if job_name not in JOBS:
            return jsonify({
                "error": f"Unknown job: {job_name}",
                "available": list(JOBS.keys()),
            }), 400

        job = JOBS[job_name]
        results = []
        for cmd in job["commands"]:
            result = _run(cmd)
            results.append(result)
            # Stop on failure (except for status/logs which are read-only)
            if result["exit_code"] != 0 and job_name not in ("status", "logs", "env", "disk"):
                break

        return jsonify({
            "job": job_name,
            "description": job["description"],
            "results": results,
            "success": all(r["exit_code"] == 0 for r in results),
        })

    elif custom_cmd:
        result = _run(custom_cmd)
        return jsonify({
            "custom": True,
            "result": result,
            "success": result["exit_code"] == 0,
        })

    else:
        return jsonify({
            "error": "Provide 'job' or 'cmd' parameter",
            "available_jobs": list(JOBS.keys()),
        }), 400
