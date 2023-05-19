plugins {
    id("java")
    id("org.jetbrains.intellij") version "1.13.3"
}

group = "com.luomacode"
version = "1.0.7"

repositories {
    mavenCentral()
}

// Configure Gradle IntelliJ Plugin
// Read more: https://plugins.jetbrains.com/docs/intellij/tools-gradle-intellij-plugin.html
intellij {
    version.set("2022.2.4")
//    type.set("IC") // Target IDE Platform

    plugins.set(listOf(/* Plugin Dependencies */))
}

tasks {
    // Set the JVM compatibility versions
    withType<JavaCompile> {
        sourceCompatibility = "8"
        targetCompatibility = "8"
    }

    patchPluginXml {
        sinceBuild.set("203")
        untilBuild.set("231.*")
        changeNotes.set("""
            v1.0.7<br>
            更新插件名称<br>
            v1.0.6<br>
            支持热更<br>
            v1.0.5<br>
            本地化静态资源，提高服务稳定性<br>
            v1.0.4<br>
            支持版本2023.1<br>
            v1.0.3<br>
            增加描述信息<br>
            v1.0.2<br>
            支持更多版本<br>
            v1.0.0<br>
            ChatMoss首发<br>
        """.trimIndent())
    }

//    signPlugin {
//        certificateChain.set(System.getenv("CERTIFICATE_CHAIN"))
//        privateKey.set(System.getenv("PRIVATE_KEY"))
//        password.set(System.getenv("PRIVATE_KEY_PASSWORD"))
//    }
//
//    publishPlugin {
//        token.set(System.getenv("PUBLISH_TOKEN"))
//    }
}
