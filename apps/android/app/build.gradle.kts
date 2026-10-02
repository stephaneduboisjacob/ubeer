import java.util.Properties

plugins {
    alias(libs.plugins.android.application)
}

android {
    namespace = "com.ubeer.app"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.ubeer.app"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }

    val signingPropertiesFile = rootProject.file("signing.properties")
    if (signingPropertiesFile.exists()) {
        val signingProperties = Properties().apply {
            signingPropertiesFile.inputStream().use { load(it) }
        }
        signingConfigs.create("release") {
            storeFile = file(signingProperties.getProperty("storeFile"))
            storePassword = signingProperties.getProperty("storePassword")
            keyAlias = signingProperties.getProperty("keyAlias")
            keyPassword = signingProperties.getProperty("keyPassword")
        }
        buildTypes.getByName("release") {
            signingConfig = signingConfigs.getByName("release")
            isMinifyEnabled = false
        }
    }
}
