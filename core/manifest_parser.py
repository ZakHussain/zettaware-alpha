"""
Manifest Parser for ZettaWare
Parses and validates robot configuration YAML files
"""

import yaml
from pathlib import Path
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field

@dataclass
class MotorSpec:
    """Motor hardware specification"""
    type: str
    count: int
    control: str
    channels: Dict[str, int]
    specs: Dict[str, Any]

@dataclass
class SensorSpec:
    """Sensor hardware specification"""
    type: str
    count: int = 1
    mount: Optional[str] = None
    i2c_address: Optional[int] = None
    resolution: Optional[List[int]] = None
    fps: Optional[int] = None

@dataclass
class ActuatorSpec:
    """Actuator hardware specification"""
    type: str
    servos: Optional[int] = None
    joints: Optional[List[str]] = None
    count: Optional[int] = None

@dataclass
class PowerSpec:
    """Power system specification"""
    battery: Dict[str, Any]

@dataclass
class LibrarySpec:
    """Provided library specification"""
    name: str
    path: str
    language: str

@dataclass
class RobotManifest:
    """Complete robot configuration manifest"""
    # Robot metadata
    name: str
    type: str
    platform: str

    # Hardware specifications
    motors: Optional[MotorSpec] = None
    sensors: Dict[str, SensorSpec] = field(default_factory=dict)
    actuators: Dict[str, ActuatorSpec] = field(default_factory=dict)
    power: Optional[PowerSpec] = None

    # Capabilities and libraries
    capabilities: List[str] = field(default_factory=list)
    libraries: List[LibrarySpec] = field(default_factory=list)

    # Raw data for custom fields
    raw_data: Dict[str, Any] = field(default_factory=dict)

