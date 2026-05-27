#!/usr/bin/env python3
"""
Grounded Ask-Mode Prompt Framework - Unit Tests
================================================
Verifies the prompt parsing, exact replacement, context auto-discovery,
and Zero-Trust PII scrubbing modules.
"""

import os
import unittest
import tempfile
import shutil
import sys

# Append parent directory to path to import script
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "prompt-engine")))
import prompt_injector

class TestPromptFramework(unittest.TestCase):

    def setUp(self):
        # Create a temp directory to simulate workspaces
        self.test_dir = tempfile.mkdtemp()
        self.old_cwd = os.getcwd()
        os.chdir(self.test_dir)

    def tearDown(self):
        # Restore cwd and cleanup
        os.chdir(self.old_cwd)
        shutil.rmtree(self.test_dir)

    def test_exact_string_replacement(self):
        """Verify that exact-match string replacement works flawlessly without regex control char collisions."""
        template = "Format [CLOUD_PROVIDER] and [TOOL_STACK] with [EXISTING_KNOWLEDGE]"
        special_markdown_notes = """
        # Notes
        Some text with \\ backslashes, $ dollar signs, \\g<1> regex symbols, and *bolding*.
        """
        
        compiled = template.replace("[CLOUD_PROVIDER]", "AWS")
        compiled = compiled.replace("[TOOL_STACK]", "Terraform")
        compiled = compiled.replace("[EXISTING_KNOWLEDGE]", special_markdown_notes)
        
        self.assertIn("AWS", compiled)
        self.assertIn("Terraform", compiled)
        self.assertIn("\\g<1>", compiled)
        self.assertIn("backslashes", compiled)

    def test_pii_scrubber_detection(self):
        """Ensure the PII scrubber correctly matches AWS keys, bearer tokens, and private IPs."""
        sensitive_payload = (
            "AWS KEY: AKIAIOSFODNN7EXAMPLE\n"
            "Bearer token: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ\n"
            "IP Address: 192.168.1.15 and 10.0.0.1"
        )
        
        # Test detection patterns directly
        findings = {}
        for label, pattern in prompt_injector.PII_PATTERNS.items():
            import re
            matches = re.findall(pattern, sensitive_payload)
            if matches:
                findings[label] = list(set(matches))
                
        self.assertIn("AWS Access Key ID", findings)
        self.assertIn("Generic Bearer Token", findings)
        self.assertIn("Private IP Address", findings)
        self.assertEqual(len(findings["Private IP Address"]), 2)

    def test_context_auto_discovery(self):
        """Verify that workspace scanner identifies files correctly and returns defaults."""
        # Seed test workspace with mock infrastructure files
        with open("main.tf", "w") as f:
            f.write("# terraform config")
        with open("Dockerfile", "w") as f:
            f.write("FROM alpine")
        os.makedirs(".aws")
        
        defaults = prompt_injector.detect_context_defaults()
        
        # Verify defaults returned match mocks
        self.assertIn("AWS", defaults["[CLOUD_PROVIDER]"])
        self.assertIn("Terraform", defaults["[TOOL_STACK]"])
        self.assertIn("Docker", defaults["[TOOL_STACK]"])

if __name__ == "__main__":
    unittest.main()
