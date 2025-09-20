# ZettaWare

Robot Development Orchestration System - Transform robot hardware manifests into complete development suites.

## Status: Phase 3 Complete ✓

### What's Working
- Project structure created
- CLI with help, generate, verify, run, and list commands
- Transbot library installed and verified
- Colorized console output
- **Manifest parser with YAML validation**
- **Comprehensive robot.yaml for Yahboom Transbot**
- **CLI can discover and list robot manifests**
- **Template engine with Jinja2 and custom filters**
- **Robot context generation from manifests**
- **Template discovery and validation**

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

### Phase 3 Test Points
```bash
# Test manifest parsing
cd zettaware
python -c "from core.manifest_parser import ManifestParser; from pathlib import Path; print(ManifestParser(Path('robots/yahboom_transbot/robot.yaml')).parse().name)"

# Test template engine
python -c "from core.template_engine import TemplateEngine; from core.manifest_parser import ManifestParser; from pathlib import Path; engine = TemplateEngine(); parser = ManifestParser(Path('robots/yahboom_transbot/robot.yaml')); context = engine.create_context_from_manifest(parser.parse()); print('Robot name (camel):', context['robot_name_camel'])"

# Verify template discovery
python -c "from core.template_engine import TemplateEngine; print('Templates:', TemplateEngine().list_templates())"
```

### Next Steps
- Phase 4: Create HAL wrapper
- Phase 5: Core suite generator
- Phase 6: Motor test suite

See `../implementation-plan.md` for full roadmap.