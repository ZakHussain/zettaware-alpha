"""
Unit tests for manifest parser
"""

import pytest
import tempfile
import yaml
from pathlib import Path
from core.manifest_parser import ManifestParser, RobotManifest

class TestManifestParser:
    """Test cases for ManifestParser class"""

    def test_parse_valid_manifest(self):
        """Test parsing a valid manifest file"""
        # Create temporary manifest file
        manifest_data = {
            'robot': {
                'name': 'Test Robot',
                'type': 'differential_drive',
                'platform': 'jetson_nano'
            },
            'hardware': {
                'motors': {
                    'type': 'dc_motor',
                    'count': 2,
                    'control': 'pwm',
                    'channels': {'left': 1, 'right': 2},
                    'specs': {'max_rpm': 200}
                }
            },
            'capabilities': ['manual_control'],
            'libraries': {
                'provided': [{
                    'name': 'TestLib',
                    'path': 'lib/test.py',
                    'language': 'python'
                }]
            }
        }

        with tempfile.NamedTemporaryFile(mode='w', suffix='.yaml', delete=False) as f:
            yaml.dump(manifest_data, f)
            temp_path = Path(f.name)

        try:
            parser = ManifestParser(temp_path)
            manifest = parser.parse()

            # Verify parsed data
            assert manifest.name == 'Test Robot'
            assert manifest.type == 'differential_drive'
            assert manifest.platform == 'jetson_nano'
            assert manifest.motors.count == 2
            assert manifest.motors.type == 'dc_motor'
            assert 'manual_control' in manifest.capabilities
            assert len(manifest.libraries) == 1
            assert manifest.libraries[0].name == 'TestLib'

        finally:
            temp_path.unlink()

    def test_missing_required_fields(self):
        """Test error handling for missing required fields"""
        manifest_data = {
            'robot': {
                'name': 'Test Robot'
                # Missing 'type' and 'platform'
            }
            # Missing 'hardware'
        }

        with tempfile.NamedTemporaryFile(mode='w', suffix='.yaml', delete=False) as f:
            yaml.dump(manifest_data, f)
            temp_path = Path(f.name)

        try:
            parser = ManifestParser(temp_path)
            with pytest.raises(ValueError, match="Manifest validation failed"):
                parser.parse()

        finally:
            temp_path.unlink()

    def test_invalid_robot_type(self):
        """Test warning for invalid robot type"""
        manifest_data = {
            'robot': {
                'name': 'Test Robot',
                'type': 'invalid_type',
                'platform': 'jetson_nano'
            },
            'hardware': {}
        }

        with tempfile.NamedTemporaryFile(mode='w', suffix='.yaml', delete=False) as f:
            yaml.dump(manifest_data, f)
            temp_path = Path(f.name)

        try:
            parser = ManifestParser(temp_path)
            manifest = parser.parse()
            assert len(parser.warnings) > 0
            assert 'Unknown robot type' in parser.warnings[0]

        finally:
            temp_path.unlink()

    def test_nonexistent_file(self):
        """Test error handling for nonexistent files"""
        with pytest.raises(FileNotFoundError):
            ManifestParser('/nonexistent/path/robot.yaml')

    def test_invalid_yaml(self):
        """Test error handling for invalid YAML"""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.yaml', delete=False) as f:
            f.write("invalid: yaml: content: [unclosed")
            temp_path = Path(f.name)

        try:
            parser = ManifestParser(temp_path)
            with pytest.raises(ValueError, match="Manifest validation failed"):
                parser.parse()

        finally:
            temp_path.unlink()

    def test_get_info(self):
        """Test manifest info generation"""
        manifest_data = {
            'robot': {
                'name': 'Test Robot',
                'type': 'differential_drive',
                'platform': 'jetson_nano'
            },
            'hardware': {
                'motors': {
                    'type': 'dc_motor',
                    'count': 2,
                    'control': 'pwm',
                    'channels': {'left': 1, 'right': 2}
                },
                'sensors': {
                    'ultrasonic': {
                        'type': 'hc_sr04'
                    }
                }
            },
            'capabilities': ['manual_control', 'navigation']
        }

        with tempfile.NamedTemporaryFile(mode='w', suffix='.yaml', delete=False) as f:
            yaml.dump(manifest_data, f)
            temp_path = Path(f.name)

        try:
            parser = ManifestParser(temp_path)
            manifest = parser.parse()
            info = parser.get_info()

            assert 'Test Robot' in info
            assert 'differential_drive' in info
            assert 'jetson_nano' in info
            assert '2x dc_motor' in info
            assert 'ultrasonic' in info
            assert 'manual_control, navigation' in info

        finally:
            temp_path.unlink()

if __name__ == "__main__":
    # Simple test runner for development
    test = TestManifestParser()

    print("Running manifest parser tests...")

    try:
        test.test_parse_valid_manifest()
        print("✓ test_parse_valid_manifest passed")
    except Exception as e:
        print(f"✗ test_parse_valid_manifest failed: {e}")

    try:
        test.test_get_info()
        print("✓ test_get_info passed")
    except Exception as e:
        print(f"✗ test_get_info failed: {e}")

    try:
        test.test_nonexistent_file()
        print("✓ test_nonexistent_file passed")
    except Exception as e:
        print(f"✗ test_nonexistent_file failed: {e}")

    print("Basic tests completed!")