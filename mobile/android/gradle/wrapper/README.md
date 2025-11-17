# Gradle wrapper JAR

This repository avoids committing binary artifacts. If `gradle-wrapper.jar` is missing, run the helper script below to download it from the Gradle distribution specified in `gradle-wrapper.properties`:

```bash
cd mobile/android/gradle/wrapper
./download-gradle-wrapper.sh
```

The script downloads the configured Gradle distribution, extracts `gradle-wrapper.jar`, and places it alongside this README so Gradle commands can run normally.
