#!/usr/bin/env python3
"""
Migration Helper Script
Helps identify files that need updating and provides migration guidance
Run: python3 migration_helper.py
"""

import os
import re
import subprocess

def find_data_imports():
    """Find all files importing DATA"""
    print("=" * 80)
    print("FILES IMPORTING DATA:")
    print("=" * 80)

    result = subprocess.run(
        ["grep", "-r", "import.*DATA.*from.*data/data", "src/", "--include=*.jsx", "--include=*.tsx", "--include=*.js", "--include=*.ts"],
        capture_output=True,
        text=True
    )

    files = {}
    for line in result.stdout.strip().split('\n'):
        if line:
            filepath = line.split(':')[0]
            if filepath not in files:
                files[filepath] = []
            files[filepath].append(line)

    for filepath in sorted(files.keys()):
        print(f"\n📄 {filepath}")
        for line in files[filepath]:
            print(f"   {line}")

    return files

def find_data_usage():
    """Find all direct DATA usage patterns"""
    print("\n" + "=" * 80)
    print("DIRECT DATA USAGE PATTERNS:")
    print("=" * 80)

    patterns = {
        "numberDetails": r"DATA\.numberDetails",
        "remedies": r"DATA\.remedies",
        "mantras": r"DATA\.mantras",
        "rudrakshaRemedies": r"DATA\.rudrakshaRemedies",
        "yogaDetails": r"DATA\.yogaDetails",
        "colorMap": r"DATA\.colorMap",
        "destinyNumberDetails": r"DATA\.destinyNumberDetails",
        "assetCompatibility": r"DATA\.assetCompatibility",
        "combinationInsights": r"combinationInsights\[",
    }

    for pattern_name, pattern in patterns.items():
        result = subprocess.run(
            ["grep", "-r", pattern, "src/", "--include=*.jsx", "--include=*.tsx", "--include=*.js", "--include=*.ts"],
            capture_output=True,
            text=True
        )

        if result.stdout.strip():
            files = set()
            for line in result.stdout.strip().split('\n'):
                if line:
                    files.add(line.split(':')[0])

            print(f"\n🔍 {pattern_name}: {len(files)} files")
            for filepath in sorted(files):
                if "node_modules" not in filepath and "dist" not in filepath:
                    print(f"   {filepath}")

def analyze_component(filepath):
    """Analyze a single component for required changes"""
    print("\n" + "=" * 80)
    print(f"ANALYZING: {filepath}")
    print("=" * 80)

    if not os.path.exists(filepath):
        print(f"❌ File not found: {filepath}")
        return

    with open(filepath, 'r') as f:
        content = f.read()

    # Check imports
    imports = {
        "DATA": "import.*DATA.*from.*data/data" in content,
        "combinationInsights": "import.*combinationInsights" in content,
        "getText": "getText" in content,
    }

    print("\n📦 Imports:")
    for name, found in imports.items():
        status = "✅" if found else "❌"
        print(f"  {status} {name}")

    # Check DATA usage
    data_patterns = {
        "DATA.numberDetails": r"DATA\.numberDetails",
        "DATA.remedies": r"DATA\.remedies",
        "DATA.mantras": r"DATA\.mantras",
        "DATA.rudrakshaRemedies": r"DATA\.rudrakshaRemedies",
        "DATA.yogaDetails": r"DATA\.yogaDetails",
        "DATA.colorMap": r"DATA\.colorMap",
        "combinationInsights": r"combinationInsights\[",
    }

    print("\n🔍 Direct DATA usage:")
    found_any = False
    for name, pattern in data_patterns.items():
        matches = re.findall(pattern, content)
        if matches:
            found_any = True
            print(f"  ⚠️  {name}: {len(matches)} occurrence(s)")

    if not found_any:
        print("  ✅ No direct DATA usage found (good!)")

    # Get line count
    lines = len(content.split('\n'))
    print(f"\n📊 File size: {lines} lines")

    # Provide recommendations
    print("\n💡 Recommendations:")

    if imports["DATA"]:
        print("  1. Replace: import { DATA } from '../../data/data';")
        print("     With: import { getNumberDetail, getRemedyData, ... } from '../../utils/localData';")

    if "numberDetails" in content:
        print("  2. Replace: DATA.numberDetails[num]")
        print("     With: getNumberDetail(report, num)")

    if "remedies" in content:
        print("  3. Replace: DATA.remedies[num]")
        print("     With: getRemedyData(report, num)")

    if "mantras" in content:
        print("  4. Replace: DATA.mantras[num]")
        print("     With: getMantraData(report, num)")

    if "colorMap" in content:
        print("  5. Replace: DATA.colorMap.destiny")
        print("     With: getNumberColor(report, destinyNumber)")

    if "combinationInsights" in content:
        print("  6. Replace: combinationInsights[key]")
        print("     With: getCombinationInsight(report)")

def main():
    """Main entry point"""
    print("\n🔧 KARMANK DATA MIGRATION HELPER\n")

    print("This script helps identify and analyze files that need migration\n")

    print("1️⃣  FINDING ALL DATA IMPORTS...")
    data_imports = find_data_imports()

    print("\n2️⃣  ANALYZING DATA USAGE PATTERNS...")
    find_data_usage()

    # Get list of unique files
    files_to_update = list(set([filepath for filepath in data_imports.keys()]))

    print("\n" + "=" * 80)
    print(f"SUMMARY: {len(files_to_update)} files need migration")
    print("=" * 80)

    for i, filepath in enumerate(sorted(files_to_update), 1):
        # Determine component type
        if "Remedies" in filepath:
            comp_type = "🔧 REMEDY"
        elif "components/tabs" in filepath:
            comp_type = "📑 TAB"
        elif "dasha" in filepath or "Forecast" in filepath:
            comp_type = "📊 DASHA"
        elif "pages" in filepath:
            comp_type = "📄 PAGE"
        else:
            comp_type = "⚙️  OTHER"

        print(f"{i:2d}. {comp_type:10s} {filepath}")

    # Ask user if they want to analyze specific file
    print("\n" + "=" * 80)
    print("INTERACTIVE ANALYSIS")
    print("=" * 80)
    print("\nEnter file path to analyze (or 'q' to quit):")
    print("Example: src/components/tabs/WelcomeTab.jsx\n")

    while True:
        try:
            filepath = input("File path: ").strip()
            if filepath.lower() == 'q':
                print("\n✅ Migration helper completed!")
                break
            elif filepath:
                analyze_component(filepath)
        except KeyboardInterrupt:
            print("\n\n✅ Migration helper completed!")
            break
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
