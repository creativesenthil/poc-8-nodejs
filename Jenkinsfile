pipeline {
    agent any

    environment {
        IMAGE_NAME = 'poc8-nodejs'
        DOCKERHUB_USER = 'senthilkumarsoundararajan'
    }

    stages {

        stage('Pull Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/creativesenthil/poc-8-nodejs.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar') {
                    script {
                        def scannerHome = tool 'sonar-scanner'
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=poc-8-nodejs \
                            -Dsonar.sources=. \
                            -Dsonar.exclusions=node_modules/**
                        """
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${DOCKERHUB_USER}/${IMAGE_NAME}:${BUILD_NUMBER} ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push ${DOCKERHUB_USER}/${IMAGE_NAME}:${BUILD_NUMBER}
                    """
                }
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
                        ${DOCKERHUB_USER}/${IMAGE_NAME}:${BUILD_NUMBER}
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
