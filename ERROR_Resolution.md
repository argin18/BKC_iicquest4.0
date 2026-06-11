# Error Resolution Guide

## UnicodeDecodeError: 'utf-8' codec can't decode byte 0xff

### The Error
```
UnicodeDecodeError: 'utf-8' codec can't decode byte 0xff in position 0: invalid start byte
```

### What Causes This
The `.env` file is saved with **UTF-16 or UTF-8 BOM encoding** instead of plain UTF-8.

**Common causes on Windows:**
- Saving `.env` file with Notepad (default: UTF-16 or UTF-8 BOM)
- Using certain text editors that default to UTF-16
- Copy-pasting content with BOM markers

The byte `0xff` is the UTF-16 BOM (Byte Order Mark) signature.

### Quick Fix (3 Steps)

#### Option 1: Automatic Fix Script (Recommended)
```bash
cd Backend
python fix-env-encoding.py
```

This script:
- Detects your `.env` file encoding
- Automatically converts to proper UTF-8
- Shows you the result
- Then you can start the backend

#### Option 2: Delete and Recreate .env
```bash
cd Backend

# Delete the problematic .env file
rm .env
# Or on Windows: del .env

# Copy the example (properly encoded)
cp .env.example .env
# Or on Windows: copy .env.example .env

# Edit .env and add your Gemini API key
# Use a UTF-8 text editor (VS Code, Sublime, Atom, etc.)
```

#### Option 3: Manual Fix with Python
```bash
python -c "
import pathlib
p = pathlib.Path('.env')
raw = p.read_bytes()
# Try different encodings
for enc in ['utf-16', 'utf-8-sig', 'utf-8']:
    try:
        content = raw.decode(enc)
        p.write_text(content, encoding='utf-8')
        print(f'Fixed using {enc}')
        break
    except:
        pass
"
```

### Prevention: How to Create .env Correctly

**On Windows (Any Editor):**
1. Open VS Code, Sublime Text, or Notepad++
2. Create a new file
3. In editor status bar, ensure encoding is **UTF-8** (not UTF-16 or UTF-8 with BOM)
4. Copy content from `.env.example`
5. Add your Gemini API key
6. Save as `.env` in Backend folder

**Recommended: Use VS Code**
```
1. Open VS Code
2. File → Open Folder → Backend folder
3. Right-click → New File → Name: .env
4. Copy from .env.example
5. Bottom right status bar: Click encoding → Select "UTF-8"
6. Paste and edit content
7. Save (Ctrl+S or Cmd+S)
```

**Command Line (Best Method)**
```bash
# This guarantees UTF-8 encoding
cd Backend

# Create .env from example with proper encoding
cat .env.example > .env
# Or on Windows PowerShell:
Get-Content .env.example | Out-File -Encoding UTF8 .env

# Add your API key
# Linux/macOS:
echo "GEMINI_API_KEY=your_key_here" >> .env
# Windows PowerShell:
Add-Content -Path .env -Value "GEMINI_API_KEY=your_key_here"
```

### Expected .env Content
```
DATABASE_URL=sqlite+aiosqlite:///./iiros.db
GEMINI_API_KEY=your_gemini_api_key_here
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Verify Fix Works
After fixing, test the backend:
```bash
cd Backend
python test-backend.py
```

Should show:
```
Python version: 3.11.x (or compatible)
OK: All critical dependencies available
OK: Database URL configured
OK: Gemini API Key configured (or Not configured if not set yet)
```

Then start backend:
```bash
uvicorn app.main:app --reload
```

Should show:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

### Why This Fix is Permanent
The code in `app/core/config.py` now includes automatic detection:
- Detects UTF-16 BOM and converts to UTF-8
- Detects UTF-8 BOM and converts to UTF-8
- Automatically fixes encoding on first load
- No manual intervention needed after first run

### Prevention Going Forward
1. Always use UTF-8 encoding without BOM
2. For editing .env: Use VS Code or similar
3. For creating .env: Copy from .env.example using command line
4. Verify encoding before saving

### Text Editors That Work Well
- ✅ VS Code (set UTF-8)
- ✅ Sublime Text (set UTF-8)
- ✅ Atom (set UTF-8)
- ✅ Notepad++ (Encoding → Encode in UTF-8 without BOM)
- ⚠️ Windows Notepad (avoid - uses UTF-16)
- ⚠️ WordPad (avoid - complex formatting)

## Other Common Errors

### ModuleNotFoundError: No module named 'aiosqlite'
Already fixed in requirements.txt. Just reinstall:
```bash
pip install -r requirements.txt
```

### Port already in use (8000 or 3000)
```bash
# Change port:
uvicorn app.main:app --reload --port 8001

# Or kill process using port:
# Linux/macOS:
lsof -ti:8000 | xargs kill -9
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### CORS Error in Frontend
Ensure CORS_ORIGINS in .env includes your frontend URL:
```
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001
```

### Python 3.14+ Not Supported
IIROS requires Python 3.11-3.13:
```bash
python --version  # Check your version

# Install correct version from python.org
# Or use pyenv:
pyenv install 3.13.0
pyenv local 3.13.0
```

## Complete Troubleshooting Flowchart

```
Error on startup?
├─ UnicodeDecodeError (0xff)?
│  └─ Run: python fix-env-encoding.py
│     └─ Success? → Continue to backend startup
│     └─ Fail? → See "Delete and Recreate .env" above
│
├─ ModuleNotFoundError: aiosqlite?
│  └─ Run: pip install -r requirements.txt
│     └─ Retry: uvicorn app.main:app --reload
│
├─ ModuleNotFoundError: other module?
│  └─ Run: pip install -r requirements.txt
│     └─ If still fails → pip install <module_name>
│
├─ Port 8000 already in use?
│  └─ Run: uvicorn app.main:app --reload --port 8001
│     └─ Or kill the process using lsof/netstat
│
├─ Python version incompatible?
│  └─ Check: python --version
│     └─ Install Python 3.11-3.13 from python.org
│
└─ Gemini API Key error?
   └─ Check .env has: GEMINI_API_KEY=your_real_key
      └─ Get key: https://aistudio.google.com/app/apikey
         └─ Ensure it's the actual key, not placeholder
```

## Support Resources

**Documentation:**
- INSTALLATION.md - Step-by-step setup guide
- SETUP_SUMMARY.md - Quick reference
- Backend/test-backend.py - Auto-test script

**Getting Help:**
1. Run: `python Backend/test-backend.py` (shows what's wrong)
2. Check this file for your specific error
3. Follow the quick fix steps
4. If still failing, check the troubleshooting section

**Gemini API Setup:**
- https://aistudio.google.com/app/apikey
- Free tier available
- Copy the full key (usually 39+ characters)
- Paste in .env as: `GEMINI_API_KEY=your_full_key`

---

**Remember:** The system is designed to be stable. Most errors are environment-related (.env encoding, missing dependencies) and have automated fixes.
