#!/usr/bin/env python3
"""
Backend Setup Verification Script
Tests if all dependencies are installed and backend is ready to run
"""

import sys
import subprocess
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    print(f"\n[1/4] Python Version Check")
    print(f"      Current: {version.major}.{version.minor}.{version.micro}")
    
    if version.major < 3 or (version.major == 3 and version.minor < 11):
        print("      ❌ ERROR: Python 3.11+ required")
        return False
    
    if version.major >= 3 and version.minor >= 14:
        print("      ⚠️  WARNING: Python 3.14+ may have compatibility issues")
        print("      Consider using Python 3.11-3.13")
    
    print("      ✅ Python version OK")
    return True

def check_dependencies():
    """Check if required packages are installed"""
    print(f"\n[2/4] Dependency Check")
    
    dependencies = {
        'fastapi': 'FastAPI Web Framework',
        'sqlalchemy': 'SQLAlchemy ORM',
        'pydantic': 'Pydantic Data Validation',
        'aiosqlite': 'Async SQLite Driver',
        'uvicorn': 'ASGI Server',
        'google.generativeai': 'Google Gemini AI',
    }
    
    missing = []
    for module, description in dependencies.items():
        try:
            __import__(module)
            print(f"      ✅ {module:<25} {description}")
        except ImportError:
            print(f"      ❌ {module:<25} {description}")
            missing.append(module)
    
    if missing:
        print(f"\n      ❌ Missing {len(missing)} dependencies!")
        print(f"      Run: pip install -r requirements.txt")
        return False
    
    print("      ✅ All dependencies installed")
    return True

def check_environment():
    """Check environment configuration"""
    print(f"\n[3/4] Environment Configuration Check")
    
    env_file = Path(".env")
    if env_file.exists():
        print(f"      ✅ .env file found")
        try:
            from app.core.config import settings
            print(f"      ✅ Database URL: {settings.DATABASE_URL}")
            print(f"      ✅ Environment: {settings.ENVIRONMENT}")
            if settings.GEMINI_API_KEY:
                print(f"      ✅ Gemini API: Configured")
            else:
                print(f"      ⚠️  Gemini API: Not configured (add GEMINI_API_KEY to .env)")
            return True
        except Exception as e:
            print(f"      ❌ Error loading config: {e}")
            return False
    else:
        print(f"      ⚠️  .env file not found")
        print(f"      Create .env with: DATABASE_URL=sqlite+aiosqlite:///./iiros.db")
        return False

def check_app_imports():
    """Check if app can be imported"""
    print(f"\n[4/4] Application Import Check")
    
    try:
        from app.main import app
        print(f"      ✅ FastAPI app imported successfully")
        print(f"      ✅ All routers loaded")
        return True
    except Exception as e:
        print(f"      ❌ Failed to import app: {e}")
        return False

def main():
    """Run all checks"""
    print("╔════════════════════════════════════════════════════════════╗")
    print("║        IIROS Backend Setup Verification                  ║")
    print("╚════════════════════════════════════════════════════════════╝")
    
    results = []
    
    results.append(("Python Version", check_python_version()))
    results.append(("Dependencies", check_dependencies()))
    results.append(("Environment", check_environment()))
    results.append(("App Imports", check_app_imports()))
    
    print(f"\n╔════════════════════════════════════════════════════════════╗")
    print(f"║                     Verification Summary                  ║")
    print(f"╚════════════════════════════════════════════════════════════╝")
    
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {name}")
    
    all_passed = all(result for _, result in results)
    
    if all_passed:
        print(f"\n✅ All checks passed! Backend is ready to run.")
        print(f"\nStart backend with:")
        print(f"  uvicorn app.main:app --reload --port 8000")
        return 0
    else:
        print(f"\n❌ Some checks failed. Please fix issues above.")
        print(f"\nCommon fixes:")
        print(f"  1. Install dependencies: pip install -r requirements.txt")
        print(f"  2. Create .env file with DATABASE_URL")
        print(f"  3. Update Python to 3.11+")
        return 1

if __name__ == "__main__":
    sys.exit(main())