class ManifestParser:
    """
    Parser for robot manifest YAML files.
    Validates structure and provides typed access to configuration.
    """

    REQUIRED_FIELDS = ['robot', 'hardware']
    ROBOT_REQUIRED = ['name', 'type', 'platform']
    VALID_ROBOT_TYPES = ['differential_drive', 'mobile_manipulator', 'quadruped', 'humanoid']
    VALID_PLATFORMS = ['jetson_nano', 'raspberry_pi', 'arduino', 'esp32', 'desktop']

    def __init__(self, manifest_path: Path):
        """Initialize parser with manifest file path"""
        self.manifest_path = Path(manifest_path)
        if not self.manifest_path.exists():
            raise FileNotFoundError(f"Manifest file not found: {manifest_path}")
        if not self.manifest_path.suffix in ['.yaml', '.yml']:
            raise ValueError(f"Manifest must be a YAML file: {manifest_path}")

        self.raw_data = None
        self.manifest = None
        self.errors = []
        self.warnings = []

    def parse(self) -> RobotManifest:
        """Parse and validate the manifest file"""
        # Load YAML
        self._load_yaml()

        # Validate structure
        self._validate_structure()

        # Parse into dataclasses
        if not self.errors:
            self._parse_manifest()

        # Report any issues
        self._report_issues()

        return self.manifest

    def _load_yaml(self):
        """Load YAML file safely"""
        try:
            with open(self.manifest_path, 'r') as f:
                self.raw_data = yaml.safe_load(f)
        except yaml.YAMLError as e:
            self.errors.append(f"YAML parsing error: {e}")
        except Exception as e:
            self.errors.append(f"Error reading file: {e}")

    def _validate_structure(self):
        """Validate manifest structure and required fields"""
        if not self.raw_data:
            self.errors.append("Empty manifest file")
            return

        # Check required top-level fields
        for field in self.REQUIRED_FIELDS:
            if field not in self.raw_data:
                self.errors.append(f"Missing required field: '{field}'")

        # Validate robot section
        if 'robot' in self.raw_data:
            robot = self.raw_data['robot']
            for field in self.ROBOT_REQUIRED:
                if field not in robot:
                    self.errors.append(f"Missing required robot field: '{field}'")

            # Validate robot type
            if 'type' in robot and robot['type'] not in self.VALID_ROBOT_TYPES:
                self.warnings.append(
                    f"Unknown robot type: '{robot['type']}'. "
                    f"Valid types: {', '.join(self.VALID_ROBOT_TYPES)}"
                )

            # Validate platform
            if 'platform' in robot and robot['platform'] not in self.VALID_PLATFORMS:
                self.warnings.append(
                    f"Unknown platform: '{robot['platform']}'. "
                    f"Valid platforms: {', '.join(self.VALID_PLATFORMS)}"
                )

    def _parse_manifest(self):
        """Parse raw data into structured manifest"""
        robot = self.raw_data['robot']
        hardware = self.raw_data.get('hardware', {})

        # Parse motors
        motors = None
        if 'motors' in hardware:
            m = hardware['motors']
            motors = MotorSpec(
                type=m.get('type', 'unknown'),
                count=m.get('count', 0),
                control=m.get('control', 'unknown'),
                channels=m.get('channels', {}),
                specs=m.get('specs', {})
            )

        # Parse sensors
        sensors = {}
        if 'sensors' in hardware:
            for name, spec in hardware['sensors'].items():
                sensors[name] = SensorSpec(
                    type=spec.get('type', 'unknown'),
                    count=spec.get('count', 1),
                    mount=spec.get('mount'),
                    i2c_address=spec.get('i2c_address'),
                    resolution=spec.get('resolution'),
                    fps=spec.get('fps')
                )

        # Parse actuators
        actuators = {}
        if 'actuators' in hardware:
            for name, spec in hardware['actuators'].items():
                actuators[name] = ActuatorSpec(
                    type=spec.get('type', 'unknown'),
                    servos=spec.get('servos'),
                    joints=spec.get('joints'),
                    count=spec.get('count')
                )

        # Parse power
        power = None
        if 'power' in hardware:
            power = PowerSpec(battery=hardware['power'].get('battery', {}))

        # Parse libraries
        libraries = []
        if 'libraries' in self.raw_data:
            if 'provided' in self.raw_data['libraries']:
                for lib in self.raw_data['libraries']['provided']:
                    libraries.append(LibrarySpec(
                        name=lib.get('name', 'unknown'),
                        path=lib.get('path', ''),
                        language=lib.get('language', 'python')
                    ))

        # Create manifest
        self.manifest = RobotManifest(
            name=robot['name'],
            type=robot['type'],
            platform=robot['platform'],
            motors=motors,
            sensors=sensors,
            actuators=actuators,
            power=power,
            capabilities=self.raw_data.get('capabilities', []),
            libraries=libraries,
            raw_data=self.raw_data
        )

    def _report_issues(self):
        """Report any errors or warnings found during parsing"""
        if self.errors:
            print("[ERROR] Manifest parsing failed:")
            for error in self.errors:
                print(f"  - {error}")
            raise ValueError(f"Manifest validation failed with {len(self.errors)} errors")

        if self.warnings:
            print("[WARN] Manifest parsing warnings:")
            for warning in self.warnings:
                print(f"  - {warning}")

    def get_info(self) -> str:
        """Get a formatted summary of the manifest"""
        if not self.manifest:
            return "No manifest loaded"

        info = []
        info.append(f"Robot: {self.manifest.name}")
        info.append(f"Type: {self.manifest.type}")
        info.append(f"Platform: {self.manifest.platform}")

        if self.manifest.motors:
            info.append(f"Motors: {self.manifest.motors.count}x {self.manifest.motors.type}")

        if self.manifest.sensors:
            info.append(f"Sensors: {', '.join(self.manifest.sensors.keys())}")

        if self.manifest.actuators:
            info.append(f"Actuators: {', '.join(self.manifest.actuators.keys())}")

        if self.manifest.capabilities:
            info.append(f"Capabilities: {', '.join(self.manifest.capabilities)}")

        return '\n'.join(info)