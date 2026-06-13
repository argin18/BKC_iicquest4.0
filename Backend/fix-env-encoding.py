#!/usr/bin/env python3
"""Fix .env file encoding issues on Windows."""

import sys
from pathlib import Path


def fix_env_encoding():
    """Detect and fix .env file encoding."""
    env_path = Path(".env")
    
    if not env_path.exists():
        print("ERROR: .env file not found")
        return False
    
    print("Checking .env file encoding...")
    
    try:
        raw_bytes = env_path.read_bytes()
        
        if len(raw_bytes) == 0:
            print("ERROR: .env file is empty")
            return False
        
        needs_fix = False
        encoding_detected = "UTF-8"
        
        # Check for UTF-16 BOM
        if raw_bytes[:2] in (b'\xff\xfe', b'\xfe\xff'):
            encoding_detected = "UTF-16"
            needs_fix = True
        # Check for UTF-8 BOM
        elif raw_bytes[:3] == b'\xef\xbb\xbf':
            encoding_detected = "UTF-8 with BOM"
            needs_fix = True
        else:
            try:
                raw_bytes.decode('utf-8')
                encoding_detected = "UTF-8 (valid)"
                needs_fix = False
            except UnicodeDecodeError:
                print("ERROR: Unrecognized encoding")
                return False
        
        print(f"Current encoding: {encoding_detected}")
        
        if not needs_fix:
            print("OK: .env file encoding is correct!")
            return True
        
        print("Fixing encoding to UTF-8...")
        
        if raw_bytes[:2] in (b'\xff\xfe', b'\xfe\xff'):
            content = raw_bytes.decode('utf-16')
        elif raw_bytes[:3] == b'\xef\xbb\xbf':
            content = raw_bytes.decode('utf-8-sig')
        else:
            content = raw_bytes.decode('utf-8')
        
        env_path.write_text(content, encoding='utf-8')
        
        print("OK: .env file encoding fixed!")
        return True
    
    except Exception as e:
        print(f"ERROR: {e}")
        return False


if __name__ == "__main__":
    print("=" * 60)
    print(".env File Encoding Fixer")
    print("=" * 60)
    
    success = fix_env_encoding()
    
    print("=" * 60)
    if success:
        print("OK: You can now start the backend!")
        sys.exit(0)
    else:
        print("ERROR: Please fix issues above")
        sys.exit(1)
