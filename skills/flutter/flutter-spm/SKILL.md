---
name: flutter-spm
description: Guide for integrating, configuring, and caching dependencies using Swift Package Manager (SPM) in Flutter iOS/macOS applications.
metadata:
    platforms: "flutter, ios, macOS"
    languages: "swift, dart"
    category: "platform"
---

# Swift Package Manager (SPM) in Flutter

*Introduced in Flutter 3.44*

Swift Package Manager is the default dependency manager for iOS and macOS applications in Flutter, replacing CocoaPods. This modern integration improves compilation speeds and simplifies native package dependency trees.

## Contents
- [Project Configuration](#project-configuration)
- [Managing Dependencies](#managing-dependencies)
- [CI/CD Caching Strategies](#cicd-caching-strategies)
- [Troubleshooting & Conflict Resolution](#troubleshooting--conflict-resolution)

---

## Project Configuration

In Flutter 3.44+, newly generated iOS and macOS platforms are configured to use SPM out of the box.

### Key Changes
- **No `Podfile` or `Podfile.lock`**: The iOS directory no longer requires CocoaPods.
- **Xcode Workspace Integration**: Native dependencies are managed directly via Xcode's Package Dependencies.
- **Flutter Plugins**: Plugins with native Swift code declare their SPM configurations inside their `pubspec.yaml` or `Package.swift` files, which Flutter automatically integrates into the runner target.

---

## Managing Dependencies

### Adding a Swift Package
To add a native package directly to the iOS Runner:
1. Open `ios/Runner.xcworkspace` in Xcode.
2. Select **File > Add Package Dependencies...**
3. Enter the package URL (e.g., `https://github.com/Alamofire/Alamofire`) and select target version.
4. Link the package to the `Runner` target.

### For Plugin Authors
To define an SPM dependency for a Flutter plugin, use the `swift_packages` field in `pubspec.yaml`:
```yaml
flutter:
  plugin:
    platforms:
      ios:
        pluginClass: MyPlugin
        swift_packages:
          - name: Alamofire
            url: https://github.com/Alamofire/Alamofire.git
            version: 5.9.0
```

---

## CI/CD Caching Strategies

SPM dependencies are stored outside the project workspace. To optimize CI build times (e.g., in GitHub Actions), cache the following directories:

- **SPM Cache Directory**: `~/Library/Caches/org.swift.swiftpm`
- **Xcode DerivedData**: `~/Library/Developer/Xcode/DerivedData`

### GitHub Actions Caching Example
```yaml
- name: Cache Swift Package Manager Dependencies
  uses: actions/cache@v4
  with:
    path: |
      ~/Library/Caches/org.swift.swiftpm
      ~/Library/Developer/Xcode/DerivedData
    key: ${{ runner.os }}-spm-${{ hashFiles('**/pubspec.yaml', 'ios/Runner.xcodeproj/project.pbxproj') }}
    restore-keys: |
      ${{ runner.os }}-spm-
```

---

## Troubleshooting & Conflict Resolution

### Package Resolution Failure
If SPM dependencies fail to resolve during CLI builds:
```bash
# 1. Clean the project
flutter clean

# 2. Resolve package dependencies manually via Xcode CLI
xcodebuild -resolvePackageDependencies -workspace ios/Runner.xcworkspace -scheme Runner
```

### Version Conflicts
If multiple plugins request incompatible versions of the same Swift Package:
1. Open the project in Xcode.
2. Navigate to **Runner > Package Dependencies**.
3. Manually override the package dependency rule to enforce a unified, compatible version.
