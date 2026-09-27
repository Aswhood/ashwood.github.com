#!/usr/bin/env python3
"""Simple script to add dates to markdown files without external dependencies."""

import os
import re
import subprocess
from datetime import datetime
from pathlib import Path

def get_current_date():
    """Get current date in ISO format."""
    return datetime.now().isoformat()

def get_git_last_modified(file_path):
    """Get the last modified date from Git for a file."""
    try:
        # Get the last commit date for this file
        result = subprocess.run(
            ['git', 'log', '-1', '--format=%ci', '--', str(file_path)],
            capture_output=True,
            text=True,
            check=True
        )
        if result.stdout.strip():
            # Git returns ISO format, convert to our format
            git_date = result.stdout.strip().split()[0]  # Take just the date part
            return git_date + 'T' + datetime.now().strftime('%H:%M:%S')
    except (subprocess.CalledProcessError, FileNotFoundError):
        pass
    return None

def add_dates_to_file(file_path):
    """Add date_published and date_updated to a markdown file if missing."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Split frontmatter and content
        if content.startswith('---'):
            parts = content.split('---', 2)
            if len(parts) >= 3:
                frontmatter = parts[1]
                body = parts[2]
                
                updated = False
                current_date = get_current_date()
                git_date = get_git_last_modified(file_path) or current_date
                
                # Check if date_published already exists
                if 'date_published:' not in frontmatter:
                    # Add dates to frontmatter
                    date_lines = f"date_published: {current_date}\ndate_updated: {git_date}\n"
                    
                    # Find where to insert (before the closing ---)
                    updated_frontmatter = frontmatter.rstrip() + '\n' + date_lines
                    
                    # Reconstruct file
                    updated_content = f"---\n{updated_frontmatter}---\n{body}"
                    
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(updated_content)
                    
                    print(f"Added dates to {file_path}")
                    return True
                else:
                    # Update date_updated if it exists and file has been modified
                    if 'date_updated:' in frontmatter:
                        # Replace existing date_updated with git date
                        updated_frontmatter = re.sub(
                            r'date_updated:\s*[^\n]+',
                            f'date_updated: {git_date}',
                            frontmatter
                        )
                        if updated_frontmatter != frontmatter:
                            updated_content = f"---\n{updated_frontmatter}---\n{body}"
                            with open(file_path, 'w', encoding='utf-8') as f:
                                f.write(updated_content)
                            print(f"Updated date_updated for {file_path}")
                            return True
        return False
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    """Process all markdown files in website_content directory."""
    content_dir = Path("website_content")
    if not content_dir.exists():
        print("website_content directory not found")
        return
    
    updated_count = 0
    for md_file in content_dir.glob("*.md"):
        if add_dates_to_file(md_file):
            updated_count += 1
    
    print(f"Updated {updated_count} files")

if __name__ == "__main__":
    main()