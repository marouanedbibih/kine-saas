
BACKEND_DIR=backend
WEB_DIR=web
BACKEND_PORT=3001
WEB_PORT=3000

DOCKER_FOLDER=docker
DOCKER_COMPOSE_FILE=$DOCKER_FOLDER/compose.yml
DOCKER_COMPOSE_FILE_DEV=$DOCKER_FOLDER/compose.dev.yml
DOCKER_COMPOSE_FILE_TEST=$DOCKER_FOLDER/compose.test.yml
DOCKER_COMPOSE_FILE_PROD=$DOCKER_FOLDER/compose.prod.yml


run_backend() {
    echo "Starting backend server..."
    cd $BACKEND_DIR
    npm start
}

run_web() {
    echo "Starting web server..."
    cd $WEB_DIR
    pnpm run dev
}

run_docker_dev() {
    docker compose --env-file docker/.env.dev -f docker/compose.yml -f docker/compose.dev.yml up --build
}

# run_db &
# run_backend &
# run_web &

run_docker_dev &

wait
# Wait for both processes to finish
# This script starts both the backend and web servers in parallel.