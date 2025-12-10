pipeline {
    agent any

    tools {
        nodejs 'node20' // Must match the name in Global Tool Configuration
    }

    environment {
        // Define your Nexus details here
        NEXUS_VERSION = 'nexus3'
        NEXUS_PROTOCOL = 'http'
        NEXUS_URL = '172.31.64.132:8081' // REPLACE with your Nexus PRIVATE IP
        NEXUS_REPO = 'ceylotek-builds'
        NEXUS_CREDENTIAL_ID = 'nexus-auth'
        
        // Define artifact details
        ARTIFACT_ID = 'ceylotek-frontend'
        VERSION = "1.0.${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                // Pulls code from the branch triggering the build
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing NPM Dependencies...'
                sh 'npm ci' // Clean install (better for CI than npm install)
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo '🔍 Scanning Code...'
                withSonarQubeEnv('sonar-server') { 
                    // This uses the 'sonar-server' config from Jenkins System
                    sh 'npm install -g sonarqube-scanner'
                    sh 'sonar-scanner'
                }
            }
        }

        stage('Quality Gate') {
            steps {
                echo '🚦 Checking Quality Gate...'
                timeout(time: 10, unit: 'MINUTES') {
                    // Fails the pipeline if SonarQube says "Red"
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build Application') {
            steps {
                echo '🏗️ Building Next.js...'
                // Create dummy env file for build to succeed
                sh 'echo "NEXT_PUBLIC_BACKEND_URL=http://dummy" > .env.local' 
                sh 'npm run build'
            }
        }

        stage('Package Artifact') {
            steps {
                echo '📦 Zipping Artifact...'
                // Zip the necessary folders
                sh "zip -r ${ARTIFACT_ID}-${VERSION}.zip .next public package.json package-lock.json"
            }
        }

        stage('Upload to Nexus') {
            steps {
                echo '🚀 Uploading to Nexus...'
                nexusArtifactUploader(
                    nexusVersion: NEXUS_VERSION,
                    protocol: NEXUS_PROTOCOL,
                    nexusUrl: NEXUS_URL,
                    groupId: 'com.ceylotek',
                    version: VERSION,
                    repository: NEXUS_REPO,
                    credentialsId: NEXUS_CREDENTIAL_ID,
                    artifacts: [
                        [artifactId: ARTIFACT_ID, classifier: '', file: "${ARTIFACT_ID}-${VERSION}.zip", type: 'zip']
                    ]
                )
            }
        }
    }

    post {
        always {
            // Clean up workspace to save disk space
            cleanWs()
        }
        success {
            echo "✅ Build ${VERSION} Successful!"
        }
        failure {
            echo "❌ Build Failed."
        }
    }
}