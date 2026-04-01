pipeline {
    agent any

    environment {
        IMAGE_NAME = 'poc8-nodejs'
    }

    stages {

        stage('Pull Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/YOUR_USERNAME/poc-8-nodejs.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar') {
                    sh '''
                        sonar-scanner \
                        -Dsonar.projectKey=poc-8-nodejs \
                        -Dsonar.sources=. \
                        -Dsonar.exclusions=node_modules/**
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} ."
            }
        }

        stage('Deploy Container') {
            steps {
                sh """
                    docker stop ${IMAGE_NAME} || true
                    docker rm ${IMAGE_NAME} || true
                    docker run -d \
                        --name ${IMAGE_NAME} \
                        -p 3000:3000 \
                        ${IMAGE_NAME}:${BUILD_NUMBER}
                """
            }
        }
    }

    post {
        success {
            echo '✅ POC-8 Complete! App deployed successfully!'
        }
        failure {
            echo '❌ Pipeline failed - check the logs above'
        }
    }
}
