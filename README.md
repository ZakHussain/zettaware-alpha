# ZettaWare

Robot Development Orchestration System - Transform robot hardware manifests into complete development suites.

## Status: Phase 2 Complete ✓

### What's Working
- Project structure created
- CLI with help, generate, verify, run, and list commands
- Transbot library installed and verified
- Colorized console output
- **Manifest parser with YAML validation**
- **Comprehensive robot.yaml for Yahboom Transbot**
- **CLI can discover and list robot manifests**

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
python zetta.py generate robots/yahboom_transbot/robot.yaml
```

### Phase 2 Test Points
```bash
# Test manifest parsing
cd zettaware
python -c "from core.manifest_parser import ManifestParser; from pathlib import Path; print(ManifestParser(Path('robots/yahboom_transbot/robot.yaml')).parse().name)"

# Verify CLI finds manifests
python zetta.py list
```

### Next Steps
- Phase 3: Build template engine
- Phase 4: Create HAL wrapper
- Phase 5: Core suite generator

See `../implementation-plan.md` for full roadmap.