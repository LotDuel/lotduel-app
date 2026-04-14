#!/usr/bin/env python3
"""
YouTube Transcript Extractor
Extracts transcript + metadata from any YouTube URL.

Usage: python yt_transcript.py <URL>
"""

import sys
import subprocess
import json
import re


def ensure_yt_dlp():
    """Install yt-dlp if not available."""
    try:
        subprocess.run(["yt-dlp", "--version"], capture_output=True, check=True)
    except (FileNotFoundError, subprocess.CalledProcessError):
        print("Installing yt-dlp...")
        subprocess.run(
            [sys.executable, "-m", "pip", "install", "yt-dlp", "--break-system-packages", "-q"],
            check=True,
        )


def extract_video_id(url):
    """Extract video ID from various YouTube URL formats."""
    patterns = [
        r"(?:v=|/v/|youtu\.be/|/embed/|/shorts/)([a-zA-Z0-9_-]{11})",
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None


def get_transcript(url):
    """Extract transcript and metadata using yt-dlp."""
    ensure_yt_dlp()

    # Get metadata
    meta_cmd = [
        "yt-dlp", "--dump-json", "--no-download", url,
    ]
    try:
        result = subprocess.run(meta_cmd, capture_output=True, text=True, timeout=30)
        meta = json.loads(result.stdout)
    except Exception as e:
        print(f"Error fetching metadata: {e}")
        return

    title = meta.get("title", "Unknown")
    channel = meta.get("channel", meta.get("uploader", "Unknown"))
    duration = meta.get("duration", 0)
    views = meta.get("view_count", 0)
    upload_date = meta.get("upload_date", "Unknown")

    # Format duration
    mins, secs = divmod(duration, 60)
    hours, mins = divmod(mins, 60)
    dur_str = f"{hours}:{mins:02d}:{secs:02d}" if hours else f"{mins}:{secs:02d}"

    # Format upload date
    if upload_date and len(upload_date) == 8:
        upload_date = f"{upload_date[:4]}-{upload_date[4:6]}-{upload_date[6:]}"

    print(f"Title: {title}")
    print(f"Channel: {channel}")
    print(f"Duration: {dur_str}")
    print(f"Views: {views:,}")
    print(f"Uploaded: {upload_date}")
    print(f"URL: {url}")
    print()

    # Get subtitles/transcript
    sub_cmd = [
        "yt-dlp", "--write-auto-sub", "--sub-lang", "en",
        "--skip-download", "--sub-format", "vtt",
        "-o", "/tmp/yt_transcript",
        url,
    ]
    subprocess.run(sub_cmd, capture_output=True, text=True, timeout=60)

    # Try to read the subtitle file
    import glob
    vtt_files = glob.glob("/tmp/yt_transcript*.vtt")

    if not vtt_files:
        print("No English transcript available for this video.")
        return

    with open(vtt_files[0], "r") as f:
        content = f.read()

    # Parse VTT to plain text (remove timestamps and duplicates)
    lines = []
    seen = set()
    for line in content.split("\n"):
        line = line.strip()
        if not line or "-->" in line or line.startswith("WEBVTT") or line.startswith("Kind:") or line.startswith("Language:"):
            continue
        if line.startswith("<"):
            line = re.sub(r"<[^>]+>", "", line)
        clean = re.sub(r"\[.*?\]", "", line).strip()
        if clean and clean not in seen:
            seen.add(clean)
            lines.append(clean)

    # Clean up temp files
    for f in vtt_files:
        import os
        os.remove(f)

    print("═" * 60)
    print("TRANSCRIPT")
    print("═" * 60)
    print(" ".join(lines))


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python yt_transcript.py <YouTube URL>")
        sys.exit(1)

    get_transcript(sys.argv[1])
