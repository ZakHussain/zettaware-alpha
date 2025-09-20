# ZettaWare

Robot Development Orchestration System - Transform robot hardware manifests into complete development suites.

## Status: Phase 1 Complete ✓

### What's Working
- Project structure created
- CLI with help, generate, verify, run, and list commands
- Transbot library installed and verified
- Colorized console output

### Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Install Transbot library
cd ../py_install
pip install -e .
cd ../zettaware

# Test CLI
python zetta.py --help
python zetta.py list
```

### Next Steps
- Phase 2: Implement manifest parser
- Phase 3: Build template engine
- Phase 4: Create HAL wrapper

See `../implementation-plan.md` for full roadmap.